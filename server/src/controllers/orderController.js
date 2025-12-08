const Order = require('../models/Order');
const Coffee = require('../models/Coffee');

exports.placeOrder = async (req, res) => {
    try {
        const { items } = req.body; // [{ coffee_id, quantity }]
        let totalAmount = 0;
        const validatedItems = [];

        // Calculate total and validate items
        for (const item of items) {
            const coffee = await Coffee.findById(item.coffee_id);
            if (!coffee) return res.status(400).json({ success: false, message: `Coffee ID ${item.coffee_id} not found` });

            const price = parseFloat(coffee.price);
            totalAmount += price * item.quantity;
            validatedItems.push({ ...item, priceAtTime: price });
        }

        const orderId = await Order.create(req.user.id, totalAmount);

        for (const item of validatedItems) {
            await Order.createItem(orderId, item.coffee_id, item.quantity, item.priceAtTime);
        }

        res.status(201).json({ success: true, message: 'Order placed successfully', orderId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.getUserOrders = async (req, res) => {
    try {
        const { limit } = req.query;
        const orders = await Order.findByUserId(req.user.id, limit);
        res.json({ success: true, data: orders });
    } catch (error) {
        console.error('getUserOrders error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

        // Access control: User can only see own order, Admin can see all
        if (req.user.role !== 'admin' && order.user_id !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }

        res.json({ success: true, data: order });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.findAll();
        res.json({ success: true, data: orders });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        await Order.updateStatus(req.params.id, status);
        res.json({ success: true, message: 'Order status updated' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.getAdminStats = async (req, res) => {
    try {
        const db = require('../config/db');

        // Get total orders
        const [totalOrdersResult] = await db.execute('SELECT COUNT(*) as count FROM orders');
        const totalOrders = totalOrdersResult[0].count;

        // Get total revenue
        const [revenueResult] = await db.execute('SELECT SUM(total_amount) as revenue FROM orders WHERE status != "cancelled"');
        const totalRevenue = revenueResult[0].revenue || 0;

        // Get pending orders count
        const [pendingResult] = await db.execute('SELECT COUNT(*) as count FROM orders WHERE status = "pending"');
        const pendingOrders = pendingResult[0].count;

        // Get preparing orders count
        const [preparingResult] = await db.execute('SELECT COUNT(*) as count FROM orders WHERE status = "preparing"');
        const preparingOrders = preparingResult[0].count;

        // Get completed orders count
        const [completedResult] = await db.execute('SELECT COUNT(*) as count FROM orders WHERE status = "completed"');
        const completedOrders = completedResult[0].count;

        // Get total users
        const [usersResult] = await db.execute('SELECT COUNT(*) as count FROM users WHERE role = "user"');
        const totalUsers = usersResult[0].count;

        // Get total coffees
        const [coffeesResult] = await db.execute('SELECT COUNT(*) as count FROM coffees');
        const totalCoffees = coffeesResult[0].count;

        res.json({
            success: true,
            data: {
                totalOrders,
                totalRevenue: parseFloat(totalRevenue).toFixed(2),
                pendingOrders,
                preparingOrders,
                completedOrders,
                totalUsers,
                totalCoffees
            }
        });
    } catch (error) {
        console.error('getAdminStats error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
