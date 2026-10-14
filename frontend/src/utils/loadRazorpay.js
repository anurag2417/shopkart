/**
 * Dynamically loads the Razorpay Checkout script.
 * Resolves true when window.Razorpay is available.
 */
const loadRazorpay = () =>
    new Promise((resolve) => {
        if (window.Razorpay) return resolve(true);

        const existing = document.querySelector(
            'script[src="https://checkout.razorpay.com/v1/checkout.js"]',
        );
        if (existing) {
            existing.addEventListener('load', () => resolve(true));
            existing.addEventListener('error', () => resolve(false));
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });

export default loadRazorpay;
