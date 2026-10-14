import { useEffect, useState, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import PageTransition from '../components/motion/PageTransition';
import { fetchProducts, fetchCategories } from '../services/api';
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap';

const Products = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const gridRef = useRef(null);

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || 'All Categories';
    const sort = searchParams.get('sort') || '';

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const res = await fetchCategories();
                setCategories(res.data.categories || []);
            } catch (err) {
                console.error('Failed to load categories', err);
            }
        };
        loadCategories();
    }, []);

    const loadProducts = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const params = {};
            if (search) params.search = search;
            if (category && category !== 'All Categories') params.category = category;
            if (sort) params.sort = sort;

            const res = await fetchProducts(params);
            setProducts(res.data.products || []);
        } catch (err) {
            setError(
                err?.response?.data?.message || 'Something went wrong while loading products.',
            );
        } finally {
            setLoading(false);
        }
    }, [search, category, sort]);

    useEffect(() => {
        loadProducts();
    }, [loadProducts]);

    // 🎬 GSAP reveal when products change
    useGSAP(
        () => {
            if (loading || !gridRef.current) return;
            const cards = gridRef.current.querySelectorAll('.product-card-anim');
            if (!cards.length) return;

            gsap.from(cards, {
                y: 30,
                opacity: 0,
                duration: 0.55,
                ease: 'power3.out',
                stagger: 0.06,
                clearProps: 'opacity,transform',
            });
        },
        { dependencies: [products, loading], scope: gridRef },
    );

    // Refresh ScrollTrigger after grid updates
    useEffect(() => {
        ScrollTrigger.refresh();
    }, [products]);

    const updateParam = (key, value) => {
        const next = new URLSearchParams(searchParams);
        if (value && value !== 'All Categories') next.set(key, value);
        else next.delete(key);
        setSearchParams(next, { replace: true });
    };

    const [searchInput, setSearchInput] = useState(search);
    useEffect(() => {
        setSearchInput(search);
    }, [search]);

    useEffect(() => {
        const t = setTimeout(() => {
            if (searchInput !== search) updateParam('search', searchInput);
        }, 400);
        return () => clearTimeout(t);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchInput]);

    return (
        <PageTransition>
            <div className="min-h-screen w-full bg-slate-50 dark:bg-ink-950">
                <Navbar />

                <main className="w-full px-4 sm:px-6 lg:px-10 py-8">
                    <div className="mb-6">
                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                            All Products
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
                            {loading
                                ? 'Loading...'
                                : `${products.length} product${products.length !== 1 ? 's' : ''} found`}
                        </p>
                    </div>

                    <div className="mb-6">
                        <SearchBar
                            search={searchInput}
                            onSearchChange={setSearchInput}
                            category={category}
                            onCategoryChange={(v) => updateParam('category', v)}
                            categories={categories}
                            sort={sort}
                            onSortChange={(v) => updateParam('sort', v)}
                        />
                    </div>

                    {loading && <LoadingGrid />}

                    {!loading && error && (
                        <div className="card p-10 text-center">
                            <div className="inline-flex w-14 h-14 rounded-full bg-red-50 items-center justify-center mb-4">
                                <svg
                                    className="w-7 h-7 text-red-500"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                                Something went wrong
                            </h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mb-5">
                                {error}
                            </p>
                            <button onClick={loadProducts} className="btn-primary">
                                Try Again
                            </button>
                        </div>
                    )}

                    {!loading && !error && products.length === 0 && (
                        <div className="card p-10 text-center">
                            <div className="inline-flex w-14 h-14 rounded-full bg-slate-100 items-center justify-center mb-4">
                                <svg
                                    className="w-7 h-7 text-slate-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                                No products found
                            </h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm">
                                Try adjusting your search or filter.
                            </p>
                        </div>
                    )}

                    {!loading && !error && products.length > 0 && (
                        <div
                            ref={gridRef}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
                        >
                            {products.map((p) => (
                                <div key={p._id} className="product-card-anim">
                                    <ProductCard product={p} />
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </PageTransition>
    );
};

const LoadingGrid = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="card overflow-hidden">
                <div className="aspect-[4/3] shimmer" />
                <div className="p-4 space-y-3">
                    <div className="h-4 rounded w-3/4 shimmer" />
                    <div className="h-3 rounded w-full shimmer" />
                    <div className="h-3 rounded w-2/3 shimmer" />
                    <div className="h-10 rounded mt-3 shimmer" />
                </div>
            </div>
        ))}
    </div>
);

export default Products;
