'use client';

import Link from 'next/link';

export function Header() {
  return (
    <header
      style={{
        width: '100%',
        borderBottom: '1px solid rgba(102, 102, 102, 0.1)',
        backgroundColor: 'white',
      }}
    >
      <div
        style={{
          margin: '0 auto',
          display: 'flex',
          height: '4rem',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1rem',
          maxWidth: '80rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Link
            href='/'
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <span
              style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                color: '#0057B7',
              }}
            >
              URL Analyzer
            </span>
          </Link>
        </div>
        <nav style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link
            href='/'
            style={{
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#666666',
              transition: 'color 0.2s',
              textDecoration: 'none',
            }}
          >
            Home
          </Link>
          <Link
            href='#features'
            style={{
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#666666',
              transition: 'color 0.2s',
              textDecoration: 'none',
            }}
          >
            Features
          </Link>
        </nav>
      </div>
    </header>
  );
}
