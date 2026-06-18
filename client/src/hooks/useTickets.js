import { useState, useEffect, useCallback } from 'react';
import { getTickets } from '../api/tickets';
import { useDebounce } from './useDebounce';

export function useTickets(options = {}) {
  const {
    initialPage = 1,
    initialLimit = 10,
    initialFilters = {}
  } = options;

  const [tickets, setTickets] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(initialPage);
  const [limit] = useState(initialLimit);
  const [filters, setFilters] = useState(initialFilters);
  const [searchTerm, setSearchTerm] = useState('');

  const debouncedSearch = useDebounce(searchTerm, 300);

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const searchFilters = { ...filters };
      if (debouncedSearch) {
        searchFilters.customer_email = debouncedSearch;
      }
      
      const response = await getTickets(searchFilters, page, limit);
      setTickets(response);
    } catch (err) {
      setError(err.message || 'Failed to load tickets');
    } finally {
      setLoading(false);
    }
  }, [filters, page, limit, debouncedSearch]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPage(1);
  };

  const goToPage = (newPage) => {
    setPage(newPage);
  };

  return {
    tickets,
    loading,
    error,
    page,
    totalPages: tickets?.pagination.totalPages || 1,
    filters,
    searchTerm,
    setSearchTerm,
    updateFilters,
    goToPage,
    refetch: fetchTickets
  };
}