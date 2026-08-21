'use client';

import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, Images } from 'lucide-react';
import { parseImages } from '@/lib/imageParser';

interface Album {
    id: string;
    title: string;
    category: string;
    images: string;
    published: boolean;
}

interface GalleryClientProps {
    albums: Album[];
}

const CATEGORIES = [
    { key: 'all', label: 'All' },
    { key: 'customer-events', label: 'Customer Events' },
    { key: 'corporate-events', label: 'Corporate Events' },
    { key: 'social', label: 'Social' },
] as const;

// Fallback demo albums shown when the database has no albums yet
const FALLBACK_ALBUMS: Album[] = [
    {
        id: 'f1', title: 'Know Your Neighbors – The Retreat', category: 'social',
        images: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800|https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&q=80&w=800',
        published: true,
    },
    {
        id: 'f2', title: 'Customer Meet 2024', category: 'customer-events',
        images: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=800|https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=800',
        published: true,
    },
    {
        id: 'f3', title: 'Annual Corporate Gala 2023', category: 'corporate-events',
        images: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800|https://images.unsplash.com/photo-1505232458627-5ec9de6c39e5?auto=format&fit=crop&q=80&w=800',
        published: true,
    },
];

export default function GalleryClient({ albums }: GalleryClientProps) {
    const [activeTab, setActiveTab] = useState<string>('all');
    const [openAlbum, setOpenAlbum] = useState<Album | null>(null);
    const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

    const displayed = albums.length > 0 ? albums : FALLBACK_ALBUMS;
    const filtered = activeTab === 'all' ? displayed : displayed.filter(a => a.category === activeTab);

    // ── Album lightbox helpers ──────────────────────────────────────────────
    const albumImages = openAlbum ? parseImages(openAlbum.images) : [];

    const openLightbox = (album: Album, idx: number) => {
        setOpenAlbum(album);
        setLightboxIdx(idx);
    };

    const closeLightbox = () => {
        setLightboxIdx(null);
        // Delay clearing album so exit animation plays
        setTimeout(() => setOpenAlbum(null), 0);
    };

    const prevPhoto = () => {
        if (lightboxIdx === null) return;
        setLightboxIdx(lightboxIdx === 0 ? albumImages.length - 1 : lightboxIdx - 1);
    };

    const nextPhoto = () => {
        if (lightboxIdx === null) return;
        setLightboxIdx(lightboxIdx === albumImages.length - 1 ? 0 : lightboxIdx + 1);
    };

    return (
        <div className="pt-20 min-h-screen bg-[#1c1c1e] text-white">

            {/* ── Hero Header ─────────────────────────────────────────────────── */}
            <section className="relative py-20 bg-neutral-950 overflow-hidden border-b border-neutral-800">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-15"
                    style={{ backgroundImage: `url('https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1200')` }}
                />
                {/* Collage of small images in the background right side */}
                <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20 hidden md:grid grid-cols-3 gap-0.5 overflow-hidden">
                    {displayed.slice(0, 9).map((a, i) => {
                        const cover = parseImages(a.images)[0];
                        return cover ? (
                            <img key={i} src={cover} alt="" className="w-full h-full object-cover" />
                        ) : <div key={i} className="bg-neutral-800" />;
                    })}
                </div>
                <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-4">
                    <h1 className="text-4xl sm:text-5xl font-light tracking-wide text-white">Gallery</h1>
                    <p className="text-xs sm:text-sm font-light text-neutral-400 leading-relaxed max-w-2xl mx-auto">
                        A curated archive of Prime Properties BD customer events, corporate programs, and social initiatives.
                    </p>
                    <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-luxury-gold">{displayed.length} albums</p>
                </div>
            </section>

            {/* ── Category Tab Bar ────────────────────────────────────────────── */}
            <div className="bg-[#242426] border-b border-neutral-800 py-5 sticky top-20 z-20">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-wrap gap-3 items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                        {CATEGORIES.map(({ key, label }) => (
                            <button key={key} onClick={() => setActiveTab(key)}
                                className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition cursor-pointer active:scale-95 ${activeTab === key
                                    ? 'bg-luxury-gold text-neutral-950 shadow-md'
                                    : 'bg-[#1c1c1e] text-neutral-400 hover:text-white border border-neutral-700'
                                    }`}>
                                {label}
                            </button>
                        ))}
                    </div>
                    <span className="text-[10px] text-neutral-500 font-medium tracking-wide">
                        {filtered.length} album{filtered.length !== 1 ? 's' : ''} shown
                    </span>
                </div>
            </div>

            {/* ── Album Grid ──────────────────────────────────────────────────── */}
            <section className="py-16 max-w-7xl mx-auto px-6 lg:px-8">
                {filtered.length === 0 ? (
                    <div className="text-center py-24 text-neutral-500">
                        <Images size={40} className="mx-auto mb-4 opacity-30" />
                        <p className="text-sm font-light">No albums in this category yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
                        {filtered.map((album) => {
                            const imgs = parseImages(album.images);
                            const cover = imgs[0] || '';
                            const count = imgs.length;
                            return (
                                <div
                                    key={album.id}
                                    onClick={() => openLightbox(album, 0)}
                                    className="group relative aspect-[4/3] rounded-[2rem] overflow-hidden bg-neutral-900 border border-neutral-800 cursor-pointer shadow-xl hover:border-luxury-gold/40 hover:-translate-y-1 transition-all duration-300"
                                >
                                    {/* Cover image */}
                                    {cover ? (
                                        <img src={cover} alt={album.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                            loading="lazy" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-neutral-700">
                                            <Images size={40} />
                                        </div>
                                    )}

                                    {/* Photo count badge */}
                                    {count > 1 && (
                                        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm border border-neutral-700 text-white rounded-xl px-3 py-1.5 text-[9px] uppercase font-bold tracking-wider z-10 flex items-center gap-1.5">
                                            <Images size={10} />
                                            {count} Photos
                                        </div>
                                    )}

                                    {/* Category badge */}
                                    <div className="absolute top-4 left-4 bg-luxury-gold text-neutral-950 rounded-lg px-2.5 py-1 text-[8px] uppercase font-bold tracking-widest z-10">
                                        {album.category === 'customer-events' ? 'Customer' : album.category === 'corporate-events' ? 'Corporate' : 'Social'}
                                    </div>

                                    {/* Hover overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />

                                    {/* Bottom title overlay */}
                                    <div className="absolute inset-x-0 bottom-0 p-5 z-10">
                                        <div className="flex items-end justify-between gap-2">
                                            <h3 className="text-white font-bold text-sm leading-snug tracking-wide">{album.title}</h3>
                                            <div className="shrink-0 w-9 h-9 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110">
                                                <ZoomIn size={15} className="text-white" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>

            {/* ── Album Lightbox / Slideshow ──────────────────────────────────── */}
            {openAlbum && lightboxIdx !== null && (
                <div className="fixed inset-0 z-50 bg-black/97 flex flex-col animate-in fade-in duration-200 select-none"
                    onKeyDown={(e) => { if (e.key === 'ArrowLeft') prevPhoto(); if (e.key === 'ArrowRight') nextPhoto(); if (e.key === 'Escape') closeLightbox(); }}
                    tabIndex={0}>

                    {/* Top bar */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800/60 shrink-0">
                        <div>
                            <p className="text-xs text-luxury-gold font-bold uppercase tracking-widest">
                                {CATEGORIES.find(c => c.key === openAlbum.category)?.label}
                            </p>
                            <h2 className="text-sm font-bold text-white mt-0.5 tracking-wide">{openAlbum.title}</h2>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-xs text-neutral-400 font-mono">
                                {lightboxIdx + 1} / {albumImages.length}
                            </span>
                            <button onClick={closeLightbox}
                                className="w-10 h-10 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white flex items-center justify-center cursor-pointer transition border border-neutral-700">
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Main image area */}
                    <div className="flex-1 flex items-center justify-between gap-3 px-4 py-4 min-h-0">
                        <button onClick={prevPhoto}
                            className="shrink-0 w-12 h-12 rounded-full bg-neutral-800/80 hover:bg-neutral-700 text-white flex items-center justify-center cursor-pointer transition border border-neutral-700 active:scale-95">
                            <ChevronLeft size={24} />
                        </button>

                        <div className="flex-1 flex items-center justify-center max-h-full min-h-0">
                            <img
                                key={lightboxIdx}
                                src={albumImages[lightboxIdx]}
                                alt={`${openAlbum.title} – photo ${lightboxIdx + 1}`}
                                className="max-w-full max-h-[65vh] object-contain rounded-2xl shadow-2xl border border-neutral-800"
                            />
                        </div>

                        <button onClick={nextPhoto}
                            className="shrink-0 w-12 h-12 rounded-full bg-neutral-800/80 hover:bg-neutral-700 text-white flex items-center justify-center cursor-pointer transition border border-neutral-700 active:scale-95">
                            <ChevronRight size={24} />
                        </button>
                    </div>

                    {/* Filmstrip thumbnail strip */}
                    {albumImages.length > 1 && (
                        <div className="shrink-0 border-t border-neutral-800/60 py-3 px-6 overflow-x-auto">
                            <div className="flex gap-2 justify-center w-max mx-auto">
                                {albumImages.map((src, i) => (
                                    <button key={i} onClick={() => setLightboxIdx(i)}
                                        className={`shrink-0 w-16 h-12 rounded-xl overflow-hidden border-2 transition cursor-pointer ${i === lightboxIdx ? 'border-luxury-gold scale-105' : 'border-neutral-700 opacity-50 hover:opacity-80'}`}>
                                        <img src={src} alt="" className="w-full h-full object-cover" loading="lazy" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
