'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageSliderProps {
    images: string[];
    title: string;
}

export default function ImageSlider({ images, title }: ImageSliderProps) {
    const [current, setCurrent] = useState(0);

    if (!images || images.length === 0) return null;

    const prev = () => setCurrent((c) => (c - 1 + images.length) % images.length);
    const next = () => setCurrent((c) => (c + 1) % images.length);

    return (
        <div className="space-y-4">
            {/* Main Image View */}
            <div className="relative w-full overflow-hidden rounded-[2rem] aspect-[16/9] bg-neutral-900 shadow-2xl border border-white/5 group">
                {images.map((img, idx) => (
                    <img
                        key={img}
                        src={img.trim()}
                        alt={`${title} - Image ${idx + 1}`}
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${idx === current ? 'opacity-100' : 'opacity-0'
                            }`}
                        loading={idx === 0 ? 'eager' : 'lazy'}
                    />
                ))}

                {/* Navigation Arrows */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={prev}
                            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-black/60 backdrop-blur-sm text-white flex items-center justify-center cursor-pointer transition select-none hover:bg-luxury-gold active:scale-95 border border-white/10"
                            aria-label="Previous image"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            onClick={next}
                            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-black/60 backdrop-blur-sm text-white flex items-center justify-center cursor-pointer transition select-none hover:bg-luxury-gold active:scale-95 border border-white/10"
                            aria-label="Next image"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </>
                )}
            </div>

            {/* Thumbnail Navigation Row */}
            {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-neutral-850">
                    {images.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrent(idx)}
                            className={`relative aspect-[4/3] w-24 sm:w-28 rounded-xl overflow-hidden shrink-0 border-2 cursor-pointer transition-all duration-200 ${idx === current
                                    ? 'border-luxury-gold scale-98 shadow-md'
                                    : 'border-transparent opacity-60 hover:opacity-100'
                                }`}
                        >
                            <img
                                src={img.trim()}
                                alt=""
                                className="w-full h-full object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
