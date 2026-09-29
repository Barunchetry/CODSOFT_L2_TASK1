# Job Board

A full-stack job board web app: employers post openings, candidates search and apply
with resume upload. Built with **React (Vite)** on the frontend and **Node.js / Express
/ MongoDB (Mongoose)** on the backend.

## Features implemented

- **Home page** — welcome hero, search bar, featured job listings
- **Job listings page** — search, filter by job type/location, pagination
- **Job detail page** — full job info, employer/company info
- **Employer dashboard** — post/delete jobs, view applicants, change application status
- **Candidate dashboard** — edit profile & skills, upload a default resume, track applications
- **Application flow** — apply with resume upload (PDF/DOC/DOCX) + optional cover letter
- **Search** — keyword + location search backed by MongoDB text index
- **Email notifications** — on application submitted and on status change (via Nodemailer;
  gracefully no-ops if SMTP isn't configured, so it still runs without email set up)
- **Auth & security** — JWT auth, bcrypt password hashing, role-based route protection
  (candidate vs employer), file-type/size validated uploads
- **Mobile responsive** — Tailwind CSS, responsive grid/flex layouts throughout

## Project structure

```
job-board/
├── backend/            # Express API
│   ├── config/db.js
│   ├── models/         # User, Job, Application (Mongoose schemas)
│   ├── routes/         # auth, jobs, applications, users
│   ├── middleware/      # auth (JWT), upload (multer)
│   ├── utils/           # sendEmail, generateToken
│   ├── uploads/resumes/ # uploaded resumes served at /uploads/resumes/<file>
│   └── server.js
└── frontend/            # React (Vite) SPA
    └── src/
        ├── api/axios.js       # axios instance w/ auth header + baseURL
        ├── context/AuthContext.jsx
        ├── components/        # Navbar, Footer, JobCard, SearchBar, ProtectedRoute
        └── pages/              # Home, JobListings, JobDetail, Login, Register,
                                  ApplyJob, PostJob, EmployerDashboard, CandidateDashboard
```

## 1. Prerequisites

- Node.js 18+
- A MongoDB database — either:
  - Local MongoDB (`mongodb://127.0.0.1:27017/jobboard`), or
  - Free cloud MongoDB Atlas cluster (recommended for hosting later) — https://www.mongodb.com/cloud/atlas/register

## 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
# edit .env: set MONGO_URI, JWT_SECRET, and (optionally) SMTP_* for email
npm run dev        # starts on http://localhost:5000
```

## 3. Frontend setup

```bash
cd frontend
npm install
cp .env.example .env
# VITE_API_URL defaults to http://localhost:5000/api — adjust if needed
npm run dev         # starts on http://localhost:5173
```

Open **http://localhost:5173**. Register as an Employer to post jobs, or as a
Job Seeker to browse and apply.

## 4. Environment variables

**backend/.env**
| Variable | Description |
|---|---|
| `PORT` | API port (default 5000) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign auth tokens — set a long random string |
| `JWT_EXPIRES_IN` | Token lifetime, e.g. `7d` |
| `CLIENT_URL` | Frontend origin, for CORS |
| `SMTP_HOST/PORT/USER/PASS` | Optional — enables real email notifications |
| `EMAIL_FROM` | "From" address for notification emails |

**frontend/.env**
| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the backend API |

## 5. Deploying for free (Step 8 — optional)

A React + Node + MongoDB app needs **three** free services (static hosting can't
run Node, and none of 000webhost/GitHub Pages run a Node server):

1. **Database** — [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) free tier (M0 cluster). Copy its connection string into `MONGO_URI`.
2. **Backend (Node/Express)** — deploy `backend/` to [Render](https://render.com) (free web service) or [Railway](https://railway.app):
   - Build command: `npm install`
   - Start command: `npm start`
   - Add the same env vars from `backend/.env`
3. **Frontend (React)** — deploy `frontend/` to [Netlify](https://netlify.com) or [Vercel](https://vercel.com):
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Set `VITE_API_URL` to your deployed backend URL, e.g. `https://your-api.onrender.com/api`
4. Update `CLIENT_URL` in the backend env to your deployed frontend URL (for CORS).
5. Push the code to a GitHub/GitLab repo and connect that repo in Render/Netlify for
   automatic deploys on every push.

## API overview

| Method | Route | Access |
|---|---|---|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/auth/me` | Authenticated |
| GET | `/api/jobs` | Public (search/filter/paginate) |
| GET | `/api/jobs/featured` | Public |
| GET | `/api/jobs/:id` | Public |
| POST | `/api/jobs` | Employer |
| PUT/DELETE | `/api/jobs/:id` | Employer (own job) |
| GET | `/api/jobs/mine` | Employer |
| POST | `/api/applications/:jobId` | Candidate (multipart, `resume` file) |
| GET | `/api/applications/mine` | Candidate |
| GET | `/api/applications/job/:jobId` | Employer (own job) |
| PATCH | `/api/applications/:id/status` | Employer |
| PUT | `/api/users/profile` | Authenticated |
| POST | `/api/users/resume` | Authenticated (multipart, `resume` file) |

## Notes / next steps

- Add a "Company/all applicants across all jobs" view if you scale beyond a demo.
- Add password reset flow (currently only register/login).
- For production, put resume uploads on S3/Cloudinary instead of local disk, since
  most free hosts wipe the filesystem on redeploy.
