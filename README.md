# TechFest 2026 Portal (MERN Stack)

A complete MERN (MongoDB, Express.js, React, Node.js) web application for managing TechFest events, user authentication, and registrations.

---

## Features
- **User Authentication**: Secure registration and login with bcrypt password hashing and JSON Web Tokens (JWT).
- **Role-Based Access Control**: Standard users can register for events; admins can create, edit, and delete events, as well as view all registrations.
- **Dynamic Seat Management**: Available seats are recalculated dynamically upon registration, cancellation, or admin modifications.
- **Category Filtering**: Filter events by Technical, Cultural, Sports, Workshop, etc.
- **Protected Routes**: React router guards (`PrivateRoute`, `AdminRoute`) protect private pages.

---

## Tech Stack
- **Frontend**: React (Vite), React Router v6, Axios, Modern CSS
- **Backend**: Node.js, Express.js, Mongoose, bcrypt, jsonwebtoken, cors, dotenv
- **Database**: MongoDB (Mongoose ODM)

---

## API Endpoints

| Method | Endpoint | Purpose | Access |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new user (hashes password) | Public |
| `POST` | `/api/auth/login` | Authenticate user & return JWT | Public |
| `GET` | `/api/auth/me` | Fetch logged-in user profile | Protected |
| `GET` | `/api/events` | List all events (optional `?category=`) | Public |
| `GET` | `/api/events/:id` | Get details of a single event | Public |
| `POST` | `/api/events` | Create a new event | Admin Only |
| `PUT` | `/api/events/:id` | Update an event & recalculate seats | Admin Only |
| `DELETE` | `/api/events/:id` | Delete an event | Admin Only |
| `POST` | `/api/registrations` | Register user for an event | Protected |
| `GET` | `/api/registrations/my` | View current user's registrations | Protected |
| `GET` | `/api/registrations` | View all registrations | Admin Only |
| `DELETE` | `/api/registrations/:id` | Cancel registration (restores seat) | Protected |

---

## Setup & Running Locally

### 1. Backend Setup
```bash
cd techfest-backend
npm install
npm start
```
*Runs on `http://localhost:5000`*

### 2. Frontend Setup
```bash
cd techfest-frontend
npm install
npm run dev
```
*Runs on `http://localhost:5173`*
