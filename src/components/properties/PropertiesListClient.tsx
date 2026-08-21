'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { Search, ChevronDown, MapPin, Star, Percent } from 'lucide-react';
import { parseImages } from '@/lib/imageParser';
import { useSearchParams } from 'next/navigation';

interface ClientProperty {
    id: string;
    title: string;
    slug: string;
    location: string;
    image: string;
    status: string;
    isFeatured: boolean;
    isSpecialOffer: boolean;
}

interface PropertiesListClientProps {
    initialProperties: any[];
}

export default function PropertiesListClient({ initialProperties }: PropertiesListClientProps) {
    const searchParams = useSearchParams();

    // Dropdown UI states
    const [isStatusOpen, setIsStatusOpen] = useState(false);
    const [isLocationOpen, setIsLocationOpen] = useState(false);

    // Selected choices in dropdown — pre-populate from URL query params
    const [selectedStatus, setSelectedStatus] = useState(() => {
        const s = searchParams.get('status');
        return s ? (s === 'Upcoming' ? 'Coming Soon' : s) : 'Status';
    });
    const [selectedLocation, setSelectedLocation] = useState(() => {
        return searchParams.get('location') || 'Location';
    });

    // Applied search filters — auto-apply on load if URL params present
    const [appliedStatus, setAppliedStatus] = useState(() => {
        const s = searchParams.get('status');
        return s ? (s === 'Upcoming' ? 'Coming Soon' : s) : 'Status';
    });
    const [appliedLocation, setAppliedLocation] = useState(() => {
        return searchParams.get('location') || 'Location';
    });

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    // Map database properties directly
    const combinedList = useMemo(() => {
        return initialProperties.map(p => {
            const imgPaths = parseImages(p.images);
            const primaryImg = imgPaths[0] || 'https://images.unsplash.com/photo-1545464693-f17e30d7ea2d?auto=format&fit=crop&q=80&w=800';
            return {
                id: p.id,
                title: p.title,
                slug: p.slug,
                location: p.location,
                image: primaryImg,
                status: p.status === 'Upcoming' ? 'Coming Soon' : p.status,
                isFeatured: p.isFeatured || false,
                isSpecialOffer: p.isSpecialOffer || false,
            };
        });
    }, [initialProperties]);

    // Dynamically retrieve unique locations present in database properties
    const availableLocations = useMemo(() => {
        const locSet = new Set<string>();
        combinedList.forEach(item => {
            const text = item.location.toLowerCase();
            if (text.includes('bashundhara')) {
                locSet.add('Bashundhara R/A');
            } else if (text.includes('gulshan')) {
                locSet.add('Gulshan');
            } else if (text.includes('dhanmondi')) {
                locSet.add('Dhanmondi');
            } else if (text.includes('khulshi')) {
                locSet.add('North Khulshi');
            } else if (text.includes('uttara')) {
                locSet.add('Uttara');
            } else if (text.includes('moghbazar')) {
                locSet.add('Moghbazar');
            } else if (text.includes('aftabnagar')) {
                locSet.add('Aftabnagar');
            } else if (text.includes('banani')) {
                locSet.add('Banani');
            } else if (text.includes('mirpur')) {
                locSet.add('Mirpur');
            } else {
                const parts = item.location.split(',');
                if (parts[0]) locSet.add(parts[0].trim());
            }
        });
        return ['Location', ...Array.from(locSet).sort()];
    }, [combinedList]);

    // Dynamically retrieve unique statuses present in database properties
    const availableStatuses = useMemo(() => {
        const statusSet = new Set<string>();
        combinedList.forEach(item => {
            if (item.status) {
                if (item.status === 'Ready') {
                    statusSet.add('Ready');
                } else if (item.status === 'Ongoing') {
                    statusSet.add('Ongoing');
                } else if (item.status === 'Upcoming' || item.status === 'Coming Soon') {
                    statusSet.add('Coming Soon');
                } else {
                    statusSet.add(item.status);
                }
            }
        });
        return ['Status', ...Array.from(statusSet).sort()];
    }, [combinedList]);

    // Base filter by status/location
    const filteredList = useMemo(() => {
        return combinedList.filter((item) => {
            if (appliedStatus !== 'Status') {
                if (item.status.toLowerCase() !== appliedStatus.toLowerCase()) return false;
            }
            if (appliedLocation !== 'Location') {
                if (!item.location.toLowerCase().includes(appliedLocation.toLowerCase())) return false;
            }
            return true;
        });
    }, [combinedList, appliedStatus, appliedLocation]);

    // ── Sectioned ordering with deduplication ─────────────────────────────────
    // Section 1: Regular properties (neither special offer nor featured)
    // Section 2: Special offer properties
    // Section 3: Featured-only properties (isFeatured=true, not special offer)
    // A property appears ONLY ONCE (highest priority section wins)
    const isFiltering = appliedStatus !== 'Status' || appliedLocation !== 'Location';

    const { sectionRegular, sectionSpecial, sectionFeatured, flatOrdered } = useMemo(() => {
        const seen = new Set<string>();

        const sectionRegular: ClientProperty[] = [];
        const sectionSpecial: ClientProperty[] = [];
        const sectionFeatured: ClientProperty[] = [];

        // Pass 1: Regular (neither special nor featured) — admin's direct properties
        filteredList
            .filter(p => !p.isSpecialOffer && !p.isFeatured)
            .forEach(p => { if (!seen.has(p.id)) { seen.add(p.id); sectionRegular.push(p); } });

        // Pass 2: Special offers
        filteredList
            .filter(p => p.isSpecialOffer)
            .forEach(p => { if (!seen.has(p.id)) { seen.add(p.id); sectionSpecial.push(p); } });

        // Pass 3: Featured only (not already counted in special offers)
        filteredList
            .filter(p => p.isFeatured && !p.isSpecialOffer)
            .forEach(p => { if (!seen.has(p.id)) { seen.add(p.id); sectionFeatured.push(p); } });

        const flatOrdered = [...sectionRegular, ...sectionSpecial, ...sectionFeatured];
        return { sectionRegular, sectionSpecial, sectionFeatured, flatOrdered };
    }, [filteredList]);

    // Paginate the flat ordered list
    const paginatedList = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return flatOrdered.slice(start, start + itemsPerPage);
    }, [flatOrdered, currentPage]);

    const totalPages = Math.ceil(flatOrdered.length / itemsPerPage);

    // Helper: which section does this paginated item belong to?
    const getSectionLabel = (item: ClientProperty) => {
        if (sectionSpecial.some(p => p.id === item.id)) return 'special';
        if (sectionFeatured.some(p => p.id === item.id)) return 'featured';
        return 'regular';
    };

    const handleSearchClick = () => {
        setAppliedStatus(selectedStatus);
        setAppliedLocation(selectedLocation);
        setCurrentPage(1);
    };

    // PropertyCard sub-component
    const PropertyCard = ({ item }: { item: ClientProperty }) => (
        <Link
            key={item.id}
            href={`/properties/${item.slug}`}
            className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-md bg-neutral-900 border border-neutral-100/10 group block cursor-pointer select-none"
        >
            <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
                loading="lazy"
            />

            {/* Featured Badge (Top Left) */}
            {item.isFeatured && (
                <div className="absolute top-4 left-4 bg-luxury-gold/90 backdrop-blur-sm border border-luxury-gold/30 text-white rounded-lg px-3 py-1.5 text-[9px] uppercase font-bold tracking-wider z-10 select-none flex items-center gap-1">
                    <Star size={8} className="fill-white" /> Featured
                </div>
            )}

            {/* Special Offer Badge (Top Right) */}
            {item.isSpecialOffer && (
                <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm border border-neutral-800 text-white rounded-lg px-3 py-1.5 text-[9px] uppercase font-bold tracking-wider z-10 select-none">
                    Special Offer
                </div>
            )}

            {/* Bottom Overlay */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/40 to-transparent p-5 flex items-center justify-between z-10 gap-2">
                <div className="min-w-0">
                    <h3 className="text-white font-bold text-lg tracking-wide truncate">{item.title}</h3>
                    <p className="text-[10px] text-neutral-300 font-light mt-0.5 tracking-wide flex items-center gap-1">
                        <MapPin size={10} className="text-luxury-gold shrink-0" />
                        <span className="truncate">{item.location}</span>
                    </p>
                </div>
                <div className="bg-white group-hover:bg-neutral-100 text-neutral-900 px-4 py-2 rounded-full text-xs font-bold font-sans tracking-wide flex items-center gap-1.5 shadow-md flex-shrink-0 transition-all duration-300">
                    <span>Details</span>
                    <span className="font-sans">→</span>
                </div>
            </div>
        </Link>
    );

    // Section Divider sub-component
    const SectionDivider = ({ icon, label, count }: { icon: React.ReactNode; label: string; count: number }) => (
        <div className="col-span-full flex items-center gap-4 my-4">
            <div className="flex items-center gap-2 shrink-0">
                {icon}
                <span className="text-sm font-bold text-neutral-800 dark:text-white uppercase tracking-wider">{label}</span>
                <span className="text-xs text-neutral-400 font-medium">({count})</span>
            </div>
            <div className="flex-1 border-t border-neutral-200 dark:border-neutral-700/50" />
        </div>
    );

    return (
        <div className="pt-20 min-h-screen bg-white dark:bg-primary-navy/40 transition-colors pb-20 overflow-x-hidden">

            {/* Top Filter Hero Banner */}
            <div
                className="relative aspect-[16/8] sm:aspect-[21/6] min-h-[190px] sm:min-h-[220px] bg-neutral-900 bg-cover bg-center flex items-center justify-center overflow-visible"
                style={{ backgroundImage: `url('https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&q=80&w=1920')` }}
            >
                <div className="absolute inset-0 bg-black/40" />

                {/* Centered White search capsule */}
                <div className="absolute bottom-0 left-0 right-0 translate-y-1/2 max-w-4xl mx-auto px-4 sm:px-6 z-20">
                    <div className="bg-white border border-neutral-200/80 shadow-[0_10px_35px_rgba(0,0,0,0.15)] rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">

                        {/* Status Select */}
                        <div className="relative w-full flex-1">
                            <button
                                onClick={() => { setIsStatusOpen(!isStatusOpen); setIsLocationOpen(false); }}
                                className="flex items-center justify-between w-full text-left px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-neutral-800 font-medium bg-neutral-50 hover:bg-neutral-100 rounded-xl transition cursor-pointer select-none border border-neutral-200/50"
                            >
                                <span>{selectedStatus}</span>
                                <ChevronDown size={16} className={`text-neutral-500 transition-transform ${isStatusOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {isStatusOpen && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-neutral-200 rounded-xl shadow-2xl z-40 py-1.5 overflow-hidden max-h-56 overflow-y-auto">
                                    {availableStatuses.map((s) => (
                                        <button
                                            key={s}
                                            onClick={() => { setSelectedStatus(s); setIsStatusOpen(false); }}
                                            className={`w-full text-left px-4 py-2.5 text-xs text-neutral-700 hover:bg-blue-600 hover:text-white transition-colors capitalize ${selectedStatus === s ? 'bg-blue-600 text-white font-medium' : ''}`}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="w-px h-8 bg-neutral-200 hidden sm:block" />

                        {/* Location Select */}
                        <div className="relative w-full flex-1">
                            <button
                                onClick={() => { setIsLocationOpen(!isLocationOpen); setIsStatusOpen(false); }}
                                className="flex items-center justify-between w-full text-left px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-neutral-800 font-medium bg-neutral-50 hover:bg-neutral-100 rounded-xl transition cursor-pointer select-none border border-neutral-200/50"
                            >
                                <span>{selectedLocation}</span>
                                <ChevronDown size={16} className={`text-neutral-500 transition-transform ${isLocationOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {isLocationOpen && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-neutral-200 rounded-xl shadow-2xl z-40 py-1.5 max-h-56 overflow-y-auto no-scrollbar">
                                    {availableLocations.map((loc) => (
                                        <button
                                            key={loc}
                                            onClick={() => { setSelectedLocation(loc); setIsLocationOpen(false); }}
                                            className={`w-full text-left px-4 py-2.5 text-xs text-neutral-700 hover:bg-blue-600 hover:text-white transition-colors ${selectedLocation === loc ? 'bg-blue-600 text-white font-medium' : ''}`}
                                        >
                                            {loc}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Search Button */}
                        <button
                            onClick={handleSearchClick}
                            className="w-full sm:w-auto bg-[#1b1b1b] hover:bg-[#2b2b2b] text-white flex items-center justify-center gap-2 px-8 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-semibold tracking-wider transition-all cursor-pointer inline-block shrink-0 active:scale-95 shadow-md"
                        >
                            <Search size={14} />
                            <span>Search</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Properties List Workspace */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 sm:mt-24">

                {/* Count Header */}
                <div className="flex items-center justify-between mb-6">
                    <p className="text-sm font-bold text-neutral-500 dark:text-neutral-400">
                        {flatOrdered.length} {flatOrdered.length === 1 ? 'Property' : 'Properties'} found
                    </p>
                    {(appliedStatus !== 'Status' || appliedLocation !== 'Location') && (
                        <button
                            onClick={() => { setSelectedStatus('Status'); setSelectedLocation('Location'); setAppliedStatus('Status'); setAppliedLocation('Location'); setCurrentPage(1); }}
                            className="text-xs font-bold text-luxury-gold uppercase tracking-wider hover:underline cursor-pointer"
                        >
                            ✕ Clear Filters
                        </button>
                    )}
                </div>

                {/* Grid with Sections */}
                {flatOrdered.length === 0 ? (
                    <div className="text-center py-20 bg-neutral-50 dark:bg-primary-navy border border-neutral-200/50 rounded-2xl">
                        <p className="text-base text-neutral-500">No properties match your filter preferences.</p>
                        <button
                            onClick={() => { setSelectedStatus('Status'); setSelectedLocation('Location'); setAppliedStatus('Status'); setAppliedLocation('Location'); setCurrentPage(1); }}
                            className="mt-4 text-xs font-bold text-luxury-gold uppercase tracking-wider hover:underline cursor-pointer"
                        >
                            Clear Filters
                        </button>
                    </div>
                ) : (
                    <>
                        {isFiltering ? (
                            /* ── Filtered view: flat grid, no section headers ── */
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {paginatedList.map(item => <PropertyCard key={item.id} item={item} />)}
                            </div>
                        ) : (
                            /* ── Unfiltered view: sectioned grid with dividers ── */
                            <div className="space-y-2">
                                {/* Section 1: Regular Properties */}
                                {sectionRegular.length > 0 && (
                                    <div>
                                        <SectionDivider
                                            icon={<div className="w-2 h-2 rounded-full bg-neutral-400" />}
                                            label="Properties"
                                            count={sectionRegular.length}
                                        />
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-4">
                                            {sectionRegular.map(item => <PropertyCard key={item.id} item={item} />)}
                                        </div>
                                    </div>
                                )}

                                {/* Section 2: Special Offers */}
                                {sectionSpecial.length > 0 && (
                                    <div className="mt-12">
                                        <SectionDivider
                                            icon={<Percent size={14} className="text-white bg-black rounded-full p-0.5" />}
                                            label="Special Offers"
                                            count={sectionSpecial.length}
                                        />
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-4">
                                            {sectionSpecial.map(item => <PropertyCard key={item.id} item={item} />)}
                                        </div>
                                    </div>
                                )}

                                {/* Section 3: Featured Properties */}
                                {sectionFeatured.length > 0 && (
                                    <div className="mt-12">
                                        <SectionDivider
                                            icon={<Star size={14} className="text-luxury-gold fill-luxury-gold" />}
                                            label="Featured Properties"
                                            count={sectionFeatured.length}
                                        />
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-4">
                                            {sectionFeatured.map(item => <PropertyCard key={item.id} item={item} />)}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ── Pagination (only for filtered view) ── */}
                        {isFiltering && totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 mt-16">
                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => { setCurrentPage(i + 1); window.scrollTo({ top: 300, behavior: 'smooth' }); }}
                                        className={`w-8 h-8 rounded-full border text-xs font-bold flex items-center justify-center transition-all cursor-pointer ${currentPage === i + 1
                                            ? 'bg-neutral-900 border-neutral-900 text-white dark:bg-white dark:border-white dark:text-neutral-900'
                                            : 'bg-white border-neutral-300 text-neutral-600 hover:border-neutral-500 dark:bg-primary-navy dark:border-neutral-700 dark:text-neutral-300'
                                            }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                                {currentPage < totalPages && (
                                    <button
                                        onClick={() => { setCurrentPage(prev => prev + 1); window.scrollTo({ top: 300, behavior: 'smooth' }); }}
                                        className="bg-white border border-neutral-300 hover:border-neutral-500 dark:bg-primary-navy dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 px-4 py-2 rounded-full text-xs font-bold tracking-wide flex items-center gap-1 cursor-pointer"
                                    >
                                        <span>Next</span>
                                        <span>→</span>
                                    </button>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
