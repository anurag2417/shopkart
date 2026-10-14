import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getMyOrders } from '../services/api';

const statusColors = {
    PENDING_PAYMENT: 'bg-amber-100 text-amber-700',
    PLACED: 'bg-brand-100 text-brand-700',
    CONFIRMED: 'bg-blue-100 text-blue-700',
    SHIPPED: 'bg-indigo-100 text-indigo-700',
    DELIVERED: 'bg-green-100 text-green-700',
};

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const load = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await getMyOrders();
            setOrders(res.data.orders || []);
        } catch (err) {
            setError(err?.response?.data?.message || 'Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    return (
        <div className="min-h-screen w-full bg-slate-50 dark:bg-ink-950">
            <Navbar />

            <main className="w-full px-4 sm:px-6 lg:px-10 py-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-1">
                    My Orders
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
                    {loading
                        ? 'Loading...'
                        : `${orders.length} order${orders.length !== 1 ? 's' : ''}`}
                </p>

                {loading && (
                    <div className="space-y-4 max-w-3xl">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="card p-5 animate-pulse">
                                <div className="h-4 bg-slate-200 rounded w-1/3 mb-3" />
                                <div className="h-3 bg-slate-200 rounded w-1/4 mb-4" />
                                <div className="h-16 bg-slate-100 rounded" />
                            </div>
                        ))}
                    </div>
                )}

                {!loading && error && (
                    <div className="card p-10 text-center max-w-md mx-auto">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                            {error}
                        </h3>
                        <button onClick={load} className="btn-primary mt-4">
                            Try Again
                        </button>
                    </div>
                )}

                {!loading && !error && orders.length === 0 && (
                    <div className="card p-10 sm:p-16 text-center max-w-lg mx-auto">
                        <div className="text-5xl mb-4">📦</div>
                        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                            You have no orders yet
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
                            Start shopping and your orders will appear here.
                        </p>
                        <Link to="/products" className="btn-primary inline-flex">
                            Start Shopping
                        </Link>
                    </div>
                )}

                {!loading && !error && orders.length > 0 && (
                    <div className="space-y-4 max-w-3xl">
                        {orders.map((order) => (
                            <div key={order._id} className="card p-5">
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                    <div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                                            Order
                                        </p>
                                        <p className="text-sm font-mono text-slate-800 dark:text-slate-100 mt-0.5">
                                            #{order._id.slice(-8)}
                                        </p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                            {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </p>
                                    </div>

                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                            statusColors[order.status] ||
                                            'bg-slate-100 text-slate-700 dark:bg-ink-800 dark:text-slate-200'
                                        }`}
                                    >
                                        {order.status.replace('_', ' ')}
                                    </span>
                                </div>

                                <div className="mt-4 flex flex-wrap items-center gap-3">
                                    <div className="flex -space-x-2">
                                        {order.items.slice(0, 4).map((item) => (
                                            <img
                                                key={item.product}
                                                src={item.image}
                                                alt={item.name}
                                                className="w-10 h-10 rounded-lg object-cover bg-slate-200 dark:bg-ink-800 border-2 border-white dark:border-ink-900"
                                                onError={(e) => {
                                                    e.target.src =
                                                        'https://via.placeholder.com/80?text=No';
                                                }}
                                            />
                                        ))}
                                        {order.items.length > 4 && (
                                            <div className="w-10 h-10 rounded-lg bg-slate-200 dark:bg-ink-800 border-2 border-white dark:border-ink-900 flex items-center justify-center text-xs font-semibold text-slate-600 dark:text-slate-300">
                                                +{order.items.length - 4}
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-sm text-slate-600 dark:text-slate-300">
                                        {order.items.length} item
                                        {order.items.length !== 1 ? 's' : ''}
                                    </p>
                                </div>

                                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-ink-800">
                                    <div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            Total
                                        </p>
                                        <p className="text-lg font-bold text-slate-900 dark:text-white">
                                            ₹{order.totalAmount.toLocaleString('en-IN')}
                                        </p>
                                    </div>
                                    <Link
                                        to={`/orders/${order._id}`}
                                        className="btn-secondary text-sm"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Orders;
