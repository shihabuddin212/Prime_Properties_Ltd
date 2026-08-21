'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Maximize2, Bed, Bath, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

export interface Property {
    id: string;
    title: string;
    slug: string;
    description: string;
    location: string;
    type: string;
    status: string;
    price: string;
    sqft: number;
    beds: number;
    baths: number;
    land: string;
    images: string;
    isFeatured: boolean;
}

interface PropertyCardProps {
    property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
    const images = property.images ? property.images.split(',') : [];
    const firstImage = images[0] || 'https://images.unsplash.com/photo-1545464693-f17e30d7ea2d?auto=format&fit=crop&q=80&w=800';

    // Badge colors matching status
    const getStatusStyle = (status: string) => {
        switch (status.toLowerCase()) {
            case 'ready':
                return 'bg-green-500/10 border-green-500/30 text-green-500';
            case 'ongoing':
                return 'bg-blue-500/10 border-blue-500/30 text-blue-500';
            case 'upcoming':
                return 'bg-luxury-gold/10 border-luxury-gold/30 text-luxury-gold';
            case 'commercial':
                return 'bg-purple-500/10 border-purple-500/30 text-purple-500';
            default:
                return 'bg-gray-500/10 border-gray-500/30 text-gray-400';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-primary-navy border border-gray-100 dark:border-gray-800/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl dark:shadow-none hover:border-luxury-gold/30 hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full group"
        >
            {/* Property Image & Status overlay */}
            <div className="relative aspect-[3/2] w-full overflow-hidden bg-gray-100">
                <img
                    src={firstImage}
                    alt={property.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                />

                {/* Badges Container */}
                <div className="absolute top-4 left-4 flex gap-2 z-10">
                    <span className={`px-3 py-1 rounded-full border text-[10px] uppercase font-bold tracking-wider backdrop-blur-md ${getStatusStyle(property.status)}`}>
                        {property.status}
                    </span>
                    <span className="bg-primary-dark/80 border border-white/10 text-white px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider backdrop-blur-md">
                        {property.type}
                    </span>
                </div>

                {/* Hover View Detail Overlay */}
                <div className="absolute inset-0 bg-primary-navy/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
                    <Link
                        href={`/properties/${property.slug}`}
                        className="w-12 h-12 rounded-full bg-luxury-gold hover:bg-gold-hover text-white flex items-center justify-center transform scale-75 group-hover:scale-100 transition-all duration-300 shadow-lg"
                    >
                        <ArrowUpRight size={20} />
                    </Link>
                </div>
            </div>

            {/* Property Content */}
            <div className="p-6 flex-grow flex flex-col justify-between">

                <div className="space-y-3">

                    {/* Location */}
                    <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-xs font-light">
                        <MapPin size={12} className="text-luxury-gold" />
                        {property.location}
                    </div>

                    {/* Title */}
                    <h3 className="text-gray-800 dark:text-white font-bold text-lg leading-snug group-hover:text-luxury-gold transition-colors duration-300">
                        <Link href={`/properties/${property.slug}`}>
                            {property.title}
                        </Link>
                    </h3>

                    {/* Mini description */}
                    <p className="text-xs text-gray-400 dark:text-gray-400 leading-relaxed font-light line-clamp-2">
                        {property.description}
                    </p>

                </div>

                {/* Specifications */}
                <div className="border-t border-gray-100 dark:border-gray-800/80 my-5 pt-4">
                    <div className="grid grid-cols-3 gap-2 text-center">

                        {/* Size */}
                        <div className="flex flex-col items-center">
                            <span className="text-[10px] uppercase tracking-wider text-gray-400 font-light flex items-center gap-1 mb-0.5">
                                <Maximize2 size={10} className="text-luxury-gold" />
                                Size
                            </span>
                            <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                                {property.sqft > 0 ? `${property.sqft} sft` : property.land}
                            </span>
                        </div>

                        {/* Bedrooms */}
                        <div className={`flex flex-col items-center border-x border-gray-100 dark:border-gray-800 ${property.type === 'Land' ? 'opacity-30' : ''}`}>
                            <span className="text-[10px] uppercase tracking-wider text-gray-400 font-light flex items-center gap-1 mb-0.5">
                                <Bed size={10} className="text-luxury-gold" />
                                Beds
                            </span>
                            <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                                {property.type === 'Land' ? '-' : property.beds}
                            </span>
                        </div>

                        {/* Bathrooms */}
                        <div className={`flex flex-col items-center ${property.type === 'Land' ? 'opacity-30' : ''}`}>
                            <span className="text-[10px] uppercase tracking-wider text-gray-400 font-light flex items-center gap-1 mb-0.5">
                                <Bath size={10} className="text-luxury-gold" />
                                Baths
                            </span>
                            <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                                {property.type === 'Land' ? '-' : property.baths}
                            </span>
                        </div>

                    </div>
                </div>

                {/* Footer actions / Price */}
                <div className="flex items-center justify-between pt-1 border-t border-gray-50/50">
                    <div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-light">Investment</p>
                        <p className="text-sm font-bold text-luxury-gold dark:text-luxury-gold">
                            {property.price}
                        </p>
                    </div>

                    <Link
                        href={`/properties/${property.slug}`}
                        className="text-xs font-semibold uppercase tracking-wider text-gray-800 dark:text-white group-hover:text-luxury-gold transition-colors flex items-center gap-1"
                    >
                        Details
                        <ArrowUpRight size={14} />
                    </Link>
                </div>

            </div>
        </motion.div>
    );
}
