import React from 'react';
import { getSlaState, formatSlaTime } from '../utils/sla';
import './SlaBadge.css';

export function SlaBadge({ ticket }) {
  const slaState = getSlaState(ticket);
  
  if (!slaState) {
    return <span className="sla-badge sla-resolved">Resolved</span>;
  }

  const statusClass = `sla-${slaState.status}`;
  const timeInfo = `${formatSlaTime(slaState.elapsedHours)} / ${formatSlaTime(slaState.slaHours)}`;

  return (
    <div className="sla-badge-wrapper">
      <span className={`sla-badge ${statusClass}`}>
        {slaState.label}
      </span>
      <span className="sla-time">{timeInfo}</span>
    </div>
  );
}