# Digital Wallet (E-Wallet)

A full-stack MERN application that provides digital wallet functionality with secure money transfers, transaction management, and Stripe payment integration.

## 🚀 Features

- **User Management**

  - User registration and authentication
  - JWT-based authorization
  - User verification system
  - Profile management

- **Transaction Management**

  - Secure money transfers between users
  - Real-time balance updates
  - Transaction history tracking
  - Account verification before transfers

- **Payment Integration**

  - Stripe payment gateway integration
  - Secure fund deposits
  - Transaction verification

- **Request System**
  - Send and receive money requests
  - Accept/reject request functionality
  - Request history tracking

## 💻 Tech Stack

### Frontend

- React.js
- Redux Toolkit (State Management)
- Ant Design (UI Components)
- Axios (API Calls)
- React Router v6
- React Stripe Checkout

### Backend

- Node.js
- Express.js
- MongoDB (Database)
- Mongoose (ODM)
- JWT (Authentication)
- Bcrypt (Password Hashing)
- Stripe API (Payment Processing)

## 🛠️ Installation Steps

1. Clone the repository

```bash
git clone <repository-url>
cd digital-wallet
```

2. Install dependencies for both client and server

```bash
# Install server dependencies
npm install

# Install client dependencies
cd client
npm install
```

3. Create `.env` file in root directory

```env
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
STRIPE_KEY=your_stripe_secret_key
PORT=5000
```

4. Create `.env` file in client directory

```env
REACT_APP_STRIPE_KEY=your_stripe_publishable_key
```

5. Start the development server

```bash
# Start backend server (from root directory)
npm start

# Start frontend server (from client directory)
cd client
npm start
```

## 🏗️ Project Structure

```
digital-wallet/
├── client/                 # Frontend directory
│   ├── public/            # Public assets
│   ├── src/               # Source files
│   │   ├── apiCalls/      # API integration
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Application pages
│   │   ├── redux/         # State management
│   │   ├── stylesheets/   # CSS files
│   │   └── App.js         # Main app component
│   └── package.json       # Frontend dependencies
│
├── server/                 # Backend directory
│   ├── config/            # Configuration files
│   ├── middlewares/       # Custom middlewares
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   └── server.js          # Server configuration
│
└── package.json           # Backend dependencies
```

## 🔒 Environment Variables

The following environment variables are required:

```env
# Server Configuration
MONGO_URL=                 # MongoDB connection string
JWT_SECRET=                # Secret key for JWT
STRIPE_KEY=                # Stripe secret key
PORT=                      # Server port (default: 5000)

# Client Configuration
REACT_APP_STRIPE_KEY=      # Stripe publishable key
```

## 🔐 API Endpoints

### Users

- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login
- `POST /api/users/get-user-info` - Get user information
- `GET /api/users/get-all-users` - Get all users
- `POST /api/users/update-verification-status` - Update user verification

### Transactions

- `POST /api/transactions/transfer-fund` - Transfer funds
- `POST /api/transactions/verify-account` - Verify account
- `POST /api/transactions/get-all-transactions-by-user` - Get user transactions
- `POST /api/transactions/deposit-funds` - Deposit funds

### Requests

- `GET /api/requests/get-all-requests-by-user` - Get user requests
- `POST /api/requests/send-request` - Send money request
- `POST /api/requests/update-request-status` - Update request status

## 🔥 Features in Detail

1. **Secure Authentication**

   - JWT-based authentication system
   - Protected routes
   - Password hashing using bcrypt

2. **Transaction Management**

   - Real-time balance updates
   - Transaction history
   - Secure fund transfers

3. **Request System**

   - Send and receive money requests
   - Request status management
   - Request history

4. **User Management**

   - User verification system
   - Profile management
   - Balance tracking

5. **Payment Integration**
   - Stripe payment gateway
   - Secure payment processing
   - Payment verification

## 🛡️ Security Features

- JWT authentication
- Password hashing
- Protected routes
- Request rate limiting
- Secure payment processing
- Input validation
- Account verification
