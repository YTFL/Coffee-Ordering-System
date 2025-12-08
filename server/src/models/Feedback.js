const db = require('../config/db');

class Feedback {
    static async create(userId, coffeeId, rating, comment) {
        await db.execute(
            'INSERT INTO feedback (user_id, coffee_id, rating, comment) VALUES (?, ?, ?, ?)',
            [userId, coffeeId, rating, comment]
        );
    }

    static async findByCoffeeId(coffeeId) {
        const [rows] = await db.execute(`
      SELECT f.*, u.name as user_name
      FROM feedback f
      JOIN users u ON f.user_id = u.id
      WHERE f.coffee_id = ?
      ORDER BY f.created_at DESC
    `, [coffeeId]);
        return rows;
    }

    static async getAverageRating(coffeeId) {
        const [rows] = await db.execute(
            'SELECT AVG(rating) as average, COUNT(id) as count FROM feedback WHERE coffee_id = ?',
            [coffeeId]
        );
        return rows[0];
    }
}

module.exports = Feedback;
