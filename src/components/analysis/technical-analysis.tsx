'use client';

interface Technology {
  name: string;
  icon?: string;
  version?: string;
  category?: string;
}

interface TechnicalAnalysisProps {
  loadTime?: number | null; // in milliseconds
  pageSize?: number | null; // in bytes
  httpStatus?: number;
  technologies?: Technology[];
  server?: string;
  sslCertificate?: {
    valid: boolean;
    issuer?: string;
    validUntil?: string;
  };
  isLoading?: boolean;
}

export default function TechnicalAnalysis({
  loadTime,
  pageSize,
  httpStatus,
  technologies = [],
  server,
  sslCertificate,
  isLoading = true,
}: TechnicalAnalysisProps) {
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
          Performance
        </h3>

        <div
          style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
        >
          <MetricItem
            label='Load Time'
            value={
              isLoading
                ? 'Loading...'
                : loadTime
                ? `${(loadTime / 1000).toFixed(2)}s`
                : 'N/A'
            }
          />
          <MetricItem
            label='Page Size'
            value={
              isLoading
                ? 'Loading...'
                : pageSize
                ? formatBytes(pageSize)
                : 'N/A'
            }
          />
          <MetricItem
            label='HTTP Status'
            value={
              isLoading ? 'Loading...' : httpStatus ? String(httpStatus) : 'N/A'
            }
            status={getHttpStatusColor(httpStatus)}
          />
        </div>
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
          Server Information
        </h3>

        <div
          style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
        >
          <MetricItem
            label='Server'
            value={isLoading ? 'Loading...' : server || 'Unknown'}
          />
          <MetricItem
            label='SSL Certificate'
            value={
              isLoading
                ? 'Loading...'
                : sslCertificate
                ? `${sslCertificate.valid ? 'Valid' : 'Invalid'}${
                    sslCertificate.validUntil
                      ? ` (until ${sslCertificate.validUntil})`
                      : ''
                  }`
                : 'N/A'
            }
            status={sslCertificate?.valid ? 'good' : 'error'}
          />
          {sslCertificate?.issuer && !isLoading && (
            <MetricItem label='SSL Issuer' value={sslCertificate.issuer} />
          )}
        </div>
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
          Technologies
        </h3>

        {isLoading ? (
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
          >
            <TechnologySkeleton />
            <TechnologySkeleton />
            <TechnologySkeleton />
          </div>
        ) : technologies.length > 0 ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            {technologies.map((tech, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: 'rgba(102, 102, 102, 0.05)',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '0.25rem',
                  fontSize: '14px',
                }}
              >
                {tech.icon && (
                  <span style={{ fontSize: '16px' }}>{tech.icon}</span>
                )}
                <span>{tech.name}</span>
                {tech.version && (
                  <span style={{ color: '#666666', fontSize: '12px' }}>
                    v{tech.version}
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: '#666666', margin: 0 }}>
            No technologies detected
          </p>
        )}
      </div>
    </div>
  );
}

interface MetricItemProps {
  label: string;
  value: string;
  status?: 'good' | 'warning' | 'error';
}

function MetricItem({ label, value, status }: MetricItemProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'good':
        return '#047857';
      case 'warning':
        return '#B45309';
      case 'error':
        return '#B91C1C';
      default:
        return '#333333';
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <span style={{ color: '#666666' }}>{label}:</span>
      <span
        style={{
          fontWeight: '500',
          color: status ? getStatusColor() : '#333333',
        }}
      >
        {value}
      </span>
    </div>
  );
}

function TechnologySkeleton() {
  return (
    <div
      style={{
        height: '16px',
        width: '30%',
        backgroundColor: 'rgba(102, 102, 102, 0.1)',
        borderRadius: '4px',
      }}
    />
  );
}

// Helper functions
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function getHttpStatusColor(
  status?: number
): 'good' | 'warning' | 'error' | undefined {
  if (!status) return undefined;

  if (status >= 200 && status < 300) return 'good';
  if (status >= 300 && status < 400) return 'warning';
  return 'error';
}
