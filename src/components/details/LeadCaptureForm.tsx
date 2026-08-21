'use client';

import { useState } from 'react';
import { Send, Phone, Calendar, CheckCircle2 } from 'lucide-react';

interface LeadCaptureFormProps {
    propertyId: string;
    propertyTitle: string;
}

export default function LeadCaptureForm({ propertyId, propertyTitle }: LeadCaptureFormProps) {
    const [form, setForm] = useState({ name: '', phone: '', email: '', message: '', visitDate: '' });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            // Save to Messages DB
            await fetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: form.name,
                    email: form.email || 'N/A',
                    subject: `Site Visit Request: ${propertyTitle}`,
                    message: `Property: ${propertyTitle}\nPhone: ${form.phone}\nPreferred Visit Date: ${form.visitDate || 'Flexible'}\n\nMessage:\n${form.message || 'None'}`,
                    type: 'Contact',
                }),
            });

            const res = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, propertyId, propertyTitle }),
            });
            if (!res.ok) throw new Error('Submission failed');
            setSuccess(true);
            setForm({ name: '', phone: '', email: '', message: '', visitDate: '' });
        } catch {
            setError('Something went wrong. Please call us directly at 01829-116107.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-primary-navy border border-luxury-gold/20 rounded-2xl p-6 shadow-xl">
            <div className="mb-5">
                <h3 className="text-white font-bold text-base uppercase tracking-wider flex items-center gap-2">
                    <Calendar size={16} className="text-luxury-gold" />
                    Book a Site Visit
                </h3>
                <p className="text-gray-400 text-xs font-light mt-1">
                    Inquiring about: <span className="text-luxury-gold font-medium">{propertyTitle}</span>
                </p>
            </div>

            {success ? (
                <div className="text-center py-8 space-y-3">
                    <CheckCircle2 size={40} className="text-green-500 mx-auto" />
                    <p className="text-white font-semibold text-sm">Inquiry Received!</p>
                    <p className="text-gray-400 text-xs font-light leading-relaxed">
                        Our specialist will contact you within 24 hours. For instant assistance, WhatsApp us at 01829-116107.
                    </p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-wider font-semibold text-gray-400">Full Name *</label>
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                            placeholder="Your Name"
                            className="w-full bg-primary-dark/60 border border-gray-800 focus:border-luxury-gold/50 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-600 outline-none transition"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-wider font-semibold text-gray-400">Phone Number *</label>
                        <input
                            type="tel"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            required
                            placeholder="01XXXXXXXXX"
                            className="w-full bg-primary-dark/60 border border-gray-800 focus:border-luxury-gold/50 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-600 outline-none transition"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-wider font-semibold text-gray-400">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="email@example.com"
                            className="w-full bg-primary-dark/60 border border-gray-800 focus:border-luxury-gold/50 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-600 outline-none transition"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-wider font-semibold text-gray-400">Preferred Visit Date</label>
                        <input
                            type="date"
                            name="visitDate"
                            value={form.visitDate}
                            onChange={handleChange}
                            className="w-full bg-primary-dark/60 border border-gray-800 focus:border-luxury-gold/50 rounded-xl px-4 py-3 text-xs text-white outline-none transition cursor-pointer"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-wider font-semibold text-gray-400">Message</label>
                        <textarea
                            name="message"
                            value={form.message}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Any specific requirements or questions?"
                            className="w-full bg-primary-dark/60 border border-gray-800 focus:border-luxury-gold/50 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-600 outline-none transition resize-none"
                        />
                    </div>

                    {error && <p className="text-red-400 text-xs font-light">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-luxury-gold hover:bg-gold-hover disabled:opacity-60 text-white py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                    >
                        {loading ? (
                            <>Processing...</>
                        ) : (
                            <>
                                <Send size={14} />
                                Request Visit
                            </>
                        )}
                    </button>

                    <a
                        href="https://wa.me/8801829116107"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full border border-gray-800 hover:border-green-500/50 text-gray-400 hover:text-white py-3.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                        <Phone size={14} className="text-green-500" />
                        WhatsApp Instead
                    </a>
                </form>
            )}
        </div>
    );
}
