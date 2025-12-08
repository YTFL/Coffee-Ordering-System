const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const coffeeController = require('../controllers/coffeeController');
const orderController = require('../controllers/orderController');
const feedbackController = require('../controllers/feedbackController');

const { verifyToken, verifyAdmin } = require('../middleware/auth');
const { registerValidation, loginValidation, orderValidation, feedbackValidation } = require('../middleware/validation');
const { loginLimiter } = require('../middleware/rateLimiter');

// Auth
router.post('/auth/register', registerValidation, authController.register);
router.post('/auth/login', loginLimiter, loginValidation, authController.login);

// Users
router.get('/users/me', verifyToken, authController.getProfile);
router.put('/users/me', verifyToken, authController.updateProfile);
router.put('/users/me/password', verifyToken, authController.changePassword);

// Coffees
router.get('/coffees', coffeeController.getAllCoffees);
router.get('/coffees/:id', coffeeController.getCoffeeById);

// Orders
router.post('/orders', verifyToken, orderValidation, orderController.placeOrder);
router.get('/orders/my-orders', verifyToken, orderController.getUserOrders);
router.get('/orders/:id', verifyToken, orderController.getOrderById);

// Feedback
router.post('/feedback', verifyToken, feedbackValidation, feedbackController.submitFeedback);
router.get('/feedback/coffee/:id', feedbackController.getFeedbackForCoffee);

// Admin Routes
router.post('/admin/coffees', verifyAdmin, coffeeController.createCoffee);
router.put('/admin/coffees/:id', verifyAdmin, coffeeController.updateCoffee);
router.delete('/admin/coffees/:id', verifyAdmin, coffeeController.deleteCoffee);

router.get('/admin/orders', verifyAdmin, orderController.getAllOrders);
router.patch('/admin/orders/:id/status', verifyAdmin, orderController.updateOrderStatus);
router.get('/admin/stats', verifyAdmin, orderController.getAdminStats);

module.exports = router;
