import React from 'react';
import { useDashboard } from '../hooks/useDashboard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { DashboardSummary } from '../components/DashboardSummary';
// import './Dashboard.css';

export function Dashboard() {
  const { stats, activities, loading, error, refresh } = useDashboard();

  if (loading && !stats) {
    return <LoadingSpinner size="large" />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={refresh} />;
  }

  return (
    <div className="dashboard-page">
      <header className="page-header">
        <h1>Dashboard</h1>
      </header>

      {stats && <DashboardSummary stats={stats} />}

      <div className="dashboard-activities">
        <h3>Recent Activities</h3>
        {activities.length === 0 ? (
          <div className="empty-state">No recent activities</div>
        ) : (
          <div className="activity-list">
            {activities.map((activity, index) => (
              <div key={index} className="activity-item">
                <div className="activity-type">
                  {activity.type === 'ticket_created' ? 'Ticket' : 'Comment'} :-
                </div>
                <div className="activity-content">
                  <div className="activity-title">{activity.subject}</div>
                  <div className="activity-meta">
                    <span>by {activity.actor}</span>
                    <span className="activity-time">
                      {new Date(activity.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}