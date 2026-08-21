'use client';

import React, { useState } from 'react';
import { User, Calendar, Folder, Search } from 'lucide-react';

interface BlogPost {
    id: string;
    title: string;
    image: string;
    category: string;
    date: string;
    author: string;
    content: React.ReactNode;
}

const blogPosts: BlogPost[] = [
    {
        id: '1',
        title: 'How High-Quality Construction Changes the Way You Live',
        image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=1200',
        category: 'Apartment Living',
        date: '10 July 2026',
        author: 'Md Ariful Islam',
        content: (
            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-bold text-white mb-3">Key Takeaways for Buyers</h3>
                    <ul className="list-disc pl-5 space-y-2 text-xs font-light text-neutral-350 leading-relaxed">
                        <li><strong>Climate-Responsive Design:</strong> Strategic positioning minimizes direct heat import, improving cross-ventilation.</li>
                        <li><strong>Advanced Materials:</strong> Using concrete hollow blocks/insulation walls acts as a thermal shield, protecting from heat and humidity.</li>
                        <li><strong>Insulated Rooftop:</strong> Lime terracing or cool roofing stops rooftop heat from transferring down.</li>
                        <li><strong>Sustainability Living:</strong> Integrating balcony gardens or vertical green spaces keeps temperature low and air fresh.</li>
                    </ul>
                </div>

                <p className="text-xs font-light text-neutral-350 leading-[1.8]">
                    Choosing to make your home with standard construction is more than a structural need. It outlines how you live in Bangladesh. Apartments matching proper planning keep you comfortable and healthy, which is what we value at PPD.
                </p>

                <p className="text-xs font-light text-neutral-350 leading-[1.8]">
                    For over 18 years, PPD team experience has shaped a unique understanding of what you need, going beyond what is visible to the naked eye. From the foundations to the final paint layer, every detail is engineered to match international standards of safety and sustainability.
                </p>

                <h3 className="text-lg font-light text-white pt-4 border-t border-neutral-800">
                    Designing for Natural Comfort: Passive Cooling Tricks
                </h3>
                <p className="text-xs font-light text-neutral-350 leading-[1.8]">
                    Let's face it: Dhaka gets hot. Very hot. Air conditioning works, but it's expensive and hurts the environment. Passive cooling options, like cross-ventilation and strategic lintels, keep air moving naturally. Our architects design PPD properties with optimized wind flow patterns so your apartment remains fresh and aerated even in peak summer.
                </p>

                <h3 className="text-lg font-light text-white pt-4 border-t border-neutral-800">
                    Smart Materials that Do the Heavy Lifting
                </h3>
                <p className="text-xs font-light text-neutral-350 leading-[1.8]">
                    Modern construction needs modern materials. Hollow concrete blocks, triple-glazed glass panels, and cool roofing technology work together. The blocks act as insulation, preventing external heat from radiating inwards. We select materials that block exterior humidity, helping to keep indoor air clean and dry.
                </p>

                <h3 className="text-lg font-light text-white pt-4 border-t border-neutral-800">
                    Bringing the Outdoors In: The Value of Sustainable Residential Developments
                </h3>
                <p className="text-xs font-light text-neutral-350 leading-[1.8]">
                    Homes should connect you with nature. Biophilic designs, balcony gardens, and shared green terrace areas are not just decoration. They help filter dust, provide shade, and create microclimates that lower local ambient temperatures. At PPD, we combine lush plantings with smart irrigation systems to make residential living healthier.
                </p>
            </div>
        )
    },
    {
        id: '2',
        title: 'The Complete Guide to Investing in Dhaka Real Estate',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200',
        category: 'Investment Decisions',
        date: '24 Oct 2025',
        author: 'Md Ariful Islam',
        content: (
            <div className="space-y-6">
                <p className="text-xs font-light text-neutral-350 leading-[1.8]">
                    Real estate is one of the most reliable investment sectors in Bangladesh. As urbanization continues, particularly in prime zones like Gulshan, Dhanmondi, and Uttara, property values show solid appreciation.
                </p>
                <p className="text-xs font-light text-neutral-350 leading-[1.8]">
                    When looking to buy, focus on location, accessibility, and the reputation of the developer. PPD brings transparency and structural integrity to every deal, ensuring your investment remains secure.
                </p>
            </div>
        )
    },
    {
        id: '3',
        title: 'Why Sustainable Architecture is the Future of Bangladesh',
        image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1200',
        category: 'Real Estate Insights',
        date: '15 Sept 2025',
        author: 'Md Ariful Islam',
        content: (
            <div className="space-y-6">
                <p className="text-xs font-light text-neutral-350 leading-[1.8]">
                    Green buildings are no longer a luxury choice; they are an absolute necessity. Minimizing energy usage, harvesting rainwater, and maximizing natural light are core pillars of our architectural philosophy at PPD.
                </p>
                <p className="text-xs font-light text-neutral-350 leading-[1.8]">
                    Our goal is to build spaces that stand the test of time, both structurally and ecologically. Sustainable architecture ensures we protect the resources of tomorrow while offering comfort today.
                </p>
            </div>
        )
    },
    {
        id: '4',
        title: 'How to Adapt to Rising Rents in Property Market',
        image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&q=80&w=1200',
        category: 'Property Management',
        date: '01 Nov 2025',
        author: 'Md Ariful Islam',
        content: (
            <div className="space-y-6">
                <p className="text-xs font-light text-neutral-350 leading-[1.8]">
                    With population density rising, the rental market in major cities is becoming highly competitive. Both landlords and tenants need to adapt to changing dynamics, including online property management tools.
                </p>
                <p className="text-xs font-light text-neutral-350 leading-[1.8]">
                    PPD offers standard property management assistance, helping property owners rent out their units hassle-free and matching tenants with safe, well-maintained housing solutions.
                </p>
            </div>
        )
    },
    {
        id: '5',
        title: '10 Must-Visit Places for Designing Modern Kitchens',
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200',
        category: 'Home Construction Trends',
        date: '12 Mar 2025',
        author: 'Md Ariful Islam',
        content: (
            <div className="space-y-6">
                <p className="text-xs font-light text-neutral-350 leading-[1.8]">
                    Kitchens are the heart of the modern home. Designing a space that is functional, beautiful, and easy to maintain requires premium materials and thoughtful layouts.
                </p>
                <p className="text-xs font-light text-neutral-350 leading-[1.8]">
                    From modular cabinetry to energy-efficient appliances, exploring design ideas before you start construction will save you time and maximize the usability of your kitchen.
                </p>
            </div>
        )
    }
];

const categories = [
    { name: 'Apartment Living', count: 89 },
    { name: 'Investment Decisions', count: 45 },
    { name: 'Real Estate Insights', count: 31 },
    { name: 'Property Management', count: 12 },
    { name: 'Home Construction Trends', count: 22 }
];

export default function BlogPage() {
    const [selectedPostId, setSelectedPostId] = useState('1');
    const [searchQuery, setSearchQuery] = useState('');

    const currentPost = blogPosts.find(p => p.id === selectedPostId) || blogPosts[0];

    const filteredRecentPosts = blogPosts.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="pt-20 min-h-screen bg-[#1c1c1e] text-white">

            {/* Header Banner */}
            <section className="relative py-24 bg-neutral-950 overflow-hidden border-b border-neutral-800">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-15"
                    style={{ backgroundImage: `url('${currentPost.image}')` }}
                />
                <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-4">
                    <span className="text-[10px] tracking-[0.25em] font-bold text-luxury-gold uppercase font-sans">
                        PPD Insights &amp; Articles
                    </span>
                    <h1 className="text-3xl sm:text-5xl font-light text-white tracking-wide max-w-3xl mx-auto leading-tight">
                        {currentPost.title}
                    </h1>
                </div>
            </section>

            {/* Main Content Layout */}
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">

                    {/* Left Column – Article Content */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Large Image */}
                        <div className="relative aspect-[16/9] w-full rounded-[2rem] overflow-hidden shadow-2xl border border-white/5 bg-neutral-950">
                            <img
                                src={currentPost.image}
                                alt={currentPost.title}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Metadata row */}
                        <div className="flex flex-wrap items-center gap-6 text-[11px] text-neutral-400 font-light border-y border-neutral-800 py-3.5">
                            <div className="flex items-center gap-1.5">
                                <User size={13} className="text-luxury-gold" />
                                <span>{currentPost.author}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Calendar size={13} className="text-luxury-gold" />
                                <span>{currentPost.date}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Folder size={13} className="text-luxury-gold" />
                                <span>{currentPost.category}</span>
                            </div>
                        </div>

                        {/* Article body */}
                        <div className="space-y-6">
                            {currentPost.content}
                        </div>

                        {/* Share section */}
                        <div className="pt-6 border-t border-neutral-800 flex items-center gap-4 text-xs font-light text-neutral-400">
                            <span>Share:</span>
                            <a href="#" className="hover:text-white transition-colors" aria-label="Facebook">
                                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                            </a>
                            <a href="#" className="hover:text-white transition-colors" aria-label="LinkedIn">
                                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                </svg>
                            </a>
                            <a href="#" className="hover:text-white transition-colors" aria-label="Twitter">
                                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Right Column – Sidebar */}
                    <div className="space-y-10 lg:pl-4">

                        {/* Search */}
                        <div className="bg-[#262628] border border-neutral-800 rounded-2xl p-5 space-y-3 shadow-lg">
                            <h3 className="text-xs uppercase tracking-wider font-bold text-white">Search</h3>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search posts..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-[#1c1c1e] text-white border border-[#444] rounded-xl pl-4 pr-10 py-3 text-xs outline-none focus:border-luxury-gold/50 transition"
                                />
                                <Search size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
                            </div>
                        </div>

                        {/* Post Categories */}
                        <div className="bg-[#262628] border border-neutral-800 rounded-2xl p-5 space-y-4 shadow-lg">
                            <h3 className="text-xs uppercase tracking-wider font-bold text-white border-l-2 border-luxury-gold pl-3">
                                Post categories
                            </h3>
                            <nav className="space-y-2 text-xs font-light text-neutral-300">
                                {categories.map((cat, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => {
                                            const match = blogPosts.find(p => p.category === cat.name);
                                            if (match) setSelectedPostId(match.id);
                                        }}
                                        className="flex justify-between items-center py-2 border-b border-neutral-800/60 hover:text-white cursor-pointer transition-colors"
                                    >
                                        <span>{cat.name}</span>
                                        <span className="text-neutral-500 font-sans">({cat.count})</span>
                                    </div>
                                ))}
                            </nav>
                        </div>

                        {/* Recent Posts */}
                        <div className="bg-[#262628] border border-neutral-800 rounded-2xl p-5 space-y-4 shadow-lg">
                            <h3 className="text-xs uppercase tracking-wider font-bold text-white border-l-2 border-luxury-gold pl-3">
                                Recent Posts
                            </h3>
                            <div className="space-y-4">
                                {filteredRecentPosts.map((post) => (
                                    <div
                                        key={post.id}
                                        onClick={() => setSelectedPostId(post.id)}
                                        className="flex gap-4 group cursor-pointer border-b border-neutral-800/60 pb-3 last:border-b-0 last:pb-0"
                                    >
                                        <div className="w-14 h-14 bg-neutral-900 rounded-xl overflow-hidden shrink-0 border border-white/5">
                                            <img
                                                src={post.image}
                                                alt=""
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                            />
                                        </div>
                                        <div className="space-y-1 min-w-0">
                                            <h4 className="text-xs font-bold text-neutral-200 group-hover:text-luxury-gold transition-colors leading-tight line-clamp-2">
                                                {post.title}
                                            </h4>
                                            <p className="text-[10px] text-neutral-500 font-light flex items-center gap-1 font-sans">
                                                <Calendar size={9} />
                                                <span>{post.date}</span>
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </div>

        </div>
    );
}
