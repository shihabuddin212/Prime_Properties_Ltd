'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface Lead {
    id: string; name: string; phone: string; email: string;
    propertyTitle: string; message: string; visitDate: string;
    status: string; createdAt: string;
}

export default function AdminLeadsPage() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');

    const fetchLeads = async () => {
        setLoading(true);
        const res = await fetch('/api/leads');
        setLeads(await res.json());
        setLoading(false);
    };
    useEffect(() => { fetchLeads(); }, []);

    const updateStatus = async (id: string, status: string) => {
        await fetch('/api/admin/leads', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, status }),
        });
        fetchLeads();
    };

    const filtered = leads.filter(l =>
        !filter || l.status === filter
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">Lead Tracker</h1>
                    <p className="text-xs text-gray-400 font-light mt-0.5">{filtered.length} inquiries</p>
                </div>
                <div className="flex gap-2">
                    {['', 'New', 'Contacted', 'Closed'].map(s => (
                        <button key={s}
                            onClick={() => setFilter(s)}
                            className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider border transition cursor-pointer ${filter === s
                                    ? 'bg-luxury-gold border-luxury-gold text-white'
                                    : 'border-gray-200 dark:border-gray-800 text-gray-400 hover:border-luxury-gold/30'
                                }`}>
                            {s || 'All'}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white dark:bg-primary-navy border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-16"><Loader2 size={24} className="animate-spin text-luxury-gold" /></div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                            <thead className="bg-gray-50 dark:bg-primary-dark/30">
                                <tr>
                                    {['Name', 'Phone', 'Email', 'Property', 'Visit Date', 'Status', 'Date'].map(h => (
                                        <th key={h} className="px-5 py-3 text-left text-[10px] uppercase tracking-wider text-gray-400 font-semibold whitespace-nowrap">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                                {filtered.map(lead => (
                                    <tr key={lead.id} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition">
                                        <td className="px-5 py-3 font-medium text-gray-800 dark:text-gray-200 whitespace-nowrap">{lead.name}</td>
                                        <td className="px-5 py-3"><a href={`tel:${lead.phone}`} className="text-luxury-gold hover:underline">{lead.phone}</a></td>
                                        <td className="px-5 py-3 text-gray-400 max-w-[140px] truncate">{lead.email || '—'}</td>
                                        <td className="px-5 py-3 text-gray-400 max-w-[140px] truncate">{lead.propertyTitle || '—'}</td>
                                        <td className="px-5 py-3 text-gray-400 whitespace-nowrap">{lead.visitDate || '—'}</td>
                                        <td className="px-5 py-3">
                                            <select
                                                value={lead.status}
                                                onChange={e => updateStatus(lead.id, e.target.value)}
                                                className={`px-2.5 py-1 rounded-full text-[10px] font-bold border-none outline-none cursor-pointer ${lead.status === 'New' ? 'bg-blue-500/10 text-blue-500' :
                                                        lead.status === 'Contacted' ? 'bg-yellow-500/10 text-yellow-500' :
                                                            'bg-green-500/10 text-green-500'
                                                    }`}
                                            >
                                                <option value="New">New</option>
                                                <option value="Contacted">Contacted</option>
                                                <option value="Closed">Closed</option>
                                            </select>
                                        </td>
                                        <td className="px-5 py-3 text-gray-400 whitespace-nowrap">{new Date(lead.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                                {filtered.length === 0 && (
                                    <tr><td colSpan={7} className="px-5 py-8 text-center text-gray-400 font-light">No leads found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
