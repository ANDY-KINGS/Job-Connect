import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';

const MyApplications = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                setLoading(true);
                const res = await api.get('/applications/my');
                setApplications(res.data.applications);
                setError(null);
            } catch (err) {
                console.error('Error fetching applications:', err);
                setError(err.response?.data?.message || 'Failed to load applications.');
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchApplications();
        }
    }, [user]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'accepted': return 'bg-green-500/10 text-green-400 border-green-500/20';
            case 'rejected': return 'bg-red-500/10 text-red-400 border-red-500/20';
            case 'reviewed': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
            default: return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 font-sans selection:bg-cyan-500 selection:text-white flex overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-cyan-900/10 to-transparent pointer-events-none" />

            {/* Mobile Top Header */}
            <div className="block lg:hidden fixed top-0 left-0 w-full z-30 bg-gray-900/80 backdrop-blur-xl border-b border-gray-800/50 h-auto min-h-16 flex flex-col items-center py-4 gap-4 px-6">
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-tr from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20 text-white font-black italic text-lg">J</div>
                        <span className="font-bold text-lg bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">JobConnect</span>
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
                w-72 bg-gray-800/50 backdrop-blur-xl border-r border-gray-700/50 flex flex-col fixed h-full z-50 transition-transform duration-300
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
            `}>
                <div className="p-8 text-center lg:text-left">
                    <div className="flex items-center gap-3 mb-2 justify-center sm:justify-start">
                        <div className="w-10 h-10 bg-gradient-to-tr from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
                            <span className="text-white font-black text-xl italic">J</span>
                        </div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">JobConnect</h1>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-3 mt-4">
                    <Link to="/user/dashboard" className="w-full flex items-center px-6 py-4 rounded-2xl transition-all duration-300 text-gray-400 hover:bg-gray-800 hover:text-white group">
                        <span className="w-2 h-2 rounded-full mr-4 bg-gray-600 group-hover:bg-gray-400"></span>
                        <span className="font-medium text-sm">Dashboard</span>
                    </Link>
                    <Link to="/user/applications" className="w-full flex items-center px-6 py-4 rounded-2xl transition-all duration-300 bg-gradient-to-r from-cyan-500/10 to-transparent border border-cyan-500/20 text-white shadow-[0_0_20px_rgba(34,211,238,0.1)] group">
                        <span className="w-2 h-2 rounded-full mr-4 bg-cyan-400 shadow-[0_0_10px_#22d3ee]"></span>
                        <span className="font-medium text-sm">My Applications</span>
                    </Link>
                </nav>

                <div className="p-6 mt-auto border-t border-gray-700/50">
                    <button onClick={handleLogout} className="w-full py-3 px-4 rounded-2xl border border-red-500/20 text-red-400 hover:bg-red-500/10 hover:border-red-500/50 transition-all duration-300 text-sm font-semibold tracking-wide flex items-center justify-center gap-2 group">
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 ml-0 lg:ml-72 relative min-h-screen overflow-y-auto overflow-x-hidden pt-16 lg:pt-0 bg-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10 text-gray-100">
                    <div className="mb-12">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-2 tracking-tight">
                            My <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-400">Applications</span>
                        </h2>
                        <p className="text-base sm:text-lg lg:text-xl text-gray-400 font-medium">Track the status of your job applications</p>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="bg-gray-800/20 backdrop-blur-md p-8 rounded-[2rem] border border-gray-700/30 animate-pulse">
                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                        <div className="flex items-center gap-6">
                                            <div className="w-16 h-16 bg-gray-700/50 rounded-2xl"></div>
                                            <div className="space-y-2">
                                                <div className="h-6 bg-gray-700/50 rounded-lg w-48"></div>
                                                <div className="h-4 bg-gray-700/50 rounded-lg w-32"></div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="w-24 h-10 bg-gray-700/50 rounded-xl"></div>
                                            <div className="w-24 h-10 bg-gray-700/50 rounded-xl"></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : error ? (
                        <div className="bg-red-500/5 border border-red-500/20 rounded-[2.5rem] p-16 flex flex-col items-center justify-center text-center hover:bg-red-500/10 transition-all duration-500 mb-12">
                            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6 shadow-2xl border border-red-500/20">
                                <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h4 className="text-2xl font-bold text-red-300 mb-2">Failed to load applications</h4>
                            <p className="text-red-400/80 max-w-sm mb-8">{error}</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="w-full sm:w-auto text-red-400 font-bold hover:text-red-300 transition-colors flex items-center justify-center gap-2 group text-sm uppercase tracking-widest border border-red-500/30 px-6 py-3 rounded-xl hover:bg-red-500/10"
                            >
                                Try Again
                                <svg className="w-4 h-4 transform group-hover:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                            </button>
                        </div>
                    ) : applications.length === 0 ? (
                        <div className="bg-gray-800/20 border border-dashed border-gray-700/50 rounded-[2.5rem] p-16 flex flex-col items-center justify-center text-center hover:bg-gray-800/30 transition-all duration-500">
                            <div className="w-24 h-24 bg-gray-800/80 rounded-full flex items-center justify-center mb-8 shadow-2xl relative">
                                <div className="absolute inset-0 bg-cyan-500/10 rounded-full blur-xl animate-pulse" />
                                <svg className="w-12 h-12 text-gray-600 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h4 className="text-2xl md:text-3xl lg:text-4xl font-black text-white mb-4 tracking-tighter">No Applications Yet</h4>
                            <p className="text-base sm:text-lg lg:text-xl text-gray-500 mb-10 max-w-sm mx-auto leading-relaxed">
                                You haven't started your journey yet. The perfect opportunity is waiting for you in the dashboard!
                            </p>
                            <Link to="/user/dashboard" className="w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-cyan-600 to-cyan-500 text-white font-black rounded-2xl hover:shadow-[0_0_30px_rgba(34,211,238,0.3)] hover:scale-105 transition-all text-sm uppercase tracking-widest text-center">
                                Discover Jobs
                            </Link>
                        </div>
                    ) : (

                        <>
                            {/* Mobile View: Cards Layout */}
                            <div className="md:hidden grid grid-cols-1 gap-6">
                                {applications.map((app) => (
                                    <div key={app._id} className="w-full bg-gray-800/40 backdrop-blur-md p-6 rounded-[2rem] border border-gray-700/50 hover:border-cyan-500/30 transition-all duration-300 group">
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center text-xl font-black text-cyan-400 border border-gray-700/50">
                                                {app.job_id?.company?.charAt(0) || 'J'}
                                            </div>
                                            <div className="overflow-hidden">
                                                <Link to={`/user/jobs/${app.job_id?._id}`} className="text-lg font-bold text-white hover:text-cyan-400 transition-colors block truncate">
                                                    {app.job_id?.title || 'Unknown Job'}
                                                </Link>
                                                <p className="text-sm text-gray-500 font-medium truncate">{app.job_id?.company || 'Company Unknown'}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between border-t border-gray-700/30 pt-6">
                                            <div>
                                                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black mb-1">Applied</p>
                                                <p className="text-xs text-gray-400">{new Date(app.createdAt).toLocaleDateString()}</p>
                                            </div>
                                            <div className={`px-4 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-widest ${getStatusColor(app.status)}`}>
                                                {app.status}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Desktop View: Table Layout */}
                            <div className="hidden md:block bg-gray-800/40 backdrop-blur-md rounded-[2.5rem] border border-gray-700/50 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-gray-700/50 bg-gray-900/50">
                                                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-gray-500">Job Opportunity</th>
                                                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-gray-500">Company</th>
                                                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-gray-500 text-center">Applied On</th>
                                                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-gray-500 text-center">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-700/30">
                                            {applications.map((app) => (
                                                <tr key={app._id} className="hover:bg-cyan-500/5 transition-colors group">
                                                    <td className="px-8 py-6">
                                                        <Link to={`/user/jobs/${app.job_id?._id}`} className="font-bold text-white group-hover:text-cyan-400 transition-colors">
                                                            {app.job_id?.title || 'Unknown Job'}
                                                        </Link>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <span className="text-gray-400 font-medium">{app.job_id?.company || 'Company Unknown'}</span>
                                                    </td>
                                                    <td className="px-8 py-6 text-center text-gray-500 text-sm">
                                                        {new Date(app.createdAt).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <div className="flex justify-center">
                                                            <span className={`px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest ${getStatusColor(app.status)}`}>
                                                                {app.status}
                                                            </span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </main >
        </div >
    );
};

export default MyApplications;
