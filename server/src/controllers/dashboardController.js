const dashboardService = require('../services/dashboardService');
const asyncHandler = require('../middleware/asyncHandler');

const getDashboardStats = asyncHandler(async (req, res) => {
    const stats = await dashboardService.getDashboardStats();
    res.json({
        success: true,
        data: stats
    });
});

const getRecentActivities = asyncHandler(async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const activities = await dashboardService.getRecentActivities(limit);
    res.json({
        success: true,
        data: activities
    });
});

module.exports = {
    getDashboardStats,
    getRecentActivities
}