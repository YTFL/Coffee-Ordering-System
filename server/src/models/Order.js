const db = require('../config/db');

class Order {
    static async create(userId, totalAmount, status = 'pending') {
        const [result] = await db.execute(
            'INSERT INTO orders (user_id, total_amount, status) VALUES (?, ?, ?)',
            [userId, totalAmount, status]
        );
        return result.insertId;
    }

    static async createItem(orderId, coffeeId, quantity, priceAtTime) {
        await db.execute(
            'INSERT INTO order_items (order_id, coffee_id, quantity, price_at_time) VALUES (?, ?, ?, ?)',
            [orderId, coffeeId, quantity, priceAtTime]
        );
    }

    static async findByUserId(userId, limit = null) {
        let query = `
      SELECT o.id, o.total_amount, o.status, o.created_at,
             COUNT(oi.id) as item_count
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.user_id = ?
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `;

        const params = [userId];
        if (limit) {
            // Use string interpolation for LIMIT as MySQL doesn't support placeholders here
            const safeLimit = parseInt(limit);
            if (!isNaN(safeLimit) && safeLimit > 0) {
                query += ` LIMIT ${safeLimit}`;
            }
        }

        const [rows] = await db.execute(query, params);
        return rows;
    }

    static async findAll() {
        const [rows] = await db.execute(`
      SELECT o.id, o.user_id, u.name as user_name, o.total_amount, o.status, o.created_at
      FROM orders o
      JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
    `);
        return rows;
    }

    static async findById(id) {
        const [order] = await db.execute(`
      SELECT o.*, u.name as user_name, u.email as user_email
      FROM orders o
      JOIN users u ON o.user_id = u.id
      WHERE o.id = ?
    `, [id]);

        if (!order[0]) return null;

        const [items] = await db.execute(`
      SELECT oi.*, c.name as coffee_name, c.image_url
      FROM order_items oi
      JOIN coffees c ON oi.coffee_id = c.id
      WHERE oi.order_id = ?
    `, [id]);

        return { ...order[0], items };
    }

    static async updateStatus(id, status) {
        await db.execute('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
    }
}

module.exports = Order;
