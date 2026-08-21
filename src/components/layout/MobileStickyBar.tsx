'use client';

import React from 'react';
import { Phone, MessageSquare, Search } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function MobileStickyBar() {
    const pathname = usePathname();

    const isAdminPath = pathname.startsWith('/admin');

    if (isAdminPath) return null; // Hide on admin pages

    const triggerSearch = () => {
        window.dispatchEvent(new Event('open-search-drawer'));
    };

    return (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-primary-dark/90 backdrop-blur-md border-t border-luxury-gold/30 shadow-[0_-4px_16px_rgba(0,0,0,0.4)] px-4 py-2 flex items-center justify-around h-16">
            {/* Call Button */}
            <a
                href="tel:01829116107"
                className="flex flex-col items-center justify-center text-gray-300 hover:text-luxury-gold flex-1 text-center h-full active:scale-95 transition-transform"
            >
                <Phone size={20} className="text-luxury-gold mb-1" />
                <span className="text-[10px] font-semibold uppercase tracking-wider">Call Us</span>
            </a>

            {/* Vertical Divider */}
            <div className="h-8 w-px bg-gray-800" />

            {/* WhatsApp Button */}
            <a
                href="https://wa.me/8801829116107"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center text-gray-300 hover:text-luxury-gold flex-1 text-center h-full active:scale-95 transition-transform"
            >
                <MessageSquare size={20} className="text-green-500 mb-1" />
                <span className="text-[10px] font-semibold uppercase tracking-wider">WhatsApp</span>
            </a>

            {/* Vertical Divider */}
            <div className="h-8 w-px bg-gray-800" />

            {/* Instant Search Button */}
            <button
                onClick={triggerSearch}
                className="flex flex-col items-center justify-center text-gray-300 hover:text-luxury-gold flex-1 text-center h-full active:scale-95 transition-transform cursor-pointer"
            >
                <Search size={20} className="text-luxury-gold mb-1" />
                <span className="text-[10px] font-semibold uppercase tracking-wider">Instant Search</span>
            </button>
        </div>
    );
}
