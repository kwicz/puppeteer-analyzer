# Product Requirements Document (PRD): URL Analyzer

## 1. Introduction/Overview

The URL Analyzer is a modern, full-stack web application designed to help website owners assess and improve their site's user experience. By providing a public URL, users receive actionable insights—including predictive heatmaps and content analysis—enabling them to identify areas for improvement and increase user conversion. The tool is tailored for non-technical website owners who want to enhance user experience but are unsure where to begin.

## 2. Goals

- Allow users to analyze any public website URL for user experience insights.
- Generate predictive heatmaps to visualize user attention and interaction zones.
- Provide actionable content and technical analysis for improvement suggestions.
- Store each analysis in a database for future reference.
- Display results in a polished, user-friendly interface.
- Normalize and validate user-input URLs for robust analysis.

## 3. User Stories

- As a site owner, I want to check in on the user experience of my website and find ways to improve different pages so that I can convert more users.
- As a site owner, I want to see a predictive heatmap of my page so I can understand where users are likely to focus their attention.
- As a site owner, I want the system to accept simple URLs (e.g., "thegood.com") and automatically normalize them for analysis.
- As a site owner, I want to view my analysis results in a clear, visually appealing dashboard.

## 4. Functional Requirements

1. The system must allow users to input any public website URL for analysis.
2. The system must normalize and validate URLs (e.g., add https:// if missing, handle www, etc.).
3. The system must generate a predictive heatmap for the provided URL.
4. The system must perform content and technical analysis, including:
   - SEO insights (title, meta tags, headings, structured data)
   - Performance metrics (load time, page size)
   - Technical stack detection
   - Content analysis (word count, images, links)
   - Accessibility basics (alt texts, heading structure)
5. The system must store each analysis in a PostgreSQL database.
6. The system must display analysis results in a polished, responsive UI.
7. The system must allow users to share analysis results via open-access public links.
8. The system must allow users to export analysis reports as PDFs, including all analysis data.
9. The system must provide clear error messages for invalid or unreachable URLs.

## 5. Non-Goals (Out of Scope)

- User authentication, login, and account management (future feature).
- Analysis collection/history page (future feature).
- Analysis of private or authenticated pages.
- Exporting to formats other than PDF (e.g., CSV, Excel).
- Rate limiting and advanced access controls for public sharing links.

## 6. Design Considerations

- **Brand Colors:**
  - Primary Blue: #0057B7
  - Secondary Blue: #003D80
  - Accent Yellow: #FFCC00
  - Dark Gray: #333333
  - Medium Gray: #666666
  - Light Gray: #F7F7F7
- **Typography:**
  - Font: Inter
  - Heading 1: 36px, Bold
  - Heading 2: 28px, SemiBold
  - Heading 3: 22px, SemiBold
  - Heading 4: 18px, SemiBold
  - Body Text: 16px, Regular
  - Secondary Text: 14px, Regular
  - Strong Text: 16px, Bold
- **UI/UX:**
  - Clean, professional, and accessible design
  - Responsive for mobile and desktop
  - Use shadcn/ui components and Lucide React icons
  - Clear loading and error states

## 7. Technical Considerations

- Use Next.js 14+ with App Router and React 18+ (Server Components where appropriate).
- Use Prisma ORM with PostgreSQL for data storage.
- Use Puppeteer for web scraping and screenshot/heatmap generation.
- Use Zod for input validation and type safety.
- Store screenshots and analysis data in the database (or S3 if configured).
- Normalize URLs before analysis to handle user input edge cases.
- All analysis endpoints should be RESTful and return type-safe responses.

## 8. Success Metrics

- Users can analyze a public URL and receive a predictive heatmap and content analysis within 30 seconds.
- Analysis results are stored and viewable in a polished UI.
- The system correctly normalizes and validates user-input URLs.
- Public sharing links work without authentication.
- Exported PDFs include all analysis data.
- The UI matches the provided brand guidelines and is fully responsive.

## 9. Open Questions

- Should there be a limit on the number of analyses per user/IP to prevent abuse?
- Are there any legal/privacy considerations for storing and sharing screenshots of analyzed pages?
- Should the system support additional languages or non-English content in the future?
