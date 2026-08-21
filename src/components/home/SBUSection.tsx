'use client';

import React from 'react';
import { MoveRight } from 'lucide-react';
import Link from 'next/link';

interface SBUType {
    id: string;
    title: string;
    description: string;
    image: string;
    logoBadge?: string;
    logoImg?: string;
    shapeClass: string;
    link: string;
}

const sbus: SBUType[] = [
    {
        id: '1',
        title: 'Prime Residences',
        description: 'Elite housing developments crafting architectures of distinction.',
        image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=600',
        logoBadge: 'PRIME LIVING',
        shapeClass: 'rounded-t-2xl rounded-br-[4rem] rounded-bl-2xl',
        link: '/properties?type=Apartment'
    },
    {
        id: '2',
        title: 'MS ONLINE',
        description: 'Corporate offices and retail ISP offering maximum productivity.',
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=600',
        logoImg: '/ms-online-logo.png',
        shapeClass: 'rounded-tr-[5rem] rounded-bl-[5rem] rounded-tl-2xl rounded-br-2xl',
        link: 'https://www.msonlinebd.com/'
    },
    {
        id: '3',
        title: 'RM COMMUNICATION LTD.',
        description: 'Providing premium aggregates and concrete blocks for sound foundations.',
        image: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&q=80&w=600',
        logoImg: '/rm-communication-logo.png',
        shapeClass: 'rounded-tl-[5rem] rounded-br-[5rem] rounded-tr-2xl rounded-bl-2xl',
        link: 'https://rmcommunicationltd.com/'
    },
    {
        id: '4',
        title: 'PSM - Facility Management',
        description: 'Professional security, smart maintenance, and housekeeping.',
        image: 'https://images.unsplash.com/photo-1562577309-4932fdd64cd1?auto=format&fit=crop&q=80&w=600',
        logoBadge: 'PSM SECURITY',
        shapeClass: 'rounded-b-2xl rounded-tl-[4rem] rounded-tr-2xl',
        link: '/about'
    }
];

export default function SBUSection() {
    return (
        <section className="py-20 bg-white dark:bg-primary-navy transition-colors">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">

                {/* Header (Right aligned layout) */}
                <div className="flex justify-end items-center mb-12">
                    <div className="text-right">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white uppercase leading-none">
                            SBU
                        </h2>
                        <p className="text-[10px] text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mt-1.5 font-bold">
                            Strategic Business Units
                        </p>
                    </div>
                </div>

                {/* SBU Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {sbus.map((item) => {
                        const isExternal = item.link.startsWith('http');
                        const CardLink = isExternal ? 'a' : Link;
                        const linkProps = isExternal
                            ? { href: item.link, target: '_blank', rel: 'noopener noreferrer' }
                            : { href: item.link };

                        return (
                            <div key={item.id} className="flex flex-col items-center group">

                                {/* Arch-shaped Image Container */}
                                <CardLink
                                    {...linkProps}
                                    className={`relative aspect-[4/5] w-full overflow-hidden shadow-md group-hover:shadow-2xl transition-all duration-500 bg-neutral-900 border border-neutral-100/10 block cursor-pointer ${item.shapeClass}`}
                                >
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103 opacity-80"
                                    />

                                    {/* Dark Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-black/30 flex flex-col justify-between p-6" />

                                    {/* Upper Badge Logo overlay */}
                                    <div className="absolute top-6 left-6 z-20">
                                        {item.logoImg ? (
                                            <div className="bg-white/95 rounded-lg px-2.5 py-1.5 shadow-md border border-neutral-200/20 max-w-[120px] max-h-[44px] flex items-center justify-center overflow-hidden">
                                                <img
                                                    src={item.logoImg}
                                                    alt={item.title}
                                                    className="max-h-8 max-w-[100px] object-contain"
                                                />
                                            </div>
                                        ) : (
                                            <div className="border border-white/20 rounded px-2.5 py-1 bg-white/5 backdrop-blur-sm">
                                                <p className="text-[9px] font-bold text-white tracking-widest uppercase">
                                                    {item.logoBadge}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Circular Arrow Button at the bottom center */}
                                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-11 h-11 rounded-full bg-white text-neutral-900 shadow-xl flex items-center justify-center transition-all duration-300 group-hover:scale-105 active:scale-95 group-hover:bg-neutral-100 z-10">
                                        <MoveRight size={16} />
                                    </div>
                                </CardLink>

                                {/* Title & Description under Card */}
                                <CardLink {...linkProps} className="mt-4 text-center px-2 block group">
                                    <h3 className="text-xs font-bold text-neutral-800 dark:text-neutral-200 uppercase tracking-widest group-hover:text-luxury-gold transition-colors">
                                        {item.title}
                                    </h3>
                                    <p className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-1 max-w-[220px] mx-auto leading-relaxed">
                                        {item.description}
                                    </p>
                                </CardLink>
                            </div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}
