
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import CoffeeCard from '../components/CoffeeCard';
import Loader from '../components/Loader';
import AdminDashboardHome from '../components/AdminDashboardHome';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
    const { user } = useAuth();
    const [recentOrders, setRecentOrders] = useState({ active: [], past: [] });
    const [featuredCoffees, setFeaturedCoffees] = useState([]);
    const [adminStats, setAdminStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch coffees for featured/suggestions
                const coffeeRes = await axios.get('/coffees');
                if (coffeeRes.data.success) {
                    const allCoffees = coffeeRes.data.data;
                    const shuffled = [...allCoffees].sort(() => 0.5 - Math.random());
                    setFeaturedCoffees(shuffled.slice(0, 3));
                }

                // If user is logged in
                if (user) {
                    // If admin, fetch admin stats
                    if (user.role === 'admin') {
                        const statsRes = await axios.get('/admin/stats');
                        if (statsRes.data.success) {
                            setAdminStats(statsRes.data.data);
                        }
                    } else {
                        // If regular user, fetch recent orders
                        const orderRes = await axios.get('/orders/my-orders?limit=10');
                        if (orderRes.data.success) {
                            const allOrders = orderRes.data.data;
                            const active = allOrders.filter(o => ['pending', 'preparing'].includes(o.status));
                            const past = allOrders.filter(o => ['completed', 'cancelled'].includes(o.status)).slice(0, 3);

                            setRecentOrders({ active, past });
                        }
                    }
                }
            } catch (err) {
                console.error('Failed to fetch home data', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    return (
        <>
            <Navbar />

            {/* Hero Section - Only for non-admin users */}
            {(!user || user.role !== 'admin') && (
                <div className="home-hero">
                    <div className="container hero-content">
                        <h1>{user ? `Welcome back, ${user.name}!` : 'Fresh Coffee, Delivered.'}</h1>
                        <p>Start your day with the perfect brew. Order now and skip the line.</p>
                        <Link to="/menu" className="btn-hero">Order Now</Link>
                    </div>
                </div>
            )}

            <div className="container home-content">
                {/* Admin Dashboard for Admin Users */}
                {user && user.role === 'admin' && adminStats ? (
                    <AdminDashboardHome stats={adminStats} />
                ) : (
                    <>
                        {/* Featured/Suggested Section */}
                        <section className="section-featured">
                            <h2>{user ? 'Recommended for You' : 'Trending Now'}</h2>
                            {loading ? <Loader /> : (
                                <div className="coffee-grid">
                                    {featuredCoffees.map(coffee => (
                                        <CoffeeCard key={coffee.id} coffee={coffee} />
                                    ))}
                                </div>
                            )}
                        </section>

                        {/* Active Orders Section */}
                        {user && recentOrders.active && recentOrders.active.length > 0 && (
                            <section className="section-recent active-orders">
                                <div className="section-header-home">
                                    <h2>Current Orders</h2>
                                    <Link to="/my-orders" className="view-all-link">Track Orders</Link>
                                </div>
                                <div className="recent-orders-grid">
                                    {recentOrders.active.map(order => (
                                        <div key={order.id} className="mini-order-card active-card-highlight">
                                            <div className="mini-order-header">
                                                <span className="mini-id">#{order.id}</span>
                                                <span className={`status-badge-mini status-${order.status}`}>{order.status}</span>
                                            </div>
                                            <p className="mini-date">{new Date(order.created_at).toLocaleDateString()}</p>
                                            <p className="mini-items">{order.item_count} items</p>
                                            <div className="active-loader">
                                                <span className="dot">.</span><span className="dot">.</span><span className="dot">.</span>
                                            </div>
                                            <p className="mini-total">${order.total_amount}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Recent History Section */}
                        {user && recentOrders.past && recentOrders.past.length > 0 && (
                            <section className="section-recent">
                                <div className="section-header-home">
                                    <h2>Recent History</h2>
                                    {(!recentOrders.active || recentOrders.active.length === 0) &&
                                        <Link to="/my-orders" className="view-all-link">View All Orders</Link>
                                    }
                                </div>
                                <div className="recent-orders-grid">
                                    {recentOrders.past.map(order => (
                                        <div key={order.id} className="mini-order-card">
                                            <div className="mini-order-header">
                                                <span className="mini-id">#{order.id}</span>
                                                <span className={`status-dot status-${order.status}`}></span>
                                            </div>
                                            <p className="mini-date">{new Date(order.created_at).toLocaleDateString()}</p>
                                            <p className="mini-items">{order.item_count} items</p>
                                            <p className="mini-total">${order.total_amount}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </>
                )}
            </div>
        </>
    );
};

export default Home;
