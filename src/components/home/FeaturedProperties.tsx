'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, MoveLeft, ArrowUpRight } from 'lucide-react';
import { Property } from '../properties/PropertyCard';
import { parseImages } from '@/lib/imageParser';

interface FeaturedPropertiesProps {
    properties: Property[];
}

export default function FeaturedProperties({ properties }: FeaturedPropertiesProps) {
    // Select features from database
    const featuredItems = properties.filter((p: any) => p.isFeatured && p.published).slice(0, 12);

    // Fallback to the 9 screenshot properties if database list is empty
    const finalItems = (featuredItems.length > 0 ? featuredItems : [
        {
            id: '1',
            title: 'The Lighthouse',
            slug: 'the-lighthouse-bashundhara',
            location: 'Block M, Bashundhara R/A, Dhaka',
            images: 'https://images.unsplash.com/photo-1545464693-f17e30d7ea2d?auto=format&fit=crop&q=80&w=800',
            status: 'Ongoing'
        },
        {
            id: '2',
            title: 'The Seasons',
            slug: 'the-seasons-bashundhara',
            location: 'Block I, Bashundhara R/A, Dhaka',
            images: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800',
            status: 'Ongoing'
        },
        {
            id: '3',
            title: 'Emerald Heights',
            slug: 'emerald-heights-bashundhara',
            location: 'Block K, Bashundhara R/A, Dhaka',
            images: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=800',
            status: 'Ready'
        },
        {
            id: '4',
            title: 'Magnifico',
            slug: 'magnifico-gulshan',
            location: 'Gulshan, Dhaka',
            images: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800',
            status: 'Ready'
        },
        {
            id: '5',
            title: 'Dew Drops',
            slug: 'dew-drops-bashundhara',
            location: 'Block D, Bashundhara R/A, Dhaka',
            images: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&q=80&w=800',
            status: 'Ongoing'
        },
        {
            id: '6',
            title: 'Hillside Haven',
            slug: 'hillside-haven-khulshi',
            location: 'North Khulshi, Chattogram',
            images: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&q=80&w=800',
            status: 'Upcoming'
        },
        {
            id: '7',
            title: 'Avalon',
            slug: 'avalon-uttara',
            location: 'Uttara, Dhaka',
            images: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=800',
            status: 'Ready'
        },
        {
            id: '8',
            title: 'La Montana',
            slug: 'la-montana-moghbazar',
            location: 'Moghbazar, Dhaka',
            images: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=800',
            status: 'Ready'
        },
        {
            id: '9',
            title: 'Fernhill',
            slug: 'fernhill-aftabnagar',
            location: 'Aftabnagar, Dhaka',
            images: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&q=80&w=800',
            status: 'Ready'
        }
    ]) as any[];

    return (
        <section id="featured-section" className="py-20 bg-neutral-900 text-white transition-colors">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">

                {/* Header Row (Button on Left, Heading on Right) */}
                <div className="flex flex-col-reverse md:flex-row justify-between items-start md:items-center gap-4 mb-12">
                    {/* View all button on the Left */}
                    <Link
                        href="/properties"
                        className="bg-transparent hover:bg-neutral-800 border border-neutral-700/80 text-white py-3 px-6 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer active:scale-95 shrink-0"
                    >
                        <MoveLeft size={14} />
                        <span>View all properties</span>
                    </Link>

                    {/* Featured properties heading on the Right */}
                    <div className="md:text-right">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white font-sans">
                            Featured properties
                        </h2>
                    </div>
                </div>

                {/* Grid (3 columns matching the screenshot layout) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {finalItems.map((item) => {
                        const imgPaths = parseImages(item.images);
                        const primaryImg = imgPaths[0] || 'https://images.unsplash.com/photo-1545464693-f17e30d7ea2d?auto=format&fit=crop&q=80&w=800';

                        return (
                            <Link
                                key={item.id}
                                href={`/properties/${item.slug}`}
                                className="group relative aspect-[4/5] rounded-2xl overflow-hidden bg-neutral-800 shadow-lg border border-neutral-850 block"
                            >
                                {/* Background Image */}
                                <img
                                    src={primaryImg}
                                    alt={item.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
                                    loading="lazy"
                                />

                                {/* Dark Bottom Overlay containing details */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/95 via-[#111111]/45 to-transparent flex flex-col justify-end p-5 transition-all duration-300">
                                    <h3 className="text-white font-bold text-lg group-hover:text-luxury-gold transition-colors duration-300 font-sans">
                                        {item.title}
                                    </h3>
                                    <p className="text-xs text-neutral-300 font-light flex items-center gap-1.5 mt-1.5 font-sans">
                                        <MapPin size={11} className="text-luxury-gold shrink-0" />
                                        <span>{item.location}</span>
                                    </p>
                                </div>

                                {/* Hover Detail Badge Action */}
                                <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-luxury-gold text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300 shadow-md">
                                    <ArrowUpRight size={16} />
                                </div>
                            </Link>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}
