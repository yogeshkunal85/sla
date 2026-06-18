const cron = require('node-cron');
const slaService = require('../services/slaService');
const ticketService = require('../services/ticketService');
const { PRIORITY_ORDER } = require('../constants/sla');

const processSLAChecks = async () => {
    console.log('SLA job started at:', new Date().toISOString());

    try {
        const activeTickets = await slaService.getActiveTickets();

        for (const ticket of activeTickets) {
            const metrics = await slaService.calculateSLAMetrics(ticket.id);
            if (!metrics || metrics.isResolved) continue;

            let eventsRecorded = [];

            if (metrics.isWarning) {
                const recorded = await slaService.recordSLAEvent(
                    ticket.id,
                    'warning',
                    metrics.priority,
                    metrics.consumedPercentage
                );
                if (recorded) {
                    eventsRecorded.push('warning');
                    console.log(`Warning event recorded for ticket ${ticket.id}`);
                }
            }

            if (metrics.isBreached) {
                const recorded = await slaService.recordSLAEvent(
                    ticket.id,
                    'breach',
                    metrics.priority,
                    metrics.consumedPercentage
                );
                if (recorded) {
                    eventsRecorded.push('breach');
                    console.log(`Breach event recorded for ticket ${ticket.id}`);
                }
            }

            if (metrics.isWarning || metrics.isBreached) {
                const currentPriorityIndex = PRIORITY_ORDER.indexOf(metrics.priority);
                const maxPriorityIndex = PRIORITY_ORDER.length - 1;

                if (currentPriorityIndex < maxPriorityIndex) {
                    const escalated = await ticketService.escalatePriority(ticket.id, metrics.priority);
                    if (escalated) {
                        console.log(`Priority escalated for ticket ${ticket.id} from ${metrics.priority} to ${PRIORITY_ORDER[currentPriorityIndex + 1]}`);
                    }
                }
            }
        }

        console.log('SLA job completed at:', new Date().toISOString());
    } catch (error) {
        console.error('SLA job error:', error);
    }
};

const startSLAJob = () => {
    cron.schedule('*/5 * * * *', processSLAChecks);
    console.log('SLA job scheduled to run every 5 minutes');
};

module.exports = {
    processSLAChecks,
    startSLAJob
};