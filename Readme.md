# RBAC API

This is a Node.js Express API for Role-Based Access Control (RBAC). It provides functionalities for user authentication, authorization based on roles, and user management.

## Technologies Used

- Node.js
- Express.js
- MongoDB (via Mongoose)
- bcryptjs (for password hashing)
- jsonwebtoken (for JWT authentication)
- dotenv (for environment variables)

## Features

- User Registration
- User Login
- Role-Based Authorization
- Protected Routes
- Email Notifications

## Email Service

This API now includes email notification capabilities, primarily used for sending welcome emails upon user registration.

### Email Configuration

To enable email notifications, add the following environment variables to your `.env` file:

```
SMTP_HOST=your_smtp_host
SMTP_PORT=your_smtp_port
SMTP_USER=your_smtp_username
SMTP_PASSWORD=your_smtp_password
```

*Replace `your_smtp_host`, `your_smtp_port`, `your_smtp_username`, and `your_smtp_password` with your email service provider's SMTP details.*

## Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd rbac-api
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Create a `.env` file in the root directory and add the following environment variables:**
    ```
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret_key
    ```
    *Replace `your_mongodb_connection_string` with your MongoDB URI (e.g., `mongodb://localhost:27017/rbac_db` or a MongoDB Atlas connection string).* 
    *Replace `your_jwt_secret_key` with a strong, random string.*

## Usage

To start the development server:

```bash
npm run dev
```

The API will be running on the port specified in your `.env` file (default: `5000`).

## API Endpoints

### Authentication (`/api/auth`)

- `POST /api/auth/register`: Register a new user.
- `POST /api/auth/login`: Log in a user and receive a JWT.

### User Management (`/api/user`)

- `GET /api/user/admin`: Access admin-only resources (requires admin or manager role).
- `GET /api/user/manager`: Access manager-only resources (requires admin or manager role).
- `GET /api/user/user`: Access user-only resources (requires admin, manager, or user role).



## Folder Structure

```
rbac-api/
├── config/
│   └── dbConnect.js          # Database connection configuration
├── controllers/
│   └── authController.js     # Logic for authentication routes
├── middleware/
│   ├── authMiddleware.js     # Middleware for JWT verification
│   └── roleMiddleware.js     # Middleware for role-based authorization
├── models/
│   └── userModel.js          # Mongoose schema for User model
├── routes/
│   ├── authRoutes.js         # Routes for authentication
│   └── userRoutes.js         # Routes for user-related operations
├── .env                      # Environment variables
├── index.js                  # Main application entry point
├── package.json              # Project dependencies and scripts
├── package-lock.json
└── README.md                 # Project README
```
