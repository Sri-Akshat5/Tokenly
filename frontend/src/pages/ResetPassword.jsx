import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Shield, Lock, Eye, EyeOff, Loader2, CheckCircle2, ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import authService from '../services/authService';
import env from '../config/env';

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [status, setStatus] = useState('form'); // form, loading, success, error
    const [error, setError] = useState('');

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setError('Missing or invalid reset token.');
        }
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        if (!passwordRegex.test(password)) {
            setError('Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setError('');
        setStatus('loading');

        try {
            await authService.resetPassword({ token, newPassword: password });
            setStatus('success');
        } catch (err) {
            setStatus('form');
            setError(err.response?.data?.message || 'Failed to reset password. The link may be expired.');
        }
    };

    const isSuccess = status === 'success';

    return (
        <div className={`min-h-screen flex items-center justify-center p-6 relative overflow-hidden transition-colors duration-1000 ${isSuccess ? 'bg-green-950/20' : 'bg-black'}`}>
            {/* Background Base */}
            <div className="fixed inset-0 bg-[#09090b]" />

            {/* Dynamic Ambient Glows */}
            <div className={`absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full blur-[150px] opacity-20 animate-pulse pointer-events-none transition-colors duration-1000 ${isSuccess ? 'bg-green-500' : 'bg-white/10'}`} />
            <div className={`absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full blur-[150px] opacity-20 animate-pulse pointer-events-none transition-colors duration-1000 delay-700 ${isSuccess ? 'bg-emerald-500' : 'bg-white/5'}`} />

            {/* Mesh Grid */}
            <div className="fixed inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

            <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in duration-700">
                <div className="bg-zinc-950/80 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] p-12 overflow-hidden">
                    {isSuccess ? (
                        <div className="text-center">
                            <div className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-10 relative group">
                                <div className="absolute inset-0 rounded-3xl blur-2xl opacity-40 bg-green-500" />
                                <div className="relative w-full h-full rounded-3xl flex items-center justify-center border-2 bg-green-500/10 border-green-500/20 text-green-400">
                                    <CheckCircle2 className="w-12 h-12" />
                                </div>
                            </div>
                            <h1 className="text-4xl font-bold text-white tracking-tight mb-4">Password Updated!</h1>
                            <p className="text-zinc-400 text-lg mb-10 leading-relaxed font-medium">Your password has been successfully reset. You can now use your new credentials to sign in.</p>
                            <Button className="w-full h-14 text-lg font-semibold group rounded-2xl bg-green-600 hover:bg-green-500" onClick={() => navigate('/login')}>
                                <span className="flex items-center justify-center gap-2">
                                    Return to Login
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </Button>
                        </div>
                    ) : (
                        <>
                            <div className="text-center mb-10">
                                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]">
                                    <Shield className="w-10 h-10 text-black" />
                                </div>
                                <h1 className="text-3xl font-bold text-white tracking-tight">Protect Your Account</h1>
                                <p className="text-zinc-500 mt-2 font-medium">Choose a strong, unique password for your security</p>
                            </div>

                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-5 py-4 rounded-2xl mb-8 text-sm animate-in slide-in-from-top-2">
                                    {error}
                                </div>
                            )}

                            {status === 'error' ? (
                                <Button className="w-full h-14 rounded-2xl" onClick={() => navigate('/login')}>
                                    Back to Login
                                </Button>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="relative">
                                        <Input
                                            label="New Password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            icon={<Lock className="w-5 h-5" />}
                                            required
                                            className="h-14 bg-white/5 border-white/5 rounded-2xl"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-5 top-[50px] text-zinc-500 hover:text-white transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>

                                    <Input
                                        label="Confirm Password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        icon={<Lock className="w-5 h-5" />}
                                        required
                                        className="h-14 bg-white/5 border-white/5 rounded-2xl"
                                    />

                                    <Button
                                        className="w-full h-14 rounded-2xl text-lg font-semibold mt-4 shadow-xl"
                                        loading={status === 'loading'}
                                        disabled={!password || !confirmPassword}
                                    >
                                        Update Password
                                    </Button>
                                </form>
                            )}
                        </>
                    )}

                    <div className="mt-16 pt-8 border-t border-white/5 flex flex-col items-center">
                        <div className="flex items-center gap-2 text-zinc-500">
                            <Shield className="w-4 h-4 text-zinc-400" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">{env.securedByText}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
