import { createContext, useCallback, useContext, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const ToastContext = createContext(null);

let idCounter = 0;

const toastVariants = {
    initial: { opacity: 0, y: -16, scale: 0.96 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -12, scale: 0.96 },
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback((message, type = 'info', duration = 2600) => {
        const id = ++idCounter;
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, duration);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}

            <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
                <AnimatePresence initial={false}>
                    {toasts.map((t) => (
                        <motion.div
                            key={t.id}
                            variants={toastVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                            onClick={() => removeToast(t.id)}
                            className={`pointer-events-auto min-w-[240px] max-w-sm px-4 py-3 rounded-xl shadow-lg border text-sm font-medium cursor-pointer ${
                                t.type === 'success'
                                    ? 'bg-green-50 border-green-200 text-green-800 dark:bg-green-950/40 dark:border-green-900/60 dark:text-green-300'
                                    : t.type === 'error'
                                      ? 'bg-red-50 border-red-200 text-red-800 dark:bg-red-950/40 dark:border-red-900/60 dark:text-red-300'
                                      : 'bg-white border-slate-200 text-slate-800 dark:bg-ink-900 dark:border-ink-800 dark:text-slate-100'
                            }`}
                        >
                            <div className="flex items-center gap-2">
                                <span className="text-lg">
                                    {t.type === 'success' ? '✓' : t.type === 'error' ? '✕' : 'ℹ'}
                                </span>
                                <span>{t.message}</span>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used inside ToastProvider');
    return ctx;
};
