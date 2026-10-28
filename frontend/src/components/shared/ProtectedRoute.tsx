'use client';

import { useEffect } from 'react';
import { useRouter } from '@/i18n/routing';
import { useAuthStore } from '@/store/authStore';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Array<'admin' | 'client' | 'vendor'>;
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, fetchUser } = useAuthStore();

  useEffect(() => {
    // Attempt to fetch user if not authenticated and not loading
    if (!isAuthenticated && !isLoading) {
      fetchUser();
    }
  }, [isAuthenticated, isLoading, fetchUser]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    } else if (!isLoading && isAuthenticated && user && allowedRoles) {
      if (!allowedRoles.includes(user.role)) {
        router.push('/'); // Redirect to home if unauthorized
      }
    }
  }, [isLoading, isAuthenticated, user, allowedRoles, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
}
