import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import env from '../config/env';

export default function EmailVerified() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const status = searchParams.get('status'); // success or error
    const message = searchParams.get('message');
    const [loading, setLoading] = useState(true);
    const [countdown, setCountdown] = useState(5);

    const isSuccess = status === 'success';

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (loading) return;

        const interval = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    handleAutoAction();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [loading]);

    const handleAutoAction = () => {
        if (window.opener || window.history.length === 1) {
            window.close();
            // Fallback if window.close() is blocked
            setTimeout(() => navigate('/login'), 1000);
        } else {
            navigate('/login');
        }
    };

    const handleClose = () => {
        window.close();
        // Fallback
        setTimeout(() => navigate('/login'), 500);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
        );
    }

    return (
        <div className={`min-h-screen flex items-center justify-center p-6 relative overflow-hidden transition-colors duration-1000 ${isSuccess ? 'bg-green-950/20' : 'bg-red-950/20'}`}>
            {/* Background Base */}
            <div className="fixed inset-0 bg-[#09090b]" />

            {/* Dynamic Ambient Glows */}
            <div className={`absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full blur-[150px] opacity-20 animate-pulse pointer-events-none transition-colors duration-1000 ${isSuccess ? 'bg-green-500' : 'bg-red-500'}`} />
            <div className={`absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full blur-[150px] opacity-20 animate-pulse pointer-events-none transition-colors duration-1000 delay-700 ${isSuccess ? 'bg-emerald-500' : 'bg-rose-500'}`} />

            {/* Mesh Grid */}
            <div className="fixed inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

            <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in duration-700">
                <div className="bg-zinc-950/80 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] p-12 text-center overflow-hidden">
                    {/* Status Icon */}
                    <div className={`w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-10 relative group`}>
                        <div className={`absolute inset-0 rounded-3xl blur-2xl opacity-40 group-hover:opacity-60 transition-opacity ${isSuccess ? 'bg-green-500' : 'bg-red-500'}`} />
                        <div className={`relative w-full h-full rounded-3xl flex items-center justify-center border-2 ${isSuccess ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                            {isSuccess ? <CheckCircle2 className="w-12 h-12" /> : <XCircle className="w-12 h-12" />}
                        </div>
                    </div>

                    <h1 className="text-4xl font-bold text-white tracking-tight mb-4">
                        {isSuccess ? 'Verification Successful' : 'Verification Failed'}
                    </h1>

                    <p className="text-zinc-400 text-lg mb-10 leading-relaxed font-medium">
                        {isSuccess
                            ? 'Your email has been verified. This window will automatically close in '
                            : (message || 'The verification link is invalid or has already expired. ')}
                        {isSuccess && <span className={`font-bold ${isSuccess ? 'text-green-400' : 'text-red-400'}`}>{countdown}s</span>}
                    </p>

                    <div className="space-y-4">
                        <Button
                            className={`w-full h-14 text-lg font-semibold group rounded-2xl ${isSuccess ? 'bg-green-600 hover:bg-green-500' : 'bg-red-600 hover:bg-red-500'}`}
                            onClick={() => navigate('/login')}
                        >
                            <span className="flex items-center justify-center gap-2">
                                {isSuccess ? 'Go to Dashboard' : 'Back to Login'}
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </Button>

                        <button
                            onClick={handleClose}
                            className="w-full h-14 rounded-2xl border border-white/5 bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2 text-sm font-medium"
                        >
                            <Minimize2 className="w-4 h-4" />
                            Close This Window
                        </button>
                    </div>

                    <div className="mt-16 pt-8 border-t border-white/5 flex flex-col items-center gap-4">
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
