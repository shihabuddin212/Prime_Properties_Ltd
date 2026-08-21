import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
import HeroSection from '@/components/home/HeroSection';
import SpecialOfferSection from '@/components/home/SpecialOfferSection';
import FeaturedProperties from '@/components/home/FeaturedProperties';
import AffluenceVideo from '@/components/home/AffluenceVideo';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import SBUSection from '@/components/home/SBUSection';

export const metadata: Metadata = {
  title: 'Prime Properties BD | Premier Luxury Real Estate in Bangladesh',
  description: 'Discover luxury apartments, commercial spaces, and landowner JVs in Dhaka, Gulshan, Dhanmondi, and Chattogram. Bangladesh\'s most trusted premium real estate developer.',
};

export default async function HomePage() {
  const properties = await prisma.property.findMany({
    where: { published: true },
    orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
  });

  return (
    <>
      <HeroSection />

      {/* 1. Special Offer Section with Hover details overlays */}
      <SpecialOfferSection />

      {/* 2. Featured Properties Section (Header on Right, View All on Left, details inside card) */}
      <FeaturedProperties properties={properties as any} />

      {/* 3. Indulge in Affluence Video section */}
      <AffluenceVideo />

      {/* 4. What do our customers say? Testimonial slider section */}
      <TestimonialsSection />

      {/* 5. SBU (Strategic Business Units) section */}
      <SBUSection />
    </>
  );
}
