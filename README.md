# Shop Smart - E-commerce and Shopping

## Introduction
Shop Smart is an e-commerce platform that enables users to browse products, add items to their cart, manage their wishlist, and complete purchases securely. The backend provides robust authentication, product management, order processing, and cart functionality. The project aims to create a seamless shopping experience with efficient backend support.

## Project Type
- Backend: Node.js, Express
- Frontend: React

## Deployed App
- **Backend**: [Shop Smart Backend](https://shop-smart-e-commerce.onrender.com)  (Deplyoyed on Render)
- **Frontend**: [Shop Smart Frontend](https://shop-smart-e-commerce-app-3.netlify.app/) (Deployed on Netlify)


## Directory Structure
```
ShopSmart_E-Commerce/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── productController.js
│   │   │   ├── userController.js
│   │   │   ├── orderController.js
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js
│   │   ├── models/
│   │   │   ├── event.js
│   │   │   ├── product.js
│   │   │   ├── user.js
│   │   │   ├── order.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── productRoutes.js
│   │   │   ├── userRoutes.js
│   │   │   ├── orderRoutes.js
│   │   ├── services/
│   │   │   ├── authService.js
│   │   │   ├── emailService.js
│   │   ├── utils/
│   │   │   ├── jwt.js
│   │   │   ├── errorHandler.js
│   │   ├── validators/
│   │   │   ├── authValidator.js
│   │   │   ├── productValidator.js
│   │   ├── server.js
│   ├── .env
│   ├── .gitignore
│   ├── package-lock.json
│   ├── package.json
│   ├── README.md
│   ├── setup.ps1
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   ├── favicon.ico
│   ├── src/
│   │   ├── assets/
│   │   │   ├── images/
│   │   │   ├── styles/
│   │   ├── components/
│   │   │   ├── Cart/
│   │   │   ├── Product/
│   │   │   ├── Header.js
│   │   │   ├── Footer.js
│   │   ├── pages/
│   │   │   ├── HomePage.js
│   │   │   ├── ProductPage.js
│   │   │   ├── CartPage.js
│   │   │   ├── CheckoutPage.js
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── productService.js
│   │   ├── utils/
│   │   │   ├── jwt.js
│   │   ├── App.js
│   │   ├── index.js
│   ├── .gitignore
│   ├── package-lock.json
│   ├── package.json
│   ├── README.md

```

## Video Walkthrough of the Project


## Video Walkthrough of the Codebase


## Features
- User authentication (JWT-based login & registration)
- Product listing & filtering (by category, price, rating)
- Cart management (add, update, and remove products from cart)
- Wishlist feature (add and remove wishlist items)
- Order processing with stock validation
- Secure payment gateway integration (to be implemented)
- Forgot and Reset Password functionality with OTP verification
- User profile update feature
- Role-based access control (Admin & User)
- Error handling with middleware
- Data validation using `validators`

## Design Decisions & Assumptions
- **MongoDB for Scalability**: Chosen as the database due to its flexibility with document storage.
- **JWT for Authentication**: JSON Web Tokens are used to ensure secure authentication and session management.
- **REST API Structure**: Followed RESTful principles for clean and scalable API design.
- **Cart & Wishlist Stored in User Model**: Each user has an embedded array for their cart and wishlist, ensuring fast retrieval.
- **Stock Deduction on Order Placement**: Prevents overselling of products.
- **Password Hashing**: Uses bcrypt to hash passwords securely.
- **Validation Middleware**: Ensures incoming data integrity.

## Installation & Getting Started
Follow these steps to set up the project locally:

```bash
# Clone the repository
git clone https://github.com/your-username/shop-smart.git

# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Set up environment variables (create .env file and configure)

# Start the backend server
npm start
```

## Usage
### Running the Backend Server
```bash
npm start
```
### Example API Usage
```bash
# Fetch all products
GET /api/products

# Add a product to cart
POST /api/cart
{
  "userId": "user123",
  "productId": "product456",
  "quantity": 2
}
```

## Credentials
For testing authentication-based pages, use the following credentials:
```json
{
  "email": "testuser@example.com",
  "password": "password123"
}
```

## APIs Used
- **MongoDB Atlas** (Database)
- **Cloudinary** (Image storage, to be integrated)
- **Stripe Payment API** (To be integrated for payment processing)

## API Endpoints
### Authentication
- **POST** `/api/auth/register` - Register a new user
- **POST** `/api/auth/login` - Login user & return JWT
- **POST** `/api/auth/forgotpassword` - Generate OTP for password reset
- **POST** `/api/auth/resetpassword` - Reset password using OTP
- **POST** `/api/auth/logout` - Logout user

### Products
- **GET** `/api/products` - Fetch all products
- **GET** `/api/products/:id` - Get a single product by ID
- **GET** `/api/products/category/:category` - Get products by category
- **GET** `/api/products/search` - Search for products
- **POST** `/api/products/insert` - Add a new product

### Cart
- **POST** `/api/cart/add` - Add a product to the cart
- **GET** `/api/cart/:userId` - Get user’s cart
- **PUT** `/api/cart/update` - Update product quantity in cart
- **DELETE** `/api/cart/remove/:productId` - Remove product from cart
- **GET** `/api/cart/totalCartPrice` - Get total cart price

### Wishlist
- **POST** `/api/wishlist/add` - Add a product to wishlist
- **GET** `/api/wishlist/:userId` - Get wishlist
- **DELETE** `/api/wishlist/remove/:productId` - Remove product from wishlist

  ### Orders
- **POST** `/api/orders` - Create a new order
- **GET** `/api/orders/user` - Get orders for the logged-in user
- **GET** `/api/orders/:orderId` - Get order details by ID (Admin access required)
- **PUT** `/api/orders/:orderId/status` - Update order status (Admin access required)
- **GET** `/api/orders/admin/all` - Get all orders (Admin access required)
- **GET** `/api/orders/admin/status` - Get orders by status (Admin access required)


### User Profile
- **GET** `/api/user/profile` - Get user profile
- **PUT** `/api/user/profile` - Update user profile

## Technology Stack

### Backend
- **Node.js** - Backend runtime environment
- **Express.js** - Web framework for handling API requests
- **MongoDB & Mongoose** - NoSQL database and ODM for managing product, user, and cart data
- **JWT Authentication** - Secure user login and session management
- **Rozor API** - Payment processing (to be integrated)
- **Bcrypt.js** - Password hashing for user security
- **Mongoose Validators** - Ensuring valid data entry
- **Middleware for Error Handling**

### Frontend
- **React** - JavaScript library for building user interfaces
- **Tailwind CSS** - Utility-first CSS framework for styling the frontend
- **Axios** - Promise-based HTTP client for making API requests
- **React Router** - For managing routing in the application
- **Redux** - State management for handling app state (optional, based on your implementation)
- **React Hooks** - For managing component state and side effects

---
🚀 **Shop Smart Full stack is ready for further expansion!** Feel free to contribute or suggest improvements. 🎉

