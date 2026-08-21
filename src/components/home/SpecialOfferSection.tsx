'use client';

import React from 'react';
import Link from 'next/link';
import { MoveRight } from 'lucide-react';

interface SpecialOfferItem {
    id: string;
    title: string;
    slug: string;
    location: string;
    sizeRange: string;
    beds: string;
    baths: string;
    land: string;
    image: string;
    logoBadge?: string;
}

const defaultOffers: SpecialOfferItem[] = [
    {
        id: '1',
        title: 'Cosmopolis',
        slug: 'cosmopolis-mirpur',
        location: 'Mirpur, Dhaka',
        sizeRange: '1042 to 2229 sft',
        beds: '3-4',
        baths: '3',
        land: '47 Katha',
        image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&q=80&w=600',
        logoBadge: 'COSMOPOLIS',
    },
    {
        id: '2',
        title: 'Park Royale',
        slug: 'beverly-residence-gulshan',
        location: 'Gulshan, Dhaka',
        sizeRange: '3200 to 4500 sft',
        beds: '4',
        baths: '4-5',
        land: '6.43 Katha',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=600',
        logoBadge: 'PARK ROYALE',
    },
    {
        id: '3',
        title: 'Resonance',
        slug: 'aqualuna-dhanmondi',
        location: 'Adabor, Dhaka',
        sizeRange: '1850 to 2400 sft',
        beds: '3',
        baths: '3',
        land: '8 Katha',
        image: 'https://images.unsplash.com/photo-1545464693-f17e30d7ea2d?auto=format&fit=crop&q=80&w=600',
        logoBadge: 'RESONANCE',
    },
    {
        id: '4',
        title: 'Aqualuna',
        slug: 'aqualuna-dhanmondi',
        location: 'Dhanmondi, Dhaka',
        sizeRange: '4940 sft',
        beds: '4',
        baths: '6',
        land: '11.69 Katha',
        image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=600',
        logoBadge: 'AQUALUNA',
    }
];

export default function SpecialOfferSection() {
    const [offers, setOffers] = React.useState<SpecialOfferItem[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchOffers = async () => {
            try {
                const res = await fetch('/api/special-offers');
                if (res.ok) {
                    const data = await res.json();
                    if (Array.isArray(data) && data.length > 0) {
                        setOffers(data);
                    } else {
                        setOffers(defaultOffers);
                    }
                } else {
                    setOffers(defaultOffers);
                }
            } catch (err) {
                console.error(err);
                setOffers(defaultOffers);
            } finally {
                setLoading(false);
            }
        };
        fetchOffers();
    }, []);

    const displayOffers = offers.length > 0 ? offers : defaultOffers;

    return (
        <section className="py-20 bg-white dark:bg-primary-navy/20 transition-colors">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">

                {/* Header Row */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
                            Special offer
                        </h2>
                        <p className="text-sm font-light text-neutral-500 dark:text-neutral-400 mt-2">
                            Explore our ongoing projects across Dhaka and Chattogram.
                        </p>
                    </div>
                    <Link
                        href="/properties"
                        className="bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-900 py-3 px-6 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-md inline-block active:scale-95 shrink-0"
                    >
                        <span>View all properties</span>
                        <MoveRight size={14} />
                    </Link>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {displayOffers.map((item) => (
                        <Link
                            key={item.id}
                            href={`/properties/${item.slug}`}
                            className="group relative flex flex-col cursor-pointer"
                        >
                            {/* Card Image Container */}
                            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-neutral-100 shadow-sm border border-neutral-200/20">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
                                    loading="lazy"
                                />

                                {/* Badge Special Offer (Always visible) */}
                                <div className="absolute top-4 left-4 bg-[#111111]/90 backdrop-blur-sm border border-neutral-800 text-white rounded-lg px-3.5 py-1.5 text-[10px] uppercase font-bold tracking-wider z-10">
                                    Special Offer
                                </div>

                                {/* Arrow Button (Bottom right) */}
                                <div className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-white text-neutral-900 border border-neutral-200 shadow-lg flex items-center justify-center group-hover:scale-105 transition-all duration-300 z-20">
                                    <MoveRight size={18} />
                                </div>

                                {/* HOVER OVERLAY (Displays Size, Bed, Bath, Land on Hover) */}
                                <div className="absolute inset-0 bg-neutral-950/80 backdrop-blur-sm p-6 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
                                    {/* Logo Badge in Hover */}
                                    <div className="border border-white/20 rounded-lg p-2 bg-white/5 backdrop-blur-sm inline-block max-w-[140px]">
                                        <p className="text-[9px] font-bold text-white tracking-widest uppercase text-center truncate">
                                            {item.logoBadge || 'PRIME'}
                                        </p>
                                    </div>

                                    {/* Specs inside hover */}
                                    <div className="space-y-4 pr-10">
                                        <div>
                                            <p className="text-[8px] uppercase tracking-widest text-neutral-400 font-medium">Size</p>
                                            <p className="text-xs font-semibold text-white mt-0.5">{item.sizeRange}</p>
                                        </div>

                                        <div className="grid grid-cols-3 gap-2 border-t border-white/10 pt-3">
                                            <div>
                                                <p className="text-[8px] uppercase tracking-widest text-neutral-400 font-medium">Bed</p>
                                                <p className="text-[11px] font-semibold text-white mt-0.5">{item.beds}</p>
                                            </div>
                                            <div>
                                                <p className="text-[8px] uppercase tracking-widest text-neutral-400 font-medium">Bath</p>
                                                <p className="text-[11px] font-semibold text-white mt-0.5">{item.baths}</p>
                                            </div>
                                            <div>
                                                <p className="text-[8px] uppercase tracking-widest text-neutral-400 font-medium">Land</p>
                                                <p className="text-[11px] font-semibold text-white mt-0.5 truncate">{item.land}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* View Details CTA on Hover */}
                                    <div className="flex items-center gap-2 text-white text-xs font-bold uppercase tracking-wider">
                                        <span>View Full Details</span>
                                        <MoveRight size={14} />
                                    </div>
                                </div>
                            </div>

                            {/* Details below card */}
                            <div className="mt-3">
                                <p className="text-[10px] text-neutral-400 dark:text-neutral-500 uppercase tracking-widest font-bold">
                                    {item.location}
                                </p>
                                <p className="text-base font-semibold text-neutral-800 dark:text-white group-hover:text-luxury-gold dark:group-hover:text-luxury-gold transition-colors mt-1">
                                    {item.title}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
