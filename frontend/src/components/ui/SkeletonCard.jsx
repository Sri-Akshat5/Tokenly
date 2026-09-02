export default function SkeletonCard() {
    return (
        <div className="w-full p-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 animate-pulse">
            {/* Header Section: Circular Avatar aur Title */}
            <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-zinc-800"></div>
                <div className="flex-1">
                    <div className="h-4 bg-zinc-800 rounded w-1/3 mb-2"></div>
                    <div className="h-3 bg-zinc-800 rounded w-1/4"></div>
                </div>
            </div>
            
            {/* Body Section: Content lines */}
            <div className="space-y-3 mb-6">
                <div className="h-3 bg-zinc-800 rounded w-full"></div>
                <div className="h-3 bg-zinc-800 rounded w-5/6"></div>
                <div className="h-3 bg-zinc-800 rounded w-4/6"></div>
            </div>

            {/* Footer Section: Button Skeleton */}
            <div className="flex justify-end">
                <div className="h-10 bg-zinc-800 rounded-xl w-28"></div>
            </div>
        </div>
    );
}