import { useQuery } from '@tanstack/react-query';
import { FileText, Package, MousePointerClick, TrendingUp, BarChart3, LogOut, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import SEOHead from '../../components/ui/SEOHead';
import Spinner from '../../components/ui/Spinner';

const StatCard = ({ icon: Icon, label, value, color = 'text-matrix' }) => (
    <div className="glass-card p-5 flex items-center gap-4">
        <div className={`p-3 rounded-xl bg-white/[0.05] ${color}`}>
            <Icon size={22} />
        </div>
        <div>
            <p className="text-xs text-gray-500 font-medium">{label}</p>
            <p className="text-2xl font-bold text-white">{value ?? '—'}</p>
        </div>
    </div>
);

const DashboardPage = () => {
    const { user, logout } = useAuth();

    const { data: stats, isLoading } = useQuery({
        queryKey: ['analytics'],
        queryFn: async () => {
            const res = await api.get('/analytics');
            return res.data;
        },
    });

    return (
        <>
            <SEOHead title="Dashboard" />
            <div className="min-h-screen bg-[#050505]">
                {/* Top bar */}
                <header className="border-b border-white/[0.06] px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <BarChart3 size={20} className="text-matrix" />
                        <span className="font-bold">Admin <span className="text-matrix">Dashboard</span></span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-xs text-gray-500">👋 {user?.username}</span>
                        <button onClick={logout} className="btn-outline text-xs py-1.5 px-3">
                            <LogOut size={13} /> Logout
                        </button>
                    </div>
                </header>

                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    {isLoading ? (
                        <div className="flex justify-center py-20"><Spinner /></div>
                    ) : (
                        <>
                            {/* Stats grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                                <StatCard icon={FileText} label="Total Posts" value={stats?.totalPosts} />
                                <StatCard icon={TrendingUp} label="Published" value={stats?.publishedPosts} color="text-blue-400" />
                                <StatCard icon={Package} label="Products" value={stats?.totalProducts} color="text-purple-400" />
                                <StatCard icon={MousePointerClick} label="Total Clicks" value={stats?.totalClicks} color="text-yellow-400" />
                            </div>

                            {/* Quick actions */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                                <div className="glass-card p-5">
                                    <h3 className="font-semibold text-white mb-3">Posts</h3>
                                    <div className="flex gap-2">
                                        <Link to="/admin/posts" className="btn-outline text-xs py-1.5">Manage Posts</Link>
                                        <Link to="/admin/posts/new" className="btn-matrix text-xs py-1.5">
                                            <PlusCircle size={13} /> New Post
                                        </Link>
                                    </div>
                                </div>
                                <div className="glass-card p-5">
                                    <h3 className="font-semibold text-white mb-3">Products</h3>
                                    <div className="flex gap-2">
                                        <Link to="/admin/products" className="btn-outline text-xs py-1.5">Manage Products</Link>
                                        <Link to="/admin/products/new" className="btn-matrix text-xs py-1.5">
                                            <PlusCircle size={13} /> New Product
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* Recent clicks */}
                            {stats?.recentClicks?.length > 0 && (
                                <div className="glass-card p-5">
                                    <h3 className="font-semibold text-white mb-4">Recent Affiliate Clicks</h3>
                                    <div className="space-y-2">
                                        {stats.recentClicks.map((click) => (
                                            <div key={click._id} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
                                                <span className="text-sm text-gray-300">{click.product?.name || 'Unknown Product'}</span>
                                                <span className="text-xs text-gray-500">
                                                    {new Date(click.createdAt).toLocaleString()}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </main>
            </div>
        </>
    );
};

export default DashboardPage;
