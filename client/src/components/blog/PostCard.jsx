import { Link } from 'react-router-dom';
import { TrendingUp, Star, ArrowRight, Clock } from 'lucide-react';
import { buildCloudinaryUrl } from '../../utils/cloudinaryUrl';

const PostCard = ({ post }) => {
    const imgUrl = buildCloudinaryUrl(post.coverImage?.url, { width: 600 });
    const date = new Date(post.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });

    return (
        <article className="glass-card flex flex-col h-full overflow-hidden group animate-fade-up">
            {/* Cover image */}
            <div className="relative h-48 overflow-hidden bg-white/[0.03]">
                {imgUrl ? (
                    <img
                        src={imgUrl}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <Star size={32} className="text-matrix/30" />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                    {post.isTrending && (
                        <span className="badge-matrix flex items-center gap-1">
                            <TrendingUp size={11} /> Trending
                        </span>
                    )}
                    {post.isTopPick && (
                        <span className="badge-matrix">⭐ Top Pick</span>
                    )}
                </div>
            </div>

            {/* Body */}
            <div className="flex flex-col flex-1 p-5">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium text-matrix/70 uppercase tracking-wider">{post.category}</span>
                    <span className="text-gray-700">·</span>
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock size={11} />
                        {date}
                    </span>
                </div>

                <h2 className="text-base font-bold text-white leading-snug mb-2 group-hover:text-matrix/90 transition-colors line-clamp-2">
                    {post.title}
                </h2>
                <p className="text-sm text-gray-400 line-clamp-2 flex-1 mb-4">{post.excerpt}</p>

                <Link
                    to={`/post/${post.slug}`}
                    className="flex items-center gap-1 text-sm font-semibold text-matrix hover:text-matrix-dim transition-colors mt-auto"
                >
                    Read Review <ArrowRight size={14} />
                </Link>
            </div>
        </article>
    );
};

export default PostCard;
