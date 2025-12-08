import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import './CoffeeCard.css';

const CoffeeCard = ({ coffee }) => {
    const { cartItems, addToCart, removeFromCart, updateQuantity } = useCart();
    const { addToast } = useToast();

    // Find quantity of this coffee in cart
    const cartItem = cartItems.find(item => item.id === coffee.id);
    const quantity = cartItem ? cartItem.quantity : 0;

    const handleAddToCart = () => {
        addToCart(coffee);
        addToast(`${coffee.name} added to cart!`, 'success');
    };

    const handleIncrement = () => {
        updateQuantity(coffee.id, quantity + 1);
    };

    const handleDecrement = () => {
        if (quantity > 1) {
            updateQuantity(coffee.id, quantity - 1);
        } else {
            removeFromCart(coffee.id);
        }
    };

    return (
        <div className="coffee-card">
            <img src={coffee.image_url} alt={coffee.name} className="coffee-image" />
            <div className="coffee-details">
                <h3>{coffee.name}</h3>
                <p className="coffee-description">{coffee.description.substring(0, 60)}...</p>
                <div className="coffee-footer">
                    <span className="coffee-price">${coffee.price}</span>
                    <div className="coffee-actions">
                        <Link to={`/coffee/${coffee.id}`} className="btn-view">Details</Link>

                        {quantity > 0 ? (
                            <div className="quantity-controls">
                                <button className="btn-qty" onClick={handleDecrement}>-</button>
                                <span className="qty-display">{quantity}</span>
                                <button className="btn-qty" onClick={handleIncrement}>+</button>
                            </div>
                        ) : (
                            <button
                                className="btn-add"
                                disabled={!coffee.available}
                                onClick={handleAddToCart}
                            >
                                {coffee.available ? 'Add' : 'Sold Out'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CoffeeCard;
