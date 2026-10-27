export const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV ? 'http://localhost:5000' : '')
).replace(/\/$/, '');

export const AUTH_TOKEN_KEY = 'dermacare-auth-token';

export async function apiRequest(path, options = {}) {
  const { auth = true, ...requestOptions } = options;
  const headers = new Headers(requestOptions.headers || {});
  if (requestOptions.body && typeof requestOptions.body !== 'string') {
    headers.set('Content-Type', 'application/json');
    requestOptions.body = JSON.stringify(requestOptions.body);
  }
  if (auth) {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (token) headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...requestOptions,
    headers,
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const message = typeof data?.error === 'string'
      ? data.error
      : data?.error?.message || data?.message || 'The request could not be completed.';
    throw new Error(message);
  }
  return data;
}
