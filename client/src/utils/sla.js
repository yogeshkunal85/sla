const SLA_RULES = {
    urgent: 2,
    high: 8,
    medium: 24,
    low: 72
  };
  
  export function getSlaState(ticket) {
    if (ticket.status === 'resolved' || ticket.status === 'closed') {
      return null;
    }
  
    const slaHours = SLA_RULES[ticket.priority];
    if (!slaHours) {
      return null;
    }
  
    const createdTime = new Date(ticket.created_at).getTime();
    const now = Date.now();
    const elapsedHours = (now - createdTime) / (1000 * 60 * 60);
    const consumedPercentage = Math.min((elapsedHours / slaHours) * 100, 100);
  
    let status;
    let label;
  
    if (consumedPercentage >= 100) {
      status = 'breached';
      label = 'Breached';
    } else if (consumedPercentage >= 80) {
      status = 'at_risk';
      label = 'At Risk';
    } else {
      status = 'ok';
      label = 'On Track';
    }
  
    return {
      status,
      label,
      consumedPercentage,
      slaHours,
      elapsedHours
    };
  }
  
  export function formatSlaTime(hours) {
    if (hours < 1) {
      const minutes = Math.round(hours * 60);
      return `${minutes}m`;
    }
    if (hours < 24) {
      return `${Math.round(hours)}h`;
    }
    const days = Math.floor(hours / 24);
    const remainingHours = Math.round(hours % 24);
    return `${days}d ${remainingHours}h`;
  }
  
  export function getSlaColor(status) {
    if (!status) return '';
    switch (status) {
      case 'breached':
        return '#fee';
      case 'at_risk':
        return '#fff3cd';
      case 'ok':
        return '';
      default:
        return '';
    }
  }