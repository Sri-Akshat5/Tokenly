import React from 'react';
import { ChevronDown } from 'lucide-react';

export default function Select({ children, className = '', ...props }) {
    return (
        <div className="relative">
            <select
                className={`w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl px-3 py-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-white/20 transition-all font-medium appearance-none ${className}`}
                {...props}
            >
                {children}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                <ChevronDown className="w-4 h-4" />
            </div>
        </div>
    );
}
