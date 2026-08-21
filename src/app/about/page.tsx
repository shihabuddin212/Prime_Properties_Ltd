'use client';

import React, { useState } from 'react';
import { CheckCircle, ChevronLeft, ChevronRight, Play, Star } from 'lucide-react';

const timelineData = [
    {
        year: '1984',
        period: '1984-1985',
        project: 'FORUM APARTMENTS',
        location: 'DHAKA',
        image: 'https://images.unsplash.com/photo-1545464693-f17e30d7ea2d?auto=format&fit=crop&q=80&w=805',
        text: 'In 1984, Prime Properties Bd (PPD) started its journey in the real estate sector of Bangladesh, with a resolution to do property building in the Port City Chittagong and Dhaka, establishing a benchmark for luxury constructions.'
    },
    {
        year: '1986',
        period: '1986-1990',
        project: 'LALBAGH HERITAGE',
        location: 'LALBAGH, DHAKA',
        image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=805',
        text: 'Initiated our first premium residency signature apartments in Lalbagh, bringing structured concrete design and community parks together.'
    },
    {
        year: '1992',
        period: '1992-1995',
        project: 'DHANMONDI HEIGHTS',
        location: 'DHANMONDI, DHAKA',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=805',
        text: 'Expanded into modern residential high-rises in Dhanmondi, providing first-generation elevator architectures and sub-station facilities.'
    },
    {
        year: '1996',
        period: '1996-1999',
        project: 'GREEN ENCLAVE',
        location: 'GULSHAN-1, DHAKA',
        image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&q=80&w=805',
        text: 'Pioneered lake-facing residences in Gulshan, setting new milestones in safety parameters and deep piling foundations.'
    },
    {
        year: '2000',
        period: '2000-2005',
        project: 'PPD PLAZA',
        location: 'UTTARA, DHAKA',
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=805',
        text: 'Entered the commercial real estate sector by constructing state-of-the-art office spaces in Uttara and Banani.'
    },
    {
        year: '2006',
        period: '2006-2010',
        project: 'BAYVIEW ENCLAVE',
        location: 'HALISHAHAR, CHITTOGRAM',
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=805',
        text: 'Expanded large-scale enclaves in Chattogram, building elevated residential apartments overlooking the Bay of Bengal.'
    },
    {
        year: '2011',
        period: '2011-2015',
        project: 'CORPORATE TOWER',
        location: 'KAWRAN BAZAR, DHAKA',
        image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=805',
        text: 'Completed commercial landmarks utilizing environment friendly sustainable concrete compounds and smart sensor integrations.'
    },
    {
        year: '2016',
        period: '2016-2018',
        project: 'AQUATONE SIGNATURE',
        location: 'BANANI, DHAKA',
        image: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&q=80&w=805',
        text: 'Launched custom boutique homes featuring central marble designs, modular kitchens, and infinity pools.'
    },
    {
        year: '2019',
        period: '2019-2020',
        project: 'BEVERLY RESIDENCE',
        location: 'GULSHAN-2, DHAKA',
        image: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=905',
        text: 'Set standard heights for luxury residences featuring advanced fire protection systems and complete home automation.'
    },
    {
        year: '2020',
        period: '2020-2021',
        project: 'CIVIC CENTER',
        location: 'DHANMONDI, DHAKA',
        image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&q=80&w=805',
        text: 'Constructed signature retail high-rises to establish a new shopping convenience paradigm in Dhaka.'
    },
    {
        year: '2021',
        period: '2021-2022',
        project: 'PLEASANT HOMES',
        location: 'UTTARA, DHAKA',
        image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=805',
        text: 'Handed over iconic structures on-time, maintaining our strict delivery pledge despite global material supply chain shifts.'
    },
    {
        year: '2022',
        period: '2022-2025',
        project: 'AQUALUNA',
        location: 'DHANMONDI, DHAKA',
        image: 'https://images.unsplash.com/photo-1545464693-f17e30d7ea2d?auto=format&fit=crop&q=80&w=805',
        text: 'Our flagship architectural wonder, establishing new thresholds in residential engineering, aesthetics and landscaping.'
    },
    {
        year: '2026',
        period: '2026-Present',
        project: 'PPD CELEBRATION POINT',
        location: 'GULSHAN-2, DHAKA',
        image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=805',
        text: 'Sculpting upcoming net-zero layouts and carbon-neutral structures to lead the sustainable developer index across Bangladesh.'
    }
];

const testimonialsData = [
    {
        name: 'Ariful Arafath',
        role: 'Homeowner (Aqualuna)',
        quote: 'Prime Properties is exceptionally good at fulfilling their commitments. Their construction sequence and structural finishes are highly satisfying.',
        stars: 5,
        avatar: 'A'
    },
    {
        name: 'Dr Sayedun Naher',
        role: 'Landowner',
        quote: 'My heartfelt gratitude to PPD for creating an opportunity to experience an exclusive and seamless joint venture development.',
        stars: 5,
        avatar: 'D'
    },
    {
        name: 'Iqbal Anwar',
        role: 'Commercial',
        quote: 'We are truly excited for our great business complex execution. PPD has become the best commercial developer for us.',
        stars: 5,
        avatar: 'I'
    }
];

export default function AboutPage() {
    const [timelineIdx, setTimelineIdx] = useState(0);

    const handlePrevYear = () => {
        setTimelineIdx((prev) => (prev > 0 ? prev - 1 : timelineData.length - 1));
    };

    const handleNextYear = () => {
        setTimelineIdx((prev) => (prev < timelineData.length - 1 ? prev + 1 : 0));
    };

    return (
        <div className="pt-20 min-h-screen bg-[#1c1c1e] text-white">

            {/* 1. Hero Banner */}
            <section className="relative w-full aspect-[21/7] min-h-[350px] bg-neutral-950 overflow-hidden flex items-center justify-center p-6 bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1920')` }}>
                <div className="absolute inset-0 bg-black/50" />
                <div className="relative z-10 text-center max-w-4xl mx-auto space-y-4">
                    <h1 className="text-2xl sm:text-4xl lg:text-5xl font-light text-white tracking-widest leading-relaxed px-4">
                        We don't just make buildings. We're in the business of customer satisfaction
                    </h1>
                </div>
            </section>

            {/* Dark Background Section (Legacy & Timeline) */}
            <div className="bg-[#1c1c1e] w-full py-20 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-28">

                    {/* 2. A Legacy of Excellence */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
                        {/* Left - Overlapping images */}
                        <div className="relative flex items-center justify-center w-full min-h-[350px] md:min-h-[440px]">
                            <div className="relative w-[70%] aspect-[4/5] rounded-[2rem] overflow-hidden bg-neutral-900 border border-white/5">
                                <img
                                    src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=600"
                                    alt="Building looking up"
                                    className="w-full h-full object-cover opacity-80"
                                />
                            </div>
                            <div className="absolute bottom-0 left-[10%] w-[55%] aspect-[1.1] rounded-[2rem] overflow-hidden shadow-2xl border-4 border-[#1c1c1e] transform translate-y-[15%]">
                                <img
                                    src="https://images.unsplash.com/photo-1545464693-f17e30d7ea2d?auto=format&fit=crop&q=80&w=405"
                                    alt="Modern stairs"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                    <button className="w-14 h-14 rounded-full bg-white text-neutral-900 flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer">
                                        <Play size={20} className="fill-neutral-900 translate-x-0.5" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Right - Text */}
                        <div className="space-y-6 pt-10 md:pt-0">
                            <div className="w-8 h-0.5 bg-white mb-2" />
                            <h2 className="text-3xl lg:text-4xl font-light tracking-wide text-white">
                                A Legacy of Excellence
                            </h2>

                            <div className="space-y-5 text-[13px] font-light text-neutral-300 leading-[1.8] pr-2">
                                <p>
                                    Prime Properties Bd (PPD) stands as one of the pioneers of Bangladesh's real estate sector, offering standards of professionalism and integrity across the industry. With a legacy of architecture and high quality of construction, we have seamlessly sculpted the city skyline and community for over four decades.
                                </p>
                                <p>
                                    Our real estate journey is defined by accuracy and high standards of excellence. Together, they create a passion of serving property buyers in the market. This is also deeply embedded by the trust and natural loyalty of our customers, which is the key that only grows stronger with time.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* 3. Timeline Slider */}
                    <div className="space-y-8 relative pb-10">
                        {/* Background Text */}
                        <div className="absolute -top-12 md:-top-16 left-1/2 -translate-x-1/2 w-[120%] text-center pointer-events-none select-none overflow-hidden">
                            <span className="text-5xl md:text-8xl font-bold uppercase tracking-widest text-[#2a2a2c] opacity-50 whitespace-nowrap">
                                HIGH QUALITY OF CONSTRUCTION. DESIGN
                            </span>
                        </div>

                        <div className="relative z-10 text-center">
                            <h3 className="text-lg md:text-xl font-light text-white tracking-wide">
                                Check out how we started shaping the future 4 decades ago
                            </h3>
                        </div>

                        {/* Slider Card */}
                        <div className="relative z-10 border border-[#333] rounded-3xl p-6 md:p-8 bg-transparent">

                            {/* Year Navigation */}
                            <div className="flex items-center justify-between border-b border-[#333] pb-6 mb-8">
                                <button
                                    onClick={handlePrevYear}
                                    className="w-8 h-8 rounded border border-[#444] text-[#888] hover:text-white flex items-center justify-center transition-all flex-shrink-0"
                                >
                                    <ChevronLeft size={14} />
                                </button>

                                <div className="flex-1 overflow-x-auto flex items-center justify-start md:justify-center gap-2 mx-4 no-scrollbar scroll-smooth">
                                    {timelineData.map((item, idx) => (
                                        <button
                                            key={item.year}
                                            onClick={() => setTimelineIdx(idx)}
                                            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${idx === timelineIdx
                                                    ? 'bg-white text-neutral-900'
                                                    : 'text-neutral-400 hover:text-white border border-transparent hover:border-neutral-700'
                                                }`}
                                        >
                                            {item.year}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={handleNextYear}
                                    className="w-8 h-8 rounded border border-[#444] text-[#888] hover:text-white flex items-center justify-center transition-all flex-shrink-0"
                                >
                                    <ChevronRight size={14} />
                                </button>
                            </div>

                            {/* Slider Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                                {/* Project Image */}
                                <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-neutral-900">
                                    <img
                                        src={timelineData[timelineIdx].image}
                                        alt={timelineData[timelineIdx].project}
                                        className="w-full h-full object-cover opacity-80"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 flex flex-col justify-end p-6 md:p-8 items-center text-center">
                                        <h4 className="text-white font-bold text-2xl tracking-widest uppercase mb-1">
                                            {timelineData[timelineIdx].project}
                                        </h4>
                                        <p className="text-xs text-neutral-300 tracking-widest uppercase">
                                            {timelineData[timelineIdx].location}
                                        </p>
                                    </div>
                                </div>

                                {/* Text Details */}
                                <div className="space-y-4 px-2">
                                    <h4 className="text-white text-xl border-b border-[#333] pb-2 inline-block">
                                        {timelineData[timelineIdx].period}
                                    </h4>
                                    <p className="text-[#a0a0a0] font-light leading-[1.8] text-sm">
                                        {timelineData[timelineIdx].text}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Light Background Section (Mission/Vision & Why PPD) */}
            <div className="bg-[#e4e6e8] w-full py-20 text-neutral-900 border-t border-[#d0d2d4]">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-24">

                    {/* 4. Mission, Vision, Core Values */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
                        {/* Texts */}
                        <div className="space-y-8">
                            <div className="space-y-1">
                                <h3 className="text-3xl font-light text-neutral-800 tracking-wide">Mission</h3>
                                <p className="text-xs font-medium text-neutral-500 uppercase tracking-widest">
                                    to build homes with safety and satisfaction.
                                </p>
                            </div>

                            <div className="space-y-1">
                                <h3 className="text-3xl font-light text-neutral-800 tracking-wide">Vision</h3>
                                <p className="text-xs font-medium text-neutral-500 uppercase tracking-widest">
                                    to be the most trusted and respected real estate company.
                                </p>
                            </div>

                            <div className="space-y-4 pt-2">
                                <h3 className="text-3xl font-light text-neutral-800 tracking-wide">Core Values</h3>
                                <nav className="flex flex-col gap-3">
                                    {[
                                        'We put the Customer First.',
                                        'We construct with transparency. We work with the best.',
                                        'Safety is always priority No.0.',
                                        'Respect, Courtesy & Trust in our People.',
                                        'High level of Honesty & Integrity.',
                                        'Speed is our work ethic. We do not do delayed handovers.',
                                        'Practice Teamwork & Constantly Enhance Talent Density.'
                                    ].map((item, index) => (
                                        <div key={index} className="flex gap-2.5 items-start text-[13px] font-medium text-neutral-600">
                                            <CheckCircle size={15} className="text-neutral-700 shrink-0 mt-0.5" />
                                            <span>{item}</span>
                                        </div>
                                    ))}
                                </nav>
                            </div>
                        </div>

                        {/* Right Image */}
                        <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden shadow-xl border border-white/50">
                            <img
                                src="https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&q=80&w=800"
                                alt="Modern building from low angle"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute right-6 top-1/2 -translate-y-1/2">
                                <button className="w-14 h-14 rounded-full bg-white/90 text-neutral-900 shadow-xl flex items-center justify-center cursor-pointer transition-transform hover:scale-105 active:scale-95 border border-neutral-200">
                                    <Play size={20} className="fill-neutral-900 translate-x-0.5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* 5. Why should you choose PPD? */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center border-t border-neutral-300 pt-16">
                        {/* Left Image */}
                        <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden shadow-lg border border-white/50">
                            <img
                                src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800"
                                alt="Balcony view looking up"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute right-6 top-1/2 -translate-y-1/2">
                                <button className="w-14 h-14 rounded-full bg-black/60 text-white flex items-center justify-center cursor-pointer transition-transform hover:scale-105 border border-white/20 backdrop-blur-sm">
                                    <Play size={20} className="fill-white translate-x-0.5" />
                                </button>
                            </div>
                        </div>

                        {/* Right Text */}
                        <div className="space-y-6">
                            <h2 className="text-3xl md:text-4xl font-light text-neutral-800 tracking-wide">
                                Why should you choose PPD?
                            </h2>
                            <p className="text-xs font-semibold text-blue-800/80 uppercase tracking-wide">
                                The pioneer on the market offering matching luxury options with your demand
                            </p>

                            <nav className="space-y-4 pt-2">
                                {[
                                    'On-time delivery guarantee.',
                                    'Amazing credit and flexible payment options.',
                                    'At building site safety with professionals.',
                                    'Clean and transparent documentation.'
                                ].map((item, index) => (
                                    <div key={index} className="flex gap-2.5 items-center text-[13px] font-medium text-neutral-600">
                                        <CheckCircle size={16} className="text-neutral-700 shrink-0" />
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </nav>
                        </div>
                    </div>

                </div>
            </div>

            {/* 6. Dark Section (What our customers say) */}
            <div className="bg-[#1c1c1e] w-full py-24">
                <div className="max-w-6xl mx-auto px-6 lg:px-8 space-y-12">
                    <h2 className="text-3xl text-center font-light text-white tracking-wide">
                        What our customers say
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {testimonialsData.map((t, i) => (
                            <div key={i} className="bg-[#262628] rounded-2xl p-8 flex flex-col justify-between min-h-[240px] shadow-lg">
                                <div className="space-y-5">
                                    <div className="flex gap-1.5">
                                        {[...Array(t.stars)].map((_, s) => (
                                            <Star key={s} size={14} className="fill-luxury-gold text-luxury-gold" />
                                        ))}
                                    </div>
                                    <p className="text-xs font-light text-neutral-300 leading-[1.9] italic">
                                        "{t.quote}"
                                    </p>
                                </div>

                                <div className="flex items-center gap-4 mt-8 pt-6 border-t border-[#3a3a3c]">
                                    <div className="w-10 h-10 rounded-full bg-[#111111] flex items-center justify-center text-luxury-gold font-bold text-sm shadow-inner">
                                        {t.avatar}
                                    </div>
                                    <div>
                                        <p className="text-white text-xs font-bold font-sans tracking-wide">{t.name}</p>
                                        <p className="text-neutral-400 text-[10px] mt-0.5">{t.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );
}
