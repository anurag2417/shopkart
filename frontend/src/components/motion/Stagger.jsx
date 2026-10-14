import { motion } from 'framer-motion';

// ---- Variants (used by parent + children) ----
export const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.06, delayChildren: 0.05 },
    },
};

export const staggerItem = {
    hidden: { opacity: 0, y: 16 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: 'easeOut' },
    },
};

// ---- Components ----
const Stagger = ({ children, className = '' }) => (
    <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-40px' }}
        className={className}
    >
        {children}
    </motion.div>
);

export const StaggerItem = ({ children, className = '' }) => (
    <motion.div variants={staggerItem} className={className}>
        {children}
    </motion.div>
);

// ✅ Default export so `import Stagger from ...` works
export default Stagger;
