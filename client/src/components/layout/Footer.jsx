import { Cpu, Github, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => (
    <footer className="border-t border-white/[0.06] mt-24 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <Link to="/" className="flex items-center gap-2">
                    <Cpu size={16} className="text-matrix" />
                    <span className="font-bold text-sm">Tech<span className="text-matrix">Affiliate</span></span>
                </Link>
                <p className="text-xs text-gray-600 text-center">
                    © {new Date().getFullYear()} TechAffiliate. Affiliate links earn us commissions at no extra cost to you.
                </p>
                <div className="flex gap-3">
                    <a href="https://github.com" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-matrix transition-colors" aria-label="GitHub">
                        <Github size={18} />
                    </a>
                    <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-matrix transition-colors" aria-label="Twitter">
                        <Twitter size={18} />
                    </a>
                </div>
            </div>
        </div>
    </footer>
);

export default Footer;
