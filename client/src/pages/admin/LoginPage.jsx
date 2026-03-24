import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Terminal, Lock, Mail } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import SEOHead from '../../components/ui/SEOHead';
import Spinner from '../../components/ui/Spinner';

const LoginPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(form);
            navigate('/admin/dashboard');
        } catch (err) {
            setError(err.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <SEOHead title="Admin Login" />
            <div className="min-h-screen flex items-center justify-center px-4 bg-[#050505]">
                <div className="glass-card w-full max-w-sm p-8">
                    {/* Logo */}
                    <div className="flex items-center gap-2 mb-8">
                        <div className="p-2 bg-matrix/10 border border-matrix/20 rounded-lg">
                            <Terminal size={20} className="text-matrix" />
                        </div>
                        <span className="font-bold text-lg">Admin <span className="text-matrix">Panel</span></span>
                    </div>

                    <h1 className="text-xl font-bold text-white mb-1">Welcome back</h1>
                    <p className="text-sm text-gray-500 mb-6">Sign in to your admin account.</p>

                    {error && (
                        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1.5">Email</label>
                            <div className="relative">
                                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    placeholder="admin@example.com"
                                    className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder-gray-600 focus:outline-none focus:border-matrix/40 focus:ring-1 focus:ring-matrix/20 transition-all"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1.5">Password</label>
                            <div className="relative">
                                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input
                                    id="password"
                                    type="password"
                                    required
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    placeholder="••••••••"
                                    className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder-gray-600 focus:outline-none focus:border-matrix/40 focus:ring-1 focus:ring-matrix/20 transition-all"
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-matrix w-full justify-center mt-2 disabled:opacity-60"
                        >
                            {loading ? <Spinner size={16} /> : <Lock size={15} />}
                            {loading ? 'Signing in…' : 'Sign In'}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default LoginPage;
