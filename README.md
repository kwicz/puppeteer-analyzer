# URL Analyzer

A powerful web application that analyzes URLs and provides detailed insights about their content, SEO, technical aspects, and generates heatmaps.

## About

The URL Analyzer is designed to provide comprehensive insights into the content, SEO, and technical aspects of any given URL. It leverages modern web technologies to deliver fast and accurate analysis, making it an essential tool for web developers, SEO specialists, and digital marketers.

## Features

- URL analysis with detailed content metrics
- SEO analysis including meta tags, headings, and image optimization
- Technical analysis including performance, accessibility, and security
- Interactive heatmap generation
- Caching of analysis results
- PDF export functionality
- Public sharing of analysis results

## Tech Stack

- Next.js 14+
- TypeScript
- Puppeteer for web scraping and screenshots
- Prisma with PostgreSQL
- Tailwind CSS for styling
- shadcn/ui components

## How to Get Started

### Prerequisites

- Node.js 14+
- npm 6+
- PostgreSQL database

### Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up your environment variables:

   ```bash
   cp .env.example .env
   ```

   Then update the `.env` file with your database URL and other configuration.

4. Set up the database:

   ```bash
   npx prisma migrate dev
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### POST /api/analyze

Analyzes a URL and returns detailed insights.

Request body:

```json
{
  "url": "https://example.com"
}
```

Response:

```json
{
  "id": "string",
  "url": "string",
  "contentAnalysis": {
    "wordCount": number,
    "headings": {
      "h1": number,
      "h2": number,
      "h3": number,
      "h4": number,
      "h5": number,
      "h6": number
    },
    "images": {
      "total": number,
      "withAlt": number,
      "withoutAlt": number
    },
    "links": {
      "total": number,
      "internal": number,
      "external": number
    }
  },
  "seoAnalysis": {
    "title": {
      "present": boolean,
      "length": number,
      "value": string | null
    },
    "metaDescription": {
      "present": boolean,
      "length": number,
      "value": string | null
    },
    "headings": {
      "hasH1": boolean,
      "h1Count": number,
      "headingStructure": boolean
    },
    "images": {
      "altTextCoverage": number
    },
    "links": {
      "internalLinkCount": number,
      "externalLinkCount": number
    }
  },
  "technicalAnalysis": {
    "technologies": string[],
    "performance": {
      "loadTime": number,
      "resourceCount": number
    },
    "accessibility": {
      "score": number,
      "issues": string[]
    },
    "security": {
      "hasSSL": boolean,
      "securityHeaders": string[]
    }
  },
  "heatmapData": {
    "screenshot": string,
    "heatmapPoints": Array<{
      "x": number,
      "y": number,
      "value": number
    }>
  },
  "createdAt": string,
  "updatedAt": string
}
```
