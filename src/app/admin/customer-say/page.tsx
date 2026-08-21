'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Plus, Pencil, Trash2, Upload, X, Loader2, Quote } from 'lucide-react';

interface Testimonial {
    id: string;
    image: string;
    name: string;
    role: string;
    quote: string;
    createdAt: string;
}

const EMPTY: Omit<Testimonial, 'id' | 'createdAt'> = {
    image: '',
    name: '',
    role: '',
    quote: '',
};

export default function CustomerSayAdminPage() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState<Partial<Testimonial>>(EMPTY);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchTestimonials = async () => {
        setLoading(true);
        const res = await fetch('/api/admin/testimonials');
        const data = await res.json();
        setTestimonials(data);
        setLoading(false);
    };

    useEffect(() => { fetchTestimonials(); }, []);

    const openCreate = () => {
        setEditing(EMPTY);
        setShowModal(true);
    };

    const openEdit = (t: Testimonial) => {
        setEditing(t);
        setShowModal(true);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setEditing(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            setEditing(prev => ({ ...prev, image: ev.target?.result as string }));
        };
        reader.readAsDataURL(file);
    };

    const handleSave = async () => {
        if (!editing.name || !editing.role || !editing.quote) return;
        setSaving(true);
        const method = (editing as Testimonial).id ? 'PUT' : 'POST';
        await fetch('/api/admin/testimonials', {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(editing),
        });
        setSaving(false);
        setShowModal(false);
        fetchTestimonials();
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this testimonial?')) return;
        setDeletingId(id);
        await fetch('/api/admin/testimonials', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
        });
        setDeletingId(null);
        fetchTestimonials();
    };

    return (
        <div className="min-h-screen bg-primary-dark text-white px-6 py-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-extrabold tracking-tight text-white">Customer Say</h1>
                    <p className="text-xs text-gray-400 mt-1">Manage homepage testimonials — what your customers say about you.</p>
                </div>
                <button
                    onClick={openCreate}
                    className="flex items-center gap-2 bg-luxury-gold hover:bg-yellow-500 text-white font-bold text-xs uppercase px-4 py-2.5 rounded-xl shadow transition cursor-pointer"
                >
                    <Plus size={14} /> Add Testimonial
                </button>
            </div>

            {/* Grid of testimonial cards */}
            {loading ? (
                <div className="flex items-center justify-center py-24 text-gray-500">
                    <Loader2 size={28} className="animate-spin mr-3" /> Loading…
                </div>
            ) : testimonials.length === 0 ? (
                <div className="text-center py-24 text-gray-500">
                    <Quote size={36} className="mx-auto mb-3 opacity-30" />
                    <p className="text-sm">No testimonials yet. Click "Add Testimonial" to get started.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {testimonials.map((t) => (
                        <div key={t.id} className="bg-primary-navy border border-neutral-800 rounded-2xl overflow-hidden shadow flex flex-col">
                            {/* Image */}
                            <div className="aspect-[4/3] bg-neutral-900 relative">
                                {t.image ? (
                                    <img src={t.image} alt={t.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">No Image</div>
                                )}
                                <div className="absolute bottom-2 right-2 bg-neutral-900/60 backdrop-blur px-2 py-0.5 rounded text-[8px] font-bold text-white uppercase tracking-wider">PPD Brand</div>
                            </div>

                            {/* Body */}
                            <div className="p-4 flex flex-col gap-2 flex-1">
                                <span className="text-2xl text-luxury-gold font-serif leading-none select-none">"</span>
                                <p className="text-xs text-gray-400 italic leading-relaxed line-clamp-3">{t.quote}</p>
                                <div className="mt-auto pt-3 border-t border-neutral-800">
                                    <p className="text-xs font-bold text-white">{t.name}</p>
                                    <p className="text-[10px] text-gray-500 mt-0.5">{t.role}</p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex border-t border-neutral-800">
                                <button
                                    onClick={() => openEdit(t)}
                                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[10px] text-blue-400 hover:bg-blue-900/20 font-semibold uppercase transition cursor-pointer"
                                >
                                    <Pencil size={12} /> Edit
                                </button>
                                <div className="w-px bg-neutral-800" />
                                <button
                                    onClick={() => handleDelete(t.id)}
                                    disabled={deletingId === t.id}
                                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[10px] text-red-400 hover:bg-red-900/20 font-semibold uppercase transition cursor-pointer"
                                >
                                    {deletingId === t.id ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />} Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-[#0f1623] border border-neutral-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-y-auto max-h-[90vh]">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
                            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                                {(editing as Testimonial).id ? 'Edit Testimonial' : 'Add Testimonial'}
                            </h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white transition cursor-pointer">
                                <X size={18} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="px-6 py-5 space-y-5">

                            {/* Image Upload */}
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-wider font-semibold text-gray-400 block">Customer Photo</label>
                                <div className="flex gap-4 items-center">
                                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-neutral-900 border border-neutral-700 flex-shrink-0">
                                        {editing.image ? (
                                            <img src={editing.image} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-600">
                                                <Upload size={20} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="flex items-center gap-2 text-[10px] bg-luxury-gold text-white font-bold uppercase rounded-lg px-3 py-1.5 cursor-pointer hover:bg-yellow-500 transition select-none">
                                            <Upload size={11} /> Upload Photo
                                            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Or paste image URL"
                                            value={editing.image?.startsWith('data:') ? '' : (editing.image || '')}
                                            onChange={(e) => setEditing(prev => ({ ...prev, image: e.target.value }))}
                                            className="bg-primary-dark/60 border border-gray-800 rounded-lg px-3 py-1.5 text-[10px] text-white outline-none placeholder-gray-600 w-full font-mono"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Name */}
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase tracking-wider font-semibold text-gray-400 block">Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={editing.name || ''}
                                    onChange={handleChange}
                                    placeholder="e.g. The Chowdhury Family"
                                    className="w-full bg-primary-dark/60 border border-gray-800 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white outline-none transition placeholder-gray-600"
                                />
                            </div>

                            {/* Position / Role */}
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase tracking-wider font-semibold text-gray-400 block">Position / Role *</label>
                                <input
                                    type="text"
                                    name="role"
                                    value={editing.role || ''}
                                    onChange={handleChange}
                                    placeholder="e.g. Residents, Aqualuna Dhanmondi"
                                    className="w-full bg-primary-dark/60 border border-gray-800 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white outline-none transition placeholder-gray-600"
                                />
                            </div>

                            {/* Quote */}
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase tracking-wider font-semibold text-gray-400 block">Testimonial Text *</label>
                                <textarea
                                    name="quote"
                                    value={editing.quote || ''}
                                    onChange={handleChange}
                                    rows={4}
                                    placeholder="What did the customer say about Prime Properties BD?"
                                    className="w-full bg-primary-dark/60 border border-gray-800 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white outline-none transition resize-none placeholder-gray-600"
                                />
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex gap-3 px-6 py-4 border-t border-neutral-800">
                            <button
                                onClick={() => setShowModal(false)}
                                className="flex-1 py-2.5 rounded-xl border border-neutral-700 text-xs text-gray-400 hover:text-white hover:border-neutral-500 transition cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex-1 py-2.5 rounded-xl bg-luxury-gold hover:bg-yellow-500 text-white font-bold text-xs uppercase transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                            >
                                {saving ? <><Loader2 size={14} className="animate-spin" /> Saving…</> : 'Save Testimonial'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
