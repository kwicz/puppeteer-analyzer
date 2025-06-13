import { z } from 'zod';
import { normalizeUrl } from './utils';

/**
 * Zod schema for URL validation
 */
export const urlSchema = z.object({
  url: z
    .string()
    .min(1, { message: 'URL is required' })
    .transform((val) => {
      try {
        return normalizeUrl(val);
      } catch (error) {
        throw new z.ZodError([
          {
            code: z.ZodIssueCode.custom,
            message:
              error instanceof Error ? error.message : 'Invalid URL format',
            path: ['url'],
          },
        ]);
      }
    }),
});

export type UrlInput = z.infer<typeof urlSchema>;

/**
 * Zod schema for analysis results
 */
export const analysisResultSchema = z.object({
  id: z.string(),
  url: z.string(),
  title: z.string().nullable(),
  screenshot: z.string().nullable(),
  seoScore: z.number().nullable(),
  loadTime: z.number().nullable(),
  pageSize: z.number().nullable(),
  technologies: z.array(z.string()),
  insights: z.record(z.unknown()),
  isPublic: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type AnalysisResult = z.infer<typeof analysisResultSchema>;
