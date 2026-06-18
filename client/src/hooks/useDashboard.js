import { useState, useEffect, useCallback } from 'react';
import { getDashboardStats, getRecentActivities } from '../api/dashboard';

export function useDashboard() {
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [statsData, activitiesData] = await Promise.all([
        getDashboardStats(),
        getRecentActivities(10)
      ]);
      setStats(statsData);
      setActivities(activitiesData);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return {
    stats,
    activities,
    loading,
    error,
    refresh: fetchDashboard
  };
}