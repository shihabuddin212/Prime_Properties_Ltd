'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Building2, HardHat } from 'lucide-react';

interface ProgressItem {
    id: string;
    slNo: string;
    workName: string;
    progressDetails: string;
}

interface Project {
    id: string;
    title: string;
    slug: string;
    location: string;
    expectedCompletionDate: string;
    statusUpdateDate: string;
    featuredImage: string;
    logoUrl?: string;
    progressItems: ProgressItem[];
}

export default function ConstructionListClient({ projects }: { projects: Project[] }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const PER_PAGE = 8;

    const filtered = useMemo(() =>
        projects.filter(p =>
            p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (p.location && p.location.toLowerCase().includes(searchQuery.toLowerCase()))
        ),
        [projects, searchQuery]
    );

    const totalPages = Math.ceil(filtered.length / PER_PAGE);
    const paginated = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

    return (
        <div className="pt-24 min-h-screen bg-neutral-950 text-white font-sans">
            {/* Hero Section */}
            <section
                className="relative w-full min-h-[340px] bg-neutral-900 overflow-hidden flex items-center justify-center p-6 bg-cover bg-center"
                style={{ backgroundImage: `url('https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=1920')` }}
            >
                <div className="absolute inset-0 bg-neutral-950/80" />

                <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 py-10">
                    <div className="space-y-4 text-center md:text-left max-w-xl">
                        <div className="inline-flex items-center gap-2 bg-[#c5a880]/15 border border-[#c5a880]/30 text-[#e6cda7] px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] font-sans">
                            <HardHat size={12} className="text-[#e6cda7]" /> Live Project Trackings
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-light text-white tracking-wider leading-tight">
                            Construction Status
                        </h1>
                        <p className="text-xs font-light text-neutral-300 leading-relaxed font-sans">
                            Track the real-time structural and finish milestones of our upcoming luxury properties in Dhaka and Chittagong.
                        </p>
                        <div className="flex justify-center md:justify-start">
                            <span className="bg-neutral-900/60 border border-neutral-850 text-[#e6cda7] px-4 py-2 rounded-xl text-[10px] tracking-wider font-semibold">
                                🏢 {projects.length} Active Projects
                            </span>
                        </div>
                    </div>

                    {/* Search bar */}
                    <div className="relative w-full max-w-sm">
                        <input
                            type="text"
                            placeholder="Search projects..."
                            value={searchQuery}
                            onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                            className="w-full bg-neutral-900/80 backdrop-blur-sm border border-neutral-800 rounded-full py-4 pl-6 pr-14 text-xs outline-none focus:border-[#c5a880]/60 focus:bg-neutral-900 transition text-white placeholder:text-neutral-400 font-sans font-light"
                        />
                        <Search size={16} className="absolute right-6 top-1/2 -translate-y-1/2 text-neutral-400" />
                    </div>
                </div>
            </section>

            {/* Main Listing View */}
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
                {projects.length === 0 ? (
                    <div className="text-center py-24 border border-neutral-900 rounded-[2.5rem] bg-neutral-900/10">
                        <Building2 size={48} className="mx-auto mb-4 text-neutral-750" />
                        <h2 className="text-lg font-bold text-white mb-2">No projects dynamically tracked yet</h2>
                        <p className="text-xs text-neutral-500 font-light max-w-xs mx-auto leading-relaxed">
                            Admin updates are currently empty. Please add projects via the admin dashboard.
                        </p>
                    </div>
                ) : paginated.length === 0 ? (
                    <div className="text-center py-20 border border-neutral-900 rounded-3xl">
                        <Building2 size={32} className="mx-auto mb-4 text-neutral-700" />
                        <p className="text-neutral-400 text-xs">No projects details found matching <strong className="text-white">"{searchQuery}"</strong></p>
                        <button onClick={() => setSearchQuery('')} className="mt-4 text-xs text-[#c5a880] hover:underline cursor-pointer">Clear search query</button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
                        {paginated.map(item => (
                            <Link
                                key={item.id}
                                href={`/construction/${item.slug}`}
                                className="bg-[#1e1e20] rounded-[2rem] overflow-hidden border border-neutral-850/80 flex flex-col h-full group hover:shadow-2xl hover:border-[#c5a880]/30 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                            >
                                {/* Card image wrapper */}
                                <div className="relative aspect-[1.1] w-full overflow-hidden bg-neutral-900 border-b border-neutral-800">
                                    {item.featuredImage ? (
                                        <img
                                            src={item.featuredImage}
                                            alt={item.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            loading="lazy"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-neutral-700 gap-2 bg-neutral-900">
                                            <Building2 size={40} />
                                            <span className="text-[10px] font-light">Image unavailable</span>
                                        </div>
                                    )}
                                    {/* Project Logo badge if exists */}
                                    {item.logoUrl && (
                                        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/10 max-h-[30px] flex items-center justify-center">
                                            <img src={item.logoUrl} alt="Logo" className="h-4 object-contain max-w-[80px]" />
                                        </div>
                                    )}
                                </div>

                                {/* Card bottom info */}
                                <div className="p-6 flex items-center justify-between gap-4 flex-grow bg-[#1e1e20]">
                                    <div className="min-w-0">
                                        <h3 className="text-white font-bold text-sm tracking-wide truncate group-hover:text-[#e6cda7] transition-all">
                                            {item.title}
                                        </h3>
                                        {item.location && (
                                            <p className="text-[10px] text-neutral-500 mt-1 truncate font-light tracking-wide">
                                                📍 {item.location}
                                            </p>
                                        )}
                                    </div>
                                    <div className="w-9 h-9 rounded-full border border-neutral-800 group-hover:border-[#c5a880] group-hover:bg-[#c5a880]/15 text-neutral-400 group-hover:text-[#e6cda7] flex items-center justify-center flex-shrink-0 transition-all duration-300">
                                        <span className="font-bold text-base leading-none">→</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2.5 mt-20 flex-wrap">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(pg => (
                            <button
                                key={pg}
                                onClick={() => { setCurrentPage(pg); window.scrollTo({ top: 300, behavior: 'smooth' }); }}
                                className={`w-10 h-10 rounded-full text-xs font-bold flex items-center justify-center transition-all cursor-pointer ${currentPage === pg
                                    ? 'bg-[#c5a880] text-neutral-950 font-bold shadow-lg scale-105'
                                    : 'border border-neutral-850 text-neutral-400 hover:border-neutral-700 hover:text-white bg-neutral-900/40'
                                    }`}
                            >
                                {pg}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
