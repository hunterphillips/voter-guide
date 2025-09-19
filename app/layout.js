import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { APP_CONFIG } from '@/lib/config';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata = {
  title: APP_CONFIG.siteName,
  description: APP_CONFIG.description,
  metadataBase: new URL(APP_CONFIG.baseUrl),
  alternates: {
    canonical: APP_CONFIG.baseUrl,
  },
  openGraph: {
    title: APP_CONFIG.title,
    description: APP_CONFIG.description,
    url: APP_CONFIG.baseUrl,
    siteName: APP_CONFIG.siteName,
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: APP_CONFIG.title,
    description: APP_CONFIG.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
