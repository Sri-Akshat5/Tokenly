export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    disabled = false,
    ...props
}) {
    const baseStyles = 'font-semibold rounded-xl transition-all duration-300 inline-flex items-center justify-center tracking-tight cursor-pointer';

    const variants = {
        primary: 'bg-white text-black hover:bg-zinc-100 hover:shadow-lg hover:shadow-white/20 disabled:bg-zinc-800 disabled:text-zinc-600 shadow-md',
        secondary: 'bg-transparent text-white border-2 border-zinc-700 hover:border-white hover:bg-white/5 disabled:border-zinc-800 disabled:text-zinc-700',
        danger: 'bg-red-600 text-white hover:bg-red-700 hover:shadow-lg hover:shadow-red-600/30 disabled:bg-red-900 disabled:text-red-400',
    };

    const sizes = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg',
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
}
