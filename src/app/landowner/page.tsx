'use client';

import React, { useState } from 'react';
import { Star, CheckCircle, ChevronDown, ChevronUp, Play } from 'lucide-react';

interface FAQItem {
    question: string;
    answer: string;
}

const faqData: FAQItem[] = [
    {
        question: 'What is Joint Venture (JV)?',
        answer: 'A Joint Venture (JV) is a commercial arrangement where a landowner partners with a developer (like PPD) to develop their land. The landowner provides the land, while the developer takes care of the design, approvals, construction, and marketing. The final built area or sales revenue is shared between both parties based on a mutually agreed ratio.'
    },
    {
        question: 'What is FAR?',
        answer: 'FAR stands for Floor Area Ratio. It is the ratio of the total gross floor area of a building to the total area of the plot/land. FAR is regulated by RAJUK or local municipalities to control density and urban planning parameters.'
    },
    {
        question: 'What is dAP?',
        answer: 'dAP stands for Detailed Area Plan. It is a long-term urban planning plan implemented by RAJUK to guide density, height limit, zoning, and land use patterns in Dhaka.'
    },
    {
        question: 'How is the sharing ratio determined?',
        answer: 'The sharing ratio is determined based on the land location, land size, road width, FAR availability, expected construction costs, and property market values of that specific area.'
    },
    {
        question: 'Who handles building design and approvals?',
        answer: 'PPD handles the entire property design, architectural plans, soil testing, structural engineering, and secures all necessary approvals from RAJUK, Civil Aviation, Fire Service, and Department of Environment.'
    },
    {
        question: 'How long does the construction process take?',
        answer: 'Depending on the building scale (high-rise vs mid-rise), design phase and approval, standard constructions take between 24 to 48 months from the date of handover of the land.'
    },
    {
        question: 'Is there any signing money provided?',
        answer: 'Yes, a non-refundable signing money is usually provided to the landowner by the developer as part of the joint venture agreement.'
    },
    {
        question: 'How do I ensure construction quality?',
        answer: 'Our joint venture agreement specifies exact brand names, standards, and dimensions for all construction materials. Landowners can inspect the site themselves or hire external consultants to verify structural parameters at any stage.'
    },
    {
        question: 'What happens if there is a delay in handover?',
        answer: 'Our JV contract includes a strict delay compensation clause. If there is any delay in handing over the properties beyond the grace period, PPD pays a monthly compensation fee to the landowners.'
    }
];

const testimonials = [
    {
        id: 1,
        quote: "It has been excellent standard of construction. They have turned our land into a beautiful landmark.",
        author: "Taslim Akhter",
        role: "Landowner, Aqualuna"
    },
    {
        id: 2,
        quote: "Financial security is what we look for, and PPD is highly trustworthy. The journey was smooth and transparent.",
        author: "Qazi Mahmud",
        role: "Landowner, Dhanmondi Heights"
    },
    {
        id: 3,
        quote: "Perfect timing and execution. PPD's design aesthetics are top notch.",
        author: "Md. Shafiul Alam & Family",
        role: "Landowner, Beverly Residence"
    }
];

export default function LandownerPage() {
    const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const toggleFaq = (idx: number) => {
        setOpenFaqIdx(openFaqIdx === idx ? null : idx);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            // Save message to Admin Messages DB
            const res = await fetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    subject: 'Landowner Joint Venture Inquiry',
                    message: `Contact Number: ${formData.phone}\n\nMessage:\n${formData.message}`,
                    type: 'Contact',
                }),
            });

            // Also keep lead tracker synced
            await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    type: 'JV_LAND',
                    message: formData.message,
                }),
            });

            if (res.ok) {
                setSubmitSuccess(true);
                setFormData({ name: '', email: '', phone: '', message: '' });
                setTimeout(() => setSubmitSuccess(false), 5000);
            }
        } catch (err) {
            console.error('Submit failed', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="pt-20 min-h-screen bg-[#1c1c1e] text-white">

            {/* 1. Hero Block */}
            <section className="relative w-full aspect-[21/7] min-h-[350px] bg-neutral-950 overflow-hidden flex items-center justify-center p-6 bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1920')` }}>
                <div className="absolute inset-0 bg-black/60" />
                <div className="relative z-10 text-center max-w-4xl mx-auto space-y-4">
                    <h1 className="text-3xl sm:text-5xl font-light text-white tracking-widest leading-normal px-4">
                        Develop your land with confidence
                    </h1>
                    <p className="text-sm font-light text-neutral-300 max-w-xl mx-auto font-sans tracking-wide leading-relaxed">
                        Partner with the most trusted name in real estate for a hassle-free, secure, and highly profitable joint venture.
                    </p>
                </div>
            </section>

            <div className="w-full bg-[#1c1c1e] py-20">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-28">

                    {/* 2. Why choose PPD */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">

                        {/* Left Card - Our Landowner speak */}
                        <div className="bg-white text-neutral-900 rounded-[2rem] p-8 space-y-6 shadow-2xl border border-neutral-100 flex flex-col justify-between min-h-[380px]">
                            <div className="space-y-4">
                                <div className="flex gap-2 items-center text-luxury-gold uppercase tracking-wider text-xs font-bold font-sans">
                                    <span>“ OUR LANDOWNERS SPEAK FOR US ”</span>
                                </div>
                                <div className="grid grid-cols-[auto_1fr] gap-6 items-center pt-2">
                                    <div className="w-32 h-36 rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200">
                                        <img
                                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=300"
                                            alt="Dr. M. A. Hashem"
                                            className="w-full h-full object-cover grayscale"
                                        />
                                    </div>
                                    <p className="text-xs font-light leading-[1.8] text-neutral-600 italic">
                                        "Witnessing the execution of Aquatone Enclave, I can confidently tell PPD is a name that delivers what they promise. Their commitment towards quality and timeline is truly unmatched."
                                    </p>
                                </div>
                            </div>
                            <div className="flex justify-between items-center border-t border-neutral-100 pt-5">
                                <div>
                                    <h4 className="font-bold text-xs text-neutral-800">Dr. M. A. Hashem</h4>
                                    <p className="text-[10px] text-neutral-400">Landowner, Aquatone Enclave</p>
                                </div>
                                {/* Simple text logo branding */}
                                <div className="text-left font-serif font-black text-sm uppercase tracking-widest text-neutral-800">
                                    PPD
                                </div>
                            </div>
                        </div>

                        {/* Right Text details */}
                        <div className="space-y-6">
                            <h2 className="text-3xl lg:text-4xl font-light tracking-wide text-white leading-tight">
                                Why choose PPD as a partner to develop your land?
                            </h2>
                            <div className="space-y-4 text-[13px] font-light text-neutral-300 leading-[1.8]">
                                <p>
                                    Creating a joint venture agreement is a landmark lifetime event for most landowners. Real estate development is not just about concrete; it is also about building security, legacy, and long-term values.
                                </p>
                                <p>
                                    Prime Properties BD (PPD) stands tall with its code of transparency, legal accuracy, and financial strength. We believe in providing the maximum financial potential along with premium aesthetics and top-notch materials.
                                </p>
                            </div>
                        </div>

                    </div>

                    {/* 3. How makes us different? */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
                        {/* Left description details */}
                        <div className="space-y-6">
                            <h2 className="text-3xl lg:text-4xl font-light tracking-wide text-white">
                                How is PPD different?
                            </h2>
                            <div className="space-y-4 text-[13px] font-light text-neutral-350 leading-[1.8]">
                                <p>
                                    PPD is run by a dedicated team of engineers, architects, and legal advisors who ensure that your property gets the best design parameters and zoning advantages. We operate with a strict policy of zero timeline delays.
                                </p>
                                <p>
                                    Financial stability is one of our key strengths. We ensure that all JV developments have dedicated escrow funds to secure construction milestones, protecting our landowners from any market shifts.
                                </p>
                                <p>
                                    We maintain direct transparency in material selection. Our landowners have the freedom to inspect and verify the construction specifications anytime.
                                </p>
                            </div>
                        </div>

                        {/* Right Video card layout */}
                        <div className="relative aspect-[16/10] rounded-[2rem] overflow-hidden shadow-2xl bg-neutral-900 border border-white/5 group">
                            <img
                                src="https://images.unsplash.com/photo-1545464693-f17e30d7ea2d?auto=format&fit=crop&q=80&w=800"
                                alt="Modern building project"
                                className="w-full h-full object-cover opacity-80"
                            />
                            {/* Overlay Play action */}
                            <div className="absolute inset-0 bg-black/15 flex flex-col justify-between p-6">
                                <div className="flex justify-end">
                                    <span className="bg-black/60 backdrop-blur-sm border border-neutral-700/30 text-white rounded-lg px-3 py-1 text-[9px] uppercase tracking-wide">
                                        Landowner Review
                                    </span>
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <button className="w-14 h-14 rounded-full bg-white/95 text-neutral-900 shadow-xl flex items-center justify-center cursor-pointer transition-transform hover:scale-105 active:scale-95 border border-neutral-200">
                                        <Play size={20} className="fill-neutral-900 translate-x-0.5" />
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* 4. Want to know more */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
                        {/* Left image of happy family */}
                        <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden shadow-lg border border-white/5">
                            <img
                                src="https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=800"
                                alt="Happy landowners family standing"
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Right Details */}
                        <div className="space-y-6">
                            <h2 className="text-3xl lg:text-4xl font-light tracking-wide text-white">
                                Want to know more?
                            </h2>
                            <p className="text-[13px] font-light text-neutral-350 leading-[1.8]">
                                Understand the step-by-step process of a joint venture. Our team is ready to guide you through the initial evaluation, design presentation, legal verification, and partnership structure. Fill out the contact form below, and our specialized JV relationship manager will get in touch with you.
                            </p>
                        </div>
                    </div>

                </div>
            </div>

            {/* 5. What landowners say */}
            <div className="bg-[#1c1c1e] py-20 border-t border-[#333]">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-12">
                    <h2 className="text-3xl text-center font-light text-white tracking-wide">
                        What landowners say about PPD
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {testimonials.map((t) => (
                            <div key={t.id} className="bg-[#262628] rounded-2xl p-8 flex flex-col justify-between min-h-[220px] shadow-lg">
                                <div className="space-y-5">
                                    <div className="flex gap-1">
                                        {[...Array(5)].map((_, s) => (
                                            <Star key={s} size={14} className="fill-luxury-gold text-luxury-gold" />
                                        ))}
                                    </div>
                                    <p className="text-xs font-light text-neutral-300 leading-[1.9] italic">
                                        "{t.quote}"
                                    </p>
                                </div>
                                <div className="flex items-center gap-4 mt-8 pt-6 border-t border-[#3a3a3c]">
                                    <div className="w-10 h-10 rounded-full bg-[#111111] flex items-center justify-center text-luxury-gold font-bold text-sm shadow-inner">
                                        {t.author.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-white text-xs font-bold font-sans tracking-wide">{t.author}</p>
                                        <p className="text-neutral-400 text-[10px] mt-0.5">{t.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 6. FAQ Accordion Grid (Light Section) */}
            <div className="bg-[#e4e6e8] py-24 text-neutral-900 border-t border-[#d0d2d4]">
                <div className="max-w-4xl mx-auto px-6">
                    <h2 className="text-3xl text-center font-light text-neutral-850 tracking-wide mb-12">
                        Frequently asked questions
                    </h2>

                    <div className="space-y-4">
                        {faqData.map((faq, idx) => {
                            const isOpen = openFaqIdx === idx;
                            return (
                                <div
                                    key={idx}
                                    className="border border-neutral-300 rounded-xl overflow-hidden bg-white/70 shadow-sm transition-all"
                                >
                                    <button
                                        onClick={() => toggleFaq(idx)}
                                        className="w-full text-left px-6 py-5 flex justify-between items-center bg-white hover:bg-neutral-50 cursor-pointer select-none transition-colors"
                                    >
                                        <span className="text-sm font-semibold text-neutral-800 tracking-wide">
                                            Q. {faq.question}
                                        </span>
                                        {isOpen ? (
                                            <ChevronUp size={16} className="text-neutral-500 shrink-0" />
                                        ) : (
                                            <ChevronDown size={16} className="text-neutral-500 shrink-0" />
                                        )}
                                    </button>

                                    {isOpen && (
                                        <div className="px-6 py-5 bg-neutral-50/50 border-t border-neutral-200">
                                            <p className="text-xs font-medium text-neutral-600 leading-[1.8]">
                                                {faq.answer}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* 7. Get in Touch Form (Dark Section) */}
            <div className="bg-[#1c1c1e] py-20 border-t border-[#333]">
                <div className="max-w-6xl mx-auto px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-start">
                        {/* Info details */}
                        <div className="space-y-6">
                            <h2 className="text-3xl font-light text-white tracking-wide">
                                Get in touch
                            </h2>
                            <p className="text-xs font-light text-neutral-400 leading-relaxed max-w-sm">
                                Partner with us to create a legacy. Send us message to discuss your land size, location and requirements.
                            </p>

                            <nav className="space-y-4 pt-4 text-xs font-light text-neutral-300">
                                <div className="flex gap-3 items-center">
                                    <span className="w-8 h-8 rounded-full bg-[#262628] flex items-center justify-center text-luxury-gold shrink-0">📞</span>
                                    <span>09639116107</span>
                                </div>
                                <div className="flex gap-3 items-center">
                                    <span className="w-8 h-8 rounded-full bg-[#262628] flex items-center justify-center text-luxury-gold shrink-0">✉</span>
                                    <span>info@ppd.com.bd</span>
                                </div>
                                <div className="flex gap-3 items-center">
                                    <span className="w-8 h-8 rounded-full bg-[#262628] flex items-center justify-center text-luxury-gold shrink-0">📍</span>
                                    <span>Celebration Point, Plot 3 & 5, Road 113/A, Gulshan-2, Dhaka-1212</span>
                                </div>
                            </nav>
                        </div>

                        {/* Interactive Form */}
                        <div className="bg-[#262628] rounded-[2rem] p-8 shadow-2xl border border-neutral-800">
                            <form onSubmit={handleFormSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <input
                                            type="text"
                                            name="name"
                                            required
                                            placeholder="Name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="w-full bg-[#1c1c1e] text-white border border-[#444] rounded-xl px-4 py-3 text-xs outline-none focus:border-luxury-gold/50 transition"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <input
                                            type="email"
                                            name="email"
                                            required
                                            placeholder="Email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full bg-[#1c1c1e] text-white border border-[#444] rounded-xl px-4 py-3 text-xs outline-none focus:border-luxury-gold/50 transition"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <input
                                        type="tel"
                                        name="phone"
                                        required
                                        placeholder="Contact Number"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full bg-[#1c1c1e] text-white border border-[#444] rounded-xl px-4 py-3 text-xs outline-none focus:border-luxury-gold/50 transition"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <textarea
                                        name="message"
                                        required
                                        rows={4}
                                        placeholder="Message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        className="w-full bg-[#1c1c1e] text-white border border-[#444] rounded-xl px-4 py-3 text-xs outline-none focus:border-luxury-gold/50 transition resize-none"
                                    />
                                </div>

                                {submitSuccess && (
                                    <p className="text-xs text-green-400 font-semibold">Message submitted successfully! We will get in touch with you shortly.</p>
                                )}

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full sm:w-auto bg-[#c5a880] hover:bg-[#b0946e] text-neutral-900 border border-transparent px-8 py-3 rounded-full text-xs font-bold tracking-wider transition-all cursor-pointer inline-block mt-2 select-none active:scale-95 disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Sending...' : 'Send Message →'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
