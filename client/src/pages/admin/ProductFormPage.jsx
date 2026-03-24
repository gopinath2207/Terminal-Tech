import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Save, ArrowLeft, Upload, X, Plus, Trash2, Link2 } from 'lucide-react';
import api from '../../api/axios';
import SEOHead from '../../components/ui/SEOHead';
import Spinner from '../../components/ui/Spinner';
import { buildCloudinaryUrl } from '../../utils/cloudinaryUrl';

const CATEGORIES = ['Laptops', 'Phones', 'Accessories', 'Audio', 'Gaming', 'Smart Home', 'Other'];

// Store name suggestions (user can type anything else)
const STORE_SUGGESTIONS = ['Amazon', 'Flipkart', 'Meesho', 'Croma', 'Snapdeal', 'Reliance Digital', 'Vijay Sales', 'ShareASale'];

const ProductFormPage = () => {
    const { id } = useParams();
    const isEdit = Boolean(id);
    const navigate = useNavigate();
    const qc = useQueryClient();
    const fileRef = useRef(null);

    const [form, setForm] = useState({
        name: '', description: '',
        price: '', rating: 0, isBestValue: false, category: '',
    });
    const [affiliateLinks, setAffiliateLinks] = useState([{ store: 'Amazon', url: '' }]);
    const [specs, setSpecs] = useState([{ key: '', value: '' }]);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [error, setError] = useState('');

    const { data: existingList, isLoading: fetchLoading } = useQuery({
        queryKey: ['admin-products'],
        queryFn: async () => {
            const res = await api.get('/products/admin/all');
            return res.data?.products || [];
        },
        enabled: isEdit,
    });

    const existing = existingList?.find((p) => p._id === id);

    useEffect(() => {
        if (existing) {
            setForm({
                name: existing.name || '',
                description: existing.description || '',
                price: existing.price || '',
                rating: existing.rating || 0,
                isBestValue: existing.isBestValue || false,
                category: existing.category || '',
            });
            setSpecs(existing.specs?.length ? existing.specs : [{ key: '', value: '' }]);
            setImagePreview(buildCloudinaryUrl(existing.image?.url, { width: 400 }));
            // Pre-populate affiliate links (strip shortCode — server re-assigns/preserves)
            if (existing.affiliateLinks?.length) {
                setAffiliateLinks(existing.affiliateLinks.map(({ store, url, shortCode }) => ({ store, url, shortCode })));
            }
        }
    }, [existing]);

    const saveMutation = useMutation({
        mutationFn: (formData) => {
            if (isEdit) return api.put(`/products/admin/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            return api.post('/products/admin', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['admin-products'] });
            navigate('/admin/products');
        },
        onError: (err) => setError(err.response?.data?.message || err.message),
    });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const updateSpec = (i, field, val) =>
        setSpecs(specs.map((s, idx) => (idx === i ? { ...s, [field]: val } : s)));

    const updateLink = (i, field, val) =>
        setAffiliateLinks(affiliateLinks.map((l, idx) => (idx === i ? { ...l, [field]: val } : l)));

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        // Validate: all links must have both fields
        for (const l of affiliateLinks) {
            if (!l.store.trim() || !l.url.trim()) {
                setError('Every affiliate link must have both a store name and a URL.');
                return;
            }
        }
        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => fd.append(k, typeof v === 'boolean' ? String(v) : v));
        fd.append('affiliateLinks', JSON.stringify(affiliateLinks.map(({ store, url, shortCode }) => ({ store, url, ...(shortCode && { shortCode }) }))));
        fd.append('specs', JSON.stringify(specs.filter((s) => s.key)));
        if (imageFile) fd.append('image', imageFile);
        saveMutation.mutate(fd);
    };

    if (fetchLoading && isEdit) return <Spinner fullPage />;

    return (
        <>
            <SEOHead title={isEdit ? 'Edit Product' : 'New Product'} />
            <div className="min-h-screen bg-[#050505] p-6">
                <div className="max-w-3xl mx-auto">
                    <div className="flex items-center gap-3 mb-8">
                        <button onClick={() => navigate('/admin/products')} className="text-gray-500 hover:text-white">
                            <ArrowLeft size={18} />
                        </button>
                        <h1 className="text-xl font-bold">{isEdit ? 'Edit' : 'New'} <span className="text-matrix">Product</span></h1>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Name */}
                            <div className="md:col-span-2">
                                <label className="block text-xs font-medium text-gray-400 mb-1.5">Product Name *</label>
                                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-matrix/40"
                                    placeholder="e.g. Logitech MX Master 3S" />
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1.5">Category</label>
                                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                                    className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-matrix/40">
                                    <option value="">Select…</option>
                                    {CATEGORIES.map((c) => <option key={c} value={c.toLowerCase()}>{c}</option>)}
                                </select>
                            </div>

                            {/* Price */}
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1.5">Price</label>
                                <input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                                    className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-matrix/40"
                                    placeholder="$99.99" />
                            </div>

                            {/* Rating */}
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1.5">Rating (0–5)</label>
                                <input type="number" min={0} max={5} step={0.1} value={form.rating}
                                    onChange={(e) => setForm({ ...form, rating: parseFloat(e.target.value) })}
                                    className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-matrix/40" />
                            </div>

                            {/* Best Value */}
                            <div className="flex items-center gap-2 pt-6">
                                <input type="checkbox" id="bestValue" checked={form.isBestValue}
                                    onChange={(e) => setForm({ ...form, isBestValue: e.target.checked })}
                                    className="accent-matrix w-4 h-4" />
                                <label htmlFor="bestValue" className="text-sm text-gray-300 cursor-pointer">Mark as Best Value</label>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1.5">Description</label>
                            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                                rows={2} className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-matrix/40 resize-none"
                                placeholder="Short product description…" />
                        </div>

                        {/* ── Affiliate Links ─────────────────────────────────────────────────── */}
                        <div className="glass-card p-4">
                            <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                    <Link2 size={15} className="text-matrix" />
                                    <h3 className="text-sm font-semibold text-gray-200">Affiliate Links *</h3>
                                </div>
                                <button type="button" onClick={() => setAffiliateLinks([...affiliateLinks, { store: '', url: '' }])}
                                    className="flex items-center gap-1 text-xs text-matrix hover:text-matrix-dim">
                                    <Plus size={13} /> Add Store
                                </button>
                            </div>
                            <p className="text-xs text-gray-500 mb-3">
                                Add one link per store — Amazon, Flipkart, Meesho, or any platform. Each gets its own tracked redirect URL.
                            </p>

                            <div className="space-y-2">
                                {affiliateLinks.map((link, i) => (
                                    <div key={i} className="flex gap-2 items-start">
                                        {/* Store name — with datalist suggestions */}
                                        <div className="w-36 flex-shrink-0">
                                            <input
                                                list="store-suggestions"
                                                placeholder="Store name"
                                                value={link.store}
                                                onChange={(e) => updateLink(i, 'store', e.target.value)}
                                                className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-matrix/40"
                                            />
                                        </div>
                                        <datalist id="store-suggestions">
                                            {STORE_SUGGESTIONS.map((s) => <option key={s} value={s} />)}
                                        </datalist>

                                        {/* URL */}
                                        <input
                                            type="url"
                                            placeholder="https://…"
                                            value={link.url}
                                            onChange={(e) => updateLink(i, 'url', e.target.value)}
                                            className="flex-1 px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-matrix/40"
                                        />

                                        {/* Redirect badge */}
                                        {link.shortCode && (
                                            <span className="text-[10px] text-gray-500 bg-white/[0.04] border border-white/[0.06] rounded px-2 py-2 whitespace-nowrap font-mono">
                                                /go/{link.shortCode}
                                            </span>
                                        )}

                                        {/* Delete */}
                                        {affiliateLinks.length > 1 && (
                                            <button type="button" onClick={() => setAffiliateLinks(affiliateLinks.filter((_, idx) => idx !== i))}
                                                className="text-gray-600 hover:text-red-400 p-2 flex-shrink-0">
                                                <Trash2 size={14} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Image */}
                        <div>
                            <label className="block text-xs font-medium text-gray-400 mb-2">Product Image</label>
                            <div className="flex items-start gap-4">
                                {imagePreview && (
                                    <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-white/[0.08]">
                                        <img src={imagePreview} alt="Preview" className="w-full h-full object-contain bg-white/5" />
                                        <button type="button" onClick={() => { setImageFile(null); setImagePreview(''); }}
                                            className="absolute top-1 right-1 p-0.5 bg-red-500/80 rounded text-white">
                                            <X size={12} />
                                        </button>
                                    </div>
                                )}
                                <button type="button" onClick={() => fileRef.current?.click()}
                                    className="btn-outline text-xs py-2">
                                    <Upload size={13} /> Choose Image
                                </button>
                                <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleImageChange} />
                            </div>
                        </div>

                        {/* Specs */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-xs font-medium text-gray-400">Specs (for comparison table)</label>
                                <button type="button" onClick={() => setSpecs([...specs, { key: '', value: '' }])}
                                    className="flex items-center gap-1 text-xs text-matrix hover:text-matrix-dim">
                                    <Plus size={12} /> Add Spec
                                </button>
                            </div>
                            <div className="space-y-2">
                                {specs.map((spec, i) => (
                                    <div key={i} className="flex gap-2 items-center">
                                        <input placeholder="Key (e.g. RAM)" value={spec.key} onChange={(e) => updateSpec(i, 'key', e.target.value)}
                                            className="flex-1 px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-matrix/40" />
                                        <input placeholder="Value (e.g. 16GB)" value={spec.value} onChange={(e) => updateSpec(i, 'value', e.target.value)}
                                            className="flex-1 px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-matrix/40" />
                                        {specs.length > 1 && (
                                            <button type="button" onClick={() => setSpecs(specs.filter((_, idx) => idx !== i))}
                                                className="text-gray-600 hover:text-red-400 p-1">
                                                <Trash2 size={14} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end pt-2">
                            <button type="submit" disabled={saveMutation.isPending} className="btn-matrix disabled:opacity-60">
                                {saveMutation.isPending ? <Spinner size={16} /> : <Save size={15} />}
                                {saveMutation.isPending ? 'Saving…' : 'Save Product'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default ProductFormPage;
