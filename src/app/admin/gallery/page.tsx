'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Eye, EyeOff, Loader2, X, Save, Upload, Trash, Image as ImageIcon, Camera } from 'lucide-react';
import { parseImages } from '@/lib/imageParser';

interface GalleryAlbum {
    id: string;
    title: string;
    category: string;
    images: string;
    published: boolean;
    createdAt: string;
}

const CATEGORY_LABELS: Record<string, string> = {
    'customer-events': 'Customer Events',
    'corporate-events': 'Corporate Events',
    'social': 'Social',
};

const EMPTY: Partial<GalleryAlbum> = {
    title: '',
    category: 'customer-events',
    images: '',
    published: true,
};

export default function AdminGalleryPage() {
    const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState<Partial<GalleryAlbum>>(EMPTY);
    const [imageList, setImageList] = useState<string[]>([]);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const fetchAlbums = async () => {
        setLoading(true);
        const res = await fetch('/api/admin/gallery');
        const data = await res.json();
        setAlbums(data);
        setLoading(false);
    };

    useEffect(() => { fetchAlbums(); }, []);

    const openCreate = () => {
        setEditing(EMPTY);
        setImageList([]);
        setShowModal(true);
    };

    const openEdit = (a: GalleryAlbum) => {
        setEditing(a);
        setImageList(parseImages(a.images));
        setShowModal(true);
    };

    const handleSave = async () => {
        if (!editing.title || !editing.category) return;
        setSaving(true);
        const payload = { ...editing, images: imageList.join('|') };
        const method = editing.id ? 'PUT' : 'POST';
        await fetch('/api/admin/gallery', {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        setSaving(false);
        setShowModal(false);
        fetchAlbums();
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this album?')) return;
        setDeletingId(id);
        await fetch('/api/admin/gallery', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
        });
        setDeletingId(null);
        fetchAlbums();
    };

    const togglePublish = async (a: GalleryAlbum) => {
        await fetch('/api/admin/gallery', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...a, published: !a.published }),
        });
        fetchAlbums();
    };

    // Client-side compression
    const compressImage = (file: File, maxW = 1200, maxH = 1200, q = 0.72): Promise<string> =>
        new Promise((resolve, reject) => {
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
                    resolve(canvas.toDataURL('image/jpeg', q));
                };
                img.onerror = reject;
            };
            reader.onerror = reject;
        });

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;
        for (const file of Array.from(files)) {
            try {
                const compressed = await compressImage(file);
                setImageList(prev => [...prev, compressed]);
            } catch (err) { console.error(err); }
        }
        e.target.value = '';
    };

    const grouped = {
        'customer-events': albums.filter(a => a.category === 'customer-events'),
        'corporate-events': albums.filter(a => a.category === 'corporate-events'),
        'social': albums.filter(a => a.category === 'social'),
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Camera size={20} className="text-luxury-gold" /> Gallery Albums
                    </h1>
                    <p className="text-xs text-gray-400 font-light mt-0.5">{albums.length} albums total · shown across 3 public categories</p>
                </div>
                <button onClick={openCreate}
                    className="flex items-center gap-2 bg-luxury-gold hover:bg-gold-hover text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-md cursor-pointer">
                    <Plus size={14} /> Add Album
                </button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 size={24} className="animate-spin text-luxury-gold" />
                </div>
            ) : (
                <div className="space-y-8">
                    {(['customer-events', 'corporate-events', 'social'] as const).map(cat => (
                        <div key={cat}>
                            <h2 className="text-xs font-bold uppercase tracking-widest text-luxury-gold mb-3 flex items-center gap-2">
                                <span className="w-6 h-px bg-luxury-gold/40 inline-block" />
                                {CATEGORY_LABELS[cat]}
                                <span className="text-gray-500 font-normal normal-case tracking-normal">({grouped[cat].length} albums)</span>
                            </h2>
                            <div className="bg-white dark:bg-primary-navy border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
                                {grouped[cat].length === 0 ? (
                                    <p className="px-5 py-8 text-center text-xs text-gray-400 font-light">No {CATEGORY_LABELS[cat]} albums yet.</p>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-xs">
                                            <thead className="bg-gray-50 dark:bg-primary-dark/30">
                                                <tr>
                                                    {['Cover', 'Title', '# Photos', 'Published', 'Actions'].map(h => (
                                                        <th key={h} className="px-5 py-3 text-left text-[10px] uppercase tracking-wider text-gray-400 font-semibold whitespace-nowrap">{h}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                                                {grouped[cat].map(a => {
                                                    const imgs = parseImages(a.images);
                                                    const cover = imgs[0];
                                                    return (
                                                        <tr key={a.id} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition">
                                                            <td className="px-5 py-3">
                                                                {cover ? (
                                                                    <img src={cover} alt="" className="w-14 h-10 object-cover rounded-lg border border-gray-200 dark:border-gray-700" />
                                                                ) : (
                                                                    <div className="w-14 h-10 rounded-lg bg-neutral-800 flex items-center justify-center">
                                                                        <ImageIcon size={14} className="text-gray-600" />
                                                                    </div>
                                                                )}
                                                            </td>
                                                            <td className="px-5 py-3 font-medium text-gray-800 dark:text-gray-200 whitespace-nowrap">{a.title}</td>
                                                            <td className="px-5 py-3 text-gray-400">{imgs.length} photo{imgs.length !== 1 ? 's' : ''}</td>
                                                            <td className="px-5 py-3">
                                                                <button onClick={() => togglePublish(a)} className="cursor-pointer text-gray-400 hover:text-luxury-gold transition p-1">
                                                                    {a.published ? <Eye size={16} className="text-green-500" /> : <EyeOff size={16} />}
                                                                </button>
                                                            </td>
                                                            <td className="px-5 py-3">
                                                                <div className="flex items-center gap-3">
                                                                    <button onClick={() => openEdit(a)} className="text-gray-400 hover:text-luxury-gold cursor-pointer transition p-1"><Pencil size={15} /></button>
                                                                    <button onClick={() => handleDelete(a.id)} disabled={deletingId === a.id} className="text-gray-400 hover:text-red-400 cursor-pointer transition p-1 disabled:opacity-40">
                                                                        {deletingId === a.id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
                    <div className="bg-primary-navy border border-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                        {/* Modal Header */}
                        <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between sticky top-0 bg-primary-navy z-10">
                            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                                {editing.id ? 'Edit Gallery Album' : 'New Gallery Album'}
                            </h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white cursor-pointer p-1"><X size={18} /></button>
                        </div>

                        <div className="p-6 space-y-5">
                            {/* Title */}
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase tracking-wider font-semibold text-gray-400">Album Title *</label>
                                <input type="text" value={editing.title ?? ''} onChange={e => setEditing(p => ({ ...p, title: e.target.value }))}
                                    placeholder="e.g. Know Your Neighbors – The Retreat"
                                    className="w-full bg-primary-dark/60 border border-gray-800 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white outline-none transition" />
                            </div>

                            {/* Category */}
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase tracking-wider font-semibold text-gray-400">Category *</label>
                                <select value={editing.category ?? 'customer-events'} onChange={e => setEditing(p => ({ ...p, category: e.target.value }))}
                                    className="w-full bg-primary-dark/60 border border-gray-800 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white outline-none transition cursor-pointer">
                                    <option value="customer-events">Customer Events</option>
                                    <option value="corporate-events">Corporate Events</option>
                                    <option value="social">Social</option>
                                </select>
                            </div>

                            {/* Images Uploader */}
                            <div className="border border-gray-800/80 rounded-xl p-4 bg-primary-dark/30 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <span className="text-[10px] uppercase tracking-wider font-bold text-luxury-gold block">Album Photos</span>
                                        <span className="text-[9px] text-gray-500">First photo is the cover shown on the Gallery page</span>
                                    </div>
                                    <label className="flex items-center gap-1.5 text-[9px] bg-luxury-gold hover:bg-gold-hover text-white font-bold uppercase rounded-lg px-3 py-1.5 cursor-pointer transition shadow-sm select-none">
                                        <Upload size={12} /> Upload Photos
                                        <input type="file" multiple accept="image/*" onChange={handleUpload} className="hidden" />
                                    </label>
                                </div>

                                {/* Photo grid */}
                                <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 min-h-[80px] border border-gray-800/60 p-3 rounded-xl bg-primary-navy/60">
                                    {imageList.map((src, idx) => (
                                        <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-white/5 group bg-neutral-900">
                                            {idx === 0 && (
                                                <span className="absolute top-1 left-1 z-10 text-[8px] font-bold uppercase bg-luxury-gold text-white px-1.5 py-0.5 rounded select-none">Cover</span>
                                            )}
                                            <img src={src} alt="" className="w-full h-full object-cover" />
                                            <button type="button" onClick={() => setImageList(prev => prev.filter((_, i) => i !== idx))}
                                                className="absolute inset-0 bg-red-600/85 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white cursor-pointer select-none">
                                                <Trash size={14} />
                                            </button>
                                        </div>
                                    ))}
                                    {imageList.length === 0 && (
                                        <div className="col-span-full flex flex-col items-center justify-center text-gray-500 font-light text-[10px] py-4">
                                            <ImageIcon size={20} className="mb-1.5 opacity-50" />
                                            <span>No photos yet. Click Upload Photos to add.</span>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[9px] uppercase tracking-wider text-gray-500">Or paste pipe-separated (|) image URLs</label>
                                    <input type="text" value={imageList.join(' | ')}
                                        onChange={e => setImageList(e.target.value.split('|').map(s => s.trim()).filter(Boolean))}
                                        placeholder="https://url1.jpg | https://url2.jpg"
                                        className="w-full bg-primary-dark/60 border border-gray-800 rounded-xl px-3 py-2 text-[10px] text-white outline-none select-all font-mono" />
                                </div>
                            </div>

                            {/* Published */}
                            <label className="flex items-center gap-2.5 cursor-pointer">
                                <input type="checkbox" checked={editing.published ?? true}
                                    onChange={e => setEditing(p => ({ ...p, published: e.target.checked }))}
                                    className="w-4 h-4 accent-luxury-gold" />
                                <span className="text-xs text-gray-300 font-medium select-none">Published / Visible on Gallery page</span>
                            </label>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 border-t border-gray-800 flex justify-end gap-3">
                            <button onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-xl border border-gray-800 text-gray-400 hover:text-white text-xs font-semibold uppercase tracking-wider transition cursor-pointer">Cancel</button>
                            <button onClick={handleSave} disabled={saving}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-luxury-gold hover:bg-gold-hover text-white text-xs font-bold uppercase tracking-wider transition disabled:opacity-60 cursor-pointer shadow-md">
                                {saving ? <><Loader2 size={13} className="animate-spin" /> Saving...</> : <><Save size={13} /> Save Album</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
