'use client';

import { useState } from 'react';
import { Phone, Mail, MapPin, Send, CheckCircle2, User, MessageCircle } from 'lucide-react';

export default function ContactPage() {
    const [form, setForm] = useState({ name: '', email: '', message: '' });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Submit to Messages DB
            await fetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: form.name,
                    email: form.email,
                    message: form.message,
                    subject: 'Contact Form Inquiry',
                    type: 'Contact',
                }),
            });

            // Also keep lead tracker synced
            await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: form.name, email: form.email, message: form.message, phone: 'Not provided' }),
            });
        } catch {
            // silent
        } finally {
            setLoading(false);
            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
                setForm({ name: '', email: '', message: '' });
            }, 5000);
        }
    };

    return (
        <div className="pt-20 min-h-screen bg-[#1c1c1e] text-white">

            {/* 1. Page Title */}
            <div className="pt-12 pb-8 text-center">
                <h1 className="text-4xl sm:text-5xl font-light text-white tracking-wide">
                    Get in touch
                </h1>
            </div>

            {/* 2. Three Info Cards */}
            <div className="max-w-6xl mx-auto px-6 lg:px-8 pb-12">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">

                    {/* Our Address */}
                    <div className="bg-[#1c1c1e] border border-[#333] rounded-2xl p-6 flex items-start gap-4 hover:border-neutral-600 transition-colors">
                        <div className="w-11 h-11 rounded-full bg-[#2a2a2c] border border-[#444] flex items-center justify-center shrink-0">
                            <MapPin size={18} className="text-white" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-bold text-white tracking-wide">Our address</p>
                            <p className="text-xs font-light text-neutral-400 leading-relaxed">
                                89, Lalbagh, Water Works Rd, Dhaka 1211
                            </p>
                        </div>
                    </div>

                    {/* Phone Number */}
                    <div className="bg-[#1c1c1e] border border-[#333] rounded-2xl p-6 flex items-start gap-4 hover:border-neutral-600 transition-colors">
                        <div className="w-11 h-11 rounded-full bg-[#2a2a2c] border border-[#444] flex items-center justify-center shrink-0">
                            <Phone size={18} className="text-white" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-bold text-white tracking-wide">Phone number</p>
                            <a href="tel:09639116107" className="block text-xs font-light text-neutral-400 hover:text-white transition-colors">09639116107</a>
                            <a href="tel:01829116107" className="block text-xs font-light text-neutral-400 hover:text-white transition-colors">01829-116107</a>
                        </div>
                    </div>

                    {/* Email Address */}
                    <div className="bg-[#1c1c1e] border border-[#333] rounded-2xl p-6 flex items-start gap-4 hover:border-neutral-600 transition-colors">
                        <div className="w-11 h-11 rounded-full bg-[#2a2a2c] border border-[#444] flex items-center justify-center shrink-0">
                            <Mail size={18} className="text-white" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-bold text-white tracking-wide">Email address</p>
                            <a href="mailto:arif@primepropertiesbd.com" className="text-xs font-light text-neutral-400 hover:text-white transition-colors break-all">
                                arif@primepropertiesbd.com
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Contact Form + Map Side by Side */}
            <div className="relative min-h-[520px] overflow-hidden border-t border-[#333]">
                {/* Full bleed background image */}
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-40 pointer-events-none"
                    style={{ backgroundImage: `url('https://images.unsplash.com/photo-1545464693-f17e30d7ea2d?auto=format&fit=crop&q=80&w=1920')` }}
                />
                <div className="absolute inset-0 bg-black/60 pointer-events-none" />

                <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8 py-14 grid grid-cols-1 md:grid-cols-2 gap-8 min-h-[520px] items-stretch">

                    {/* Left – Contact Form Card */}
                    <div className="bg-white text-neutral-900 rounded-[2rem] p-8 shadow-2xl flex flex-col justify-between">
                        {success ? (
                            <div className="flex flex-col items-center justify-center flex-1 py-8 space-y-4 text-center">
                                <CheckCircle2 size={44} className="text-green-500" />
                                <h3 className="font-bold text-base text-neutral-900">Message Sent!</h3>
                                <p className="text-xs text-neutral-500 font-light leading-relaxed max-w-xs">
                                    Thank you for reaching out. Our team will respond within 2 working hours.
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-5 flex flex-col h-full">
                                <div>
                                    <h2 className="text-2xl font-bold text-neutral-900 mb-1">Contact us</h2>
                                </div>

                                {/* Name */}
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={form.name}
                                        onChange={handleChange}
                                        placeholder="Your Name*"
                                        className="w-full border border-neutral-300 rounded-xl px-4 py-3.5 text-xs text-neutral-800 placeholder-neutral-400 outline-none focus:border-neutral-500 transition pr-10"
                                    />
                                    <User size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                                </div>

                                {/* Email */}
                                <div className="relative">
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        value={form.email}
                                        onChange={handleChange}
                                        placeholder="Your Email*"
                                        className="w-full border border-neutral-300 rounded-xl px-4 py-3.5 text-xs text-neutral-800 placeholder-neutral-400 outline-none focus:border-neutral-500 transition pr-10"
                                    />
                                    <Mail size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                                </div>

                                {/* Message */}
                                <div className="relative flex-1">
                                    <textarea
                                        name="message"
                                        required
                                        rows={5}
                                        value={form.message}
                                        onChange={handleChange}
                                        placeholder="Type Your Message"
                                        className="w-full border border-neutral-300 rounded-xl px-4 py-3.5 text-xs text-neutral-800 placeholder-neutral-400 outline-none focus:border-neutral-500 transition resize-none h-full min-h-[110px]"
                                    />
                                    <MessageCircle size={14} className="absolute right-4 top-4 text-neutral-400" />
                                </div>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full sm:w-auto bg-[#1b1b1b] hover:bg-[#2b2b2b] disabled:opacity-50 text-white py-3.5 px-8 rounded-full text-xs font-bold tracking-wider transition-all flex items-center gap-2 cursor-pointer active:scale-95 select-none shadow-md"
                                >
                                    <span>{loading ? 'Sending...' : 'Submit Message'}</span>
                                    <Send size={13} />
                                </button>
                            </form>
                        )}
                    </div>

                    {/* Right – Google Maps iFrame */}
                    <div className="rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 min-h-[420px]">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d767.9201019504836!2d90.38932220765808!3d23.716543225194652!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b90023da07f3%3A0xf242a9588f9831b8!2sMs%20Prime%20Properties%20Limited!5e0!3m2!1sen!2sbd!4v1784191416065!5m2!1sen!2sbd"
                            width="100%"
                            height="100%"
                            style={{ border: 0, minHeight: '420px' }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="strict-origin-when-cross-origin"
                            title="PPD Office Location"
                        />
                    </div>

                </div>
            </div>

        </div>
    );
}
