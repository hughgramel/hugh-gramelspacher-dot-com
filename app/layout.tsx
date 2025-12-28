import type { Metadata } from 'next';
import { Inter_Tight } from 'next/font/google';
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
          <div className="pl-64"> {/* Added pl-64 wrapper */}
            <main className="flex-1 w-full max-w-7xl px-20 py-20"> {/* Main padding remains px-12 py-20 as per snippet */}
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
