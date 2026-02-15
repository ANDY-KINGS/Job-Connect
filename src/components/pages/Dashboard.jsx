import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ title: '', company: '', location: '', description: '', jobType: 'job' });
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');

  const fetchJobs = async (q = '') => {
    setLoading(true);
    try {
      const res = await axios.get('/api/jobs' + (q ? `?search=${encodeURIComponent(q)}` : ''));
      setJobs(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchJobs(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/jobs', form);
      setJobs(prev => [res.data, ...prev]);
      setForm({ title: '', company: '', location: '', description: '', jobType: 'job' });
    } catch (err) {
      setError(err.response?.data?.message || 'Create failed');
    }
  };

  const handleEdit = (job) => {
    setEditingId(job._id);
    setForm({ title: job.title, company: job.company, location: job.location, description: job.description, jobType: job.jobType });
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`/api/jobs/${editingId}`, form);
      setJobs(prev => prev.map(j => j._id === editingId ? res.data : j));
      setEditingId(null);
      setForm({ title: '', company: '', location: '', description: '', jobType: 'job' });
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this job?')) return;
    try {
      await axios.delete(`/api/jobs/${id}`);
      setJobs(prev => prev.filter(j => j._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed');
    }
  };

  const doSearch = (e) => {
    e.preventDefault();
    fetchJobs(search);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row justify-between items-center mb-8 gap-4">
          <h3 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent italic">JobConnect Dashboard</h3>
          <div className="flex items-center gap-4">
            <span className="text-gray-400">Signed in as <strong className="text-white">{user?.name}</strong></span>
            <button className="bg-gray-800 border border-gray-700 hover:border-red-500/50 text-gray-400 hover:text-red-400 px-4 py-2 rounded-xl transition-all font-semibold" onClick={() => { logout(); navigate('/login'); }}>Logout</button>
          </div>
        </div>

        <form className="mb-3 d-flex" onSubmit={doSearch}>
          <input className="form-control me-2" placeholder="Search by title" value={search} onChange={e => setSearch(e.target.value)} />
          <button className="btn btn-primary" type="submit">Search</button>
        </form>

        {user?.role === 'employer' && (
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">{editingId ? 'Edit Job' : 'Create Job'}</h5>
              <form onSubmit={editingId ? submitEdit : handleCreate}>
                <div className="row">
                  <div className="col-md-6 mb-2">
                    <input className="form-control" placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
                  </div>
                  <div className="col-md-6 mb-2">
                    <input className="form-control" placeholder="Company" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} required />
                  </div>
                </div>
                <div className="mb-2">
                  <input className="form-control" placeholder="Location" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} required />
                </div>
                <div className="mb-2">
                  <textarea className="form-control" placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />
                </div>
                <div className="mb-2">
                  <select className="form-select" value={form.jobType} onChange={e => setForm({ ...form, jobType: e.target.value })}>
                    <option value="job">Job</option>
                    <option value="internship">Internship</option>
                  </select>
                </div>
                <button className="btn btn-success">{editingId ? 'Save changes' : 'Post Job'}</button>
                {editingId && <button type="button" className="btn btn-secondary ms-2" onClick={() => { setEditingId(null); setForm({ title: '', company: '', location: '', description: '', jobType: 'job' }); }}>Cancel</button>}
              </form>
            </div>
          </div>
        )}

        <div>
          {loading ? <p>Loading jobs...</p> : (
            jobs.map(job => (
              <div key={job._id} className="card mb-2">
                <div className="card-body">
                  <h5>{job.title} <small className="text-muted">@ {job.company}</small></h5>
                  <p className="mb-1"><strong>Location:</strong> {job.location} • <strong>Type:</strong> {job.jobType}</p>
                  <p>{job.description}</p>
                  <p className="mb-1 text-muted">Posted by: {job.createdBy?.name || 'Unknown'}</p>
                  {user && job.createdBy && (() => {
                    const ownerId = job.createdBy._id ? String(job.createdBy._id) : String(job.createdBy);
                    return ownerId === String(user.id);
                  })() && (
                      <div>
                        <button className="btn btn-sm btn-primary me-2" onClick={() => handleEdit(job)}>Edit</button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(job._id)}>Delete</button>
                      </div>
                    )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
