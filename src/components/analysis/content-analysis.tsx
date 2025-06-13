'use client';

interface Heading {
  level: number;
  text: string;
}

interface ContentMetrics {
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

interface ContentAnalysisProps {
  title?: string;
  metaDescription?: string;
  headings?: Heading[];
  metrics?: ContentMetrics;
  isLoading?: boolean;
}

export default function ContentAnalysis({
  title,
  metaDescription,
  headings = [],
  metrics,
  isLoading = true,
}: ContentAnalysisProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '0.375rem',
          border: '1px solid rgba(102, 102, 102, 0.1)',
          padding: '1rem',
        }}
      >
        <h3
          style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#333333',
            marginTop: 0,
            marginBottom: '1rem',
          }}
        >
          Page Title
        </h3>
        {isLoading ? (
          <div
            style={{
              height: '16px',
              width: '80%',
              backgroundColor: 'rgba(102, 102, 102, 0.1)',
              borderRadius: '4px',
            }}
          />
        ) : title ? (
          <p style={{ margin: 0, color: '#333333' }}>{title}</p>
        ) : (
          <p style={{ margin: 0, color: '#666666', fontStyle: 'italic' }}>
            No title found
          </p>
        )}
      </div>

      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '0.375rem',
          border: '1px solid rgba(102, 102, 102, 0.1)',
          padding: '1rem',
        }}
      >
        <h3
          style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#333333',
            marginTop: 0,
            marginBottom: '1rem',
          }}
        >
          Meta Description
        </h3>
        {isLoading ? (
          <>
            <div
              style={{
                height: '12px',
                width: '90%',
                backgroundColor: 'rgba(102, 102, 102, 0.1)',
                borderRadius: '4px',
                marginBottom: '0.5rem',
              }}
            />
            <div
              style={{
                height: '12px',
                width: '70%',
                backgroundColor: 'rgba(102, 102, 102, 0.1)',
                borderRadius: '4px',
              }}
            />
          </>
        ) : metaDescription ? (
          <p style={{ margin: 0, color: '#333333' }}>{metaDescription}</p>
        ) : (
          <p style={{ margin: 0, color: '#666666', fontStyle: 'italic' }}>
            No meta description found
          </p>
        )}
      </div>

      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '0.375rem',
          border: '1px solid rgba(102, 102, 102, 0.1)',
          padding: '1rem',
        }}
      >
        <h3
          style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#333333',
            marginTop: 0,
            marginBottom: '1rem',
          }}
        >
          Heading Structure
        </h3>
        {isLoading ? (
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
          >
            <HeadingSkeleton level={1} />
            <HeadingSkeleton level={2} />
            <HeadingSkeleton level={2} />
            <HeadingSkeleton level={3} />
          </div>
        ) : headings.length > 0 ? (
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
          >
            {headings.map((heading, index) => (
              <div
                key={index}
                style={{
                  paddingLeft: `${(heading.level - 1) * 1}rem`,
                  fontSize: `${18 - (heading.level - 1) * 2}px`,
                  fontWeight: heading.level === 1 ? '600' : '400',
                  color: heading.level === 1 ? '#333333' : '#666666',
                }}
              >
                <span
                  style={{
                    backgroundColor: 'rgba(102, 102, 102, 0.1)',
                    padding: '0.1rem 0.3rem',
                    borderRadius: '0.25rem',
                    fontSize: '12px',
                    marginRight: '0.5rem',
                    color: '#666666',
                  }}
                >
                  H{heading.level}
                </span>
                {heading.text}
              </div>
            ))}
          </div>
        ) : (
          <p style={{ margin: 0, color: '#666666', fontStyle: 'italic' }}>
            No headings found
          </p>
        )}
      </div>

      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '0.375rem',
          border: '1px solid rgba(102, 102, 102, 0.1)',
          padding: '1rem',
        }}
      >
        <h3
          style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#333333',
            marginTop: 0,
            marginBottom: '1rem',
          }}
        >
          Content Metrics
        </h3>
        {isLoading ? (
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
          >
            <MetricSkeleton />
            <MetricSkeleton />
            <MetricSkeleton />
          </div>
        ) : metrics ? (
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
          >
            <MetricItem
              label='Word Count'
              value={
                metrics.wordCount !== undefined
                  ? metrics.wordCount.toString()
                  : 'N/A'
              }
            />
            <MetricItem
              label='Paragraph Count'
              value={
                metrics.paragraphCount !== undefined
                  ? metrics.paragraphCount.toString()
                  : 'N/A'
              }
            />
            <MetricItem
              label='Image Count'
              value={
                metrics.imageCount !== undefined
                  ? metrics.imageCount.toString()
                  : 'N/A'
              }
            />
            {metrics.linkCount && (
              <>
                <MetricItem
                  label='Internal Links'
                  value={metrics.linkCount.internal.toString()}
                />
                <MetricItem
                  label='External Links'
                  value={metrics.linkCount.external.toString()}
                />
                <MetricItem
                  label='Total Links'
                  value={metrics.linkCount.total.toString()}
                />
              </>
            )}
            <MetricItem
              label='Estimated Reading Time'
              value={
                metrics.readingTime !== undefined
                  ? `${metrics.readingTime} min`
                  : 'N/A'
              }
            />
          </div>
        ) : (
          <p style={{ margin: 0, color: '#666666', fontStyle: 'italic' }}>
            No content metrics available
          </p>
        )}
      </div>
    </div>
  );
}

interface MetricItemProps {
  label: string;
  value: string;
}

function MetricItem({ label, value }: MetricItemProps) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <span style={{ color: '#666666' }}>{label}:</span>
      <span style={{ fontWeight: '500' }}>{value}</span>
    </div>
  );
}

function MetricSkeleton() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          height: '12px',
          width: '30%',
          backgroundColor: 'rgba(102, 102, 102, 0.1)',
          borderRadius: '4px',
        }}
      />
      <div
        style={{
          height: '12px',
          width: '20%',
          backgroundColor: 'rgba(102, 102, 102, 0.1)',
          borderRadius: '4px',
        }}
      />
    </div>
  );
}

function HeadingSkeleton({ level }: { level: number }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        paddingLeft: `${(level - 1) * 1}rem`,
      }}
    >
      <div
        style={{
          height: '12px',
          width: '20px',
          backgroundColor: 'rgba(102, 102, 102, 0.1)',
          borderRadius: '4px',
          marginRight: '0.5rem',
        }}
      />
      <div
        style={{
          height: '12px',
          width: `${80 - (level - 1) * 10}%`,
          backgroundColor: 'rgba(102, 102, 102, 0.1)',
          borderRadius: '4px',
        }}
      />
    </div>
  );
}
