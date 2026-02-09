import type { Metadata } from 'next';
import { Inter_Tight } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';
import Header from './components/Header';

const interTight = Inter_Tight({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Hugh Gramelspacher',
  description: 'Personal website of Hugh Gramelspacher',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${interTight.className} antialiased bg-white min-h-screen flex flex-col`}>
        <Header />
        <div className="flex flex-col min-h-screen">
          <div className="pt-16 md:pt-0 md:pl-64">
            <main className="flex-1 w-full max-w-7xl px-4 py-8 md:px-20 md:py-20">
              {children}
            </main>
          </div>
        </div>
        <Analytics />
      </body>
    </html>
  );
}
