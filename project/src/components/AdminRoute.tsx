import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AdminRouteProps {
  children: React.ReactNode;
}

/**
 * Dedicated Admin Route Guard:
 * - Redirects to /admin-login (separate from user /login)
 * - Checks session or authenticated admin token
 */
const AdminRoute = ({ children }: AdminRouteProps) => {
  const [status, setStatus] = useState<'loading' | 'admin' | 'denied' | 'unauthed'>('loading');
  const location = useLocation();

  useEffect(() => {
    let cancelled = false;

    const check = async () => {
      // 1. Check local admin auth token
      const isLocalAdmin = localStorage.getItem('ank_admin_auth') === 'true';
      if (isLocalAdmin) {
        if (!cancelled) setStatus('admin');
        return;
      }

      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          if (!cancelled) setStatus('unauthed');
          return;
        }
        const { data: roles, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id);
        if (error) throw error;

        const isAdmin = !!roles?.some((r: { role: string }) => r.role === 'admin' || r.role === 'super_admin');
        if (!cancelled) setStatus(isAdmin ? 'admin' : 'denied');
      } catch (err) {
        console.error('[AdminRoute] role check failed:', err);
        if (!cancelled) setStatus('denied');
      }
    };

    check();
    return () => { cancelled = true; };
  }, []);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#07020f] text-white">
        <div className="text-center">
          <Shield className="w-12 h-12 text-amber-400 animate-pulse mx-auto mb-4" />
          <p className="text-slate-400 text-sm">Verifying administrative access...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthed') {
    return <Navigate to="/admin-login" replace state={{ from: location.pathname }} />;
  }

  if (status === 'denied') {
    toast.error('Access denied. Administrator privileges required.');
    return <Navigate to="/admin-login" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
