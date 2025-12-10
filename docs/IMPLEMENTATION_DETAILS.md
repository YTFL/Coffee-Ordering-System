# Implementation Analysis and Details

## 5.1 Problem Analysis and Description

The core problem addressed by the Coffee Ordering System is the inefficiency inherent in traditional, manual coffee ordering processes. In many coffee shops, customers face:

1.  **Long Wait Times:** Queuing to place orders and then waiting again for preparation.
2.  **Order Errors:** Verbal communication often leads to mistakes in customization (e.g., milk type, sugar levels).
3.  **Lack of Transparency:** Customers are often unsure about the status of their order.
4.  **Operational Bottlenecks:** Staff are overwhelmed by managing payments, taking orders, and making coffee simultaneously.

This project solves these issues by decoupling the ordering process from the physical counter. By moving the ordering, customization, and payment to a digital platform, the system allows:
*   **Asynchronous Ordering:** Customers can order from their tables or before arriving.
*   **Precision:** Digital selection eliminates communication errors.
*   **Real-time Updates:** Status tracking keeps customers informed.
*   **Streamlined Operations:** Staff can focus purely on fulfillment.

## 5.2 Modules Identified

The system is architected into two main functional areas (Frontend and Backend), further divided into specific modules:

### A. Frontend Modules (Client)
*   **Authentication Module:** Manages user registration, login, and secure token storage.
*   **Product Catalog Module:** Displays the coffee menu with images, descriptions, and prices.
*   **Cart & Order Management Module:** Handles adding items to the cart, modifying quantities, calculating totals, and finalizing the purchase.
*   **Dashboard Module:** Provides customers with order history and profile management tools.

### B. Backend Modules (Server)
*   **API Gateway (Routes):** directing incoming HTTP requests to appropriate controllers.
*   **Authentication Service:** Validates user credentials and issues JWTs.
*   **Order Processing Service:** Validates order details, calculates costs server-side, and updates database records.
*   **Database Interface (Models):** a structured interaction layer with the MySQL database.

---

## 5.3 Complete Commented Source Code (Key Components)

The following section lists the critical source code files that drive the core functionality of the Coffee Ordering System.

### 1. Authentication Controller (`server/src/controllers/authController.js`)
*Handles user registration and login logic.*

```javascript
const bcrypt = require('bcryptjs'); // For password hashing
const jwt = require('jsonwebtoken'); // For generating auth tokens
const User = require('../models/User');

// Register a new user
exports.register = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        // Check if user already exists
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email already registered' });
        }

        // Hash the password for security
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create user in database
        const userId = await User.create(name, email, hashedPassword, phone);

        res.status(201).json({ success: true, message: 'User registered successfully', userId });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// User Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

        // Generate JWT Token
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.json({
            success: true,
            token,
            user: { id: user.id, name: user.name, email: user.email, role: user.role }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};
```

### 2. Order Controller (`server/src/controllers/orderController.js`)
*Manages the creation and retrieval of orders.*

```javascript
const Order = require('../models/Order');
const Coffee = require('../models/Coffee');

// Place a new order
exports.placeOrder = async (req, res) => {
    try {
        const { items } = req.body; // Expects array of { coffee_id, quantity }
        let totalAmount = 0;
        const validatedItems = [];

        // Validate items and calculate total server-side
        for (const item of items) {
            const coffee = await Coffee.findById(item.coffee_id);
            if (!coffee) return res.status(400).json({ success: false, message: `Coffee ID ${item.coffee_id} not found` });

            const price = parseFloat(coffee.price);
            totalAmount += price * item.quantity;
            validatedItems.push({ ...item, priceAtTime: price });
        }

        // Create Order Record
        const orderId = await Order.create(req.user.id, totalAmount);

        // Create Order Items
        for (const item of validatedItems) {
            await Order.createItem(orderId, item.coffee_id, item.quantity, item.priceAtTime);
        }

        res.status(201).json({ success: true, message: 'Order placed successfully', orderId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
```

### 3. Cart Context (`client/src/context/CartContext.jsx`)
*Manages global shopping cart state using React Context.*

```javascript
import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    // Initialize cart from localStorage
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    // Persist cart changes to localStorage
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    // Add item to cart logic
    const addToCart = (coffee, quantity = 1) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === coffee.id);
            if (existingItem) {
                // If item exists, update quantity
                return prevItems.map(item =>
                    item.id === coffee.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            // Else add new item
            return [...prevItems, { ...coffee, quantity }];
        });
    };

    // Calculate total price dynamically
    const cartTotal = cartItems.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0);

    return (
        <CartContext.Provider value={{ cartItems, addToCart, cartTotal, setCartItems }}>
            {children}
        </CartContext.Provider>
    );
};
```
