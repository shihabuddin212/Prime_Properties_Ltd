'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, User, Bot, Loader2, ArrowUp, Phone } from 'lucide-react';
import { usePathname } from 'next/navigation';

interface Message {
    sender: 'user' | 'bot';
    message: string;
    createdAt: Date;
}

export default function ChatbotWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputVal, setInputVal] = useState('');
    const [loading, setLoading] = useState(false);
    const [sessionId, setSessionId] = useState('');
    const pathname = usePathname();
    const chatEndRef = useRef<HTMLDivElement>(null);

    // Dynamic states for interactive buttons
    const [showTooltip, setShowTooltip] = useState(true);
    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        // Generate static session ID to group chats
        if (typeof window !== 'undefined') {
            let activeSession = localStorage.getItem('chat_session_id');
            if (!activeSession) {
                activeSession = 'sess_' + Math.random().toString(36).substring(2, 15);
                localStorage.setItem('chat_session_id', activeSession);
            }
            setSessionId(activeSession);
        }

        // Scroll listener for scroll to top button
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setShowScrollTop(true);
            } else {
                setShowScrollTop(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        // Scroll to bottom on updates
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isOpen]);

    // Welcome message when opened the first time
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([
                {
                    sender: 'bot',
                    message: 'Welcome to Prime Properties BD! I am your AI assistant. How can I help you today? Feel free to ask about our properties, landowner joint ventures, NRB services, or how to contact our team.',
                    createdAt: new Date(),
                },
            ]);
        }
    }, [isOpen, messages]);

    const isAdminPath = pathname.startsWith('/admin');
    if (isAdminPath) return null; // Hide in admin pages

    const sendQuery = async (queryText: string) => {
        if (!queryText.trim()) return;

        // Add user message
        const userMsg: Message = { sender: 'user', message: queryText, createdAt: new Date() };
        setMessages(prev => [...prev, userMsg]);
        setInputVal('');
        setLoading(true);

        try {
            const response = await fetch('/api/chatbot', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: queryText, sessionId }),
            });
            const data = await response.json();

            const botMsg: Message = {
                sender: 'bot',
                message: data.reply || 'Thank you for reaching out. A client specialist will touch base with you shortly. You can also directly call us at 01829-116107.',
                createdAt: new Date(),
            };

            setMessages(prev => [...prev, botMsg]);
        } catch (err) {
            console.error(err);
            const errMsg: Message = {
                sender: 'bot',
                message: 'Sorry, I am facing connectivity issues. Please contact our support team directly at 01829-116107.',
                createdAt: new Date(),
            };
            setMessages(prev => [...prev, errMsg]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            sendQuery(inputVal);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    const quickQuestions = [
        { label: '📞 Contact Details', text: 'contact' },
        { label: '💰 Property Prices', text: 'price' },
        { label: '📍 Project Locations', text: 'location' },
        { label: '🤝 Landowner JVs', text: 'landowner' },
    ];

    return (
        <>
            {/* Desktop-Only Right Sidebar Sticky Actions (Call, WhatsApp, Reach Us) */}
            <div className="hidden lg:flex flex-col gap-2 fixed right-0 top-1/2 -translate-y-1/2 z-50 pointer-events-none">
                {/* Call Button */}
                <a
                    href="tel:01829116107"
                    className="pointer-events-auto bg-[#1a1a1a] hover:bg-neutral-900 border border-neutral-800 text-white rounded-l-xl flex flex-col items-center justify-center p-3 w-20 shadow-2xl transition-all duration-300 transform hover:-translate-x-1 cursor-pointer"
                >
                    <Phone size={18} className="text-white mb-1.5" />
                    <span className="text-[10px] font-bold tracking-wider uppercase text-neutral-400">Call</span>
                </a>

                {/* WhatsApp Button */}
                <a
                    href="https://wa.me/8801829116107"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pointer-events-auto bg-[#1a1a1a] hover:bg-neutral-900 border border-neutral-800 text-white rounded-l-xl flex flex-col items-center justify-center p-3 w-20 shadow-2xl transition-all duration-300 transform hover:-translate-x-1 cursor-pointer"
                >
                    {/* SVG WhatsApp Green Icon */}
                    <svg className="w-5 h-5 mb-1.5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.25 8.477 3.518 2.266 2.268 3.51 5.28 3.509 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.733-1.455L0 24zm6.59-4.846c1.657.983 3.284 1.488 4.908 1.488a10.024 10.024 0 0 0 10.016-10.017c.002-2.677-1.042-5.193-2.937-7.091-1.896-1.897-4.412-2.943-7.092-2.943a10.027 10.027 0 0 0-10.012 10.019c-.001 1.777.494 3.42 1.464 4.887l-.962 3.514 3.615-.938zM17.15 14.18c-.282-.141-1.67-.824-1.928-.918-.258-.094-.446-.141-.634.141-.188.281-.727.918-.891 1.103-.164.185-.328.207-.61.066-.282-.141-1.19-.439-2.266-1.4a8.293 8.293 0 0 1-1.568-1.952c-.164-.282-.018-.434.123-.574.127-.127.282-.328.422-.492.141-.164.188-.281.282-.469.094-.188.047-.352-.023-.492-.07-.141-.634-1.528-.868-2.09-.228-.549-.46-.475-.634-.484-.164-.008-.352-.01-.54-.01a1.036 1.036 0 0 0-.751.352c-.258.281-.986.963-.986 2.348 0 1.385 1.008 2.723 1.149 2.91.141.188 1.984 3.03 4.806 4.246.67.29 1.194.463 1.602.593.673.214 1.286.184 1.77.112.54-.08 1.67-.682 1.905-1.34.235-.658.235-1.221.164-1.34-.07-.119-.258-.189-.54-.33z" />
                    </svg>
                    <span className="text-[10px] font-bold tracking-wider uppercase text-neutral-400">WhatsApp</span>
                </a>

                {/* Reach Us Button */}
                <button
                    onClick={() => {
                        setIsOpen(true);
                        setShowTooltip(false);
                    }}
                    className="pointer-events-auto bg-[#1a1a1a] hover:bg-neutral-900 border border-neutral-800 text-white rounded-l-xl flex flex-col items-center justify-center p-3 w-20 shadow-2xl transition-all duration-300 transform hover:-translate-x-1 cursor-pointer"
                >
                    <MessageSquare size={18} className="text-luxury-gold mb-1.5" />
                    <span className="text-[10px] font-bold tracking-wider uppercase text-neutral-400 font-sans">Reach Us</span>
                </button>
            </div>

            {/* Bottom Right Floating Chat Widget Overlay */}
            <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end gap-3.5">

                {/* Chat window */}
                {isOpen && (
                    <div className="bg-primary-navy border border-luxury-gold/30 rounded-2xl w-[320px] sm:w-[360px] h-[450px] shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden border-b-4 border-b-luxury-gold animate-in fade-in slide-in-from-bottom-6 duration-300">
                        {/* Header */}
                        <div className="bg-primary-dark border-b border-luxury-gold/20 p-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-luxury-gold flex items-center justify-center text-primary-navy font-bold text-sm">
                                    PP
                                </div>
                                <div>
                                    <h4 className="text-white text-xs font-semibold uppercase tracking-wider">Prime Assistant</h4>
                                    <div className="flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                        <span className="text-[10px] text-gray-400 font-light">Online & Ready</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-gray-400 hover:text-white hover:bg-gray-800 p-1.5 rounded-lg transition-colors cursor-pointer"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-primary-navy/40">
                            {messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`flex gap-2 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
                                >
                                    <div
                                        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-white text-[10px] ${msg.sender === 'user' ? 'bg-luxury-gold' : 'bg-gray-700'}`}
                                    >
                                        {msg.sender === 'user' ? <User size={12} /> : <Bot size={12} />}
                                    </div>

                                    <div className="flex flex-col">
                                        <div
                                            className={`rounded-2xl px-3 py-2 text-xs leading-relaxed whitespace-pre-line ${msg.sender === 'user'
                                                ? 'bg-luxury-gold text-white rounded-tr-none'
                                                : 'bg-primary-dark text-gray-300 rounded-tl-none border border-gray-800'
                                                }`}
                                        >
                                            {msg.message}
                                        </div>
                                        <span className="text-[8px] text-gray-500 mt-1 self-end font-light">
                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            ))}

                            {loading && (
                                <div className="flex gap-2 max-w-[85%]">
                                    <div className="w-7 h-7 rounded-full bg-gray-700 flex items-center justify-center text-white text-xs shrink-0">
                                        <Bot size={12} />
                                    </div>
                                    <div className="bg-primary-dark border border-gray-800 text-gray-400 rounded-2xl rounded-tl-none px-3 py-2 text-xs flex items-center gap-1.5">
                                        <Loader2 size={12} className="animate-spin text-luxury-gold" />
                                        Typing...
                                    </div>
                                </div>
                            )}
                            <div ref={chatEndRef} />
                        </div>

                        {/* Quick suggestions */}
                        {messages.length <= 2 && !loading && (
                            <div className="px-4 py-2 bg-primary-dark/30 border-t border-gray-800/50 flex flex-wrap gap-1.5">
                                {quickQuestions.map((q) => (
                                    <button
                                        key={q.text}
                                        onClick={() => sendQuery(q.text)}
                                        className="text-[10px] bg-primary-dark/80 border border-gray-800 hover:border-luxury-gold/50 text-gray-300 hover:text-white px-2.5 py-1.5 rounded-full transition-all cursor-pointer"
                                    >
                                        {q.label}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Input field */}
                        <div className="p-3 bg-primary-dark/80 border-t border-luxury-gold/10 flex gap-2">
                            <input
                                type="text"
                                value={inputVal}
                                onChange={(e) => setInputVal(e.target.value)}
                                onKeyDown={handleKeyPress}
                                placeholder="Ask anything..."
                                className="bg-primary-navy border border-gray-800 focus:border-luxury-gold/50 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 outline-none flex-1"
                            />
                            <button
                                onClick={() => sendQuery(inputVal)}
                                disabled={loading || !inputVal.trim()}
                                className="bg-luxury-gold hover:bg-gold-hover disabled:bg-gray-800 disabled:text-gray-600 text-white p-2 rounded-xl transition-all cursor-pointer"
                            >
                                <Send size={14} />
                            </button>
                        </div>
                    </div>
                )}

                {/* Overlays group containing Tooltip Card and Scroll to Top button */}
                {!isOpen && (
                    <div className="flex items-center gap-2.5">

                        {/* Tooltip Dialog widget */}
                        {showTooltip && (
                            <div className="bg-[#b3b3b3]/95 backdrop-blur-sm text-neutral-900 rounded-xl px-3.5 py-2 flex items-center justify-between gap-3 shadow-[0_8px_24px_rgba(0,0,0,0.15)] border border-neutral-300/40 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="flex items-center gap-2.5">
                                    <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white shrink-0">
                                        <img
                                            src="/support-agent.png"
                                            alt="Support Representative"
                                            className="w-full h-full object-cover"
                                        />
                                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full animate-pulse" />
                                    </div>
                                    <span className="text-xs font-semibold text-neutral-900 whitespace-nowrap">
                                        Have a question? Let's chat.
                                    </span>
                                </div>
                                <button
                                    onClick={() => setShowTooltip(false)}
                                    className="text-neutral-500 hover:text-neutral-900 p-0.5 rounded cursor-pointer transition-colors"
                                    aria-label="Close tooltip"
                                >
                                    <X size={13} />
                                </button>
                            </div>
                        )}

                        {/* Back-to-top button */}
                        {showScrollTop && (
                            <button
                                onClick={scrollToTop}
                                className="w-10 h-10 rounded-full bg-white hover:bg-neutral-100 text-neutral-800 shadow-lg flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 shrink-0 border border-neutral-200"
                                aria-label="Scroll to top"
                            >
                                <ArrowUp size={16} />
                            </button>
                        )}
                    </div>
                )}

                {/* Launcher chat bubble trigger */}
                <button
                    onClick={() => {
                        setIsOpen(!isOpen);
                        if (!isOpen) setShowTooltip(false); // Clean up prompt on open
                    }}
                    className="w-14 h-14 rounded-full bg-[#121212] hover:bg-neutral-900 text-white shadow-2xl flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 border border-neutral-800 hover:shadow-neutral-900/30 group shrink-0"
                    aria-label="Toggle Chat"
                >
                    {isOpen ? (
                        <X size={22} />
                    ) : (
                        <MessageSquare className="w-6 h-6 text-white group-hover:scale-105 transition-transform" />
                    )}
                </button>

            </div>
        </>
    );
}
