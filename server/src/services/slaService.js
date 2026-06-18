const pool = require('../config/db');
const { SLA_RULES, PRIORITY_ORDER } = require('../constants/sla');

const getSLAConfig = (priority) => {
    return SLA_RULES[priority];
};

const calculateSLAMetrics = async (ticketId) => {
    const [ticket] = await pool.execute(
        'SELECT priority, created_at, status FROM tickets WHERE id = ?',
        [ticketId]
    );

    if (!ticket.length) return null;
    const ticketData = ticket[0];

    const slaConfig = getSLAConfig(ticketData.priority);
    const createdTime = new Date(ticketData.created_at);
    const now = new Date();
    const elapsedHours = (now - createdTime) / (1000 * 60 * 60);
    const slaHours = slaConfig.hours;
    const consumedPercentage = Math.min((elapsedHours / slaHours) * 100, 100);

    return {
        priority: ticketData.priority,
        slaHours,
        elapsedHours,
        consumedPercentage,
        isBreached: consumedPercentage >= 100,
        isWarning: consumedPercentage >= 80 && consumedPercentage < 100,
        isResolved: ticketData.status === 'resolved' || ticketData.status === 'closed'
    };
};

const recordSLAEvent = async (ticketId, eventType, priority, consumedPercentage) => {
    try {
        await pool.execute(
            'INSERT INTO sla_events (ticket_id, event_type, priority, consumed_percentage) VALUES (?, ?, ?, ?)',
            [ticketId, eventType, priority, consumedPercentage]
        );
        return true;
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return false;
        }
        throw error;
    }
};

const getActiveTickets = async () => {
    const [tickets] = await pool.execute(
        'SELECT id, priority, created_at, status FROM tickets WHERE status IN (?, ?)',
        ['open', 'in_progress']
    );
    return tickets;
};

const getSLAMetricsForTicket = async (ticketId) => {
    return calculateSLAMetrics(ticketId);
};

module.exports = {
    calculateSLAMetrics,
    recordSLAEvent,
    getActiveTickets,
    getSLAMetricsForTicket,
    getSLAConfig
};