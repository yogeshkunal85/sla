const pool = require('../config/db');

const getDashboardStats = async () => {
    const [ticketStats] = await pool.execute(`
        SELECT 
            COUNT(*) as total_tickets,
            SUM(CASE WHEN status = 'open' THEN 1 ELSE 0 END) as open_tickets,
            SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress_tickets,
            SUM(CASE WHEN status = 'resolved' THEN 1 ELSE 0 END) as resolved_tickets,
            SUM(CASE WHEN status = 'closed' THEN 1 ELSE 0 END) as closed_tickets
        FROM tickets
    `);

    const [priorityStats] = await pool.execute(`
        SELECT 
            priority,
            COUNT(*) as count,
            AVG(TIMESTAMPDIFF(HOUR, created_at, COALESCE(resolved_at, NOW()))) as avg_resolution_hours
        FROM tickets
        WHERE status IN ('resolved', 'closed')
        GROUP BY priority
    `);

    const [slaStats] = await pool.execute(`
        SELECT 
            COUNT(DISTINCT ticket_id) as breach_count
        FROM sla_events
        WHERE event_type = 'breach'
    `);

    const [agentStats] = await pool.execute(`
        SELECT 
            a.id,
            a.name,
            COUNT(t.id) as assigned_tickets,
            SUM(CASE WHEN t.status IN ('resolved', 'closed') THEN 1 ELSE 0 END) as resolved_tickets
        FROM agents a
        LEFT JOIN tickets t ON a.id = t.assigned_agent_id
        GROUP BY a.id, a.name
    `);

    return {
        ticketStats: ticketStats[0],
        priorityDistribution: priorityStats,
        slaBreaches: slaStats[0].breach_count || 0,
        agentPerformance: agentStats
    };
};

const getRecentActivities = async (limit = 10) => {
    const [activities] = await pool.query(`
        (SELECT 
            'ticket_created' as type,
            t.id as ticket_id,
            t.subject,
            t.created_at as timestamp,
            t.customer_email as actor
        FROM tickets t)
        UNION ALL
        (SELECT 
            'comment_added' as type,
            tc.ticket_id as ticket_id,
            tc.comment as title,
            tc.created_at as timestamp,
            CONCAT('User ', tc.author_type) as actor
        FROM ticket_comments tc)
        ORDER BY timestamp DESC
        LIMIT ${limit}
    `);

    return activities;
};

module.exports = {
    getDashboardStats,
    getRecentActivities
};