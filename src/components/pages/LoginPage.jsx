import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './LoginPage.css';

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      const { token, user } = res.data;
      if (!token) throw new Error('No token');
      localStorage.setItem('token', token);
      login({ token, user });
      const redirectPath = user.role === 'admin' ? '/admin' : user.role === 'employer' ? '/employer' : user.role === 'user' ? '/user/dashboard' : '/jobseeker';
      navigate(redirectPath);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#050505] overflow-x-hidden flex items-center justify-center relative">
      {/* Home Button */}
      <Link
        to="/"
        className="absolute top-6 left-6 sm:top-10 sm:left-10 flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-all font-bold group z-50 text-xs sm:text-sm bg-gray-900/50 px-4 py-2 rounded-xl border border-gray-800 hover:border-cyan-500/30 backdrop-blur-sm"
      >
        <i className="fa-solid fa-house transform group-hover:-translate-y-0.5 transition-transform text-cyan-400"></i>
        <span>Home</span>
      </Link>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex justify-center">
        <div className={`auth-wrapper relative`}>
          <div className="background-shape"></div>
          <div className="secondary-shape"></div>

          <div className="credentials-panel signin">
            <h2 className="slide-element">Login</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleLogin}>
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
                <button className="submit-button" type="submit" disabled={loading}>{loading ? 'Please wait...' : 'Login'}</button>
              </div>

              <div className="switch-link slide-element">
                <p>Don't have an account?</p>
                <div style={{ marginTop: 12 }}>
                  <button type="button" className="submit-button" onClick={() => navigate('/register')}>Register</button>
                </div>
              </div>
            </form>
          </div>

          <div className="welcome-section signin">
            <h2 className="slide-element">WELCOME BACK!</h2>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;