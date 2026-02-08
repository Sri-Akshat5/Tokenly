import { useEffect, useRef, useState } from 'react';

export default function AnimatedCounter({
    end,
    duration = 2000,
    suffix = '',
    prefix = '',
    decimals = 0
}) {
    const [count, setCount] = useState(0);
    const countRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        if (countRef.current) {
            observer.observe(countRef.current);
        }

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!isVisible) return;

        let startTime = null;
        let animationFrameId;

        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;

            // Ease-out quadratic function: f(t) = t * (2 - t)
            const easeOutQuad = (t) => t * (2 - t);

            const percentage = Math.min(progress / duration, 1);
            const easedPercentage = easeOutQuad(percentage);

            const currentCount = easedPercentage * end;

            setCount(currentCount);

            if (progress < duration) {
                animationFrameId = requestAnimationFrame(animate);
            } else {
                setCount(end); // Ensure it lands exactly on end value
            }
        };

        animationFrameId = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationFrameId);
    }, [isVisible, end, duration]);

    return (
        <span ref={countRef}>
            {prefix}{count.toFixed(decimals)}{suffix}
        </span>
    );
}
