# KnowMyCampus – Unified College Web Application

KnowMyCampus is a full-stack MERN portal designed to automate college processes like event eligibility verification, placement drive tracking, and student-senior collaboration through a discussion forum and a database-driven chatbot.

## 🚀 Features

### For Students
- **Personalized Dashboard**: View academic details (CGPA, Backlogs, etc.).
- **Automated Eligibility**: Instantly check eligibility for Events and Placements based on live data.
- **Smart Chatbot**: Query your own academic data (e.g., "Am I eligible for TechCorp?").
- **Discussion Forum**: Ask doubts and get guidance from seniors/admin.
- **Announcement Ticker**: Real-time scrolling updates from the college.

### For Admin
- **Manage Content**: Create/Update/Delete announcements, events, and companies.
- **Eligibility Rules**: Define criteria for each event and drive.
- **Moderation**: Monitor and delete inappropriate forum posts.
- **Student Overview**: View all registered students.

---

## 🛠 Tech Stack

- **Frontend**: React.js (Vite), Axios, React Router, Normal CSS.
- **Backend**: Node.js, Express.js, REST API.
- **Database**: MongoDB (Mongoose).
- **Security**: JWT Authentication, bcrypt hashing.

---

## 🛠 Setup Instructions

### 1. Prerequisites
- Node.js installed.
- MongoDB running locally or on Atlas.

### 2. Backend Setup
1. Navigate to the `backend` folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file (one has been provided for you):
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/knowmycampus
   JWT_SECRET=your_jwt_secret_key
   ```
4. **Seed the database** (Optional but recommended for testing):
   ```bash
   node config/seed.js
   ```
5. Start the server:
   ```bash
   npm run dev  
   ```

### 3. Frontend Setup
1. Navigate to the `frontend` folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Access the app at `http://localhost:5173`.

---

## 🔑 Default Credentials (from Seed)

- **Admin**: `admin@college.edu` / `adminpassword`
- **Student**: `john@student.edu` / `password123` (CGPA: 8.5, 0 Backlogs)
- **Student**: `jane@student.edu` / `password123` (CGPA: 6.5, 2 Backlogs)

---

## 🛡 How to Implement Google Authentication

To add Google Login to this project, follow these steps:

### 1. Google Cloud Console Setup
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project and navigate to **APIs & Services > Credentials**.
3. Create **OAuth 2.0 Client IDs**.
4. Add `http://localhost:5173` to **Authorized JavaScript origins**.
5. Add `http://localhost:5000/api/auth/google/callback` to **Authorized redirect URIs**.

### 2. Backend (Node/Passport)
1. Install passport: `npm install passport passport-google-oauth20`.
2. Configure strategy in `config/passport.js`:
   ```javascript
   const GoogleStrategy = require('passport-google-oauth20').Strategy;
   passport.use(new GoogleStrategy({
       clientID: process.env.GOOGLE_CLIENT_ID,
       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
       callbackURL: "/api/auth/google/callback"
     },
     async (accessToken, refreshToken, profile, done) => {
       // Logic to find or create user in MongoDB
     }
   ));
   ```
3. Add routes:
   - `GET /api/auth/google`: Trigger login.
   - `GET /api/auth/google/callback`: Handle successful redirection.

### 3. Frontend (React)
1. Install library: `npm install @react-oauth/google`.
2. Wrap `App` with `GoogleOAuthProvider`.
3. Use the `useGoogleLogin` hook or `GoogleLogin` component to get the ID token and send it to your backend for verification.

---

## 📁 Project Structure

```text
KnowMyCampus/
├── backend/
│   ├── config/       # DB & Seed config
│   ├── controllers/  # API Logic
│   ├── middleware/   # Auth & Error handlers
│   ├── models/       # Mongoose Schemas
│   ├── routes/       # API Endpoints
│   └── server.js     # Entry point
└── frontend/
    ├── src/
    │   ├── components/ # Reusable UI
    │   ├── pages/      # Full pages
    │   ├── services/   # API (Axios) config
    │   └── styles/     # Component-specific CSS
    └── index.html
```

---

## 📮 API Collection
A Postman collection named `KnowMyCampus.postman_collection.json` is included in the root directory for testing all endpoints.
