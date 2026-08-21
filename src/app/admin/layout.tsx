'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard, Home, Tags, Users, MessageSquare,
    History, LogOut, Menu, X, ChevronRight, Percent, Star, Camera, HardHat, Quote, Mail
} from 'lucide-react';
import { signOut } from 'next-auth/react';

const navItems = [
    { icon: <LayoutDashboard size={18} />, label: 'Dashboard', path: '/admin' },
    { icon: <Mail size={18} />, label: 'Messages', path: '/admin/messages' },
    { icon: <Home size={18} />, label: 'Properties', path: '/admin/properties' },
    { icon: <Percent size={18} />, label: 'Special Offers', path: '/admin/special-offers' },
    { icon: <Star size={18} />, label: 'Featured Properties', path: '/admin/featured-properties' },
    { icon: <Camera size={18} />, label: 'Gallery', path: '/admin/gallery' },
    { icon: <HardHat size={18} />, label: 'Construction Status', path: '/admin/construction' },
    { icon: <Quote size={18} />, label: 'Customer Say', path: '/admin/customer-say' },
    { icon: <Tags size={18} />, label: 'Leads', path: '/admin/leads' },
    { icon: <MessageSquare size={18} />, label: 'Chatbot FAQs', path: '/admin/chatbot' },
    { icon: <History size={18} />, label: 'Chat History', path: '/admin/chat-history' },
    { icon: <Users size={18} />, label: 'View Public Site', path: '/' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    if (pathname === '/admin/login') return <>{children}</>;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0d1117] flex">

            {/* Sidebar */}
            <aside className={`fixed top-0 left-0 h-full w-64 bg-primary-navy border-r border-gray-800/50 z-50 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                }`}>

                {/* Logo */}
                <div className="px-6 py-6 border-b border-gray-800/50">
                    <Link href="/admin" onClick={() => setSidebarOpen(false)}>
                        <span className="text-sm font-bold tracking-wider text-white">
                            PRIME <span className="text-luxury-gold">PROPERTIES</span>
                        </span>
                        <p className="text-[9px] uppercase tracking-[0.25em] text-gray-500 font-light mt-0.5">Admin Panel</p>
                    </Link>
                </div>

                {/* Nav Links */}
                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = item.path === '/admin'
                            ? pathname === '/admin'
                            : pathname.startsWith(item.path);
                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${isActive
                                    ? 'bg-luxury-gold/15 text-luxury-gold border border-luxury-gold/30'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {item.icon}
                                {item.label}
                                {isActive && <ChevronRight size={12} className="ml-auto" />}
                            </Link>
                        );
                    })}
                </nav>

                {/* Sign Out */}
                <div className="px-3 py-4 border-t border-gray-800/50">
                    <button
                        onClick={() => signOut({ callbackUrl: '/admin/login' })}
                        className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
                    >
                        <LogOut size={18} />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Mobile overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Main */}
            <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">

                {/* Top Bar */}
                <header className="sticky top-0 z-30 bg-white/80 dark:bg-[#0d1117]/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800/50 px-4 sm:px-6 py-4 flex items-center justify-between">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="lg:hidden text-gray-500 hover:text-white p-1 cursor-pointer"
                    >
                        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>

                    <h1 className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 hidden sm:block">
                        {navItems.find(n => n.path === '/admin' ? pathname === '/admin' : pathname.startsWith(n.path))?.label || 'Admin'}
                    </h1>

                    <button
                        onClick={() => signOut({ callbackUrl: '/admin/login' })}
                        className="flex items-center gap-2 text-xs text-gray-400 hover:text-red-400 cursor-pointer transition"
                    >
                        <LogOut size={14} />
                        <span className="hidden sm:block">Sign Out</span>
                    </button>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
