import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { count } = useWishlist();
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const linkClass = ({ isActive }) =>
        `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            isActive
                ? 'bg-brand-50 text-brand-700'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
        }`;

    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
            <nav className="w-full px-4 sm:px-6 lg:px-10">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/home" className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-lg bg-brand-600 flex items-center justify-center">
                            <svg
                                className="w-5 h-5 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                            </svg>
                        </div>
                        <span className="text-lg font-bold text-slate-900">ShopKart</span>
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center gap-1">
                        <NavLink to="/home" className={linkClass}>
                            Home
                        </NavLink>
                        <NavLink to="/products" className={linkClass}>
                            Products
                        </NavLink>
                        <NavLink to="/wishlist" className={linkClass}>
                            <span className="relative inline-flex items-center gap-1.5">
                                Wishlist
                                {count > 0 && (
                                    <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-red-500 text-white text-[10px] font-bold">
                                        {count}
                                    </span>
                                )}
                            </span>
                        </NavLink>
                    </div>

                    {/* Right side */}
                    <div className="hidden md:flex items-center gap-3">
                        {user ? (
                            <>
                                <span className="text-sm text-slate-500">
                                    Hi,{' '}
                                    <span className="font-medium text-slate-800">
                                        {user.fullName?.split(' ')[0]}
                                    </span>
                                </span>
                                <button onClick={handleLogout} className="btn-secondary text-sm">
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="btn-secondary text-sm">
                                    Login
                                </Link>
                                <Link to="/register" className="btn-primary text-sm">
                                    Sign up
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <button
                        className="md:hidden p-2 rounded-lg hover:bg-slate-100 relative"
                        onClick={() => setMobileOpen((v) => !v)}
                        aria-label="Toggle menu"
                    >
                        <svg
                            className="w-6 h-6 text-slate-700"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                        >
                            {mobileOpen ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            ) : (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            )}
                        </svg>
                        {count > 0 && !mobileOpen && (
                            <span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold">
                                {count}
                            </span>
                        )}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileOpen && (
                    <div className="md:hidden pb-4 flex flex-col gap-1 border-t border-slate-100 pt-3 animate-fade-in">
                        <NavLink
                            to="/home"
                            className={linkClass}
                            onClick={() => setMobileOpen(false)}
                        >
                            Home
                        </NavLink>
                        <NavLink
                            to="/products"
                            className={linkClass}
                            onClick={() => setMobileOpen(false)}
                        >
                            Products
                        </NavLink>
                        <NavLink
                            to="/wishlist"
                            className={linkClass}
                            onClick={() => setMobileOpen(false)}
                        >
                            <span className="inline-flex items-center gap-2">
                                Wishlist
                                {count > 0 && (
                                    <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-red-500 text-white text-[10px] font-bold">
                                        {count}
                                    </span>
                                )}
                            </span>
                        </NavLink>
                        {user ? (
                            <button
                                onClick={() => {
                                    setMobileOpen(false);
                                    handleLogout();
                                }}
                                className="text-left px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50"
                            >
                                Logout
                            </button>
                        ) : (
                            <>
                                <NavLink
                                    to="/login"
                                    className={linkClass}
                                    onClick={() => setMobileOpen(false)}
                                >
                                    Login
                                </NavLink>
                                <NavLink
                                    to="/register"
                                    className={linkClass}
                                    onClick={() => setMobileOpen(false)}
                                >
                                    Sign up
                                </NavLink>
                            </>
                        )}
                    </div>
                )}
            </nav>
        </header>
    );
};

export default Navbar;
