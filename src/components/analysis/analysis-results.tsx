'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import HeatmapVisualization from './heatmap-visualization';
import {
  ContentAnalysis,
  SeoAnalysis,
  TechnicalAnalysis,
} from '@/types/analysis';

interface AnalysisResultsProps {
  url: string;
  isLoading?: boolean;
  analysis?: {
    heatmapData: {
      screenshot: string;
      heatmapPoints: Array<{ x: number; y: number; value: number }>;
    };
    contentAnalysis: ContentAnalysis;
    seoAnalysis: SeoAnalysis;
    technicalAnalysis: TechnicalAnalysis;
  };
}

export default function AnalysisResults({
  url,
  isLoading = true,
  analysis,
}: AnalysisResultsProps) {
  const [activeTab, setActiveTab] = useState<
    'heatmap' | 'content' | 'technical' | 'seo'
  >('heatmap');

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
              imageUrl={analysis?.heatmapData?.screenshot}
              heatmapPoints={analysis?.heatmapData?.heatmapPoints}
              isLoading={isLoading}
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
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
            >
              <ContentSection title='Page Title' isLoading={isLoading} />
              <ContentSection title='Meta Description' isLoading={isLoading} />
              <ContentSection title='Heading Structure' isLoading={isLoading} />
              <ContentSection title='Word Count' isLoading={isLoading} />
              <ContentSection title='Images' isLoading={isLoading} />
              <ContentSection title='Links' isLoading={isLoading} />
            </div>
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
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
            >
              <ContentSection
                title='Title Tag Optimization'
                isLoading={isLoading}
              />
              <ContentSection
                title='Meta Description Optimization'
                isLoading={isLoading}
              />
              <ContentSection title='Heading Structure' isLoading={isLoading} />
              <ContentSection title='Image Alt Tags' isLoading={isLoading} />
              <ContentSection title='URL Structure' isLoading={isLoading} />
              <ContentSection
                title='Mobile Friendliness'
                isLoading={isLoading}
              />
            </div>
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
              Technical Details
            </h2>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
            >
              <TechnicalItem label='Load Time' isLoading={isLoading} />
              <TechnicalItem label='Page Size' isLoading={isLoading} />
              <TechnicalItem label='HTTP Status' isLoading={isLoading} />
              <TechnicalItem label='Technologies' isLoading={isLoading} />
              <TechnicalItem label='Server' isLoading={isLoading} />
              <TechnicalItem label='SSL Certificate' isLoading={isLoading} />
            </div>
          </div>
        )}
      </div>
    </div>
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
        padding: '0.75rem 1rem',
        fontSize: '16px',
        fontWeight: active ? '600' : '400',
        color: active ? '#0057B7' : '#666666',
        backgroundColor: 'transparent',
        border: 'none',
        borderBottom: active ? '2px solid #0057B7' : '2px solid transparent',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </button>
  );
}

interface ContentSectionProps {
  title: string;
  isLoading: boolean;
  content?: string;
}

function ContentSection({ title, isLoading, content }: ContentSectionProps) {
  return (
    <div
      style={{
        padding: '1rem',
        backgroundColor: 'white',
        borderRadius: '0.375rem',
        border: '1px solid rgba(102, 102, 102, 0.1)',
      }}
    >
      <h3
        style={{
          fontSize: '18px',
          fontWeight: '600',
          color: '#333333',
          marginBottom: '0.5rem',
        }}
      >
        {title}
      </h3>
      <p style={{ color: '#666666' }}>
        {isLoading ? 'Loading...' : content || 'No data available'}
      </p>
    </div>
  );
}

interface TechnicalItemProps {
  label: string;
  isLoading: boolean;
  value?: string;
}

function TechnicalItem({ label, isLoading, value }: TechnicalItemProps) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <span style={{ color: '#666666' }}>{label}:</span>
      <span style={{ fontWeight: '500' }}>
        {isLoading ? 'Loading...' : value || 'N/A'}
      </span>
    </div>
  );
}
