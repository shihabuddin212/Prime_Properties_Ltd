'use client';

import React, { useRef, useEffect, useState } from 'react';
import { MoveLeft, MoveRight, Loader2 } from 'lucide-react';

interface TestimonialCard {
    id: string;
    image: string;
    name: string;
    role: string;
    quote: string;
}

export default function TestimonialsSection() {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [testimonials, setTestimonials] = useState<TestimonialCard[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/admin/testimonials')
            .then(r => r.json())
            .then(data => { setTestimonials(data); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    const handleScrollLeft = () => {
        scrollContainerRef.current?.scrollBy({ left: -320, behavior: 'smooth' });
    };

    const handleScrollRight = () => {
        scrollContainerRef.current?.scrollBy({ left: 320, behavior: 'smooth' });
    };

    if (loading || testimonials.length === 0) return null;

    return (
        <section className="py-20 bg-neutral-50 dark:bg-primary-navy/40 transition-colors">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">

                {/* Header Row */}
                <div className="flex justify-between items-center mb-12">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
                            What do our customers say?
                        </h2>
                    </div>

                    {/* Navigation Buttons (Top Right) */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleScrollLeft}
                            className="w-11 h-11 rounded-full border border-neutral-300 dark:border-neutral-700 hover:border-neutral-900 dark:hover:border-white text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white flex items-center justify-center transition-all cursor-pointer active:scale-95"
                            aria-label="Previous testimonials"
                        >
                            <MoveLeft size={16} />
                        </button>
                        <button
                            onClick={handleScrollRight}
                            className="w-11 h-11 rounded-full border border-neutral-300 dark:border-neutral-700 hover:border-neutral-900 dark:hover:border-white text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white flex items-center justify-center transition-all cursor-pointer active:scale-95"
                            aria-label="Next testimonials"
                        >
                            <MoveRight size={16} />
                        </button>
                    </div>
                </div>

                {/* Horizontal Scrollable Slider */}
                <div
                    ref={scrollContainerRef}
                    className="flex gap-6 overflow-x-auto pb-8 no-scrollbar scroll-smooth snap-x snap-mandatory"
                >
                    {testimonials.map((item) => (
                        <div
                            key={item.id}
                            className="flex-shrink-0 w-[295px] sm:w-[320px] bg-white dark:bg-primary-navy border border-neutral-200/60 dark:border-neutral-800 rounded-2xl p-5 shadow-sm snap-start flex flex-col justify-between"
                        >
                            <div className="flex flex-col gap-4">
                                {/* Card Image */}
                                <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-neutral-100 border border-neutral-100">
                                    {item.image ? (
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 text-xs">No Photo</div>
                                    )}
                                    {/* PPD Brand Watermark */}
                                    <div className="absolute bottom-2.5 right-2.5 bg-neutral-900/40 backdrop-blur-md px-2 py-1 rounded text-[8px] font-bold text-white uppercase tracking-wider">
                                        PPD Brand
                                    </div>
                                </div>

                                {/* Text & Quote sign */}
                                <div className="space-y-2">
                                    <span className="text-3xl text-luxury-gold font-serif leading-none block h-4 select-none">"</span>
                                    <p className="text-xs font-light text-neutral-600 dark:text-neutral-400 leading-relaxed italic pr-2 line-clamp-4">
                                        {item.quote}
                                    </p>
                                </div>
                            </div>

                            {/* Homeowner Signature details */}
                            <div className="border-t border-neutral-100 dark:border-neutral-800/80 pt-4 mt-6 flex justify-between items-end">
                                <div>
                                    <h4 className="text-xs font-bold text-neutral-800 dark:text-white">
                                        {item.name}
                                    </h4>
                                    <p className="text-[10px] text-neutral-400 dark:text-neutral-500 font-light mt-0.5">
                                        {item.role}
                                    </p>
                                </div>
                                <div className="w-5 h-5 rounded-full bg-luxury-gold/10 flex items-center justify-center text-luxury-gold font-bold text-[8px]">
                                    ✓
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
