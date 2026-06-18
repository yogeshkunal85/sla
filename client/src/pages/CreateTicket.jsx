import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TicketForm } from '../components/TicketForm';
import { createTicket } from '../api/tickets';
// import './CreateTicket.css';

export function CreateTicket() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (data) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const ticket = await createTicket(data);
      navigate(`/tickets/${ticket.id}`);
    } catch (err) {
      setError(err.message || 'Failed to create ticket');
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/tickets');
  };

  return (
    <div className="create-ticket-page">
      <header className="page-header">
        <h1>Create New Ticket</h1>
      </header>

      {error && (
        <div className="error-message" style={{ marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      <div className="create-ticket-container">
        <TicketForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}