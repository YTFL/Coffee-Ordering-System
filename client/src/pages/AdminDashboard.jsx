import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import './Admin.css';

const AdminDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [statusFilter, setStatusFilter] = useState('all');
    const [expandedOrder, setExpandedOrder] = useState(null);
    const [orderDetails, setOrderDetails] = useState({});

    useEffect(() => {
        fetchOrders();
    }, []);

    useEffect(() => {
        filterOrders();
    }, [orders, statusFilter]);

    const fetchOrders = async () => {
        try {
            const res = await axios.get('/admin/orders');
            if (res.data.success) setOrders(res.data.data);
        } catch (err) { console.error(err); }
    };

    const filterOrders = () => {
        if (statusFilter === 'all') {
            setFilteredOrders(orders);
        } else {
            setFilteredOrders(orders.filter(order => order.status === statusFilter));
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await axios.patch(`/admin/orders/${id}/status`, { status });
            fetchOrders();
        } catch (err) { alert('Update failed'); }
    };

    const toggleOrderDetails = async (orderId) => {
        if (expandedOrder === orderId) {
            setExpandedOrder(null);
        } else {
            setExpandedOrder(orderId);
            if (!orderDetails[orderId]) {
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
        }
    };

    const getStatusCount = (status) => {
        if (status === 'all') return orders.length;
        return orders.filter(o => o.status === status).length;
    };

    return (
        <>
            <Navbar />
            <div className="container admin-page">
                <h2>Orders Management</h2>

                {/* Status Filter Tabs */}
                <div className="status-filters">
                    <button
                        className={statusFilter === 'all' ? 'active' : ''}
                        onClick={() => setStatusFilter('all')}
                    >
                        All Orders ({getStatusCount('all')})
                    </button>
                    <button
                        className={statusFilter === 'pending' ? 'active' : ''}
                        onClick={() => setStatusFilter('pending')}
                    >
                        Pending ({getStatusCount('pending')})
                    </button>
                    <button
                        className={statusFilter === 'preparing' ? 'active' : ''}
                        onClick={() => setStatusFilter('preparing')}
                    >
                        Preparing ({getStatusCount('preparing')})
                    </button>
                    <button
                        className={statusFilter === 'completed' ? 'active' : ''}
                        onClick={() => setStatusFilter('completed')}
                    >
                        Completed ({getStatusCount('completed')})
                    </button>
                    <button
                        className={statusFilter === 'cancelled' ? 'active' : ''}
                        onClick={() => setStatusFilter('cancelled')}
                    >
                        Cancelled ({getStatusCount('cancelled')})
                    </button>
                </div>

                <div className="admin-orders">
                    <h3>{statusFilter === 'all' ? 'All Orders' : `${statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)} Orders`}</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>User</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Action</th>
                                <th>Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map(order => (
                                <React.Fragment key={order.id}>
                                    <tr>
                                        <td>{order.id}</td>
                                        <td>{order.user_name}</td>
                                        <td>${order.total_amount}</td>
                                        <td><span className={`status-badge status-${order.status}`}>{order.status}</span></td>
                                        <td>{new Date(order.created_at).toLocaleDateString()}</td>
                                        <td>
                                            <select
                                                value={order.status}
                                                onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="preparing">Preparing</option>
                                                <option value="completed">Completed</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                        </td>
                                        <td>
                                            <button
                                                onClick={() => toggleOrderDetails(order.id)}
                                                className="btn-view-details"
                                            >
                                                {expandedOrder === order.id ? '▼ Hide' : '▶ View'}
                                            </button>
                                        </td>
                                    </tr>
                                    {expandedOrder === order.id && orderDetails[order.id] && (
                                        <tr className="order-details-row">
                                            <td colSpan="7">
                                                <div className="order-details-content">
                                                    <h4>Order Items:</h4>
                                                    <div className="order-items-list">
                                                        {orderDetails[order.id].items.map((item, idx) => (
                                                            <div key={idx} className="order-item-detail">
                                                                <img src={item.image_url} alt={item.coffee_name} />
                                                                <div className="item-detail-info">
                                                                    <strong>{item.coffee_name}</strong>
                                                                    <p>Quantity: {item.quantity}</p>
                                                                    <p>Price: ${item.price_at_time} each</p>
                                                                </div>
                                                                <div className="item-detail-total">
                                                                    ${(item.price_at_time * item.quantity).toFixed(2)}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="order-detail-summary">
                                                        <strong>Total: ${orderDetails[order.id].total_amount}</strong>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                    {filteredOrders.length === 0 && (
                        <p className="no-orders">No orders found with this status.</p>
                    )}
                </div>
            </div>
        </>
    );
};

export default AdminDashboard;
