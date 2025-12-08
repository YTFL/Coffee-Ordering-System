import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './OrderSuccess.css';

const OrderSuccess = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const orderId = location.state?.orderId;

    return (
        <>
            <Navbar />
            <div className="container order-success-page">
                <div className="success-card">
                    <div className="success-icon">✓</div>
                    <h1>Order Placed Successfully!</h1>
                    <p className="success-message">
                        Thank you for your order. Your coffee is being prepared!
                    </p>
                    {orderId && (
                        <p className="order-id">Order ID: <strong>#{orderId}</strong></p>
                    )}
                    <div className="success-actions">
                        <button
                            onClick={() => navigate('/')}
                            className="btn-home"
                        >
                            Take Me Home
                        </button>
                        <button
                            onClick={() => navigate('/my-orders')}
                            className="btn-orders"
                        >
                            View My Orders
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default OrderSuccess;
