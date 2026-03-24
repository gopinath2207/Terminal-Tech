import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, CheckCircle, XCircle, TrendingUp, Star, ArrowLeft } from 'lucide-react';
import api from '../../api/axios';
import SEOHead from '../../components/ui/SEOHead';
import Spinner from '../../components/ui/Spinner';

const PostsPage = () => {
    const qc = useQueryClient();

    const { data: posts = [], isLoading } = useQuery({
        queryKey: ['admin-posts'],
        queryFn: async () => {
            const res = await api.get('/posts/admin/all');
            return res.data?.posts || [];
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => api.delete(`/posts/admin/${id}`),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-posts'] }),
    });

    const handleDelete = (id, title) => {
        if (window.confirm(`Delete "${title}"? This cannot be undone.`)) {
            deleteMutation.mutate(id);
        }
    };

    return (
        <>
            <SEOHead title="Manage Posts" />
            <div className="min-h-screen bg-[#050505] p-6">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <Link to="/admin/dashboard" className="text-gray-500 hover:text-white">
                                <ArrowLeft size={18} />
                            </Link>
                            <h1 className="text-xl font-bold">Manage <span className="text-matrix">Posts</span></h1>
                        </div>
                        <Link to="/admin/posts/new" className="btn-matrix">
                            <Plus size={16} /> New Post
                        </Link>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center py-20"><Spinner /></div>
                    ) : posts.length === 0 ? (
                        <div className="glass-card p-12 text-center text-gray-500">No posts yet. Create your first post!</div>
                    ) : (
                        <div className="glass-card overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="border-b border-white/[0.08]">
                                        <tr>
                                            {['Title', 'Category', 'Flags', 'Published', 'Views', 'Actions'].map((h) => (
                                                <th key={h} className="text-left px-4 py-3 text-gray-400 font-semibold">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {posts.map((post) => (
                                            <tr key={post._id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                                                <td className="px-4 py-3">
                                                    <p className="font-medium text-white max-w-xs truncate">{post.title}</p>
                                                    <p className="text-xs text-gray-500 truncate">/post/{post.slug}</p>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="badge-matrix capitalize">{post.category}</span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex gap-1.5">
                                                        {post.isTrending && <TrendingUp size={14} className="text-matrix" title="Trending" />}
                                                        {post.isTopPick && <Star size={14} className="text-yellow-400" title="Top Pick" />}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    {post.published
                                                        ? <CheckCircle size={16} className="text-matrix" />
                                                        : <XCircle size={16} className="text-gray-600" />}
                                                </td>
                                                <td className="px-4 py-3 text-gray-400">{post.views}</td>
                                                <td className="px-4 py-3">
                                                    <div className="flex gap-2">
                                                        <Link to={`/admin/posts/edit/${post._id}`} className="p-1.5 hover:text-matrix text-gray-500 transition-colors">
                                                            <Pencil size={15} />
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(post._id, post.title)}
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

export default PostsPage;
