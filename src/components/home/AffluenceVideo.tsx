'use client';

import React, { useRef, useState } from 'react';
import { Play, Pause } from 'lucide-react';

export default function AffluenceVideo() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(true);

    const togglePlay = () => {
        if (!videoRef.current) return;
        if (isPlaying) {
            videoRef.current.pause();
            setIsPlaying(false);
        } else {
            videoRef.current.play().catch(err => console.log(err));
            setIsPlaying(true);
        }
    };

    return (
        <section className="relative w-full aspect-[16/7] min-h-[360px] md:min-h-[480px] overflow-hidden bg-neutral-950 flex items-center justify-center">
            {/* Background Video */}
            <video
                ref={videoRef}
                src="/RL2.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover opacity-80"
            />

            {/* Ambient Dark tint overlay */}
            <div className="absolute inset-0 bg-neutral-950/20" />

            {/* Play Button Overlay (Middle of the video) */}
            <button
                onClick={togglePlay}
                className="absolute w-16 h-16 md:w-20 md:h-20 rounded-full border border-white/30 bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer z-10 backdrop-blur-sm shadow-2xl"
                aria-label={isPlaying ? 'Pause' : 'Play'}
            >
                {isPlaying ? (
                    <Pause size={22} className="text-white fill-white" />
                ) : (
                    <Play size={22} className="text-white fill-white translate-x-0.5" />
                )}
            </button>

            {/* Bottom-left Text layout (Indulge in Affluence) */}
            <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12 z-10 max-w-lg">
                <h2 className="text-3xl md:text-5xl lg:text-6xl font-light text-white tracking-wider drop-shadow-md select-none font-sans uppercase">
                    Indulge in Affluence
                </h2>
            </div>

            {/* Micro bottom gradient to read easily */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
        </section>
    );
}
