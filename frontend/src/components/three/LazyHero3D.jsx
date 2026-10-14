import { Suspense, lazy, useEffect, useState } from 'react';

const Hero3D = lazy(() => import('./Hero3D'));

const LazyHero3D = () => {
    const [enabled, setEnabled] = useState(false);

    useEffect(() => {
        // Skip 3D on very small screens or when the user prefers reduced motion
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const isSmall = window.innerWidth < 640;

        if (!prefersReduced && !isSmall) setEnabled(true);
    }, []);

    if (!enabled) return null;

    return (
        <Suspense
            fallback={
                <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 to-brand-800/20" />
            }
        >
            <Hero3D />
        </Suspense>
    );
};

export default LazyHero3D;
