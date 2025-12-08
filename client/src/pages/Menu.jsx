
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import CoffeeCard from '../components/CoffeeCard';
import Pagination from '../components/Pagination';
import Loader from '../components/Loader';
import StarRating from '../components/StarRating';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import './Menu.css';

const Menu = () => {
    const { user } = useAuth();
    const { addToast } = useToast();
    const [coffees, setCoffees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedCoffee, setSelectedCoffee] = useState(null);
    const [reviews, setReviews] = useState([]);

    // Admin Form State
    const [showAddForm, setShowAddForm] = useState(false);
    const [coffeeForm, setCoffeeForm] = useState({
        name: '',
        description: '',
        price: '',
        image_url: '',
        available: 1
    });

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(8);

    useEffect(() => {
        fetchCoffees();
    }, []);

    const fetchCoffees = async () => {
        try {
            const res = await axios.get('/coffees');
            if (res.data.success) {
                setCoffees(res.data.data);
            }
        } catch (err) {
            setError('Failed to load menu.');
        } finally {
            setLoading(false);
        }
    };

    const fetchReviews = async (coffeeId) => {
        try {
            const res = await axios.get(`/feedback/coffee/${coffeeId}`);
            if (res.data.success) {
                setReviews(res.data.data);
            }
        } catch (err) {
            console.error('Failed to load reviews');
        }
    };

    const handleViewReviews = (coffee) => {
        setSelectedCoffee(coffee);
        fetchReviews(coffee.id);
    };

    const handleCoffeeSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/admin/coffees', coffeeForm);
            addToast('Coffee item added successfully!', 'success');
            setCoffeeForm({ name: '', description: '', price: '', image_url: '', available: 1 });
            setShowAddForm(false);
            fetchCoffees();
        } catch (err) {
            addToast('Failed to add coffee item', 'error');
        }
    };

    const handleDeleteCoffee = async (id) => {
        if (!window.confirm('Are you sure you want to delete this item?')) return;
        try {
            await axios.delete(`/admin/coffees/${id}`);
            addToast('Coffee item deleted', 'success');
            fetchCoffees();
        } catch (err) {
            addToast('Failed to delete item', 'error');
        }
    };

    const handleToggleAvailability = async (coffee) => {
        try {
            await axios.put(`/admin/coffees/${coffee.id}`, {
                ...coffee,
                available: coffee.available ? 0 : 1
            });
            addToast('Availability updated', 'success');
            fetchCoffees();
        } catch (err) {
            addToast('Failed to update availability', 'error');
        }
    };

    // Get current coffees
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentCoffees = coffees.slice(indexOfFirstPost, indexOfLastPost);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const isAdmin = user && user.role === 'admin';

    return (
        <>
            <Navbar />
            {loading && <Loader />}
            <div className="container menu-page">
                <h2 className="page-title">{isAdmin ? 'Manage Menu' : 'Our Menu'}</h2>

                {/* Admin Add Button */}
                {isAdmin && (
                    <div className="admin-menu-controls">
                        <button
                            onClick={() => setShowAddForm(!showAddForm)}
                            className="btn-add-coffee"
                        >
                            {showAddForm ? 'Cancel' : '+ Add New Coffee'}
                        </button>
                    </div>
                )}

                {/* Admin Add Form */}
                {isAdmin && showAddForm && (
                    <div className="coffee-add-form">
                        <h3>Add New Coffee Item</h3>
                        <form onSubmit={handleCoffeeSubmit}>
                            <input
                                type="text"
                                placeholder="Name"
                                required
                                value={coffeeForm.name}
                                onChange={e => setCoffeeForm({ ...coffeeForm, name: e.target.value })}
                            />
                            <textarea
                                placeholder="Description"
                                required
                                value={coffeeForm.description}
                                onChange={e => setCoffeeForm({ ...coffeeForm, description: e.target.value })}
                            />
                            <input
                                type="number"
                                placeholder="Price"
                                step="0.01"
                                required
                                value={coffeeForm.price}
                                onChange={e => setCoffeeForm({ ...coffeeForm, price: e.target.value })}
                            />
                            <input
                                type="text"
                                placeholder="Image URL"
                                value={coffeeForm.image_url}
                                onChange={e => setCoffeeForm({ ...coffeeForm, image_url: e.target.value })}
                            />
                            <button type="submit" className="btn-primary">Add Coffee</button>
                        </form>
                    </div>
                )}

                {error ? (
                    <p className="error">{error}</p>
                ) : (
                    <>
                        {isAdmin ? (
                            /* Admin List View */
                            <div className="admin-coffee-list">
                                {coffees.map(coffee => (
                                    <div key={coffee.id} className="admin-coffee-item">
                                        <img src={coffee.image_url} alt={coffee.name} />
                                        <div className="admin-coffee-info">
                                            <h3>{coffee.name}</h3>
                                            <p>{coffee.description}</p>
                                            <p>Rating: {coffee.rating ? Number(coffee.rating).toFixed(1) : 'N/A'} ⭐ ({coffee.reviewCount || 0} reviews)</p>
                                        </div>
                                        <div className="admin-coffee-price">${coffee.price}</div>
                                        <div className="admin-coffee-actions">
                                            <button
                                                onClick={() => handleViewReviews(coffee)}
                                                className="btn-view-reviews"
                                            >
                                                📊 Reviews
                                            </button>
                                            <button
                                                onClick={() => handleToggleAvailability(coffee)}
                                                className={`btn-toggle ${coffee.available ? 'available' : 'unavailable'}`}
                                            >
                                                {coffee.available ? '✓ Available' : '✗ Unavailable'}
                                            </button>
                                            <button
                                                onClick={() => handleDeleteCoffee(coffee.id)}
                                                className="btn-delete-coffee"
                                            >
                                                🗑️ Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            /* Customer Grid View */
                            <>
                                <div className="coffee-grid">
                                    {currentCoffees.map(coffee => (
                                        <CoffeeCard key={coffee.id} coffee={coffee} />
                                    ))}
                                </div>
                                <Pagination
                                    postsPerPage={postsPerPage}
                                    totalPosts={coffees.length}
                                    paginate={paginate}
                                    currentPage={currentPage}
                                />
                            </>
                        )}
                    </>
                )}
            </div>

            {/* Reviews Modal */}
            {isAdmin && selectedCoffee && (
                <div className="reviews-modal" onClick={() => setSelectedCoffee(null)}>
                    <div className="reviews-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Reviews for {selectedCoffee.name}</h3>
                            <button onClick={() => setSelectedCoffee(null)} className="close-btn">×</button>
                        </div>
                        <div className="modal-body">
                            {reviews.length === 0 ? (
                                <p>No reviews yet.</p>
                            ) : (
                                reviews.map(review => (
                                    <div key={review.id} className="review-item">
                                        <div className="review-header">
                                            <strong>{review.user_name}</strong>
                                            <StarRating rating={review.rating} readOnly={true} />
                                        </div>
                                        <p>{review.comment}</p>
                                        <small>{new Date(review.created_at).toLocaleDateString()}</small>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Menu;
