'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { urlSchema } from '@/lib/validations';

export function UrlAnalyzerForm() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Validate URL using Zod schema
      const result = urlSchema.safeParse({ url });

      if (!result.success) {
        setError(result.error.errors[0]?.message || 'Invalid URL');
        setIsLoading(false);
        return;
      }

      // Normalize URL
      const normalizedUrl = result.data.url;

      // Make API call to analyze URL
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const errorMessage = `Server error (${response.status}): ${response.statusText}`;
        console.error('Error during URL analysis:', errorMessage, {
          url,
          status: response.status,
          statusText: response.statusText,
        });
        setError(
          'There was a problem analyzing the URL. Please try again later.'
        );
        // Implement retry logic for transient errors
        if (response.status >= 500) {
          console.log('Retrying...');
          // Simple retry mechanism
          for (let attempt = 0; attempt < 3; attempt++) {
            const retryResponse = await fetch('/api/analyze', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ url }),
            });
            if (retryResponse.ok) {
              const retryData = await retryResponse.json();
              // setAnalysisResult(retryData); // Uncomment if you want to use retry data
              return;
            }
          }
        }
        throw new Error(errorMessage);
      }

      // const data = await response.json(); // Removed as it's not used

      // Redirect to analysis page
      router.push(`/analysis?url=${encodeURIComponent(normalizedUrl)}`);
    } catch (error) {
      console.error('Error during form submission:', error);
      setError('An unexpected error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ width: '100%', maxWidth: '36rem', marginBottom: '1rem' }}
    >
      <div style={{ marginBottom: '1rem' }}>
        <h2
          style={{
            fontSize: '28px',
            fontWeight: 600,
            color: '#333333',
            marginBottom: '0.5rem',
          }}
        >
          Analyze Your Website
        </h2>
        <p style={{ fontSize: '16px', color: '#666666', marginBottom: '1rem' }}>
          Enter your website URL to get insights on user experience and find
          ways to improve.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ width: '100%' }}>
          <Input
            type='text'
            placeholder='Enter website URL (e.g., example.com)'
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={isLoading}
            aria-label='Website URL'
            style={{ width: '100%' }}
          />
          {error && (
            <p
              style={{
                marginTop: '0.25rem',
                fontSize: '14px',
                color: '#e11d48',
              }}
            >
              {error}
            </p>
          )}
        </div>
        <Button type='submit' disabled={isLoading} style={{ width: '100%' }}>
          {isLoading ? 'Analyzing...' : 'Analyze'}
        </Button>
      </div>

      <p style={{ fontSize: '14px', color: '#666666', marginTop: '1rem' }}>
        We&apos;ll analyze your public website and provide insights to improve
        user experience.
      </p>
    </form>
  );
}
