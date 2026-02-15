import React from 'react';
import { Link } from 'react-router-dom';

const JobCard = ({ job }) => {
    // Expects job object with: title, company, location, jobType, salary, logo (optional), _id or id
    const { title, company, location, jobType, salary, logo, _id, id } = job;
    const jobId = _id || id;

    return (
        <div className="group w-full bg-gray-800/40 border border-gray-700/50 p-5 lg:p-6 rounded-2xl hover:border-cyan-500/30 transition-all duration-300 relative overflow-hidden flex flex-col sm:flex-row items-center gap-4 lg:gap-6 min-h-[140px]">
            {/* Hover Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Company Logo/Placeholder */}
            <div className="relative z-10 w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center font-bold text-gray-400 text-xl group-hover:bg-cyan-500/10 group-hover:text-cyan-400 transition-all shadow-inner flex-shrink-0">
                {logo || job.company?.charAt(0) || job.employer?.name?.charAt(0) || 'J'}
            </div>


            {/* Job Info */}
            <div className="relative z-10 flex-1 w-full text-center sm:text-left flex flex-col">
                <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start mb-2 gap-4">
                    <h4 className="font-bold text-white text-xl md:text-2xl lg:text-3xl group-hover:text-cyan-400 transition-colors truncate max-w-full">
                        {title}
                    </h4>
                    <span className="text-sm sm:text-base lg:text-lg font-bold text-cyan-400 bg-cyan-500/5 px-3 py-1 rounded-lg border border-cyan-500/10 whitespace-nowrap">
                        {salary}
                    </span>
                </div>

                <p className="text-base sm:text-lg lg:text-xl text-gray-400 font-medium mb-6 flex flex-wrap items-center justify-center sm:justify-start gap-4 overflow-hidden">
                    <span className="text-gray-300 truncate max-w-[150px] lg:max-w-none">{company}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-600 hidden sm:block flex-shrink-0"></span>
                    <span className="truncate max-w-[150px] lg:max-w-none">{location}</span>
                </p>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between mt-auto gap-4">
                    <div className="flex justify-center sm:justify-start">
                        <span className="px-3 py-1 bg-gray-700/50 rounded-full text-[10px] sm:text-xs lg:text-sm uppercase tracking-wider font-bold text-cyan-400 border border-gray-600/30">
                            {jobType}
                        </span>
                    </div>

                    <Link
                        to={`/user/jobs/${jobId}`}
                        className="w-full sm:w-auto px-5 py-2 rounded-xl bg-gray-700/50 text-white text-sm font-bold border border-gray-600/50 hover:bg-cyan-500 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all duration-300 cursor-pointer text-center"
                    >
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default JobCard;
