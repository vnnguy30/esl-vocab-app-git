// api.js - Shared functions for talking to the backend REST API.
// Pulled out of script.js so every page module can reuse them.

const API_URL = 'http://localhost:3001/api';

async function getWords() {
  const res = await fetch(`${API_URL}/words`);
  return res.json();
}

async function addWordApi(word) {
  const res = await fetch(`${API_URL}/words`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(word)
  });
  return res.json();
}

async function deleteWordApi(id) {
  const res = await fetch(`${API_URL}/words/${id}`, { method: 'DELETE' });
  return res.json();
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
