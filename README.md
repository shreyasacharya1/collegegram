# Collegegram MVP (MERN + Vite + TypeScript)

A simplified Instagram-style social platform focused on college students.

## Tech Stack
- Frontend: React + Vite + TypeScript + Tailwind + React Router + Axios
- Backend: Node.js + Express + TypeScript + MongoDB (Mongoose) + JWT
- Media: Cloudinary

## Features in this MVP
- Auth: register/login/me with protected routes
- Feed: create post (text + optional image), like/unlike, comment, delete own post/comment
- Follow system: search users, follow/unfollow, profile with following list
- College twist:
  - Ask Seniors question posts with categories
  - Upvote on comments in Ask Seniors
  - Senior badge for users with year >= 3

## Local Setup

### 1. Backend
```bash
cd backend
cp .env.example .env
# Fill env values
npm install
npm run dev
```

### 2. Frontend
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

## Required Backend .env
- PORT
- MONGO_URI
- JWT_SECRET
- JWT_EXPIRES_IN
- FRONTEND_URL
- CLOUDINARY_CLOUD_NAME
- CLOUDINARY_API_KEY
- CLOUDINARY_API_SECRET

## Deployment Notes
- Frontend: Vercel (`VITE_API_URL`)
- Backend: Render or Railway (`FRONTEND_URL` must match deployed frontend)
- DB: MongoDB Atlas free tier

## API Overview
- Auth
  - POST /api/auth/register
  - POST /api/auth/login
  - GET /api/auth/me
- Users
  - GET /api/users/search?q=...
  - GET /api/users/:userId
  - POST /api/users/:userId/follow-toggle
- Posts
  - GET /api/posts/feed
  - GET /api/posts/ask-seniors
  - POST /api/posts (multipart form-data)
  - POST /api/posts/:postId/like-toggle
  - DELETE /api/posts/:postId
  - POST /api/posts/:postId/comments
  - DELETE /api/posts/:postId/comments/:commentId
  - POST /api/posts/:postId/comments/:commentId/upvote-toggle
