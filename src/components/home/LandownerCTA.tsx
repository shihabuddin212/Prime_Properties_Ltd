'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Handshake, MessageSquare, Phone, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export default function LandownerCTA() {
    return (
        <section className="py-24 bg-primary-navy relative overflow-hidden border-y border-luxury-gold/10">

            {/* Background radial highlight */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-luxury-gold/5 rounded-full blur-[120px] pointer-events-none z-0" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="bg-primary-dark/80 border border-luxury-gold/30 rounded-3xl p-8 sm:p-12 lg:p-16 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

                        {/* Description */}
                        <div className="lg:col-span-7 space-y-6">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-luxury-gold/30 bg-luxury-gold/5 text-luxury-gold uppercase tracking-[0.2em] text-[10px] font-semibold">
                                <Handshake size={12} />
                                Landowner Opportunities
                            </span>

                            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
                                Partner with us for a <br className="hidden sm:inline" />
                                <span className="luxury-text-gradient">Joint Venture Partnership</span>
                            </h2>

                            <p className="text-gray-300 font-light text-sm sm:text-base leading-relaxed">
                                Do you own a plot of land in Gulshan, Banani, Dhanmondi, Lalbagh, or Chattogram? Let us help you transform it into an iconic architectural landmark. We offer premium profit ratios, legally secured contracts, and high-quality build standards that honor your legacy.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                                <div className="border border-white/5 bg-white/5 p-4 rounded-2xl">
                                    <h4 className="text-luxury-gold text-xs font-semibold uppercase tracking-wider mb-1">Premium Ratios</h4>
                                    <p className="text-xs text-gray-400 font-light">Industry-leading joint venture sharing percentages for landowners.</p>
                                </div>
                                <div className="border border-white/5 bg-white/5 p-4 rounded-2xl">
                                    <h4 className="text-luxury-gold text-xs font-semibold uppercase tracking-wider mb-1">Transparent Timelines</h4>
                                    <p className="text-xs text-gray-400 font-light">Guaranteed construction schedule with legal penalty protections.</p>
                                </div>
                            </div>
                        </div>

                        {/* Actions Panel */}
                        <div className="lg:col-span-5 bg-primary-navy border border-gray-800 rounded-2xl p-6 sm:p-8 space-y-6 text-center lg:text-left">
                            <div>
                                <h3 className="text-white font-bold text-lg mb-1">Let&apos;s Build Together</h3>
                                <p className="text-xs text-gray-400 font-light">Get a free feasibility study or property evaluation for your plot.</p>
                            </div>

                            <div className="space-y-3">
                                <a
                                    href="https://wa.me/8801829116107"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white py-3.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer"
                                >
                                    <MessageSquare size={16} />
                                    Chat on WhatsApp
                                </a>

                                <a
                                    href="tel:09639116107"
                                    className="flex items-center justify-center gap-3 border border-gray-850 hover:border-luxury-gold/50 text-gray-300 hover:text-white py-3.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all active:scale-95 cursor-pointer"
                                >
                                    <Phone size={16} />
                                    Call Office: 09639116107
                                </a>
                            </div>

                            <div className="pt-4 border-t border-gray-800 text-center">
                                <Link
                                    href="/landowner"
                                    className="text-xs text-luxury-gold font-semibold uppercase tracking-wider hover:underline flex items-center justify-center gap-1"
                                >
                                    Learn JV Evaluation Criteria
                                    <ArrowUpRight size={12} />
                                </Link>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}
