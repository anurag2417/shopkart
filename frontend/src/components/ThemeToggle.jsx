import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = ({ className = '' }) => {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <button
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className={`relative w-10 h-10 rounded-full flex items-center justify-center
                  bg-slate-100 hover:bg-slate-200
                  dark:bg-ink-800 dark:hover:bg-ink-700
                  transition-colors duration-200
                  ${className}`}
        >
            <AnimatePresence mode="wait" initial={false}>
                {isDark ? (
                    <motion.svg
                        key="sun"
                        initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
                        animate={{ rotate: 0, opacity: 1, scale: 1 }}
                        exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        className="w-5 h-5 text-ink-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <circle cx="12" cy="12" r="4" />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
                        />
                    </motion.svg>
                ) : (
                    <motion.svg
                        key="moon"
                        initial={{ rotate: 90, opacity: 0, scale: 0.6 }}
                        animate={{ rotate: 0, opacity: 1, scale: 1 }}
                        exit={{ rotate: -90, opacity: 0, scale: 0.6 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        className="w-5 h-5 text-slate-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
                        />
                    </motion.svg>
                )}
            </AnimatePresence>
        </button>
    );
};

export default ThemeToggle;
