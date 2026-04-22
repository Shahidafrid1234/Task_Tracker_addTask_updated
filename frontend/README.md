# Task Tracker - Setup Guide

This project contains:

- Backend: Node.js + Express + GraphQL + MongoDB
- Frontend: React + Vite + Apollo Client + React Bootstrap
- Authentication: Firebase Email/Password

## Prerequisites

- Node.js 18+ (recommended)
- npm
- MongoDB Atlas URI (or local MongoDB)

## Project Structure

- backend
- frontend

## 1. Install Dependencies

From the workspace root, run:

```bash
cd backend
npm install

cd ../frontend
npm install
```

## 2. Configure Backend Environment

Create a file named .env inside backend with:

```env
MONGO_URI=your_mongodb_connection_string
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

Where to get Firebase Admin credentials:

1. Firebase Console > Project Settings > Service accounts.
2. Click Generate new private key.
3. Use project_id, client_email, and private_key values in backend/.env.

Note: keep the private key wrapped in quotes and preserve \n newlines as shown.

## 3. Firebase Authentication Setup

Firebase config is already added in frontend/src/firebase.js.

In Firebase Console:

1. Open project task-tracker-hub-9ea86.
2. Go to Authentication > Sign-in method.
3. Enable Email/Password provider.

## 4. Run the Application

Start backend:

```bash
cd backend
npm start
```

Backend GraphQL endpoint:

http://localhost:4000/graphql

Start frontend in a new terminal:

```bash
cd frontend
npm run dev
```

Frontend app:

http://localhost:5173

## 5. Build Frontend for Production

```bash
cd frontend
npm run build
```

## Useful Scripts

Backend:

- npm start

Frontend:

- npm run dev
- npm run build
- npm run preview
- npm run lint

## Notes

- The frontend requires the backend server to be running for task queries/mutations.
- If login fails, verify Email/Password auth is enabled in Firebase.
- Backend GraphQL requires a valid Firebase ID token in Authorization header.
- Tasks are user-scoped: each user sees only their own tasks.
- If backend fails to start, verify backend/.env exists and MONGO_URI is valid.
