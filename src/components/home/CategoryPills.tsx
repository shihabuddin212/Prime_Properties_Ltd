'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface CategoryPillsProps {
    activeCategory: string;
    onChangeCategory: (category: string) => void;
}

export default function CategoryPills({ activeCategory, onChangeCategory }: CategoryPillsProps) {
    const categories = [
        { label: 'All Projects', value: 'All' },
        { label: 'Ongoing', value: 'Ongoing' },
        { label: 'Upcoming', value: 'Upcoming' },
        { label: 'Ready', value: 'Ready' },
        { label: 'Commercial', value: 'Commercial' },
        { label: 'Landowner JV', value: 'Landowner JV' },
    ];

    return (
        <div className="w-full flex justify-center py-4">
            <div className="flex gap-2 overflow-x-auto pb-3 px-4 max-w-full no-scrollbar mask-gradient">
                {categories.map((cat) => {
                    const isActive = activeCategory === cat.value;
                    return (
                        <button
                            key={cat.value}
                            onClick={() => onChangeCategory(cat.value)}
                            className={`relative px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 whitespace-nowrap cursor-pointer ${isActive
                                    ? 'text-white'
                                    : 'bg-white dark:bg-primary-navy/40 border border-gray-150 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:text-luxury-gold'
                                }`}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activeCategoryPill"
                                    className="absolute inset-0 bg-luxury-gold rounded-full z-0"
                                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                />
                            )}
                            <span className="relative z-10">{cat.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
