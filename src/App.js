
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LandingPage from './components/pages/LandingPage';
import LoginPage from './components/pages/LoginPage';
import RegisterPage from './components/pages/RegisterPage';
import Dashboard from './components/pages/Dashboard';
import AdminDashboard from './components/pages/AdminDashboard';
import EmployerDashboard from './components/pages/EmployerDashboard';

import UserDashboard from './pages/user/UserDashboard';
import JobDetails from './pages/user/JobDetails';
import MyApplications from './pages/user/MyApplications';
import JobForm from './components/pages/JobForm';
import AdminViewAllJobs from './pages/AdminViewAllJobs';
import EmployerViewAllJobs from './pages/EmployerViewAllJobs';

import ProtectedRoute from './components/pages/ProtectedRoutes';
import RoleRoute from './components/pages/RoleRoute';
import GuestRoute from './components/pages/GuestRoute';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path='/login' element={<GuestRoute><LoginPage /></GuestRoute>} />
          <Route path='/register' element={<GuestRoute><RegisterPage /></GuestRoute>} />
          <Route path='/dashboard' element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path='/admin' element={<RoleRoute allowedRoles={['admin']}><AdminDashboard /></RoleRoute>} />
          <Route path='/admin/view-jobs' element={<RoleRoute allowedRoles={['admin']}><AdminViewAllJobs /></RoleRoute>} />
          <Route path='/employer' element={<RoleRoute allowedRoles={['employer']}><EmployerDashboard /></RoleRoute>} />
          <Route path='/employer/view-jobs' element={<RoleRoute allowedRoles={['employer']}><EmployerViewAllJobs /></RoleRoute>} />
          <Route path='/employer/jobs/new' element={<RoleRoute allowedRoles={['employer']}><JobForm /></RoleRoute>} />
          <Route path='/employer/jobs/edit/:id' element={<RoleRoute allowedRoles={['employer']}><JobForm /></RoleRoute>} />
          <Route path='/jobseeker' element={<RoleRoute allowedRoles={['jobseeker', 'user']}><UserDashboard /></RoleRoute>} />
          <Route path='/user/dashboard' element={<RoleRoute allowedRoles={['user']}><UserDashboard /></RoleRoute>} />
          <Route path='/user/applications' element={<RoleRoute allowedRoles={['user', 'jobseeker']}><MyApplications /></RoleRoute>} />
          <Route path='/user/jobs/:id' element={<RoleRoute allowedRoles={['user', 'jobseeker']}><JobDetails /></RoleRoute>} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
