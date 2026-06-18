import React from 'react';
// import './PriorityBadge.css';

export function PriorityBadge({ priority }) {
  const labels = {
    urgent: 'Urgent',
    high: 'High',
    medium: 'Medium',
    low: 'Low'
  };

  return (
    <span className={`priority-badge priority-${priority}`}>
      {labels[priority]}
    </span>
  );
}