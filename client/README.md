# URL Shortener Frontend

A modern React frontend for the URL shortener application built with Redux Toolkit for state management.

## Features

- **User Authentication**: Register and login functionality
- **URL Shortening**: Create short URLs from long ones
- **Dashboard**: Manage and view all your shortened URLs
- **Copy to Clipboard**: Easy copying of shortened URLs
- **Responsive Design**: Works on desktop and mobile devices
- **Toast Notifications**: User-friendly feedback messages

## Tech Stack

- **React 18** - UI library
- **Redux Toolkit** - State management
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Lucide React** - Icons
- **React Hot Toast** - Notifications
- **Vite** - Build tool

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── Navbar.jsx
│   └── ProtectedRoute.jsx
├── pages/              # Page components
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   └── Dashboard.jsx
├── store/              # Redux store and slices
│   ├── store.js
│   └── slices/
│       ├── authSlice.js
│       └── urlSlice.js
├── App.jsx
├── main.jsx
└── index.css
```

## API Integration

The frontend communicates with the backend API through the following endpoints:

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/urls/create` - Create short URL
- `GET /api/urls/:shortId` - Redirect to original URL

## State Management

The application uses Redux Toolkit with two main slices:

### Auth Slice
- Manages user authentication state
- Handles login, register, and logout actions
- Stores user data and authentication status

### URL Slice
- Manages URL shortening functionality
- Stores created URLs and handles API calls
- Manages loading and error states

## Environment Setup

The Vite configuration includes a proxy to the backend server running on port 3000. Make sure your backend server is running before starting the frontend development server.