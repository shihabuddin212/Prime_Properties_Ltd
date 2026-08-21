'use client';

import React, { useState } from 'react';
import { Home, TrendingUp, Key, Shield, Palette, FileText, ChevronRight, Phone, MessageSquare } from 'lucide-react';

const services = [
    {
        icon: <Home size={22} />,
        title: 'Choose a property',
        desc: 'Browse our portfolio and select from premium projects across Dhaka with guidance from our NRB team.'
    },
    {
        icon: <TrendingUp size={22} />,
        title: 'Joint venture land development',
        desc: "Invest in PPD's land development projects. Ideally suited, structured and supervised developer partnership."
    },
    {
        icon: <Key size={22} />,
        title: 'Buy, Sell & rent',
        desc: 'Comprehensive support for purchasing, selling, renting, and lease needs in Bangladesh.'
    },
    {
        icon: <Shield size={22} />,
        title: 'Security & Management',
        desc: 'Make your property work for you with professional remittance support, all handled as it should.'
    },
    {
        icon: <Palette size={22} />,
        title: 'Interior design & implementation',
        desc: 'Turn your real estate into a reality via full interior design and implementation support.'
    },
    {
        icon: <FileText size={22} />,
        title: 'Legal & documentation support',
        desc: 'Based on our team with the experience, we also carry full information needed for a smoother focus on journey.'
    }
];

const whyPoints = [
    'Securing the capabilities of NRBs like never seen',
    'Secured affordable investment opportunity',
    'Easy to handle needs of property',
    'Wide range and abundant service',
    'Advanced continues to help you at every stage',
    'Gain a realistic, updated deep understanding of properties',
    'A reliable alternative investment service',
    'Registration for completion of every process',
    'Strong commitment to every process',
    'Client requirements on every successful closure'
];

export default function NRBPage() {
    const [selectedService, setSelectedService] = useState('');
    const [isContinued, setIsContinued] = useState(false);

    const serviceOptions = [
        'Choose a property',
        'Joint Venture Land Development',
        'Buy, Sell & Rent Property',
        'Security & Property Management',
        'Interior Design Support',
        'Legal & Documentation'
    ];

    return (
        <div className="pt-20 min-h-screen bg-[#1c1c1e] text-white">

            {/* 1. Hero Block */}
            <section
                className="relative w-full min-h-[52vh] bg-neutral-950 overflow-hidden flex items-end justify-start p-10 lg:p-20 border-b border-neutral-800"
                style={{ backgroundImage: `url('https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&q=80&w=1920')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            >
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
                <div className="relative z-10 max-w-xl space-y-3">
                    <h1 className="text-4xl sm:text-5xl font-light text-white tracking-wide leading-tight">
                        Making homeownership a joyful experience
                    </h1>
                    <p className="text-xs font-light text-neutral-300 leading-relaxed max-w-sm">
                        Own, develop, or manage property in Dhaka and Chattogram with exclusive financial offers. Count on our real estate support from PPD.
                    </p>
                </div>
            </section>

            {/* 2. For Each Road Will Lead - Two Column */}
            <div className="bg-[#1c1c1e] py-20 border-b border-[#333]">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">

                        {/* Left texts */}
                        <div className="space-y-6">
                            <div className="border-l-4 border-luxury-gold pl-5 space-y-3">
                                <h2 className="text-2xl sm:text-3xl font-light text-white leading-snug italic">
                                    For each road will lead along —<br />Every wish made upon the land we belong.
                                </h2>
                            </div>
                            <div className="space-y-4 text-xs font-light text-neutral-300 leading-[1.8]">
                                <p>
                                    As a non-resident Bangladeshi, there is still a lot to hold with — and what you work best for is to make sure those truest dreams for yourself want to realize your property. Do you need to keep it secured?
                                </p>
                                <p>
                                    Our team of professionals work comprehensively and authentically to accomplish your real estate goals in Bangladesh, providing you with world class solutions that keep your interests safe and fully supported to help with you at every milestone.
                                </p>
                            </div>
                        </div>

                        {/* Right image */}
                        <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl border border-white/8">
                            <img
                                src="https://images.unsplash.com/photo-1545464693-f17e30d7ea2d?auto=format&fit=crop&q=80&w=900"
                                alt="Aerial city landscape"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-br from-luxury-gold/10 to-transparent" />
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Complete Real Estate Solutions for NRBs */}
            <div className="bg-[#252527] py-20 border-b border-[#333]">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-10">

                    <div className="space-y-3">
                        <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-luxury-gold font-sans">
                            — We Serve
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-light text-white tracking-wide">
                            Complete real estate solutions for NRBs
                        </h2>
                        <p className="text-xs font-light text-neutral-400 max-w-xl leading-relaxed">
                            Choose the service most relevant to your situation: buying, investing, renting, developing, or securing your property in Bangladesh.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {services.map((s, i) => (
                            <div
                                key={i}
                                className="bg-[#1c1c1e] border border-[#333] rounded-2xl p-7 space-y-4 group hover:border-luxury-gold/30 hover:-translate-y-1 transition-all duration-300 cursor-default"
                            >
                                <div className="w-11 h-11 rounded-xl bg-luxury-gold/10 border border-luxury-gold/20 flex items-center justify-center text-luxury-gold group-hover:bg-luxury-gold/20 transition-colors">
                                    {s.icon}
                                </div>
                                <h3 className="text-sm font-bold text-white tracking-wide">{s.title}</h3>
                                <p className="text-xs font-light text-neutral-400 leading-[1.75]">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 4. High Quality - Why sections */}
            <div className="bg-[#1c1c1e] py-20 border-b border-[#333]">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-start">

                        {/* Left */}
                        <div className="space-y-6">
                            <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-luxury-gold font-sans block">
                                — What Makes Us Unique?
                            </span>
                            <h2 className="text-3xl sm:text-4xl font-light text-white tracking-wide leading-snug">
                                High Quality of Construction. Design Excellence. Reliability. Customer-centricity.
                            </h2>
                            <p className="text-xs font-light text-neutral-400 leading-[1.8] max-w-md">
                                Prime Properties BD offers the most trusted, accessible and fully dedicated real estate services to help you successfully invest and establish your presence in Bangladesh's growing market. With team experience spanning over 18 years, there is no challenge we haven't faced before.
                            </p>
                        </div>

                        {/* Right - checklist points */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3.5">
                            {whyPoints.map((p, idx) => (
                                <div key={idx} className="flex items-start gap-2.5 text-[11px] text-neutral-300 font-light">
                                    <span className="shrink-0 text-luxury-gold font-bold mt-0.5 text-xs">✓</span>
                                    <span>{p}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* 5. Find the right NRB service card (Call for Details) */}
            <div
                className="relative py-24 border-t border-[#333] overflow-hidden"
                style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1920')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
                <div className="absolute inset-0 bg-black/70" />

                <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

                        {/* Left contact details */}
                        <div className="space-y-6">
                            <div>
                                <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-luxury-gold">
                                    — Call for Details
                                </span>
                                <h2 className="text-3xl sm:text-4xl font-light text-white tracking-wide mt-2">
                                    Find the right NRB service
                                </h2>
                            </div>
                            <p className="text-xs font-light text-neutral-300 leading-relaxed max-w-sm">
                                Talk to PPD's team with buying, developing, maintaining, securing or obtaining your property in Bangladesh.
                            </p>

                            <nav className="space-y-4 text-xs font-light text-neutral-300">
                                <a href="tel:16604" className="flex items-center gap-3 group w-fit">
                                    <span className="w-8 h-8 rounded-full bg-[#262628] border border-neutral-700 flex items-center justify-center text-luxury-gold shrink-0 group-hover:border-luxury-gold/50 transition-colors">
                                        <Phone size={14} />
                                    </span>
                                    <span className="group-hover:text-white transition-colors">16604 – Our hotline details</span>
                                </a>
                                <a href="https://wa.me/8801829116107" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group w-fit">
                                    <span className="w-8 h-8 rounded-full bg-[#262628] border border-neutral-700 flex items-center justify-center text-luxury-gold shrink-0 group-hover:border-luxury-gold/50 transition-colors">
                                        <MessageSquare size={14} />
                                    </span>
                                    <span className="group-hover:text-white transition-colors">WhatsApp dedicated NRB support</span>
                                </a>
                            </nav>
                        </div>

                        {/* Right – Find your service selector card */}
                        <div className="bg-[#fafaf8] text-neutral-900 rounded-[2rem] p-8 shadow-2xl border border-neutral-200 max-w-md w-full">
                            <h3 className="text-xl font-bold tracking-wide text-neutral-900 mb-1">
                                Find your service
                            </h3>
                            <p className="text-xs font-light text-neutral-500 mb-6 leading-relaxed">
                                Choose the service that best matches your needs to get tailored information and direct assistance.
                            </p>

                            {!isContinued ? (
                                <div className="space-y-4">
                                    <div className="relative">
                                        <select
                                            value={selectedService}
                                            onChange={(e) => setSelectedService(e.target.value)}
                                            className="w-full appearance-none bg-[#f3f3f1] border border-neutral-300 rounded-xl px-4 py-3 text-xs text-neutral-700 outline-none focus:border-neutral-500 cursor-pointer pr-10"
                                        >
                                            <option value="">Select a service...</option>
                                            {serviceOptions.map((opt, idx) => (
                                                <option key={idx} value={opt}>{opt}</option>
                                            ))}
                                        </select>
                                        <ChevronRight size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 rotate-90 pointer-events-none" />
                                    </div>

                                    <button
                                        onClick={() => selectedService && setIsContinued(true)}
                                        disabled={!selectedService}
                                        className="w-full bg-[#c5a880] hover:bg-[#b0946e] disabled:opacity-40 disabled:cursor-not-allowed text-neutral-900 py-3 rounded-full text-xs font-black tracking-wider transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        <span>Continue</span>
                                        <ChevronRight size={14} />
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-xs text-green-800">
                                        <p className="font-bold">Service selected: {selectedService}</p>
                                        <p className="font-light mt-1">Our NRB team will contact you shortly with detailed information about this service.</p>
                                    </div>
                                    <button
                                        onClick={() => { setIsContinued(false); setSelectedService(''); }}
                                        className="text-xs font-semibold text-neutral-500 hover:text-neutral-800 underline cursor-pointer transition-colors"
                                    >
                                        Choose a different service
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
