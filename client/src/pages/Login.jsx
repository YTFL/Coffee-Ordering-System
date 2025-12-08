
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Navbar from '../components/Navbar';
import './Auth.css';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const { login } = useAuth();
    const { addToast } = useToast();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const success = await login(formData.email, formData.password);
            if (success) {
                addToast('Login successful!', 'success');
                navigate('/');
            } else {
                addToast('Login failed. Please check your credentials.', 'error');
            }
        } catch (err) {
            addToast(err.response?.data?.message || 'An error occurred during login', 'error');
        }
    };

    return (
        <>
            <Navbar />
            <div className="auth-container">
                <div className="auth-card">
                    <h2>Login</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <button type="submit" className="btn-primary">Login</button>
                    </form>
                    <p className="auth-footer">
                        Don't have an account? <Link to="/register">Register</Link>
                    </p>
                </div>
            </div>
        </>
    );
};

export default Login;
