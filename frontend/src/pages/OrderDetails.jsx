import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getOrderById } from '../services/api';

const OrderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
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

            <main className="w-full px-4 sm:px-6 lg:px-10 py-8">
                <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 dark:text-white mb-6"
                >
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                </button>

                {loading && (
                    <div className="max-w-3xl space-y-4">
                        <div className="card p-6 h-24 animate-pulse" />
                        <div className="card p-6 h-48 animate-pulse" />
                        <div className="card p-6 h-40 animate-pulse" />
                    </div>
                )}

                {!loading && error && (
                    <div className="card p-10 text-center max-w-md mx-auto">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                            {error}
                        </h3>
                        <Link to="/orders" className="btn-primary mt-4 inline-flex">
                            Back to Orders
                        </Link>
                    </div>
                )}

                {!loading && !error && order && (
                    <div className="max-w-3xl space-y-4 animate-fade-in">
                        {/* Header */}
                        <div className="card p-5">
                            <div className="flex flex-wrap items-start justify-between gap-3">
                                <div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                                        Order ID
                                    </p>
                                    <p className="text-sm font-mono text-slate-800 dark:text-slate-100 mt-0.5">
                                        {order._id}
                                    </p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                        Placed on{' '}
                                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                                        Status
                                    </p>
                                    <p className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">
                                        {order.status.replace('_', ' ')}
                                    </p>
                                    <p
                                        className={`text-xs mt-1 font-medium ${
                                            order.paymentStatus === 'PAID'
                                                ? 'text-green-600'
                                                : order.paymentStatus === 'FAILED'
                                                  ? 'text-red-500'
                                                  : 'text-amber-600'
                                        }`}
                                    >
                                        Payment: {order.paymentStatus}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Items */}
                        <div className="card p-5">
                            <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">
                                Items
                            </h2>
                            <div className="space-y-3">
                                {order.items.map((item) => (
                                    <div
                                        key={item.product}
                                        className="flex items-center gap-3 py-2"
                                    >
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-14 h-14 rounded-lg object-cover bg-slate-100 dark:bg-ink-800"
                                            onError={(e) => {
                                                e.target.src =
                                                    'https://via.placeholder.com/80?text=No';
                                            }}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">
                                                {item.name}
                                            </p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                                ₹{item.price.toLocaleString('en-IN')} ×{' '}
                                                {item.quantity}
                                            </p>
                                        </div>
                                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                                        </p>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t border-slate-100 dark:border-ink-800 mt-4 pt-4 flex justify-between text-base font-bold text-slate-900 dark:text-white">
                                <span>Total</span>
                                <span>₹{order.totalAmount.toLocaleString('en-IN')}</span>
                            </div>
                        </div>

                        {/* Shipping */}
                        <div className="card p-5">
                            <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
                                Shipping Address
                            </h2>
                            <div className="text-sm text-slate-700 dark:text-slate-200 space-y-0.5">
                                <p className="font-medium">{order.shippingAddress.fullName}</p>
                                <p>{order.shippingAddress.phone}</p>
                                <p>{order.shippingAddress.addressLine1}</p>
                                <p>
                                    {order.shippingAddress.city}, {order.shippingAddress.state} -{' '}
                                    {order.shippingAddress.pincode}
                                </p>
                            </div>
                        </div>

                        {/* Payment */}
                        <div className="card p-5">
                            <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
                                Payment Details
                            </h2>
                            <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 font-mono">
                                {order.razorpayOrderId && (
                                    <p>
                                        <span className="text-slate-500 dark:text-slate-400 font-sans">
                                            Razorpay Order:{' '}
                                        </span>
                                        {order.razorpayOrderId}
                                    </p>
                                )}
                                {order.razorpayPaymentId && (
                                    <p>
                                        <span className="text-slate-500 dark:text-slate-400 font-sans">
                                            Payment ID:{' '}
                                        </span>
                                        {order.razorpayPaymentId}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <Link to="/orders" className="btn-secondary">
                                Back to Orders
                            </Link>
                            <Link to="/products" className="btn-primary">
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default OrderDetails;
