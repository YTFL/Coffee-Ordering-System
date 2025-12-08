# Coffee Ordering System - Setup Guide

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14 or higher)
- **MySQL** (v8.0 or higher)
- **npm** (comes with Node.js)

## 🚀 Initial Setup

### 1. Clone/Navigate to Project Directory
```bash
cd coffee-ordering-system
```

### 2. Install All Dependencies (One Command!)
```bash
npm run install-all
```

This will install dependencies for:
- Root project (concurrently)
- Backend (server)
- Frontend (client)

### 3. Configure Environment Variables

Create a `.env` file in the `server` directory:

```bash
cd server
cp .env.example .env
```

Edit `.env` with your MySQL credentials:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=coffee_db
JWT_SECRET=your_super_secret_jwt_key_here
PORT=5000
```

## 🗄️ Database Setup

### One-Command Database Setup
From the root directory, run:

```bash
npm run setup-db
```

This will:
1. Create the `coffee_db` database
2. Create all required tables
3. Seed admin user and coffee items

**What gets initialized:**
- **Admin User**
  - Email: `admin@coffee.com`
  - Password: `admin123`
  - Role: `admin`

- **4 Coffee Items**
  - Espresso - $3.50
  - Latte - $4.50
  - Cappuccino - $4.75
  - Mocha - $5.00

> ✅ **Yes, all 4 coffee items are automatically initialized!**

## 🏃 Running the Application

### Single Command to Run Everything!
From the root directory:

```bash
npm run dev
```

This will start both:
- ✅ Backend server on `http://localhost:5000`
- ✅ Frontend server on `http://localhost:5173`

Both servers will run concurrently in the same terminal with color-coded output!

## 👥 Default Credentials

### Admin Account
- **Email:** `admin@coffee.com`
- **Password:** `admin123`
- **Access:** Full admin dashboard, manage coffees, view all orders, manage users

### Creating Customer Accounts
- Navigate to `http://localhost:5173/register`
- Fill in the registration form
- Login with your new credentials

## 📁 Project Structure

```
coffee-ordering-system/
├── server/                 # Backend (Node.js + Express)
│   ├── src/
│   │   ├── config/        # Database configuration
│   │   ├── controllers/   # Route controllers
│   │   ├── middleware/    # Auth, validation, rate limiting
│   │   ├── models/        # Database models
│   │   ├── routes/        # API routes
│   │   └── scripts/       # Database scripts
│   ├── setup.sql          # Database schema
│   ├── .env               # Environment variables
│   └── index.js           # Server entry point
│
└── client/                # Frontend (React + Vite)
    ├── src/
    │   ├── components/    # Reusable components
    │   ├── context/       # React Context (Auth, Cart, Toast)
    │   ├── pages/         # Page components
    │   └── index.css      # Global styles
    └── index.html         # HTML entry point
```

## 🛠️ Useful Commands

### Quick Start (From Root Directory)
```bash
npm run install-all    # Install all dependencies
npm run setup-db       # Initialize and seed database
npm run dev            # Run both servers
```

### Individual Commands

**Run servers separately:**
```bash
npm run server         # Backend only
npm run client         # Frontend only
```

**Database Management:**
```bash
npm run setup-db       # Initialize and seed database
cd server && node src/scripts/seed_orders.js  # Seed sample orders
```

**Development:**
```bash
npm run dev            # Run both servers concurrently
```

**Build for Production:**
```bash
cd client && npm run build
```

## 🎯 Features Overview

### Customer Features
- Browse coffee menu with images
- Add items to cart with quantity controls
- Place orders
- View order history with detailed items
- Edit profile (name, email, phone)
- Change password
- Personalized home dashboard with:
  - Current orders (pending/preparing)
  - Recent order history
  - Recommended coffees

### Admin Features
- Manage coffee items (Create, Update, Delete)
- View all orders
- Update order status (pending → preparing → completed)
- View all users
- Access analytics dashboard

## 🔧 Troubleshooting

### Database Connection Issues
- Verify MySQL is running
- Check credentials in `.env` file
- Ensure `coffee_db` database exists

### Port Already in Use
- Backend (5000): Change `PORT` in `.env`
- Frontend (5173): Vite will auto-increment to 5174

### Missing Dependencies
```bash
# Backend
cd server && npm install

# Frontend
cd client && npm install
```

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Coffees
- `GET /api/coffees` - Get all coffees
- `GET /api/coffees/:id` - Get coffee details
- `POST /api/admin/coffees` - Create coffee (Admin)
- `PUT /api/admin/coffees/:id` - Update coffee (Admin)
- `DELETE /api/admin/coffees/:id` - Delete coffee (Admin)

### Orders
- `POST /api/orders` - Place order
- `GET /api/orders/my-orders` - Get user orders
- `GET /api/orders/:id` - Get order details
- `GET /api/admin/orders` - Get all orders (Admin)
- `PATCH /api/admin/orders/:id/status` - Update order status (Admin)

### User Profile
- `GET /api/users/me` - Get profile
- `PUT /api/users/me` - Update profile
- `PUT /api/users/me/password` - Change password

## 🎨 Tech Stack

**Backend:**
- Node.js + Express
- MySQL (mysql2)
- JWT Authentication
- bcryptjs for password hashing
- express-validator for validation
- express-rate-limit for security

**Frontend:**
- React 18
- React Router v6
- Axios for API calls
- Context API for state management
- CSS3 for styling

## 📞 Support

For issues or questions, please check:
1. All dependencies are installed
2. MySQL is running
3. Environment variables are correct
4. Both servers are running

---

**Happy Brewing! ☕**
