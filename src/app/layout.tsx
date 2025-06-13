import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "URL Analyzer - Improve Your Website's User Experience",
  description:
    'Analyze your website for user experience insights with predictive heatmaps and content analysis.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' className={inter.variable}>
      <body
        className='font-sans antialiased min-h-screen flex flex-col'
        suppressHydrationWarning
      >
        <Header />
        <div className='flex-1'>{children}</div>
        <Footer />
      </body>
    </html>
  );
}
