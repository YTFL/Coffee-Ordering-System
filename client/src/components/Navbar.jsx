import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { cartItems } = useCart();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <nav className="navbar">
            <div className="container navbar-container">
                <Link to="/" className="navbar-logo">
                    ☕ CoffeeShop
                </Link>
                <ul className="navbar-menu">
                    <li><Link to="/">{user && user.role === 'admin' ? 'Dashboard' : 'Home'}</Link></li>
                    <li><Link to="/menu">{user && user.role === 'admin' ? 'Manage Menu' : 'Menu'}</Link></li>
                    {user ? (
                        <>
                            {user.role === 'admin' ? (
                                <>
                                    <li><Link to="/analytics">Analytics</Link></li>
                                    <li><Link to="/admin">Orders</Link></li>
                                </>
                            ) : (
                                <>
                                    <li><Link to="/my-orders">My Orders</Link></li>
                                    <li>
                                        <Link to="/cart" className="cart-link">
                                            Cart
                                            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                                        </Link>
                                    </li>
                                    <li><Link to="/profile">Profile</Link></li>
                                </>
                            )}
                            <li><button onClick={handleLogout} className="btn-logout">Logout</button></li>
                        </>
                    ) : (
                        <>
                            <li><Link to="/login">Login</Link></li>
                            <li><Link to="/register">Register</Link></li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
