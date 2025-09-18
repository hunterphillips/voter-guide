import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata = {
  title: 'Informed Voter',
  description: 'Access important dates and compare candidates side-by-side for state and local elections.',
  openGraph: {
    title: 'Informed Voter - Make Informed Voting Decisions',
    description: 'Access important dates and compare candidates side-by-side for state and local elections.',
    url: 'https://informed-voter.com',
    siteName: 'Informed Voter',
    images: [
      {
        url: 'https://informed-voter.com/voter-guide-hero.png',
        width: 1200,
        height: 630,
        alt: 'Informed Voter - Make Informed Voting Decisions',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Informed Voter - Make Informed Voting Decisions',
    description: 'Access important dates and compare candidates side-by-side for state and local elections.',
    images: ['https://informed-voter.com/voter-guide-hero.png'],
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
