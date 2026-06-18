const pool = require('../config/db');
const { PRIORITY_ESCALATION } = require('../constants/sla');

const createTicket = async (ticketData) => {
    const { title, description, priority, customer_email } = ticketData;
    const [result] = await pool.execute(
        'INSERT INTO tickets (subject, description, priority, customer_email) VALUES (?, ?, ?, ?)',
        [title, description, priority, customer_email]
    );
    return result.insertId;
};

const listTickets = async (filters, limit, offset) => {
    let sql = 'SELECT t.*, a.name as agent_name FROM tickets t LEFT JOIN agents a ON t.assigned_agent_id = a.id';
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
    if (filters.assigned_agent_id) {
        conditions.push('t.assigned_agent_id = ?');
        params.push(filters.assigned_agent_id);
    }
    if (filters.customer_email) {
        conditions.push('t.customer_email = ?');
        params.push(filters.customer_email);
    }

    if (conditions.length > 0) {
        sql += ' WHERE ' + conditions.join(' AND ');
    }

    sql += ` ORDER BY t.created_at DESC LIMIT ${limit} OFFSET ${offset}`;

   
    // params.push(limit, offset);


    console.log(sql);
console.log(params);
console.log(typeof limit, limit);
console.log(typeof offset, offset);
    const [tickets] = await pool.execute(sql, params);
    const countSql =
    `SELECT COUNT(*) as total FROM tickets t
     ${conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : ''}`;

const countParams = [];

if (filters.status) countParams.push(filters.status);
if (filters.priority) countParams.push(filters.priority);
if (filters.assigned_agent_id) countParams.push(filters.assigned_agent_id);
if (filters.customer_email) countParams.push(filters.customer_email);

const [countResult] = await pool.execute(countSql, countParams);

    return {
        tickets,
        total: countResult[0].total
    };
};  


const getTicketById = async (id) => {
    const [tickets] = await pool.execute(
        `SELECT t.*, a.name as agent_name 
         FROM tickets t 
         LEFT JOIN agents a ON t.assigned_agent_id = a.id 
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
        'SELECT id FROM agents WHERE id = ?',
        [agentId]
    );
    if (!agent.length) {
        throw new Error('Agent not found');
    }

    await pool.execute(
        'UPDATE tickets SET assigned_agent_id = ? WHERE id = ?',
        [agentId, ticketId]
    );
};

const addComment = async (ticketId, commentData) => {
    const { comment, author_type, author_id } = commentData;
    console.log(commentData)
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