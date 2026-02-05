import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import authService from '../services/authService';
import { Shield, Mail, Lock, User, CheckCircle } from 'lucide-react';
import env from '../config/env';

export default function Signup() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const validateForm = () => {
        const newErrors = {};

        if (formData.name.length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        }

        if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});
        setLoading(true);

        try {
            await authService.signup({
                companyName: formData.name,
                email: formData.email,
                password: formData.password,
            });
            navigate('/login');
        } catch (error) {
            setErrors({
                general: error.response?.data?.message || 'Signup failed. Please try again.',
            });
        } finally {
            setLoading(false);
        }
    };

    const getPasswordStrength = () => {
        const password = formData.password;
        if (password.length === 0) return { strength: 0, label: '', color: '' };
        if (password.length < 8) return { strength: 25, label: 'Weak', color: 'bg-zinc-700' };
        if (password.length < 12) return { strength: 50, label: 'Fair', color: 'bg-zinc-600' };
        if (password.length < 16) return { strength: 75, label: 'Good', color: 'bg-zinc-400' };
        return { strength: 100, label: 'Strong', color: 'bg-white' };
    };

    const passwordStrength = getPasswordStrength();

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

                {/* Signup Card */}
                <div className="bg-zinc-950/90 backdrop-blur-2xl border border-zinc-800/50 rounded-3xl shadow-2xl shadow-black/50 p-10 relative overflow-hidden">
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

                    <div className="relative z-10">
                        <h2 className="text-4xl font-bold text-white mb-3 tracking-tight">Create Account</h2>
                        <p className="text-zinc-400 mb-10 text-lg">Start building authentication today</p>

                        {errors.general && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-300 px-5 py-4 rounded-xl mb-8">
                                {errors.general}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <Input
                                label="Full Name"
                                type="text"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                error={errors.name}
                                required
                                icon={<User className="w-5 h-5" />}
                            />

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

                            <div>
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
                                {formData.password && (
                                    <div className="mt-3">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs text-zinc-500 font-medium">Password strength</span>
                                            <span className={`text-xs font-semibold ${passwordStrength.label === 'Strong' ? 'text-white' :
                                                passwordStrength.label === 'Good' ? 'text-zinc-300' :
                                                    passwordStrength.label === 'Fair' ? 'text-zinc-400' :
                                                        'text-zinc-500'
                                                }`}>
                                                {passwordStrength.label}
                                            </span>
                                        </div>
                                        <div className="h-2 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800/50">
                                            <div
                                                className={`h-full ${passwordStrength.color} transition-all duration-500 ease-out`}
                                                style={{ width: `${passwordStrength.strength}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <Input
                                label="Confirm Password"
                                type="password"
                                placeholder="••••••••"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                error={errors.confirmPassword}
                                required
                                icon={<CheckCircle className="w-5 h-5" />}
                            />

                            <div className="flex items-start pt-2">
                                <input
                                    type="checkbox"
                                    required
                                    className="mt-1 rounded border-zinc-700 bg-zinc-900 text-white focus:ring-white focus:ring-offset-black transition-all"
                                />
                                <span className="ml-3 text-sm text-zinc-400 leading-relaxed">
                                    I agree to the{' '}
                                    <Link to="/terms" className="text-white hover:text-zinc-300 font-medium transition-colors">
                                        Terms of Service
                                    </Link>
                                    {' '}and{' '}
                                    <Link to="/privacy" className="text-white hover:text-zinc-300 font-medium transition-colors">
                                        Privacy Policy
                                    </Link>
                                </span>
                            </div>

                            <Button
                                type="submit"
                                className="w-full mt-8"
                                size="lg"
                                disabled={loading}
                            >
                                {loading ? 'Creating Account...' : 'Create Account'}
                            </Button>
                        </form>

                        <div className="mt-10 text-center">
                            <p className="text-zinc-400">
                                Already have an account?{' '}
                                <Link to="/login" className="text-white hover:text-zinc-300 font-semibold transition-colors">
                                    Sign in
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
