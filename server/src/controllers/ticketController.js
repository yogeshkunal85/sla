const ticketService = require('../services/ticketService');
const asyncHandler = require('../middleware/asyncHandler');


const createTicket = asyncHandler(async (req, res) => {
    try {
        const ticketId = await ticketService.createTicket(req.body);
        const ticket = await ticketService.getTicketById(ticketId);
        res.status(201).json({
            success: true,
            data: ticket
        });
    } catch (err) {
        console.error(err)
        res.status(err.status || 500).json({
            success: false,
            error: {
                code: 'INTERNAL_ERROR',
                message: 'An unexpected error occurred'
            }
        });
    }

});

const listTickets = asyncHandler(async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const filters = {
            status: req.query.status,
            priority: req.query.priority,
            assigned_agent_id: req.query.agent_id,
            customer_email: req.query.customer_email
        };

        
        const result = await ticketService.listTickets(filters, limit, offset);
        res.json({
            success: true,
            data: {
                tickets: result.tickets,
                pagination: {
                    page,
                    limit,
                    total: result.total,
                    totalPages: Math.ceil(result.total / limit)
                }
            }
        });
    } catch (err) {
        console.error(err)
        res.status(err.status || 500).json({
            success: false,
            error: {
                code: 'INTERNAL_ERROR',
                message: 'An unexpected error occurred'
            }
        });
    }
});

const getTicket = asyncHandler(async (req, res) => {
    try {

        const ticket = await ticketService.getTicketWithDetails(req.params.id);
        if (!ticket) {
            return res.status(404).json({
                success: false,
                error: {
                    code: 'TICKET_NOT_FOUND',
                    message: 'Ticket not found'
                }
            });
        }
        res.json({
            success: true,
            data: ticket
        });
    } catch (err) {
        console.error(err)
        res.status(err.status || 500).json({
            success: false,
            error: {
                code: 'INTERNAL_ERROR',
                message: 'An unexpected error occurred'
            }
        });
    }
});

const updateStatus = asyncHandler(async (req, res) => {
    try {
        const ticket = await ticketService.getTicketById(req.params.id);
        if (!ticket) {
            return res.status(404).json({
                success: false,
                error: {
                    code: 'TICKET_NOT_FOUND',
                    message: 'Ticket not found'
                }
            });
        }

        await ticketService.updateTicketStatus(req.params.id, req.body.status);
        const updatedTicket = await ticketService.getTicketById(req.params.id);
        res.json({
            success: true,
            data: updatedTicket
        });
    } catch (err) {
        console.error(err)
        res.status(err.status || 500).json({
            success: false,
            error: {
                code: 'INTERNAL_ERROR',
                message: 'An unexpected error occurred'
            }
        });
    }
});

const assignAgent = asyncHandler(async (req, res) => {
    try {
        const ticket = await ticketService.getTicketById(req.params.id);
        if (!ticket) {
            return res.status(404).json({
                success: false,
                error: {
                    code: 'TICKET_NOT_FOUND',
                    message: 'Ticket not found'
                }
            });
        }

        await ticketService.assignAgent(req.params.id, req.body.agent_id);
        const updatedTicket = await ticketService.getTicketById(req.params.id);
        res.json({
            success: true,
            data: updatedTicket
        });
    } catch (err) {
        console.error(err)
        res.status(err.status || 500).json({
            success: false,
            error: {
                code: 'INTERNAL_ERROR',
                message: 'An unexpected error occurred'
            }
        });
    }
});

const addComment = asyncHandler(async (req, res) => {
    try {
        const ticket = await ticketService.getTicketById(req.params.id);
        if (!ticket) {
            return res.status(404).json({
                success: false,
                error: {
                    code: 'TICKET_NOT_FOUND',
                    message: 'Ticket not found'
                }
            });
        }

        const commentId = await ticketService.addComment(req.params.id, req.body);
        const comment = await ticketService.getTicketComments(req.params.id);
        res.status(201).json({
            success: true,
            data: comment
        });
    } catch (err) {
        console.error(err)
        res.status(err.status || 500).json({
            success: false,
            error: {
                code: 'INTERNAL_ERROR',
                message: 'An unexpected error occurred'
            }
        });
    }
});



module.exports = {
    createTicket,
    listTickets,
    addComment,
    assignAgent,
    getTicket,
    updateStatus
}
