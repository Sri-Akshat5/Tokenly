export default function Badge({
    children,
    variant = 'default',
    size = 'md',
    className = ''
}) {
    const variants = {
        default: 'bg-zinc-800/50 text-zinc-400 border-zinc-700/50',
        primary: 'bg-white text-black font-bold tracking-tight',
        success: 'bg-green-500/10 text-green-400 border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.1)]',
        warning: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20 shadow-[0_0_10px_rgba(234,179,8,0.1)]',
        danger: 'bg-red-500/10 text-red-400 border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.1)]',
        blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.1)]',
    };

    const sizes = {
        xs: 'px-1.5 py-0.5 text-[9px] uppercase tracking-widest',
        sm: 'px-2 py-0.5 text-[10px] uppercase tracking-wider',
        md: 'px-3 py-1 text-xs uppercase tracking-wide',
        lg: 'px-4 py-1.5 text-sm',
    };

    return (
        <span
            className={`
        inline-flex items-center font-bold border rounded-full transition-all duration-300
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
        >
            {children}
        </span>
    );
}
