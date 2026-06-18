import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTicket } from '../hooks/useTicket';
import { updateTicketStatus, assignAgent, addComment } from '../api/tickets';
import { getAgents } from '../api/agents';
import { PriorityBadge } from '../components/PriorityBadge';
import { SlaBadge } from '../components/SlaBadge';
import { AddCommentForm } from '../components/AddCommentForm';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { CommentThread } from '../components/CommonThread';
// import './TicketDetail.css';

export function TicketDetail() {
  const { id } = useParams();
  const ticketId = parseInt(id || '0');
  
  console.log(id,"dd")
  const { ticket, loading, error, refresh } = useTicket(ticketId);
  const [agents, setAgents] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedAgent, setSelectedAgent] = useState('');

  useEffect(() => {
    loadAgents();
  }, []);

  useEffect(() => {
    if (ticket) {
      setSelectedStatus(ticket.status);
      setSelectedAgent(ticket.assigned_agent_id || '');
    }
  }, [ticket]);

  const loadAgents = async () => {
    try {
      const agentsList = await getAgents();
      setAgents(Array.isArray(agentsList) ? agentsList : []);
    } catch (err) {
      console.error('Failed to load agents:', err);
    }
  };

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setSelectedStatus(newStatus);
    
    setIsUpdating(true);
    try {
      await updateTicketStatus(ticketId, newStatus);
      await refresh();
    } catch (err) {
      console.error('Failed to update status:', err);
      setSelectedStatus(ticket?.status || '');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAgentAssign = async (e) => {
    const agentId = parseInt(e.target.value);
    setSelectedAgent(agentId);
    
    if (!agentId) return;
    
    setIsUpdating(true);
    try {
      await assignAgent(ticketId, agentId);
      await refresh();
    } catch (err) {
      console.error('Failed to assign agent:', err);
      setSelectedAgent(ticket?.assigned_agent_id || '');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddComment = async (commentData) => {
    setIsUpdating(true);
    try {
      await addComment(ticketId, commentData);
      await refresh();
    } catch (err) {
      console.error('Failed to add comment:', err);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <LoadingSpinner size="large" />;
  }

  if (error || !ticket) {
    return (
      <ErrorMessage
        message={error || 'Ticket not found'}
        onRetry={() => navigate('/tickets')}
      />
    );
  }

  return (
    <div className="ticket-detail-page">
      <header className="detail-header">
        <button
          onClick={() => navigate('/tickets')}
          className="back-button"
        >
          ← Back to Tickets
        </button>
        <h1>Ticket #{ticket.id}</h1>
      </header>

      <div className="detail-grid">
        <div className="detail-main">
          <div className="detail-card">
            <h2>{ticket.title}</h2>
            <p className="ticket-description">{ticket.description}</p>
            
            <div className="detail-meta">
              <div className="meta-item">
                <span className="meta-label">Status</span>
                <select
                  value={selectedStatus}
                  onChange={handleStatusChange}
                  disabled={isUpdating}
                  className="status-select"
                >
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <div className="meta-item">
                <span className="meta-label">Priority</span>
                <PriorityBadge priority={ticket.priority} />
              </div>

              <div className="meta-item">
                <span className="meta-label">SLA Status</span>
                <SlaBadge ticket={ticket} />
              </div>

              <div className="meta-item">
                <span className="meta-label">Assigned Agent</span>
                <select
                  value={selectedAgent}
                  onChange={handleAgentAssign}
                  disabled={isUpdating}
                  className="agent-select"
                >
                  <option value="">Unassigned</option>
                  {agents.map((agent) => (
                    <option key={agent.id} value={agent.id}>
                      {agent.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="meta-item">
                <span className="meta-label">Customer</span>
                <span>{ticket.customer_email}</span>
              </div>

              <div className="meta-item">
                <span className="meta-label">Created</span>
                <span>{formatDate(ticket.created_at)}</span>
              </div>

              {ticket.resolved_at && (
                <div className="meta-item">
                  <span className="meta-label">Resolved</span>
                  <span>{formatDate(ticket.resolved_at)}</span>
                </div>
              )}
            </div>
          </div>

          <CommentThread comments={ticket.comments || []} />
          
          <AddCommentForm
            onSubmit={handleAddComment}
            isLoading={isUpdating}
          />
        </div>

        <div className="detail-sidebar">
          <div className="sidebar-card">
            <h4>Quick Actions</h4>
            <div className="quick-actions">
              <button
                onClick={() => {
                  if (selectedStatus !== 'resolved') {
                    handleStatusChange({ target: { value: 'resolved' } });
                  }
                }}
                disabled={isUpdating}
                className="action-button"
              >
                Mark as Resolved
              </button>
              <button
                onClick={() => {
                  if (selectedStatus !== 'closed') {
                    handleStatusChange({ target: { value: 'closed' } });
                  }
                }}
                disabled={isUpdating}
                className="action-button"
              >
                Close Ticket
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}