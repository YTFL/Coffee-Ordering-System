const db = require('../config/db');

class Coffee {
    static async findAll() {
        const [rows] = await db.execute('SELECT * FROM coffees WHERE available = 1');
        return rows;
    }

    static async findAllAdmin() {
        const [rows] = await db.execute('SELECT * FROM coffees');
        return rows;
    }

    static async findById(id) {
        const [rows] = await db.execute('SELECT * FROM coffees WHERE id = ?', [id]);
        return rows[0];
    }

    static async create(name, description, price, image_url, available) {
        const [result] = await db.execute(
            'INSERT INTO coffees (name, description, price, image_url, available) VALUES (?, ?, ?, ?, ?)',
            [name, description, price, image_url, available]
        );
        return result.insertId;
    }

    static async update(id, name, description, price, image_url, available) {
        await db.execute(
            'UPDATE coffees SET name = ?, description = ?, price = ?, image_url = ?, available = ? WHERE id = ?',
            [name, description, price, image_url, available, id]
        );
    }

    static async delete(id) {
        await db.execute('DELETE FROM coffees WHERE id = ?', [id]);
    }
}

module.exports = Coffee;
