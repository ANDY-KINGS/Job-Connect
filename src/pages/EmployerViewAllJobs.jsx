import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function EmployerViewAllJobs() {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const res = await api.get("/employer/jobs");
            setJobs(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Failed to load jobs:", err);
            alert("Failed to load jobs");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-white">
                        All Posted Jobs
                    </h1>
                    <button
                        onClick={() => navigate("/employer")}
                        className="px-4 py-2 rounded bg-gray-700 text-white hover:bg-gray-600 transition-colors"
                    >
                        ← Back to Dashboard
                    </button>
                </div>

                {loading ? (
                    <div className="text-center text-gray-400">Loading...</div>
                ) : (
                    <div className="grid gap-6">
                        {jobs.map(job => (
                            <div
                                key={job._id}
                                className="bg-gray-800/40 backdrop-blur-md p-6 rounded-2xl border border-gray-700/50 hover:border-cyan-500/30 transition-all"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h2 className="text-xl font-bold text-white mb-2">
                                            {job.title}
                                        </h2>
                                        <p className="text-sm text-gray-400">
                                            📍 {job.location} • {job.company}
                                        </p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs ${job.status === 'active'
                                            ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                                            : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                                        }`}>
                                        {job.status}
                                    </span>
                                </div>

                                <p className="text-gray-300 mb-4 line-clamp-3">
                                    {job.description}
                                </p>

                                <div className="flex justify-between items-center pt-4 border-t border-gray-700/30">
                                    <div className="flex gap-4 text-xs text-gray-500">
                                        <span>Type: {job.jobType}</span>
                                        <span>Salary: {job.salary}</span>
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        Posted by: {job.employer?.name || job.createdBy?.name}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
