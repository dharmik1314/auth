# Node JWT Auth Guide

A simple Node.js authentication API using JWT, Express, Sequelize, and PostgreSQL.

## Features
- User registration and login with hashed passwords
- JWT-based authentication
- Protected profile route
- Sequelize ORM with PostgreSQL

## Project Structure
```
node-jwt-auth-guide/
├── .env
├── middleware/
│   └── authMiddleware.js
├── model/
│   └── index.js
├── node_modules/
├── package.json
├── package-lock.json
└── server.js
```

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- PostgreSQL

### Setup
1. Clone the repository or copy the project files.
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a PostgreSQL database named `jwt_auth_guide` (or update `.env` for your DB name).
4. Configure your `.env` file:
   ```env
   PORT=5000
   DB_NAME=jwt_auth_guide
   DB_USER=your_postgres_user
   DB_PASSWORD=your_postgres_password
   DB_HOST=localhost
   DB_PORT=5432
   JWT_SECRET=your_super_secret_jwt_key
   ```
5. Start the server:
   ```sh
   node server
   ```

## API Endpoints

### Register
- **POST** `/api/auth/register`
- Body: `{ "email": "user@example.com", "password": "yourpassword" }`

### Login
- **POST** `/api/auth/login`
- Body: `{ "email": "user@example.com", "password": "yourpassword" }`
- Returns: `{ "token": "<JWT>" }`

### Profile (Protected)
- **GET** `/api/profile`
- Header: `Authorization: Bearer <JWT>`

## License
MIT
