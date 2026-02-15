import Application from "../models/Application.js";

/**
 * Get dashboard statistics for the authenticated user
 * @route GET /api/dashboard/stats
 * @access Private (user, jobseeker)
 */
export const getUserStats = async (req, res) => {
    try {
        // Ensure user is authenticated
        if (!req.user) {
            return res.status(401).json({
                message: "Authentication required"
            });
        }

        // Count total applications for this user
        const applicationsCount = await Application.countDocuments({
            user_id: req.user._id
        });

        // Count interviews (applications with 'accepted' status)
        const interviewsCount = await Application.countDocuments({
            user_id: req.user._id,
            status: 'accepted'
        });

        // Saved jobs count (feature not implemented yet - return 0)
        const savedJobsCount = 0;

        // Return statistics
        res.json({
            applicationsCount,
            interviewsCount,
            savedJobsCount
        });

    } catch (error) {
        console.error('❌ Get user stats error:', error);
        res.status(500).json({
            message: "Server error while fetching dashboard statistics",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
