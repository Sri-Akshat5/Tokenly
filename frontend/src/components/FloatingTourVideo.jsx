import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, X, Play, Maximize } from 'lucide-react';

export default function FloatingTourVideo() {
    const [isVisible, setIsVisible] = useState(true);
    const [isMuted, setIsMuted] = useState(true);
    const [isMinimized, setIsMinimized] = useState(false);
    const videoRef = useRef(null);

    // Ensure video plays on mount (muted)
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.muted = true;
            videoRef.current.play().catch(err => console.log("Video auto-play failed:", err));
        }
    }, []);

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !videoRef.current.muted;
            setIsMuted(videoRef.current.muted);
        }
    };

    const toggleFullscreen = () => {
        if (videoRef.current) {
            if (videoRef.current.requestFullscreen) {
                videoRef.current.requestFullscreen();
            } else if (videoRef.current.webkitRequestFullscreen) {
                videoRef.current.webkitRequestFullscreen();
            } else if (videoRef.current.msRequestFullscreen) {
                videoRef.current.msRequestFullscreen();
            }
        }
    };

    if (!isVisible) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className={`fixed bottom-6 right-6 z-[9999] group shadow-2xl overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/80 backdrop-blur-xl transition-all duration-500 ${isMinimized ? 'w-12 h-12 rounded-full' : 'w-72 md:w-80 aspect-video'
                    }`}
            >
                {isMinimized ? (
                    <button
                        onClick={() => setIsMinimized(false)}
                        className="w-full h-full flex items-center justify-center text-white bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
                    >
                        <Play className="w-5 h-5 fill-current" />
                    </button>
                ) : (
                    <>
                        {/* Video Element */}
                        <video
                            ref={videoRef}
                            className="w-full h-full object-cover rounded-2xl cursor-pointer"
                            loop
                            playsInline
                            muted={isMuted}
                            onClick={toggleMute}
                        >
                            <source src="/Video/tour-video.mp4" type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>

                        {/* Top Controls Overlay */}
                        <div className="absolute top-0 inset-x-0 p-3 flex justify-between items-start opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                            <div className="bg-black/50 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                                <span className="text-[10px] font-bold text-white uppercase tracking-widest">Platform Tour</span>
                            </div>

                            <div className="flex gap-2 pointer-events-auto">
                                <button
                                    onClick={() => setIsMinimized(true)}
                                    className="p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-lg border border-white/10 transition-colors cursor-pointer"
                                    title="Minimize"
                                >
                                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                        <line x1="5" y1="12" x2="19" y2="12" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => setIsVisible(false)}
                                    className="p-1.5 bg-black/60 hover:bg-black/80 text-red-400 rounded-lg border border-white/10 transition-colors cursor-pointer"
                                    title="Close"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        </div>

                        {/* Bottom Bar Overlay */}
                        <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 to-transparent pointer-events-none">
                            <div className="flex items-center justify-between pointer-events-auto">
                                <button
                                    onClick={toggleMute}
                                    className="flex items-center gap-2 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md border border-white/10 transition-all hover:scale-105 cursor-pointer"
                                >
                                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                                    <span className="text-[10px] font-bold uppercase tracking-wider pr-1">
                                        {isMuted ? 'Unmute' : 'Muted'}
                                    </span>
                                </button>

                                <button
                                    onClick={toggleFullscreen}
                                    className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md border border-white/10 transition-all hover:scale-105 cursor-pointer"
                                    title="Full Screen"
                                >
                                    <Maximize className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Interaction Hint (Only when muted) */}
                        {isMuted && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                            >
                                <div className="bg-black/40 backdrop-blur-sm p-4 rounded-full border border-white/10 animate-pulse">
                                    <VolumeX className="w-8 h-8 text-white/50" />
                                </div>
                            </motion.div>
                        )}
                    </>
                )}
            </motion.div>
        </AnimatePresence>
    );
}
