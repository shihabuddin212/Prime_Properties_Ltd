'use client';

import React, { useState, useEffect } from 'react';
import {
    Plus, Pencil, Trash2, Eye, EyeOff, Loader2, X, Save,
    Upload, Image as ImageIcon, HardHat, ListPlus, Eye as ViewIcon, HelpCircle
} from 'lucide-react';

interface ProgressItemInput {
    id?: string;
    slNo: string;
    workName: string;
    progressDetails: string;
    sortOrder: number;
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
    published: boolean;
    progressItems: ProgressItemInput[];
}

function compressImage(file: File, maxW = 1200, maxH = 1200, q = 0.75): Promise<string> {
    return new Promise((res, rej) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
            const img = new Image();
            img.src = e.target?.result as string;
            img.onload = () => {
                let w = img.width, h = img.height;
                if (w > h ? w > maxW : h > maxH) {
                    if (w > h) { h = Math.round(h * maxW / w); w = maxW; }
                    else { w = Math.round(w * maxH / h); h = maxH; }
                }
                const canvas = document.createElement('canvas');
                canvas.width = w; canvas.height = h;
                canvas.getContext('2d')?.drawImage(img, 0, 0, w, h);
                res(canvas.toDataURL('image/jpeg', q));
            };
            img.onerror = rej;
        };
        reader.onerror = rej;
    });
}

export default function AdminConstructionPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // Modal forms state
    const [showModal, setShowModal] = useState(false);
    const [editingProject, setEditingProject] = useState<Partial<Project>>({});
    const [projectTitle, setProjectTitle] = useState('');
    const [projectSlug, setProjectSlug] = useState('');
    const [projectLocation, setProjectLocation] = useState('');
    const [expectedCompletion, setExpectedCompletion] = useState('');
    const [statusUpdate, setStatusUpdate] = useState('');
    const [featuredImg, setFeaturedImg] = useState('');
    const [logoBadge, setLogoBadge] = useState('');
    const [publishedState, setPublishedState] = useState(true);

    // Progress Items spreadsheet-style editor state
    const [progressRows, setProgressRows] = useState<ProgressItemInput[]>([]);
    const [saving, setSaving] = useState(false);

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/construction');
            const data = await res.json();
            setProjects(Array.isArray(data) ? data : []);
        } catch (e) {
            console.error('Failed to load projects', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    // ── Open Create Mode ──
    const openCreate = () => {
        setEditingProject({});
        setProjectTitle('');
        setProjectSlug('');
        setProjectLocation('');
        setExpectedCompletion('July 2026');
        setStatusUpdate('June, 2026');
        setFeaturedImg('');
        setLogoBadge('');
        setPublishedState(true);
        setProgressRows([
            { slNo: '01', workName: 'Foundation work', progressDetails: 'Foundation 100% completed', sortOrder: 0 },
            { slNo: '02', workName: 'Super Structure work', progressDetails: '100%', sortOrder: 1 },
            { slNo: '03', workName: 'Block Work', progressDetails: 'A1 = 100%, A2 = 100%', sortOrder: 2 }
        ]);
        setShowModal(true);
    };

    // ── Open Edit Mode ──
    const openEdit = (p: Project) => {
        setEditingProject(p);
        setProjectTitle(p.title);
        setProjectSlug(p.slug || '');
        setProjectLocation(p.location || '');
        setExpectedCompletion(p.expectedCompletionDate || '');
        setStatusUpdate(p.statusUpdateDate || '');
        setFeaturedImg(p.featuredImage || '');
        setLogoBadge(p.logoUrl || '');
        setPublishedState(p.published);

        // Load progress items
        const rows: ProgressItemInput[] = (p.progressItems || []).map((item, idx) => ({
            id: item.id,
            slNo: item.slNo || String(idx + 1).padStart(2, '0'),
            workName: item.workName || '',
            progressDetails: item.progressDetails || '',
            sortOrder: item.sortOrder ?? idx
        }));

        // If empty, supply template
        if (rows.length === 0) {
            rows.push({ slNo: '01', workName: 'Foundation/Civil works', progressDetails: 'Not Started', sortOrder: 0 });
        }

        setProgressRows(rows);
        setShowModal(true);
    };

    // ── Handle Spreadsheet Inputs ──
    const handleAddRow = () => {
        const nextIndex = progressRows.length + 1;
        const newSl = String(nextIndex).padStart(2, '0');
        setProgressRows([
            ...progressRows,
            { slNo: newSl, workName: '', progressDetails: '', sortOrder: nextIndex - 1 }
        ]);
    };

    const handleRemoveRow = (idx: number) => {
        const updated = progressRows.filter((_, i) => i !== idx).map((row, i) => ({
            ...row,
            // Re-sequence Sl. No dynamically if it matches layout sequence
            slNo: String(i + 1).padStart(2, '0'),
            sortOrder: i
        }));
        setProgressRows(updated);
    };

    const handleRowValueChange = (idx: number, field: keyof ProgressItemInput, value: string) => {
        const updated = progressRows.map((row, i) => {
            if (i === idx) {
                return { ...row, [field]: value };
            }
            return row;
        });
        setProgressRows(updated);
    };

    // ── Save/POST/PUT ──
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!projectTitle) return;
        setSaving(true);

        const projectPayload = {
            title: projectTitle,
            slug: projectSlug || projectTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            location: projectLocation,
            expectedCompletionDate: expectedCompletion,
            statusUpdateDate: statusUpdate,
            featuredImage: featuredImg,
            logoUrl: logoBadge,
            published: publishedState,
            progressItems: progressRows
        };

        try {
            const isEditing = !!editingProject.id;
            const url = isEditing
                ? `/api/construction/${editingProject.id}`
                : '/api/construction';
            const method = isEditing ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(projectPayload),
            });

            if (!res.ok) {
                const data = await res.json();
                alert(data.error || 'Failed to save construction status');
            } else {
                setShowModal(false);
                fetchProjects();
            }
        } catch (err) {
            console.error(err);
            alert('Failed to save project');
        } finally {
            setSaving(false);
        }
    };

    // ── DELETE Project ──
    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Are you absolutely sure you want to delete project: "${name}"? This will delete all its construction progress rows permanently.`)) {
            return;
        }
        setDeletingId(id);
        try {
            const res = await fetch(`/api/construction/${id}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                fetchProjects();
            } else {
                alert('Failed to delete construction project');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setDeletingId(null);
        }
    };

    // ── Change Publication State directly ──
    const togglePublishState = async (p: Project) => {
        try {
            await fetch(`/api/construction/${p.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...p,
                    published: !p.published
                })
            });
            fetchProjects();
        } catch (err) {
            console.error('Failed to toggle visibility state', err);
        }
    };

    const triggerImageCompress = async (e: React.ChangeEvent<HTMLInputElement>, setter: (v: string) => void) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            const compressed = await compressImage(file);
            setter(compressed);
        } catch (err) {
            console.error('Image compression error', err);
        }
        e.target.value = '';
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto px-4 py-4">

            {/* Top Command Bar */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <HardHat size={20} className="text-luxury-gold" /> bti Construction Status
                    </h1>
                    <p className="text-xs text-gray-400 font-light mt-0.5">
                        Create and manage dynamic project milestones and progress rows like real-time spreadsheets.
                    </p>
                </div>
                <button
                    onClick={openCreate}
                    className="flex items-center gap-2 bg-luxury-gold hover:bg-gold-hover text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-md cursor-pointer"
                >
                    <Plus size={14} /> Add Project
                </button>
            </div>

            {/* Main Listing Grid / Layout */}
            {loading ? (
                <div className="flex items-center justify-center py-24">
                    <Loader2 size={24} className="animate-spin text-luxury-gold" />
                </div>
            ) : projects.length === 0 ? (
                <div className="text-center py-20 border border-gray-200 dark:border-gray-800 rounded-2xl text-gray-400 text-sm font-light">
                    <HardHat size={32} className="mx-auto mb-3 opacity-40 text-gray-400" />
                    No construction milestones added. Click "Add Project" to launch.
                </div>
            ) : (
                <div className="bg-white dark:bg-primary-navy border border-gray-200 dark:border-gray-800/80 rounded-2xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left text-xs">
                            <thead>
                                <tr className="bg-gray-100 dark:bg-primary-dark/60 text-gray-700 dark:text-gray-400 border-b border-gray-200 dark:border-gray-850">
                                    <th className="px-6 py-4 font-bold uppercase tracking-widest text-[9px]">Thumbnail</th>
                                    <th className="px-6 py-4 font-bold uppercase tracking-widest text-[9px]">Project Detail</th>
                                    <th className="px-6 py-4 font-bold uppercase tracking-widest text-[9px] text-center">Status Updates</th>
                                    <th className="px-6 py-4 font-bold uppercase tracking-widest text-[9px] text-center">Milestones</th>
                                    <th className="px-6 py-4 font-bold uppercase tracking-widest text-[9px] text-center">Visibility</th>
                                    <th className="px-6 py-4 font-bold uppercase tracking-widest text-[9px] text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {projects.map((p) => (
                                    <tr key={p.id} className="hover:bg-slate-500/5 transition">
                                        <td className="px-6 py-4 shrink-0">
                                            {p.featuredImage ? (
                                                <img src={p.featuredImage} alt="" className="w-14 h-14 object-cover rounded-xl border border-gray-200 dark:border-gray-750" />
                                            ) : (
                                                <div className="w-14 h-14 rounded-xl bg-gray-100 dark:bg-neutral-800 flex items-center justify-center">
                                                    <ImageIcon size={18} className="text-gray-400" />
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 min-w-[200px]">
                                            <div className="font-bold text-gray-900 dark:text-white text-sm">{p.title}</div>
                                            <div className="text-[10px] text-gray-400 font-light mt-0.5">location: {p.location || '—'}</div>
                                            <div className="text-[9px] text-luxury-gold/80 font-mono mt-0.5">slug: /{p.slug}</div>
                                        </td>
                                        <td className="px-6 py-4 text-center whitespace-nowrap">
                                            <div className="text-[11px] font-semibold text-gray-850 dark:text-gray-300">Completion: {p.expectedCompletionDate || '—'}</div>
                                            <div className="text-[9px] text-gray-500 mt-0.5">Updated: {p.statusUpdateDate || '—'}</div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="bg-luxury-gold/15 text-luxury-gold border border-luxury-gold/30 px-3 py-1 rounded-full text-[10px] font-bold font-mono">
                                                {p.progressItems?.length || 0} rows
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => togglePublishState(p)}
                                                className="cursor-pointer transition-colors p-1"
                                                title={p.published ? 'Published' : 'Hidden'}
                                            >
                                                {p.published ? (
                                                    <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-green-500 bg-green-500/10 px-2.5 py-1 rounded-full border border-green-500/20">
                                                        Visible
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-gray-400 bg-gray-500/10 px-2.5 py-1 rounded-full border border-gray-500/10">
                                                        Hidden
                                                    </span>
                                                )}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-right whitespace-nowrap">
                                            <div className="flex items-center justify-end gap-2.5">
                                                {/* View Public Route */}
                                                <a
                                                    href={`/construction/${p.slug}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2 border border-gray-300 dark:border-gray-700 hover:border-luxury-gold hover:text-luxury-gold transition rounded-xl text-gray-500 dark:text-gray-400"
                                                    title="View Public View"
                                                >
                                                    <ViewIcon size={14} />
                                                </a>
                                                {/* Edit Project */}
                                                <button
                                                    onClick={() => openEdit(p)}
                                                    className="p-2 border border-gray-300 dark:border-gray-700 hover:border-luxury-gold hover:text-luxury-gold transition rounded-xl text-gray-500 dark:text-gray-400 cursor-pointer"
                                                    title="Edit Status"
                                                >
                                                    <Pencil size={14} />
                                                </button>
                                                {/* Delete Project */}
                                                <button
                                                    onClick={() => handleDelete(p.id, p.title)}
                                                    disabled={deletingId === p.id}
                                                    className="p-2 border border-gray-300 dark:border-gray-700 hover:border-red-500 hover:text-red-400 transition rounded-xl text-gray-500 dark:text-gray-400 disabled:opacity-40 cursor-pointer"
                                                    title="Delete Project Update"
                                                >
                                                    {deletingId === p.id ? (
                                                        <Loader2 size={14} className="animate-spin" />
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
                </div>
            )}

            {/* ── PROJECT EDIT/NEW DIALOG MODAL ── */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-[#18181b] border border-neutral-800 rounded-2xl w-full max-w-4xl shadow-2xl my-8">
                        <form onSubmit={handleSave}>
                            {/* Modal Header */}
                            <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <HardHat size={16} className="text-luxury-gold" />
                                    <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                                        {editingProject.id ? 'Edit Construction Milestones' : 'Create New Project Status'}
                                    </h2>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="text-neutral-400 hover:text-white cursor-pointer p-1"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 max-h-[70vh] overflow-y-auto select-none">

                                {/* Left Side: Metadata Forms */}
                                <div className="lg:col-span-4 space-y-4">
                                    <div className="text-[10px] uppercase font-bold tracking-widest text-[#c5a880] pb-1 border-b border-neutral-800">
                                        Project Info
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[9px] uppercase tracking-wider font-semibold text-neutral-400">Project Title *</label>
                                        <input
                                            required
                                            value={projectTitle}
                                            onChange={e => setProjectTitle(e.target.value)}
                                            placeholder="e.g. Magenta"
                                            className="w-full bg-[#111112] border border-neutral-805 focus:border-[#c5a880]/50 rounded-xl px-4 py-2.5 text-xs text-white outline-none transition"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[9px] uppercase tracking-wider font-semibold text-neutral-400">URL Slug *</label>
                                        <input
                                            required
                                            value={projectSlug}
                                            onChange={e => setProjectSlug(e.target.value)}
                                            placeholder="e.g. magenta-dhanmondi"
                                            className="w-full bg-[#111112] border border-neutral-805 focus:border-[#c5a880]/50 rounded-xl px-4 py-2.5 text-xs text-white outline-none transition font-mono"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[9px] uppercase tracking-wider font-semibold text-neutral-400">Location Tag *</label>
                                        <input
                                            value={projectLocation}
                                            onChange={e => setProjectLocation(e.target.value)}
                                            placeholder="e.g. Dhanmondi, Dhaka"
                                            className="w-full bg-[#111112] border border-neutral-805 focus:border-[#c5a880]/50 rounded-xl px-4 py-2.5 text-xs text-white outline-none transition"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[9px] uppercase tracking-wider font-semibold text-neutral-400 font-sans">Expected Completion Date</label>
                                        <input
                                            value={expectedCompletion}
                                            onChange={e => setExpectedCompletion(e.target.value)}
                                            placeholder="e.g. July 2026"
                                            className="w-full bg-[#111112] border border-neutral-805 focus:border-[#c5a880]/50 rounded-xl px-4 py-2.5 text-xs text-white outline-none transition font-sans"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[9px] uppercase tracking-wider font-semibold text-neutral-400">Status Update Month</label>
                                        <input
                                            value={statusUpdate}
                                            onChange={e => setStatusUpdate(e.target.value)}
                                            placeholder="e.g. June, 2026"
                                            className="w-full bg-[#111112] border border-neutral-805 focus:border-[#c5a880]/50 rounded-xl px-4 py-2.5 text-xs text-white outline-none transition"
                                        />
                                    </div>

                                    {/* Upload Building Render Card (Featured Image) */}
                                    <div className="border border-neutral-850 rounded-xl p-4 bg-[#111112]/50 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[9px] uppercase tracking-wider font-bold text-[#c5a880]">Featured Image</span>
                                            <label className="flex items-center gap-1 bg-[#c5a880] hover:bg-gold-hover text-neutral-900 text-[8px] font-extrabold uppercase rounded px-2 py-1 cursor-pointer select-none transition">
                                                <Upload size={10} /> Upload
                                                <input type="file" accept="image/*" onChange={e => triggerImageCompress(e, setFeaturedImg)} className="hidden" />
                                            </label>
                                        </div>
                                        {featuredImg ? (
                                            <div className="relative aspect-video rounded-lg overflow-hidden border border-neutral-800">
                                                <img src={featuredImg} alt="" className="w-full h-full object-cover" />
                                                <button type="button" onClick={() => setFeaturedImg('')} className="absolute top-1 right-1 bg-red-600 rounded-full p-1 cursor-pointer text-white"><X size={10} /></button>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center py-4 border border-dashed border-neutral-800 rounded-lg text-neutral-500 text-[9px]">
                                                <ImageIcon size={14} className="mb-0.5 opacity-55" /> No aspect render selected
                                            </div>
                                        )}
                                        <input
                                            value={featuredImg.startsWith('data:') ? '' : featuredImg}
                                            onChange={e => setFeaturedImg(e.target.value)}
                                            placeholder="Or place direct image URL..."
                                            className="w-full bg-[#111112] border border-neutral-800 rounded-xl px-3 py-1.5 text-[9px] text-white outline-none font-mono"
                                        />
                                    </div>

                                    {/* Project Logo badge uploader */}
                                    <div className="border border-neutral-850 rounded-xl p-4 bg-[#111112]/50 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[9px] uppercase tracking-wider font-bold text-[#c5a880]">Developer logo badge</span>
                                            <label className="flex items-center gap-1 bg-[#c5a880] hover:bg-gold-hover text-neutral-900 text-[8px] font-extrabold uppercase rounded px-2 py-1 cursor-pointer select-none transition">
                                                <Upload size={10} /> Upload
                                                <input type="file" accept="image/*" onChange={e => triggerImageCompress(e, setLogoBadge)} className="hidden" />
                                            </label>
                                        </div>
                                        {logoBadge ? (
                                            <div className="relative h-10 w-full rounded border border-neutral-850 bg-black/40 flex items-center justify-center p-2">
                                                <img src={logoBadge} alt="" className="h-full object-contain" />
                                                <button type="button" onClick={() => setLogoBadge('')} className="absolute top-1 right-1 bg-red-600 rounded-full p-0.5 cursor-pointer text-white"><X size={8} /></button>
                                            </div>
                                        ) : (
                                            <div className="text-center py-1 text-neutral-600 text-[8px]">No custom badge / logo</div>
                                        )}
                                    </div>

                                    <label className="flex items-center gap-2.5 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={publishedState}
                                            onChange={e => setPublishedState(e.target.checked)}
                                            className="w-4 h-4 accent-[#c5a880] rounded border-neutral-800"
                                        />
                                        <span className="text-xs text-neutral-300 select-none">Publish / Display on site</span>
                                    </label>
                                </div>

                                {/* Right Side: Progress Milestones Spreadsheet Spreadsheet */}
                                <div className="lg:col-span-8 flex flex-col space-y-4">
                                    <div className="flex items-center justify-between border-b border-neutral-850 pb-2.5">
                                        <span className="text-[10px] uppercase font-bold tracking-widest text-[#c5a880] flex items-center gap-1">
                                            <ListPlus size={14} className="text-luxury-gold" /> Construction Milestones ({progressRows.length} rows)
                                        </span>
                                        <button
                                            type="button"
                                            onClick={handleAddRow}
                                            className="flex items-center gap-1.5 text-[9px] font-extrabold uppercase tracking-wider text-[#c5a880] border border-[#c5a880]/30 hover:bg-[#c5a880]/10 rounded-lg px-3 py-1.5 transition cursor-pointer"
                                        >
                                            <Plus size={11} /> + Add Row
                                        </button>
                                    </div>

                                    {/* Milestones grid spreadsheet */}
                                    <div className="overflow-x-auto rounded-xl border border-neutral-850 bg-[#111112]/20 flex-1 min-h-[300px]">
                                        <table className="min-w-full border-collapse text-xs text-white">
                                            <thead>
                                                <tr className="bg-[#1e1e20] text-[#c5a880] border-b border-neutral-800">
                                                    <th className="px-3 py-3 text-left font-bold uppercase tracking-wider w-[12%] text-[9px]">SL. No.</th>
                                                    <th className="px-3 py-3 text-left font-bold uppercase tracking-wider w-[44%] text-[9px]">Name of the work</th>
                                                    <th className="px-3 py-3 text-left font-bold uppercase tracking-wider w-[40%] text-[9px]">Progress details</th>
                                                    <th className="px-2 py-3 text-center w-[4%]"></th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-neutral-850">
                                                {progressRows.map((row, idx) => (
                                                    <tr key={idx} className="hover:bg-white/5 transition-colors">
                                                        {/* SL No Input */}
                                                        <td className="p-2">
                                                            <input
                                                                type="text"
                                                                required
                                                                value={row.slNo}
                                                                onChange={e => handleRowValueChange(idx, 'slNo', e.target.value)}
                                                                placeholder={`${idx + 1}`}
                                                                className="w-full bg-[#111112] border border-neutral-850 rounded px-2 py-1.5 text-center text-xs text-[#c5a880] font-mono outline-none focus:border-[#c5a880]/40"
                                                            />
                                                        </td>
                                                        {/* Name of work */}
                                                        <td className="p-2">
                                                            <input
                                                                type="text"
                                                                required
                                                                value={row.workName}
                                                                onChange={e => handleRowValueChange(idx, 'workName', e.target.value)}
                                                                placeholder="e.g. Super Structure Work"
                                                                className="w-full bg-[#111112] border border-neutral-850 rounded px-2.5 py-1.5 text-xs text-white outline-none focus:border-[#c5a880]/40 font-sans"
                                                            />
                                                        </td>
                                                        {/* Progress details */}
                                                        <td className="p-2">
                                                            <input
                                                                type="text"
                                                                required
                                                                value={row.progressDetails}
                                                                onChange={e => handleRowValueChange(idx, 'progressDetails', e.target.value)}
                                                                placeholder="e.g. 100% completed"
                                                                className="w-full bg-[#111112] border border-neutral-850 rounded px-2.5 py-1.5 text-xs text-neutral-200 outline-none focus:border-[#c5a880]/40"
                                                            />
                                                        </td>
                                                        {/* Delete Row Icon */}
                                                        <td className="p-2 text-center">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemoveRow(idx)}
                                                                className="text-red-500/60 hover:text-red-400 transition cursor-pointer p-1"
                                                                title="Delete Row"
                                                            >
                                                                <Trash2 size={13} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <p className="text-[10px] text-neutral-500 italic">
                                        * Note: Re-sequencing sl numbers is handled dynamically when a row is removed. Completed rows with "100%" automatically style emerald green, and others display golden.
                                    </p>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="px-6 py-4 border-t border-neutral-800 flex justify-end gap-3 bg-[#131315]">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-5 py-2.5 rounded-xl border border-neutral-800 text-neutral-400 hover:text-white text-xs font-semibold uppercase tracking-wider transition cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-luxury-gold hover:bg-gold-hover text-[#111112] text-xs font-extrabold uppercase tracking-wider transition disabled:opacity-60 cursor-pointer shadow-md select-none"
                                >
                                    {saving ? (
                                        <><Loader2 size={13} className="animate-spin" /> Saving...</>
                                    ) : (
                                        <><Save size={13} /> Save Project</>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
