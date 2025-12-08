const db = require('../config/db');

class User {
    static async create(name, email, password, phone, role = 'user') {
        const [result] = await db.execute(
            'INSERT INTO users (name, email, password, phone, role) VALUES (?, ?, ?, ?, ?)',
            [name, email, password, phone, role]
        );
        return result.insertId;
    }

    static async findByEmail(email) {
        const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0];
    }

    static async findById(id) {
        const [rows] = await db.execute('SELECT id, name, email, phone, role, created_at FROM users WHERE id = ?', [id]);
        return rows[0];
    }

    static async update(id, name, email, phone) {
        await db.execute('UPDATE users SET name = ?, email = ?, phone = ? WHERE id = ?', [name, email, phone, id]);
    }

    static async updatePassword(id, password) {
        await db.execute('UPDATE users SET password = ? WHERE id = ?', [password, id]);
    }

    static async findAll() {
        const [rows] = await db.execute('SELECT id, name, email, phone, role, created_at FROM users');
        return rows;
    }
}

module.exports = User;
