const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const coffees = [
    {
        name: 'Espresso',
        description: 'Strong and bold coffee shot.',
        price: 3.50,
        image_url: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=400',
        available: 1
    },
    {
        name: 'Latte',
        description: 'Espresso with steamed milk and foam.',
        price: 4.50,
        image_url: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400',
        available: 1
    },
    {
        name: 'Cappuccino',
        description: 'Espresso with equal parts steamed milk and foam.',
        price: 4.75,
        image_url: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400',
        available: 1
    },
    {
        name: 'Mocha',
        description: 'Espresso with chocolate and steamed milk.',
        price: 5.00,
        image_url: 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=400',
        available: 1
    }
];

async function seed() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    try {
        console.log('Seeding database...');

        // Seed Admin User
        const adminEmail = 'admin@coffee.com';
        const [users] = await connection.execute('SELECT * FROM users WHERE email = ?', [adminEmail]);

        if (users.length === 0) {
            const hashedPassword = await bcrypt.hash('admin123', 10);
            await connection.execute(
                'INSERT INTO users (name, email, password, role, phone) VALUES (?, ?, ?, ?, ?)',
                ['Admin User', adminEmail, hashedPassword, 'admin', '1234567890']
            );
            console.log('Admin user created.');
        } else {
            console.log('Admin user already exists.');
        }

        // Seed Coffees
        for (const coffee of coffees) {
            const [existing] = await connection.execute('SELECT * FROM coffees WHERE name = ?', [coffee.name]);
            if (existing.length === 0) {
                await connection.execute(
                    'INSERT INTO coffees (name, description, price, image_url, available) VALUES (?, ?, ?, ?, ?)',
                    [coffee.name, coffee.description, coffee.price, coffee.image_url, coffee.available]
                );
                console.log(`Added coffee: ${coffee.name}`);
            } else {
                await connection.execute(
                    'UPDATE coffees SET description = ?, price = ?, image_url = ?, available = ? WHERE name = ?',
                    [coffee.description, coffee.price, coffee.image_url, coffee.available, coffee.name]
                );
                console.log(`Updated coffee: ${coffee.name}`);
            }
        }

        console.log('Seeding completed.');
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        await connection.end();
    }
}

seed();
