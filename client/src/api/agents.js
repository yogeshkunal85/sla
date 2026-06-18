import client from './client';

export async function getAgents() {
  const response = await client.get('/agents');
  return response.data.data || response.data;
}