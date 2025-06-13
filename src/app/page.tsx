'use client';

import { UrlAnalyzerForm } from '@/components/forms/url-analyzer-form';

export default function Home() {
  return (
    <main
      style={{
        display: 'flex',
        minHeight: '100vh',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '1rem',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '64rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '2rem',
        }}
      >
        <div style={{ marginBottom: '1rem' }}>
          <h1
            style={{
              fontSize: '36px',
              fontWeight: '700',
              color: '#333333',
              marginBottom: '1rem',
            }}
          >
            Analyze Your Website&apos;s User Experience
          </h1>
          <p
            style={{
              fontSize: '16px',
              color: '#666666',
              maxWidth: '42rem',
              margin: '0 auto',
            }}
          >
            Get actionable insights to improve your website&apos;s user
            experience and increase conversions. Our tool provides predictive
            heatmaps and detailed content analysis to help you make data-driven
            decisions.
          </p>
        </div>

        <div style={{ width: '100%', maxWidth: '36rem' }}>
          <UrlAnalyzerForm />
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '1.5rem',
            width: '100%',
            marginTop: '3rem',
          }}
        >
          <div
            style={{
              backgroundColor: '#F7F7F7',
              padding: '1.5rem',
              borderRadius: '0.5rem',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
            }}
          >
            <h3
              style={{
                fontSize: '22px',
                fontWeight: '600',
                color: '#0057B7',
                marginBottom: '0.5rem',
              }}
            >
              Predictive Heatmaps
            </h3>
            <p style={{ color: '#666666' }}>
              Visualize where users are likely to focus their attention on your
              website.
            </p>
          </div>
          <div
            style={{
              backgroundColor: '#F7F7F7',
              padding: '1.5rem',
              borderRadius: '0.5rem',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
            }}
          >
            <h3
              style={{
                fontSize: '22px',
                fontWeight: '600',
                color: '#0057B7',
                marginBottom: '0.5rem',
              }}
            >
              Content Analysis
            </h3>
            <p style={{ color: '#666666' }}>
              Get insights on your content structure, SEO, and user engagement
              factors.
            </p>
          </div>
          <div
            style={{
              backgroundColor: '#F7F7F7',
              padding: '1.5rem',
              borderRadius: '0.5rem',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
            }}
          >
            <h3
              style={{
                fontSize: '22px',
                fontWeight: '600',
                color: '#0057B7',
                marginBottom: '0.5rem',
              }}
            >
              Technical Insights
            </h3>
            <p style={{ color: '#666666' }}>
              Understand your site&apos;s performance metrics and technical
              stack.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
