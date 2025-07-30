
const API_BASE = "http://localhost:5000";

export async function getEscalations() {
  const res = await fetch(`${API_BASE}/escalations`);
  const data = await res.json();
  return data.escalations;
}

export async function getEscalation(id: number) {
  const res = await fetch(`${API_BASE}/escalations/${id}`);
  const data = await res.json();
  return data.escalation;
}

export async function createEscalation(payload: any) {
  const res = await fetch(`${API_BASE}/escalations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  return data.escalation;
}

export async function updateEscalation(id: number, payload: any) {
  const res = await fetch(`${API_BASE}/escalations/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  return data.escalation;
}

export async function deleteEscalation(id: number) {
  const res = await fetch(`${API_BASE}/escalations/${id}`, { method: 'DELETE' });
  const data = await res.json();
  return data.deleted;
}
