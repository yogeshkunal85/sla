import client from './client';

export async function getTickets(filters = {}, page = 1, limit = 10) {
  const params = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      params.append(key, String(value));
    }
  });
  
  params.append('page', String(page));
  params.append('limit', String(limit));
  
  const response = await client.get(`/tickets?${params.toString()}`);
  return response.data.data;
}

export async function getTicket(id) {
  const response = await client.get(`/tickets/${id}`);
  return response.data.data;
}

export async function createTicket(data) {
  const response = await client.post('/tickets', data);
  return response.data.data;
}

export async function updateTicketStatus(id, status) {
  const response = await client.put(`/tickets/${id}/status`, { status });
  return response.data.data;
}

export async function assignAgent(id, agentId) {
  const response = await client.put(`/tickets/${id}/assign`, { agent_id: agentId });
  return response.data.data;
}

export async function addComment(id, data) {
  const response = await client.post(`/tickets/${id}/comments`, data);
  return response.data.data;
}