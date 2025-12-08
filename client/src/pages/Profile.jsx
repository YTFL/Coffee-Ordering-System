
import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import './Profile.css';

const Profile = () => {
    const { user, setUser } = useAuth();
    const { addToast } = useToast();

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user.name,
        email: user.email,
        phone: user.phone || ''
    });

    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showPasswordForm, setShowPasswordForm] = useState(false);

    const handleInfoChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handleInfoSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put('/users/me', formData);
            if (res.data.success) {
                setUser({ ...user, ...formData });
                addToast('Profile updated successfully!', 'success');
                setIsEditing(false);
            }
        } catch (err) {
            addToast(err.response?.data?.message || 'Failed to update profile.', 'error');
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            return addToast('New passwords do not match.', 'error');
        }

        try {
            const res = await axios.put('/users/me/password', {
                oldPassword: passwordData.oldPassword,
                newPassword: passwordData.newPassword
            });
            if (res.data.success) {
                addToast('Password updated successfully!', 'success');
                setShowPasswordForm(false);
                setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
            }
        } catch (err) {
            addToast(err.response?.data?.message || 'Failed to update password.', 'error');
        }
    };

    return (
        <>
            <Navbar />
            <div className="container profile-page">
                <div className="profile-header">
                    <h2>My Profile</h2>
                </div>

                <div className="profile-section">
                    <div className="section-header">
                        <h3>Personal Information</h3>
                        <button
                            className="btn-link"
                            onClick={() => setIsEditing(!isEditing)}
                        >
                            {isEditing ? 'Cancel' : 'Edit'}
                        </button>
                    </div>

                    {isEditing ? (
                        <form onSubmit={handleInfoSubmit} className="edit-form">
                            <div className="form-group">
                                <label>Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInfoChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInfoChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Phone</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInfoChange}
                                />
                            </div>
                            <button type="submit" className="btn-primary">Save Changes</button>
                        </form>
                    ) : (
                        <div className="info-display">
                            <div className="profile-info-group">
                                <label>Name</label>
                                <p>{user.name}</p>
                            </div>
                            <div className="profile-info-group">
                                <label>Email</label>
                                <p>{user.email}</p>
                            </div>
                            <div className="profile-info-group">
                                <label>Phone</label>
                                <p>{user.phone || 'N/A'}</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="profile-section security-section">
                    <div className="section-header">
                        <h3>Security</h3>
                        <button
                            className="btn-link"
                            onClick={() => setShowPasswordForm(!showPasswordForm)}
                        >
                            {showPasswordForm ? 'Cancel' : 'Change Password'}
                        </button>
                    </div>

                    {showPasswordForm && (
                        <form onSubmit={handlePasswordSubmit} className="edit-form">
                            <div className="form-group">
                                <label>Current Password</label>
                                <input
                                    type="password"
                                    name="oldPassword"
                                    value={passwordData.oldPassword}
                                    onChange={handlePasswordChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>New Password</label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={passwordData.newPassword}
                                    onChange={handlePasswordChange}
                                    required
                                    minLength="6"
                                />
                            </div>
                            <div className="form-group">
                                <label>Confirm New Password</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={passwordData.confirmPassword}
                                    onChange={handlePasswordChange}
                                    required
                                    minLength="6"
                                />
                            </div>
                            <button type="submit" className="btn-primary">Update Password</button>
                        </form>
                    )}
                </div>
            </div>
        </>
    );
};

export default Profile;
