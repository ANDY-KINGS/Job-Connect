import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const AdminDashboard = () => {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Stats state for future API integration
    const [stats, setStats] = useState({
        totalUsers: "1,254",
        activeJobs: "456",
        pendingReview: "23"
    });

    const StatCard = ({ title, value, color }) => (
        <div className="w-full min-h-[120px] bg-gray-800/40 backdrop-blur-md p-6 rounded-2xl border border-gray-700/50 hover:border-cyan-500/30 transition-all duration-300 flex flex-col justify-between overflow-hidden">
            <p className={`text-[10px] sm:text-xs lg:text-sm font-bold text-${color === 'primary' ? 'cyan' : color === 'success' ? 'emerald' : 'amber'}-400 uppercase tracking-widest mb-2 truncate`}>{title}</p>
            <h4 className="text-2xl md:text-3xl lg:text-4xl font-black text-white truncate">{value}</h4>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 font-sans flex overflow-hidden">
            {/* Mobile Header */}
            <div className="block lg:hidden fixed top-0 left-0 w-full z-30 bg-gray-900/80 backdrop-blur-xl border-b border-gray-800/50 h-auto min-h-16 flex flex-col items-center py-4 gap-4 px-6">
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-tr from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20 text-white font-black italic text-lg">A</div>
                        <span className="font-bold text-lg bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">Admin Hub</span>
                    </div>
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-gray-400">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
                    </button>
                </div>
            </div>

            {/* Sidebar Overlay */}
            {isSidebarOpen && (
                <div className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={() => setIsSidebarOpen(false)} />
            )}

            {/* Sidebar */}
            <aside className={`
                w-72 bg-gray-800/50 backdrop-blur-xl border-r border-gray-700/50 flex flex-col fixed h-full z-50 transition-transform duration-300
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
            `}>
                <div className="p-8">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-8">Admin Panel</h1>
                    <div className="space-y-2">
                        {['overview', 'users', 'jobs'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => { setActiveTab(tab); setIsSidebarOpen(false); }}
                                className={`w-full flex items-center px-6 py-4 rounded-2xl transition-all duration-300 ${activeTab === tab
                                    ? 'bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 text-white shadow-lg shadow-cyan-500/10'
                                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                    }`}
                            >
                                <span className="capitalize font-semibold">{tab}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="p-6 mt-auto border-t border-gray-700/50">
                    <button onClick={() => { logout(); navigate('/login'); }} className="w-full py-3 px-4 rounded-2xl border border-red-500/20 text-red-400 hover:bg-red-500/10 hover:border-red-500/50 transition-all font-bold">
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-0 lg:ml-72 relative transform transition-all pt-16 lg:pt-0 overflow-x-hidden bg-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10 text-gray-100">
                    {activeTab === 'overview' && (
                        <div>
                            <div className="mb-12">
                                <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-2 tracking-tight">Dashboard <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-400">Overview</span></h2>
                                <p className="text-base sm:text-lg lg:text-xl text-gray-400 font-medium">System performance and analytics.</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                <StatCard title="Total Users" value={stats.totalUsers} color="primary" />
                                <StatCard title="Active Jobs" value={stats.activeJobs} color="success" />
                                <StatCard title="Pending Review" value={stats.pendingReview} color="warning" />
                            </div>

                            <div className="mt-12 bg-gray-800/40 backdrop-blur-md rounded-[2.5rem] p-8 border border-gray-700/50 shadow-xl">
                                <h4 className="text-xl font-bold text-white mb-6">Recent Activity</h4>
                                <p className="text-gray-400 italic">System activity log placeholder...</p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'users' && (
                        <div>
                            <h2 className="text-4xl font-extrabold text-white mb-12 tracking-tight">User <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-400">Management</span></h2>
                            <div className="bg-gray-800/20 border border-dashed border-gray-700/50 rounded-[2.5rem] p-16 text-center">
                                <div className="text-5xl mb-6">👥</div>
                                <h4 className="text-2xl font-bold text-white mb-4">User List Coming Soon</h4>
                                <p className="text-gray-400 max-w-sm mx-auto">Placeholder for advanced user controls and moderation features.</p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'jobs' && (
                        <div>
                            <h2 className="text-4xl font-extrabold text-white mb-12 tracking-tight">Job <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-400">Moderation</span></h2>

                            <div className="mb-8">
                                <button
                                    onClick={() => navigate("/admin/view-jobs")}
                                    className="px-4 py-2 rounded bg-cyan-600 text-white hover:bg-cyan-700 transition-colors"
                                >
                                    View All Jobs
                                </button>
                            </div>

                            <div className="bg-gray-800/20 border border-dashed border-gray-700/50 rounded-[2.5rem] p-16 text-center">
                                <div className="text-5xl mb-6">🛡️</div>
                                <h4 className="text-2xl font-bold text-white mb-4">Moderation Tools Placeholder</h4>
                                <p className="text-gray-400 max-w-sm mx-auto">Tools for reviewing and approving new job postings.</p>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
