import type { Metadata } from 'next';
import './globals.css';
import Header from './components/Header';


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
      <body className="font-sans antialiased text-black bg-white min-h-screen flex flex-col" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
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
