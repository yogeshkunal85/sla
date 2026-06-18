import React from 'react';
// import './DashboardSummary.css';

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

      <div className="priority-distribution">
        <h4>Priority Distribution</h4>
        <div className="priority-bars">
          {priorityDistribution.map((item) => (
            <div key={item.priority} className="priority-bar-item">
              <div className="priority-bar-label">
                <span style={{ color: getPriorityColor(item.priority) }}>
                  {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
                </span>
                <span>{item.count}</span>
              </div>
              <div className="priority-bar-track">
                <div
                  className="priority-bar-fill"
                  style={{
                    width: `${(item.count / ticketStats.total_tickets) * 100}%`,
                    backgroundColor: getPriorityColor(item.priority)
                  }}
                />
              </div>
              <div className="priority-avg-resolution">
                Avg Resolution: {item?.avg_resolution_hours}h
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}