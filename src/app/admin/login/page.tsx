'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Loader2, Lock, Mail, Eye, EyeOff } from 'lucide-react';

export default function AdminLoginPage() {
    const router = useRouter();
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPass, setShowPass] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        const res = await signIn('credentials', {
            email: form.email,
            password: form.password,
            redirect: false,
        });
        setLoading(false);
        if (res?.error) {
            setError('Invalid email or password. Please try again.');
        } else {
            router.push('/admin');
            router.refresh();
        }
    };

    return (
        <div className="min-h-screen bg-primary-dark flex items-center justify-center px-4">
            <div className="w-full max-w-sm space-y-8">

                {/* Logo */}
                <div className="text-center space-y-2">
                    <h1 className="text-2xl font-bold tracking-wider text-white">
                        PRIME <span className="text-luxury-gold">PROPERTIES</span> <span className="text-xs px-1.5 py-0.5 rounded bg-luxury-gold text-primary-navy font-semibold">BD</span>
                    </h1>
                    <p className="text-gray-400 text-xs font-light uppercase tracking-widest">Administration Panel</p>
                </div>

                <div className="bg-primary-navy border border-luxury-gold/20 rounded-2xl p-8 shadow-2xl space-y-6">
                    <div className="text-center">
                        <div className="w-12 h-12 rounded-full bg-luxury-gold/10 flex items-center justify-center mx-auto mb-3">
                            <Lock size={20} className="text-luxury-gold" />
                        </div>
                        <h2 className="text-white font-bold text-sm uppercase tracking-wider">Secure Login</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-[10px] uppercase tracking-wider font-semibold text-gray-400">Email Address</label>
                            <div className="relative">
                                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input
                                    type="email"
                                    required
                                    value={form.email}
                                    onChange={e => setForm({ ...form, email: e.target.value })}
                                    placeholder="arif@primepropertiesbd.com"
                                    className="w-full bg-primary-dark/60 border border-gray-800 focus:border-luxury-gold/50 rounded-xl pl-9 pr-4 py-3 text-xs text-white placeholder-gray-600 outline-none transition"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] uppercase tracking-wider font-semibold text-gray-400">Password</label>
                            <div className="relative">
                                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input
                                    type={showPass ? 'text' : 'password'}
                                    required
                                    value={form.password}
                                    onChange={e => setForm({ ...form, password: e.target.value })}
                                    placeholder="••••••••"
                                    className="w-full bg-primary-dark/60 border border-gray-800 focus:border-luxury-gold/50 rounded-xl pl-9 pr-10 py-3 text-xs text-white placeholder-gray-600 outline-none transition"
                                />
                                <button type="button" onClick={() => setShowPass(!showPass)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white cursor-pointer">
                                    {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-xs">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-luxury-gold hover:bg-gold-hover disabled:opacity-60 text-white py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer shadow-lg mt-2"
                        >
                            {loading ? <><Loader2 size={14} className="animate-spin" /> Authenticating...</> : <><Lock size={14} /> Sign In</>}
                        </button>
                    </form>
                </div>

                <p className="text-center text-xs text-gray-600 font-light">
                    <a href="/" className="text-gray-500 hover:text-luxury-gold transition">← Back to Public Site</a>
                </p>
            </div>
        </div>
    );
}
