import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollText, Loader2 } from 'lucide-react';

interface AuditEntry {
  id: string;
  admin_user_id: string;
  action: string;
  target_table: string | null;
  target_id: string | null;
  meta: any;
  created_at: string;
}

const AdminAuditLog = () => {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('admin_audit_log' as any)
        .select('*')
        .order('created_at', { ascending: false })
        .limit(200);
      setEntries((data as unknown as AuditEntry[]) || []);
      setLoading(false);
    })();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ScrollText className="w-5 h-5" />
          Admin Audit Log
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-12 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading...
          </div>
        ) : entries.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">No admin activity yet.</p>
        ) : (
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {entries.map((e) => (
              <div key={e.id} className="flex items-start justify-between gap-3 p-3 rounded-lg border bg-card hover:bg-accent/30 transition-colors">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="secondary">{e.action}</Badge>
                    {e.target_table && (
                      <span className="text-xs text-muted-foreground">
                        {e.target_table}{e.target_id ? `#${e.target_id}` : ''}
                      </span>
                    )}
                  </div>
                  {e.meta && Object.keys(e.meta).length > 0 && (
                    <pre className="mt-1 text-xs text-muted-foreground overflow-x-auto">
                      {JSON.stringify(e.meta, null, 0)}
                    </pre>
                  )}
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {new Date(e.created_at).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminAuditLog;
