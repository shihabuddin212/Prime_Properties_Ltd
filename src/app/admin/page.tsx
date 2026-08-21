import { prisma } from '@/lib/prisma';
import { Home, Users, MessageSquare, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default async function AdminDashboard() {
    const [properties, leads, faqs, chats] = await Promise.all([
        prisma.property.count(),
        prisma.lead.count(),
        prisma.chatbotFAQ.count(),
        prisma.chatMessage.count(),
    ]);

    const recentLeads = await prisma.lead.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
    });

    const stats = [
        { icon: <Home size={20} className="text-luxury-gold" />, label: 'Total Properties', value: properties, link: '/admin/properties', color: 'border-luxury-gold/30' },
        { icon: <Users size={20} className="text-blue-400" />, label: 'Total Leads', value: leads, link: '/admin/leads', color: 'border-blue-400/30' },
        { icon: <MessageSquare size={20} className="text-green-400" />, label: 'Chatbot FAQs', value: faqs, link: '/admin/chatbot', color: 'border-green-400/30' },
        { icon: <TrendingUp size={20} className="text-purple-400" />, label: 'Chat Messages', value: chats, link: '/admin/chat-history', color: 'border-purple-400/30' },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
                <p className="text-xs text-gray-400 font-light mt-1">Prime Properties BD — Admin Panel</p>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                {stats.map((s) => (
                    <Link key={s.label} href={s.link}
                        className={`bg-white dark:bg-primary-navy border ${s.color} rounded-2xl p-6 flex items-center gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all`}>
                        <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-primary-dark/60 flex items-center justify-center shrink-0">
                            {s.icon}
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{s.value}</p>
                            <p className="text-xs text-gray-400 uppercase tracking-wider font-light mt-0.5">{s.label}</p>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Recent Leads */}
            <div className="bg-white dark:bg-primary-navy border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                    <h2 className="text-sm font-bold text-gray-800 dark:text-white">Recent Leads</h2>
                    <Link href="/admin/leads" className="text-xs text-luxury-gold hover:underline font-semibold">View All</Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                        <thead className="bg-gray-50 dark:bg-primary-dark/30">
                            <tr>
                                {['Name', 'Phone', 'Property', 'Status', 'Date'].map(h => (
                                    <th key={h} className="px-5 py-3 text-left text-[10px] uppercase tracking-wider text-gray-400 font-semibold">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                            {recentLeads.map((lead) => (
                                <tr key={lead.id} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition">
                                    <td className="px-5 py-3 text-gray-800 dark:text-gray-200 font-medium">{lead.name}</td>
                                    <td className="px-5 py-3 text-gray-500 dark:text-gray-400">{lead.phone}</td>
                                    <td className="px-5 py-3 text-gray-500 dark:text-gray-400 truncate max-w-[160px]">{lead.propertyTitle || '—'}</td>
                                    <td className="px-5 py-3">
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${lead.status === 'New' ? 'bg-blue-500/10 text-blue-500' :
                                                lead.status === 'Contacted' ? 'bg-yellow-500/10 text-yellow-500' :
                                                    'bg-green-500/10 text-green-500'
                                            }`}>{lead.status}</span>
                                    </td>
                                    <td className="px-5 py-3 text-gray-400 whitespace-nowrap">{new Date(lead.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                            {recentLeads.length === 0 && (
                                <tr><td colSpan={5} className="px-5 py-8 text-center text-gray-400 font-light">No leads yet.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
