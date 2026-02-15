import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './LoginPage.css';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await axios.post('/api/auth/register', { name, email, password, role });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#050505] overflow-x-hidden pt-12 relative">
      {/* Home Button */}
      <Link
        to="/"
        className="absolute top-6 left-6 sm:top-10 sm:left-10 flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-all font-bold group z-50 text-xs sm:text-sm bg-gray-900/50 px-4 py-2 rounded-xl border border-gray-800 hover:border-cyan-500/30 backdrop-blur-sm"
      >
        <i className="fa-solid fa-house transform group-hover:-translate-y-0.5 transition-transform text-cyan-400"></i>
        <span>Home</span>
      </Link>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="auth-wrapper relative" style={{ marginTop: '0px' }}>
          <div className="background-shape"></div>
          <div className="secondary-shape"></div>

          <div className="credentials-panel signup" style={{ left: 0 }}>
            <h2 className="slide-element">Register</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="field-wrapper slide-element">
                <input type="text" value={name} onChange={e => setName(e.target.value)} required />
                <label>Full name</label>
                <i className="fa-solid fa-user"></i>
              </div>

              <div className="field-wrapper slide-element">
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                <label>Email</label>
                <i className="fa-solid fa-envelope"></i>
              </div>

              <div className="field-wrapper slide-element">
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                <label>Password</label>
                <i className="fa-solid fa-lock"></i>
              </div>

              <div className="field-wrapper slide-element">
                <select className="form-select" value={role} onChange={e => setRole(e.target.value)}>
                  <option value="user">Standard User</option>
                  <option value="employer">Employer</option>
                  <option value="jobseeker">Job Seeker</option>
                </select>
              </div>

              <div className="field-wrapper slide-element">
                <button className="submit-button" type="submit" disabled={loading}>{loading ? 'Please wait...' : 'Register'}</button>
              </div>

              <div className="switch-link slide-element">
                <p>Already have an account?</p>
                <div style={{ marginTop: 12 }}>
                  <button type="button" className="submit-button" onClick={() => navigate('/login')}>Login</button>
                </div>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
