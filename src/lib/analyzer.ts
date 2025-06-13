import puppeteer, { Page } from 'puppeteer';
import {
  ContentAnalysis,
  SeoAnalysis,
  TechnicalAnalysis,
} from '@/types/analysis';

declare global {
  interface Window {
    angular?: unknown;
    React?: unknown;
    Vue?: unknown;
    jQuery?: unknown;
  }
}

export async function analyzeUrl(url: string) {
  let browser;
  try {
    // Launch browser
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });

    // Set a timeout for navigation
    const navigationPromise = page.goto(url, {
      waitUntil: 'networkidle0',
      timeout: 30000, // 30 seconds timeout
    });

    // Navigate to the URL
    const startTime = Date.now();
    await navigationPromise;
    const loadTime = Date.now() - startTime;

    // Run all analyses in parallel
    const [contentAnalysis, seoAnalysis, technicalAnalysis] = await Promise.all(
      [analyzeContent(page), analyzeSEO(page), analyzeTechnical(page, loadTime)]
    );

    return {
      content: contentAnalysis,
      seo: seoAnalysis,
      technical: technicalAnalysis,
    };
  } catch (error) {
    console.error('Analysis error:', error);
    if (error instanceof Error) {
      if (error.message.includes('net::ERR_CONNECTION_REFUSED')) {
        throw new Error(
          'Could not connect to the website. Please check if the URL is correct and the website is accessible.'
        );
      }
      if (error.message.includes('net::ERR_NAME_NOT_RESOLVED')) {
        throw new Error(
          'Could not resolve the website domain. Please check if the URL is correct.'
        );
      }
      if (error.message.includes('timeout')) {
        throw new Error(
          'The website took too long to respond. Please try again later.'
        );
      }
    }
    throw new Error('Failed to analyze the website. Please try again later.');
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

async function analyzeContent(page: Page): Promise<ContentAnalysis> {
  return page.evaluate(() => {
    const headings = {
      h1: document.querySelectorAll('h1').length,
      h2: document.querySelectorAll('h2').length,
      h3: document.querySelectorAll('h3').length,
      h4: document.querySelectorAll('h4').length,
      h5: document.querySelectorAll('h5').length,
      h6: document.querySelectorAll('h6').length,
    };

    const images = document.querySelectorAll('img');
    const imagesWithAlt = Array.from(images).filter((img) =>
      img.hasAttribute('alt')
    ).length;

    const links = document.querySelectorAll('a');
    const baseUrl = window.location.origin;
    const internalLinks = Array.from(links).filter(
      (link) => link.href.startsWith(baseUrl) || link.href.startsWith('/')
    ).length;

    return {
      wordCount: document.body.innerText.split(/\s+/).length,
      headings,
      images: {
        total: images.length,
        withAlt: imagesWithAlt,
        withoutAlt: images.length - imagesWithAlt,
      },
      links: {
        total: links.length,
        internal: internalLinks,
        external: links.length - internalLinks,
      },
    };
  });
}

async function analyzeSEO(page: Page): Promise<SeoAnalysis> {
  return page.evaluate(() => {
    const title = document.title;
    const metaDescription =
      document
        .querySelector('meta[name="description"]')
        ?.getAttribute('content') || null;
    console.log('Meta description:', metaDescription);
    const h1s = document.querySelectorAll('h1');
    console.log('H1s:', h1s);
    const images = document.querySelectorAll('img');
    console.log('Images:', images);
    const imagesWithAlt = Array.from(images).filter((img) =>
      img.hasAttribute('alt')
    ).length;
    console.log('Images with alt:', imagesWithAlt);
    const links = document.querySelectorAll('a');
    console.log('Links:', links);
    const baseUrl = window.location.origin;
    console.log('Base URL:', baseUrl);
    const internalLinks = Array.from(links).filter(
      (link) => link.href.startsWith(baseUrl) || link.href.startsWith('/')
    ).length;
    console.log('Internal links:', internalLinks);
    return {
      title: {
        present: !!title,
        length: title?.length || 0,
        value: title || null,
      },
      metaDescription: {
        present: !!metaDescription,
        length: metaDescription?.length || 0,
        value: metaDescription,
      },
      headings: {
        hasH1: h1s.length > 0,
        h1Count: h1s.length,
        headingStructure: h1s.length === 1,
      },
      images: {
        altTextCoverage: images.length
          ? (imagesWithAlt / images.length) * 100
          : 0,
      },
      links: {
        internalLinkCount: internalLinks,
        externalLinkCount: links.length - internalLinks,
      },
    };
  });
}

async function analyzeTechnical(
  page: Page,
  loadTime: number
): Promise<TechnicalAnalysis> {
  const technologies = await detectTechnologies(page);
  const accessibility = await checkAccessibility(page);
  const security = await checkSecurity(page);

  return {
    technologies,
    performance: {
      loadTime,
      resourceCount: await countResources(page),
    },
    accessibility,
    security,
  };
}

async function detectTechnologies(page: Page): Promise<string[]> {
  return page.evaluate(() => {
    const technologies: string[] = [];

    // Check for common frameworks
    if (window.angular) technologies.push('Angular');
    if (window.React) technologies.push('React');
    if (window.Vue) technologies.push('Vue');
    if (window.jQuery) technologies.push('jQuery');

    // Check for common libraries
    if (document.querySelector('script[src*="bootstrap"]'))
      technologies.push('Bootstrap');
    if (document.querySelector('script[src*="tailwind"]'))
      technologies.push('Tailwind CSS');

    return technologies;
  });
}

async function checkAccessibility(page: Page) {
  return page.evaluate(() => {
    const issues: string[] = [];

    // Check for alt text on images
    document.querySelectorAll('img:not([alt])').forEach(() => {
      issues.push('Image missing alt text');
    });

    // Check for proper heading structure
    const h1s = document.querySelectorAll('h1');
    if (h1s.length === 0) issues.push('No H1 heading found');
    if (h1s.length > 1) issues.push('Multiple H1 headings found');

    // Check for proper ARIA labels
    document.querySelectorAll('[role]').forEach((el) => {
      if (!el.hasAttribute('aria-label')) {
        issues.push(
          `Element with role="${el.getAttribute('role')}" missing aria-label`
        );
      }
    });

    return {
      score: 100 - issues.length * 10,
      issues,
    };
  });
}

async function checkSecurity(page: Page) {
  return page.evaluate(() => {
    const securityHeaders: string[] = [];
    const hasSSL = window.location.protocol === 'https:';

    // Check for security headers
    const headers = document.querySelectorAll('meta[http-equiv]');
    headers.forEach((header) => {
      const content = header.getAttribute('content');
      if (content?.includes('X-Frame-Options')) {
        securityHeaders.push('X-Frame-Options');
      }
      if (content?.includes('Content-Security-Policy')) {
        securityHeaders.push('Content-Security-Policy');
      }
      if (content?.includes('X-Content-Type-Options')) {
        securityHeaders.push('X-Content-Type-Options');
      }
    });

    return {
      hasSSL,
      securityHeaders,
    };
  });
}

async function countResources(page: Page): Promise<number> {
  return page.evaluate(() => {
    const resources = [
      ...document.querySelectorAll('img'),
      ...document.querySelectorAll('script'),
      ...document.querySelectorAll('link[rel="stylesheet"]'),
      ...document.querySelectorAll('video'),
      ...document.querySelectorAll('audio'),
    ];
    return resources.length;
  });
}
