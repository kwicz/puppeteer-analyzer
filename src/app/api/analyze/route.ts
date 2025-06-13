import { NextResponse } from 'next/server';
import { z } from 'zod';
import { analyzeUrl } from '@/lib/analyzer';
import { generateHeatmap } from '@/lib/puppeteer';

// Input validation schema
const analyzeRequestSchema = z.object({
  url: z.string().url(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url } = analyzeRequestSchema.parse(body);

    console.log('Received URL for analysis:', url);

    // Run analysis and generate screenshot in parallel
    const [analysis, heatmapData] = await Promise.all([
      analyzeUrl(url),
      generateHeatmap(url),
    ]);

    // Log the raw analysis data for debugging
    console.log('Raw analysis data:', JSON.stringify(analysis, null, 2));
    console.log('Screenshot captured:', heatmapData.screenshot ? 'Yes' : 'No');

    const title = analysis.seo.title.value || 'No title found';
    const loadTime = analysis.technical.performance.loadTime;
    const pageSize = analysis.technical.performance.resourceCount;
    const technologies = analysis.technical.technologies;

    // Generate SEO insights
    const generateSEOInsights = (seoData: typeof analysis.seo) => {
      const insights = [];

      // Title analysis
      if (seoData.title.present) {
        if (seoData.title.length >= 30 && seoData.title.length <= 60) {
          insights.push({
            title: 'Title Tag Optimization',
            status: 'good' as const,
            description: 'Title length is optimal',
            details: `Title is ${seoData.title.length} characters long, which is within the recommended range.`,
            recommendations: [
              'Keep the title descriptive and relevant to the page content',
            ],
          });
        } else if (seoData.title.length < 30) {
          insights.push({
            title: 'Title Tag Optimization',
            status: 'warning' as const,
            description: 'Title is too short',
            details: `Title is only ${seoData.title.length} characters long. Recommended length is 30-60 characters.`,
            recommendations: [
              'Expand the title to be more descriptive',
              'Include relevant keywords',
            ],
          });
        } else {
          insights.push({
            title: 'Title Tag Optimization',
            status: 'warning' as const,
            description: 'Title is too long',
            details: `Title is ${seoData.title.length} characters long. It may be truncated in search results.`,
            recommendations: [
              'Shorten the title to 60 characters or less',
              'Keep the most important keywords at the beginning',
            ],
          });
        }
      } else {
        insights.push({
          title: 'Title Tag Optimization',
          status: 'error' as const,
          description: 'Missing title tag',
          details:
            'The page does not have a title tag, which is crucial for SEO.',
          recommendations: [
            'Add a descriptive title tag',
            'Include relevant keywords',
            'Keep it between 30-60 characters',
          ],
        });
      }

      // Meta description analysis
      if (seoData.metaDescription.present) {
        if (
          seoData.metaDescription.length >= 120 &&
          seoData.metaDescription.length <= 160
        ) {
          insights.push({
            title: 'Meta Description Optimization',
            status: 'good' as const,
            description: 'Meta description length is optimal',
            details: `Meta description is ${seoData.metaDescription.length} characters long, which is within the recommended range.`,
            recommendations: [
              'Ensure the description accurately summarizes the page content',
            ],
          });
        } else if (seoData.metaDescription.length < 120) {
          insights.push({
            title: 'Meta Description Optimization',
            status: 'warning' as const,
            description: 'Meta description is too short',
            details: `Meta description is only ${seoData.metaDescription.length} characters long. Recommended length is 120-160 characters.`,
            recommendations: [
              'Expand the description to be more informative',
              'Include relevant keywords and call-to-action',
            ],
          });
        } else {
          insights.push({
            title: 'Meta Description Optimization',
            status: 'warning' as const,
            description: 'Meta description is too long',
            details: `Meta description is ${seoData.metaDescription.length} characters long. It may be truncated in search results.`,
            recommendations: [
              'Shorten the description to 160 characters or less',
              'Keep the most important information at the beginning',
            ],
          });
        }
      } else {
        insights.push({
          title: 'Meta Description Optimization',
          status: 'error' as const,
          description: 'Missing meta description',
          details:
            'The page does not have a meta description, which helps search engines understand the page content.',
          recommendations: [
            'Add a compelling meta description',
            'Include relevant keywords',
            'Keep it between 120-160 characters',
          ],
        });
      }

      // Heading structure analysis
      if (seoData.headings.hasH1) {
        if (seoData.headings.headingStructure) {
          insights.push({
            title: 'Heading Structure',
            status: 'good' as const,
            description: 'Proper heading structure detected',
            details:
              'The page has exactly one H1 tag, which is the recommended structure.',
            recommendations: [
              'Ensure H1 contains the main keyword for the page',
            ],
          });
        } else {
          insights.push({
            title: 'Heading Structure',
            status: 'warning' as const,
            description: 'Multiple H1 tags detected',
            details: `The page has ${seoData.headings.h1Count} H1 tags. It's recommended to have only one H1 per page.`,
            recommendations: [
              'Use only one H1 tag per page',
              'Use H2-H6 for subheadings',
              'Ensure proper heading hierarchy',
            ],
          });
        }
      } else {
        insights.push({
          title: 'Heading Structure',
          status: 'error' as const,
          description: 'Missing H1 tag',
          details:
            'The page does not have an H1 tag, which is important for SEO and accessibility.',
          recommendations: [
            'Add an H1 tag with the main page topic',
            'Include relevant keywords in the H1',
            'Use H2-H6 for subheadings',
          ],
        });
      }

      // Image alt text analysis
      if (seoData.images.altTextCoverage >= 90) {
        insights.push({
          title: 'Image Alt Text',
          status: 'good' as const,
          description: 'Excellent alt text coverage',
          details: `${seoData.images.altTextCoverage.toFixed(
            1
          )}% of images have alt text.`,
          recommendations: [
            'Continue providing descriptive alt text for all images',
          ],
        });
      } else if (seoData.images.altTextCoverage >= 70) {
        insights.push({
          title: 'Image Alt Text',
          status: 'warning' as const,
          description: 'Good alt text coverage',
          details: `${seoData.images.altTextCoverage.toFixed(
            1
          )}% of images have alt text. Aim for 100% coverage.`,
          recommendations: [
            'Add alt text to remaining images',
            'Make alt text descriptive and relevant',
          ],
        });
      } else {
        insights.push({
          title: 'Image Alt Text',
          status: 'error' as const,
          description: 'Poor alt text coverage',
          details: `Only ${seoData.images.altTextCoverage.toFixed(
            1
          )}% of images have alt text.`,
          recommendations: [
            'Add descriptive alt text to all images',
            'Include relevant keywords where appropriate',
            'Improve accessibility for screen readers',
          ],
        });
      }

      return insights;
    };

    const seoInsights = generateSEOInsights(analysis.seo);

    // Calculate a more comprehensive SEO score
    let seoScore = 0;
    if (analysis.seo.title.present) seoScore += 25;
    if (analysis.seo.metaDescription.present) seoScore += 25;
    if (analysis.seo.headings.hasH1) seoScore += 20;
    if (analysis.seo.headings.headingStructure) seoScore += 15;
    if (analysis.seo.images.altTextCoverage > 80) seoScore += 15;

    console.log('Extracted title:', title);
    console.log('Technical analysis:', {
      loadTime,
      pageSize,
      technologies: technologies.length,
    });
    console.log('Content analysis:', {
      wordCount: analysis.content.wordCount,
      headings: analysis.content.headings,
      images: analysis.content.images,
      links: analysis.content.links,
    });
    console.log('SEO analysis:', {
      title: analysis.seo.title.present,
      metaDescription: analysis.seo.metaDescription.present,
      hasH1: analysis.seo.headings.hasH1,
      headingStructure: analysis.seo.headings.headingStructure,
      altTextCoverage: analysis.seo.images.altTextCoverage,
      score: seoScore,
    });

    // Return the URL with extracted title, technical analysis, content analysis, and SEO analysis
    const response = {
      id: 'mock-id',
      url,
      title,
      screenshotUrl: heatmapData.screenshot,
      heatmapUrl: null,
      seoScore: seoScore,
      loadTime: loadTime,
      pageSize: pageSize,
      technologies: technologies,
      insights: JSON.parse(
        JSON.stringify({
          content: {
            title: title,
            metaDescription: analysis.seo.metaDescription.value,
            headings: Object.entries(analysis.content.headings)
              .filter(([, count]) => count > 0)
              .flatMap(([level, count]) =>
                Array.from({ length: count }, (_, i) => ({
                  level: parseInt(level.replace('h', '')),
                  text: `${level.toUpperCase()} Heading ${i + 1}`,
                }))
              ),
            metrics: {
              wordCount: analysis.content.wordCount,
              paragraphCount: undefined,
              imageCount: analysis.content.images.total,
              linkCount: {
                internal: analysis.content.links.internal,
                external: analysis.content.links.external,
                total: analysis.content.links.total,
              },
              readingTime: Math.ceil(analysis.content.wordCount / 200), // Estimate 200 words per minute
            },
          },
          seo: {
            score: seoScore,
            insights: seoInsights,
          },
          technical: analysis.technical,
        })
      ),
      contentAnalysis: JSON.parse(JSON.stringify(analysis.content)),
      seoAnalysis: JSON.parse(JSON.stringify(analysis.seo)),
      technicalAnalysis: JSON.parse(JSON.stringify(analysis.technical)),
      heatmapData: JSON.parse(JSON.stringify(heatmapData)),
      isPublic: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log('Returning response with full analysis:', response);
    return NextResponse.json(response);
  } catch (error) {
    console.error('API error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      {
        error: 'Failed to process request',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
