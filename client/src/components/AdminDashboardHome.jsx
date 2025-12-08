import React from 'react';
import { Link } from 'react-router-dom';
import './AdminDashboardHome.css';

const AdminDashboard = ({ stats }) => {
    return (
        <div className="admin-dashboard-home">
            <h2>Dashboard</h2>

            {/* First Row - 4 items */}
            <div className="stats-row">
                <div className="stat-card orders">
                    <div className="stat-icon">📦</div>
                    <div className="stat-info">
                        <h3>{stats.totalOrders}</h3>
                        <p>Total Orders</p>
                    </div>
                </div>

                <div className="stat-card completed">
                    <div className="stat-icon">✅</div>
                    <div className="stat-info">
                        <h3>{stats.completedOrders}</h3>
                        <p>Completed</p>
                    </div>
                </div>

                <div className="stat-card pending">
                    <div className="stat-icon">⏳</div>
                    <div className="stat-info">
                        <h3>{stats.pendingOrders}</h3>
                        <p>Pending Orders</p>
                    </div>
                </div>

                <div className="stat-card preparing">
                    <div className="stat-icon">☕</div>
                    <div className="stat-info">
                        <h3>{stats.preparingOrders}</h3>
                        <p>Preparing</p>
                    </div>
                </div>
            </div>

            {/* Second Row - 3 items centered */}
            <div className="stats-row stats-row-centered">
                <div className="stat-card coffees">
                    <div className="stat-icon">☕</div>
                    <div className="stat-info">
                        <h3>{stats.totalCoffees}</h3>
                        <p>Coffee Items</p>
                    </div>
                </div>

                <div className="stat-card users">
                    <div className="stat-icon">👥</div>
                    <div className="stat-info">
                        <h3>{stats.totalUsers}</h3>
                        <p>Total Users</p>
                    </div>
                </div>

                <div className="stat-card revenue">
                    <div className="stat-icon">💰</div>
                    <div className="stat-info">
                        <h3>${stats.totalRevenue}</h3>
                        <p>Total Revenue</p>
                    </div>
                </div>
            </div>

            <div className="admin-quick-actions">
                <h3>Quick Actions</h3>
                <div className="action-buttons">
                    <Link to="/analytics" className="action-btn">
                        <span>📊</span> Analytics
                    </Link>
                    <Link to="/admin" className="action-btn">
                        <span>📦</span> View All Orders
                    </Link>
                    <Link to="/menu" className="action-btn">
                        <span>☕</span> Manage Menu
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
