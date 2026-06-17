const SLA_RULES = {
    urgent: { hours: 2, priority: 'urgent' },
    high: { hours: 8, priority: 'high' },
    medium: { hours: 24, priority: 'medium' },
    low: { hours: 72, priority: 'low' }
};

const PRIORITY_ORDER = ['low', 'medium', 'high', 'urgent'];
const PRIORITY_ESCALATION = {
    low: 'medium',
    medium: 'high',
    high: 'urgent',
    urgent: 'urgent'
};

module.exports = {
    SLA_RULES,
    PRIORITY_ORDER,
    PRIORITY_ESCALATION
};