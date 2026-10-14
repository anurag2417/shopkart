import Razorpay from 'razorpay';

let razorpayInstance = null;

/**
 * Lazily create the Razorpay instance on first use.
 * This prevents the server from crashing at import time
 * if env vars are missing - instead, we throw only when
 * the payment endpoints are actually hit.
 */
const getRazorpay = () => {
    if (razorpayInstance) return razorpayInstance;

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
        throw new Error(
            'Razorpay keys missing. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in your .env file, then restart the server.',
        );
    }

    razorpayInstance = new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
    });

    return razorpayInstance;
};

export default getRazorpay;
