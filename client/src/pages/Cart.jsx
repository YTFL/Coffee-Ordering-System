
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import './Cart.css';

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();
    const { token } = useAuth();
    const { addToast } = useToast();
    const navigate = useNavigate();
    const [checkingOut, setCheckingOut] = useState(false);

    const handleCheckout = async () => {
        if (!token) {
            addToast('Please login to place an order.', 'warning');
            navigate('/login');
            return;
        }
        setCheckingOut(true);
        try {
            const items = cartItems.map(item => ({
                coffee_id: item.id,
                quantity: item.quantity
            }));

            const res = await axios.post('/orders', { items });
            if (res.data.success) {
                addToast('Order placed successfully!', 'success');
                clearCart();
                navigate('/order-success', { state: { orderId: res.data.orderId } });
            }
        } catch (err) {
            addToast('Checkout failed. Please try again.', 'error');
        } finally {
            setCheckingOut(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <>
                <Navbar />
                <div className="container cart-empty">
                    <h2>Your Cart is Empty</h2>
                    <button onClick={() => navigate('/menu')} className="btn-primary">Browse Menu</button>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="container cart-page">
                <h2>Your Cart</h2>
                <div className="cart-items">
                    {cartItems.map(item => (
                        <div key={item.id} className="cart-item">
                            <img src={item.image_url} alt={item.name} />
                            <div className="item-info">
                                <h3>{item.name}</h3>
                                <p>${item.price}</p>
                            </div>
                            <div className="item-quantity">
                                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>-</button>
                                <span>{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                            </div>
                            <p className="item-total">${(item.price * item.quantity).toFixed(2)}</p>
                            <button onClick={() => removeFromCart(item.id)} className="btn-remove">×</button>
                        </div>
                    ))}
                </div>
                <div className="cart-summary">
                    <h3>Total: ${cartTotal.toFixed(2)}</h3>
                    <button
                        onClick={handleCheckout}
                        className="btn-checkout"
                        disabled={checkingOut}
                    >
                        {checkingOut ? 'Processing...' : 'Checkout'}
                    </button>
                </div>
            </div>
        </>
    );
};

export default Cart;
