import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import authService from '../services/authService';
import { Shield, Mail, Lock } from 'lucide-react';
import env from '../config/env';

export default function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setLoading(true);

        try {
            await authService.login(formData.email, formData.password);
            navigate('/dashboard');
        } catch (error) {
            setErrors({
                general: error.response?.data?.message || 'Invalid credentials. Please try again.',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">
            {/* Subtle grid background */}
            <div className="fixed inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_110%)]" />

            <div className="w-full max-w-md relative z-10">
                {/* Logo */}
                <Link to="/" className="flex items-center justify-center gap-3 mb-12">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg shadow-white/20">
                        <Shield className="w-7 h-7 text-black" />
                    </div>
                    <span className="text-3xl font-bold text-white tracking-tight">{env.appName}</span>
                </Link>

                {/* Login Card */}
                <div className="bg-zinc-950/90 backdrop-blur-2xl border border-zinc-800/50 rounded-3xl shadow-2xl shadow-black/50 p-10 relative overflow-hidden">
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

                    <div className="relative z-10">
                        <h2 className="text-4xl font-bold text-white mb-3 tracking-tight">Welcome Back</h2>
                        <p className="text-zinc-400 mb-10 text-lg">Sign in to your account to continue</p>

                        {errors.general && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-300 px-5 py-4 rounded-xl mb-8">
                                {errors.general}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <Input
                                label="Email Address"
                                type="email"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                error={errors.email}
                                required
                                icon={<Mail className="w-5 h-5" />}
                            />

                            <Input
                                label="Password"
                                type="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                error={errors.password}
                                required
                                icon={<Lock className="w-5 h-5" />}
                            />

                            <div className="flex items-center justify-between pt-2">
                                <label className="flex items-center group cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="rounded border-zinc-700 bg-zinc-900 text-white focus:ring-white focus:ring-offset-black transition-all"
                                    />
                                    <span className="ml-3 text-sm text-zinc-400 group-hover:text-zinc-300 transition-colors">Remember me</span>
                                </label>
                                <Link to="/forgot-password" className="text-sm text-white hover:text-zinc-300 font-medium transition-colors">
                                    Forgot password?
                                </Link>
                            </div>

                            <Button
                                type="submit"
                                className="w-full mt-8"
                                size="lg"
                                disabled={loading}
                            >
                                {loading ? 'Signing in...' : 'Sign In'}
                            </Button>
                        </form>

                        <div className="mt-10 text-center">
                            <p className="text-zinc-400">
                                Don't have an account?{' '}
                                <Link to="/signup" className="text-white hover:text-zinc-300 font-semibold transition-colors">
                                    Sign up for free
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Security Badge */}
                <div className="mt-8 text-center text-zinc-600 text-sm">
                    <p className="flex items-center justify-center gap-2">
                        <Lock className="w-4 h-4" />
                        Secured with enterprise-grade encryption
                    </p>
                </div>
            </div>
        </div>
    );
}
