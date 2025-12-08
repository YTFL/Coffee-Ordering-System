
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import StarRating from '../components/StarRating';
import Loader from '../components/Loader';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import './CoffeeDetails.css';

const CoffeeDetails = () => {
    const { id } = useParams();
    const [coffee, setCoffee] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { addToCart, cartItems, updateQuantity } = useCart();
    const { user, token } = useAuth();
    const { addToast } = useToast();

    // Rating State
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [coffeeRes, reviewsRes] = await Promise.all([
                    axios.get(`/coffees/${id}`),
                    axios.get(`/feedback/coffee/${id}`)
                ]);

                if (coffeeRes.data.success) setCoffee(coffeeRes.data.data);
                if (reviewsRes.data.success) setReviews(reviewsRes.data.data);
            } catch (err) {
                setError('Failed to load coffee details.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleAddToCart = (item) => {
        addToCart(item);
        addToast(`${item.name} added to cart!`, 'success');
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!token) return addToast('Please login to leave a review', 'warning');
        setSubmitting(true);
        try {
            await axios.post('/feedback', { coffee_id: id, rating, comment });
            addToast('Review submitted!', 'success');
            // Refresh reviews
            const reviewsRes = await axios.get(`/feedback/coffee/${id}`);
            if (reviewsRes.data.success) setReviews(reviewsRes.data.data);
            setComment('');
            setRating(5);
        } catch (err) {
            addToast('Failed to submit review', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <Loader />;
    if (error || !coffee) return <div>Error: {error || 'Coffee not found'}</div>;

    return (
        <>
            <Navbar />
            <div className="container details-page">
                <div className="details-grid">
                    <img src={coffee.image_url} alt={coffee.name} className="details-image" />
                    <div className="details-content">
                        <h1>{coffee.name}</h1>
                        <p className="price">${coffee.price}</p>
                        <p className="description">{coffee.description}</p>
                        {coffee.available ? (() => {
                            const cartItem = cartItems.find(item => item.id === coffee.id);
                            return cartItem ? (
                                <div className="quantity-controls-large">
                                    <button onClick={() => updateQuantity(coffee.id, cartItem.quantity - 1)}>-</button>
                                    <span>{cartItem.quantity}</span>
                                    <button onClick={() => updateQuantity(coffee.id, cartItem.quantity + 1)}>+</button>
                                </div>
                            ) : (
                                <button className="btn-add-large" onClick={() => handleAddToCart(coffee)}>
                                    Add to Cart
                                </button>
                            );
                        })() : (
                            <p className="sold-out">Sold Out</p>
                        )}

                        <div className="rating-summary">
                            <h3>Average Rating: {coffee.rating ? Number(coffee.rating).toFixed(1) : 'NA'} ⭐</h3>
                            <p>({coffee.reviewCount || 0} reviews)</p>
                        </div>
                    </div>
                </div>

                <div className="reviews-section">
                    <h2>Reviews</h2>
                    {user && (
                        <form onSubmit={handleReviewSubmit} className="review-form">
                            <h4>Leave a Review</h4>
                            <div className="form-group">
                                <label>Rating:</label>
                                <StarRating rating={rating} setRating={setRating} />
                            </div>
                            <div className="form-group">
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Share your thoughts..."
                                    required
                                />
                            </div>
                            <button type="submit" disabled={submitting} className="btn-primary">Submit Review</button>
                        </form>
                    )}

                    <div className="reviews-list">
                        {reviews.length === 0 ? <p>No reviews yet.</p> : (
                            reviews.map(review => (
                                <div key={review.id} className="review-card">
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
        </>
    );
};

export default CoffeeDetails;
