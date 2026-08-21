'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Phone, MessageSquare, MapPin, Clock, ChevronRight, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 40) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks: { name: string; path: string; external?: boolean }[] = [
        { name: 'Home', path: '/' },
        { name: 'About Us', path: '/about' },
        { name: 'Properties', path: '/properties' },
        { name: 'Gallery', path: '/gallery' },
        { name: 'Landowner', path: '/landowner' },
        { name: 'Construction status', path: '/construction' },
        { name: 'Referral program', path: '/referral' },
        { name: 'NRB', path: '/nrb' },
        { name: 'Blog', path: '/blog' },
        { name: 'Newsletter', path: '/newsletter' },
        { name: 'Contact us', path: '/contact' },
        { name: 'Md Ariful Islam', path: '/founder' }
    ];

    const handleClose = (e?: React.SyntheticEvent) => {
        if (e) {
            e.stopPropagation();
        }
        setIsOpen(false);
    };

    const handleLinkClick = () => {
        setIsOpen(false);
    };

    const isAdminPath = pathname.startsWith('/admin');

    if (isAdminPath) return null; // Hidden in admin views

    return (
        <>
            <nav
                className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${isScrolled
                    ? 'bg-primary-navy/90 border-b border-luxury-gold/15 shadow-2xl backdrop-blur-md py-3'
                    : 'bg-transparent py-5'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between gap-2 overflow-hidden">

                        {/* Logo Link to Homepage */}
                        <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group shrink min-w-0">
                            <img
                                src="/PPD.png"
                                alt="PPD Logo"
                                className="h-8 sm:h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-105 rounded-lg border border-luxury-gold/10 shrink-0"
                            />
                            <div className="flex flex-col leading-none min-w-0">
                                <span className="text-[10px] sm:text-[13px] font-bold tracking-[0.08em] sm:tracking-[0.12em] text-white uppercase truncate">
                                    Prime <span className="text-luxury-gold">Properties</span>
                                </span>
                                <span className="text-[7px] sm:text-[9px] tracking-[0.1em] sm:tracking-[0.2em] text-gray-400 uppercase font-light truncate hidden min-[360px]:block">
                                    BD &mdash; Luxury Real Estate
                                </span>
                            </div>
                        </Link>

                        {/* Right Side Options */}
                        <div className="flex items-center gap-3 sm:gap-6 shrink-0">

                            {/* Menu Hamburger Toggle */}
                            <button
                                onClick={() => setIsOpen(true)}
                                className="flex items-center gap-2 text-white hover:text-luxury-gold focus:outline-none transition group cursor-pointer"
                                aria-label="Open Directory Menu"
                            >
                                <span className="text-[10px] sm:text-xs uppercase font-bold tracking-widest">Menu</span>
                                <div className="flex flex-col gap-1 items-center p-0.5 w-5 sm:w-6">
                                    <span className="w-full h-0.5 bg-white group-hover:bg-luxury-gold transition-all duration-300 rounded-full" />
                                    <span className="w-1/2 h-0.5 bg-white group-hover:bg-luxury-gold transition-all duration-300 rounded-full" />
                                    <span className="w-full h-0.5 bg-white group-hover:bg-luxury-gold transition-all duration-300 rounded-full" />
                                </div>
                            </button>

                        </div>
                    </div>
                </div>
            </nav>

            {/* Slide-out Sidebar Drawer Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.7 }}
                            exit={{ opacity: 0 }}
                            onClick={handleClose}
                            className="fixed inset-0 bg-primary-dark/80 backdrop-blur-sm z-50 transition-opacity cursor-pointer pointer-events-auto"
                        />

                        {/* Sidebar Pane */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 0l40 23v46L40 92 0 69V23L40 0zm0 6l34 19.6v39.2L40 84.4 6 64.8V25.6L40 6zm0 0v78.4M6 25.6l68 39.2M74 25.6L6 64.8' stroke='%23ffffff' stroke-width='0.45' stroke-opacity='0.08' fill='none'/%3E%3C/svg%3E")`
                            }}
                            className="fixed top-0 right-0 bottom-0 w-full max-w-sm sm:max-w-md bg-[#131313] border-l border-neutral-800/80 z-[60] flex flex-col justify-between shadow-[0_0_50px_rgba(0,0,0,0.8)] p-6 sm:p-10 overflow-y-auto pointer-events-auto"
                        >
                            <div className="flex flex-col h-full">
                                {/* Header containing the circular close button */}
                                <div className="flex justify-end p-2 mb-6">
                                    <button
                                        type="button"
                                        onClick={handleClose}
                                        onPointerDown={handleClose}
                                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-white hover:border-luxury-gold text-white hover:text-luxury-gold flex items-center justify-center transition-all cursor-pointer hover:bg-white/10 active:scale-90 shadow-md relative z-[70]"
                                        aria-label="Close menu"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>

                                {/* Directory Navigation Links */}
                                <div className="space-y-6 flex-1 flex flex-col justify-center pl-2 sm:pl-6 max-h-[85%] my-auto">
                                    <h3 className="text-3xl font-bold text-white tracking-wide mb-6">Menu</h3>

                                    <nav className="space-y-5">
                                        {navLinks.map((link) => {
                                            return (
                                                <Link
                                                    key={link.name}
                                                    href={link.path}
                                                    onClick={handleLinkClick}
                                                    className="flex items-center gap-3.5 text-base sm:text-lg font-medium text-neutral-300 hover:text-white transition-all group py-1.5 cursor-pointer"
                                                >
                                                    <ChevronRight size={16} className="text-neutral-400 group-hover:text-white transition-colors group-hover:translate-x-0.5 duration-200 shrink-0" />
                                                    <span className="font-sans leading-none">{link.name}</span>
                                                    {link.external && (
                                                        <ExternalLink size={14} className="text-neutral-400 group-hover:text-white transition-colors ml-1 shrink-0" />
                                                    )}
                                                </Link>
                                            );
                                        })}
                                    </nav>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
