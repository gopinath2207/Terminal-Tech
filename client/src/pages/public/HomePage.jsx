import { useQuery } from '@tanstack/react-query';
import { TrendingUp, Star, Clock, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import PostCard from '../../components/blog/PostCard';
import SEOHead from '../../components/ui/SEOHead';
import Spinner from '../../components/ui/Spinner';

const fetchPosts = async (params) => {
    const res = await api.get('/posts', { params });
    return res.data?.posts || [];
};

const SectionHeader = ({ icon: Icon, label, accent, linkTo }) => (
    <div className="flex items-center justify-between mb-6">
        <h2 className="section-title flex items-center gap-2">
            <Icon size={22} className="text-matrix" />
            <span>{accent}</span> {label}
        </h2>
        {linkTo && (
            <Link to={linkTo} className="flex items-center gap-1 text-xs text-gray-500 hover:text-matrix transition-colors">
                View all <ChevronRight size={13} />
            </Link>
        )}
    </div>
);

const EmptyState = ({ message }) => (
    <p className="text-gray-500 text-center py-12">{message}</p>
);

const PostGrid = ({ posts }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
            <PostCard key={post._id} post={post} />
        ))}
    </div>
);

const HomePage = () => {
    // All published posts — shows everything; used for "Latest Posts"
    const { data: allPosts = [], isLoading: allLoading } = useQuery({
        queryKey: ['posts', 'all'],
        queryFn: () => fetchPosts({}),
    });

    const { data: trending = [], isLoading: trendingLoading } = useQuery({
        queryKey: ['posts', 'trending'],
        queryFn: () => fetchPosts({ trending: 'true' }),
    });

    const { data: topPicks = [], isLoading: topLoading } = useQuery({
        queryKey: ['posts', 'topPick'],
        queryFn: () => fetchPosts({ topPick: 'true' }),
    });

    return (
        <>
            <SEOHead
                title="Best Tech Reviews & Affiliate Deals"
                description="Expert reviews, comparisons, and the best tech deals curated for you."
            />
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-12 pb-8">
                    {/* Hero */}
                    <section className="text-center mb-20 relative">
                        <div className="inline-flex items-center gap-2 badge-matrix mb-5">
                            <TrendingUp size={13} /> Real Reviews. No Fluff.
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-5">
                            The Best Tech <span className="text-matrix">Deals</span>
                            <br />& In-Depth <span className="text-matrix">Reviews</span>
                        </h1>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            We test every product so you don't have to. Unbiased, expert-curated picks
                            with real performance data and honest affiliate links.
                        </p>
                    </section>

                    {/* ── Latest Posts (ALL published posts) ─────────────────── */}
                    <section className="mb-16">
                        <SectionHeader icon={Clock} accent="Latest" label="Posts" />
                        {allLoading ? (
                            <div className="flex justify-center py-16"><Spinner /></div>
                        ) : allPosts.length === 0 ? (
                            <EmptyState message="No posts published yet. Head to the admin dashboard and create one!" />
                        ) : (
                            <PostGrid posts={allPosts} />
                        )}
                    </section>

                    {/* ── Trending Section ────────────────────────────────────── */}
                    {(trendingLoading || trending.length > 0) && (
                        <section className="mb-16">
                            <SectionHeader icon={TrendingUp} accent="Trending" label="Reviews" />
                            {trendingLoading ? (
                                <div className="flex justify-center py-16"><Spinner /></div>
                            ) : (
                                <PostGrid posts={trending} />
                            )}
                        </section>
                    )}

                    {/* ── Top Picks Section ───────────────────────────────────── */}
                    {(topLoading || topPicks.length > 0) && (
                        <section className="mb-16">
                            <SectionHeader icon={Star} accent="Top 5" label="Picks" />
                            {topLoading ? (
                                <div className="flex justify-center py-16"><Spinner /></div>
                            ) : (
                                <PostGrid posts={topPicks.slice(0, 5)} />
                            )}
                        </section>
                    )}
                </main>
                <Footer />
            </div>
        </>
    );
};

export default HomePage;
