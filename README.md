# 🎨 VanillaTasks

A premium, responsive, and secure full-stack To-Do application. Built using a lightweight **Vanilla HTML5, CSS3, and JavaScript** client-side architecture, integrated with a **Node.js, Express, and MongoDB** backend database, and secured with **JWT (JSON Web Token) authentication**.

---

## 🚀 Key Features

*   **Secure Authentication**: Fully-featured signup and login system using `bcryptjs` for one-way password hashing and `jsonwebtoken` for secure session verification.
*   **Data Isolation**: Every user owns their own tasks, stored safely in MongoDB via Mongoose Schemas.
*   **Premium Modern Styling**: Elegant custom CSS variables supporting dynamic Light and Dark theme toggles with glassmorphic accents, responsive grid layouts, and active mobile menus.
*   **Mock-Driven Test Suite**: Professional unit and integration test suite using **Jest** and **Supertest** to validate routes and auth middleware in isolation without database dependencies.

---

## 🛠️ Technology Stack

*   **Frontend**: HTML5, Vanilla CSS3 (Custom design tokens), Vanilla ES6 JavaScript (Modular architecture)
*   **Backend**: Node.js, Express.js
*   **Database**: MongoDB (via Mongoose ODM)
*   **Testing**: Jest, Supertest

---

## 📁 Repository Structure

```text
├── css/
│   ├── design-tokens.css   # Main CSS configuration tokens & colors
│   └── style.css           # Styling rules, Dark/Light theme rules, & Auth Widget styles
├── js/
│   ├── api.js              # Fetch client interface wrapper
│   └── app.js              # Central JS controller (handles session states, forms, and To-Dos)
├── backend/
│   ├── middleware/
│   │   └── auth.js         # JWT validation middleware
│   ├── models/
│   │   └── User.js         # Mongoose User database schema
│   ├── tests/
│   │   └── todo.test.js    # Jest integration tests
│   ├── server.js           # REST API entry point and routes
│   └── package.json        # Backend NPM packages
├── index.html              # Main application portal page
├── about.html              # Static About section
├── contact.html            # Static Contact portal
└── README.md               # Project documentation
```

---

## ⚙️ Setup and Installation

### 1. Prerequisite Environments
*   **Node.js** (v16+) installed.
*   **MongoDB** running locally or via MongoDB Atlas.

### 2. Backend Configurations
Create a `.env` file inside the `backend/` directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/vanillatasks
JWT_SECRET=super_secret_jwt_passphrase_2026
```

Install backend dependencies and start the Express server:
```bash
cd backend
npm install
npm start
```

### 3. Frontend Web Server
Serve the frontend from the root project directory:
```bash
# Serves the files on http://localhost:8080 without browser caching
npx http-server -p 8080 -c-1
```

### 4. Running the Tests
To run the automated integration test suite:
```bash
cd backend
npm test
```
