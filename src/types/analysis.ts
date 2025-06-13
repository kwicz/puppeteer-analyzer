export interface Heading {
  level: number;
  text: string;
}

export interface ContentMetrics {
  wordCount?: number;
  paragraphCount?: number;
  imageCount?: number;
  linkCount?: {
    internal: number;
    external: number;
    total: number;
  };
  readingTime?: number; // in minutes
}

export interface Technology {
  name: string;
  icon?: string;
  version?: string;
  category?: string;
}

export interface SEOInsight {
  title: string;
  status: 'good' | 'warning' | 'error';
  description: string;
  details?: string;
  recommendations?: string[];
}

export interface AnalysisInsights {
  seo: {
    score: number;
    insights: SEOInsight[];
  };
  content: {
    title?: string;
    metaDescription?: string;
    headings?: Heading[];
    metrics?: ContentMetrics;
  };
  technical: {
    loadTime?: number; // in milliseconds
    pageSize?: number; // in bytes
    httpStatus?: number;
    technologies?: Technology[];
    server?: string;
    sslCertificate?: {
      valid: boolean;
      issuer?: string;
      validUntil?: string;
    };
  };
}

export interface HeatmapPoint {
  x: number;
  y: number;
  value: number;
}

export interface HeatmapData {
  screenshot: string;
  heatmapImage: string;
  heatmapPoints: HeatmapPoint[];
}

export interface ContentAnalysis {
  wordCount: number;
  headings: {
    h1: number;
    h2: number;
    h3: number;
    h4: number;
    h5: number;
    h6: number;
  };
  images: {
    total: number;
    withAlt: number;
    withoutAlt: number;
  };
  links: {
    total: number;
    internal: number;
    external: number;
  };
}

export interface SeoAnalysis {
  title: {
    present: boolean;
    length: number;
    value: string | null;
  };
  metaDescription: {
    present: boolean;
    length: number;
    value: string | null;
  };
  headings: {
    hasH1: boolean;
    h1Count: number;
    headingStructure: boolean;
  };
  images: {
    altTextCoverage: number;
  };
  links: {
    internalLinkCount: number;
    externalLinkCount: number;
  };
}

export interface TechnicalAnalysis {
  technologies: string[];
  performance: {
    loadTime: number;
    resourceCount: number;
  };
  accessibility: {
    score: number;
    issues: string[];
  };
  security: {
    hasSSL: boolean;
    securityHeaders: string[];
  };
}

export interface Analysis {
  id: string;
  url: string;
  title?: string | null;
  screenshotUrl?: string | null;
  heatmapUrl?: string | null;
  seoScore?: number | null;
  loadTime?: number | null;
  pageSize?: number | null;
  technologies: string[];
  insights?: AnalysisInsights;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  contentAnalysis: ContentAnalysis;
  seoAnalysis: SeoAnalysis;
  technicalAnalysis: TechnicalAnalysis;
  heatmapData: HeatmapData;
}

export interface AnalysisCreateInput {
  url: string;
  title?: string;
  screenshotUrl?: string;
  heatmapUrl?: string;
  seoScore?: number;
  loadTime?: number;
  pageSize?: number;
  technologies: string[];
  insights?: AnalysisInsights;
  isPublic?: boolean;
}

export interface AnalysisUpdateInput {
  title?: string;
  screenshotUrl?: string;
  heatmapUrl?: string;
  seoScore?: number;
  loadTime?: number;
  pageSize?: number;
  technologies?: string[];
  insights?: AnalysisInsights;
  isPublic?: boolean;
}
