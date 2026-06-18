const express = require('express');
const router = express.Router();
const ticketRoutes = require('./tickets');
const dashboardRoutes = require('./dashboard');
const agentRoutes = require('./agents');

router.use('/tickets', ticketRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/agents', agentRoutes);


router.get('/health', (req, res) => {
    res.json({
        success: true,
        data: {
            status: 'healthy',
            timestamp: new Date().toISOString()
        }
    });
});

module.exports = router;