const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.get('/', async (req, res) => {
    try {
        const [agents] = await pool.execute(
            'SELECT id, name, email FROM agents'
        );
        res.json({
            success: true,
            data: agents
        });
    } catch (error) {
        console.error('Error fetching agents:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'INTERNAL_ERROR',
                message: 'Failed to fetch agents'
            }
        });
    }
});

module.exports = router;