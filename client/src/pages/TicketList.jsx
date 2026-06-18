import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTickets } from '../hooks/useTickets';
import { TicketTable } from '../components/TicketTable';
import { Pagination } from '../components/Pagination';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import './TicketList.css';

export function TicketList() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    status: '',
    priority: ''
  });

  const {
    tickets,
    loading,
    error,
    page,
    totalPages,
    searchTerm,
    setSearchTerm,
    updateFilters,
    goToPage,
    refetch
  } = useTickets({
    initialFilters: filters
  });

  const handleRowClick = (ticket) => {
    navigate(`/tickets/${ticket.id}`);
  };

  const handleClearFilters = () => {
    updateFilters({
        status: '',
        priority: ''
      });
    setFilters({
        status: '',
        priority: ''
      });
      setSearchTerm('')
  };


  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    updateFilters({ [name]: value || undefined });
    setFilters((prev) => ({
        ...prev,
        [name]: value || undefined
      }));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCreateTicket = () => {
    navigate('/tickets/new');
  };

  return (
    <div className="ticket-list-page">
      <header className="page-header">
        <h1>Tickets</h1>
        <button
          onClick={handleCreateTicket}
          className="button-primary"
        >
          + New Ticket
        </button>
      </header>

      <div className="ticket-filters">
        <div className="filter-group">
          <input
            type="text"
            placeholder="Search by email..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>

        <div className="filter-group">
          <select
            name="status"
            value={filters.status || ''}
            onChange={handleFilterChange}
            className="filter-select"
          >
            <option value="">All Statuses</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <div className="filter-group">
          <select
            name="priority"
            value={filters.priority || ''}
            onChange={handleFilterChange}
            className="filter-select"
          >
            <option value="">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
        <button
          onClick={handleClearFilters}
          className="button-primary"
        >
          Clear
        </button>
      </div>

      {loading && <LoadingSpinner />}

      {error && <ErrorMessage message={error} onRetry={refetch} />}

      {!loading && !error && tickets && (
        <>
          <div className="ticket-count">
            Showing {tickets.tickets.length} of {tickets.pagination.total} tickets
          </div>
          
          {tickets.tickets.length === 0 ? (
            <div className="empty-state">
              <p>No tickets found.</p>
              <button
                onClick={handleCreateTicket}
                className="button-primary"
              >
                Create your first ticket
              </button>
            </div>
          ) : (
            <>
              <TicketTable
                tickets={tickets.tickets}
                onRowClick={handleRowClick}
              />
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={goToPage}
              />
            </>
          )}
        </>
      )}
    </div>
  );
}