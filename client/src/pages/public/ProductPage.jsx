import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Star, ShoppingCart, Tag, ChevronLeft, ExternalLink, Award } from 'lucide-react';
import api from '../../api/axios';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import SEOHead from '../../components/ui/SEOHead';
import Spinner from '../../components/ui/Spinner';
import { buildCloudinaryUrl } from '../../utils/cloudinaryUrl';

// Per-store brand colours for the Buy Now buttons
const STORE_COLORS = {
    amazon:          { bg: '#FF9900', text: '#111' },
    flipkart:        { bg: '#2874F0', text: '#fff' },
    meesho:          { bg: '#8B2FC9', text: '#fff' },
    croma:           { bg: '#2C5090', text: '#fff' },
    snapdeal:        { bg: '#E40000', text: '#fff' },
    'reliance digital': { bg: '#0A47A9', text: '#fff' },
    'vijay sales':   { bg: '#D6001C', text: '#fff' },
};

const getStoreStyle = (storeName = '') => {
    const key = storeName.toLowerCase();
    return STORE_COLORS[key] || { bg: '#00FF41', text: '#050505' };
};

const StarRating = ({ rating }) => {
    const full = Math.round(rating);
    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} size={16} fill={i <= full ? '#FACC15' : 'none'} stroke={i <= full ? '#FACC15' : '#4b5563'} />
            ))}
            <span className="text-sm text-gray-400 ml-1">{rating}/5</span>
        </div>
    );
};

const ProductPage = () => {
    const { slug } = useParams();

    const { data: product, isLoading, isError } = useQuery({
        queryKey: ['product', slug],
        queryFn: async () => {
            const res = await api.get(`/products/${slug}`);
            return res.data?.product;
        },
        enabled: !!slug,
    });

    if (isLoading) return <Spinner fullPage />;
    if (isError || !product)
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-400">
                Product not found.
            </div>
        );

    const imageUrl = buildCloudinaryUrl(product.image?.url, { width: 600 });

    return (
        <>
            <SEOHead
                title={`${product.name} Review & Best Prices`}
                description={product.description || `Buy ${product.name} at the best price. Compare deals across Amazon, Flipkart, and more.`}
                image={imageUrl}
            />
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-10 pb-12">

                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 text-xs text-gray-500 mb-8">
                        <Link to="/" className="hover:text-matrix transition-colors">Home</Link>
                        <span>/</span>
                        {product.category && (
                            <>
                                <span className="capitalize">{product.category}</span>
                                <span>/</span>
                            </>
                        )}
                        <span className="text-gray-300 truncate">{product.name}</span>
                    </nav>

                    {/* ── Hero ──────────────────────────────────────────────────────────────── */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
                        {/* Image */}
                        <div className="rounded-2xl overflow-hidden border border-white/[0.08] bg-white/[0.03] flex items-center justify-center min-h-[280px]">
                            {imageUrl ? (
                                <img src={imageUrl} alt={product.name} className="w-full max-h-[380px] object-contain p-6" />
                            ) : (
                                <div className="text-gray-600 text-sm flex flex-col items-center gap-2 py-16">
                                    <ShoppingCart size={40} strokeWidth={1} />
                                    <span>No image</span>
                                </div>
                            )}
                        </div>

                        {/* Info */}
                        <div className="flex flex-col justify-center space-y-5">
                            {/* Badges */}
                            <div className="flex items-center gap-2 flex-wrap">
                                {product.category && (
                                    <span className="badge-matrix capitalize">{product.category}</span>
                                )}
                                {product.isBestValue && (
                                    <span className="badge-best-value flex items-center gap-1">
                                        <Award size={11} /> Best Value
                                    </span>
                                )}
                            </div>

                            {/* Name */}
                            <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                                {product.name}
                            </h1>

                            {/* Rating */}
                            {product.rating > 0 && <StarRating rating={product.rating} />}

                            {/* Price */}
                            {product.price && (
                                <div className="text-3xl font-black text-matrix">{product.price}</div>
                            )}

                            {/* Description */}
                            {product.description && (
                                <p className="text-gray-400 leading-relaxed">{product.description}</p>
                            )}

                            {/* ── Buy Now buttons — one per store ─────────────────────── */}
                            {product.affiliateLinks?.length > 0 && (
                                <div className="space-y-3 pt-1">
                                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                                        Compare Prices & Buy
                                    </p>
                                    <div className="flex flex-wrap gap-3">
                                        {product.affiliateLinks.map((link) => {
                                            const style = getStoreStyle(link.store);
                                            return (
                                                <a
                                                    key={link.shortCode || link.store}
                                                    href={`/go/${link.shortCode}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer sponsored"
                                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm transition-all hover:scale-105 hover:shadow-lg"
                                                    style={{ backgroundColor: style.bg, color: style.text }}
                                                >
                                                    <ShoppingCart size={15} />
                                                    Buy on {link.store}
                                                    <ExternalLink size={12} />
                                                </a>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── Specs Table ───────────────────────────────────────────────────────── */}
                    {product.specs?.length > 0 && (
                        <section className="mb-12">
                            <h2 className="section-title mb-5">
                                Full <span>Specifications</span>
                            </h2>
                            <div className="rounded-xl border border-white/[0.08] overflow-hidden">
                                <table className="w-full text-sm">
                                    <tbody>
                                        {product.specs.map((spec, i) => (
                                            <tr
                                                key={spec.key}
                                                className={`border-b border-white/[0.05] ${i % 2 === 0 ? 'bg-white/[0.02]' : ''}`}
                                            >
                                                <td className="px-5 py-3 text-gray-400 font-semibold w-1/3 capitalize">
                                                    {spec.key}
                                                </td>
                                                <td className="px-5 py-3 text-gray-200">{spec.value}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    )}

                    {/* ── All store links footer ────────────────────────────────────────────── */}
                    {product.affiliateLinks?.length > 1 && (
                        <section className="glass-card p-5">
                            <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                                <Tag size={14} className="text-matrix" /> Available On
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                {product.affiliateLinks.map((link) => {
                                    const style = getStoreStyle(link.store);
                                    return (
                                        <a
                                            key={link.shortCode || link.store}
                                            href={`/go/${link.shortCode}`}
                                            target="_blank"
                                            rel="noopener noreferrer sponsored"
                                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:opacity-90"
                                            style={{ backgroundColor: style.bg + '22', color: style.bg === '#FF9900' ? '#FF9900' : style.bg, border: `1px solid ${style.bg}40` }}
                                        >
                                            {link.store}
                                            <ExternalLink size={11} />
                                        </a>
                                    );
                                })}
                            </div>
                        </section>
                    )}

                </main>
                <Footer />
            </div>
        </>
    );
};

export default ProductPage;
