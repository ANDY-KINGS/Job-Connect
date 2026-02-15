import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const JobForm = () => {
    const { token, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    const [form, setForm] = useState({
        title: '',
        description: '',
        location: '',
        company: '',
        jobType: 'full-time',
        salary: ''
    });


    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isEditMode && token) {
            // Fetch existing job details if editing
            const fetchJob = async () => {
                try {
                    // Ideally we would have a get-single-job endpoint, 
                    // reusing my-jobs for now or assuming we can fetch by ID if backend supports it.
                    // Based on previous steps, we only had getMyJobs (list).
                    // We SHOULD have a get single job endpoint or filter from list?
                    // Backend route: router.put("/:id"...) exists. 
                    // Usually GET /:id is widely standard. 
                    // Let's assume we might need to filter from the list if GET /:id isn't available for "my-jobs" scope specifically, 
                    // but usually access control handles it.
                    // Checking backend routes from memory: we didn't explicitly check GET /:id in jobRoutes in step 39, 
                    // but we did see PUT and DELETE. 
                    // Let's assume for now we might fail to fetch. 
                    // SAFE BET: Fetch all my jobs and find by ID to ensure ownership?
                    // Or just try GET /api/jobs/:id (if it exists). 
                    // Looking at step 40 (jobRoutes.js):
                    // router.post("/", ...);
                    // router.get="/my-jobs", ...);
                    // router.put("/:id", ...);
                    // router.delete("/:id", ...);
                    // THERE IS NO GET /:id defined in jobRoutes.js in Step 40!

                    // Workaround: Fetch all my jobs and find the one to edit.
                    const res = await axios.get('/api/jobs/my-jobs', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    const job = res.data.find(j => j._id === id);
                    if (job) {
                        setForm({
                            title: job.title,
                            description: job.description,
                            location: job.location,
                            company: job.company || '',
                            jobType: job.jobType || 'full-time',
                            salary: job.salary || ''
                        });

                    } else {
                        setError('Job not found or access denied.');
                    }

                } catch (err) {
                    console.error(err);
                    setError('Failed to fetch job details.');
                }
            };

            fetchJob();
        }
    }, [isEditMode, id, token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isEditMode) {
                await axios.put(`/api/jobs/${id}`, form, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.post('/api/jobs', form, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            navigate('/employer');
        } catch (err) {
            // Log full error response from backend
            console.error('❌ Job submission error:');
            console.error('Full error object:', err);
            console.error('Error response:', err.response);
            console.error('Error response data:', err.response?.data);

            // Extract error message from backend response
            let errorMessage = 'Failed to save job';

            if (err.response?.data) {
                const { message, errors, error } = err.response.data;

                // Use backend message if available
                if (message) {
                    errorMessage = message;
                }

                // If there are validation errors, append them
                if (errors && Array.isArray(errors) && errors.length > 0) {
                    errorMessage = `${message || 'Validation failed'}: ${errors.join(', ')}`;
                }

                // If there's a development error message, append it
                if (error && process.env.NODE_ENV === 'development') {
                    errorMessage += ` (${error})`;
                }
            }

            setError(errorMessage);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 font-sans overflow-x-hidden pt-12">
            <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-cyan-900/10 to-transparent pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex items-center justify-center">
                <div className="w-full max-w-2xl bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 shadow-2xl">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                            {isEditMode ? 'Edit Job' : 'Post a New Job'}
                        </h2>
                        <button onClick={() => navigate('/employer')} className="text-gray-400 hover:text-white transition-colors">
                            Cancel
                        </button>
                    </div>

                    {error && <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-200">{error}</div>}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Job Title</label>
                            <input
                                type="text"
                                className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 outline-none transition-all placeholder-gray-600"
                                placeholder="e.g. Senior React Developer"
                                value={form.title}
                                onChange={e => setForm({ ...form, title: e.target.value })}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Company Name</label>
                            <input
                                type="text"
                                className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 outline-none transition-all placeholder-gray-600"
                                placeholder="e.g. Google, Startup Inc"
                                value={form.company}
                                onChange={e => setForm({ ...form, company: e.target.value })}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Location</label>
                                <input
                                    type="text"
                                    className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 outline-none transition-all placeholder-gray-600"
                                    placeholder="e.g. Remote, New York"
                                    value={form.location}
                                    onChange={e => setForm({ ...form, location: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Salary Range</label>
                                <input
                                    type="text"
                                    className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 outline-none transition-all placeholder-gray-600"
                                    placeholder="e.g. $100k - $120k"
                                    value={form.salary}
                                    onChange={e => setForm({ ...form, salary: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Job Type</label>
                            <select
                                className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 outline-none transition-all cursor-pointer"
                                value={form.jobType}
                                onChange={e => setForm({ ...form, jobType: e.target.value })}
                                required
                            >
                                <option value="full-time">Full Time</option>
                                <option value="part-time">Part Time</option>
                                <option value="contract">Contract</option>
                                <option value="internship">Internship</option>
                            </select>
                        </div>



                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                            <textarea
                                className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 outline-none transition-all placeholder-gray-600 min-h-[150px]"
                                placeholder="Describe the role requirements and responsibilities..."
                                value={form.description}
                                onChange={e => setForm({ ...form, description: e.target.value })}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] ${loading
                                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-cyan-500/25 hover:shadow-purple-500/40'
                                }`}
                        >
                            {loading ? 'Saving...' : (isEditMode ? 'Update Job' : 'Publish Job')}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default JobForm;
