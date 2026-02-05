export default function Card({
    children,
    className = '',
    hover = false,
    gradient = false,
    ...props
}) {
    const baseStyles = 'bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/50 rounded-2xl shadow-xl transition-all duration-300';
    const hoverStyles = hover ? 'hover:shadow-2xl hover:shadow-white/5 hover:border-zinc-700 hover:-translate-y-1 cursor-pointer hover:bg-zinc-900/70' : '';
    const gradientStyles = gradient ? 'bg-gradient-to-br from-zinc-900/50 to-black/50' : '';

    return (
        <div
            className={`${baseStyles} ${hoverStyles} ${gradientStyles} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
}
