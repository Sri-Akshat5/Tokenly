export default function Input({
    label,
    error,
    icon,
    className = '',
    ...props
}) {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                    {label}
                </label>
            )}
            <div className="relative">
                {icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                        {icon}
                    </div>
                )}
                <input
                    className={`
            w-full px-4 py-2.5 
            ${icon ? 'pl-10' : ''}
            bg-zinc-800 border-2 border-zinc-700 rounded-lg
            text-white placeholder-zinc-500
            focus:outline-none focus:ring-2 focus:ring-white focus:border-white
            transition-all duration-200
            ${error ? 'border-red-500 focus:ring-red-500' : ''}
            ${className}
          `}
                    {...props}
                />
            </div>
            {error && (
                <p className="mt-1 text-sm text-red-400">{error}</p>
            )}
        </div>
    );
}
