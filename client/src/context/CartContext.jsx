import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (coffee, quantity = 1) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === coffee.id);
            if (existingItem) {
                return prevItems.map(item =>
                    item.id === coffee.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [...prevItems, { ...coffee, quantity }];
        });
    };

    const removeFromCart = (coffeeId) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== coffeeId));
    };

    const updateQuantity = (coffeeId, quantity) => {
        if (quantity < 1) {
            removeFromCart(coffeeId);
            return;
        }
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === coffeeId ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const cartTotal = cartItems.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0);

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal }}>
            {children}
        </CartContext.Provider>
    );
};
