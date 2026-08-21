'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronDown, Search, ChevronDown as DropIcon, MapPin, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const STATUS_OPTIONS = [
    { label: 'Ready', value: 'Ready' },
    { label: 'Ongoing', value: 'Ongoing' },
    { label: 'Coming Soon', value: 'Upcoming' },
];

export default function HeroSection() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const router = useRouter();

    const videoUrl = process.env.NEXT_PUBLIC_HERO_VIDEO_URL || '/hero-building.mp4';
    const videoUrlFallback = 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-city-traffic-at-night-11-large.mp4';
    const fallbackPoster = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1920';

    // Search bar state
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('');
    const [locationSearch, setLocationSearch] = useState('');
    const [locations, setLocations] = useState<string[]>([]);
    const [statusOpen, setStatusOpen] = useState(false);
    const [locationOpen, setLocationOpen] = useState(false);

    // Fetch unique locations from DB
    useEffect(() => {
        fetch('/api/properties')
            .then(r => r.json())
            .then((data: { location: string }[]) => {
                if (Array.isArray(data)) {
                    const unique = Array.from(
                        new Set(data.map(p => p.location).filter(Boolean))
                    ).sort();
                    setLocations(unique);
                }
            })
            .catch(() => { });
    }, []);

    // Video autoplay
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.defaultMuted = true;
            videoRef.current.muted = true;
            videoRef.current.loop = true;
            const p = videoRef.current.play();
            if (p !== undefined) {
                p.catch(() => {
                    if (videoRef.current) { videoRef.current.muted = true; videoRef.current.play().catch(() => { }); }
                });
            }
        }
    }, []);

    const scrollToContent = () => {
        document.getElementById('featured-section')?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (selectedStatus) params.set('status', selectedStatus);
        if (selectedLocation) params.set('location', selectedLocation);
        router.push(`/properties${params.toString() ? '?' + params.toString() : ''}`);
    };

    // Filter locations by search input
    const filteredLocations = locations.filter(loc =>
        loc.toLowerCase().includes(locationSearch.toLowerCase())
    );

    // Close dropdowns on outside click
    useEffect(() => {
        const handler = () => { setStatusOpen(false); setLocationOpen(false); };
        document.addEventListener('click', handler);
        return () => document.removeEventListener('click', handler);
    }, []);

    return (
        <section className="relative h-screen flex items-end justify-center overflow-hidden bg-primary-navy">

            {/* Background Poster */}
            <div
                className="absolute inset-0 bg-cover bg-center z-0 opacity-40"
                style={{ backgroundImage: `url('${fallbackPoster}')` }}
            />

            {/* Video Background */}
            <video
                ref={videoRef}
                autoPlay muted loop playsInline
                poster={fallbackPoster}
                className="absolute inset-0 w-full h-full object-cover z-0 opacity-100 transition-opacity duration-1000"
            >
                <source src={videoUrl} type="video/mp4" />
                <source src={videoUrlFallback} type="video/mp4" />
            </video>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-primary-dark/60 via-primary-dark/20 to-primary-dark/90 z-10" />

            {/* Hero Content — centred in full screen */}
            <div className="absolute inset-0 flex items-center justify-center z-20 px-4">
                <div className="max-w-5xl mx-auto text-center flex flex-col items-center">

                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
                        className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-luxury-gold/40 bg-luxury-gold/10 text-luxury-gold uppercase tracking-[0.25em] text-[10px] font-semibold mb-6 animate-pulse"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-luxury-gold" />
                        Elite Real Estate Developer
                    </motion.div>

                    {/* Title */}
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1]"
                    >
                        We Build The Art Of <br />
                        <span className="luxury-text-gradient">Homeownership</span>
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}
                        className="max-w-2xl text-sm sm:text-base md:text-lg text-gray-300 font-light leading-relaxed mb-10"
                    >
                        Discover luxury vertical sanctuaries in Gulshan, Dhanmondi, Banani, and Bashundhara.
                    </motion.p>

                    {/* CTAs */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }}
                        className="flex flex-col sm:flex-row gap-4 items-center"
                    >
                        <Link href="/properties"
                            className="flex items-center gap-2 bg-luxury-gold hover:bg-gold-hover text-white px-8 py-4 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-xl hover:shadow-luxury-gold/30 hover:scale-[1.03] active:scale-95">
                            Explore Projects <ArrowRight size={14} />
                        </Link>
                        <Link href="/contact"
                            className="flex items-center gap-2 border border-white hover:bg-white hover:text-primary-navy text-white px-8 py-4 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 hover:scale-[1.03] active:scale-95">
                            Partner With Us
                        </Link>
                    </motion.div>
                </div>
            </div>

            {/* ── HERO SEARCH BAR — pinned to video bottom ── */}
            <div className="relative z-30 w-full pb-12 px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.9 }}
                    className="max-w-2xl mx-auto"
                >
                    <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl flex items-stretch overflow-visible">

                        {/* ── STATUS Dropdown ── */}
                        <div
                            className="relative flex-1 border-r border-gray-200"
                            onClick={e => { e.stopPropagation(); setStatusOpen(o => !o); setLocationOpen(false); }}
                        >
                            <button className="w-full h-full flex items-center justify-between px-5 py-4 text-left cursor-pointer select-none">
                                <div>
                                    <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Status</p>
                                    <p className={`text-sm font-semibold mt-0.5 ${selectedStatus ? 'text-gray-900' : 'text-gray-400'}`}>
                                        {STATUS_OPTIONS.find(s => s.value === selectedStatus)?.label || 'Any Status'}
                                    </p>
                                </div>
                                <DropIcon size={14} className={`text-gray-400 transition-transform ${statusOpen ? 'rotate-180' : ''}`} />
                            </button>

                            <AnimatePresence>
                                {statusOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute top-full left-0 mt-2 w-52 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden"
                                        onClick={e => e.stopPropagation()}
                                    >
                                        {/* Clear option */}
                                        <button
                                            onClick={() => { setSelectedStatus(''); setStatusOpen(false); }}
                                            className={`w-full text-left px-4 py-3 text-xs font-medium hover:bg-gray-50 transition cursor-pointer flex items-center justify-between ${!selectedStatus ? 'text-luxury-gold' : 'text-gray-500'}`}
                                        >
                                            Any Status
                                            {!selectedStatus && <CheckCircle2 size={12} className="text-luxury-gold" />}
                                        </button>
                                        <div className="border-t border-gray-100" />
                                        {STATUS_OPTIONS.map(opt => (
                                            <button
                                                key={opt.value}
                                                onClick={() => { setSelectedStatus(opt.value); setStatusOpen(false); }}
                                                className={`w-full text-left px-4 py-3 text-sm font-semibold hover:bg-gray-50 transition cursor-pointer flex items-center justify-between ${selectedStatus === opt.value ? 'text-luxury-gold' : 'text-gray-700'}`}
                                            >
                                                <span className="flex items-center gap-2">
                                                    <span className={`w-2 h-2 rounded-full ${opt.value === 'Ready' ? 'bg-emerald-400' : opt.value === 'Ongoing' ? 'bg-amber-400' : 'bg-blue-400'}`} />
                                                    {opt.label}
                                                </span>
                                                {selectedStatus === opt.value && <CheckCircle2 size={12} className="text-luxury-gold" />}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* ── LOCATION Dropdown ── */}
                        <div
                            className="relative flex-1"
                            onClick={e => { e.stopPropagation(); setLocationOpen(o => !o); setStatusOpen(false); }}
                        >
                            <button className="w-full h-full flex items-center justify-between px-5 py-4 text-left cursor-pointer select-none">
                                <div className="flex items-center gap-2 min-w-0">
                                    <MapPin size={13} className="text-gray-400 shrink-0" />
                                    <div className="min-w-0">
                                        <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Location</p>
                                        <p className={`text-sm font-semibold mt-0.5 truncate ${selectedLocation ? 'text-gray-900' : 'text-gray-400'}`}>
                                            {selectedLocation || 'Any Location'}
                                        </p>
                                    </div>
                                </div>
                                <DropIcon size={14} className={`text-gray-400 shrink-0 transition-transform ${locationOpen ? 'rotate-180' : ''}`} />
                            </button>

                            <AnimatePresence>
                                {locationOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden"
                                        onClick={e => e.stopPropagation()}
                                    >
                                        {/* Search inside dropdown */}
                                        <div className="p-3 border-b border-gray-100">
                                            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                                                <Search size={12} className="text-gray-400" />
                                                <input
                                                    autoFocus
                                                    type="text"
                                                    placeholder="Search location..."
                                                    value={locationSearch}
                                                    onChange={e => setLocationSearch(e.target.value)}
                                                    className="bg-transparent text-xs text-gray-700 outline-none w-full placeholder:text-gray-400"
                                                />
                                            </div>
                                        </div>

                                        <div className="max-h-56 overflow-y-auto">
                                            {/* Clear option */}
                                            <button
                                                onClick={() => { setSelectedLocation(''); setLocationOpen(false); setLocationSearch(''); }}
                                                className={`w-full text-left px-4 py-3 text-xs font-medium hover:bg-gray-50 transition cursor-pointer flex items-center justify-between ${!selectedLocation ? 'text-luxury-gold' : 'text-gray-500'}`}
                                            >
                                                Any Location
                                                {!selectedLocation && <CheckCircle2 size={12} className="text-luxury-gold" />}
                                            </button>
                                            <div className="border-t border-gray-100" />

                                            {filteredLocations.length === 0 ? (
                                                <p className="text-center py-4 text-xs text-gray-400">No locations found</p>
                                            ) : (
                                                filteredLocations.map(loc => (
                                                    <button
                                                        key={loc}
                                                        onClick={() => { setSelectedLocation(loc); setLocationOpen(false); setLocationSearch(''); }}
                                                        className={`w-full text-left px-4 py-3 text-sm font-semibold hover:bg-gray-50 transition cursor-pointer flex items-center justify-between gap-2 ${selectedLocation === loc ? 'text-luxury-gold' : 'text-gray-700'}`}
                                                    >
                                                        <span className="flex items-center gap-2 min-w-0 truncate">
                                                            <MapPin size={11} className="text-gray-400 shrink-0" />
                                                            <span className="truncate">{loc}</span>
                                                        </span>
                                                        {selectedLocation === loc && <CheckCircle2 size={12} className="text-luxury-gold shrink-0" />}
                                                    </button>
                                                ))
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* ── SEARCH Button ── */}
                        <button
                            onClick={handleSearch}
                            className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-7 py-4 text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer select-none rounded-r-2xl shrink-0 active:scale-95"
                        >
                            <Search size={15} />
                            <span className="hidden sm:inline">Search</span>
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 hidden md:block">
                <button
                    onClick={scrollToContent}
                    className="text-gray-400 hover:text-white p-2 rounded-full border border-gray-700 hover:border-gray-400 transition-all animate-bounce cursor-pointer"
                    aria-label="Scroll Down"
                >
                    <ChevronDown size={18} />
                </button>
            </div>

        </section>
    );
}
