'use client';

import { useState, useEffect } from 'react';

interface HeatmapVisualizationProps {
  imageUrl?: string | null | undefined;
  heatmapImageUrl?: string | null | undefined;
  isLoading?: boolean;
  alt?: string;
}

export default function HeatmapVisualization({
  imageUrl,
  heatmapImageUrl,
  isLoading = true,
  alt = 'Website screenshot with heatmap overlay',
}: HeatmapVisualizationProps) {
  const [showHeatmap, setShowHeatmap] = useState(true);

  useEffect(() => {
    console.log('HeatmapVisualization props:', {
      imageUrl: imageUrl ? 'Present' : 'Missing',
      heatmapImageUrl: heatmapImageUrl ? 'Present' : 'Missing',
      isLoading,
    });
  }, [imageUrl, heatmapImageUrl, isLoading]);

  if (isLoading) {
    return (
      <div
        style={{
          aspectRatio: '16/9',
          backgroundColor: 'rgba(102, 102, 102, 0.1)',
          borderRadius: '0.375rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <p style={{ color: '#666666' }}>Loading heatmap...</p>
      </div>
    );
  }

  const currentImage = showHeatmap ? heatmapImageUrl : imageUrl;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div
        style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}
      >
        <button
          onClick={() => setShowHeatmap(false)}
          style={{
            padding: '0.5rem 0.75rem',
            fontSize: '14px',
            fontWeight: !showHeatmap ? '600' : '400',
            color: !showHeatmap ? '#0057B7' : '#666666',
            backgroundColor: !showHeatmap
              ? 'rgba(0, 87, 183, 0.1)'
              : 'transparent',
            border: '1px solid rgba(102, 102, 102, 0.2)',
            borderRadius: '0.25rem',
            cursor: 'pointer',
          }}
        >
          Original
        </button>
        <button
          onClick={() => setShowHeatmap(true)}
          style={{
            padding: '0.5rem 0.75rem',
            fontSize: '14px',
            fontWeight: showHeatmap ? '600' : '400',
            color: showHeatmap ? '#0057B7' : '#666666',
            backgroundColor: showHeatmap
              ? 'rgba(0, 87, 183, 0.1)'
              : 'transparent',
            border: '1px solid rgba(102, 102, 102, 0.2)',
            borderRadius: '0.25rem',
            cursor: 'pointer',
          }}
        >
          Heatmap
        </button>
      </div>

      <div
        style={{
          position: 'relative',
          aspectRatio: '16/9',
          backgroundColor: 'white',
          borderRadius: '0.375rem',
          overflow: 'hidden',
          border: '1px solid rgba(102, 102, 102, 0.1)',
        }}
      >
        {currentImage ? (
          <img
            src={currentImage}
            alt={showHeatmap ? 'Heatmap visualization' : alt}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
            }}
            onError={(e) => {
              console.error('Image failed to load:', currentImage);
              console.error('Error details:', e);
            }}
            onLoad={() => {
              console.log(
                'Image loaded successfully:',
                showHeatmap ? 'heatmap' : 'original'
              );
            }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <p style={{ color: '#666666' }}>
              {showHeatmap ? 'No heatmap available' : 'No screenshot available'}
            </p>
          </div>
        )}
      </div>

      <div
        style={{
          backgroundColor: 'rgba(102, 102, 102, 0.05)',
          padding: '0.75rem',
          borderRadius: '0.375rem',
          fontSize: '14px',
        }}
      >
        <p style={{ color: '#666666', margin: 0 }}>
          <strong>About this heatmap:</strong> This visualization predicts where
          users are most likely to focus their attention based on element
          importance, position patterns (F-pattern, Z-pattern), and common user
          behavior. Red areas indicate high predicted attention, orange/yellow
          indicates moderate attention, and blue/green indicates lower attention
          areas.
        </p>
      </div>
    </div>
  );
}
