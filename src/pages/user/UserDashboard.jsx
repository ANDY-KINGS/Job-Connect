import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';

// Custom mini component for a futuristic Job Card
const JobCard = ({ job }) => (
    <div className="bg-gray-800/40 backdrop-blur-md p-6 rounded-2xl border border-gray-700/50 hover:border-cyan-500/30 transition-all duration-300 group relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative z-10 flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-cyan-900/20">
                    {job.company?.[0]?.toUpperCase() || job.employer?.name?.[0]?.toUpperCase() || 'J'}
                </div>
                <span className="px-3 py-1 bg-gray-700/50 text-cyan-400 text-[10px] font-bold uppercase tracking-wider rounded-full border border-gray-600/30">
                    {job.jobType?.replace('-', ' ') || 'Full Time'}
                </span>
            </div>
            <Link to={`/user/jobs/${job._id || job.id}`} className="block group">
                <h4 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors truncate">{job.title}</h4>
            </Link>
            <p className="text-base sm:text-lg lg:text-xl text-gray-400 mb-4 line-clamp-2">{job.company || job.employer?.name || 'Company Name'}</p>


            <div className="mt-auto flex items-center justify-between border-t border-gray-700/50 pt-4">
                <span className="inline-block px-3 py-1 bg-gray-700/30 rounded-full text-[10px] text-gray-400 border border-gray-700/50">{job.location}</span>
                <Link to={`/user/jobs/${job._id || job.id}`} className="text-cyan-400 text-xs font-bold hover:text-cyan-300 transition-colors">
                    Apply Now →
                </Link>
            </div>
        </div>
    </div>
);

const UserDashboard = () => {
    const navigate = useNavigate();
    const { user, logout } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Fetch jobs from API
    useEffect(() => {
        const fetchJobs = async () => {
            try {
                setLoading(true);
                const res = await axios.get('/api/jobs');
                setJobs(res.data);
                setError(null);
            } catch (err) {
                console.error('Error fetching jobs:', err);
                setError(err.response?.data?.message || 'Failed to load jobs. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    const [stats, setStats] = useState([
        { label: 'Applications', count: 0, icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6', color: 'cyan' },
        { label: 'Interviews', count: 0, icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z', color: 'purple' },
        { label: 'Saved Jobs', count: 0, icon: 'M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z', color: 'cyan' },
    ]);

    // Search and filter states
    const [searchQuery, setSearchQuery] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [jobTypeFilter, setJobTypeFilter] = useState('');

    // Fetch dashboard statistics
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('/api/dashboard/stats', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const { applicationsCount, interviewsCount, savedJobsCount } = res.data;

                setStats([
                    { label: 'Applications', count: applicationsCount, icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6', color: 'cyan' },
                    { label: 'Interviews', count: interviewsCount, icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z', color: 'purple' },
                    { label: 'Saved Jobs', count: savedJobsCount, icon: 'M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z', color: 'cyan' },
                ]);
            } catch (err) {
                console.error('Error fetching dashboard stats:', err);
                // Keep default values of 0 if fetching fails
            }
        };

        fetchStats();
    }, []);


    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Filter jobs based on search query and filters
    const filteredJobs = jobs.filter(job => {
        // Search filter (check title, company, description)
        const matchesSearch = !searchQuery ||
            job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.employer?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.skills?.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));

        // Location filter
        const matchesLocation = !locationFilter ||
            locationFilter === 'all' ||
            job.location?.toLowerCase().includes(locationFilter.toLowerCase());

        // Job type filter
        const matchesJobType = !jobTypeFilter ||
            jobTypeFilter === 'all' ||
            job.jobType?.toLowerCase() === jobTypeFilter.toLowerCase();

        return matchesSearch && matchesLocation && matchesJobType;
    });

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 font-sans selection:bg-cyan-500 selection:text-white flex overflow-hidden">

            {/* Ambient Background Glows */}
            <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-cyan-900/10 to-transparent pointer-events-none" />
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

            {/* Mobile Top Header (Visible only on small screens) */}
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

            {/* Sidebar Overlay (Mobile only) */}
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
                <div className="p-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-gradient-to-tr from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
                            <span className="text-white font-black text-xl italic">J</span>
                        </div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">JobConnect</h1>
                    </div>
                    {/* User Info */}
                    <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold opacity-70 pl-1">{user?.name || 'Talent'}</p>
                </div>

                <nav className="flex-1 px-4 space-y-3 mt-4">
                    {[
                        { id: 'dashboard', label: 'Dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
                        { id: 'jobs', label: 'Browse Jobs', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
                        { id: 'applied', label: 'My Applications', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => {
                                if (item.id === 'applied') {
                                    navigate('/user/applications');
                                } else {
                                    setActiveTab(item.id);
                                }
                            }}
                            className={`w-full flex items-center px-6 py-4 rounded-2xl transition-all duration-300 group ${activeTab === item.id
                                ? 'bg-gradient-to-r from-cyan-500/10 to-transparent border border-cyan-500/20 text-white shadow-[0_0_20px_rgba(34,211,238,0.1)]'
                                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                }`}
                        >

                            <span className={`w-2 h-2 rounded-full mr-4 ${activeTab === item.id ? 'bg-cyan-400 shadow-[0_0_10px_#22d3ee]' : 'bg-gray-600 group-hover:bg-gray-400'}`}></span>
                            <span className="font-medium text-sm">{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="p-6 mt-auto border-t border-gray-700/50">
                    <button
                        onClick={handleLogout}
                        className="w-full py-3 px-4 rounded-2xl border border-red-500/20 text-red-400 hover:bg-red-500/10 hover:border-red-500/50 transition-all duration-300 text-sm font-semibold tracking-wide flex items-center justify-center gap-2 group"
                    >
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 ml-0 lg:ml-72 relative min-h-screen overflow-y-auto overflow-x-hidden transform transition-all duration-500 pt-16 lg:pt-0 bg-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10 text-gray-100">

                    {/* Top Header */}
                    <div className="mb-12">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-2 tracking-tight">
                            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-400">{user?.name?.split(' ')[0] || 'Explorer'}</span>
                        </h2>
                        <p className="text-base sm:text-lg lg:text-xl text-gray-400">Find jobs that match your skills and interests</p>
                    </div>

                    {/* Search and Filter Section */}
                    <div className="bg-gray-800/30 backdrop-blur-md p-6 rounded-3xl border border-gray-700/50 mb-12 flex flex-col lg:flex-row gap-6 lg:items-center group shadow-xl">
                        <div className="flex-1 w-full relative group">
                            <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-cyan-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            <input
                                type="text"
                                placeholder="Search jobs, companies, or skills..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-gray-900/50 border border-gray-700 rounded-2xl py-4 pl-14 pr-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all text-sm sm:text-base lg:text-lg font-medium"
                            />
                        </div>
                        <div className="flex flex-col lg:flex-row gap-4 w-full lg:w-auto">
                            <select
                                value={locationFilter}
                                onChange={(e) => setLocationFilter(e.target.value)}
                                className="flex-1 lg:min-w-[140px] bg-gray-900/50 border border-gray-700 text-gray-400 text-sm rounded-xl px-4 py-4 hover:bg-gray-800 transition-colors cursor-pointer focus:ring-2 focus:ring-cyan-500/50 outline-none"
                            >
                                <option value="">All Locations</option>
                                <option value="remote">Remote</option>
                                <option value="nairobi">Nairobi</option>
                                <option value="mombasa">Mombasa</option>
                                <option value="kisumu">Kisumu</option>
                            </select>
                            <select
                                value={jobTypeFilter}
                                onChange={(e) => setJobTypeFilter(e.target.value)}
                                className="flex-1 lg:min-w-[140px] bg-gray-900/50 border border-gray-700 text-gray-400 text-sm rounded-xl px-4 py-4 hover:bg-gray-800 transition-colors cursor-pointer focus:ring-2 focus:ring-cyan-500/50 outline-none"
                            >
                                <option value="">All Types</option>
                                <option value="full-time">Full Time</option>
                                <option value="part-time">Part Time</option>
                                <option value="contract">Contract</option>
                                <option value="internship">Internship</option>
                            </select>
                        </div>
                    </div>


                    {/* Loading State */}
                    {loading && (
                        <div className="bg-gray-800/20 border border-dashed border-gray-700/50 rounded-[2.5rem] p-16 flex flex-col items-center justify-center text-center hover:bg-gray-800/30 transition-all duration-500 mb-12">
                            <div className="w-20 h-20 bg-gray-800/80 rounded-full flex items-center justify-center mb-6 shadow-2xl relative">
                                <div className="absolute inset-0 bg-cyan-500/10 rounded-full blur-xl animate-pulse" />
                                <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin relative z-10" />
                            </div>
                            <h4 className="text-2xl font-bold text-gray-300 mb-2">Loading jobs...</h4>
                            <p className="text-gray-500 max-w-sm">
                                Fetching the latest opportunities for you
                            </p>
                        </div>
                    )}

                    {/* Error State */}
                    {error && !loading && (
                        <div className="bg-red-500/5 border border-red-500/20 rounded-[2.5rem] p-16 flex flex-col items-center justify-center text-center hover:bg-red-500/10 transition-all duration-500 mb-12">
                            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6 shadow-2xl relative border border-red-500/20">
                                <svg className="w-10 h-10 text-red-400 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h4 className="text-2xl font-bold text-red-300 mb-2">Failed to load jobs</h4>
                            <p className="text-red-400/80 max-w-sm mb-8">
                                {error}
                            </p>
                            <button
                                onClick={() => window.location.reload()}
                                className="w-full sm:w-auto text-red-400 font-bold hover:text-red-300 transition-colors flex items-center justify-center gap-2 group text-sm uppercase tracking-widest border border-red-500/30 px-6 py-3 rounded-xl hover:bg-red-500/10"
                            >
                                Try Again
                                <svg className="w-4 h-4 transform group-hover:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                            </button>
                        </div>
                    )}

                    {/* Empty State (No Jobs) */}
                    {!loading && !error && jobs.length === 0 && (
                        <div className="bg-gray-800/20 border border-dashed border-gray-700/50 rounded-[2.5rem] p-16 flex flex-col items-center justify-center text-center hover:bg-gray-800/30 transition-all duration-500 mb-12">
                            <div className="w-20 h-20 bg-gray-800/80 rounded-full flex items-center justify-center mb-6 shadow-2xl relative">
                                <div className="absolute inset-0 bg-cyan-500/10 rounded-full blur-xl animate-pulse" />
                                <svg className="w-10 h-10 text-gray-600 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                            <h4 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-300 mb-2">No jobs available</h4>
                            <p className="text-base sm:text-lg lg:text-xl text-gray-500 max-w-sm mb-8">
                                There are no job listings at the moment. Check back soon for new opportunities!
                            </p>
                            <button
                                onClick={() => window.location.reload()}
                                className="w-full sm:w-auto text-cyan-400 font-bold hover:text-cyan-300 transition-colors flex items-center justify-center gap-2 group text-sm uppercase tracking-widest border border-cyan-500/20 px-6 py-3 rounded-xl hover:bg-cyan-500/5 transition-all"
                            >
                                Refresh
                                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                            </button>
                        </div>
                    )}

                    {/* Stats Section */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                        {stats.map((stat, i) => (
                            <div key={i} className={`w-full min-h-[160px] bg-gray-800/40 backdrop-blur-md p-6 rounded-3xl border border-gray-700/50 hover:border-${stat.color === 'cyan' ? 'cyan-500/30' : 'purple-500/30'} transition-all duration-300 group relative overflow-hidden flex flex-col justify-between`}>
                                <div className={`absolute inset-0 bg-gradient-to-br from-${stat.color}-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                                <div className="relative z-10">
                                    <p className="text-gray-400 font-medium mb-1 text-sm sm:text-base lg:text-lg">{stat.label}</p>
                                    <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-1">{stat.count}</h3>
                                    <div className={`h-1 w-12 bg-${stat.color}-500 rounded-full mt-4 group-hover:w-24 transition-all duration-500`} />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Job Exploration - Only show when jobs are available */}
                    {!loading && !error && jobs.length > 0 && (
                        <div>
                            <div className="flex justify-between items-end mb-8 border-b border-gray-800 pb-4">
                                <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
                                    {searchQuery || locationFilter || jobTypeFilter ? 'Search Results' : 'Recommended For You'}
                                    <span className="text-base md:text-lg text-gray-400 ml-3">({filteredJobs.length})</span>
                                </h3>
                                {(searchQuery || locationFilter || jobTypeFilter) && (
                                    <button
                                        onClick={() => {
                                            setSearchQuery('');
                                            setLocationFilter('');
                                            setJobTypeFilter('');
                                        }}
                                        className="text-cyan-400 text-sm sm:text-base font-semibold hover:text-cyan-300 transition-colors"
                                    >
                                        Clear Filters
                                    </button>
                                )}
                            </div>

                            {filteredJobs.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredJobs.map((job, i) => (
                                        <JobCard key={job._id || job.id || i} job={job} />
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-gray-800/20 border border-dashed border-gray-700/50 rounded-3xl p-16 flex flex-col items-center justify-center text-center">
                                    <div className="w-20 h-20 bg-gray-800/80 rounded-full flex items-center justify-center mb-6 shadow-2xl">
                                        <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <h4 className="text-2xl font-bold text-gray-300 mb-2">No jobs found</h4>
                                    <p className="text-gray-500 max-w-sm mb-6">
                                        No jobs match your search criteria. Try adjusting your filters.
                                    </p>
                                    <button
                                        onClick={() => {
                                            setSearchQuery('');
                                            setLocationFilter('');
                                            setJobTypeFilter('');
                                        }}
                                        className="text-cyan-400 font-bold hover:text-cyan-300 transition-colors border border-cyan-500/20 px-6 py-3 rounded-xl hover:bg-cyan-500/5"
                                    >
                                        Clear All Filters
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

export default UserDashboard;
