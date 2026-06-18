import React from 'react';
import './StatusBadge.css';

export function StatusBadge({ status }) {
  const labels = {
    open: 'Open',
    in_progress: 'In Progress',
    resolved: 'Resolved',
    closed: 'Closed'
  };

  return (
    <span className={`status-badge status-${status}`}>
      {labels[status]}
    </span>
  );
}