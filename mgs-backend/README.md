# Antigravity Backend (ZenApp)

Production-ready backend for the Municipal Grievance System (MGS). Built with Node.js, Express, Prisma, and Supabase.

## 🚀 Overview

The Antigravity project provides a seamless interface for citizens to report municipal grievances and for department officers to manage and resolve them. Key features include:

- **AI Classification**: Automatically categorizes complaints using Google Gemini AI.
- **SLA Management**: Tracks resolution deadlines and escalates breached complaints.
- **Real-time Updates**: Socket.io integration for instant status changes and notifications.
- **Analytics Dashboard**: Comprehensive overview of grievance trends and department performance.
- **Gamification**: Reward points system for active citizens.

## 🛠️ Tech Stack

- **Runtime**: Node.js (v18+)
- **Framework**: Express 5 (Alpha)
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: Supabase Auth
- **AI Integration**: Google Generative AI (Gemini 1.5 Flash)
- **File Storage**: Cloudinary
- **Real-time**: Socket.IO
- **Scheduling**: Node-cron

## ⚙️ Setup Instructions

### Prerequisites

- Node.js installed on your local machine.
- A PostgreSQL database (e.g., Supabase, Neon, or local).
- Supabase Project (for Auth).
- Cloudinary Account (for Image storage).
- Google AI Studio API Key (for Gemini).

### Installation

1. Navigate to the backend directory:
   ```bash
   cd zenbackend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory based on the following template.

### Environment Variables

```env
PORT=5000
DATABASE_URL="postgresql://user:password@host:port/dbname?schema=public"
DIRECT_URL="postgresql://user:password@host:port/dbname?schema=public"
CLIENT_URL="http://localhost:3000"
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
GOOGLE_GENAI_API_KEY="your-gemini-api-key"
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
RENDER_EXTERNAL_URL="https://your-app.onrender.com" # Required for keep-alive job
```

### Database Migration

```bash
npx prisma generate
npx prisma db push
```

### Running Locally

```bash
npm run dev
```

## 📊 Database Schema

### User
- `id`: UUID (matches Supabase User ID)
- `name`: String
- `email`: String (Unique)
- `role`: Enum (CITIZEN, ADMIN, DEPT_OFFICER)
- `points`: Integer (Reward system)
- `department`: Enum (Optional, for officers)

### Complaint
- `id`: UUID
- `title`: String
- `description`: String
- `category`: Enum (ROAD, WATER, GARBAGE, etc.)
- `priority`: Integer (1-10)
- `status`: Enum (SUBMITTED, ASSIGNED, IN_PROGRESS, RESOLVED, ESCALATED)
- `imageUrl`: String
- `latitude`, `longitude`: Float
- `address`: String
- `slaDeadline`: DateTime
- `validationCount`: Integer (Community verification)

## 📡 API Endpoints

### Authentication (`/api/auth`)
- `POST /register`: Register a new user (Supabase + Prisma sync).
- `POST /login`: Sign in with email/password.
- `GET /me`: Get current user details.
- `POST /logout`: Sign out.

### Users (`/api/users`)
- `GET /profile`: Fetch active user profile and reward points.

### Complaints (`/api/complaints`)
- `POST /`: Submit a new complaint (with image upload).
- `GET /`: List complaints (Role-based filtering).
- `GET /my`: List own complaints for Citizens.
- `GET /:id`: Get details of a specific complaint.
- `PATCH /:id/status`: Update complaint status (Staff only).
- `POST /:id/validate`: Upvote/Validate a complaint.

### Analytics (`/api/analytics`)
- `GET /overview`: High-level status counts.
- `GET /departments`: Performance per department.
- `GET /heatmap`: Geospatial distribution of complaints.
- `GET /trends`: 30-day frequency trends.

## 🔌 WebSockets

Connect to the Socket.IO server at the root URL.

- **Join Rooms**:
    - `join-admin`: For admins to receive all updates.
    - `join-dept (deptName)`: For department-specific updates.
    - `join-complaint (id)`: For status updates on a specific grievance.
- **Events Emitted**:
    - `new-complaint`: When a new complaint is filed (Admin room).
    - `new-assignment`: When a complaint is assigned to a department.
    - `complaint-updated`: When status changes.
    - `sla-breach`: When a complaint hits critical escalation (Admin room).

## 🕒 Background Jobs

- **SLA Escalation**: Runs every 15 minutes. Automatically escalates complaints past their `slaDeadline`.
- **Keep-Alive**: Runs every 14 minutes. Pings `/health` to prevent Render spin-down.

## 🚀 Deployment

The project is configured for easy deployment on **Render**.

1. Connect your GitHub repository.
2. Build Command: `npm install && npm run build`
3. Start Command: `npm start`
4. Set Environment Variables in the Render dashboard.

## 🛠️ Troubleshooting

### Port 5000 Already in Use (EADDRINUSE)
If you see the error `Error: listen EADDRINUSE: address already in use 0.0.0.0:5000`:

1. **Automatic Fix**:
   ```bash
   npm run kill-port
   ```

2. **Manual Fix (Windows)**:
   ```powershell
   taskkill /F /IM node.exe
   ```

3. **Manual Fix (macOS/Linux)**:
   ```bash
   lsof -ti:5000 | xargs kill -9
   ```

4. **Change Port**: Update `PORT=5001` in your `.env` file and restart.

### Other Issues
- **Prisma Connection**: Ensure `DATABASE_URL` and `DIRECT_URL` are correct. If using Supabase, use the transaction mode URL for `DATABASE_URL` and session mode for `DIRECT_URL`.
- **Auth Missing**: Ensure the `Authorization: Bearer <token>` header is sent from the frontend.
- **Gemini Error**: Check if your Google AI API key has sufficient quota and is valid.

