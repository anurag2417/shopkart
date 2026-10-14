import { motion } from 'framer-motion';

/**
 * Small utility for entrance animations.
 * Usage: <FadeIn delay={0.1}>...</FadeIn>
 */
const FadeIn = ({ children, delay = 0, y = 16, className = '' }) => (
    <motion.div
        initial={{ opacity: 0, y }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.5, delay, ease: 'easeOut' }}
        className={className}
    >
        {children}
    </motion.div>
);

export default FadeIn;
