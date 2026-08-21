'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Eye, EyeOff, Loader2, X, Save, Upload, PlusCircle, Trash, FileText, Image as ImageIcon, Film } from 'lucide-react';
import { parseImages, cleanMapUrl } from '@/lib/imageParser';

interface Property {
    id: string;
    title: string;
    slug: string;
    location: string;
    type: string;
    status: string;
    price: string;
    sqft: number;
    beds: number;
    baths: number;
    land: string;
    description: string;
    images: string;
    amenities: string;
    videoUrl: string;
    floorPlans: string;
    isFeatured: boolean;
    isSpecialOffer: boolean;
    published: boolean;

    // Glance columns
    address: string;
    floors: string;
    unitsPerFloor: string;
    launchDate: string;
    completionDate: string;
    brochureUrl: string;
    mapUrl: string;
}

const EMPTY: Partial<Property> = {
    title: '', slug: '', location: '', type: 'Apartment', status: 'Ongoing', price: '', sqft: 0,
    beds: 0, baths: 0, land: '', description: '', images: '', amenities: '', videoUrl: '',
    floorPlans: '', isFeatured: false, isSpecialOffer: false, published: true,
    address: '', floors: '', unitsPerFloor: '1', launchDate: '', completionDate: '', brochureUrl: '', mapUrl: '',
};

export default function AdminPropertiesPage() {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState<Partial<Property>>(EMPTY);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // List states for easy add/remove uploads
    const [previewImages, setPreviewImages] = useState<string[]>([]);
    const [floorPlanImages, setFloorPlanImages] = useState<string[]>([]);

    const fetchProperties = async () => {
        setLoading(true);
        const res = await fetch('/api/admin/properties');
        const data = await res.json();
        setProperties(data);
        setLoading(false);
    };

    useEffect(() => { fetchProperties(); }, []);

    const openCreate = () => {
        setEditing(EMPTY);
        setPreviewImages([]);
        setFloorPlanImages([]);
        setShowModal(true);
    };

    const openEdit = (p: Property) => {
        setEditing(p);
        setPreviewImages(parseImages(p.images));
        setFloorPlanImages(parseImages(p.floorPlans));
        setShowModal(true);
    };

    const processExternalUrls = async (imagesList: string[], isFloorPlan: boolean) => {
        let hasChanges = false;
        const newList = [...imagesList];

        for (let i = 0; i < newList.length; i++) {
            const item = newList[i];
            if (item && (item.startsWith('http://') || item.startsWith('https://'))) {
                try {
                    const res = await fetch('/api/admin/properties/upload-url', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ url: item })
                    });
                    if (res.ok) {
                        const data = await res.json();
                        if (data.base64 && data.base64.length > 0) {
                            newList.splice(i, 1, ...data.base64);
                            hasChanges = true;
                            i += data.base64.length - 1;
                        }
                    }
                } catch (err) {
                    console.error("Auto upload failed for URL:", item, err);
                }
            }
        }
        if (hasChanges) {
            if (isFloorPlan) {
                setFloorPlanImages(newList);
            } else {
                setPreviewImages(newList);
            }
        }
        return newList;
    };

    const handleSave = async () => {
        setSaving(true);
        const finalPreviewImages = await processExternalUrls(previewImages, false);
        const finalFloorPlanImages = await processExternalUrls(floorPlanImages, true);
        const payload = {
            ...editing,
            mapUrl: editing.mapUrl ? cleanMapUrl(editing.mapUrl) : '',
            images: finalPreviewImages.join('|'),
            floorPlans: finalFloorPlanImages.join('|'),
        };
        const method = editing.id ? 'PUT' : 'POST';
        await fetch('/api/admin/properties', {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        setSaving(false);
        setShowModal(false);
        fetchProperties();
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this property?')) return;
        setDeletingId(id);
        await fetch('/api/admin/properties', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
        });
        setDeletingId(null);
        fetchProperties();
    };

    const togglePublish = async (p: Property) => {
        await fetch('/api/admin/properties', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...p, published: !p.published }),
        });
        fetchProperties();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        setEditing(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : (type === 'number' ? parseInt(value) || 0 : value) }));
    };

    // Auto-generate slug from title
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value;
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        setEditing(prev => ({ ...prev, title, slug }));
    };

    // Real-time client-side image compression helper to keep database and network requests lean
    const compressImage = (file: File, maxWidth = 1200, maxHeight = 1200, quality = 0.7): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target?.result as string;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > maxWidth) {
                            height = Math.round((height * maxWidth) / width);
                            width = maxWidth;
                        }
                    } else {
                        if (height > maxHeight) {
                            width = Math.round((width * maxHeight) / height);
                            height = maxHeight;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0, width, height);

                    const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
                    resolve(compressedBase64);
                };
                img.onerror = (err) => reject(err);
            };
            reader.onerror = (err) => reject(err);
        });
    };

    // Base64 Multi-File Loader for Images with auto-compression
    const handleMultipleImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        for (const file of Array.from(files)) {
            try {
                const compressed = await compressImage(file);
                setPreviewImages(prev => [...prev, compressed]);
            } catch (err) {
                console.error("Compression error:", err);
            }
        }
    };

    // Base64 Multi-File Loader for Floor Plans with auto-compression
    const handleFloorPlansUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        for (const file of Array.from(files)) {
            try {
                const compressed = await compressImage(file);
                setFloorPlanImages(prev => [...prev, compressed]);
            } catch (err) {
                console.error("Floor plan compression error:", err);
            }
        }
    };

    // Single File upload (Brochure PDF / file)
    const handleBrochureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            setEditing(prev => ({ ...prev, brochureUrl: base64String }));
        };
        reader.readAsDataURL(file);
    };

    // Single File upload (Video file)
    const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            setEditing(prev => ({ ...prev, videoUrl: base64String }));
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">Properties</h1>
                    <p className="text-xs text-gray-400 font-light mt-0.5">{properties.length} total properties</p>
                </div>
                <button onClick={openCreate}
                    className="flex items-center gap-2 bg-luxury-gold hover:bg-gold-hover text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-md cursor-pointer">
                    <Plus size={14} /> Add Property
                </button>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-primary-navy border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
                {loading ? (
                    <div className="flex items-center justify-center py-16"><Loader2 size={24} className="animate-spin text-luxury-gold" /></div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                            <thead className="bg-gray-50 dark:bg-primary-dark/30">
                                <tr>
                                    {['Title', 'Location', 'Type', 'Status', 'Price', 'Published', 'Actions'].map(h => (
                                        <th key={h} className="px-5 py-3 text-left text-[10px] uppercase tracking-wider text-gray-400 font-semibold whitespace-nowrap">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                                {properties.map(p => (
                                    <tr key={p.id} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition">
                                        <td className="px-5 py-3 font-medium text-gray-800 dark:text-gray-200 whitespace-nowrap">
                                            {p.title}
                                            {p.isFeatured && <span className="ml-2 text-[9px] bg-luxury-gold/20 text-luxury-gold px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">FEATURED</span>}
                                            {p.isSpecialOffer && <span className="ml-2 text-[9px] bg-[#111111]/90 text-white border border-neutral-700/50 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">SPECIAL OFFER</span>}
                                        </td>
                                        <td className="px-5 py-3 text-gray-400 whitespace-nowrap">{p.location}</td>
                                        <td className="px-5 py-3 text-gray-400">{p.type}</td>
                                        <td className="px-5 py-3">
                                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase whitespace-nowrap ${p.status === 'Ready' ? 'bg-green-500/10 text-green-500' : p.status === 'Ongoing' ? 'bg-blue-500/10 text-blue-500' : 'bg-luxury-gold/10 text-luxury-gold'}`}>{p.status}</span>
                                        </td>
                                        <td className="px-5 py-3 text-gray-400 whitespace-nowrap font-mono">{p.price}</td>
                                        <td className="px-5 py-3">
                                            <button onClick={() => togglePublish(p)} className="cursor-pointer text-gray-400 hover:text-luxury-gold transition p-1">
                                                {p.published ? <Eye size={16} className="text-green-500" /> : <EyeOff size={16} />}
                                            </button>
                                        </td>
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-3">
                                                <button onClick={() => openEdit(p)} className="text-gray-400 hover:text-luxury-gold cursor-pointer transition p-1"><Pencil size={15} /></button>
                                                <button onClick={() => handleDelete(p.id)} disabled={deletingId === p.id} className="text-gray-400 hover:text-red-400 cursor-pointer transition p-1 disabled:opacity-40">
                                                    {deletingId === p.id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {properties.length === 0 && (
                                    <tr><td colSpan={7} className="px-5 py-8 text-center text-gray-400 font-light">No properties yet.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
                    <div className="bg-primary-navy border border-gray-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in scale-in duration-200">
                        <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between sticky top-0 bg-primary-navy z-10">
                            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                                {editing.id ? 'Edit Property details' : 'Add New Property'}
                            </h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white cursor-pointer p-1"><X size={18} /></button>
                        </div>
                        <div className="p-6 space-y-6">

                            {/* Core Text Section */}
                            <div className="border border-gray-800/80 rounded-xl p-5 bg-primary-dark/30 space-y-4">
                                <span className="text-[10px] uppercase tracking-wider font-bold text-luxury-gold block">
                                    Core Identification &amp; Pricing
                                </span>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase tracking-wider font-semibold text-gray-400">Title *</label>
                                        <input type="text" name="title" value={editing.title ?? ''} onChange={handleTitleChange} placeholder="e.g. Aqualuna"
                                            className="w-full bg-primary-dark/60 border border-gray-800 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white outline-none transition" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase tracking-wider font-semibold text-gray-400">Slug (Auto)</label>
                                        <input type="text" name="slug" value={editing.slug ?? ''} onChange={handleChange} placeholder="e.g. aqualuna-dhanmondi"
                                            className="w-full bg-primary-dark/60 border border-gray-800 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white outline-none transition" />
                                    </div>
                                    <div className="space-y-1 font-sans">
                                        <label className="text-[10px] uppercase tracking-wider font-semibold text-gray-400">General Location *</label>
                                        <input type="text" name="location" value={editing.location ?? ''} onChange={handleChange} placeholder="e.g. Dhanmondi, Dhaka"
                                            className="w-full bg-primary-dark/60 border border-gray-800 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white outline-none transition" />
                                    </div>
                                    <div className="space-y-1 font-mono">
                                        <label className="text-[10px] uppercase tracking-wider font-semibold text-gray-400">Price *</label>
                                        <input type="text" name="price" value={editing.price ?? ''} onChange={handleChange} placeholder="e.g. 4.5 Crore BDT"
                                            className="w-full bg-primary-dark/60 border border-gray-800 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white outline-none transition" />
                                    </div>
                                </div>
                            </div>

                            {/* At a Glance Specs Section */}
                            <div className="border border-gray-800/80 rounded-xl p-5 bg-primary-dark/30 space-y-4">
                                <span className="text-[10px] uppercase tracking-wider font-bold text-luxury-gold block">
                                    At a Glance details (Dynamic Sidebar Stats)
                                </span>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    <div className="space-y-1 col-span-1 sm:col-span-2 md:col-span-3">
                                        <label className="text-[10px] uppercase tracking-wider font-semibold text-gray-400">Full Address *</label>
                                        <input type="text" name="address" value={editing.address ?? ''} onChange={handleChange} placeholder="e.g. Plot - 52, Road - 7A, Dhanmondi"
                                            className="w-full bg-primary-dark/60 border border-gray-800 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white outline-none transition" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase tracking-wider font-semibold text-gray-400">Land Area Size *</label>
                                        <input type="text" name="land" value={editing.land ?? ''} onChange={handleChange} placeholder="e.g. 11.69 Katha"
                                            className="w-full bg-primary-dark/60 border border-gray-800 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white outline-none transition" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase tracking-wider font-semibold text-gray-400">Floors count</label>
                                        <input type="text" name="floors" value={editing.floors ?? ''} onChange={handleChange} placeholder="e.g. B+G+11"
                                            className="w-full bg-primary-dark/60 border border-gray-800 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white outline-none transition" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase tracking-wider font-semibold text-gray-400">Apartments / Floor</label>
                                        <input type="text" name="unitsPerFloor" value={editing.unitsPerFloor ?? ''} onChange={handleChange} placeholder="e.g. 1"
                                            className="w-full bg-primary-dark/60 border border-gray-800 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white outline-none transition" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase tracking-wider font-semibold text-gray-400">Apartment Size (sft) *</label>
                                        <input type="number" name="sqft" value={editing.sqft ?? 0} onChange={handleChange}
                                            className="w-full bg-primary-dark/60 border border-gray-800 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white outline-none transition" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase tracking-wider font-semibold text-gray-400">Bedrooms Count</label>
                                        <input type="number" name="beds" value={editing.beds ?? 0} onChange={handleChange}
                                            className="w-full bg-primary-dark/60 border border-gray-800 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white outline-none transition" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase tracking-wider font-semibold text-gray-400">Bathrooms Count</label>
                                        <input type="number" name="baths" value={editing.baths ?? 0} onChange={handleChange}
                                            className="w-full bg-primary-dark/60 border border-gray-800 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white outline-none transition" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase tracking-wider font-semibold text-gray-400">Launch Date label</label>
                                        <input type="text" name="launchDate" value={editing.launchDate ?? ''} onChange={handleChange} placeholder="e.g. June 2022"
                                            className="w-full bg-primary-dark/60 border border-gray-800 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white outline-none transition" />
                                    </div>
                                    <div className="space-y-1 col-span-1 sm:col-span-2">
                                        <label className="text-[10px] uppercase tracking-wider font-semibold text-gray-400">Expected Completion date</label>
                                        <input type="text" name="completionDate" value={editing.completionDate ?? ''} onChange={handleChange} placeholder="e.g. July 2026"
                                            className="w-full bg-primary-dark/60 border border-gray-800 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white outline-none transition" />
                                    </div>
                                </div>
                            </div>

                            {/* Images and Floor Plans Multi-uploader */}
                            <div className="border border-gray-800/80 rounded-xl p-5 bg-primary-dark/30 space-y-5">
                                <span className="text-[10px] uppercase tracking-wider font-bold text-luxury-gold block">
                                    Preview Pictures &amp; Floor Plans Uploader
                                </span>

                                {/* Preview Images Container */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <label className="text-[10px] uppercase tracking-wider font-semibold text-gray-400">Property Preview Images *</label>
                                        <label className="flex items-center gap-1.5 text-[9px] bg-luxury-gold text-white font-bold uppercase rounded-lg px-3 py-1 cursor-pointer transition hover:bg-gold-hover shadow-sm select-none">
                                            <Upload size={12} /> Upload Images
                                            <input type="file" multiple accept="image/*" onChange={handleMultipleImagesUpload} className="hidden" />
                                        </label>
                                    </div>

                                    {/* Scrollable list of uploaded or pasted image urls */}
                                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 border border-gray-800/80 p-3 rounded-xl bg-primary-navy/80 min-h-[80px]">
                                        {previewImages.map((src, idx) => (
                                            <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-white/5 group bg-neutral-900">
                                                <img src={src} alt="" className="w-full h-full object-cover" />
                                                <button type="button" onClick={() => setPreviewImages(prev => prev.filter((_, i) => i !== idx))}
                                                    className="absolute inset-0 bg-red-600/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white cursor-pointer select-none">
                                                    <Trash size={16} />
                                                </button>
                                            </div>
                                        ))}
                                        {previewImages.length === 0 && (
                                            <div className="col-span-full h-full flex flex-col items-center justify-center text-gray-500 font-light text-[10px]">
                                                <ImageIcon size={18} className="mb-1 opacity-55" />
                                                <span>No preview images uploaded.</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Direct CSV Input if needed */}
                                    <div className="space-y-1">
                                        <label className="text-[9px] uppercase tracking-wider text-gray-500">Or edit as pipe-separated (|) list of image URLs</label>
                                        <input type="text" value={previewImages.join(' | ')}
                                            onChange={(e) => setPreviewImages(e.target.value.split('|').map(s => s.trim()).filter(Boolean))}
                                            onBlur={() => processExternalUrls(previewImages, false)}
                                            placeholder="https://imageUrl1 | https://imageUrl2" className="w-full bg-primary-dark/60 border border-gray-800 rounded-xl px-3 py-2 text-[10px] text-white outline-none select-all font-mono" />
                                    </div>
                                </div>

                                {/* Floor plans container */}
                                <div className="space-y-3 pt-3 border-t border-gray-800/60">
                                    <div className="flex items-center justify-between">
                                        <label className="text-[10px] uppercase tracking-wider font-semibold text-gray-400">Property Floor plan Images</label>
                                        <label className="flex items-center gap-1.5 text-[9px] bg-luxury-gold text-white font-bold uppercase rounded-lg px-3 py-1 cursor-pointer transition hover:bg-gold-hover shadow-sm select-none">
                                            <Upload size={12} /> Upload Floor Plans
                                            <input type="file" multiple accept="image/*" onChange={handleFloorPlansUpload} className="hidden" />
                                        </label>
                                    </div>

                                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 border border-gray-800/80 p-3 rounded-xl bg-primary-navy/80 min-h-[80px]">
                                        {floorPlanImages.map((src, idx) => (
                                            <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-white/5 group bg-neutral-900">
                                                <img src={src} alt="" className="w-full h-full object-cover" />
                                                <button type="button" onClick={() => setFloorPlanImages(prev => prev.filter((_, i) => i !== idx))}
                                                    className="absolute inset-0 bg-red-600/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white cursor-pointer select-none">
                                                    <Trash size={16} />
                                                </button>
                                            </div>
                                        ))}
                                        {floorPlanImages.length === 0 && (
                                            <div className="col-span-full h-full flex flex-col items-center justify-center text-gray-500 font-light text-[10px]">
                                                <ImageIcon size={18} className="mb-1 opacity-55" />
                                                <span>No floor plans uploaded.</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Direct CSV Input if needed */}
                                    <div className="space-y-1">
                                        <label className="text-[9px] uppercase tracking-wider text-gray-500">Or edit as pipe-separated (|) list of floor plan URLs</label>
                                        <input type="text" value={floorPlanImages.join(' | ')}
                                            onChange={(e) => setFloorPlanImages(e.target.value.split('|').map(s => s.trim()).filter(Boolean))}
                                            onBlur={() => processExternalUrls(floorPlanImages, true)}
                                            placeholder="https://floorPlanUrl1 | https://floorPlanUrl2" className="w-full bg-primary-dark/60 border border-gray-800 rounded-xl px-3 py-2 text-[10px] text-white outline-none select-all font-mono" />
                                    </div>
                                </div>
                            </div>

                            {/* Videos, Maps & Brochure PDFs File Uploaders */}
                            <div className="border border-gray-800/80 rounded-xl p-5 bg-primary-dark/30 space-y-4">
                                <span className="text-[10px] uppercase tracking-wider font-bold text-luxury-gold block">
                                    Video, Brochure PDF &amp; Google Map Integrations
                                </span>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Video Embed */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase tracking-wider font-semibold text-gray-400 block">Property video URL or upload</label>
                                        <input type="text" name="videoUrl" value={editing.videoUrl ?? ''} onChange={handleChange} placeholder="e.g. YouTube Link or file URL"
                                            className="w-full bg-primary-dark/60 border border-gray-800 focus:border-luxury-gold/50 rounded-xl px-3.5 py-2 text-xs text-white outline-none transition" />
                                        <label className="flex items-center gap-2 justify-center border border-dashed border-gray-700 bg-primary-navy/40 rounded-xl py-2 px-3 hover:border-luxury-gold transition cursor-pointer text-center text-[10px] uppercase font-bold text-gray-400 hover:text-white select-none">
                                            <Film size={12} className="text-luxury-gold" /> Upload Video file (Base64)
                                            <input type="file" accept="video/*" onChange={handleVideoUpload} className="hidden" />
                                        </label>
                                    </div>

                                    {/* Brochure PDF Embed */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase tracking-wider font-semibold text-gray-400 block">PDF Brochure URL or upload</label>
                                        <input type="text" name="brochureUrl" value={editing.brochureUrl ?? ''} onChange={handleChange} placeholder="e.g. PDF file URL"
                                            className="w-full bg-primary-dark/60 border border-gray-800 focus:border-luxury-gold/50 rounded-xl px-3.5 py-2 text-xs text-white outline-none transition" />
                                        <label className="flex items-center gap-2 justify-center border border-dashed border-gray-700 bg-primary-navy/40 rounded-xl py-2 px-3 hover:border-luxury-gold transition cursor-pointer text-center text-[10px] uppercase font-bold text-gray-400 hover:text-white select-none">
                                            <FileText size={12} className="text-luxury-gold" /> Upload Brochure PDF (Base64)
                                            <input type="file" accept="application/pdf" onChange={handleBrochureUpload} className="hidden" />
                                        </label>
                                    </div>

                                    {/* Google Maps embed source link */}
                                    <div className="space-y-1 col-span-1 sm:col-span-2">
                                        <label className="text-[10px] uppercase tracking-wider font-semibold text-gray-400">Google Maps Iframe src URL</label>
                                        <input type="text" name="mapUrl" value={editing.mapUrl ?? ''} onChange={handleChange} placeholder="e.g. https://www.google.com/maps/embed?pb=..."
                                            className="w-full bg-primary-dark/60 border border-gray-800 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white outline-none transition" />
                                        <span className="text-[9px] text-gray-500 block leading-normal">Paste the clean source URL from Google Maps Share iframe embed code.</span>
                                    </div>
                                </div>
                            </div>

                            {/* Additional attributes */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase tracking-wider font-semibold text-gray-400">Property Type *</label>
                                    <select name="type" value={editing.type ?? 'Apartment'} onChange={handleChange}
                                        className="w-full bg-primary-dark/60 border border-gray-800 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white outline-none transition cursor-pointer">
                                        {['Apartment', 'Commercial', 'Land'].map(o => <option key={o} value={o}>{o}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase tracking-wider font-semibold text-gray-400">Property Status *</label>
                                    <select name="status" value={editing.status ?? 'Ongoing'} onChange={handleChange}
                                        className="w-full bg-primary-dark/60 border border-gray-800 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white outline-none transition cursor-pointer">
                                        {['Ongoing', 'Upcoming', 'Ready', 'Landowner JV'].map(o => <option key={o} value={o}>{o}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] uppercase tracking-wider font-semibold text-gray-400">Amenities (comma-separated list)</label>
                                <input type="text" name="amenities" value={editing.amenities ?? ''} onChange={handleChange} placeholder="Swimming Pool, Rooftop Gym, 24/7 Security"
                                    className="w-full bg-primary-dark/60 border border-gray-800 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white outline-none transition" />
                            </div>

                            <div className="space-y-1 font-light text-neutral-400">
                                <label className="text-[10px] uppercase tracking-wider font-semibold text-gray-400">Description *</label>
                                <textarea name="description" rows={4} value={editing.description ?? ''} onChange={handleChange}
                                    className="w-full bg-primary-dark/60 border border-gray-800 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white outline-none transition resize-none" />
                            </div>

                            {/* Checkboxes */}
                            <div className="flex gap-6 flex-wrap">
                                {[
                                    { label: 'Featured Property', name: 'isFeatured' },
                                    { label: 'Special Offer', name: 'isSpecialOffer' },
                                    { label: 'Published / Visible', name: 'published' }
                                ].map(c => (
                                    <label key={c.name} className="flex items-center gap-2.5 cursor-pointer">
                                        <input type="checkbox" name={c.name} checked={(editing as any)[c.name] ?? false} onChange={handleChange}
                                            className="w-4 h-4 accent-luxury-gold" />
                                        <span className="text-xs text-gray-300 font-medium select-none">{c.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="px-6 py-4 border-t border-gray-800 flex justify-end gap-3">
                            <button onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-xl border border-gray-800 text-gray-400 hover:text-white text-xs font-semibold uppercase tracking-wider transition cursor-pointer">Cancel</button>
                            <button onClick={handleSave} disabled={saving}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-luxury-gold hover:bg-gold-hover text-white text-xs font-bold uppercase tracking-wider transition disabled:opacity-60 cursor-pointer shadow-md">
                                {saving ? <><Loader2 size={13} className="animate-spin" /> Saving...</> : <><Save size={13} /> Save Property</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
