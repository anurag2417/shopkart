import { motion } from 'framer-motion';

/**
 * Drop-in animated wrapper for any button.
 * <PressButton className="btn-primary" onClick={...}>Buy</PressButton>
 */
const PressButton = ({ children, className = '', ...rest }) => (
    <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className={className}
        {...rest}
    >
        {children}
    </motion.button>
);

export default PressButton;
