'use client';

import React, { useEffect, useState } from 'react';
import {
    Mail, MailOpen, Plus, Pencil, Trash2, X, Loader2, Search, Filter,
    CheckCircle2, Clock, Eye, Sparkles, Inbox, RefreshCw, Send
} from 'lucide-react';

interface MessageItem {
    id: string;
    name: string;
    email: string;
    subject?: string | null;
    message: string;
    isRead: boolean;
    type: string; // "Contact" | "Newsletter"
    createdAt: string;
}

const EMPTY_FORM: Omit<MessageItem, 'id' | 'createdAt'> = {
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: '',
    isRead: false,
    type: 'Contact',
};

export default function AdminMessagesPage() {
    const [messages, setMessages] = useState<MessageItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState<'ALL' | 'UNREAD' | 'READ' | 'CONTACT' | 'NEWSLETTER'>('ALL');

    // Modals
    const [showFormModal, setShowFormModal] = useState(false);
    const [editingMsg, setEditingMsg] = useState<Partial<MessageItem>>(EMPTY_FORM);
    const [saving, setSaving] = useState(false);

    const [viewingMsg, setViewingMsg] = useState<MessageItem | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const fetchMessages = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/messages');
            if (res.ok) {
                const data = await res.json();
                setMessages(data);
            }
        } catch (err) {
            console.error('Failed to load messages', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    // Toggle Read / Unread Status
    const toggleReadStatus = async (msg: MessageItem, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        const newReadState = !msg.isRead;

        // Optimistic UI update
        setMessages(prev =>
            prev.map(m => m.id === msg.id ? { ...m, isRead: newReadState } : m)
        );

        if (viewingMsg && viewingMsg.id === msg.id) {
            setViewingMsg(prev => prev ? { ...prev, isRead: newReadState } : null);
        }

        try {
            await fetch('/api/admin/messages', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: msg.id, isRead: newReadState }),
            });
        } catch (err) {
            console.error('Failed to toggle read status', err);
            fetchMessages(); // revert on failure
        }
    };

    // Open detail modal and auto mark read if unread
    const openDetailModal = (msg: MessageItem) => {
        setViewingMsg(msg);
        if (!msg.isRead) {
            toggleReadStatus(msg);
        }
    };

    // Open Add Modal
    const openAddModal = () => {
        setEditingMsg(EMPTY_FORM);
        setShowFormModal(true);
    };

    // Open Edit Modal
    const openEditModal = (msg: MessageItem, e: React.MouseEvent) => {
        e.stopPropagation();
        setEditingMsg(msg);
        setShowFormModal(true);
    };

    // Save (Create or Update) Message
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingMsg.name || !editingMsg.email) return;

        setSaving(true);
        const isEdit = Boolean((editingMsg as MessageItem).id);
        const method = isEdit ? 'PUT' : 'POST';

        try {
            const res = await fetch('/api/admin/messages', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingMsg),
            });

            if (res.ok) {
                setShowFormModal(false);
                fetchMessages();
            }
        } catch (err) {
            console.error('Failed to save message', err);
        } finally {
            setSaving(false);
        }
    };

    // Delete Message
    const handleDelete = async (id: string, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        if (!confirm('Are you sure you want to delete this message?')) return;

        setDeletingId(id);
        try {
            const res = await fetch('/api/admin/messages', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });

            if (res.ok) {
                if (viewingMsg?.id === id) setViewingMsg(null);
                fetchMessages();
            }
        } catch (err) {
            console.error('Failed to delete message', err);
        } finally {
            setDeletingId(null);
        }
    };

    // Filter & Search computation
    const filteredMessages = messages.filter((m) => {
        // Search Filter
        const query = searchQuery.toLowerCase();
        const matchesSearch =
            !query ||
            m.name.toLowerCase().includes(query) ||
            m.email.toLowerCase().includes(query) ||
            (m.subject && m.subject.toLowerCase().includes(query)) ||
            m.message.toLowerCase().includes(query);

        if (!matchesSearch) return false;

        // Category Filter
        if (activeFilter === 'UNREAD') return !m.isRead;
        if (activeFilter === 'READ') return m.isRead;
        if (activeFilter === 'CONTACT') return m.type === 'Contact';
        if (activeFilter === 'NEWSLETTER') return m.type === 'Newsletter';

        return true;
    });

    const unreadCount = messages.filter(m => !m.isRead).length;
    const newsletterCount = messages.filter(m => m.type === 'Newsletter').length;
    const contactCount = messages.filter(m => m.type === 'Contact').length;

    return (
        <div className="space-y-6">

            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                            Messages & Subscriptions
                        </h1>
                        {unreadCount > 0 && (
                            <span className="bg-red-500/15 text-red-500 border border-red-500/30 text-xs font-extrabold px-2.5 py-0.5 rounded-full">
                                {unreadCount} Unread
                            </span>
                        )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-light">
                        Manage contact form submissions and newsletter subscription requests in real-time.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchMessages}
                        className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer"
                        title="Refresh Messages"
                    >
                        <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
                    </button>
                    <button
                        onClick={openAddModal}
                        className="flex items-center gap-2 bg-luxury-gold hover:bg-yellow-500 text-white font-bold text-xs uppercase px-4 py-2.5 rounded-xl shadow transition cursor-pointer"
                    >
                        <Plus size={15} /> Add Message
                    </button>
                </div>
            </div>

            {/* Stat Counters Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-primary-navy border border-gray-200 dark:border-gray-800 rounded-2xl p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                        <Inbox size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-bold text-gray-400">Total Inbox</p>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">{messages.length}</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-primary-navy border border-gray-200 dark:border-gray-800 rounded-2xl p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center shrink-0">
                        <Mail size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-bold text-gray-400">Unread</p>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">{unreadCount}</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-primary-navy border border-gray-200 dark:border-gray-800 rounded-2xl p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                        <Send size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-bold text-gray-400">Contact Forms</p>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">{contactCount}</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-primary-navy border border-gray-200 dark:border-gray-800 rounded-2xl p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0">
                        <Sparkles size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-bold text-gray-400">Newsletter</p>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">{newsletterCount}</p>
                    </div>
                </div>
            </div>

            {/* Filter Tabs & Search Bar */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">

                {/* Filter Tabs */}
                <div className="flex flex-wrap items-center gap-2">
                    {[
                        { key: 'ALL', label: 'All Messages', count: messages.length },
                        { key: 'UNREAD', label: 'Unread', count: unreadCount },
                        { key: 'READ', label: 'Read', count: messages.length - unreadCount },
                        { key: 'CONTACT', label: 'Contact Us', count: contactCount },
                        { key: 'NEWSLETTER', label: 'Newsletter', count: newsletterCount },
                    ].map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveFilter(tab.key as any)}
                            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider border transition cursor-pointer ${activeFilter === tab.key
                                ? 'bg-luxury-gold border-luxury-gold text-white shadow'
                                : 'bg-white dark:bg-primary-navy border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:border-luxury-gold/40'
                                }`}
                        >
                            <span>{tab.label}</span>
                            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${activeFilter === tab.key ? 'bg-black/20 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                                }`}>
                                {tab.count}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Search Bar */}
                <div className="relative w-full md:w-72">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search name, email, topic..."
                        className="w-full bg-white dark:bg-primary-navy border border-gray-200 dark:border-gray-800 rounded-xl pl-9 pr-4 py-2 text-xs text-gray-800 dark:text-white placeholder-gray-400 outline-none focus:border-luxury-gold transition"
                    />
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                        >
                            <X size={12} />
                        </button>
                    )}
                </div>
            </div>

            {/* Messages Table / List Container */}
            <div className="bg-white dark:bg-primary-navy border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
                {loading ? (
                    <div className="flex items-center justify-center py-24 text-gray-400">
                        <Loader2 size={28} className="animate-spin text-luxury-gold mr-3" /> Loading messages...
                    </div>
                ) : filteredMessages.length === 0 ? (
                    <div className="text-center py-20 px-4 space-y-3">
                        <Inbox size={40} className="mx-auto text-gray-400 opacity-40" />
                        <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">No messages found</p>
                        <p className="text-xs text-gray-400">Try adjusting your filter or search criteria.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                            <thead className="bg-gray-50 dark:bg-primary-dark/50 border-b border-gray-200 dark:border-gray-800">
                                <tr>
                                    <th className="w-10 px-4 py-3 text-center">Status</th>
                                    <th className="px-4 py-3 text-left font-bold text-gray-400 uppercase tracking-wider text-[10px]">Type</th>
                                    <th className="px-4 py-3 text-left font-bold text-gray-400 uppercase tracking-wider text-[10px]">Sender</th>
                                    <th className="px-4 py-3 text-left font-bold text-gray-400 uppercase tracking-wider text-[10px]">Subject & Preview</th>
                                    <th className="px-4 py-3 text-left font-bold text-gray-400 uppercase tracking-wider text-[10px]">Date</th>
                                    <th className="px-4 py-3 text-right font-bold text-gray-400 uppercase tracking-wider text-[10px]">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60">
                                {filteredMessages.map((msg) => (
                                    <tr
                                        key={msg.id}
                                        onClick={() => openDetailModal(msg)}
                                        className={`transition-colors cursor-pointer group ${!msg.isRead
                                            ? 'bg-blue-50/50 dark:bg-blue-950/20 font-semibold'
                                            : 'hover:bg-gray-50/60 dark:hover:bg-white/5'
                                            }`}
                                    >
                                        {/* Status Icon */}
                                        <td className="px-4 py-3.5 text-center">
                                            <button
                                                onClick={(e) => toggleReadStatus(msg, e)}
                                                title={msg.isRead ? 'Mark as Unread' : 'Mark as Read'}
                                                className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                                            >
                                                {msg.isRead ? (
                                                    <MailOpen size={16} className="text-gray-400 group-hover:text-gray-200" />
                                                ) : (
                                                    <Mail size={16} className="text-blue-500 fill-blue-500/20 animate-pulse" />
                                                )}
                                            </button>
                                        </td>

                                        {/* Type Badge */}
                                        <td className="px-4 py-3.5 whitespace-nowrap">
                                            {msg.type === 'Newsletter' ? (
                                                <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                                                    Newsletter
                                                </span>
                                            ) : (
                                                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                                                    Contact Us
                                                </span>
                                            )}
                                        </td>

                                        {/* Sender Name & Email */}
                                        <td className="px-4 py-3.5 whitespace-nowrap">
                                            <div className="font-bold text-gray-900 dark:text-white">{msg.name}</div>
                                            <div className="text-[11px] text-gray-400 font-normal">{msg.email}</div>
                                        </td>

                                        {/* Subject & Preview */}
                                        <td className="px-4 py-3.5 max-w-xs md:max-w-md truncate">
                                            <div className="text-gray-900 dark:text-white font-medium truncate">
                                                {msg.subject || 'General Inquiry'}
                                            </div>
                                            <div className="text-[11px] text-gray-500 dark:text-gray-400 font-normal truncate">
                                                {msg.message || '—'}
                                            </div>
                                        </td>

                                        {/* Date */}
                                        <td className="px-4 py-3.5 whitespace-nowrap text-[11px] text-gray-400">
                                            {new Date(msg.createdAt).toLocaleDateString(undefined, {
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </td>

                                        {/* Actions */}
                                        <td className="px-4 py-3.5 text-right whitespace-nowrap">
                                            <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                                                <button
                                                    onClick={() => openDetailModal(msg)}
                                                    className="p-1.5 rounded-lg text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 transition"
                                                    title="View Message"
                                                >
                                                    <Eye size={14} />
                                                </button>

                                                <button
                                                    onClick={(e) => openEditModal(msg, e)}
                                                    className="p-1.5 rounded-lg text-gray-400 hover:text-amber-400 hover:bg-amber-500/10 transition"
                                                    title="Edit Message"
                                                >
                                                    <Pencil size={14} />
                                                </button>

                                                <button
                                                    onClick={(e) => handleDelete(msg.id, e)}
                                                    disabled={deletingId === msg.id}
                                                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition disabled:opacity-50"
                                                    title="Delete Message"
                                                >
                                                    {deletingId === msg.id ? (
                                                        <Loader2 size={14} className="animate-spin text-red-400" />
                                                    ) : (
                                                        <Trash2 size={14} />
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* DETAIL VIEW MODAL */}
            {viewingMsg && (
                <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-[#0f1623] border border-neutral-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-primary-navy/40">
                            <div className="flex items-center gap-2">
                                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${viewingMsg.type === 'Newsletter' ? 'bg-purple-500/20 text-purple-400' : 'bg-emerald-500/20 text-emerald-400'
                                    }`}>
                                    {viewingMsg.type}
                                </span>
                                <h3 className="text-sm font-bold text-white tracking-wide">
                                    Message Details
                                </h3>
                            </div>
                            <button
                                onClick={() => setViewingMsg(null)}
                                className="text-gray-400 hover:text-white transition cursor-pointer"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 space-y-5">
                            {/* Sender Info Card */}
                            <div className="bg-primary-dark/80 border border-neutral-800 rounded-xl p-4 space-y-2">
                                <div className="flex items-center justify-between">
                                    <p className="text-base font-bold text-white">{viewingMsg.name}</p>
                                    <p className="text-[11px] text-gray-400">
                                        {new Date(viewingMsg.createdAt).toLocaleString()}
                                    </p>
                                </div>
                                <p className="text-xs text-luxury-gold font-medium">
                                    <a href={`mailto:${viewingMsg.email}`} className="hover:underline">
                                        {viewingMsg.email}
                                    </a>
                                </p>
                            </div>

                            {/* Subject */}
                            <div>
                                <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Subject</label>
                                <p className="text-sm font-semibold text-white bg-primary-navy/60 p-3 rounded-lg border border-neutral-800">
                                    {viewingMsg.subject || 'General Inquiry'}
                                </p>
                            </div>

                            {/* Message Content */}
                            <div>
                                <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Message Body</label>
                                <div className="text-xs text-gray-300 leading-relaxed bg-primary-navy/60 p-4 rounded-xl border border-neutral-800 whitespace-pre-wrap max-h-60 overflow-y-auto">
                                    {viewingMsg.message}
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex items-center justify-between px-6 py-4 border-t border-neutral-800 bg-primary-navy/40">
                            <button
                                onClick={() => toggleReadStatus(viewingMsg)}
                                className="flex items-center gap-2 text-xs font-semibold text-blue-400 hover:text-blue-300 transition"
                            >
                                {viewingMsg.isRead ? <Mail size={14} /> : <MailOpen size={14} />}
                                {viewingMsg.isRead ? 'Mark as Unread' : 'Mark as Read'}
                            </button>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => {
                                        const msg = viewingMsg;
                                        setViewingMsg(null);
                                        setEditingMsg(msg);
                                        setShowFormModal(true);
                                    }}
                                    className="px-4 py-2 rounded-xl border border-neutral-700 text-xs font-semibold text-gray-300 hover:text-white hover:border-neutral-500 transition"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(viewingMsg.id)}
                                    className="px-4 py-2 rounded-xl bg-red-600/20 border border-red-500/40 text-xs font-semibold text-red-400 hover:bg-red-600 hover:text-white transition"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ADD / EDIT FORM MODAL */}
            {showFormModal && (
                <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-[#0f1623] border border-neutral-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                                {(editingMsg as MessageItem).id ? 'Edit Message' : 'Add New Message'}
                            </h3>
                            <button onClick={() => setShowFormModal(false)} className="text-gray-400 hover:text-white transition cursor-pointer">
                                <X size={18} />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSave} className="p-6 space-y-4">
                            {/* Type & Status Row */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Message Type *</label>
                                    <select
                                        value={editingMsg.type || 'Contact'}
                                        onChange={(e) => setEditingMsg(prev => ({ ...prev, type: e.target.value }))}
                                        className="w-full bg-primary-dark border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-luxury-gold"
                                    >
                                        <option value="Contact">Contact Form</option>
                                        <option value="Newsletter">Newsletter Subscription</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Read Status</label>
                                    <select
                                        value={editingMsg.isRead ? 'true' : 'false'}
                                        onChange={(e) => setEditingMsg(prev => ({ ...prev, isRead: e.target.value === 'true' }))}
                                        className="w-full bg-primary-dark border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-luxury-gold"
                                    >
                                        <option value="false">Unread</option>
                                        <option value="true">Read</option>
                                    </select>
                                </div>
                            </div>

                            {/* Name */}
                            <div>
                                <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Sender Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={editingMsg.name || ''}
                                    onChange={(e) => setEditingMsg(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder="e.g. Tanvir Ahmed"
                                    className="w-full bg-primary-dark border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-luxury-gold"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Email Address *</label>
                                <input
                                    type="email"
                                    required
                                    value={editingMsg.email || ''}
                                    onChange={(e) => setEditingMsg(prev => ({ ...prev, email: e.target.value }))}
                                    placeholder="e.g. tanvir@example.com"
                                    className="w-full bg-primary-dark border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-luxury-gold"
                                />
                            </div>

                            {/* Subject */}
                            <div>
                                <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Subject</label>
                                <input
                                    type="text"
                                    value={editingMsg.subject || ''}
                                    onChange={(e) => setEditingMsg(prev => ({ ...prev, subject: e.target.value }))}
                                    placeholder="e.g. Inquiry regarding Aqualuna Apartments"
                                    className="w-full bg-primary-dark border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-luxury-gold"
                                />
                            </div>

                            {/* Message */}
                            <div>
                                <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Message Content</label>
                                <textarea
                                    rows={4}
                                    value={editingMsg.message || ''}
                                    onChange={(e) => setEditingMsg(prev => ({ ...prev, message: e.target.value }))}
                                    placeholder="Type message text..."
                                    className="w-full bg-primary-dark border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-luxury-gold resize-none"
                                />
                            </div>

                            {/* Modal Footer */}
                            <div className="flex gap-3 pt-3 border-t border-neutral-800">
                                <button
                                    type="button"
                                    onClick={() => setShowFormModal(false)}
                                    className="flex-1 py-2.5 rounded-xl border border-neutral-700 text-xs text-gray-400 hover:text-white transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-1 py-2.5 rounded-xl bg-luxury-gold hover:bg-yellow-500 text-white font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                                >
                                    {saving ? <Loader2 size={14} className="animate-spin" /> : 'Save Message'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}
