export function Footer() {
  return (
    <footer
      style={{
        width: '100%',
        borderTop: '1px solid rgba(102, 102, 102, 0.1)',
        backgroundColor: 'white',
        padding: '1.5rem 0',
      }}
    >
      <div
        style={{
          margin: '0 auto',
          padding: '0 1rem',
          maxWidth: '80rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.875rem', color: '#666666' }}>
              © {new Date().getFullYear()} URL Analyzer. All rights reserved.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <a
              href='#'
              style={{
                fontSize: '0.875rem',
                color: '#666666',
                textDecoration: 'none',
                transition: 'color 0.2s',
              }}
            >
              Privacy Policy
            </a>
            <a
              href='#'
              style={{
                fontSize: '0.875rem',
                color: '#666666',
                textDecoration: 'none',
                transition: 'color 0.2s',
              }}
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
