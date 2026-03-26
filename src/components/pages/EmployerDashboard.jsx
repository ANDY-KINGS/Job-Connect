import React, { useContext, useState, useEffect } from 'react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import DeleteJobButton from '../DeleteJobButton';

const EmployerDashboard = () => {
  const { user, token, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Real Data State
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [fetchingApplicants, setFetchingApplicants] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);


  // Stats State
  const [stats, setStats] = useState({
    total: 0,
    active: 0
  });

  const fetchJobs = async () => {
    try {
      const res = await api.get('/jobs/my-jobs');
      const jobData = res.data;
      setJobs(jobData);

      // Compute stats
      const total = jobData.length;
      const active = jobData.filter(job => job.status === 'active').length;

      setStats({ total, active });
      setLoading(false);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setError('Failed to load your jobs.');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchJobs();
    }
  }, [token]);

  const fetchApplicants = async (jobId) => {
    try {
      setFetchingApplicants(true);
      const res = await api.get(`/applications/job/${jobId}`);
      setApplicants(res.data.applications);
      setFetchingApplicants(false);
    } catch (err) {
      console.error("Error fetching applicants:", err);
      setFetchingApplicants(false);
    }
  };

  const handleViewApplicants = (job) => {
    setSelectedJob(job);
    setActiveTab('applicants');
    fetchApplicants(job._id);
  };

  const handleUpdateStatus = async (applicationId, newStatus) => {
    try {
      // Immediate UI update for responsiveness
      setApplicants(prev =>
        prev.map(app => app._id === applicationId ? { ...app, status: newStatus } : app)
      );

      await api.patch(`/applications/${applicationId}/status`,
        { status: newStatus }
      );
    } catch (err) {
      console.error("Error updating status:", err);
      // Revert if error
      fetchApplicants(selectedJob._id);
    }
  };



  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans selection:bg-cyan-500 selection:text-white flex overflow-hidden">

      {/* Mobile Top Header */}
      <div className="block lg:hidden fixed top-0 left-0 w-full z-30 bg-gray-900/80 backdrop-blur-xl border-b border-gray-800/50 h-auto min-h-16 flex flex-col items-center py-4 gap-4 px-6">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-tr from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20 text-white font-black italic text-lg">E</div>
            <span className="font-bold text-lg bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">Employer Hub</span>
          </div>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-gray-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
        </div>
      </div>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        w-72 bg-gray-800/50 backdrop-blur-xl border-r border-gray-700/50 flex flex-col fixed h-full z-50 transition-transform duration-300 overflow-y-auto
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
      `}>
        <div className="p-8">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-1">
            Employer Hub
          </h1>
          <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold opacity-70">
            {user?.name || 'Company Name'}
          </p>
        </div>

        <nav className="flex-1 px-4 space-y-3 mt-4">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center px-6 py-5 rounded-2xl transition-all duration-300 group ${activeTab === 'dashboard'
              ? 'bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 text-white shadow-[0_0_20px_rgba(34,211,238,0.2)]'
              : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
          >
            <span className={`w-2 h-2 rounded-full mr-4 ${activeTab === 'dashboard' ? 'bg-cyan-400 shadow-[0_0_10px_#22d3ee]' : 'bg-gray-600'}`}></span>
            <span className="font-medium">Dashboard</span>
          </button>

          <button
            onClick={() => navigate('/employer/jobs/new')}
            className={`w-full flex items-center px-6 py-5 rounded-2xl transition-all duration-300 group ${activeTab === 'post-job'
              ? 'bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-purple-500/30 text-white shadow-[0_0_20px_rgba(168,85,247,0.2)]'
              : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
          >
            <span className={`w-2 h-2 rounded-full mr-4 ${activeTab === 'post-job' ? 'bg-purple-400 shadow-[0_0_10px_#a855f7]' : 'bg-gray-600'}`}></span>
            <span className="font-medium">Add New Job</span>
          </button>

          <button
            onClick={() => navigate('/employer/view-jobs')}
            className="w-full flex items-center px-6 py-5 rounded-2xl transition-all duration-300 group text-gray-400 hover:bg-gray-800 hover:text-white"
          >
            <span className="w-2 h-2 rounded-full mr-4 bg-gray-600"></span>
            <span className="font-medium">View All Jobs</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('applicants');
              setSelectedJob(null);
              setIsSidebarOpen(false);
            }}
            className={`w-full flex items-center px-6 py-4 rounded-2xl transition-all duration-300 group ${activeTab === 'applicants'
              ? 'bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 text-white shadow-[0_0_20px_rgba(34,211,238,0.2)]'
              : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
          >
            <span className={`w-2 h-2 rounded-full mr-4 ${activeTab === 'applicants' ? 'bg-cyan-400 shadow-[0_0_10px_#22d3ee]' : 'bg-gray-600'}`}></span>
            <span className="font-medium">Applicants</span>
          </button>

          <div className="pt-4 mt-6 border-t border-gray-700/50">
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="w-full flex items-center px-6 py-4 rounded-2xl transition-all duration-300 group text-red-400 hover:bg-red-500/10 hover:border-red-500/50 border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.05)]"
            >
              <span className="w-2 h-2 rounded-full mr-4 bg-red-500 shadow-[0_0_10px_#ef4444]"></span>
              <span className="font-medium font-bold">Log Out</span>
            </button>
          </div>

        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-0 lg:ml-72 relative transform transition-all duration-500 pt-16 lg:pt-0 overflow-x-hidden bg-gray-900">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-cyan-900/10 to-transparent pointer-events-none" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10 text-gray-100">

          {/* Dashboard View */}
          {activeTab === 'dashboard' && (
            <>
              {/* Header */}
              <div className="mb-12">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-2 tracking-tight">
                  Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-400">{user?.name || 'Partner'}</span>
                </h2>
                <p className="text-base sm:text-lg lg:text-xl text-gray-400">Here's what's happening with your job postings today.</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">

                {/* Stat Card 1 */}
                <div className="w-full min-h-[160px] bg-gray-800/40 backdrop-blur-md p-6 rounded-3xl border border-gray-700/50 hover:border-cyan-500/30 transition-all duration-300 group relative overflow-hidden flex flex-col justify-between">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10">
                    <p className="text-gray-400 font-medium mb-1 text-sm sm:text-base lg:text-lg">Total Jobs</p>
                    <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-1">{loading ? '...' : stats.total}</h3>
                    <div className="h-1 w-12 bg-cyan-500 rounded-full mt-4 group-hover:w-24 transition-all duration-500" />
                  </div>
                </div>

                {/* Stat Card 2 */}
                <div className="w-full min-h-[160px] bg-gray-800/40 backdrop-blur-md p-6 rounded-3xl border border-gray-700/50 hover:border-purple-500/30 transition-all duration-300 group relative overflow-hidden flex flex-col justify-between">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10">
                    <p className="text-gray-400 font-medium mb-1 text-sm sm:text-base lg:text-lg">Active Postings</p>
                    <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-1">{loading ? '...' : stats.active}</h3>
                    <div className="h-1 w-12 bg-purple-500 rounded-full mt-4 group-hover:w-24 transition-all duration-500" />
                  </div>
                </div>

                {/* Quick Action */}
                <div className="w-full min-h-[160px] bg-gradient-to-br from-gray-800 to-gray-900 p-1 rounded-3xl relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-3xl opacity-20 group-hover:opacity-40 blur transition-opacity duration-500" />
                  <div className="bg-gray-900 h-full rounded-[20px] p-6 relative flex flex-col justify-center items-center text-center">
                    <h4 className="text-xl font-bold text-white mb-2">Grow Your Team</h4>
                    <p className="text-gray-400 text-sm mb-6">Create a new posting to attract talent.</p>
                    <button
                      onClick={() => navigate('/employer/jobs/new')}
                      className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold text-sm shadow-lg shadow-cyan-500/25 hover:shadow-purple-500/40 hover:scale-105 active:scale-95 transition-all duration-300"
                    >
                      Post a Job +
                    </button>
                  </div>
                </div>
              </div>

              {/* Job Postings Section */}
              <div>
                <div className="flex justify-between items-end mb-8 border-b border-gray-800 pb-4">
                  <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">Your Job Postings</h3>
                </div>

                {loading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="bg-gray-800/20 backdrop-blur-md p-6 rounded-2xl border border-gray-700/50 animate-pulse">
                        <div className="h-6 bg-gray-700/50 rounded-lg w-3/4 mb-4"></div>
                        <div className="h-4 bg-gray-700/50 rounded-lg w-full mb-2"></div>
                        <div className="h-4 bg-gray-700/50 rounded-lg w-5/6 mb-6"></div>
                        <div className="flex justify-between items-center border-t border-gray-700/50 pt-4">
                          <div className="h-6 bg-gray-700/50 rounded-full w-20"></div>
                          <div className="h-6 bg-gray-700/50 rounded-lg w-16"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : jobs.length === 0 ? (
                  <div className="bg-gray-800/20 border border-dashed border-gray-700/50 rounded-[2.5rem] p-16 flex flex-col items-center justify-center text-center hover:bg-gray-800/30 transition-all duration-500">
                    <div className="w-20 h-20 bg-gray-800/80 rounded-full flex items-center justify-center mb-6 shadow-2xl relative">
                      <div className="absolute inset-0 bg-purple-500/10 rounded-full blur-xl animate-pulse" />
                      <svg className="w-10 h-10 text-gray-600 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <h4 className="text-2xl font-bold text-gray-300 mb-2">Build Your High-Performance Team</h4>
                    <p className="text-gray-500 max-w-sm mb-8">Ready to find your next great hire? Start by posting your first opportunity.</p>
                    <button
                      onClick={() => navigate('/employer/jobs/new')}
                      className="w-full sm:w-auto text-cyan-400 font-black uppercase tracking-widest text-xs hover:text-cyan-300 transition-colors border-b border-cyan-500/30 pb-1 py-3"
                    >
                      Post Your First Job
                    </button>
                  </div>
                ) : (

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {jobs.map(job => (
                      <div key={job._id} className="w-full min-h-[250px] bg-gray-800/40 p-6 rounded-2xl border border-gray-700/50 text-white flex flex-col group hover:border-cyan-500/30 transition-all duration-300 relative overflow-hidden">
                        <div className="relative z-10 flex-1 overflow-hidden">
                          <h4 className="font-bold text-xl md:text-2xl lg:text-3xl mb-2 truncate">{job.title}</h4>
                          <p className="text-base sm:text-lg lg:text-xl text-gray-400 mb-4 line-clamp-3">{job.description}</p>
                        </div>
                        <div className="relative z-10 mt-4 flex justify-between items-center border-t border-gray-700/50 pt-4">
                          <span className="inline-block px-3 py-1 bg-gray-700/50 rounded-full text-xs text-cyan-400">{job.location}</span>
                          <div className="flex gap-2">
                            <button onClick={() => handleViewApplicants(job)} className="text-sm font-bold text-cyan-400 hover:text-cyan-300">Applicants</button>
                            <button onClick={() => navigate(`/employer/jobs/edit/${job._id}`)} className="text-sm text-gray-400 hover:text-white">Edit</button>
                            <DeleteJobButton jobId={job._id} onDeleted={fetchJobs} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Applicants View */}
          {activeTab === 'applicants' && (
            <div>
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-6">
                <div>
                  <h2 className="text-4xl font-extrabold text-white mb-2 tracking-tight">
                    {selectedJob ? 'Job' : 'All'} <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-400">Applicants</span>
                  </h2>
                  <p className="text-gray-400 text-lg">
                    {selectedJob ? `Managing applicants for: ${selectedJob.title}` : 'Select a job to view its specific applicants.'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setActiveTab('dashboard');
                    setSelectedJob(null);
                  }}
                  className="px-6 py-2 rounded-xl border border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-white transition-all text-sm font-bold"
                >
                  ← Back to Dashboard
                </button>
              </div>

              {selectedJob ? (
                fetchingApplicants ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="bg-gray-800/20 backdrop-blur-md h-20 rounded-2xl border border-gray-700/50 animate-pulse"></div>
                    ))}
                  </div>
                ) : applicants.length === 0 ? (
                  <div className="bg-gray-800/20 border border-dashed border-gray-700/50 rounded-[2.5rem] p-16 flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 bg-gray-800/80 rounded-full flex items-center justify-center mb-6 shadow-2xl relative">
                      <div className="absolute inset-0 bg-cyan-500/10 rounded-full blur-xl animate-pulse" />
                      <svg className="w-10 h-10 text-gray-600 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <h4 className="text-2xl font-bold text-gray-300 mb-2 tracking-tight">Listening for Talent...</h4>
                    <p className="text-gray-500 max-w-sm">Applicants for this position will appear here in real-time as they apply.</p>
                  </div>
                ) : (

                  <>
                    {/* Mobile View: Cards Layout */}
                    <div className="md:hidden space-y-4">
                      {applicants.map((app) => (
                        <div key={app._id} className="bg-gray-800/40 backdrop-blur-md p-6 rounded-3xl border border-gray-700/50">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center text-cyan-400 font-bold text-xl">
                              {app.user_id?.name?.charAt(0) || 'U'}
                            </div>
                            <div>
                              <h4 className="text-white font-bold">{app.user_id?.name}</h4>
                              <p className="text-gray-500 text-sm">{app.user_id?.email}</p>
                            </div>
                          </div>

                          <div className="flex flex-col gap-4 border-t border-gray-700/30 pt-4">
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-gray-500 uppercase tracking-widest text-[10px] font-black">Applied On</span>
                              <span className="text-gray-400">{new Date(app.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-500 uppercase tracking-widest text-[10px] font-black">Status</span>
                              <select
                                value={app.status}
                                onChange={(e) => handleUpdateStatus(app._id, e.target.value)}
                                className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter border cursor-pointer outline-none transition-all ${app.status === 'accepted' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                  app.status === 'rejected' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                    app.status === 'reviewed' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                                      'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                                  }`}
                              >
                                <option value="pending" className="bg-gray-900 text-cyan-400">Pending</option>
                                <option value="reviewed" className="bg-gray-900 text-purple-400">Reviewed</option>
                                <option value="accepted" className="bg-gray-900 text-green-400">Accepted</option>
                                <option value="rejected" className="bg-gray-900 text-red-400">Rejected</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Desktop View: Table Layout */}
                    <div className="hidden md:block bg-gray-800/40 backdrop-blur-md rounded-3xl border border-gray-700/50 overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="border-b border-gray-700/50 bg-gray-900/50">
                              <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-gray-500">Applicant</th>
                              <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-gray-500">Contact</th>
                              <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-gray-500">Applied Date</th>
                              <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-gray-500 text-center">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-700/30">
                            {applicants.map((app) => (
                              <tr key={app._id} className="hover:bg-cyan-500/5 transition-colors group">
                                <td className="px-8 py-6">
                                  <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-cyan-400 font-bold">
                                      {app.user_id?.name?.charAt(0) || 'U'}
                                    </div>
                                    <span className="font-bold text-white group-hover:text-cyan-400 transition-colors">{app.user_id?.name}</span>
                                  </div>
                                </td>
                                <td className="px-8 py-6 text-gray-400 text-sm font-medium">{app.user_id?.email}</td>
                                <td className="px-8 py-6 text-gray-400 text-sm">
                                  {new Date(app.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-8 py-6 text-center">
                                  <select
                                    value={app.status}
                                    onChange={(e) => handleUpdateStatus(app._id, e.target.value)}
                                    className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter border cursor-pointer outline-none transition-all ${app.status === 'accepted' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                      app.status === 'rejected' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                        app.status === 'reviewed' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                                          'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                                      }`}
                                  >
                                    <option value="pending" className="bg-gray-900 text-cyan-400">Pending</option>
                                    <option value="reviewed" className="bg-gray-900 text-purple-400">Reviewed</option>
                                    <option value="accepted" className="bg-gray-900 text-green-400">Accepted</option>
                                    <option value="rejected" className="bg-gray-900 text-red-400">Rejected</option>
                                  </select>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                )
              ) : (
                <div className="bg-gray-800/20 border border-dashed border-gray-700/50 rounded-[2.5rem] p-16 flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-gray-800/80 rounded-full flex items-center justify-center mb-6 shadow-2xl relative">
                    <div className="absolute inset-0 bg-cyan-500/10 rounded-full blur-xl animate-pulse" />
                    <svg className="w-10 h-10 text-gray-600 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                    </svg>
                  </div>
                  <h4 className="text-2xl font-bold text-gray-300 mb-2 tracking-tight">Candidate Hub</h4>
                  <p className="text-gray-500 max-w-sm mb-8">Go back to the dashboard and pick a job to deep-dive into its applicant pool.</p>
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className="text-cyan-400 font-black uppercase tracking-widest text-[10px] hover:text-cyan-300 transition-colors border border-cyan-500/30 px-6 py-2 rounded-xl"
                  >
                    View Job Listings
                  </button>
                </div>
              )}

            </div>
          )}


        </div>
      </main>
    </div>
  );
};

export default EmployerDashboard;