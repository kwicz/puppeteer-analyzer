'use client';

import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useState, useEffect, Suspense } from 'react';
import HeatmapVisualization from '@/components/analysis/heatmap-visualization';
import ContentAnalysis from '@/components/analysis/content-analysis';
import SEOInsights from '@/components/analysis/seo-insights';
import TechnicalAnalysis from '@/components/analysis/technical-analysis';
import { Analysis } from '@/types/analysis';

function AnalysisContent() {
  const searchParams = useSearchParams();
  const url = searchParams.get('url');
  const [isLoading, setIsLoading] = useState(true);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    'heatmap' | 'content' | 'technical' | 'seo'
  >('heatmap');

  useEffect(() => {
    if (url) {
      const fetchAnalysis = async () => {
        try {
          const response = await fetch('/api/analyze', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch analysis');
          }

          const data = await response.json();
          setAnalysis(data);
        } catch (error) {
          console.error('Error fetching analysis:', error);
          setError(
            error instanceof Error ? error.message : 'Failed to fetch analysis'
          );
        } finally {
          setIsLoading(false);
        }
      };

      fetchAnalysis();
    }
  }, [url]);

  if (!url) {
    return (
      <div
        style={{
          display: 'flex',
          minHeight: '50vh',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          textAlign: 'center',
        }}
      >
        <h1
          style={{
            fontSize: '28px',
            fontWeight: '600',
            color: '#333333',
            marginBottom: '1rem',
          }}
        >
          No URL Provided
        </h1>
        <p
          style={{ fontSize: '16px', color: '#666666', marginBottom: '1.5rem' }}
        >
          Please provide a URL to analyze.
        </p>
        <Link href='/'>
          <Button>Go Back Home</Button>
        </Link>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          display: 'flex',
          minHeight: '50vh',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          textAlign: 'center',
        }}
      >
        <h1
          style={{
            fontSize: '28px',
            fontWeight: '600',
            color: '#e11d48',
            marginBottom: '1rem',
          }}
        >
          Error
        </h1>
        <p
          style={{ fontSize: '16px', color: '#666666', marginBottom: '1.5rem' }}
        >
          {error}
        </p>
        <Link href='/'>
          <Button>Go Back Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '2rem 1rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link href='/'>
          <Button variant='ghost' style={{ marginBottom: '1rem' }}>
            ← Back to Home
          </Button>
        </Link>
        <h1 style={{ fontSize: '28px', fontWeight: '600', color: '#333333' }}>
          Analysis Results
        </h1>
        <p style={{ fontSize: '16px', color: '#666666' }}>
          Analyzing:{' '}
          <span style={{ fontWeight: '500', color: '#0057B7' }}>{url}</span>
        </p>
      </div>

      {/* Navigation tabs */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          marginBottom: '1.5rem',
          borderBottom: '1px solid rgba(102, 102, 102, 0.1)',
          overflowX: 'auto',
        }}
      >
        <TabButton
          active={activeTab === 'heatmap'}
          onClick={() => setActiveTab('heatmap')}
        >
          Heatmap
        </TabButton>
        <TabButton
          active={activeTab === 'content'}
          onClick={() => setActiveTab('content')}
        >
          Content
        </TabButton>
        <TabButton
          active={activeTab === 'seo'}
          onClick={() => setActiveTab('seo')}
        >
          SEO
        </TabButton>
        <TabButton
          active={activeTab === 'technical'}
          onClick={() => setActiveTab('technical')}
        >
          Technical
        </TabButton>
      </div>

      {/* Content based on active tab */}
      <div
        style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}
      >
        {activeTab === 'heatmap' && (
          <div
            style={{
              backgroundColor: '#F7F7F7',
              padding: '1.5rem',
              borderRadius: '0.5rem',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
              border: '1px solid rgba(102, 102, 102, 0.1)',
            }}
          >
            <h2
              style={{
                fontSize: '22px',
                fontWeight: '600',
                color: '#333333',
                marginBottom: '1rem',
              }}
            >
              Predictive Heatmap
            </h2>
            <HeatmapVisualization
              isLoading={isLoading}
              imageUrl={analysis?.heatmapData?.screenshot ?? undefined}
              heatmapImageUrl={analysis?.heatmapData?.heatmapImage ?? undefined}
            />
          </div>
        )}

        {activeTab === 'content' && (
          <div
            style={{
              backgroundColor: '#F7F7F7',
              padding: '1.5rem',
              borderRadius: '0.5rem',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
              border: '1px solid rgba(102, 102, 102, 0.1)',
            }}
          >
            <h2
              style={{
                fontSize: '22px',
                fontWeight: '600',
                color: '#333333',
                marginBottom: '1rem',
              }}
            >
              Content Analysis
            </h2>
            <ContentAnalysis
              isLoading={isLoading}
              title={analysis?.title ?? undefined}
              metaDescription={analysis?.insights?.content?.metaDescription}
              headings={analysis?.insights?.content?.headings}
              metrics={analysis?.insights?.content?.metrics}
            />
          </div>
        )}

        {activeTab === 'seo' && (
          <div
            style={{
              backgroundColor: '#F7F7F7',
              padding: '1.5rem',
              borderRadius: '0.5rem',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
              border: '1px solid rgba(102, 102, 102, 0.1)',
            }}
          >
            <h2
              style={{
                fontSize: '22px',
                fontWeight: '600',
                color: '#333333',
                marginBottom: '1rem',
              }}
            >
              SEO Insights
            </h2>
            <SEOInsights
              isLoading={isLoading}
              insights={analysis?.insights?.seo?.insights}
            />
          </div>
        )}

        {activeTab === 'technical' && (
          <div
            style={{
              backgroundColor: '#F7F7F7',
              padding: '1.5rem',
              borderRadius: '0.5rem',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
              border: '1px solid rgba(102, 102, 102, 0.1)',
            }}
          >
            <h2
              style={{
                fontSize: '22px',
                fontWeight: '600',
                color: '#333333',
                marginBottom: '1rem',
              }}
            >
              Technical Analysis
            </h2>
            <TechnicalAnalysis
              isLoading={isLoading}
              technologies={analysis?.technologies?.map((name) => ({ name }))}
              loadTime={analysis?.loadTime ?? undefined}
              pageSize={analysis?.pageSize ?? undefined}
              server={analysis?.insights?.technical?.server}
              sslCertificate={analysis?.insights?.technical?.sslCertificate}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div
      style={{
        display: 'flex',
        minHeight: '50vh',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        textAlign: 'center',
      }}
    >
      <div style={{ marginBottom: '1rem' }}>Loading...</div>
    </div>
  );
}

export default function AnalysisPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AnalysisContent />
    </Suspense>
  );
}

// Helper components
interface TabButtonProps {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}

function TabButton({ children, active, onClick }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '0.75rem 1.5rem',
        fontSize: '16px',
        fontWeight: active ? '600' : '400',
        color: active ? '#0057B7' : '#666666',
        backgroundColor: active ? 'rgba(0, 87, 183, 0.1)' : 'transparent',
        border: 'none',
        borderBottom: active ? '2px solid #0057B7' : 'none',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </button>
  );
}
