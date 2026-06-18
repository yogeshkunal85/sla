const express = require('express');
const router = express.Router();
const Joi = require('joi');
const ticketController = require('../controllers/ticketController');
const validate = require('../middleware/validate');

const createTicketSchema = Joi.object({
    title: Joi.string().required().max(255),
    description: Joi.string().allow(''),
    priority: Joi.string().valid('urgent', 'high', 'medium', 'low').default('medium'),
    customer_email: Joi.string().email().required()
});

const updateStatusSchema = Joi.object({
    status: Joi.string().valid('open', 'in_progress', 'resolved', 'closed').required()
});

const assignAgentSchema = Joi.object({
    agent_id: Joi.number().integer().positive().required()
});

const addCommentSchema = Joi.object({
    comment: Joi.string().required().max(1000),
    author_type: Joi.string().valid('customer', 'agent').required(),
    author_id: Joi.number().integer().positive().allow(null)
});

router.post('/', validate(createTicketSchema), ticketController.createTicket);
router.get('/', ticketController.listTickets);
router.get('/:id', ticketController.getTicket);
router.put('/:id/status', validate(updateStatusSchema), ticketController.updateStatus);
router.put('/:id/assign', validate(assignAgentSchema), ticketController.assignAgent);
router.post('/:id/comments', validate(addCommentSchema), ticketController.addComment);

module.exports = router;