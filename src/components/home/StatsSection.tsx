'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Users2, ShieldCheck, Award } from 'lucide-react';

export default function StatsSection() {
    const stats = [
        {
            icon: <Building2 className="text-luxury-gold" size={28} />,
            value: '45+',
            title: 'Projects Delivered',
            subtitle: 'Luxury apartments & high-rises',
        },
        {
            icon: <Users2 className="text-luxury-gold" size={28} />,
            value: '1,200+',
            title: 'Happy Families',
            subtitle: 'Premium homeowners in Dhaka',
        },
        {
            icon: <ShieldCheck className="text-luxury-gold" size={28} />,
            value: '100%',
            title: 'Legal Clearance',
            subtitle: 'RAJUK & CDA approvals assured',
        },
        {
            icon: <Award className="text-luxury-gold" size={28} />,
            value: '15+',
            title: 'Years of Trust',
            subtitle: 'In Bangladesh real estate',
        },
    ];

    return (
        <section className="py-20 bg-white dark:bg-primary-navy transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat, idx) => (
                        <motion.div
                            key={stat.title}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.15 }}
                            className="flex flex-col items-center text-center p-6 bg-slate-surface dark:bg-primary-dark/20 border border-gray-100 dark:border-gray-800/80 rounded-2xl"
                        >
                            <div className="w-12 h-12 rounded-full bg-luxury-gold/10 flex items-center justify-center mb-4">
                                {stat.icon}
                            </div>
                            <span className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">
                                {stat.value}
                            </span>
                            <h3 className="text-sm font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider mb-1">
                                {stat.title}
                            </h3>
                            <p className="text-xs text-gray-400 font-light leading-relaxed">
                                {stat.subtitle}
                            </p>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
}
