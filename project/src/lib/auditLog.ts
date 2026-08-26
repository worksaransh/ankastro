import { supabase } from '@/integrations/supabase/client';

/**
 * Log an admin action. Fails silently — auditing must never block UI.
 */
export async function logAdminAction(
  action: string,
  opts?: { target_table?: string; target_id?: string | number; meta?: Record<string, any> }
) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    await supabase.from('admin_audit_log').insert({
      admin_user_id: session.user.id,
      action,
      target_table: opts?.target_table ?? null,
      target_id: opts?.target_id != null ? String(opts.target_id) : null,
      meta: opts?.meta ?? {},
    });
  } catch (err) {
    console.warn('[auditLog] failed:', err);
  }
}
