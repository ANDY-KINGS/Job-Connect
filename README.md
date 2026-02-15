# Job Connect - MERN Job Board Application

A full-stack job board application built with the MERN stack (MongoDB, Express.js, React, Node.js) featuring role-based dashboards for admins, employers, and job seekers.

## 🚀 Features

- **User Authentication & Authorization** with JWT
- **Role-Based Access Control** (Admin, Employer, Job Seeker)
- **Employer Dashboard**: Post, edit, and delete jobs; manage applicants
- **Job Seeker Dashboard**: Browse jobs, apply, track applications
- **Admin Dashboard**: View all jobs and users, moderation tools
- **Application Management**: Track application status
- **Modern UI**: Responsive design with Tailwind CSS and dark mode support

## 🛠️ Tech Stack

### Frontend
- React 19
- React Router v7
- Axios
- Tailwind CSS
- SweetAlert2
- Bootstrap

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Bcrypt for password hashing
- Helmet & CORS for security
- Express Rate Limit

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/ANDY-KINGS/Job-Connect.git
   cd Job-Connect
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   cd ..
   ```

4. **Environment Variables**

   Create a `.env` file in the `backend` directory:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   CLIENT_URL=http://localhost:3000
   ```

5. **Run the application**

   **Development mode** (run both frontend and backend):
   ```bash
   # Terminal 1 - Frontend
   npm start

   # Terminal 2 - Backend
   cd backend
   npm run dev
   ```

   The frontend will run on `http://localhost:3000` and backend on `http://localhost:5000`

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Jobs
- `GET /api/jobs` - Get all active jobs
- `GET /api/jobs/:id` - Get job by ID
- `GET /api/jobs/my-jobs` - Get employer's jobs (protected)
- `POST /api/jobs` - Create new job (employer only)
- `PUT /api/jobs/:id` - Update job (employer only)
- `DELETE /api/jobs/:id` - Delete job (employer only)

### Applications
- `POST /api/applications` - Submit application (user only)
- `GET /api/applications/user` - Get user's applications
- `GET /api/applications/job/:jobId` - Get job applicants (employer only)
- `PATCH /api/applications/:id/status` - Update application status (employer only)

### Admin
- `GET /api/admin/jobs` - Get all jobs (admin only)

### Employer
- `GET /api/employer/jobs` - Get all jobs (employer only)

## 👥 User Roles

1. **Admin**: Full access to all features, user management
2. **Employer**: Post jobs, manage posted jobs, view and manage applicants
3. **Job Seeker/User**: Browse jobs, apply to jobs, track applications

## 🌐 Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Import project in Vercel
3. Set environment variable: `REACT_APP_API_URL=your_backend_url`
4. Deploy

### Backend (Render/Railway)
1. Create new Web Service
2. Connect GitHub repository
3. Set root directory to `backend`
4. Add environment variables (MONGO_URI, JWT_SECRET, etc.)
5. Deploy

### Database (MongoDB Atlas)
1. Create account at mongodb.com/cloud/atlas
2. Create cluster (free M0 tier available)
3. Get connection string
4. Add to backend .env file

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 👨‍💻 Author

**ANDY-KINGS**
- GitHub: [@ANDY-KINGS](https://github.com/ANDY-KINGS)

---

Made with ❤️ using MERN Stack
