import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { apiRequest, AUTH_TOKEN_KEY } from '../../lib/api';

export default function RequireAuth({ children }) {
  const location = useLocation();
  const hasToken = Boolean(localStorage.getItem(AUTH_TOKEN_KEY));
  const [status, setStatus] = useState(hasToken ? 'checking' : 'signed-out');

  useEffect(() => {
    if (!hasToken) return undefined;

    let active = true;
    apiRequest('/api/profile')
      .then(({ user }) => {
        if (active) setStatus(user?.id ? 'signed-in' : 'signed-out');
      })
      .catch(() => {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem('dermacare-user');
        localStorage.removeItem('dermacare-user-id');
        if (active) setStatus('signed-out');
      });

    return () => { active = false; };
  }, [hasToken]);

  if (status === 'checking') {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f9fc] text-sm text-[#69758a]" aria-busy="true">
        Checking your session…
      </main>
    );
  }

  if (status !== 'signed-in') {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
