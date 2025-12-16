'use client';

import { useRouter } from 'next/navigation';
import { LoginPage } from '@/components/login-page';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';

export default function LoginRoute() {
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();

  const handleLogin = (username: string, password: string) => {
    const success = login(username, password);
    if (!success) {
      alert('Invalid credentials');
    }
  };

  // Redirect to donations page if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/donations');
    }
  }, [isAuthenticated, router]);

  return <LoginPage onLogin={handleLogin} />;
}
