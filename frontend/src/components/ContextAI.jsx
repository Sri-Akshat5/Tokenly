import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Sparkles,
    X,
    Copy,
    Check,
    ArrowUpRight,
    Quote,
    AlertCircle,
    Send,
    RotateCcw
} from 'lucide-react';
import {
    queryContextAI,
    sanitizeSelection,
    MAX_SELECTION_LENGTH,
    MIN_SELECTION_LENGTH
} from '../services/contextai';
import logo from '/favicon.png';


function formatInline(text) {
    if (!text) return '';
    return text
        // Bold: **text**
        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
        // Inline code: `code`
        .replace(/`([^`]+)`/g, '<code class="px-1 py-0.5 rounded bg-zinc-800 text-indigo-300 font-mono text-[10px] border border-zinc-700/50">$1</code>')
        // Italic: *text* (when not part of a bullet)
        .replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em class="text-zinc-400">$1</em>');
}

function CompactMarkdownRenderer({ content }) {
    if (!content || content.trim() === '') {
        return <p className="text-xs text-zinc-400 py-1">Please try again later.</p>;
    }

    // Split sections by double or triple newlines
    const sections = content.split(/\n{2,}/);

    return (
        <div className="space-y-2 text-xs text-zinc-300 leading-relaxed font-sans">
            {sections.map((section, secIdx) => {
                const trimmed = section.trim();
                if (!trimmed) return null;

                // Code block (``` ... ```)
                if (trimmed.startsWith('```')) {
                    const code = trimmed.replace(/^```[a-zA-Z]*\n?/, '').replace(/```$/, '').trim();
                    return (
                        <div key={secIdx} className="rounded-lg bg-zinc-950 border border-zinc-800/80 p-2.5 my-1.5 font-mono text-[11px] text-indigo-200 overflow-x-auto">
                            <pre><code>{code}</code></pre>
                        </div>
                    );
                }

                // Headings (### or ## or #)
                if (/^#{1,3}\s+/.test(trimmed)) {
                    const headingText = trimmed.replace(/^#{1,3}\s+/, '');
                    return (
                        <div key={secIdx} className="font-semibold text-white pt-1 flex items-center gap-1.5 text-xs">
                            <span className="w-1 h-3 bg-gradient-to-b from-pink-500 to-indigo-500 rounded-full inline-block shrink-0" />
                            <span dangerouslySetInnerHTML={{ __html: formatInline(headingText) }} />
                        </div>
                    );
                }

                // Parse line by line to support mixed paragraphs and bullet items
                const lines = trimmed.split('\n');
                const elements = [];
                let currentBullets = [];

                const flushBullets = (keyPrefix) => {
                    if (currentBullets.length > 0) {
                        elements.push(
                            <ul key={`${keyPrefix}-ul`} className="space-y-1.5 pl-0.5 my-1">
                                {currentBullets.map((bullet, bIdx) => (
                                    <li key={bIdx} className="flex items-start gap-1.5 text-zinc-300">
                                        <span className="text-pink-400 mt-1 text-[9px] shrink-0">✦</span>
                                        <span dangerouslySetInnerHTML={{ __html: formatInline(bullet) }} />
                                    </li>
                                ))}
                            </ul>
                        );
                        currentBullets = [];
                    }
                };

                lines.forEach((line, lineIdx) => {
                    const trimmedLine = line.trim();
                    if (!trimmedLine) return;

                    // Bullet item: starts with "* ", "- ", "• "
                    if (/^[*•-]\s+/.test(trimmedLine)) {
                        const bulletContent = trimmedLine.replace(/^[*•-]\s+/, '');
                        currentBullets.push(bulletContent);
                    } else if (/^\d+\.\s+/.test(trimmedLine)) {
                        // Numbered list item
                        flushBullets(`${secIdx}-${lineIdx}`);
                        const num = trimmedLine.match(/^\d+/)[0];
                        const itemContent = trimmedLine.replace(/^\d+\.\s+/, '');
                        elements.push(
                            <div key={`num-${lineIdx}`} className="flex items-start gap-1.5 pl-0.5 my-1">
                                <span className="text-[10px] font-mono font-bold text-zinc-400 shrink-0 bg-zinc-800/80 px-1 rounded">
                                    {num}.
                                </span>
                                <span dangerouslySetInnerHTML={{ __html: formatInline(itemContent) }} />
                            </div>
                        );
                    } else {
                        // Standard paragraph or introductory text
                        flushBullets(`${secIdx}-${lineIdx}`);
                        elements.push(
                            <p
                                key={`p-${lineIdx}`}
                                className="text-zinc-200"
                                dangerouslySetInnerHTML={{ __html: formatInline(trimmedLine) }}
                            />
                        );
                    }
                });

                flushBullets(`${secIdx}-end`);

                return (
                    <div key={secIdx} className="space-y-1">
                        {elements}
                    </div>
                );
            })}
        </div>
    );
}

export default function ContextAI() {
    const [selectedText, setSelectedText] = useState('');
    const [activeQuery, setActiveQuery] = useState('');
    const [isTruncated, setIsTruncated] = useState(false);
    const [selectionCoords, setSelectionCoords] = useState(null);

    // States: 'idle' | 'trigger' | 'card'
    const [viewMode, setViewMode] = useState('idle');
    const [isLoading, setIsLoading] = useState(false);
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);
    const [isCopied, setIsCopied] = useState(false);
    const [customQuery, setCustomQuery] = useState('');

    const containerRef = useRef(null);
    const isInteractingRef = useRef(false);

    // Track text selections
    const handleSelection = useCallback(() => {
        // If user is currently viewing the card or typing in it, don't auto-dismiss
        if (viewMode === 'card' || isInteractingRef.current) {
            return;
        }

        const selection = window.getSelection();
        if (!selection || selection.isCollapsed || selection.rangeCount === 0) {
            if (viewMode === 'trigger') {
                setViewMode('idle');
            }
            return;
        }

        const rawText = selection.toString().trim();
        if (rawText.length < MIN_SELECTION_LENGTH) {
            if (viewMode === 'trigger') {
                setViewMode('idle');
            }
            return;
        }

        const { sanitizedQuery, isTruncated: truncated } = sanitizeSelection(rawText);
        setSelectedText(sanitizedQuery);
        setActiveQuery(sanitizedQuery);
        setIsTruncated(truncated);

        try {
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();

            const cardWidth = Math.min(390, window.innerWidth - 32);

            // Calculate horizontal position centered on selection
            let left = rect.left + window.scrollX + (rect.width / 2) - (cardWidth / 2);
            left = Math.max(16, Math.min(window.innerWidth - cardWidth - 16, left));

            // Position below if space permits, else above
            const spaceBelow = window.innerHeight - rect.bottom;
            let top;
            let placement = 'bottom';

            if (spaceBelow > 320 || rect.top < 220) {
                top = rect.bottom + window.scrollY + 8;
                placement = 'bottom';
            } else {
                top = rect.top + window.scrollY - 8;
                placement = 'top';
            }

            setSelectionCoords({
                top,
                left,
                triggerTop: Math.max(10, rect.top + window.scrollY - 38),
                triggerLeft: Math.max(16, Math.min(window.innerWidth - 180, rect.left + window.scrollX + (rect.width / 2))),
                placement,
                cardWidth
            });

            setViewMode('trigger');
        } catch (e) {
            console.error(e);
        }
    }, [viewMode]);

    useEffect(() => {
        const onMouseUp = (e) => {
            if (containerRef.current && containerRef.current.contains(e.target)) {
                return;
            }
            setTimeout(handleSelection, 70);
        };

        const onKeyUp = (e) => {
            if (e.key === 'Escape') {
                closeAll();
            } else if (viewMode !== 'card') {
                setTimeout(handleSelection, 70);
            }
        };

        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                closeAll();
            }
        };

        document.addEventListener('mouseup', onMouseUp);
        document.addEventListener('touchend', onMouseUp);
        document.addEventListener('keyup', onKeyUp);
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mouseup', onMouseUp);
            document.removeEventListener('touchend', onMouseUp);
            document.removeEventListener('keyup', onKeyUp);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [handleSelection, viewMode]);

    const closeAll = () => {
        setViewMode('idle');
        setResponse(null);
        setError(null);
        setIsLoading(false);
    };

    const fetchExplanation = async (queryText) => {
        const text = queryText || activeQuery || selectedText;
        if (!text || text.length < MIN_SELECTION_LENGTH) return;

        setActiveQuery(text);
        setViewMode('card');
        setIsLoading(true);
        setError(null);
        setResponse(null);

        try {
            const result = await queryContextAI(text);
            if (!result || !result.answer) {
                setError("Please try again later.");
            } else {
                setResponse(result);
            }
        } catch (err) {
            setError("Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = () => {
        if (!response?.answer) return;
        navigator.clipboard.writeText(response.answer);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 1800);
    };

    const handleCustomSubmit = (e) => {
        e.preventDefault();
        if (!customQuery.trim()) return;
        const q = customQuery.trim();
        setCustomQuery('');
        fetchExplanation(q);
    };

    return (
        <div
            ref={containerRef}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
        >
            {/* Small Selection Trigger Pill */}
            <AnimatePresence>
                {viewMode === 'trigger' && selectionCoords && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.85, y: 6 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.85, y: 6 }}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                        style={{
                            position: 'absolute',
                            top: `${selectionCoords.triggerTop}px`,
                            left: `${selectionCoords.triggerLeft}px`,
                            transform: 'translateX(-50%)',
                            zIndex: 9990,
                        }}
                    >
                        <button
                            type="button"
                            onClick={() => fetchExplanation(selectedText)}
                            className="group relative flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-950/95 border border-zinc-700/80 shadow-[0_8px_20px_rgba(0,0,0,0.7)] backdrop-blur-md hover:border-indigo-400 hover:shadow-[0_0_16px_rgba(99,102,241,0.4)] active:scale-95 transition-all duration-150 cursor-pointer"
                        >
                            {/* RGB Glowing Accent */}
                            <div className="absolute -inset-[1px] rounded-full  group-hover:opacity-100 blur-[1px] -z-10 animate-pulse" />

                            <Sparkles className="w-3.5 h-3.5 text-pink-400 animate-pulse" />
                            <span className="text-[11px] font-semibold text-white tracking-wide flex items-center gap-1">
                                Ask Tokenly AI
                                <ArrowUpRight className="w-3 h-3 text-zinc-400 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </span>

                            {isTruncated && (
                                <span className="text-[9px] font-mono px-1 py-0.2 bg-amber-500/20 text-amber-300 rounded border border-amber-500/30">
                                    {MAX_SELECTION_LENGTH}c
                                </span>
                            )}
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Nearby Floating AI Response Card (AWS-Style Popover with RGB Border) */}
            <AnimatePresence>
                {viewMode === 'card' && selectionCoords && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.92, y: selectionCoords.placement === 'top' ? 8 : -8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.92, y: selectionCoords.placement === 'top' ? 8 : -8 }}
                        transition={{ type: 'spring', damping: 26, stiffness: 360 }}
                        style={{
                            position: 'absolute',
                            top: `${selectionCoords.top}px`,
                            left: `${selectionCoords.left}px`,
                            transform: selectionCoords.placement === 'top' ? 'translateY(-100%)' : 'none',
                            width: `${selectionCoords.cardWidth}px`,
                            zIndex: 9999,
                        }}
                    >
                        {/* Outer RGB Glow Layer */}
                        <div className="rgb-border-glow" />

                        {/* Outer Card with RGB Border */}
                        <div className="rgb-border-card shadow-[0_20px_50px_rgba(0,0,0,0.85)]">
                            <div className="bg-zinc-950/98 backdrop-blur-2xl rounded-[1.15rem] p-3.5 flex flex-col border border-zinc-800/90 text-white">

                                {/* Compact Header */}
                                <div className="flex items-center justify-between pb-2 border-b border-zinc-800/80">
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-5 h-5 rounded-md p-[1px]">
                                            <div className="w-full h-full bg-zinc-950 rounded-[5px] flex items-center justify-center">
                                                <img src={logo} alt="" className='w-4 h-4 ' />
                                            </div>
                                        </div>
                                        <span className="text-xs font-bold text-white tracking-tight">
                                            Tokenly Context-Aware AI Assistance
                                        </span>

                                    </div>

                                    <div className="flex items-center gap-1">
                                        {response?.answer && response.answer !== "Please try again later." && (
                                            <button
                                                type="button"
                                                onClick={handleCopy}
                                                title="Copy Answer"
                                                className="p-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                                            >
                                                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                            </button>
                                        )}
                                        <button
                                            type="button"
                                            onClick={closeAll}
                                            title="Close"
                                            className="p-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-red-400 transition-colors cursor-pointer"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>

                                {/* Quoted Snippet Indicator */}
                                <div className="my-2 px-2 py-1.5 rounded-lg bg-zinc-900/70 border border-zinc-800/60 flex items-center gap-1.5">
                                    <Quote className="w-3 h-3 text-indigo-400 shrink-0 opacity-70" />
                                    <p className="text-[11px] text-zinc-300 truncate italic">
                                        "{activeQuery || selectedText}"
                                    </p>
                                </div>

                                {/* Response Area */}
                                <div className="max-h-[220px] min-h-[60px] overflow-y-auto pr-1 my-1">
                                    {isLoading && (
                                        <div className="py-4 space-y-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-pink-500 animate-ping" />
                                                <span className="text-[11px] font-mono text-indigo-300 animate-pulse">
                                                    Consulting Tokenly Intelligence...
                                                </span>
                                            </div>
                                            <div className="space-y-1.5 pt-1">
                                                <div className="h-3 bg-zinc-800/70 rounded w-full animate-pulse" />
                                                <div className="h-3 bg-zinc-800/70 rounded w-4/5 animate-pulse" />
                                                <div className="h-3 bg-zinc-800/70 rounded w-3/5 animate-pulse" />
                                            </div>
                                        </div>
                                    )}

                                    {error && (
                                        <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-center justify-between gap-2">
                                            <div className="flex items-center gap-2">
                                                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                                                <span>{error}</span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => fetchExplanation(activeQuery)}
                                                className="flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 underline cursor-pointer"
                                            >
                                                <RotateCcw className="w-3 h-3" /> Retry
                                            </button>
                                        </div>
                                    )}

                                    {!isLoading && !error && response?.answer && (
                                        <CompactMarkdownRenderer content={response.answer} />
                                    )}
                                </div>

                                {/* Compact Ask Bar */}
                                <form onSubmit={handleCustomSubmit} className="mt-2 pt-2 border-t border-zinc-800/80 flex items-center gap-1.5">
                                    <input
                                        type="text"
                                        value={customQuery}
                                        onChange={(e) => setCustomQuery(e.target.value)}
                                        placeholder="Ask follow-up..."
                                        maxLength={MAX_SELECTION_LENGTH}
                                        className="flex-1 bg-zinc-900/90 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-[11px] text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500/80 transition-colors"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!customQuery.trim() || isLoading}
                                        className="p-1.5 rounded-lg bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white text-xs disabled:opacity-40 cursor-pointer active:scale-95 transition-all"
                                    >
                                        <Send className="w-3 h-3" />
                                    </button>
                                </form>

                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
