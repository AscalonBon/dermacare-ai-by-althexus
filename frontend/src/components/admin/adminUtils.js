const BASE = import.meta.env.BASE_URL;

export function getErrorMessage(data, fallback = 'Something went wrong.') {
  if (!data) return fallback;
  if (typeof data.error === 'string') return data.error;
  if (typeof data.error?.message === 'string') return data.error.message;
  if (typeof data.message === 'string') return data.message;
  return fallback;
}

export function redirectToLogin() {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminData');
  window.location.href = `${BASE}admin`;
}
