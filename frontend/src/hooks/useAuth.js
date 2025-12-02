'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

/**
 * Custom hook for authentication state management
 * Handles user loading, auth checking, and redirects
 */
export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadUser = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await api.getProfile();
      
      if (result.user) {
        setUser(result.user);
      } else {
        router.push('/login');
      }
    } catch (err) {
      console.error('Auth check failed:', err);
      setError(err.message || 'Authentication failed');
      
      if (err.message?.includes('Session expired') || err.message?.includes('Unauthorized')) {
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const refetchUser = async () => {
    await loadUser();
  };

  return {
    user,
    loading,
    error,
    refetchUser,
  };
}
