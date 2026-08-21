import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
import { parseImages, cleanMapUrl } from '@/lib/imageParser';
import ImageSlider from '@/components/details/ImageSlider';
import LeadCaptureForm from '@/components/details/LeadCaptureForm';
import { MapPin, Maximize2, Bed, Bath, Layers, CheckCircle, Building2, Calendar, FileText, Play, Video } from 'lucide-react';

type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const property = await prisma.property.findUnique({ where: { slug } });
    if (!property) return { title: 'Property Not Found' };
    return {
        title: `${property.title} | Prime Properties BD`,
        description: property.description.slice(0, 160),
        openGraph: {
            title: property.title,
            description: property.description.slice(0, 160),
            images: property.images ? [property.images.split(',')[0].trim()] : [],
        },
    };
}

export default async function PropertyDetailPage({ params }: Props) {
    const { slug } = await params;
    const property = await prisma.property.findUnique({ where: { slug }, });

    if (!property || !property.published) notFound();

    const images = parseImages(property.images);
    const amenities = property.amenities ? property.amenities.split(',').map(a => a.trim()).filter(Boolean) : [];
    const floorPlans = parseImages(property.floorPlans);

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'SingleFamilyResidence',
        name: property.title,
        description: property.description,
        address: {
            '@type': 'PostalAddress',
            addressLocality: property.location,
            addressCountry: 'BD',
        },
        numberOfRooms: property.beds,
        floorSize: { '@type': 'QuantitativeValue', value: property.sqft, unitText: 'SQF' },
        url: `https://primepropertiesbd.com/properties/${property.slug}`,
    };

    return (
        <div className="pt-24 pb-20 min-h-screen bg-[#0b0f17] text-white">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Breadcrumb */}
                <nav className="text-xs text-gray-500 mb-6 flex items-center gap-2 font-light">
                    <a href="/" className="hover:text-luxury-gold transition font-normal select-none">Home</a>
                    <span>/</span>
                    <a href="/properties" className="hover:text-luxury-gold transition font-normal select-none">Properties</a>
                    <span>/</span>
                    <span className="text-gray-400 font-normal">{property.title}</span>
                </nav>

                {/* Main Hero Slider */}
                <div className="mb-10">
                    <ImageSlider images={images} title={property.title} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                    {/* Left Column - Details */}
                    <div className="lg:col-span-2 space-y-12">

                        {/* Title & Description */}
                        <div className="space-y-4">
                            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white font-sans">
                                {property.title}
                            </h1>
                            <p className="text-sm text-neutral-400 dark:text-neutral-400 font-light leading-relaxed max-w-3xl whitespace-pre-line">
                                {property.description}
                            </p>
                        </div>

                        {/* Floor Plan Section */}
                        {floorPlans.length > 0 && (
                            <div className="space-y-4 pt-4 border-t border-white/15">
                                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
                                    Floor plan
                                </h2>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    {floorPlans.map((url, idx) => (
                                        <div key={idx} className="group relative rounded-xl overflow-hidden bg-neutral-900 border border-white/10 aspect-square flex items-center justify-center p-2 hover:border-luxury-gold transition-all duration-300">
                                            <img
                                                src={url}
                                                alt={`Floor Plan ${idx + 1}`}
                                                className="max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-105"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Property Video Section */}
                        {property.videoUrl && (
                            <div className="space-y-4 pt-4 border-t border-white/15">
                                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide flex items-center gap-2">
                                    Property video
                                </h2>
                                <div className="relative rounded-[2rem] overflow-hidden bg-[#111] border border-white/10 aspect-video shadow-2xl group flex items-center justify-center">
                                    {property.videoUrl.includes('youtube.com') || property.videoUrl.includes('youtu.be') ? (
                                        <iframe
                                            src={property.videoUrl.replace('watch?v=', 'embed/')}
                                            title={`${property.title} Video Showcase`}
                                            className="w-full h-full border-0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
                                    ) : (
                                        <video
                                            src={property.videoUrl}
                                            controls
                                            className="w-full h-full object-cover"
                                            preload="metadata"
                                            playsInline
                                        />
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Location / Google Map Frame Section */}
                        <div className="space-y-4 pt-4 border-t border-white/15">
                            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
                                Location
                            </h2>
                            <div className="rounded-[2.2rem] overflow-hidden border border-white/10 h-[380px] bg-neutral-950/80 shadow-2xl relative">
                                {property.mapUrl ? (
                                    <iframe
                                        src={cleanMapUrl(property.mapUrl)}
                                        className="w-full h-full border-none filter invert contrast-125 saturate-50 opacity-90"
                                        allowFullScreen
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                    />
                                ) : (
                                    <iframe
                                        src={`https://www.google.com/maps/embed/v1/place?key=placeholder&q=${encodeURIComponent(property.address || property.location)}`}
                                        className="w-full h-full border-none filter invert contrast-125 saturate-50 opacity-90"
                                        allowFullScreen
                                        loading="lazy"
                                    />
                                )}

                                {/* Float Location Badge Card inside Map */}
                                <div className="absolute bottom-5 left-5 bg-neutral-950/95 backdrop-blur-md border border-neutral-800 rounded-2xl p-4 max-w-sm flex gap-3 shadow-2xl animate-fade-in">
                                    <div className="w-12 h-12 rounded-xl bg-luxury-gold/15 flex items-center justify-center shrink-0 border border-luxury-gold/20">
                                        <MapPin size={18} className="text-luxury-gold" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-luxury-gold tracking-widest">Address</p>
                                        <p className="text-xs text-white font-medium mt-0.5 leading-relaxed">
                                            {property.address || property.location}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Amenities */}
                        {amenities.length > 0 && (
                            <div className="space-y-4 pt-4 border-t border-white/15">
                                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide flex items-center gap-2">
                                    <CheckCircle size={20} className="text-luxury-gold" /> Amenities &amp; Features
                                </h2>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {amenities.map((amenity) => (
                                        <div key={amenity} className="flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-neutral-300 font-light hover:border-luxury-gold/50 transition">
                                            <CheckCircle size={13} className="text-luxury-gold shrink-0" />
                                            <span>{amenity}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>

                    {/* Right Column - Sticky Sidebar */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="sticky top-28 space-y-6">

                            {/* Schedule A Visit Button */}
                            <a
                                href="#contact-agent-form"
                                className="w-full text-center bg-white/5 border border-white/10 hover:border-luxury-gold/40 text-white dark:text-white py-3.5 px-6 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-98 shadow-md"
                            >
                                <span>Schedule a visit</span>
                                <Calendar size={14} className="text-luxury-gold" />
                            </a>

                            {/* At a Glance Table Card */}
                            <div className="bg-[#111622]/80 backdrop-blur-md border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-luxury-gold/10 rounded-full blur-3xl pointer-events-none" />
                                <h3 className="text-base font-bold text-white tracking-wider uppercase border-b border-white/10 pb-4 mb-4 font-sans">
                                    At a Glance
                                </h3>

                                <div className="divide-y divide-white/5 text-[11px] font-sans">
                                    <div className="py-3 flex justify-between gap-3 text-neutral-400">
                                        <span className="font-light shrink-0">Address</span>
                                        <span className="text-white text-right font-medium">{property.address || property.location}</span>
                                    </div>
                                    <div className="py-3 flex justify-between gap-3 text-neutral-400">
                                        <span className="font-light shrink-0">Land Area</span>
                                        <span className="text-white text-right font-medium">{property.land || 'N/A'}</span>
                                    </div>
                                    <div className="py-3 flex justify-between gap-3 text-neutral-400">
                                        <span className="font-light shrink-0">No. of Floors</span>
                                        <span className="text-white text-right font-medium">{property.floors || 'N/A'}</span>
                                    </div>
                                    <div className="py-3 flex justify-between gap-3 text-neutral-400">
                                        <span className="font-light shrink-0">Apartment/Floor</span>
                                        <span className="text-white text-right font-medium">{property.unitsPerFloor || 'N/A'}</span>
                                    </div>
                                    <div className="py-3 flex justify-between gap-3 text-neutral-400">
                                        <span className="font-light shrink-0">Apartment Size (sft)</span>
                                        <span className="text-white text-right font-medium font-mono">{property.sqft > 0 ? `${property.sqft} sft` : 'On Request'}</span>
                                    </div>
                                    <div className="py-3 flex justify-between gap-3 text-neutral-400">
                                        <span className="font-light shrink-0">Bedroom</span>
                                        <span className="text-white text-right font-medium font-mono">{property.beds > 0 ? property.beds : 'N/A'}</span>
                                    </div>
                                    <div className="py-3 flex justify-between gap-3 text-neutral-400">
                                        <span className="font-light shrink-0">Bathroom</span>
                                        <span className="text-white text-right font-medium font-mono">{property.baths > 0 ? property.baths : 'N/A'}</span>
                                    </div>
                                    <div className="py-3 flex justify-between gap-3 text-neutral-400">
                                        <span className="font-light shrink-0">Launch Date</span>
                                        <span className="text-white text-right font-medium">{property.launchDate || 'N/A'}</span>
                                    </div>
                                    <div className="py-3 flex justify-between gap-3 text-neutral-400">
                                        <span className="font-light shrink-0">Expected Completion date</span>
                                        <span className="text-white text-right font-medium">{property.completionDate || 'N/A'}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3 mt-6 border-t border-white/10 pt-5">
                                    <a
                                        href="/construction"
                                        className="bg-white text-neutral-900 border border-neutral-200 py-2.5 px-3 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all hover:bg-neutral-100 active:scale-95 text-center font-sans"
                                    >
                                        <span>Status</span>
                                    </a>
                                    {property.brochureUrl ? (
                                        <a
                                            href={property.brochureUrl}
                                            download
                                            className="bg-[#111] hover:bg-neutral-800 text-white border border-neutral-800 py-2.5 px-3 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all active:scale-95 text-center font-sans"
                                        >
                                            <FileText size={10} className="text-luxury-gold" />
                                            <span>Brochure</span>
                                        </a>
                                    ) : (
                                        <button
                                            disabled
                                            className="bg-white/5 border border-white/10 opacity-40 text-neutral-500 py-2.5 px-3 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 font-sans"
                                        >
                                            <span>No Brochure</span>
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Lead Capture Form Card */}
                            <div id="contact-agent-form" className="bg-[#111622]/80 backdrop-blur-md border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
                                <h3 className="text-base font-bold text-white tracking-wider uppercase border-b border-white/10 pb-4 mb-4 font-sans">
                                    I am interested in this property
                                </h3>
                                <LeadCaptureForm propertyId={property.id} propertyTitle={property.title} />
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
