# Asset Management System

A web-based Asset Management System developed using Node.js, Express.js, Sequelize, PostgreSQL, and Pug Template Engine.

## Features

- Administrator Login and Logout
- Session-Based Authentication
- Dashboard
- Employee Master
- Asset Category Master
- Vendor Master
- Branch Master
- Asset Master
- Issue Asset
- Return Asset
- Scrap Asset
- Individual Asset History
- Asset Transaction History
- Stock View
- Asset Value Summary

## Technologies Used

- Node.js
- Express.js
- Sequelize ORM
- PostgreSQL
- Pug Template Engine
- Bootstrap
- bcrypt
- express-session
- connect-flash

## Prerequisites

Before running the application, install:

- Node.js
- PostgreSQL
- npm

## Installation Steps

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### 2. Open the Project Directory

```bash
cd asset-management
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Create PostgreSQL Database

Create a PostgreSQL database named:

```text
asset_management
```

Using PostgreSQL:

```sql
CREATE DATABASE asset_management;
```

### 5. Import Database Schema

Import the provided `database_schema.sql` file.

Using the command line:

```bash
psql -U postgres -d asset_management -f database_schema.sql
```

Alternatively, the database schema can be imported using pgAdmin.

### 6. Configure Environment Variables

Copy `.env.example` and create a new file named `.env`.

Example `.env` configuration:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=asset_management
DB_USER=postgres
DB_PASSWORD=your_database_password

SESSION_SECRET=your_session_secret

PORT=3000
```

Replace `your_database_password` with your PostgreSQL password.

Replace `your_session_secret` with any secure random string.

Example:

```env
SESSION_SECRET=asset_management_secure_session_key_12345
```

### 7. Create Administrator Account

Run the admin seed command:

```bash
npm run seed:admin
```

This creates the default administrator account.

### 8. Default Login Credentials

```text
Username: admin
Password: admin123
```

### 9. Start the Application

```bash
npm start
```

For development mode:

```bash
npm run dev
```

### 10. Open the Application

Open the application in your browser:

```text
http://localhost:3000
```

## Project Structure

```text
asset-management/
├── config/
├── controllers/
├── middleware/
├── models/
├── public/
├── routes/
├── seeders/
├── views/
├── .env.example
├── .gitignore
├── app.js
├── database_schema.sql
├── package.json
└── README.md
```

## Authentication

The application uses session-based authentication.

Administrator passwords are securely hashed using bcrypt before being stored in the database.

## Database

PostgreSQL is used as the relational database, and Sequelize ORM is used for database operations.

The `database_schema.sql` file contains the database structure required to run the application.

## Admin Seeder

The initial administrator account can be created by running:

```bash
npm run seed:admin
```

The seed script checks whether the administrator account already exists before creating it.

## Available Scripts

Start the application:

```bash
npm start
```

Start the application in development mode:

```bash
npm run dev
```

Create the default administrator account:

```bash
npm run seed:admin
```

## Author

Developed as a Full-Stack Developer technical assignment.