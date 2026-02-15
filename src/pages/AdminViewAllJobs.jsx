import { useEffect, useState } from "react";
import api from "../services/api";

export default function AdminViewAllJobs() {

    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const res = await api.get("/admin/jobs");
            setJobs(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Failed to load jobs:", err);
            alert("Failed to load jobs");
            setLoading(false);
        }
    };

    return (
        <div className="p-6 min-h-screen bg-gray-100 dark:bg-gray-900">

            <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
                All Posted Jobs (Read Only)
            </h1>

            {loading ? (
                <div className="text-center text-gray-600 dark:text-gray-400">Loading...</div>
            ) : (
                <div className="grid gap-4">

                    {jobs.map(job => (
                        <div
                            key={job._id}
                            className="p-4 rounded-lg shadow bg-white dark:bg-gray-800"
                        >
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {job.title}
                            </h2>

                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                {job.location}
                            </p>

                            <p className="text-sm mt-2 text-gray-700 dark:text-gray-200">
                                {job.description}
                            </p>

                            <p className="text-xs mt-3 text-gray-500">
                                Posted by: {job.createdBy?.name} ({job.createdBy?.role})
                            </p>
                        </div>
                    ))}

                </div>
            )}
        </div>
    );
}
