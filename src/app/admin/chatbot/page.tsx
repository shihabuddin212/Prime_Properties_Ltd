'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Loader2, X, Save, ToggleLeft, ToggleRight } from 'lucide-react';

interface FAQ { id: string; trigger: string; response: string; isActive: boolean; }
const EMPTY = { trigger: '', response: '', isActive: true };

export default function AdminChatbotPage() {
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState<Partial<FAQ>>(EMPTY);
    const [saving, setSaving] = useState(false);

    const fetchFaqs = async () => {
        setLoading(true);
        const res = await fetch('/api/admin/chatbot');
        setFaqs(await res.json());
        setLoading(false);
    };
    useEffect(() => { fetchFaqs(); }, []);

    const handleSave = async () => {
        setSaving(true);
        const method = editing.id ? 'PUT' : 'POST';
        await fetch('/api/admin/chatbot', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editing) });
        setSaving(false);
        setShowModal(false);
        fetchFaqs();
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this FAQ?')) return;
        await fetch('/api/admin/chatbot', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
        fetchFaqs();
    };

    const toggleActive = async (faq: FAQ) => {
        await fetch('/api/admin/chatbot', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...faq, isActive: !faq.isActive }) });
        fetchFaqs();
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">Chatbot FAQ Manager</h1>
                    <p className="text-xs text-gray-400 font-light mt-0.5">Manage keyword triggers and automated responses</p>
                </div>
                <button onClick={() => { setEditing(EMPTY); setShowModal(true); }}
                    className="flex items-center gap-2 bg-luxury-gold hover:bg-gold-hover text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-md cursor-pointer">
                    <Plus size={14} /> Add FAQ
                </button>
            </div>

            <div className="bg-white dark:bg-primary-navy border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-16"><Loader2 size={24} className="animate-spin text-luxury-gold" /></div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                            <thead className="bg-gray-50 dark:bg-primary-dark/30">
                                <tr>
                                    {['Trigger Keyword', 'Response Preview', 'Active', 'Actions'].map(h => (
                                        <th key={h} className="px-5 py-3 text-left text-[10px] uppercase tracking-wider text-gray-400 font-semibold">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                                {faqs.map(faq => (
                                    <tr key={faq.id} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition">
                                        <td className="px-5 py-3 font-bold text-luxury-gold uppercase">{faq.trigger}</td>
                                        <td className="px-5 py-3 text-gray-400 max-w-xs truncate">{faq.response}</td>
                                        <td className="px-5 py-3">
                                            <button onClick={() => toggleActive(faq)} className="cursor-pointer">
                                                {faq.isActive
                                                    ? <ToggleRight size={20} className="text-green-500" />
                                                    : <ToggleLeft size={20} className="text-gray-600" />}
                                            </button>
                                        </td>
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => { setEditing(faq); setShowModal(true); }} className="text-gray-400 hover:text-luxury-gold cursor-pointer"><Pencil size={14} /></button>
                                                <button onClick={() => handleDelete(faq.id)} className="text-gray-400 hover:text-red-400 cursor-pointer"><Trash2 size={14} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {faqs.length === 0 && (
                                    <tr><td colSpan={4} className="px-5 py-8 text-center text-gray-400 font-light">No chatbot FAQs yet.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                    <div className="bg-primary-navy border border-gray-800 rounded-2xl w-full max-w-lg shadow-2xl">
                        <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
                            <h2 className="text-sm font-bold text-white uppercase tracking-wider">{editing.id ? 'Edit FAQ' : 'Add FAQ'}</h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white cursor-pointer"><X size={18} /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase tracking-wider font-semibold text-gray-400">Trigger Keyword *</label>
                                <input type="text" value={editing.trigger || ''} onChange={e => setEditing(p => ({ ...p, trigger: e.target.value }))}
                                    placeholder="e.g. price, location, booking" className="w-full bg-primary-dark/60 border border-gray-800 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white outline-none transition" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase tracking-wider font-semibold text-gray-400">Automated Response *</label>
                                <textarea rows={6} value={editing.response || ''} onChange={e => setEditing(p => ({ ...p, response: e.target.value }))}
                                    placeholder="Response text shown when trigger keyword is matched..." className="w-full bg-primary-dark/60 border border-gray-800 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white outline-none transition resize-none" />
                            </div>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={editing.isActive ?? true} onChange={e => setEditing(p => ({ ...p, isActive: e.target.checked }))} className="w-4 h-4 accent-luxury-gold" />
                                <span className="text-xs text-gray-300">Active (visible to chatbot)</span>
                            </label>
                        </div>
                        <div className="px-6 py-4 border-t border-gray-800 flex justify-end gap-3">
                            <button onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-xl border border-gray-800 text-gray-400 hover:text-white text-xs font-semibold uppercase tracking-wider transition cursor-pointer">Cancel</button>
                            <button onClick={handleSave} disabled={saving}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-luxury-gold hover:bg-gold-hover text-white text-xs font-bold uppercase tracking-wider transition disabled:opacity-60 cursor-pointer shadow-md">
                                {saving ? <><Loader2 size={13} className="animate-spin" /> Saving...</> : <><Save size={13} /> Save</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
