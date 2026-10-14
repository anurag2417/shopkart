import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import PageTransition from '../components/motion/PageTransition';
import PressButton from '../components/motion/PressButton';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { createPaymentOrder, verifyPayment } from '../services/api';
import loadRazorpay from '../utils/loadRazorpay';

const initialForm = {
    fullName: '',
    phone: '',
    addressLine1: '',
    city: '',
    state: '',
    pincode: '',
};

const Checkout = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { cart, subtotal, totalUnits, clearCartLocal } = useCart();
    const { showToast } = useToast();

    const [form, setForm] = useState({
        ...initialForm,
        fullName: user?.fullName || '',
        phone: user?.phone || '',
    });
    const [errors, setErrors] = useState({});
    const [placing, setPlacing] = useState(false);
    const [serverError, setServerError] = useState('');

    // ---- Delivery fee mirrors Cart page ----
    const deliveryFee = subtotal > 499 || subtotal === 0 ? 0 : 49;
    const total = subtotal + deliveryFee;

    // ---- Validation ----
    const validateForm = () => {
        const errs = {};
        if (!form.fullName.trim()) errs.fullName = 'Full name is required';
        if (!/^\d{10}$/.test(form.phone.trim())) errs.phone = 'Phone must be 10 digits';
        if (!form.addressLine1.trim()) errs.addressLine1 = 'Address is required';
        if (!form.city.trim()) errs.city = 'City is required';
        if (!form.state.trim()) errs.state = 'State is required';
        if (!/^\d{6}$/.test(form.pincode.trim())) errs.pincode = 'Pincode must be exactly 6 digits';
        return errs;
    };

    const handleChange = (e) => {
        setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
        setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
        setServerError('');
    };

    // ---- Main flow ----
    const handlePlaceOrder = async () => {
        const errs = validateForm();
        if (Object.keys(errs).length) {
            setErrors(errs);
            showToast('Please fix the highlighted fields', 'error');
            return;
        }

        if (cart.length === 0) {
            showToast('Your cart is empty', 'error');
            return;
        }

        setPlacing(true);
        setServerError('');

        try {
            // 1. Load Razorpay script
            const loaded = await loadRazorpay();
            if (!loaded) {
                throw new Error('Failed to load Razorpay. Check your connection.');
            }

            // 2. Ask backend to create ShopKart + Razorpay order
            const res = await createPaymentOrder(form);
            const { shopKartOrderId, razorpayOrderId, amount, currency, key } = res.data;

            // 3. Open Razorpay Checkout
            const options = {
                key,
                amount,
                currency,
                name: 'ShopKart',
                description: `ShopKart Order #${String(shopKartOrderId).slice(-6)}`,
                order_id: razorpayOrderId,
                prefill: {
                    name: form.fullName,
                    contact: form.phone,
                    email: user?.email || '',
                },
                notes: {
                    address: `${form.addressLine1}, ${form.city}, ${form.state} - ${form.pincode}`,
                },
                theme: { color: '#2563eb' },
                handler: async (response) => {
                    // 🔒 Never trust this callback alone - verify on backend
                    try {
                        const verifyRes = await verifyPayment({
                            shopKartOrderId,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        });

                        if (verifyRes.data.success) {
                            clearCartLocal();
                            showToast('Payment successful 🎉', 'success');
                            navigate(`/order-success/${verifyRes.data.order._id}`, {
                                replace: true,
                            });
                        } else {
                            throw new Error('Payment verification failed');
                        }
                    } catch (err) {
                        showToast(
                            err?.response?.data?.message ||
                                'Payment verification failed. Please contact support.',
                            'error',
                        );
                    } finally {
                        setPlacing(false);
                    }
                },
                modal: {
                    ondismiss: () => {
                        setPlacing(false);
                        showToast(
                            'Checkout closed. Your cart is safe - try again anytime.',
                            'info',
                        );
                    },
                },
            };

            const rzp = new window.Razorpay(options);

            rzp.on('payment.failed', function (response) {
                setPlacing(false);
                showToast(
                    response?.error?.description ||
                        'Payment failed. Your cart has not been cleared.',
                    'error',
                );
            });

            rzp.open();
        } catch (err) {
            setPlacing(false);
            const msg =
                err?.response?.data?.message ||
                err?.message ||
                'Could not start checkout. Please try again.';
            setServerError(msg);
            showToast(msg, 'error');
        }
    };

    // ---- Empty cart guard ----
    if (cart.length === 0) {
        return (
            <PageTransition>
                <div className="min-h-screen w-full bg-slate-50 dark:bg-ink-950">
                    <Navbar />
                    <main className="w-full px-4 sm:px-6 lg:px-10 py-12">
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, ease: 'easeOut' }}
                            className="card p-10 sm:p-16 text-center max-w-lg mx-auto"
                        >
                            <div className="text-5xl mb-4">🛒</div>
                            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                                Your cart is empty
                            </h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
                                Add some products before checking out.
                            </p>
                            <Link to="/products" className="btn-primary inline-flex">
                                Browse Products
                            </Link>
                        </motion.div>
                    </main>
                </div>
            </PageTransition>
        );
    }

    return (
        <PageTransition>
            <div className="min-h-screen w-full bg-slate-50 dark:bg-ink-950">
                <Navbar />

                <main className="w-full px-4 sm:px-6 lg:px-10 py-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                        Checkout
                    </h1>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Shipping Form */}
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, ease: 'easeOut' }}
                            className="lg:col-span-2 bg-white dark:bg-ink-900 rounded-2xl border border-slate-100 dark:border-ink-800 shadow-sm p-5 sm:p-6"
                        >
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                                Shipping Details
                            </h2>

                            {serverError && (
                                <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900/60 text-red-700 dark:text-red-300 text-sm">
                                    {serverError}
                                </div>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Field
                                    label="Full Name"
                                    name="fullName"
                                    value={form.fullName}
                                    error={errors.fullName}
                                    onChange={handleChange}
                                    placeholder="John Doe"
                                    className="sm:col-span-2"
                                />
                                <Field
                                    label="Phone"
                                    name="phone"
                                    value={form.phone}
                                    error={errors.phone}
                                    onChange={handleChange}
                                    placeholder="9876543210"
                                    inputMode="numeric"
                                    maxLength={10}
                                />
                                <Field
                                    label="Pincode"
                                    name="pincode"
                                    value={form.pincode}
                                    error={errors.pincode}
                                    onChange={handleChange}
                                    placeholder="560001"
                                    inputMode="numeric"
                                    maxLength={6}
                                />
                                <Field
                                    label="Address"
                                    name="addressLine1"
                                    value={form.addressLine1}
                                    error={errors.addressLine1}
                                    onChange={handleChange}
                                    placeholder="Flat / House no., Street"
                                    className="sm:col-span-2"
                                />
                                <Field
                                    label="City"
                                    name="city"
                                    value={form.city}
                                    error={errors.city}
                                    onChange={handleChange}
                                    placeholder="Bengaluru"
                                />
                                <Field
                                    label="State"
                                    name="state"
                                    value={form.state}
                                    error={errors.state}
                                    onChange={handleChange}
                                    placeholder="Karnataka"
                                />
                            </div>
                        </motion.div>

                        {/* Order Summary */}
                        <motion.aside
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
                            className="lg:col-span-1"
                        >
                            <div className="bg-white dark:bg-ink-900 rounded-2xl border border-slate-100 dark:border-ink-800 shadow-sm p-5 sm:p-6 sticky top-24">
                                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                                    Order Summary
                                </h2>

                                <div className="max-h-64 overflow-y-auto pr-1 space-y-3 mb-4">
                                    {cart.map((item) => (
                                        <div
                                            key={item.product._id}
                                            className="flex gap-3 items-center"
                                        >
                                            <img
                                                src={item.product.image}
                                                alt={item.product.name}
                                                className="w-12 h-12 rounded-lg object-cover bg-slate-100 dark:bg-ink-800 flex-shrink-0"
                                                onError={(e) => {
                                                    e.target.src =
                                                        'https://via.placeholder.com/80?text=No';
                                                }}
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">
                                                    {item.product.name}
                                                </p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                                    {item.quantity} × ₹
                                                    {item.product.price.toLocaleString('en-IN')}
                                                </p>
                                            </div>
                                            <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                                ₹
                                                {(
                                                    item.product.price * item.quantity
                                                ).toLocaleString('en-IN')}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-3 text-sm border-t border-slate-100 dark:border-ink-800 pt-4">
                                    <div className="flex justify-between text-slate-600 dark:text-slate-300">
                                        <span>Items ({totalUnits})</span>
                                        <span>₹{subtotal.toLocaleString('en-IN')}</span>
                                    </div>
                                    <div className="flex justify-between text-slate-600 dark:text-slate-300">
                                        <span>Delivery</span>
                                        <span
                                            className={
                                                deliveryFee === 0
                                                    ? 'text-green-600 font-medium'
                                                    : ''
                                            }
                                        >
                                            {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                                        </span>
                                    </div>
                                    <div className="border-t border-slate-100 pt-3 flex justify-between text-base font-semibold text-slate-900 dark:text-white">
                                        <span>Total</span>
                                        <span>₹{total.toLocaleString('en-IN')}</span>
                                    </div>
                                </div>

                                <PressButton
                                    onClick={handlePlaceOrder}
                                    disabled={placing}
                                    className="btn-primary w-full mt-6"
                                >
                                    {placing
                                        ? 'Processing...'
                                        : `Pay ₹${total.toLocaleString('en-IN')}`}
                                </PressButton>

                                <p className="text-xs text-slate-400 text-center mt-3">
                                    🔒 Secured by Razorpay · Test Mode
                                </p>
                            </div>
                        </motion.aside>
                    </div>
                </main>
            </div>
        </PageTransition>
    );
};

const Field = ({ label, name, value, error, onChange, placeholder, className = '', ...rest }) => (
    <div className={className}>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
        <input
            type="text"
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`input-field ${
                error ? 'border-red-300 focus:border-red-500 focus:ring-red-500/30' : ''
            }`}
            {...rest}
        />
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
);

export default Checkout;
