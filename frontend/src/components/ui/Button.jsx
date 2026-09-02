export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    disabled = false,
    isLoading = false, // 1. Naya prop add kiya
    ...props
}) {
    // 2. baseStyles mein `disabled:cursor-not-allowed` add kiya taaki loading pe pointer change ho jaye
    const baseStyles = 'font-semibold rounded-xl transition-all duration-300 inline-flex items-center justify-center tracking-tight cursor-pointer disabled:cursor-not-allowed';

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
            disabled={disabled || isLoading} // 3. Agar loading true hai, toh button disable ho jayega
            {...props}
        >
            {/* 4. Spinner UI: Sirf tabhi dikhega jab isLoading true hoga */}
            {isLoading && (
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            )}
            {children}
        </button>
    );
}