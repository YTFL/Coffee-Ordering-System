
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Loader from '../components/Loader';
import './MyOrders.css';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrders, setExpandedOrders] = useState({});
    const [orderDetails, setOrderDetails] = useState({});

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await axios.get('/orders/my-orders');
                if (res.data.success) {
                    setOrders(res.data.data);
                }
            } catch (err) {
                console.error('Failed to fetch orders');
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const toggleOrderDetails = async (orderId) => {
        // Toggle expansion
        setExpandedOrders(prev => ({
            ...prev,
            [orderId]: !prev[orderId]
        }));

        // Fetch details if not already loaded
        if (!orderDetails[orderId] && !expandedOrders[orderId]) {
            try {
                const res = await axios.get(`/orders/${orderId}`);
                if (res.data.success) {
                    setOrderDetails(prev => ({
                        ...prev,
                        [orderId]: res.data.data
                    }));
                }
            } catch (err) {
                console.error('Failed to fetch order details');
            }
        }
    };

    if (loading) return <Loader />;

    return (
        <>
            <Navbar />
            <div className="container my-orders-page">
                <h2 className="page-title">My Orders</h2>
                <div className="order-history">
                    {orders.length === 0 ? (
                        <p>No orders yet.</p>
                    ) : (
                        <div className="orders-list">
                            {orders.map(order => (
                                <div key={order.id} className="order-card">
                                    <div
                                        className="order-header"
                                        onClick={() => toggleOrderDetails(order.id)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <div>
                                            <span className="order-id">Order #{order.id}</span>
                                            <span className="order-date"> • {new Date(order.created_at).toLocaleDateString()}</span>
                                        </div>
                                        <div>
                                            <span className={`status-badge status-${order.status}`}>{order.status}</span>
                                            <span className="expand-icon">{expandedOrders[order.id] ? '▼' : '▶'}</span>
                                        </div>
                                    </div>
                                    <div className="order-summary">
                                        <span>{order.item_count} items</span>
                                        <span className="order-total">${order.total_amount}</span>
                                    </div>

                                    {expandedOrders[order.id] && (
                                        <div className="order-details">
                                            {orderDetails[order.id] ? (
                                                <div className="order-items">
                                                    <h4>Order Items:</h4>
                                                    {orderDetails[order.id].items.map((item, idx) => (
                                                        <div key={idx} className="order-item">
                                                            <img src={item.image_url} alt={item.coffee_name} className="item-image" />
                                                            <div className="item-info">
                                                                <span className="item-name">{item.coffee_name}</span>
                                                                <span className="item-quantity">Qty: {item.quantity}</span>
                                                            </div>
                                                            <span className="item-price">${(item.price_at_time * item.quantity).toFixed(2)}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <Loader />
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default MyOrders;
