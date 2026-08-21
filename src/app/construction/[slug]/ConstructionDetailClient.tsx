'use client';

import React from 'react';
import Link from 'next/link';

interface ProgressItem {
    id: string;
    slNo: string;
    workName: string;
    progressDetails: string;
}

interface Project {
    id: string;
    title: string;
    slug: string;
    location: string;
    expectedCompletionDate: string;
    statusUpdateDate: string;
    featuredImage: string;
    logoUrl?: string;
    progressItems: ProgressItem[];
}

export default function ConstructionDetailClient({ project }: { project: Project }) {

    return (
        <div className="pt-24 min-h-screen bg-[#111112] text-white font-sans selection:bg-[#c5a880] selection:text-neutral-900">
            {/* ── TOP HEADER SECTION (Screencapture-15 Replication) ── */}
            <header className="max-w-[1200px] mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-center border-b border-neutral-900">

                {/* Left Description Side */}
                <div className="md:col-span-7 space-y-6">
                    <div>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-white tracking-wide leading-tight">
                            {project.title}
                        </h1>
                        {project.location && (
                            <p className="flex items-center gap-2 text-xs sm:text-sm text-neutral-400 mt-3 font-light">
                                <span className="text-[#c5a880]">📍</span> {project.location}
                            </p>
                        )}
                    </div>

                    {/* Completion and Update Card box */}
                    <div className="flex flex-wrap gap-4 pt-2">
                        {project.expectedCompletionDate && (
                            <div className="bg-[#1c1c1e]/60 border border-neutral-850 px-6 py-4 rounded-[1.2rem] min-w-[200px] backdrop-blur-sm">
                                <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">Expected Completion Date</p>
                                <p className="text-sm font-semibold text-neutral-200 mt-1 font-mono">{project.expectedCompletionDate}</p>
                            </div>
                        )}
                        {project.statusUpdateDate && (
                            <div className="bg-[#1c1c1e]/60 border border-neutral-850 px-6 py-4 rounded-[1.2rem] min-w-[200px] backdrop-blur-sm">
                                <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">Status Updated:</p>
                                <p className="text-sm font-semibold text-neutral-200 mt-1 font-mono">{project.statusUpdateDate}</p>
                            </div>
                        )}
                    </div>

                    {/* Back redirection button */}
                    <div className="pt-2">
                        <Link
                            href="/construction"
                            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#c5a880] hover:text-[#e6cda7] transition-all hover:translate-x-[-4px]"
                        >
                            <span>←</span> Back to all projects
                        </Link>
                    </div>
                </div>

                {/* Right Image Display Panel */}
                <div className="md:col-span-5 flex justify-center md:justify-end">
                    {project.featuredImage ? (
                        <div className="relative rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.7)] border border-neutral-800 aspect-[1/1] w-full max-w-[340px] group">
                            <img
                                src={project.featuredImage}
                                alt={project.title}
                                className="w-full h-full object-cover scale-100 group-hover:scale-[1.02] transition-transform duration-500"
                            />
                            {/* Project Name Watermark/Label Overlay on image */}
                            <div className="absolute top-5 left-5 bg-black/45 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/5 flex flex-col justify-center max-w-[80%]">
                                <span className="text-[10px] font-bold text-white uppercase tracking-widest leading-none shrink-0 truncate">
                                    {project.title}
                                </span>
                                <span className="text-[8px] font-light text-[#c5a880] uppercase tracking-wider mt-0.5 whitespace-nowrap">
                                    Construction View
                                </span>
                            </div>
                            {project.logoUrl && (
                                <div className="absolute top-5 right-5 bg-black/60 backdrop-blur-sm p-2 rounded-xl border border-white/10 shrink-0">
                                    <img src={project.logoUrl} alt="" className="h-5 object-contain" />
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="w-full max-w-[340px] aspect-square rounded-[2rem] bg-neutral-900 border border-neutral-850 flex items-center justify-center text-neutral-600">
                            No building render added
                        </div>
                    )}
                </div>
            </header>

            {/* ── CONSTRUCTION PROGRESS TABLE SECTION (Screencapture-15 Replication) ── */}
            <main className="max-w-[1250px] mx-auto px-6 py-16">
                <div className="bg-[#141416]/50 rounded-[2.5rem] border border-neutral-900 p-6 sm:p-10 shadow-2xl backdrop-blur-sm">
                    <div className="mb-8 space-y-2">
                        <h2 className="text-xl sm:text-2xl font-light tracking-wide text-white">
                            Construction progress details
                        </h2>
                        <p className="text-xs text-neutral-500 font-light">
                            The progress table comes directly from the database updates.
                        </p>
                    </div>

                    {project.progressItems && project.progressItems.length > 0 ? (
                        <div className="overflow-x-auto rounded-2xl border border-neutral-850 shadow-inner">
                            <table className="w-full border-collapse text-left text-xs sm:text-sm">
                                <thead>
                                    <tr className="bg-[#242426] border-b border-neutral-800">
                                        <th className="py-4.5 px-6 font-bold text-neutral-300 uppercase tracking-widest text-[9px] w-[10%]">SL. No</th>
                                        <th className="py-4.5 px-6 font-bold text-neutral-300 uppercase tracking-widest text-[9px] w-[45%]">Name of the work</th>
                                        <th className="py-4.5 px-6 font-bold text-neutral-300 uppercase tracking-widest text-[9px] w-[45%]">Progress details</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-900">
                                    {project.progressItems.map((item, idx) => {
                                        const isEven = idx % 2 === 0;
                                        return (
                                            <tr
                                                key={item.id}
                                                className={`transition-colors duration-150 ${isEven ? 'bg-[#18181a]/40 hover:bg-[#202022]/40' : 'bg-[#141416]/80 hover:bg-[#202022]/40'
                                                    }`}
                                            >
                                                <td className="py-4 px-6 font-mono text-[11px] text-[#c5a880] font-semibold">{item.slNo}</td>
                                                <td className="py-4 px-6 text-neutral-300 font-medium tracking-wide">{item.workName}</td>
                                                <td className="py-4 px-6 font-sans">
                                                    {item.progressDetails.includes('100%') ? (
                                                        <span className="text-emerald-400 font-semibold">{item.progressDetails}</span>
                                                    ) : item.progressDetails.includes('%') ? (
                                                        <span className="text-amber-400 font-semibold">{item.progressDetails}</span>
                                                    ) : (
                                                        <span className="text-neutral-400 font-light">{item.progressDetails}</span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-16 text-neutral-600 text-xs font-light">
                            Milestones or work progress items have not been configured for this property.
                        </div>
                    )}
                </div>
            </main>

        </div>
    );
}
