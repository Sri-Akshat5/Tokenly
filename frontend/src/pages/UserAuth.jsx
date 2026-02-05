import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import authService from '../services/authService';
import { Shield, Mail, Lock, Key, ArrowRight, Loader2 } from 'lucide-react';

export default function UserAuth() {
    const { appId } = useParams();
    const navigate = useNavigate();

    const [appConfig, setAppConfig] = useState(null);
    const [loading, setLoading] = useState(true);
    const [authStep, setAuthStep] = useState('identify'); // identify, verify, success
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        const fetchAppInfo = async () => {
            try {
                const response = await authService.getAppInfo(appId);
                setAppConfig(response.data);
            } catch (err) {
                setError('Failed to load application configuration.');
            } finally {
                setLoading(false);
            }
        };
        fetchAppInfo();
    }, [appId]);

    const handleIdentify = async (e) => {
        e.preventDefault();
        setError('');
        setActionLoading(true);

        try {
            if (appConfig.loginMethod === 'PASSWORD') {
                // For password, we just need the password field to show up or proceed if email is entered
                setAuthStep('verify');
            } else if (appConfig.loginMethod === 'OTP') {
                await authService.requestOtp(appId, email);
                setAuthStep('verify');
            } else if (appConfig.loginMethod === 'MAGIC_LINK') {
                await authService.requestMagicLink(appId, email);
                setAuthStep('success'); // Link sent
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setActionLoading(false);
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        setError('');
        setActionLoading(true);

        try {
            const loginData = { email };
            if (appConfig.loginMethod === 'PASSWORD') loginData.password = password;
            if (appConfig.loginMethod === 'OTP') loginData.otpCode = otp;

            const response = await authService.userLogin(appId, loginData);
            // Handle redirect based on where they should go (callback URL or default dashboard)
            // For now, let's just show a success or store and notify
            alert('Login Successful! Access Token: ' + response.data.accessToken.substring(0, 10) + '...');
        } catch (err) {
            setError(err.response?.data?.message || 'Verification failed. Please check your credentials.');
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
        );
    }

    if (error && !appConfig) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-6 text-center">
                <div className="max-w-md">
                    <Shield className="w-16 h-16 text-red-500 mx-auto mb-6" />
                    <h1 className="text-2xl font-bold text-white mb-2">Invalid Application</h1>
                    <p className="text-zinc-500">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">
            <div className="fixed inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_110%)]" />

            <div className="w-full max-w-md relative z-10">
                <div className="bg-zinc-950/90 backdrop-blur-2xl border border-zinc-800/50 rounded-3xl shadow-2xl p-10">
                    <div className="text-center mb-10">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-white/10">
                            <Shield className="w-10 h-10 text-black" />
                        </div>
                        <h2 className="text-3xl font-bold text-white tracking-tight">Sign In</h2>
                        <p className="text-zinc-500 mt-2">Continue to access the application</p>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm">
                            {error}
                        </div>
                    )}

                    {authStep === 'identify' && (
                        <form onSubmit={handleIdentify} className="space-y-6">
                            <Input
                                label="Email"
                                type="email"
                                placeholder="name@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                icon={<Mail className="w-5 h-5" />}
                                required
                            />
                            <Button className="w-full h-12" loading={actionLoading}>
                                {appConfig.loginMethod === 'PASSWORD' ? 'Continue' : 'Get Sign-in Link'}
                            </Button>
                        </form>
                    )}

                    {authStep === 'verify' && (
                        <form onSubmit={handleVerify} className="space-y-6">
                            <div className="mb-4">
                                <p className="text-sm text-zinc-400">Authenticating as <span className="text-white font-medium">{email}</span></p>
                                <button type="button" onClick={() => setAuthStep('identify')} className="text-xs text-zinc-500 hover:text-white underline mt-1">Not you?</button>
                            </div>

                            {appConfig.loginMethod === 'PASSWORD' && (
                                <Input
                                    label="Password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    icon={<Lock className="w-5 h-5" />}
                                    required
                                />
                            )}

                            {appConfig.loginMethod === 'OTP' && (
                                <Input
                                    label="Verification Code"
                                    placeholder="6-digit code"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    icon={<Key className="w-5 h-5" />}
                                    required
                                />
                            )}

                            <Button className="w-full h-12" loading={actionLoading}>
                                Sign In
                            </Button>
                        </form>
                    )}

                    {authStep === 'success' && (
                        <div className="text-center py-4">
                            <div className="w-12 h-12 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Mail className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">Check your email</h3>
                            <p className="text-zinc-500 mb-8">We've sent a magic link to <span className="text-white">{email}</span>. Click the link to sign in instantly.</p>
                            <Button variant="secondary" onClick={() => setAuthStep('identify')} className="w-full">
                                Use a different email
                            </Button>
                        </div>
                    )}

                    {appConfig.googleClientId && authStep === 'identify' && (
                        <>
                            <div className="relative my-8">
                                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-800"></div></div>
                                <div className="relative flex justify-center text-xs uppercase"><span className="bg-zinc-950 px-2 text-zinc-500 font-bold tracking-widest">Or continue with</span></div>
                            </div>
                            <button className="w-full bg-white text-black h-12 rounded-xl font-semibold flex items-center justify-center gap-3 hover:bg-zinc-200 transition-colors shadow-lg">
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.27.81-.57z" />
                                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                Sign in with Google
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
