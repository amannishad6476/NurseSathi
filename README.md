
# Nursing Job Portal

A full MERN stack nursing job board with role-based authentication, recruiter management, and admin analytics.

## Project Structure

- `backend/`
  - `server.js` — Express server entrypoint.
  - `config/db.js` — MongoDB connection.
  - `models/` — Mongoose schemas for `User`, `Profile`, `Job`, `Application`.
  - `controllers/` — Business logic for auth, profiles, jobs, applications, admin.
  - `routes/` — Route definitions.
  - `middleware/` — JWT authentication, role authorization, error handling, file upload.
- `frontend/`
  - `src/` — React application using functional components and hooks.
  - `components/` — UI building blocks, navigation, protected route.
  - `pages/` — Home, authentication, jobs, job detail, profile, recruiter dashboard, admin dashboard.

## Backend Setup

1. Open terminal in `backend/`.
2. Run `npm install`.
3. Create `.env` from `.env.example`.
4. Start development server with `npm run dev`.

### Backend .env example

```env
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=supersecretjwtkey
PORT=5000
```

## Frontend Setup

1. Open terminal in `frontend/`.
2. Run `npm install`.
3. Start frontend with `npm run dev`.
4. Configure API URL with `VITE_API_URL` in `.env` if backend is deployed.

## Local Development

- Backend: `http://localhost:5000`
- Frontend: `http://localhost:3000`

## API Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/current`
- `POST /api/profile/me`
- `GET /api/profile/me`
- `GET /api/jobs`
- `GET /api/jobs/:jobId`
- `POST /api/jobs`
- `POST /api/applications/apply/:jobId`
- `GET /api/applications/me`
- `GET /api/admin/users`

## Notes

- Recruiters are pending approval until admin approves them.
- Nurses can upload resumes via the profile page.
- Admin users can manage recruiters, delete users, and remove fake jobs.
