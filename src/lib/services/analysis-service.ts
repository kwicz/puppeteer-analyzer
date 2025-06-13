import { prisma } from '@/lib/prisma';
import type {
  Analysis,
  AnalysisCreateInput,
  AnalysisUpdateInput,
  AnalysisInsights,
} from '@/types/analysis';
import { PrismaClient } from '@prisma/client';

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
      },
    });

    return {
      ...analysis,
      insights: analysis.insights as unknown as AnalysisInsights | undefined,
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

    return analyses.map((analysis: any) => ({
      ...analysis,
      insights: analysis.insights as unknown as AnalysisInsights | undefined,
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
    };
  } catch (error) {
    console.error('Error fetching public analysis:', error);
    throw new AnalysisError('Failed to fetch public analysis');
  }
}
