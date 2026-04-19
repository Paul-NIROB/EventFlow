# EventFlow

A modern, full-stack event management platform built with FastAPI and React.

## Features

- **Discover Events**: Browse upcoming workshops, conferences, and more with real-time filters.
- **Create & Manage**: Easily host your own events with a beautiful creation interface.
- **Easy Registration**: One-click registration for events you're interested in.
- **Glassmorphism UI**: A sleek, dark-themed interface built with pure Tailwind CSS.
- **Authentication**: Secure JWT-based auth for users and organizers.
- **Responsive**: Fully optimized for mobile and desktop experiences.

## Tech Stack

### Backend
- **FastAPI**: Modern, high-performance Python web framework.
- **SQLAlchemy**: Powerful SQL Toolkit and ORM.
- **SQLite**: Lightweight database for development.
- **JWT Auth**: Secure token-based authentication.

### Frontend
- **React**: Component-based UI library.
- **Vite**: Ultra-fast build tool and dev server.
- **Tailwind CSS**: Utility-first CSS framework for custom styling.
- **React Router**: Declarative routing for web applications.

## Getting Started

### Prerequisites
- Python 3.8+
- Node.js 16+

### Deployment (Render)

### **Backend**
1. **New > Web Service**
2. **Root Directory**: `backend`
3. **Environment**: `Python`
4. **Build Command**: `pip install -r requirements.txt`
5. **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. **Environment Variables**:
   - `DATABASE_URL`: (Optional, defaults to sqlite)
   - `SECRET_KEY`: (Your secret key for JWT)

### **Frontend**
1. **New > Static Site**
2. **Root Directory**: `frontend`
3. **Build Command**: `npm run build`
4. **Publish Directory**: `dist`
5. **Environment Variables**:
   - `VITE_API_URL`: Your backend URL (e.g., `https://eventflow-api.onrender.com`)

## Design System

- **Background**: `#0b0f1a` (Dark)
- **Accent**: `#6c63ff` (Indigo)
- **Text**: `#f0f4ff` (Off-white)
- **Typography**: Sora (Headings), DM Sans (Body)
