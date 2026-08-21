'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FileText, ArrowUpRight, X } from 'lucide-react';

interface NewsletterItem {
    id: string;
    title: string;
    image: string;
    pdfUrl: string;
}

const newsletters: NewsletterItem[] = [
    {
        id: '1',
        title: 'JAN-APR 2026',
        image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600',
        pdfUrl: '#'
    },
    {
        id: '2',
        title: 'JAN-APR 2025',
        image: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=600',
        pdfUrl: '#'
    },
    {
        id: '3',
        title: 'NOV-DEC 2024',
        image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=600',
        pdfUrl: '#'
    },
    {
        id: '4',
        title: 'SEPT-OCT 2024',
        image: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=600',
        pdfUrl: '#'
    },
    {
        id: '5',
        title: 'AUGUST 2024',
        image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=600',
        pdfUrl: '#'
    },
    {
        id: '6',
        title: 'JULY 2024',
        image: 'https://images.unsplash.com/photo-1495020689067-958852a6565d?auto=format&fit=crop&q=80&w=600',
        pdfUrl: '#'
    },
    {
        id: '7',
        title: 'JUNE 2024',
        image: 'https://images.unsplash.com/photo-1588681664899-f142ff2bac99?auto=format&fit=crop&q=80&w=600',
        pdfUrl: '#'
    },
    {
        id: '8',
        title: 'MAY 2024',
        image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=600',
        pdfUrl: '#'
    }
];

export default function NewsletterPage() {
    const [selectedNewsletter, setSelectedNewsletter] = useState<NewsletterItem | null>(null);

    return (
        <div className="pt-20 min-h-screen bg-[#1c1c1e] text-white">

            {/* Header / Banner */}
            <section className="relative py-20 bg-neutral-950 overflow-hidden border-b border-neutral-800">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-15"
                    style={{ backgroundImage: `url('https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=1200')` }}
                />
                <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-4">
                    <h1 className="text-4xl sm:text-5xl font-light tracking-wide text-white">
                        Newsletter
                    </h1>
                    <p className="text-xs sm:text-sm font-light text-neutral-350 leading-relaxed max-w-3xl mx-auto">
                        PPD Newsletter is published regularly and keeps you up to date on the latest happenings at PPD, such as our upcoming projects, project fairs, events, etc. It also gives you helpful insight and advice on the real estate sector from our experts. For weekly news and updates, check out the{' '}
                        <Link href="/blog" className="text-luxury-gold hover:underline font-medium">
                            PPD blog
                        </Link>.
                    </p>
                </div>
            </section>

            {/* Newsletter Grid */}
            <section className="py-16 max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {newsletters.map((item) => (
                        <div
                            key={item.id}
                            className="bg-[#262628] rounded-[1.5rem] overflow-hidden border border-neutral-800 flex flex-col justify-between group hover:border-luxury-gold/20 transition-all duration-300"
                        >
                            <div className="relative aspect-[4/5] bg-neutral-900 overflow-hidden border-b border-neutral-800">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-black/20" />
                                <div className="absolute top-4 left-4 bg-luxury-gold/90 backdrop-blur-sm text-neutral-950 text-[9px] uppercase font-bold tracking-wider px-2.5 py-1 rounded">
                                    PPD Pulse
                                </div>
                            </div>

                            <div className="p-5 space-y-3">
                                <h3 className="text-sm font-bold text-white tracking-wide">{item.title}</h3>
                                <button
                                    onClick={() => setSelectedNewsletter(item)}
                                    className="text-[11px] font-bold uppercase tracking-wider text-luxury-gold hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
                                >
                                    <span>View Newsletter</span>
                                    <ArrowUpRight size={13} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                <div className="mt-16 flex items-center justify-center gap-2">
                    <button className="w-8 h-8 rounded-full bg-luxury-gold text-neutral-950 font-bold text-xs flex items-center justify-center shadow">
                        1
                    </button>
                    <button className="w-8 h-8 rounded-full bg-[#262628] hover:bg-[#333] hover:text-white text-neutral-400 font-bold text-xs flex items-center justify-center transition">
                        2
                    </button>
                    <button className="w-8 h-8 rounded-full bg-[#262628] hover:bg-[#333] hover:text-white text-neutral-400 font-bold text-xs flex items-center justify-center transition">
                        3
                    </button>
                    <span className="text-neutral-500 px-1 text-xs">...</span>
                    <button className="w-8 h-8 rounded-full bg-[#262628] hover:bg-[#333] hover:text-white text-neutral-400 font-bold text-xs flex items-center justify-center transition">
                        11
                    </button>
                    <button className="px-5 py-2.5 rounded-full bg-[#262628] hover:bg-[#333] hover:text-white text-neutral-400 font-bold text-[10px] uppercase tracking-wider flex items-center gap-1.5 transition ml-2 active:scale-95">
                        <span>Next</span>
                        <span>→</span>
                    </button>
                </div>
            </section>

            {/* Simulated Newsletter Modal */}
            {selectedNewsletter && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="relative bg-[#262628] border border-neutral-700 rounded-[2rem] w-full max-w-2xl overflow-hidden shadow-2xl p-6 sm:p-8 animate-in scale-in duration-300">

                        <button
                            onClick={() => setSelectedNewsletter(null)}
                            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-neutral-900/60 hover:bg-neutral-800 text-white flex items-center justify-center cursor-pointer transition border border-neutral-750"
                        >
                            <X size={18} />
                        </button>

                        <div className="space-y-4">
                            <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-luxury-gold block">
                                Simulated Newsletter View
                            </span>
                            <h2 className="text-xl sm:text-2xl font-light text-white tracking-wide">
                                PPD Pulse – {selectedNewsletter.title}
                            </h2>

                            <hr className="border-neutral-800" />

                            <div className="aspect-[16/9] w-full bg-neutral-950 rounded-xl overflow-hidden relative">
                                <img
                                    src={selectedNewsletter.image}
                                    alt="Mock Newsletter Content"
                                    className="w-full h-full object-cover opacity-60"
                                />
                                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-2">
                                    <FileText size={32} className="text-luxury-gold" />
                                    <p className="text-sm font-semibold max-w-sm">This is a simulation of the PPD {selectedNewsletter.title} newsletter release.</p>
                                    <p className="text-xs text-neutral-400 font-light max-w-xs leading-relaxed">
                                        Inside, you will find information regarding PPD Summer Carnivals, residential handovers, ongoing project timelines, and real estate market analysis.
                                    </p>
                                </div>
                            </div>

                            <div className="pt-2 flex justify-end">
                                <button
                                    onClick={() => setSelectedNewsletter(null)}
                                    className="bg-neutral-900 border border-neutral-750 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition"
                                >
                                    Close View
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}
