import { createContext, useCallback, useContext, useState } from 'react';

const ToastContext = createContext(null);

let idCounter = 0;

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
            {/* Toast viewport */}
            <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        onClick={() => removeToast(t.id)}
                        className={`pointer-events-auto min-w-[240px] max-w-sm px-4 py-3 rounded-xl shadow-lg border text-sm font-medium animate-slide-up cursor-pointer ${
                            t.type === 'success'
                                ? 'bg-green-50 border-green-200 text-green-800'
                                : t.type === 'error'
                                  ? 'bg-red-50 border-red-200 text-red-800'
                                  : 'bg-white border-slate-200 text-slate-800'
                        }`}
                    >
                        <div className="flex items-center gap-2">
                            <span className="text-lg">
                                {t.type === 'success' ? '✓' : t.type === 'error' ? '✕' : 'ℹ'}
                            </span>
                            <span>{t.message}</span>
                        </div>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used inside ToastProvider');
    return ctx;
};
