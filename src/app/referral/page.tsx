'use client';

import React, { useState, useRef } from 'react';
import { Award, Gift, PhoneCall, Check, Lock, User, Mail, ShieldAlert } from 'lucide-react';

export default function ReferralPage() {
    const [activeTab, setActiveTab] = useState<'register' | 'login'>('register');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        referralConsent: false,
        agreeTerms: false
    });
    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });
    const [successMessage, setSuccessMessage] = useState('');
    const formRef = useRef<HTMLDivElement | null>(null);

    const scrollToForm = () => {
        formRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleRegisterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSuccessMessage('Thank you! Your PPD Referral Program registration is successful.');
        setFormData({
            name: '',
            email: '',
            phone: '',
            password: '',
            referralConsent: false,
            agreeTerms: false
        });
        setTimeout(() => setSuccessMessage(''), 6000);
    };

    const handleLoginSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSuccessMessage('Login successful! Redirecting to your dashboard...');
        setLoginData({
            email: '',
            password: ''
        });
        setTimeout(() => setSuccessMessage(''), 5000);
    };

    return (
        <div className="pt-20 min-h-screen bg-[#1c1c1e] text-white">

            {/* 1. Hero Block */}
            <section className="relative w-full min-h-[480px] bg-neutral-950 overflow-hidden flex items-center justify-center p-6 border-b border-neutral-800">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-30"
                    style={{ backgroundImage: `url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1920')` }}
                />

                <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* Left - Men talking on sofa */}
                    <div className="relative flex justify-center w-full">
                        <div className="relative w-full aspect-[16/10] rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 bg-neutral-900">
                            <img
                                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=800"
                                alt="Successful business refer talk"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    {/* Right - Reward texts */}
                    <div className="space-y-6 lg:pl-6 text-center lg:text-left">
                        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-3 justify-center lg:justify-start">
                            <div className="w-12 h-12 rounded-xl bg-luxury-gold/20 flex items-center justify-center text-luxury-gold border border-luxury-gold/30">
                                🤝
                            </div>
                            <div>
                                <span className="text-[11px] font-bold text-luxury-gold tracking-[0.25em] uppercase block">
                                    PPD Referral Program
                                </span>
                                <h2 className="text-xl sm:text-2xl font-light text-white tracking-widest uppercase mt-1">
                                    Turn Your Network Into Rewards
                                </h2>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <p className="text-[11px] font-semibold text-neutral-450 tracking-wider">Earn up to</p>
                            <h2 className="text-4xl sm:text-5xl font-black text-luxury-gold tracking-wider">
                                3,00,000 Tk.
                            </h2>
                            <p className="text-xs font-light text-neutral-400 tracking-wider">
                                for every successful referral *
                            </p>
                            <p className="text-[9px] text-neutral-500 font-sans tracking-wide">T&C Applied</p>
                        </div>

                        {/* List elements */}
                        <nav className="space-y-4 pt-4 text-xs font-light text-neutral-300 text-left max-w-md mx-auto lg:mx-0">
                            <div className="flex gap-3 items-start">
                                <span className="w-5 h-5 rounded-full bg-[#3a3a3c] flex items-center justify-center text-luxury-gold shrink-0 border border-neutral-700 mt-0.5">✔</span>
                                <div>
                                    <p className="font-bold text-white">Register & Refer</p>
                                    <p className="text-[11px] text-neutral-400 mt-0.5">Register for the program and refer potential apartment buyers from your personal or professional network.</p>
                                </div>
                            </div>
                            <div className="flex gap-3 items-start">
                                <span className="w-5 h-5 rounded-full bg-[#3a3a3c] flex items-center justify-center text-luxury-gold shrink-0 border border-neutral-700 mt-0.5">✔</span>
                                <div>
                                    <p className="font-bold text-white">Exclusive Offer for Your Referral</p>
                                    <p className="text-[11px] text-neutral-400 mt-0.5">Your referred customer may receive special offers or exclusive pricing opportunities on all PPD projects.</p>
                                </div>
                            </div>
                            <div className="flex gap-3 items-start">
                                <span className="w-5 h-5 rounded-full bg-[#3a3a3c] flex items-center justify-center text-luxury-gold shrink-0 border border-neutral-700 mt-0.5">✔</span>
                                <div>
                                    <p className="font-bold text-white">Track Progress with Dedicated Support</p>
                                    <p className="text-[11px] text-neutral-400 mt-0.5">Track your referral's progress at www.ppdbd.com and call 16604 for dedicated assistance throughout the process.</p>
                                </div>
                            </div>
                        </nav>

                        <div className="pt-6">
                            <button
                                onClick={scrollToForm}
                                className="bg-[#c5a880] hover:bg-[#b0946e] text-neutral-900 border border-transparent px-10 py-3.5 rounded-full text-xs font-black tracking-wider transition-all cursor-pointer inline-block shadow-lg select-none active:scale-95"
                            >
                                Refer Now
                            </button>
                        </div>
                    </div>

                </div>
            </section>

            {/* 2. Your Trust Is Rewarded (Light Section) */}
            <div className="bg-[#e4e6e8] py-20 text-neutral-900 border-t border-[#d0d2d4]">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">

                        {/* Left image of hearts/keys */}
                        <div className="relative flex justify-center w-full">
                            <div className="relative w-full max-w-sm aspect-square bg-[#d9dbdd] rounded-[2rem] overflow-hidden shadow-xl border border-white flex flex-col justify-center items-center p-8">
                                <img
                                    src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800"
                                    alt="Ribbon keys heart"
                                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                                />
                                <div className="absolute inset-0 bg-neutral-950/20" />
                                <div className="relative z-10 text-center space-y-2">
                                    <h3 className="text-2xl font-bold tracking-widest text-neutral-800 font-sans uppercase">
                                        Refer Friends & Family
                                    </h3>
                                </div>
                            </div>
                        </div>

                        {/* Right texts */}
                        <div className="space-y-6 max-w-lg">
                            <h3 className="text-3xl font-light text-neutral-850 tracking-wide">
                                Your Trust Is Rewarded
                            </h3>
                            {/* line divider */}
                            <div className="w-16 h-0.5 bg-neutral-800" />

                            <div className="space-y-4 text-xs font-medium text-neutral-600 leading-[1.8]">
                                <p>
                                    If you know someone looking for a new home, refer them to PPD and be rewarded when their journey results in ownership. With a reward of up to BDT 3 lakh, this program recognizes your network and your contribution in helping others find the right home.
                                </p>
                                <p>
                                    Simply sign up and submit your referral details. Our dedicated hotline team will contact you and guide you through each step of the process.
                                </p>
                                <p className="font-bold text-neutral-800 pt-2 flex items-center gap-2">
                                    <span>📞</span> For further information, please call 16604.
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* 3. Register Now form card (Dark section) */}
            <div ref={formRef} className="bg-[#1c1c1e] py-20 border-t border-[#333] relative">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-5 pointer-events-none"
                    style={{ backgroundImage: `url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1200')` }}
                />

                <div className="relative z-10 max-w-md mx-auto px-6">

                    <div className="text-center mb-8 space-y-2">
                        <h2 className="text-3xl font-light text-white tracking-wide">Register Now</h2>
                        <div className="w-12 h-[1px] bg-luxury-gold mx-auto" />
                    </div>

                    {/* Card Container */}
                    <div className="bg-[#262628] rounded-[2rem] overflow-hidden shadow-2xl border border-neutral-800">
                        {/* Tabs head */}
                        <div className="flex border-b border-neutral-800 bg-[#1f1f21]">
                            <button
                                onClick={() => setActiveTab('register')}
                                className={`flex-1 py-4 text-xs font-bold uppercase tracking-wider text-center transition-all cursor-pointer ${activeTab === 'register' ? 'bg-[#262628] text-white' : 'text-neutral-400 hover:text-white'
                                    }`}
                            >
                                Register
                            </button>
                            <button
                                onClick={() => setActiveTab('login')}
                                className={`flex-1 py-4 text-xs font-bold uppercase tracking-wider text-center transition-all cursor-pointer ${activeTab === 'login' ? 'bg-[#262628] text-white' : 'text-neutral-400 hover:text-white'
                                    }`}
                            >
                                Login
                            </button>
                        </div>

                        {/* Card body */}
                        <div className="p-8">
                            {successMessage ? (
                                <div className="py-6 text-center space-y-4">
                                    <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center text-green-400 mx-auto text-xl">
                                        ✓
                                    </div>
                                    <p className="text-xs text-neutral-300 leading-relaxed font-sans font-medium">{successMessage}</p>
                                </div>
                            ) : activeTab === 'register' ? (
                                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <h3 className="text-lg font-bold text-white">Register</h3>
                                        <p className="text-[10px] text-neutral-400">Create your account. Your referral code will be generated automatically.</p>
                                    </div>

                                    {/* Name input */}
                                    <div className="space-y-1">
                                        <label className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold">Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                            className="w-full bg-[#1c1c1e] text-white border border-[#444] rounded-xl px-4 py-3 text-xs outline-none focus:border-luxury-gold/50 transition"
                                        />
                                    </div>

                                    {/* Email input */}
                                    <div className="space-y-1">
                                        <label className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold">Email Address</label>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                            className="w-full bg-[#1c1c1e] text-white border border-[#444] rounded-xl px-4 py-3 text-xs outline-none focus:border-luxury-gold/50 transition"
                                        />
                                    </div>

                                    {/* Mobile input */}
                                    <div className="space-y-1">
                                        <label className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold">Mobile Number</label>
                                        <input
                                            type="tel"
                                            required
                                            value={formData.phone}
                                            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                            className="w-full bg-[#1c1c1e] text-white border border-[#444] rounded-xl px-4 py-3 text-xs outline-none focus:border-luxury-gold/50 transition"
                                        />
                                    </div>

                                    {/* Password input */}
                                    <div className="space-y-1">
                                        <label className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold">Password</label>
                                        <input
                                            type="password"
                                            required
                                            value={formData.password}
                                            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                                            className="w-full bg-[#1c1c1e] text-white border border-[#444] rounded-xl px-4 py-3 text-xs outline-none focus:border-luxury-gold/50 transition"
                                        />
                                        <p className="text-[9px] text-neutral-500 font-sans tracking-wide">Minimum 6 characters</p>
                                    </div>

                                    {/* Referral details checkbox */}
                                    <div className="space-y-2 pt-2 border-t border-neutral-800">
                                        <p className="text-[10px] font-bold text-neutral-450 uppercase tracking-wide">Do you want to refer someone?</p>
                                        <label className="flex items-center gap-2 text-xs font-light text-neutral-350 cursor-pointer select-none">
                                            <input
                                                type="checkbox"
                                                checked={formData.referralConsent}
                                                onChange={(e) => setFormData(prev => ({ ...prev, referralConsent: e.target.checked }))}
                                                className="rounded bg-[#1c1c1e] text-neutral-900 border-[#444] focus:ring-0 cursor-pointer h-4 w-4"
                                            />
                                            <span>Yes</span>
                                        </label>
                                    </div>

                                    {/* Agree terms */}
                                    <div className="pt-2">
                                        <label className="flex items-start gap-2 text-[11px] font-light text-neutral-350 cursor-pointer select-none">
                                            <input
                                                type="checkbox"
                                                required
                                                checked={formData.agreeTerms}
                                                onChange={(e) => setFormData(prev => ({ ...prev, agreeTerms: e.target.checked }))}
                                                className="rounded bg-[#1c1c1e] text-neutral-900 border-[#444] focus:ring-0 cursor-pointer h-4 w-4 mt-0.5"
                                            />
                                            <span>
                                                I agree to the{' '}
                                                <a href="/about" className="text-blue-500 hover:underline">
                                                    terms and conditions
                                                </a>
                                            </span>
                                        </label>
                                    </div>

                                    {/* Buttons */}
                                    <div className="pt-4">
                                        <button
                                            type="submit"
                                            className="w-full sm:w-auto bg-[#1b1b1b] hover:bg-[#2b2b2b] border border-neutral-700 hover:border-neutral-500 text-white px-8 py-3 rounded-[0.5rem] text-xs font-bold uppercase tracking-wider transition-all cursor-pointer inline-block active:scale-95"
                                        >
                                            Register
                                        </button>
                                    </div>

                                </form>
                            ) : (
                                <form onSubmit={handleLoginSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <h3 className="text-lg font-bold text-white">Login</h3>
                                        <p className="text-[10px] text-neutral-400">Access your referral dashboard to track and submit your leads.</p>
                                    </div>

                                    {/* Email input */}
                                    <div className="space-y-1">
                                        <label className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold">Email Address</label>
                                        <input
                                            type="email"
                                            required
                                            value={loginData.email}
                                            onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                                            className="w-full bg-[#1c1c1e] text-white border border-[#444] rounded-xl px-4 py-3 text-xs outline-none focus:border-luxury-gold/50 transition"
                                        />
                                    </div>

                                    {/* Password */}
                                    <div className="space-y-1">
                                        <label className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold">Password</label>
                                        <input
                                            type="password"
                                            required
                                            value={loginData.password}
                                            onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                                            className="w-full bg-[#1c1c1e] text-white border border-[#444] rounded-xl px-4 py-3 text-xs outline-none focus:border-luxury-gold/50 transition"
                                        />
                                    </div>

                                    {/* Buttons */}
                                    <div className="pt-4">
                                        <button
                                            type="submit"
                                            className="w-full sm:w-auto bg-[#1b1b1b] hover:bg-[#2b2b2b] border border-neutral-700 hover:border-neutral-500 text-white px-8 py-3 rounded-[0.5rem] text-xs font-bold uppercase tracking-wider transition-all cursor-pointer inline-block active:scale-95"
                                        >
                                            Login
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
