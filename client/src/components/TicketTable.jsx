import React from 'react';
import { getSlaState, getSlaColor } from '../utils/sla';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';
import { SlaBadge } from './SlaBadge';
// import './TicketTable.css';

export function TicketTable({ tickets, onRowClick }) {
  const getRowClassName = (ticket) => {
    const slaState = getSlaState(ticket);
    if (!slaState) return '';
    
    switch (slaState.status) {
      case 'breached':
        return 'row-breached';
      case 'at_risk':
        return 'row-at-risk';
      default:
        return '';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="ticket-table-container">
      <table className="ticket-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Subject</th>
            <th>Priority</th>
            <th>Status</th>
            <th>SLA</th>
            <th>Agent</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr
              key={ticket.id}
              className={getRowClassName(ticket)}
              onClick={() => onRowClick(ticket)}
              style={{ cursor: 'pointer' }}
            >
              <td>#{ticket.id}</td>
              <td>{ticket.title}</td>
              <td><PriorityBadge priority={ticket.priority} /></td>
              <td><StatusBadge status={ticket.status} /></td>
              <td><SlaBadge ticket={ticket} /></td>
              <td>{ticket.agent_name || 'Unassigned'}</td>
              <td>{formatDate(ticket.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}