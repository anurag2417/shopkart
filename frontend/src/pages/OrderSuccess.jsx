import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getOrderById } from '../services/api';

const OrderSuccess = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const res = await getOrderById(id);
                setOrder(res.data.order);
            } catch (err) {
                setError(err?.response?.data?.message || 'Could not load order');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id]);

    return (
        <div className="min-h-screen w-full bg-slate-50 dark:bg-ink-950">
            <Navbar />

            <main className="w-full px-4 sm:px-6 lg:px-10 py-8 sm:py-12">
                {loading && (
                    <div className="max-w-lg mx-auto card p-10 text-center animate-pulse">
                        <div className="w-16 h-16 rounded-full bg-slate-200 mx-auto mb-4" />
                        <div className="h-6 bg-slate-200 rounded w-2/3 mx-auto mb-3" />
                        <div className="h-4 bg-slate-200 rounded w-1/2 mx-auto" />
                    </div>
                )}

                {!loading && error && (
                    <div className="max-w-lg mx-auto card p-10 text-center">
                        <div className="text-4xl mb-3">😕</div>
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                            {error}
                        </h2>
                        <Link to="/orders" className="btn-primary inline-flex mt-4">
                            View My Orders
                        </Link>
                    </div>
                )}

                {!loading && !error && order && (
                    <div className="max-w-2xl mx-auto">
                        {/* Success header */}
                        <div className="card p-8 text-center animate-slide-up">
                            <div className="inline-flex w-16 h-16 rounded-full bg-green-100 items-center justify-center mb-4">
                                <svg
                                    className="w-8 h-8 text-green-600"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                                Order Placed Successfully
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">
                                Thank you! Your order has been saved.
                            </p>

                            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                                <div className="px-4 py-3 rounded-lg bg-slate-50 dark:bg-ink-950">
                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wide">
                                        Order ID
                                    </p>
                                    <p className="text-sm text-slate-800 font-mono mt-1 truncate">
                                        {order._id}
                                    </p>
                                </div>
                                <div className="px-4 py-3 rounded-lg bg-slate-50 dark:bg-ink-950">
                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wide">
                                        Total Paid
                                    </p>
                                    <p className="text-sm text-slate-800 font-semibold mt-1">
                                        ₹{order.totalAmount.toLocaleString('en-IN')}
                                    </p>
                                </div>
                                <div className="px-4 py-3 rounded-lg bg-slate-50 dark:bg-ink-950">
                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wide">
                                        Status
                                    </p>
                                    <p className="text-sm text-green-600 font-semibold mt-1">
                                        {order.status}
                                    </p>
                                </div>
                                <div className="px-4 py-3 rounded-lg bg-slate-50 dark:bg-ink-950">
                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wide">
                                        Payment
                                    </p>
                                    <p className="text-sm text-green-600 font-semibold mt-1">
                                        {order.paymentStatus}
                                    </p>
                                </div>
                            </div>

                            {/* Items preview */}
                            <div className="mt-6 text-left">
                                <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
                                    Items
                                </h2>
                                <div className="space-y-2">
                                    {order.items.map((item) => (
                                        <div
                                            key={item.product}
                                            className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-50 dark:bg-ink-950"
                                        >
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-10 h-10 rounded object-cover bg-slate-200"
                                                onError={(e) => {
                                                    e.target.src =
                                                        'https://via.placeholder.com/80?text=No';
                                                }}
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-slate-800 truncate">
                                                    {item.name}
                                                </p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                                    Qty {item.quantity}
                                                </p>
                                            </div>
                                            <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                                ₹
                                                {(item.price * item.quantity).toLocaleString(
                                                    'en-IN',
                                                )}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                                <Link to="/orders" className="btn-primary">
                                    View My Orders
                                </Link>
                                <Link to="/products" className="btn-secondary">
                                    Continue Shopping
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default OrderSuccess;
