import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Star, ArrowLeft, ExternalLink, Eye } from 'lucide-react';

import api from '../../api/axios';
import SEOHead from '../../components/ui/SEOHead';
import Spinner from '../../components/ui/Spinner';

const ProductsPage = () => {
    const qc = useQueryClient();

    const { data: products = [], isLoading } = useQuery({
        queryKey: ['admin-products'],
        queryFn: async () => {
            const res = await api.get('/products/admin/all');
            return res.data?.products || [];
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => api.delete(`/products/admin/${id}`),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-products'] }),
    });

    const handleDelete = (id, name) => {
        if (window.confirm(`Delete "${name}"? This cannot be undone.`)) {
            deleteMutation.mutate(id);
        }
    };

    return (
        <>
            <SEOHead title="Manage Products" />
            <div className="min-h-screen bg-[#050505] p-6">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <Link to="/admin/dashboard" className="text-gray-500 hover:text-white">
                                <ArrowLeft size={18} />
                            </Link>
                            <h1 className="text-xl font-bold">Manage <span className="text-matrix">Products</span></h1>
                        </div>
                        <Link to="/admin/products/new" className="btn-matrix">
                            <Plus size={16} /> New Product
                        </Link>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center py-20"><Spinner /></div>
                    ) : products.length === 0 ? (
                        <div className="glass-card p-12 text-center text-gray-500">No products yet. Add your first product!</div>
                    ) : (
                        <div className="glass-card overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="border-b border-white/[0.08]">
                                        <tr>
                                            {['Product', 'Category', 'Price', 'Rating', 'Clicks', 'Actions'].map((h) => (
                                                <th key={h} className="text-left px-4 py-3 text-gray-400 font-semibold">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.map((p) => (
                                            <tr key={p._id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-3">
                                                        <p className="font-medium text-white max-w-xs truncate">{p.name}</p>
                                                        {p.isBestValue && <span className="badge-best-value">Best Value</span>}
                                                    </div>
                                                    {/* Store link badges */}
                                                    <div className="flex items-center gap-1 mt-1 flex-wrap">
                                                        {(p.affiliateLinks || []).map((l) => (
                                                            <a key={l.shortCode} href={`/go/${l.shortCode}`} target="_blank" rel="noreferrer"
                                                                className="inline-flex items-center gap-0.5 text-[10px] text-gray-500 hover:text-matrix border border-white/[0.06] rounded px-1.5 py-0.5">
                                                                {l.store} <ExternalLink size={8} />
                                                            </a>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="badge-matrix capitalize">{p.category || '—'}</span>
                                                </td>
                                                <td className="px-4 py-3 font-semibold text-matrix">{p.price || '—'}</td>
                                                <td className="px-4 py-3 text-yellow-400 text-xs">
                                                    {'★'.repeat(Math.round(p.rating))}{'☆'.repeat(5 - Math.round(p.rating))}
                                                </td>
                                                <td className="px-4 py-3 text-gray-400">{p.clicks}</td>
                                                <td className="px-4 py-3">
                                                    <div className="flex gap-2">
                                                        <Link to={`/products/${p.slug}`} className="p-1.5 hover:text-blue-400 text-gray-500 transition-colors" title="View public page">
                                                            <Eye size={15} />
                                                        </Link>
                                                        <Link to={`/admin/products/edit/${p._id}`} className="p-1.5 hover:text-matrix text-gray-500 transition-colors">
                                                            <Pencil size={15} />
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(p._id, p.name)}
                                                            disabled={deleteMutation.isPending}
                                                            className="p-1.5 hover:text-red-400 text-gray-500 transition-colors"
                                                        >
                                                            <Trash2 size={15} />
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
                </div>
            </div>
        </>
    );
};

export default ProductsPage;
