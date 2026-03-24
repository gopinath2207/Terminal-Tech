import { ExternalLink, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { buildCloudinaryUrl } from '../../utils/cloudinaryUrl';

const ComparisonTable = ({ products = [] }) => {
    if (!products.length) return null;

    // Collect all unique spec keys across all products
    const allKeys = [...new Set(products.flatMap((p) => (p.specs || []).map((s) => s.key)))];

    const getSpecValue = (product, key) =>
        (product.specs || []).find((s) => s.key === key)?.value || '—';

    // Primary affiliate link (first in array) for compact Buy Now button
    const getPrimaryLink = (product) =>
        product.affiliateLinks?.[0] || null;

    return (
        <div className="my-8">
            <h3 className="section-title mb-4">
                Product <span>Comparison</span>
            </h3>
            <div className="table-scroll rounded-xl border border-white/[0.08]">
                <table className="w-full min-w-[640px] text-sm">
                    <thead>
                        <tr className="border-b border-white/[0.08] bg-white/[0.03]">
                            <th className="text-left px-4 py-3 text-gray-400 font-semibold w-36 min-w-[144px]">Spec</th>
                            {products.map((p) => (
                                <th key={p._id} className="text-center px-4 py-3 min-w-[160px]">
                                    <div className="flex flex-col items-center gap-1.5">
                                        {p.image?.url && (
                                            <Link to={`/products/${p.slug}`} className="block hover:opacity-80 transition-opacity">
                                                <img
                                                    src={buildCloudinaryUrl(p.image.url, { width: 80 })}
                                                    alt={p.name}
                                                    className="w-12 h-12 object-contain rounded-lg bg-white/5"
                                                    loading="lazy"
                                                />
                                            </Link>
                                        )}
                                        <Link
                                            to={`/products/${p.slug}`}
                                            className="font-semibold text-white text-xs hover:text-matrix transition-colors"
                                        >
                                            {p.name}
                                        </Link>
                                        {p.isBestValue && (
                                            <span className="badge-best-value">Best Value</span>
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {/* Price row */}
                        <tr className="border-b border-white/[0.05]">
                            <td className="px-4 py-3 text-gray-400 font-medium">Price</td>
                            {products.map((p) => (
                                <td key={p._id} className="px-4 py-3 text-center font-bold text-matrix">
                                    {p.price || '—'}
                                </td>
                            ))}
                        </tr>
                        {/* Rating row */}
                        <tr className="border-b border-white/[0.05]">
                            <td className="px-4 py-3 text-gray-400 font-medium">Rating</td>
                            {products.map((p) => (
                                <td key={p._id} className="px-4 py-3 text-center text-yellow-400">
                                    {'★'.repeat(Math.round(p.rating))}{'☆'.repeat(5 - Math.round(p.rating))}
                                    <span className="ml-1 text-gray-400 text-xs">({p.rating}/5)</span>
                                </td>
                            ))}
                        </tr>
                        {/* Dynamic spec rows */}
                        {allKeys.map((key, i) => (
                            <tr
                                key={key}
                                className={`border-b border-white/[0.05] ${i % 2 === 0 ? 'bg-white/[0.01]' : ''}`}
                            >
                                <td className="px-4 py-3 text-gray-400 font-medium capitalize">{key}</td>
                                {products.map((p) => (
                                    <td key={p._id} className="px-4 py-3 text-center text-gray-300">
                                        {getSpecValue(p, key)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                        {/* Buy row — primary store link + "More" link to product page */}
                        <tr>
                            <td className="px-4 py-3 text-gray-400 font-medium">Buy</td>
                            {products.map((p) => {
                                const primary = getPrimaryLink(p);
                                return (
                                    <td key={p._id} className="px-4 py-3 text-center">
                                        <div className="flex flex-col items-center gap-1.5">
                                            {primary ? (
                                                <a
                                                    href={`/go/${primary.shortCode}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer sponsored"
                                                    className="btn-matrix inline-flex text-xs"
                                                >
                                                    <ShoppingCart size={12} />
                                                    {primary.store}
                                                </a>
                                            ) : null}
                                            {/* Link to full product page for more store options */}
                                            <Link
                                                to={`/products/${p.slug}`}
                                                className="text-[10px] text-gray-500 hover:text-matrix flex items-center gap-0.5 transition-colors"
                                            >
                                                More stores <ExternalLink size={9} />
                                            </Link>
                                        </div>
                                    </td>
                                );
                            })}
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ComparisonTable;
