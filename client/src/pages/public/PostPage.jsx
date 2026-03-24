import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Eye, Calendar, Tag } from 'lucide-react';
import MDEditor from '@uiw/react-md-editor';
import api from '../../api/axios';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import SEOHead from '../../components/ui/SEOHead';
import ComparisonTable from '../../components/blog/ComparisonTable';
import Spinner from '../../components/ui/Spinner';
import { buildCloudinaryUrl } from '../../utils/cloudinaryUrl';


const PostPage = () => {
    const { slug } = useParams();

    const { data: post, isLoading, isError } = useQuery({
        queryKey: ['post', slug],
        queryFn: async () => {
            const res = await api.get(`/posts/${slug}`);
            return res.data?.post;
        },
        enabled: !!slug,
    });

    if (isLoading) return <Spinner fullPage />;
    if (isError || !post)
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-400">
                Post not found.
            </div>
        );

    const coverUrl = buildCloudinaryUrl(post.coverImage?.url, { width: 1200 });
    const date = new Date(post.createdAt).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
    });

    return (
        <>
            <SEOHead
                title={post.metaTitle || post.title}
                description={post.metaDesc || post.excerpt}
                image={coverUrl}
            />
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-10 pb-8">
                    {/* Header */}
                    <header className="mb-8">
                        <div className="flex items-center gap-3 mb-4 flex-wrap">
                            <span className="badge-matrix capitalize">{post.category}</span>
                            {post.tags?.map((t) => (
                                <span key={t} className="flex items-center gap-1 text-xs text-gray-500">
                                    <Tag size={10} /> {t}
                                </span>
                            ))}
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight mb-4">
                            {post.title}
                        </h1>
                        <p className="text-lg text-gray-400 leading-relaxed mb-5">{post.excerpt}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500 flex-wrap">
                            <span className="flex items-center gap-1"><Calendar size={12} /> {date}</span>
                            <span className="flex items-center gap-1"><Eye size={12} /> {post.views} views</span>
                        </div>
                    </header>

                    {/* Cover image */}
                    {coverUrl && (
                        <div className="rounded-2xl overflow-hidden mb-10 border border-white/[0.06]">
                            <img
                                src={coverUrl}
                                alt={post.title}
                                className="w-full object-cover max-h-[480px]"
                                loading="eager"
                            />
                        </div>
                    )}

                    {/* Comparison table (if products embedded) */}
                    {post.products?.length > 0 && (
                        <ComparisonTable products={post.products} />
                    )}

                    {/* Article body — rendered from Markdown */}
                    <article className="max-w-none" data-color-mode="dark">
                        <MDEditor.Markdown
                            source={post.content}
                            style={{ background: 'transparent', color: '#cbd5e1' }}
                        />
                    </article>

                </main>
                <Footer />
            </div>
        </>
    );
};

export default PostPage;
