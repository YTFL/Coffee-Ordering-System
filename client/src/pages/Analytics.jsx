import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import './Analytics.css';

const Analytics = () => {
    const [stats, setStats] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const [statsRes, ordersRes] = await Promise.all([
                axios.get('/admin/stats'),
                axios.get('/admin/orders')
            ]);

            if (statsRes.data.success) setStats(statsRes.data.data);
            if (ordersRes.data.success) setOrders(ordersRes.data.data);
        } catch (err) {
            console.error('Failed to fetch analytics');
        } finally {
            setLoading(false);
        }
    };

    if (loading || !stats) {
        return (
            <>
                <Navbar />
                <div className="container analytics-page">
                    <h2>Loading Analytics...</h2>
                </div>
            </>
        );
    }

    // Calculate additional metrics
    const totalRevenue = parseFloat(stats.totalRevenue);
    const avgOrderValue = stats.totalOrders > 0 ? (totalRevenue / stats.totalOrders).toFixed(2) : 0;
    const completionRate = stats.totalOrders > 0 ? ((stats.completedOrders / stats.totalOrders) * 100).toFixed(1) : 0;
    const pendingRate = stats.totalOrders > 0 ? ((stats.pendingOrders / stats.totalOrders) * 100).toFixed(1) : 0;

    // Recent activity
    const recentOrders = orders.slice(0, 5);

    return (
        <>
            <Navbar />
            <div className="container analytics-page">
                <h2>Analytics & Insights</h2>

                {/* Key Metrics */}
                <div className="analytics-section">
                    <h3>Key Performance Indicators</h3>
                    <div className="kpi-grid">
                        <div className="kpi-card">
                            <div className="kpi-label">Average Order Value</div>
                            <div className="kpi-value">${avgOrderValue}</div>
                        </div>
                        <div className="kpi-card">
                            <div className="kpi-label">Completion Rate</div>
                            <div className="kpi-value">{completionRate}%</div>
                        </div>
                        <div className="kpi-card">
                            <div className="kpi-label">Revenue per User</div>
                            <div className="kpi-value">${stats.totalUsers > 0 ? (totalRevenue / stats.totalUsers).toFixed(2) : 0}</div>
                        </div>
                        <div className="kpi-card">
                            <div className="kpi-label">Pending Rate</div>
                            <div className="kpi-value">{pendingRate}%</div>
                        </div>
                    </div>
                </div>

                {/* Order Status Breakdown */}
                <div className="analytics-section">
                    <h3>Order Status Distribution</h3>
                    <div className="status-breakdown">
                        <div className="status-bar-container">
                            <div className="status-bar">
                                <div
                                    className="status-segment pending"
                                    style={{ width: `${pendingRate}%` }}
                                    title={`Pending: ${stats.pendingOrders}`}
                                ></div>
                                <div
                                    className="status-segment preparing"
                                    style={{ width: `${stats.totalOrders > 0 ? ((stats.preparingOrders / stats.totalOrders) * 100).toFixed(1) : 0}%` }}
                                    title={`Preparing: ${stats.preparingOrders}`}
                                ></div>
                                <div
                                    className="status-segment completed"
                                    style={{ width: `${completionRate}%` }}
                                    title={`Completed: ${stats.completedOrders}`}
                                ></div>
                            </div>
                            <div className="status-legend">
                                <div className="legend-item">
                                    <span className="legend-color pending"></span>
                                    Pending ({stats.pendingOrders})
                                </div>
                                <div className="legend-item">
                                    <span className="legend-color preparing"></span>
                                    Preparing ({stats.preparingOrders})
                                </div>
                                <div className="legend-item">
                                    <span className="legend-color completed"></span>
                                    Completed ({stats.completedOrders})
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Business Insights */}
                <div className="analytics-section">
                    <h3>Business Insights</h3>
                    <div className="insights-grid">
                        <div className="insight-card">
                            <h4>📈 Revenue Growth</h4>
                            <p>Total revenue of <strong>${stats.totalRevenue}</strong> from {stats.totalOrders} orders</p>
                        </div>
                        <div className="insight-card">
                            <h4>👥 Customer Base</h4>
                            <p><strong>{stats.totalUsers}</strong> registered users with an average spend of ${stats.totalUsers > 0 ? (totalRevenue / stats.totalUsers).toFixed(2) : 0}</p>
                        </div>
                        <div className="insight-card">
                            <h4>☕ Menu Performance</h4>
                            <p><strong>{stats.totalCoffees}</strong> coffee items available with {stats.totalOrders} total orders</p>
                        </div>
                        <div className="insight-card">
                            <h4>⚡ Order Velocity</h4>
                            <p><strong>{stats.pendingOrders + stats.preparingOrders}</strong> active orders currently being processed</p>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="analytics-section">
                    <h3>Recent Order Activity</h3>
                    <div className="recent-activity">
                        {recentOrders.length === 0 ? (
                            <p>No recent orders</p>
                        ) : (
                            <table className="activity-table">
                                <thead>
                                    <tr>
                                        <th>Order ID</th>
                                        <th>Customer</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentOrders.map(order => (
                                        <tr key={order.id}>
                                            <td>#{order.id}</td>
                                            <td>{order.user_name}</td>
                                            <td>${order.total_amount}</td>
                                            <td><span className={`status-badge status-${order.status}`}>{order.status}</span></td>
                                            <td>{new Date(order.created_at).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Analytics;
