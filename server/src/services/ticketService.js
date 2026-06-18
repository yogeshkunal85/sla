const pool = require('../config/db');
const { PRIORITY_ESCALATION } = require('../constants/sla');

const createTicket = async (ticketData) => {
    const { title, description, priority, customer_email } = ticketData;
    const [result] = await pool.execute(
        'INSERT INTO tickets (title, description, priority, customer_email) VALUES (?, ?, ?, ?)',
        [title, description, priority, customer_email]
    );
    return result.insertId;
};

const listTickets = async (filters, limit, offset) => {
    let sql = 'SELECT t.*, a.name as agent_name FROM tickets t LEFT JOIN agents a ON t.agent_id = a.id';
    const params = [];
    const conditions = [];

    if (filters.status) {
        conditions.push('t.status = ?');
        params.push(filters.status);
    }
    if (filters.priority) {
        conditions.push('t.priority = ?');
        params.push(filters.priority);
    }
    if (filters.agent_id) {
        conditions.push('t.agent_id = ?');
        params.push(filters.agent_id);
    }
    if (filters.customer_email) {
        conditions.push('t.customer_email = ?');
        params.push(filters.customer_email);
    }

    if (conditions.length > 0) {
        sql += ' WHERE ' + conditions.join(' AND ');
    }

    sql += ' ORDER BY t.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [tickets] = await pool.execute(sql, params);

    const [countResult] = await pool.execute(
        `SELECT COUNT(*) as total FROM tickets t ${conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : ''}`,
        params.slice(0, -2)
    );

    return {
        tickets,
        total: countResult[0].total
    };
};  


const getTicketById = async (id) => {
    const [tickets] = await pool.execute(
        `SELECT t.*, a.name as agent_name 
         FROM tickets t 
         LEFT JOIN agents a ON t.agent_id = a.id 
         WHERE t.id = ?`,
        [id]
    );
    return tickets[0] || null;
};

const updateTicketStatus = async (id, status) => {
    const updateFields = ['status = ?'];
    const params = [status];

    if (status === 'resolved') {
        updateFields.push('resolved_at = NOW()');
    }

    await pool.execute(
        `UPDATE tickets SET ${updateFields.join(', ')} WHERE id = ?`,
        [...params, id]
    );
};

const assignAgent = async (ticketId, agentId) => {
    const [agent] = await pool.execute(
        'SELECT id FROM agents WHERE id = ? AND is_active = true',
        [agentId]
    );
    if (!agent.length) {
        throw new Error('Agent not found or inactive');
    }

    await pool.execute(
        'UPDATE tickets SET agent_id = ? WHERE id = ?',
        [agentId, ticketId]
    );
};

const addComment = async (ticketId, commentData) => {
    const { comment, author_type, author_id } = commentData;
    const [result] = await pool.execute(
        'INSERT INTO ticket_comments (ticket_id, comment, author_type, author_id) VALUES (?, ?, ?, ?)',
        [ticketId, comment, author_type, author_id || null]
    );
    return result.insertId;
};

const getTicketComments = async (ticketId) => {
    const [comments] = await pool.execute(
        'SELECT * FROM ticket_comments WHERE ticket_id = ? ORDER BY created_at ASC',
        [ticketId]
    );
    return comments;
};

const getTicketWithDetails = async (id) => {
    const ticket = await getTicketById(id);
    if (!ticket) return null;

    const comments = await getTicketComments(id);
    return { ...ticket, comments };
};

const escalatePriority = async (ticketId, currentPriority) => {
    const newPriority = PRIORITY_ESCALATION[currentPriority];
    if (newPriority === currentPriority) return false;

    await pool.execute(
        'UPDATE tickets SET priority = ? WHERE id = ?',
        [newPriority, ticketId]
    );
    return true;
};

module.exports = {
    createTicket,
    listTickets,
    getTicketById,
    updateTicketStatus,
    assignAgent,
    addComment,
    getTicketComments,
    getTicketWithDetails,
    escalatePriority
};