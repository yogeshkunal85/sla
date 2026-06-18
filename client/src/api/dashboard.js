import client from './client';

export async function getDashboardStats() {
  const response = await client.get('/dashboard/stats');
  return response.data.data;
}

export async function getRecentActivities(limit = 10) {
  const response = await client.get(`/dashboard/activities?limit=${limit}`);
  return response.data.data;
}