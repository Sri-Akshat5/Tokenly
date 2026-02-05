import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { Shield, Loader2, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';
import env from '../config/env';

export default function MagicLinkVerify() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('verifying'); // verifying, success, error
    const [error, setError] = useState('');

    useEffect(() => {
        const verifyToken = async () => {
            const token = searchParams.get('token');
            const appId = searchParams.get('appId'); // We need appId to know which context to login to

            if (!token || !appId) {
                setStatus('error');
                setError('Missing token or application ID.');
                return;
            }

            try {
                const response = await authService.userLogin(appId, { magicToken: token });
                setStatus('success');
                // Store token and redirect after a short delay
                setTimeout(() => {
                    // Redirect to a dashboard or configured success URL
                    alert('Authenticated! Token: ' + response.data.accessToken.substring(0, 10) + '...');
                }, 2000);
            } catch (err) {
                setStatus('error');
                setError(err.response?.data?.message || 'Invalid or expired magic link.');
            }
        };

        verifyToken();
    }, [searchParams, navigate]);

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">
            {/* Ambient Background */}
            <div className="fixed inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_110%)]" />

            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[120px] opacity-20 pointer-events-none ${status === 'success' ? 'bg-green-500' : 'bg-blue-500'}`} />

            <div className="w-full max-w-md relative z-10">
                <div className="bg-zinc-950/90 backdrop-blur-2xl border border-zinc-800/50 rounded-3xl shadow-2xl p-10 text-center">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-xl">
                        <Shield className="w-10 h-10 text-black" />
                    </div>

                    {status === 'verifying' && (
                        <div className="space-y-6">
                            <div className="relative w-12 h-12 mx-auto">
                                <Loader2 className="w-12 h-12 text-white animate-spin absolute inset-0" />
                                <div className="w-12 h-12 border-4 border-zinc-800 rounded-full" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-2">Verifying Magic Link</h2>
                                <p className="text-zinc-500">Please wait while we secure your session...</p>
                            </div>
                        </div>
                    )}

                    {status === 'success' && (
                        <div className="space-y-6">
                            <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-2xl flex items-center justify-center mx-auto">
                                <CheckCircle2 className="w-10 h-10" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-2">Authenticated!</h2>
                                <p className="text-zinc-500">Your magic link has been verified. You're being redirected to your dashboard...</p>
                            </div>
                            <Loader2 className="w-6 h-6 text-zinc-500 animate-spin mx-auto mt-4" />
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="space-y-6">
                            <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mx-auto">
                                <AlertCircle className="w-10 h-10" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-2">Verification Failed</h2>
                                <p className="text-zinc-500 leading-relaxed">{error}</p>
                            </div>
                            <div className="pt-4">
                                <Button
                                    className="w-full h-12 group"
                                    onClick={() => navigate('/login')}
                                >
                                    Try signing in again
                                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </div>
                        </div>
                    )}

                    <div className="mt-12 flex items-center justify-center gap-2 text-zinc-600">
                        <Shield className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-widest">{env.securedByText}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
