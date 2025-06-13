import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createServer, Server } from 'http';
import { parse } from 'url';
import next from 'next';
import { prisma } from '@/lib/prisma';

const app = next({ dev: true });
const handle = app.getRequestHandler();

describe('URL Analyzer API', () => {
  let server: Server;
  const port = 3001;

  beforeAll(async () => {
    await app.prepare();
    server = createServer((req, res) => {
      const parsedUrl = parse(req.url!, true);
      handle(req, res, parsedUrl);
    });
    server.listen(port);
  });

  afterAll(async () => {
    await new Promise((resolve) => server.close(resolve));
    await prisma.$disconnect();
  });

  it('should analyze a valid URL', async () => {
    const response = await fetch(`http://localhost:${port}/api/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: 'https://example.com',
      }),
    });

    expect(response.status).toBe(200);
    const data = await response.json();

    // Verify the response structure
    expect(data).toHaveProperty('id');
    expect(data).toHaveProperty('url', 'https://example.com');
    expect(data).toHaveProperty('contentAnalysis');
    expect(data).toHaveProperty('seoAnalysis');
    expect(data).toHaveProperty('technicalAnalysis');
    expect(data).toHaveProperty('heatmapData');

    // Verify content analysis
    expect(data.contentAnalysis).toHaveProperty('wordCount');
    expect(data.contentAnalysis).toHaveProperty('headings');
    expect(data.contentAnalysis).toHaveProperty('images');
    expect(data.contentAnalysis).toHaveProperty('links');

    // Verify SEO analysis
    expect(data.seoAnalysis).toHaveProperty('title');
    expect(data.seoAnalysis).toHaveProperty('metaDescription');
    expect(data.seoAnalysis).toHaveProperty('headings');
    expect(data.seoAnalysis).toHaveProperty('images');
    expect(data.seoAnalysis).toHaveProperty('links');

    // Verify technical analysis
    expect(data.technicalAnalysis).toHaveProperty('technologies');
    expect(data.technicalAnalysis).toHaveProperty('performance');
    expect(data.technicalAnalysis).toHaveProperty('accessibility');
    expect(data.technicalAnalysis).toHaveProperty('security');

    // Verify heatmap data
    expect(data.heatmapData).toHaveProperty('screenshot');
    expect(data.heatmapData).toHaveProperty('heatmapPoints');
    expect(Array.isArray(data.heatmapData.heatmapPoints)).toBe(true);
  });

  it('should return 400 for invalid URL', async () => {
    const response = await fetch(`http://localhost:${port}/api/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: 'not-a-valid-url',
      }),
    });

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data).toHaveProperty('error', 'Invalid request data');
  });

  it('should return cached results for recently analyzed URL', async () => {
    // First request
    const firstResponse = await fetch(`http://localhost:${port}/api/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: 'https://example.com',
      }),
    });

    const firstData = await firstResponse.json();

    // Second request (should be cached)
    const secondResponse = await fetch(`http://localhost:${port}/api/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: 'https://example.com',
      }),
    });

    const secondData = await secondResponse.json();

    // Verify that both responses are identical
    expect(secondData.id).toBe(firstData.id);
    expect(secondData.createdAt).toBe(firstData.createdAt);
  });
});
