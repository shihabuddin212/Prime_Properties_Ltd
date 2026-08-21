'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Send, ExternalLink, CheckCircle } from 'lucide-react';

export default function Footer() {
    const pathname = usePathname();
    const isAdminPath = pathname.startsWith('/admin');
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    if (isAdminPath) return null; // Hide in admin panel

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        setSubmitting(true);

        try {
            await fetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: 'Newsletter Subscriber',
                    email: email,
                    subject: 'Newsletter Subscription',
                    message: 'Subscribed to newsletter updates from footer section.',
                    type: 'Newsletter',
                }),
            });
        } catch {
            // silent
        } finally {
            setSubmitting(false);
            setSubscribed(true);
            setEmail('');

            // Reset success state after 4 seconds
            setTimeout(() => setSubscribed(false), 4000);
        }
    };

    return (
        <footer className="bg-[#111111] text-neutral-400 font-sans border-t border-neutral-900">
            <div className="max-w-7xl mx-auto px-6 py-16 sm:px-8 lg:px-12">

                {/* Newsletter Subscription Row */}
                <div className="pb-12 mb-12 border-b border-neutral-800/60">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-light text-white tracking-wide">
                                Never miss an update
                            </h2>
                            <p className="text-xs text-neutral-500 mt-1 font-light tracking-wider">
                                Subscribe for exclusive property launches, market insights, and luxury listings.
                            </p>
                        </div>

                        <div className="w-full lg:w-auto">
                            {subscribed ? (
                                <div className="flex items-center gap-2 text-luxury-gold bg-luxury-gold/10 border border-luxury-gold/20 py-3.5 px-6 rounded-full text-sm animate-in fade-in duration-300">
                                    <CheckCircle size={16} />
                                    <span>Thank you! You have successfully subscribed to our newsletter.</span>
                                </div>
                            ) : (
                                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-center gap-3 w-full">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter Email"
                                        className="bg-transparent border border-neutral-700 rounded-full px-6 py-3.5 text-sm text-white placeholder-neutral-500 outline-none w-full sm:w-80 md:w-96 focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold transition-all"
                                        required
                                        disabled={submitting}
                                    />
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="bg-neutral-200 hover:bg-white text-neutral-900 transition-all font-medium py-3.5 px-7 rounded-full flex items-center justify-center gap-2 cursor-pointer active:scale-95 shrink-0 w-full sm:w-auto disabled:opacity-50"
                                    >
                                        <span>{submitting ? 'Subscribing...' : 'Subscribe'}</span>
                                        <Send size={15} className="rotate-45" />
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer Links Row */}
                <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4 text-sm font-light text-neutral-400 mb-8">
                    <Link href="/blog" className="hover:text-white transition-colors">
                        Blog
                    </Link>
                    <Link href="/newsletter" className="hover:text-white transition-colors">
                        Newsletter
                    </Link>
                    <Link href="/gallery" className="hover:text-white transition-colors">
                        Gallery
                    </Link>
                    <Link href="/properties?status=Ready" className="hover:text-white transition-colors">
                        Handed over projects
                    </Link>
                    <a
                        href="https://youtube.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-white transition-colors flex items-center gap-1 group"
                    >
                        Video
                        <ExternalLink size={13} className="text-neutral-500 group-hover:text-white transition-colors" />
                    </a>
                    <Link href="/careers" className="hover:text-white transition-colors">
                        Career
                    </Link>
                    <Link href="/privacy" className="hover:text-white transition-colors">
                        Privacy policy
                    </Link>
                </div>

                {/* HQ Address Row */}
                <div className="text-center mb-8">
                    <p className="text-xs font-light text-neutral-500 tracking-wider uppercase">
                        PPD Celebration Point, 89, Lalbagh, Water Works Rd, Dhaka 1211
                    </p>
                </div>

                {/* Social Icons Row */}
                <div className="flex justify-center items-center gap-4 mb-8">
                    <a
                        href="https://facebook.com/primepropertiesbd"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full border border-neutral-800 hover:border-neutral-400 text-neutral-500 hover:text-white flex items-center justify-center transition-all bg-neutral-900/40"
                        aria-label="Facebook"
                    >
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                            <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                        </svg>
                    </a>
                    <a
                        href="https://linkedin.com/company/primepropertiesbd"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full border border-neutral-800 hover:border-neutral-400 text-neutral-500 hover:text-white flex items-center justify-center transition-all bg-neutral-900/40"
                        aria-label="LinkedIn"
                    >
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                        </svg>
                    </a>
                    <a
                        href="https://instagram.com/primepropertiesbd"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full border border-neutral-800 hover:border-neutral-400 text-neutral-500 hover:text-white flex items-center justify-center transition-all bg-neutral-900/40"
                        aria-label="Instagram"
                    >
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                    </a>
                    <a
                        href="https://youtube.com/@primepropertiesbd"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full border border-neutral-800 hover:border-neutral-400 text-neutral-500 hover:text-white flex items-center justify-center transition-all bg-neutral-900/40"
                        aria-label="YouTube"
                    >
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                            <path d="M23.498 6.163c-.272-1.022-1.074-1.826-2.099-2.099-1.855-.5-9.4-.5-9.4-.5s-7.544 0-9.399.5c-1.025.273-1.827 1.077-2.099 2.099-.5 1.856-.5 5.737-.5 5.737s0 3.882.5 5.737c.272 1.022 1.074 1.826 2.099 2.099 1.855.5 9.399.5 9.399.5s7.544 0 9.399-.5c1.025-.273 1.827-1.077 2.099-2.099.5-1.856.5-5.737.5-5.737s-.001-3.881-.5-5.737zm-14.394 9.172v-6.87l6.398 3.435-6.398 3.435z" />
                        </svg>
                    </a>
                </div>

                {/* Bottom Copyright Row */}
                <div className="pt-6 border-t border-neutral-900 text-center text-xs font-light text-neutral-600">
                    <p>Copyright © {new Date().getFullYear()} Prime Properties BD, all rights reserved.</p>
                </div>

            </div>
        </footer>
    );
}
