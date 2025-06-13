'use client';

import { useState } from 'react';

interface SEOInsight {
  title: string;
  status: 'good' | 'warning' | 'error';
  description: string;
  details?: string;
  recommendations?: string[];
}

interface SEOInsightsProps {
  insights?: SEOInsight[];
  isLoading?: boolean;
}

export default function SEOInsights({
  insights = [],
  isLoading = true,
}: SEOInsightsProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {isLoading ? (
        <>
          <InsightSkeleton />
          <InsightSkeleton />
          <InsightSkeleton />
        </>
      ) : insights.length > 0 ? (
        insights.map((insight, index) => (
          <InsightItem key={index} insight={insight} />
        ))
      ) : (
        <div
          style={{
            padding: '2rem',
            textAlign: 'center',
            backgroundColor: 'white',
            borderRadius: '0.375rem',
            border: '1px solid rgba(102, 102, 102, 0.1)',
          }}
        >
          <p style={{ color: '#666666', margin: 0 }}>
            No SEO insights available
          </p>
        </div>
      )}
    </div>
  );
}

function InsightItem({ insight }: { insight: SEOInsight }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const statusColors = {
    good: { bg: '#ECFDF5', text: '#047857', icon: '✓' },
    warning: { bg: '#FFFBEB', text: '#B45309', icon: '⚠' },
    error: { bg: '#FEF2F2', text: '#B91C1C', icon: '✗' },
  };

  const { bg, text, icon } = statusColors[insight.status];

  return (
    <div
      style={{
        backgroundColor: 'white',
        borderRadius: '0.375rem',
        border: '1px solid rgba(102, 102, 102, 0.1)',
        overflow: 'hidden',
      }}
    >
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          padding: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          cursor: 'pointer',
        }}
      >
        <div
          style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            backgroundColor: bg,
            color: text,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
        <div style={{ flex: 1 }}>
          <h3
            style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#333333',
              margin: 0,
            }}
          >
            {insight.title}
          </h3>
          <p
            style={{
              fontSize: '14px',
              color: '#666666',
              margin: '0.25rem 0 0 0',
            }}
          >
            {insight.description}
          </p>
        </div>
        <div
          style={{
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s',
          }}
        >
          ▼
        </div>
      </div>

      {isExpanded && (
        <div
          style={{
            padding: '0 1rem 1rem 1rem',
            borderTop: '1px solid rgba(102, 102, 102, 0.1)',
            marginTop: '-1px',
          }}
        >
          {insight.details && (
            <p style={{ fontSize: '14px', color: '#666666' }}>
              {insight.details}
            </p>
          )}

          {insight.recommendations && insight.recommendations.length > 0 && (
            <>
              <h4
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#333333',
                  margin: '1rem 0 0.5rem 0',
                }}
              >
                Recommendations:
              </h4>
              <ul
                style={{
                  margin: 0,
                  paddingLeft: '1.5rem',
                }}
              >
                {insight.recommendations.map((rec, idx) => (
                  <li
                    key={idx}
                    style={{
                      fontSize: '14px',
                      color: '#666666',
                      marginBottom: '0.25rem',
                    }}
                  >
                    {rec}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function InsightSkeleton() {
  return (
    <div
      style={{
        backgroundColor: 'white',
        borderRadius: '0.375rem',
        border: '1px solid rgba(102, 102, 102, 0.1)',
        padding: '1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
      }}
    >
      <div
        style={{
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          backgroundColor: 'rgba(102, 102, 102, 0.1)',
          flexShrink: 0,
        }}
      />
      <div style={{ flex: 1 }}>
        <div
          style={{
            height: '16px',
            width: '60%',
            backgroundColor: 'rgba(102, 102, 102, 0.1)',
            borderRadius: '4px',
            marginBottom: '0.5rem',
          }}
        />
        <div
          style={{
            height: '12px',
            width: '80%',
            backgroundColor: 'rgba(102, 102, 102, 0.1)',
            borderRadius: '4px',
          }}
        />
      </div>
    </div>
  );
}
