import React from 'react';
import '../pages/Dashboard.css';


export function DashboardSummary({ stats }) {
  const { ticketStats, priorityDistribution, slaBreaches } = stats;

  const getPriorityColor = (priority) => {
    const colors = {
      urgent: '#ef4444',
      high: '#f59e0b',
      medium: '#3b82f6',
      low: '#10b981'
    };
    return colors[priority] || '#6b7280';
  };

  return (
    <div className="dashboard-summary">
      <div className="summary-grid">
        <div className="summary-card">
          <div className="summary-label">Total Tickets</div>
          <div className="summary-value">{ticketStats.total_tickets}</div>
        </div>
        <div className="summary-card">
          <div className="summary-label">Open</div>
          <div className="summary-value">{ticketStats.open_tickets}</div>
        </div>
        <div className="summary-card">
          <div className="summary-label">In Progress</div>
          <div className="summary-value">{ticketStats.in_progress_tickets}</div>
        </div>
        <div className="summary-card">
          <div className="summary-label">Resolved</div>
          <div className="summary-value">{ticketStats.resolved_tickets}</div>
        </div>
      </div>

      <div className="summary-grid">
        <div className="summary-card">
          <div className="summary-label">Closed</div>
          <div className="summary-value">{ticketStats.closed_tickets}</div>
        </div>
        <div className="summary-card">
          <div className="summary-label">SLA Breaches</div>
          <div className="summary-value" style={{ color: '#ef4444' }}>
            {slaBreaches}
          </div>
        </div>
      </div>

      
    </div>
  );
}