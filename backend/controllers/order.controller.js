import crypto from 'crypto';
import mongoose from 'mongoose';
import Customer from '../models/customer.model.js';
import Product from '../models/product.model.js';
import Order from '../models/order.model.js';
import getRazorpay from '../config/razorpay.js';

// -----------------------------------------------------------
// Helper: validate shipping address
// -----------------------------------------------------------
const validateAddress = (addr) => {
    if (!addr || typeof addr !== 'object') return 'Shipping address is required';
    const required = ['fullName', 'phone', 'addressLine1', 'city', 'state', 'pincode'];
    for (const key of required) {
        if (!addr[key] || String(addr[key]).trim() === '') {
            return `Field '${key}' is required in shipping address`;
        }
    }
    if (!/^\d{6}$/.test(String(addr.pincode).trim())) {
        return 'Pincode must be exactly 6 digits';
    }
    if (!/^\d{10}$/.test(String(addr.phone).trim())) {
        return 'Phone must be exactly 10 digits';
    }
    return null;
};

// -----------------------------------------------------------
// @desc    Create ShopKart pending order + Razorpay order
// @route   POST /orders/create-payment-order
// @access  Protected
// -----------------------------------------------------------
export const createPaymentOrder = async (req, res) => {
    try {
        const { shippingAddress } = req.body;

        // 1. Validate shipping address
        const addressError = validateAddress(shippingAddress);
        if (addressError) {
            return res.status(400).json({
                success: false,
                message: addressError,
            });
        }

        // 2. Load user WITH cart populated by product
        const user = await Customer.findById(req.user._id).populate({
            path: 'cart.product',
        });

        if (!user.cart || user.cart.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Your cart is empty',
            });
        }

        // 3. Validate every product + stock + snapshot price
        const orderItems = [];
        let totalAmount = 0;

        for (const item of user.cart) {
            const product = item.product;

            if (!product) {
                return res.status(400).json({
                    success: false,
                    message: 'One of the products in your cart no longer exists',
                });
            }

            if (item.quantity < 1) {
                return res.status(400).json({
                    success: false,
                    message: `Invalid quantity for ${product.name}`,
                });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for ${product.name}. Only ${product.stock} left.`,
                });
            }

            totalAmount += product.price * item.quantity;

            orderItems.push({
                product: product._id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: item.quantity,
            });
        }

        // 4. Create ShopKart order in PENDING_PAYMENT
        const order = await Order.create({
            user: user._id,
            items: orderItems,
            shippingAddress: {
                fullName: String(shippingAddress.fullName).trim(),
                phone: String(shippingAddress.phone).trim(),
                addressLine1: String(shippingAddress.addressLine1).trim(),
                city: String(shippingAddress.city).trim(),
                state: String(shippingAddress.state).trim(),
                pincode: String(shippingAddress.pincode).trim(),
            },
            totalAmount,
            paymentStatus: 'PENDING',
            status: 'PENDING_PAYMENT',
        });

        // 5. Create Razorpay order (amount in paise)
        let razorpayOrder;
        try {
            const razorpay = getRazorpay(); // 🆕 lazy instance
            razorpayOrder = await razorpay.orders.create({
                amount: Math.round(totalAmount * 100),
                currency: 'INR',
                receipt: order._id.toString(),
                notes: {
                    shopkartOrderId: order._id.toString(),
                    customerId: user._id.toString(),
                },
            });
        } catch (rzpErr) {
            await Order.findByIdAndDelete(order._id);
            console.error('Razorpay order creation failed:', rzpErr);
            return res.status(500).json({
                success: false,
                message: rzpErr?.message || 'Could not initiate payment. Please try again.',
            });
        }

        // 6. Save razorpay order id
        order.razorpayOrderId = razorpayOrder.id;
        await order.save();

        // 7. Return safe data (never the secret)
        return res.status(201).json({
            success: true,
            shopKartOrderId: order._id,
            razorpayOrderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            key: process.env.RAZORPAY_KEY_ID,
        });
    } catch (error) {
        console.error('Create payment order error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while creating order',
        });
    }
};

// -----------------------------------------------------------
// @desc    Verify Razorpay signature and confirm order
// @route   POST /orders/verify-payment
// @access  Protected
// -----------------------------------------------------------
export const verifyPayment = async (req, res) => {
    try {
        const { shopKartOrderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } =
            req.body;

        if (!shopKartOrderId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: 'Missing payment verification fields',
            });
        }

        if (!mongoose.Types.ObjectId.isValid(shopKartOrderId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid order ID',
            });
        }

        // 1. Load the order and ensure ownership
        const order = await Order.findById(shopKartOrderId);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found',
            });
        }

        if (order.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to verify this order',
            });
        }

        // 2. Ensure razorpay_order_id matches what we stored (never trust client)
        if (order.razorpayOrderId !== razorpay_order_id) {
            return res.status(400).json({
                success: false,
                message: 'Razorpay order ID mismatch',
            });
        }

        if (order.paymentStatus === 'PAID') {
            return res.status(200).json({
                success: true,
                message: 'Order already paid',
                order,
            });
        }

        // 3. HMAC SHA256 signature verification
        const body = `${order.razorpayOrderId}|${razorpay_payment_id}`;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest('hex');

        if (expectedSignature !== razorpay_signature) {
            // Do NOT mark paid, do NOT clear cart
            order.paymentStatus = 'FAILED';
            await order.save();
            return res.status(400).json({
                success: false,
                message: 'Invalid payment signature',
            });
        }

        // 4. ✅ Verified - mark PAID + PLACED
        order.paymentStatus = 'PAID';
        order.status = 'PLACED';
        order.razorpayPaymentId = razorpay_payment_id;
        order.razorpaySignature = razorpay_signature;
        await order.save();

        // 5. Clear cart ONLY now
        await Customer.findByIdAndUpdate(req.user._id, { cart: [] });

        // 6. Optionally decrement stock (safe pattern)
        //    We do this after verified payment so we never reserve stock for
        //    abandoned checkouts.
        try {
            await Promise.all(
                order.items.map((item) =>
                    Product.findByIdAndUpdate(item.product, {
                        $inc: { stock: -item.quantity },
                    }),
                ),
            );
        } catch (stockErr) {
            console.error('Stock decrement failed (non-fatal):', stockErr);
        }

        return res.status(200).json({
            success: true,
            message: 'Payment verified successfully',
            order,
        });
    } catch (error) {
        console.error('Verify payment error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while verifying payment',
        });
    }
};

// -----------------------------------------------------------
// @desc    Get current user's orders
// @route   GET /orders
// @access  Protected
// -----------------------------------------------------------
export const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({
            createdAt: -1,
        });

        return res.status(200).json({
            success: true,
            count: orders.length,
            orders,
        });
    } catch (error) {
        console.error('Get orders error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while fetching orders',
        });
    }
};

// -----------------------------------------------------------
// @desc    Get one order (ownership enforced)
// @route   GET /orders/:id
// @access  Protected
// -----------------------------------------------------------
export const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid order ID',
            });
        }

        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found',
            });
        }

        if (order.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this order',
            });
        }

        return res.status(200).json({
            success: true,
            order,
        });
    } catch (error) {
        console.error('Get order error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while fetching order',
        });
    }
};

// -----------------------------------------------------------
// @desc    Update order status (dev/admin helper - bonus)
// @route   PATCH /orders/:id/status
// @access  Protected (temporary)
// -----------------------------------------------------------
export const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const allowed = ['PLACED', 'CONFIRMED', 'SHIPPED', 'DELIVERED'];
        if (!allowed.includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Status must be one of: ${allowed.join(', ')}`,
            });
        }

        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found',
            });
        }

        if (order.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized',
            });
        }

        order.status = status;
        await order.save();

        return res.status(200).json({
            success: true,
            message: 'Status updated',
            order,
        });
    } catch (error) {
        console.error('Update status error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};
