<div align="center">

# 🌿 ReTh!nk – AI-Powered Upcycling Ideas

[![Status](https://img.shields.io/badge/Status-Active-brightgreen?style=for-the-badge)](https://github.com)
[![Platform](https://img.shields.io/badge/Platform-Fullstack-blue?style=for-the-badge)](https://github.com)
[![Tech](https://img.shields.io/badge/Tech-Next.js%20|%20Node.js%20|%20MongoDB-purple?style=for-the-badge)](https://github.com)
[![AI](https://img.shields.io/badge/AI-Gemini%20Vision-orange?style=for-the-badge)](https://github.com)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](https://github.com)

✨ _Turn Waste Into Wonder — Powered by AI_ ✨

![Banner](https://i.postimg.cc/nVXfsBzc/Re-Th-nk-Banner.png)

</div>

## 🎯 What is ReTh!nk?

ReTh!nk helps you discover creative ways to reuse everyday items instead of throwing them away. Simply upload a photo, and our AI generates personalized upcycling ideas tailored to your item.

## ✨ Features

| Feature | Description |
|---------|-------------|
| 📸 **Smart Upload** | Upload photos of items you want to repurpose |
| 🤖 **AI Ideas** | Get personalized reuse ideas powered by Gemini Vision |
| ✅ **Track Progress** | Mark ideas as complete, track monthly goals |
| 🔍 **Search** | Search items by name or material type |
| 🔐 **Secure Auth** | JWT + Google OAuth authentication |
| 📱 **Responsive** | Works on desktop and mobile |

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | Next.js 14, React, Tailwind CSS, Framer Motion |
| **Backend** | Node.js, Express.js, TypeScript |
| **Database** | MongoDB Atlas (Mongoose) |
| **AI** | Google Gemini 3 API |
| **Auth** | JWT (httpOnly cookies), Google OAuth |
| **Storage** | Cloudinary (image uploads) |
| **Email** | Nodemailer (SMTP) |

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Cloudinary account
- Google Cloud Console (for OAuth)
- Gemini API key

### Backend Setup

```bash
cd backend
cp .env.example .env
# Fill in your environment variables
pnpm install
pnpm run dev
```

### Frontend Setup

```bash
cd frontend
cp .env.example .env.local
# Set NEXT_PUBLIC_API_URL=http://localhost:5000/api
pnpm install
pnpm run dev
```

## 📡 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/signup` | POST | Register new user |
| `/api/auth/login` | POST | Login user |
| `/api/auth/google` | POST | Google OAuth login |
| `/api/auth/me` | GET | Get current user |
| `/api/auth/forgot-password` | POST | Request password reset |
| `/api/auth/reset-password/:token` | POST | Reset password |
| `/api/items` | GET | Get user's items (paginated, filterable) |
| `/api/items` | POST | Create new item |
| `/api/items/:id` | GET/PUT/DELETE | CRUD operations |
| `/api/items/:id/ideas` | POST | Generate AI ideas |
| `/api/profile` | GET/PUT | User profile operations |

## 🔧 Environment Variables

### Backend (.env)
```
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_ACCESS_SECRET=your_secret
JWT_REFRESH_SECRET=your_secret
FRONTEND_URL=http://localhost:3000
GEMINI_API_KEY=your_gemini_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_app_password
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## 📁 Project Structure

```
ReTh!nk/
├── backend/
│   ├── src/
│   │   ├── config/        # DB, Cloudinary config
│   │   ├── controllers/   # Route handlers
│   │   ├── middleware/    # Auth middleware
│   │   ├── models/        # Mongoose schemas
│   │   ├── routes/        # Express routes
│   │   ├── services/      # Email, Gemini services
│   │   └── server.ts      # Entry point
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── app/           # Next.js pages
    │   ├── components/    # React components
    │   ├── contexts/      # React contexts
    │   ├── hooks/         # Custom hooks
    │   └── lib/           # API client, utilities
    └── package.json
```

## 🌐 Live Demo

- **Frontend:** [re-think-seven.vercel.app](https://re-think-seven.vercel.app/)
- **Backend API:** [rethink-backend-civb.onrender.com](https://rethink-backend-civb.onrender.com)

## 📄 License

MIT License

<div align="center">
<sub>Made with ❤️</sub>
</div>