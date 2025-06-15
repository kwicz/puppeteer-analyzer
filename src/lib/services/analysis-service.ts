import { prisma } from '@/lib/db';
import type { Analysis as PrismaAnalysis } from '@/generated/prisma';
import {
  Analysis,
  AnalysisCreateInput,
  AnalysisUpdateInput,
  AnalysisInsights,
  ContentAnalysis,
  SeoAnalysis,
  TechnicalAnalysis,
  HeatmapData,
} from '@/types/analysis';

export class AnalysisError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AnalysisError';
  }
}

export async function createAnalysis(
  data: AnalysisCreateInput
): Promise<Analysis> {
  try {
    const defaultContentAnalysis: ContentAnalysis = {
      wordCount: 0,
      headings: { h1: 0, h2: 0, h3: 0, h4: 0, h5: 0, h6: 0 },
      images: { total: 0, withAlt: 0, withoutAlt: 0 },
      links: { total: 0, internal: 0, external: 0 },
    };

    const defaultSeoAnalysis: SeoAnalysis = {
      title: { present: false, length: 0, value: null },
      metaDescription: { present: false, length: 0, value: null },
      headings: { hasH1: false, h1Count: 0, headingStructure: false },
      images: { altTextCoverage: 0 },
      links: { internalLinkCount: 0, externalLinkCount: 0 },
    };

    const defaultTechnicalAnalysis: TechnicalAnalysis = {
      technologies: [],
      performance: { loadTime: 0, resourceCount: 0 },
      accessibility: { score: 0, issues: [] },
      security: { hasSSL: false, securityHeaders: [] },
    };

    const defaultHeatmapData: HeatmapData = {
      screenshot: '',
      heatmapImage: '',
      heatmapPoints: [],
    };

    const analysis = await prisma.analysis.create({
      data: {
        url: data.url,
        title: data.title,
        screenshotUrl: data.screenshotUrl,
        heatmapUrl: data.heatmapUrl,
        seoScore: data.seoScore,
        loadTime: data.loadTime,
        pageSize: data.pageSize,
        technologies: data.technologies,
        insights: data.insights as unknown as object,
        isPublic: data.isPublic ?? true,
        contentAnalysis: defaultContentAnalysis,
        seoAnalysis: defaultSeoAnalysis,
        technicalAnalysis: defaultTechnicalAnalysis,
        heatmapData: defaultHeatmapData,
      },
    });

    return {
      ...analysis,
      insights: analysis.insights as unknown as AnalysisInsights | undefined,
      contentAnalysis: analysis.contentAnalysis as ContentAnalysis,
      seoAnalysis: analysis.seoAnalysis as SeoAnalysis,
      technicalAnalysis: analysis.technicalAnalysis as TechnicalAnalysis,
      heatmapData: analysis.heatmapData as HeatmapData,
    };
  } catch (error) {
    console.error('Error creating analysis:', error);
    throw new AnalysisError('Failed to create analysis');
  }
}

export async function getAnalysisById(id: string): Promise<Analysis | null> {
  try {
    const analysis = await prisma.analysis.findUnique({
      where: { id },
    });

    if (!analysis) return null;

    return {
      ...analysis,
      insights: analysis.insights as unknown as AnalysisInsights | undefined,
      contentAnalysis: analysis.contentAnalysis as ContentAnalysis,
      seoAnalysis: analysis.seoAnalysis as SeoAnalysis,
      technicalAnalysis: analysis.technicalAnalysis as TechnicalAnalysis,
      heatmapData: analysis.heatmapData as HeatmapData,
    };
  } catch (error) {
    console.error('Error fetching analysis:', error);
    throw new AnalysisError('Failed to fetch analysis');
  }
}

export async function getAnalysisByUrl(url: string): Promise<Analysis | null> {
  try {
    const analysis = await prisma.analysis.findFirst({
      where: { url },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!analysis) return null;

    return {
      ...analysis,
      insights: analysis.insights as unknown as AnalysisInsights | undefined,
      contentAnalysis: analysis.contentAnalysis as ContentAnalysis,
      seoAnalysis: analysis.seoAnalysis as SeoAnalysis,
      technicalAnalysis: analysis.technicalAnalysis as TechnicalAnalysis,
      heatmapData: analysis.heatmapData as HeatmapData,
    };
  } catch (error) {
    console.error('Error fetching analysis by URL:', error);
    throw new AnalysisError('Failed to fetch analysis by URL');
  }
}

export async function getPublicAnalyses(): Promise<Analysis[]> {
  try {
    const analyses = await prisma.analysis.findMany({
      where: { isPublic: true },
      orderBy: { createdAt: 'desc' },
    });

    return analyses.map((analysis: PrismaAnalysis) => ({
      ...analysis,
      insights: analysis.insights as unknown as AnalysisInsights | undefined,
      contentAnalysis: analysis.contentAnalysis as unknown as ContentAnalysis,
      seoAnalysis: analysis.seoAnalysis as unknown as SeoAnalysis,
      technicalAnalysis:
        analysis.technicalAnalysis as unknown as TechnicalAnalysis,
      heatmapData: analysis.heatmapData as unknown as HeatmapData,
    }));
  } catch (error) {
    console.error('Error fetching public analyses:', error);
    throw new AnalysisError('Failed to fetch public analyses');
  }
}

export async function updateAnalysis(
  id: string,
  data: AnalysisUpdateInput
): Promise<Analysis> {
  try {
    const analysis = await prisma.analysis.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.screenshotUrl !== undefined && {
          screenshotUrl: data.screenshotUrl,
        }),
        ...(data.heatmapUrl !== undefined && { heatmapUrl: data.heatmapUrl }),
        ...(data.seoScore !== undefined && { seoScore: data.seoScore }),
        ...(data.loadTime !== undefined && { loadTime: data.loadTime }),
        ...(data.pageSize !== undefined && { pageSize: data.pageSize }),
        ...(data.technologies !== undefined && {
          technologies: data.technologies,
        }),
        ...(data.insights !== undefined && {
          insights: data.insights as unknown as object,
        }),
        ...(data.isPublic !== undefined && { isPublic: data.isPublic }),
      },
    });

    return {
      ...analysis,
      insights: analysis.insights as unknown as AnalysisInsights | undefined,
      contentAnalysis: analysis.contentAnalysis as ContentAnalysis,
      seoAnalysis: analysis.seoAnalysis as SeoAnalysis,
      technicalAnalysis: analysis.technicalAnalysis as TechnicalAnalysis,
      heatmapData: analysis.heatmapData as HeatmapData,
    };
  } catch (error) {
    console.error('Error updating analysis:', error);
    throw new AnalysisError('Failed to update analysis');
  }
}

export async function deleteAnalysis(id: string): Promise<void> {
  try {
    await prisma.analysis.delete({
      where: { id },
    });
  } catch (error) {
    console.error('Error deleting analysis:', error);
    throw new AnalysisError('Failed to delete analysis');
  }
}

export async function getPublicAnalysis(id: string): Promise<Analysis | null> {
  try {
    const analysis = await prisma.analysis.findFirst({
      where: {
        id,
        isPublic: true,
      },
    });

    if (!analysis) return null;

    return {
      ...analysis,
      insights: analysis.insights as unknown as AnalysisInsights | undefined,
      contentAnalysis: analysis.contentAnalysis as ContentAnalysis,
      seoAnalysis: analysis.seoAnalysis as SeoAnalysis,
      technicalAnalysis: analysis.technicalAnalysis as TechnicalAnalysis,
      heatmapData: analysis.heatmapData as HeatmapData,
    };
  } catch (error) {
    console.error('Error fetching public analysis:', error);
    throw new AnalysisError('Failed to fetch public analysis');
  }
}
