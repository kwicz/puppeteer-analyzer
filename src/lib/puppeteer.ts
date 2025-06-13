import puppeteer from 'puppeteer';
import { HeatmapData } from '@/types/analysis';

export async function generateHeatmap(url: string): Promise<HeatmapData> {
  let browser;
  let page;
  try {
    // Launch browser
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });

    // Navigate to the URL
    await page.goto(url, {
      waitUntil: 'networkidle0',
      timeout: 30000, // 30 seconds timeout
    });

    // Take a screenshot
    const screenshot = await page.screenshot({
      encoding: 'base64',
      fullPage: true,
    });

    // Generate heatmap points and create composite heatmap image
    const heatmapData = await page.evaluate(() => {
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      const points: Array<{ x: number; y: number; value: number }> = [];

      // Function to calculate attention value based on element type and position
      const calculateAttentionValue = (element: Element, rect: DOMRect) => {
        let value = 0.1; // Base value

        // Element type importance
        const tagName = element.tagName.toLowerCase();
        switch (tagName) {
          case 'h1':
            value += 0.8;
            break;
          case 'h2':
            value += 0.6;
            break;
          case 'h3':
          case 'h4':
            value += 0.4;
            break;
          case 'button':
          case 'a':
            value += 0.7;
            break;
          case 'img':
            value += 0.5;
            break;
          case 'input':
          case 'textarea':
            value += 0.6;
            break;
          case 'nav':
            value += 0.5;
            break;
          case 'form':
            value += 0.4;
            break;
          default:
            value += 0.1;
        }

        // Consider aria-label and alt attributes for additional scoring
        if (element.hasAttribute('aria-label') || element.hasAttribute('alt')) {
          value += 0.2;
        }

        // Position-based attention (F-pattern and Z-pattern)
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Higher attention for top-left quadrant (F-pattern)
        if (centerX < viewportWidth * 0.5 && centerY < viewportHeight * 0.3) {
          value += 0.3;
        }

        // Moderate attention for top-right (Z-pattern)
        if (centerX > viewportWidth * 0.5 && centerY < viewportHeight * 0.2) {
          value += 0.2;
        }

        // Center attention area
        if (
          centerX > viewportWidth * 0.2 &&
          centerX < viewportWidth * 0.8 &&
          centerY > viewportHeight * 0.2 &&
          centerY < viewportHeight * 0.6
        ) {
          value += 0.2;
        }

        // Size importance (larger elements get more attention)
        const area = rect.width * rect.height;
        const viewportArea = viewportWidth * viewportHeight;
        const sizeRatio = area / viewportArea;
        if (sizeRatio > 0.01) value += 0.2;
        if (sizeRatio > 0.05) value += 0.2;

        // Visibility check
        if (rect.width < 10 || rect.height < 10) value *= 0.1;
        if (centerY > viewportHeight) value *= 0.3; // Below fold

        return Math.min(value, 1.0); // Cap at 1.0
      };

      // Get important elements
      const selectors = [
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'button',
        'a[href]',
        'img',
        'input',
        'textarea',
        'nav',
        'header',
        'main',
        'section',
        'article',
        '[role="button"]',
        '[onclick]',
        '.btn',
        '.button',
        '.logo',
        '.menu',
        '.navigation',
        '.cta',
        '.call-to-action',
      ];

      selectors.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element) => {
          const rect = element.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) {
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            // Only include elements in reasonable viewport area
            if (
              centerX >= 0 &&
              centerX <= viewportWidth &&
              centerY >= 0 &&
              centerY <= document.documentElement.scrollHeight
            ) {
              const value = calculateAttentionValue(element, rect);
              if (value > 0.2) {
                // Only include significant attention points
                points.push({
                  x: centerX,
                  y: centerY,
                  value: value,
                });
              }
            }
          }
        });
      });

      // Add some general attention areas based on common patterns
      // Top navigation area
      points.push({
        x: viewportWidth * 0.5,
        y: viewportHeight * 0.1,
        value: 0.6,
      });

      // Logo area (top-left)
      points.push({
        x: viewportWidth * 0.15,
        y: viewportHeight * 0.1,
        value: 0.7,
      });

      // Center content area
      points.push({
        x: viewportWidth * 0.5,
        y: viewportHeight * 0.4,
        value: 0.5,
      });

      // Remove duplicate points that are too close to each other
      const filteredPoints = points
        .filter((point, index, self) => {
          return !self
            .slice(0, index)
            .some(
              (p) =>
                Math.abs(p.x - point.x) < 50 && Math.abs(p.y - point.y) < 50
            );
        })
        .slice(0, 50); // Limit to 50 points for performance

      return {
        heatmapPoints: filteredPoints.map((p) => ({
          x: p.x / viewportWidth,
          y:
            p.y /
            Math.max(
              document.documentElement.scrollHeight,
              document.body.scrollHeight,
              viewportHeight
            ),
          value: p.value,
        })),
        rawPoints: filteredPoints,
        pageHeight: Math.max(
          document.documentElement.scrollHeight,
          document.body.scrollHeight,
          viewportHeight
        ),
      };
    });

    // Create composite heatmap image by injecting styles and taking another screenshot
    await page.evaluate(
      (points: Array<{ x: number; y: number; value: number }>) => {
        // Create a style element for the heatmap overlay
        const style = document.createElement('style');
        style.id = 'heatmap-overlay-styles';

        let css = `
        .heatmap-point {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          z-index: 999999;
          mix-blend-mode: multiply;
          transition: all 0.3s ease;
        }
      `;

        // Add individual point styles
        points.forEach((point, index) => {
          const intensity = Math.max(0.1, Math.min(1.0, point.value));
          const radius = 60 + intensity * 40;

          let color;
          if (intensity > 0.7) {
            color = `radial-gradient(circle, rgba(255, 0, 0, ${
              intensity * 0.4
            }) 0%, rgba(255, 100, 0, ${
              intensity * 0.2
            }) 50%, rgba(255, 200, 0, 0) 100%)`;
          } else if (intensity > 0.4) {
            color = `radial-gradient(circle, rgba(255, 150, 0, ${
              intensity * 0.3
            }) 0%, rgba(255, 200, 0, ${
              intensity * 0.15
            }) 50%, rgba(255, 255, 0, 0) 100%)`;
          } else {
            color = `radial-gradient(circle, rgba(0, 150, 255, ${
              intensity * 0.25
            }) 0%, rgba(0, 200, 150, ${
              intensity * 0.1
            }) 50%, rgba(0, 255, 100, 0) 100%)`;
          }

          css += `
          .heatmap-point-${index} {
            left: ${point.x - radius}px;
            top: ${point.y - radius}px;
            width: ${radius * 2}px;
            height: ${radius * 2}px;
            background: ${color};
          }
        `;
        });

        style.textContent = css;
        document.head.appendChild(style);

        // Create heatmap point elements
        points.forEach((point, index) => {
          const div = document.createElement('div');
          div.className = `heatmap-point heatmap-point-${index}`;
          document.body.appendChild(div);
        });
      },
      heatmapData.rawPoints
    );

    // Take a screenshot with the heatmap overlay
    const heatmapScreenshot = await page.screenshot({
      encoding: 'base64',
      fullPage: true,
    });

    // Clean up the heatmap overlay
    await page.evaluate(() => {
      // Remove heatmap styles and elements
      const style = document.getElementById('heatmap-overlay-styles');
      if (style) style.remove();

      const heatmapPoints = document.querySelectorAll('.heatmap-point');
      heatmapPoints.forEach((point) => point.remove());
    });

    return {
      screenshot: `data:image/png;base64,${screenshot}`,
      heatmapImage: `data:image/png;base64,${heatmapScreenshot}`,
      heatmapPoints: heatmapData.heatmapPoints,
    };
  } catch (error) {
    console.error('Heatmap generation error:', error);
    // Return default values if heatmap generation fails
    return {
      screenshot: '', // Placeholder, will be set in finally block
      heatmapImage: '',
      heatmapPoints: [],
    };
  } finally {
    if (browser) {
      let finalScreenshot = '';
      if (page) {
        finalScreenshot = await page.screenshot({
          encoding: 'base64',
          fullPage: true,
        });
      }
      await browser.close();
      return {
        screenshot: `data:image/png;base64,${finalScreenshot}`,
        heatmapImage: '',
        heatmapPoints: [],
      };
    }
  }
}
