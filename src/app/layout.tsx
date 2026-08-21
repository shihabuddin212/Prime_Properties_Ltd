import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MobileStickyBar from '@/components/layout/MobileStickyBar';
import SearchDrawer from '@/components/search/SearchDrawer';
import ChatbotWidget from '@/components/chatbot/ChatbotWidget';
import SessionProvider from '@/components/providers/SessionProvider';

export const metadata: Metadata = {
  title: 'Prime Properties BD | Luxury Apartments & Real Estate Bangladesh',
  description: 'Prime Properties BD is a premier luxury developer in Bangladesh. Explore upscale apartments, commercial spaces, and landowner joint ventures in Dhaka, Gulshan, Dhanmondi, and Chattogram.',
  metadataBase: new URL('https://primepropertiesbd.com'),
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/PPD.png',
    shortcut: '/PPD.png',
    apple: '/PPD.png',
  },
  openGraph: {
    title: 'Prime Properties BD | Luxury Apartments & Real Estate Bangladesh',
    description: 'Premier luxury real estate developers in Dhaka & Chattogram. We specialize in high-end residential flats, premium corporate blocks, and joint ventures.',
    url: 'https://primepropertiesbd.com',
    siteName: 'Prime Properties BD',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Prime Properties BD - Luxury Apartments',
      },
    ],
    locale: 'en_US',
    type: 'website',
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Structured Schema for Google RealEstateAgent Rich Snippet
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    'name': 'Prime Properties BD',
    'image': 'https://primepropertiesbd.com/og-image.jpg',
    '@id': 'https://primepropertiesbd.com',
    'url': 'https://primepropertiesbd.com',
    'telephone': '09639116107',
    'email': 'arif@primepropertiesbd.com',
    'priceRange': '$$$$',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': '89, Lalbagh, Water Works Rd',
      'addressLocality': 'Dhaka',
      'postalCode': '1211',
      'addressCountry': 'BD',
    },
    'sameAs': [
      'https://www.facebook.com/primepropertiesbd',
      'https://www.youtube.com/primepropertiesbd',
    ],
  };

  return (
    <html lang="en" className="h-full scroll-smooth antialiased" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/PPD.png" type="image/png" sizes="any" />
        <link rel="shortcut icon" href="/PPD.png" type="image/png" />
        <link rel="apple-touch-icon" href="/PPD.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-slate-surface text-primary-dark dark:bg-primary-navy dark:text-white font-sans pb-16 lg:pb-0" suppressHydrationWarning>
        <SessionProvider>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />

          {/* Navigation & Widget Overlays */}
          <MobileStickyBar />
          <SearchDrawer />
          <ChatbotWidget />
        </SessionProvider>
      </body>
    </html>
  );
}
