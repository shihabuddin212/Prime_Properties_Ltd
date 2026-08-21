'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, MapPin, Home, Info, HelpCircle } from 'lucide-react';

export default function SearchDrawer() {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    // Filters state
    const [location, setLocation] = useState('');
    const [type, setType] = useState('');
    const [status, setStatus] = useState('');
    const [beds, setBeds] = useState('');

    useEffect(() => {
        const handleOpen = () => setIsOpen(true);
        window.addEventListener('open-search-drawer', handleOpen);
        return () => window.removeEventListener('open-search-drawer', handleOpen);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setIsOpen(false);

        // Construct search queries
        const params = new URLSearchParams();
        if (location) params.append('location', location);
        if (type) params.append('type', type);
        if (status) params.append('status', status);
        if (beds) params.append('beds', beds);

        router.push(`/properties?${params.toString()}`);
    };

    const clearFilters = () => {
        setLocation('');
        setType('');
        setStatus('');
        setBeds('');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-primary-navy/80 backdrop-blur-sm transition-opacity duration-300"
                onClick={() => setIsOpen(false)}
            />

            {/* Drawer Container */}
            <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
                <div className="w-screen max-w-md">
                    <div className="h-full flex flex-col bg-primary-navy border-l border-luxury-gold/20 shadow-2xl overflow-y-auto">

                        {/* Header */}
                        <div className="px-6 py-5 bg-primary-dark border-b border-luxury-gold/10 flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                    <Search size={18} className="text-luxury-gold" />
                                    Instant Filter Search
                                </h2>
                                <p className="text-xs text-gray-400 font-light mt-0.5">Find your premium sanctuary in Bangladesh</p>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-gray-400 hover:text-white p-2 rounded-xl hover:bg-gray-800 transition-all cursor-pointer"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSearch} className="flex-1 flex flex-col justify-between p-6 space-y-8">
                            <div className="space-y-6">

                                {/* Location */}
                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-wider font-semibold text-luxury-gold flex items-center gap-1.5">
                                        <MapPin size={12} />
                                        Location
                                    </label>
                                    <select
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        className="w-full bg-primary-dark/80 border border-gray-800 text-gray-300 rounded-xl px-4 py-3 text-sm focus:border-luxury-gold/50 outline-none transition-all cursor-pointer"
                                    >
                                        <option value="">All Locations</option>
                                        <option value="Gulshan">Gulshan, Dhaka</option>
                                        <option value="Dhanmondi">Dhanmondi, Dhaka</option>
                                        <option value="Lalbagh">Lalbagh, Dhaka</option>
                                        <option value="Mirpur">Mirpur, Dhaka</option>
                                        <option value="Purbachal">Purbachal, Dhaka</option>
                                        <option value="Chattogram">North Khulshi, Chattogram</option>
                                    </select>
                                </div>

                                {/* Property Type */}
                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-wider font-semibold text-luxury-gold flex items-center gap-1.5">
                                        <Home size={12} />
                                        Property Type
                                    </label>
                                    <select
                                        value={type}
                                        onChange={(e) => setType(e.target.value)}
                                        className="w-full bg-primary-dark/80 border border-gray-800 text-gray-300 rounded-xl px-4 py-3 text-sm focus:border-luxury-gold/50 outline-none transition-all cursor-pointer"
                                    >
                                        <option value="">All Types</option>
                                        <option value="Apartment">Luxury Apartment</option>
                                        <option value="Commercial">Commercial Space</option>
                                        <option value="Land">JV Land Plot</option>
                                    </select>
                                </div>

                                {/* Property Status */}
                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-wider font-semibold text-luxury-gold flex items-center gap-1.5">
                                        <Info size={12} />
                                        Property Status
                                    </label>
                                    <select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                        className="w-full bg-primary-dark/80 border border-gray-800 text-gray-300 rounded-xl px-4 py-3 text-sm focus:border-luxury-gold/50 outline-none transition-all cursor-pointer"
                                    >
                                        <option value="">All Statuses</option>
                                        <option value="Ready">Ready to Move</option>
                                        <option value="Ongoing">Ongoing Construction</option>
                                        <option value="Upcoming">Upcoming Launch</option>
                                        <option value="Landowner JV">Landowner Joint Venture</option>
                                    </select>
                                </div>

                                {/* Bed Configuration */}
                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-wider font-semibold text-luxury-gold flex items-center gap-1.5">
                                        <HelpCircle size={12} />
                                        Min Bedrooms
                                    </label>
                                    <div className="grid grid-cols-5 gap-2">
                                        {['', '1', '2', '3', '4'].map((b) => (
                                            <button
                                                key={b}
                                                type="button"
                                                onClick={() => setBeds(b)}
                                                className={`py-3 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${beds === b
                                                        ? 'bg-luxury-gold border-luxury-gold text-white'
                                                        : 'bg-primary-dark/80 border-gray-800 text-gray-400 hover:border-luxury-gold/30 hover:text-white'
                                                    }`}
                                            >
                                                {b === '' ? 'Any' : `${b}+`}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-3 pt-6 border-t border-gray-800">
                                <button
                                    type="submit"
                                    className="w-full bg-luxury-gold hover:bg-gold-hover text-white py-4 rounded-xl text-sm font-semibold uppercase tracking-wider shadow-lg hover:shadow-luxury-gold/20 active:scale-[0.98] transition-all cursor-pointer"
                                >
                                    Apply Filters
                                </button>
                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    className="w-full border border-gray-800 hover:border-gray-700 text-gray-400 hover:text-white py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer"
                                >
                                    Clear All
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
