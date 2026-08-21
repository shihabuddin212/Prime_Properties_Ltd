'use client';

import { useEffect, useState } from 'react';
import { Loader2, RefreshCw } from 'lucide-react';

interface ChatMsg { id: string; sessionId: string; sender: string; message: string; createdAt: string; }

export default function AdminChatHistoryPage() {
    const [messages, setMessages] = useState<ChatMsg[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedSession, setSelectedSession] = useState<string | null>(null);

    const fetchMessages = async () => {
        setLoading(true);
        const res = await fetch('/api/admin/chat-history');
        setMessages(await res.json());
        setLoading(false);
    };
    useEffect(() => { fetchMessages(); }, []);

    // Group by session
    const sessions = [...new Set(messages.map(m => m.sessionId))];
    const threadMessages = selectedSession
        ? messages.filter(m => m.sessionId === selectedSession)
        : [];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">Live Chat History</h1>
                    <p className="text-xs text-gray-400 font-light mt-0.5">{sessions.length} conversations</p>
                </div>
                <button onClick={fetchMessages} className="flex items-center gap-2 border border-gray-200 dark:border-gray-800 text-gray-400 hover:text-white px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition cursor-pointer">
                    <RefreshCw size={13} /> Refresh
                </button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-16"><Loader2 size={24} className="animate-spin text-luxury-gold" /></div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[60vh]">
                    {/* Sessions list */}
                    <div className="bg-white dark:bg-primary-navy border border-gray-100 dark:border-gray-800 rounded-2xl overflow-y-auto">
                        <div className="px-5 py-3 border-b border-gray-100 dark:border-gray-800 text-[10px] uppercase tracking-widest font-semibold text-gray-400">Sessions</div>
                        {sessions.length === 0 && (
                            <p className="px-5 py-8 text-sm text-gray-400 font-light text-center">No chats recorded yet.</p>
                        )}
                        {sessions.map((sess, idx) => {
                            const lastMsg = messages.filter(m => m.sessionId === sess).at(-1);
                            return (
                                <button
                                    key={sess}
                                    onClick={() => setSelectedSession(sess)}
                                    className={`w-full text-left px-5 py-4 border-b border-gray-50 dark:border-gray-800/50 transition cursor-pointer ${selectedSession === sess ? 'bg-luxury-gold/10 border-l-2 border-l-luxury-gold' : 'hover:bg-gray-50/50 dark:hover:bg-white/5'
                                        }`}
                                >
                                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">Session #{idx + 1}</p>
                                    <p className="text-[10px] text-gray-400 font-light truncate mt-0.5">{lastMsg?.message}</p>
                                    <p className="text-[9px] text-gray-500 mt-1">{lastMsg ? new Date(lastMsg.createdAt).toLocaleString() : ''}</p>
                                </button>
                            );
                        })}
                    </div>

                    {/* Thread */}
                    <div className="lg:col-span-2 bg-white dark:bg-primary-navy border border-gray-100 dark:border-gray-800 rounded-2xl flex flex-col overflow-hidden">
                        {!selectedSession ? (
                            <div className="flex items-center justify-center flex-1 text-gray-400 text-sm font-light">Select a chat session to view messages</div>
                        ) : (
                            <>
                                <div className="px-5 py-3 border-b border-gray-100 dark:border-gray-800 text-[10px] uppercase tracking-widest font-semibold text-gray-400">
                                    Conversation Thread
                                </div>
                                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                                    {threadMessages.map(msg => (
                                        <div key={msg.id} className={`flex gap-2 max-w-[80%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
                                            <div className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-white text-[10px] font-bold ${msg.sender === 'user' ? 'bg-luxury-gold' : msg.sender === 'bot' ? 'bg-gray-600' : 'bg-purple-600'}`}>
                                                {msg.sender[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <div className={`rounded-2xl px-3 py-2 text-xs leading-relaxed whitespace-pre-line ${msg.sender === 'user' ? 'bg-luxury-gold text-white rounded-tr-none' :
                                                        msg.sender === 'admin' ? 'bg-purple-600 text-white rounded-tl-none' :
                                                            'bg-gray-100 dark:bg-primary-dark text-gray-800 dark:text-gray-300 rounded-tl-none'
                                                    }`}>
                                                    {msg.message}
                                                </div>
                                                <span className="text-[9px] text-gray-400 mt-1 block">{new Date(msg.createdAt).toLocaleTimeString()}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
