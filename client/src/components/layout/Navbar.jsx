import { Link } from 'react-router-dom';
import { Terminal, Cpu, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
    const [open, setOpen] = useState(false);
    const { user } = useAuth();

    const navLinks = [
        { label: 'Home', to: '/' },
        { label: 'Laptops', to: '/?category=laptops' },
        { label: 'Phones', to: '/?category=phones' },
        { label: 'Accessories', to: '/?category=accessories' },
    ];

    return (
        <header className="sticky top-0 z-50 border-b border-white/[0.06] backdrop-blur-xl bg-[#050505]/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2.5 group">
                        <div className="p-1.5 rounded-lg bg-matrix/10 border border-matrix/20 group-hover:bg-matrix/20 transition-all">
                            <Cpu size={18} className="text-matrix" />
                        </div>
                        <span className="font-bold text-lg tracking-tight">
                            Tech<span className="text-matrix">Affiliate</span>
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navLinks.map((l) => (
                            <Link
                                key={l.label}
                                to={l.to}
                                className="px-3 py-1.5 text-sm text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-all"
                            >
                                {l.label}
                            </Link>
                        ))}
                        {user ? (
                            <Link to="/admin/dashboard" className="btn-matrix ml-2">
                                <Terminal size={15} />
                                Dashboard
                            </Link>
                        ) : null}
                    </nav>

                    {/* Mobile hamburger */}
                    <button
                        onClick={() => setOpen(!open)}
                        className="md:hidden p-2 text-gray-400 hover:text-white rounded-lg"
                        aria-label="Toggle menu"
                    >
                        {open ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {open && (
                <div className="md:hidden px-4 pb-4 space-y-1 border-t border-white/[0.06] bg-[#050505]/95">
                    {navLinks.map((l) => (
                        <Link
                            key={l.label}
                            to={l.to}
                            onClick={() => setOpen(false)}
                            className="block px-3 py-2 text-sm text-gray-400 hover:text-white rounded-lg hover:bg-white/5"
                        >
                            {l.label}
                        </Link>
                    ))}
                    {user && (
                        <Link to="/admin/dashboard" onClick={() => setOpen(false)} className="btn-matrix mt-2 w-full justify-center">
                            <Terminal size={15} />
                            Dashboard
                        </Link>
                    )}
                </div>
            )}
        </header>
    );
};

export default Navbar;
