import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { ChatbotWidget } from '@/components/ChatbotWidget';
import { Toaster } from '@/components/ui/Toaster';
import { ThemeProvider } from '@/components/ThemeProvider';

export const metadata: Metadata = {
  title: { default: 'Mentroo — Expert Career Guidance Platform', template: '%s | Mentroo' },
  description: 'Get personalized career guidance from expert consultants in Education, Business, Sports, Medical, Engineering and more. AI-powered career path recommendations.',
  keywords: ['career guidance', 'college counseling', 'career consultant', 'study abroad', 'IIT JEE', 'NEET', 'MBA admissions'],
  openGraph: {
    title: 'Mentroo — Expert Career Guidance Platform',
    description: 'Connect with expert consultants for personalized career guidance.',
    type: 'website',
    locale: 'en_IN',
  },
  robots: { index: true, follow: true },
  viewport: { width: 'device-width', initialScale: 1 },
  themeColor: '#a855f7',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="min-h-screen antialiased transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <Navbar />
          <main>{children}</main>
          <ChatbotWidget />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
