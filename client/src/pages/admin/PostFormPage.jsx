import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Save, ArrowLeft, Upload, X } from 'lucide-react';
import MDEditor from '@uiw/react-md-editor';
import api from '../../api/axios';
import SEOHead from '../../components/ui/SEOHead';
import Spinner from '../../components/ui/Spinner';
import { buildCloudinaryUrl } from '../../utils/cloudinaryUrl';

const CATEGORIES = ['Laptops', 'Phones', 'Accessories', 'Audio', 'Gaming', 'Smart Home', 'Other'];
const MAX_PRODUCTS = 5;

const PostFormPage = () => {
    const { id } = useParams();
    const isEdit = Boolean(id);
    const navigate = useNavigate();
    const qc = useQueryClient();
    const fileRef = useRef(null);

    const [form, setForm] = useState({
        title: '', excerpt: '', content: '', category: '',
        tags: '', isTrending: false, isTopPick: false,
        published: false, metaTitle: '', metaDesc: '',
    });
    const [selectedProducts, setSelectedProducts] = useState([]); // array of product _id strings
    const [productSearch, setProductSearch] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [error, setError] = useState('');

    // ── Fetch all available products for the picker ──────────────────────────
    const { data: allProducts = [] } = useQuery({
        queryKey: ['admin-products-picker'],
        queryFn: async () => {
            const res = await api.get('/products/admin/all');
            return res.data?.products || [];
        },
    });

    // ── Fetch existing post on edit ──────────────────────────────────────────
    const { data: existing, isLoading: fetchLoading } = useQuery({
        queryKey: ['admin-post', id],
        queryFn: async () => {
            const res = await api.get(`/posts/admin/all`);
            return (res.data?.posts || []).find((p) => p._id === id);
        },
        enabled: isEdit,
    });

    useEffect(() => {
        if (existing) {
            setForm({
                title: existing.title || '',
                excerpt: existing.excerpt || '',
                content: existing.content || '',
                category: existing.category || '',
                tags: (existing.tags || []).join(', '),
                isTrending: existing.isTrending || false,
                isTopPick: existing.isTopPick || false,
                published: existing.published || false,
                metaTitle: existing.metaTitle || '',
                metaDesc: existing.metaDesc || '',
            });
            setImagePreview(buildCloudinaryUrl(existing.coverImage?.url, { width: 400 }));
            // Pre-populate selected products (they may be populated objects or bare IDs)
            const ids = (existing.products || []).map((p) => (typeof p === 'string' ? p : p._id));
            setSelectedProducts(ids);
        }
    }, [existing]);

    const saveMutation = useMutation({
        mutationFn: (formData) => {
            if (isEdit) return api.put(`/posts/admin/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            return api.post('/posts/admin', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['admin-posts'] });
            navigate('/admin/posts');
        },
        onError: (err) => setError(err.response?.data?.message || err.message),
    });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const toggleProduct = (productId) => {
        setSelectedProducts((prev) => {
            if (prev.includes(productId)) return prev.filter((pid) => pid !== productId);
            if (prev.length >= MAX_PRODUCTS) return prev; // hard cap at 5
            return [...prev, productId];
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        const fd = new FormData();
        const tagsArr = form.tags.split(',').map((t) => t.trim()).filter(Boolean);
        Object.entries({ ...form, tags: JSON.stringify(tagsArr) }).forEach(([k, v]) => {
            fd.append(k, typeof v === 'boolean' ? String(v) : v);
        });
        fd.append('products', JSON.stringify(selectedProducts));
        if (imageFile) fd.append('coverImage', imageFile);
        saveMutation.mutate(fd);
    };

    // ── Filtered products for the picker ────────────────────────────────────
    const filteredProducts = allProducts.filter((p) =>
        p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
        (p.category || '').toLowerCase().includes(productSearch.toLowerCase())
    );

    if (fetchLoading) return <Spinner fullPage />;

    return (
        <>
            <SEOHead title={isEdit ? 'Edit Post' : 'New Post'} />
            <div className="min-h-screen bg-[#050505] p-6">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-3 mb-8">
                        <button onClick={() => navigate('/admin/posts')} className="text-gray-500 hover:text-white">
                            <ArrowLeft size={18} />
                        </button>
                        <h1 className="text-xl font-bold">{isEdit ? 'Edit' : 'New'} <span className="text-matrix">Post</span></h1>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* ── Basic Fields ─────────────────────────────────────────────────────── */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Title */}
                            <div className="md:col-span-2">
                                <label className="block text-xs font-medium text-gray-400 mb-1.5">Title *</label>
                                <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-matrix/40 focus:ring-1 focus:ring-matrix/20"
                                    placeholder="e.g. Top 5 Budget Laptops Under $500" />
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1.5">Category *</label>
                                <select required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                                    className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-matrix/40">
                                    <option value="">Select category…</option>
                                    {CATEGORIES.map((c) => <option key={c} value={c.toLowerCase()}>{c}</option>)}
                                </select>
                            </div>

                            {/* Tags */}
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1.5">Tags (comma-separated)</label>
                                <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })}
                                    className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-matrix/40"
                                    placeholder="laptop, budget, review…" />
                            </div>

                            {/* Excerpt */}
                            <div className="md:col-span-2">
                                <label className="block text-xs font-medium text-gray-400 mb-1.5">Excerpt *</label>
                                <textarea required value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                                    rows={2} className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-matrix/40 resize-none"
                                    placeholder="Short summary shown on cards and in SEO…" />
                            </div>
                        </div>

                        {/* ── Product Picker ────────────────────────────────────────────────────── */}
                        <div className="glass-card p-4">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-1">
                                <h3 className="text-sm font-semibold text-gray-200">
                                    Linked Products
                                    <span className={`ml-2 text-xs px-2 py-0.5 rounded-full font-bold ${
                                        selectedProducts.length >= MAX_PRODUCTS
                                            ? 'bg-matrix/20 text-matrix'
                                            : 'bg-white/[0.06] text-gray-400'
                                    }`}>
                                        {selectedProducts.length}/{MAX_PRODUCTS}
                                    </span>
                                </h3>
                            </div>
                            <p className="text-xs text-gray-500 mb-3">
                                Select up to 5 products — they'll appear as a <strong className="text-gray-400">comparison table</strong> at the top of the post.
                            </p>

                            {/* Search */}
                            <input
                                type="text"
                                value={productSearch}
                                onChange={(e) => setProductSearch(e.target.value)}
                                placeholder="Search by name or category…"
                                className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-matrix/40 mb-3"
                            />

                            {/* Product list */}
                            {allProducts.length === 0 ? (
                                <p className="text-xs text-gray-500 py-4 text-center">
                                    No products yet —{' '}
                                    <a href="/admin/products/new" className="text-matrix hover:underline">add one first</a>.
                                </p>
                            ) : (
                                <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                                    {filteredProducts.map((product) => {
                                        const isSelected = selectedProducts.includes(product._id);
                                        const isDisabled = !isSelected && selectedProducts.length >= MAX_PRODUCTS;
                                        const thumb = buildCloudinaryUrl(product.image?.url, { width: 80 });
                                        const rank = selectedProducts.indexOf(product._id);

                                        return (
                                            <label
                                                key={product._id}
                                                className={`flex items-center gap-3 p-2.5 rounded-lg border transition-all select-none ${
                                                    isSelected
                                                        ? 'border-matrix/40 bg-matrix/[0.06] cursor-pointer'
                                                        : isDisabled
                                                        ? 'border-white/[0.04] bg-white/[0.01] opacity-40 cursor-not-allowed'
                                                        : 'border-white/[0.06] bg-white/[0.02] hover:border-white/20 cursor-pointer'
                                                }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    disabled={isDisabled}
                                                    onChange={() => toggleProduct(product._id)}
                                                    className="accent-matrix w-4 h-4 flex-shrink-0"
                                                />

                                                {/* Rank badge */}
                                                {isSelected && (
                                                    <span className="text-[10px] font-bold text-matrix bg-matrix/10 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                                                        #{rank + 1}
                                                    </span>
                                                )}

                                                {/* Thumbnail */}
                                                <div className="w-10 h-10 rounded-md overflow-hidden bg-white/[0.05] flex-shrink-0">
                                                    {thumb ? (
                                                        <img src={thumb} alt={product.name} className="w-full h-full object-contain" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-600 text-[10px]">IMG</div>
                                                    )}
                                                </div>

                                                {/* Info */}
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-white truncate">{product.name}</p>
                                                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                                        {product.price && (
                                                            <span className="text-xs text-matrix font-semibold">{product.price}</span>
                                                        )}
                                                        {product.category && (
                                                            <span className="text-xs text-gray-500 capitalize">{product.category}</span>
                                                        )}
                                                        {product.isBestValue && (
                                                            <span className="badge-best-value text-[10px] py-0 leading-none">Best Value</span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Rating */}
                                                {product.rating > 0 && (
                                                    <span className="text-xs text-yellow-400 flex-shrink-0">★ {product.rating}</span>
                                                )}

                                                {/* Deselect X */}
                                                {isSelected && (
                                                    <button
                                                        type="button"
                                                        onClick={(e) => { e.preventDefault(); toggleProduct(product._id); }}
                                                        className="text-gray-500 hover:text-red-400 flex-shrink-0 ml-1"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                )}
                                            </label>
                                        );
                                    })}
                                    {filteredProducts.length === 0 && (
                                        <p className="text-xs text-gray-500 py-3 text-center">No products match your search.</p>
                                    )}
                                </div>
                            )}

                            {/* Selected order summary */}
                            {selectedProducts.length > 0 && (
                                <div className="mt-3 pt-3 border-t border-white/[0.06]">
                                    <p className="text-xs text-gray-500 mb-2">
                                        Comparison table column order (drag to reorder is not supported — deselect and re-select to change order):
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedProducts.map((pid, idx) => {
                                            const p = allProducts.find((pr) => pr._id === pid);
                                            return p ? (
                                                <span key={pid} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-matrix/10 border border-matrix/20 text-xs text-matrix">
                                                    <span className="font-bold text-[10px]">#{idx + 1}</span>
                                                    <span className="max-w-[120px] truncate">{p.name}</span>
                                                    <button type="button" onClick={() => toggleProduct(pid)} className="hover:text-red-400 ml-0.5">
                                                        <X size={10} />
                                                    </button>
                                                </span>
                                            ) : null;
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* ── Cover Image ──────────────────────────────────────────────────────── */}
                        <div>
                            <label className="block text-xs font-medium text-gray-400 mb-2">Cover Image</label>
                            <div className="flex items-start gap-4">
                                {imagePreview && (
                                    <div className="relative w-32 h-20 rounded-lg overflow-hidden border border-white/[0.08]">
                                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                        <button type="button" onClick={() => { setImageFile(null); setImagePreview(''); }}
                                            className="absolute top-1 right-1 p-0.5 bg-red-500/80 rounded text-white">
                                            <X size={12} />
                                        </button>
                                    </div>
                                )}
                                <button type="button" onClick={() => fileRef.current?.click()}
                                    className="btn-outline flex items-center gap-2 text-xs py-2">
                                    <Upload size={13} /> Choose Image
                                </button>
                                <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleImageChange} />
                            </div>
                        </div>

                        {/* ── Markdown Content ─────────────────────────────────────────────────── */}
                        <div data-color-mode="dark">
                            <label className="block text-xs font-medium text-gray-400 mb-2">Content *</label>
                            <MDEditor
                                value={form.content}
                                onChange={(val) => setForm({ ...form, content: val || '' })}
                                height={360}
                                preview="edit"
                            />
                        </div>

                        {/* ── SEO ──────────────────────────────────────────────────────────────── */}
                        <div className="glass-card p-4 space-y-3">
                            <h3 className="text-sm font-semibold text-gray-300">SEO</h3>
                            <input value={form.metaTitle} onChange={(e) => setForm({ ...form, metaTitle: e.target.value })}
                                className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-matrix/40"
                                placeholder="Meta title (defaults to post title)" />
                            <input value={form.metaDesc} onChange={(e) => setForm({ ...form, metaDesc: e.target.value })}
                                className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-matrix/40"
                                placeholder="Meta description (defaults to excerpt)" />
                        </div>

                        {/* ── Publish Flags ────────────────────────────────────────────────────── */}
                        <div className="flex flex-wrap gap-6">
                            {[
                                { key: 'isTrending', label: 'Trending' },
                                { key: 'isTopPick', label: 'Top Pick' },
                                { key: 'published', label: '✅ Published' },
                            ].map(({ key, label }) => (
                                <label key={key} className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={form[key]}
                                        onChange={(e) => setForm({ ...form, [key]: e.target.checked })}
                                        className="accent-matrix w-4 h-4" />
                                    <span className="text-sm text-gray-300">{label}</span>
                                </label>
                            ))}
                        </div>

                        <div className="flex justify-end">
                            <button type="submit" disabled={saveMutation.isPending} className="btn-matrix disabled:opacity-60">
                                {saveMutation.isPending ? <Spinner size={16} /> : <Save size={15} />}
                                {saveMutation.isPending ? 'Saving…' : 'Save Post'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default PostFormPage;
