import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';

const JobDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isApplying, setIsApplying] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [hasApplied, setHasApplied] = useState(false);

    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
                setLoading(true);
                const res = await api.get(`/jobs/${id}`);
                setJob(res.data);
                setError(null);
            } catch (err) {
                console.error('Error fetching job details:', err);
                setError(err.response?.data?.message || 'Failed to load job details. It might have been removed.');
            } finally {
                setLoading(false);
            }
        };

        const checkApplicationStatus = async () => {
            try {
                // Call check endpoint to see if user has already applied
                const res = await api.get(`/applications/check/${id}`);
                setHasApplied(res.data.applied);
            } catch (err) {
                console.error('Error checking application status:', err);
                // If error, assume not applied
                setHasApplied(false);
            }
        };

        fetchJobDetails();

        // Only check application status if user is authenticated and is a jobseeker
        if (user && ['user', 'jobseeker'].includes(user.role)) {
            checkApplicationStatus();
        }

    }, [id, user]);

    const handleApply = async () => {
        try {
            setIsApplying(true);
            setSuccessMessage('');

            // Send POST request to /api/applications
            // user_id will be extracted from auth session on backend
            const res = await api.post('/applications', {
                job_id: id
            });

            // Update local state to reflect application
            setHasApplied(true);

            // Show success message
            setSuccessMessage('Application submitted successfully! 🎉');

            // Clear success message after 5 seconds
            setTimeout(() => {
                setSuccessMessage('');
            }, 5000);

            console.log('Application submitted successfully:', res.data);
        } catch (err) {
            console.error('Error submitting application:', err);

            // Show readable error message
            const errorMessage = err.response?.data?.message ||
                err.response?.data?.error ||
                'Failed to submit application. Please try again.';

            if (errorMessage === "Already applied") {
                setHasApplied(true);
            } else {
                alert(errorMessage);
            }
        } finally {
            setIsApplying(false);
        }

    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="relative">
                    <div className="w-20 h-20 bg-cyan-500/20 rounded-full animate-ping absolute inset-0" />
                    <div className="w-20 h-20 bg-cyan-500/40 rounded-full flex items-center justify-center relative z-10 border border-cyan-500/30">
                        <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                </div>
            </div>
        );
    }

    if (error || !job) {
        return (
            <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mb-8 border border-red-500/20">
                    <svg className="w-12 h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">Error Loading Job</h2>
                <p className="text-gray-400 max-w-md mb-10 leading-relaxed">{error}</p>
                <button
                    onClick={() => navigate('/user/dashboard')}
                    className="px-8 py-4 bg-cyan-500 text-white font-bold rounded-2xl hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/20"
                >
                    Back to Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 font-sans selection:bg-cyan-500 selection:text-white pb-20">
            {/* Background Gradients */}
            <div className="fixed top-0 left-0 w-full h-96 bg-gradient-to-b from-cyan-900/20 to-transparent pointer-events-none z-0" />

            {/* Navigation Header */}
            <header className="relative z-20 border-b border-gray-800/50 bg-gray-900/50 backdrop-blur-xl sticky top-0 overflow-x-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-auto lg:h-20 py-4 lg:py-0 flex flex-col lg:flex-row items-center justify-between gap-4">
                    <Link to="/user/dashboard" className="px-3 py-1.5 lg:px-4 lg:py-2 border border-gray-700/50 rounded-xl text-gray-400 font-bold hover:text-cyan-400 hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-all duration-300 flex items-center gap-2 group text-xs lg:text-sm">
                        <span className="transform group-hover:-translate-x-1 transition-transform">←</span>
                        <span>Back to Jobs</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <span className="text-[10px] lg:text-sm text-gray-500">Logged in as <span className="text-cyan-400 font-bold">{user?.name?.split(' ')[0]}</span></span>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 relative z-10 overflow-x-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                    {/* Left Column: Job Overview & Description */}
                    <div className="lg:col-span-2 space-y-6 lg:space-y-8">
                        {/* Hero Section */}
                        <div className="bg-gray-800/40 backdrop-blur-md rounded-[2.5rem] lg:rounded-[40px] p-6 lg:p-12 border border-gray-700/50 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

                            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8 relative z-10">
                                <div className="w-24 h-24 bg-gray-900 rounded-3xl flex items-center justify-center text-3xl font-black text-cyan-400 shadow-2xl border border-gray-700/50 group-hover:scale-105 transition-transform duration-500">
                                    {job.company?.[0]?.toUpperCase() || 'J'}
                                </div>
                                <div className="flex-1">
                                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 leading-tight">{job.title}</h1>
                                    <div className="flex flex-wrap gap-4 text-gray-400">
                                        <div className="flex items-center gap-2 px-4 py-2 bg-gray-900/50 rounded-xl border border-gray-700/30">
                                            <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-10V4m0 10V4m-4 10h4" /></svg>
                                            <span className="text-sm sm:text-base lg:text-lg font-semibold">{job.company}</span>
                                        </div>
                                        <div className="flex items-center gap-2 px-4 py-2 bg-gray-900/50 rounded-xl border border-gray-700/30">
                                            <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                            <span className="text-sm sm:text-base lg:text-lg font-semibold">{job.location}</span>
                                        </div>
                                        <div className="flex items-center gap-2 px-4 py-2 bg-gray-900/50 rounded-xl border border-gray-700/30">
                                            <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            <span className="text-sm sm:text-base lg:text-lg font-semibold">{job.jobType || 'Full-time'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Description Section */}
                        <div className="bg-gray-800/30 rounded-[2.5rem] lg:rounded-[40px] p-6 lg:p-12 border border-gray-700/30">
                            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-6 lg:mb-8 flex items-center gap-4">
                                <span className="w-2 h-8 bg-cyan-500 rounded-full shadow-[0_0_15px_#22d3ee]" />
                                Job Description
                            </h3>
                            <div className="prose prose-invert max-w-none mb-12">
                                <p className="text-base sm:text-lg lg:text-xl text-gray-400 leading-relaxed whitespace-pre-line">
                                    {job.description}
                                </p>
                            </div>

                            <div className="border-t border-gray-700/30 pt-10 flex flex-col items-center">
                                {/* Success Message */}
                                {successMessage && (
                                    <div className="mb-6 px-8 py-4 bg-green-500/20 border border-green-500/30 rounded-2xl text-green-400 font-bold text-center animate-pulse">
                                        {successMessage}
                                    </div>
                                )}

                                {(['user', 'jobseeker'].includes(user?.role)) ? (
                                    <button
                                        onClick={handleApply}
                                        disabled={hasApplied || isApplying}
                                        className={`w-full md:w-auto px-12 py-5 font-black rounded-2xl flex items-center justify-center gap-3 group transition-all shadow-[0_0_30px_rgba(34,211,238,0.2)] ${hasApplied || isApplying
                                            ? 'bg-gray-700 text-gray-400 cursor-not-allowed opacity-70'
                                            : 'bg-gradient-to-r from-cyan-600 to-cyan-500 text-white hover:shadow-[0_0_40px_rgba(34,211,238,0.4)] hover:scale-105'
                                            }`}
                                    >
                                        <span>
                                            {isApplying ? 'APPLYING...' : hasApplied ? 'APPLIED' : 'APPLY FOR THIS JOB'}
                                        </span>
                                        {isApplying && (
                                            <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                                        )}
                                        {!isApplying && !hasApplied && (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                                        )}
                                        {!isApplying && hasApplied && (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                        )}
                                    </button>
                                ) : !user ? (
                                    <Link
                                        to="/login"
                                        className="w-full md:w-auto px-12 py-5 bg-gray-800 text-cyan-400 font-black rounded-2xl border border-cyan-500/30 hover:bg-cyan-500/5 transition-all text-center"
                                    >
                                        LOGIN TO APPLY
                                    </Link>
                                ) : (
                                    <p className="text-gray-500 italic text-sm border border-gray-700/30 px-6 py-3 rounded-xl bg-gray-900/50">
                                        Viewing as <span className="text-cyan-400 font-bold uppercase">{user.role}</span>. Applications are reserved for Job Seekers.
                                    </p>
                                )}

                            </div>
                        </div>
                    </div>

                    {/* Right Column: Key Details & Actions */}
                    <div className="lg:col-span-1">
                        <div className="lg:sticky lg:top-28 space-y-8">
                            {/* Salary & Type Card */}
                            <div className="bg-gradient-to-br from-cyan-600 to-cyan-800 rounded-[2.5rem] lg:rounded-[40px] p-8 lg:p-10 text-white shadow-2xl relative overflow-hidden group">
                                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                                <div className="relative z-10">
                                    <p className="text-cyan-100 font-semibold mb-2 opacity-80 uppercase tracking-widest text-[10px] sm:text-xs lg:text-sm">OFFERED SALARY</p>
                                    <h4 className="text-3xl md:text-4xl lg:text-5xl font-black mb-10 tracking-tight">{job.salary}</h4>
                                    {(['user', 'jobseeker'].includes(user?.role)) && (
                                        <button
                                            onClick={handleApply}
                                            disabled={hasApplied || isApplying}
                                            className={`w-full py-5 font-extrabold rounded-2xl tracking-wide mb-4 transition-all shadow-xl shadow-cyan-950/40 flex items-center justify-center gap-3 ${hasApplied || isApplying
                                                ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                                                : 'bg-gradient-to-br from-white to-gray-200 text-cyan-900 hover:scale-[1.02]'
                                                }`}
                                        >
                                            <span className="text-base sm:text-lg lg:text-xl font-extrabold uppercase tracking-tight">
                                                {isApplying ? 'APPLYING...' : hasApplied ? 'ALREADY APPLIED' : 'APPLY NOW'}
                                            </span>
                                            {isApplying && (
                                                <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin" />
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Additional Info */}
                            <div className="bg-gray-800/40 backdrop-blur-md rounded-[2.5rem] lg:rounded-[40px] p-8 lg:p-10 border border-gray-700/50">
                                <h4 className="text-lg font-bold text-white mb-8 uppercase tracking-widest">Key Information</h4>
                                <div className="space-y-8">
                                    <div className="flex items-center gap-6 group">
                                        <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center text-cyan-400 border border-gray-700/50 group-hover:bg-cyan-500 group-hover:text-white transition-all">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 font-bold mb-1">POSTED ON</p>
                                            <p className="text-sm text-gray-300 font-semibold">{new Date(job.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6 group">
                                        <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center text-cyan-400 border border-gray-700/50 group-hover:bg-cyan-500 group-hover:text-white transition-all">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 font-bold mb-1">TOTAL VACANCIES</p>
                                            <p className="text-sm text-gray-300 font-semibold">Multiple Positions</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 bg-gray-800/20 rounded-[40px] border border-gray-700/20 border-dashed">
                                <p className="text-xs text-gray-500 italic leading-relaxed text-center">
                                    Avoid scams by never paying any fees. Reports this job if it asks for money.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default JobDetails;
