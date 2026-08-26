import { supabase } from '@/integrations/supabase/client';

export async function safeUpsertProfile(payload: Record<string, any>): Promise<{ ok: boolean; fallbackUsed?: boolean }> {
  // Attempt 1: Full payload with onConflict 'id'
  let { error } = await supabase.from('profiles').upsert(payload, { onConflict: 'id' });
  if (!error) return { ok: true };

  // Attempt 2: Full payload with onConflict 'user_id'
  if (error.message.includes('ON CONFLICT') || error.message.includes('onConflict') || error.code === 'PGRST100') {
    const res = await supabase.from('profiles').upsert(payload, { onConflict: 'user_id' });
    if (!res.error) return { ok: true };
    error = res.error;
  }

  // Attempt 3: If schema cache / missing column error (e.g. 'bhagyank', 'mulank', 'personalization_score')
  if (error.message.includes('Could not find') || error.message.includes('column') || error.message.includes('schema cache')) {
    console.warn('Supabase profiles table missing extended columns in remote schema. Stripping and saving core fields:', error.message);
    
    const corePayload: Record<string, any> = { ...payload };
    const extendedKeys = ['mulank', 'bhagyank', 'personalization_score', 'full_birth_name', 'display_name', 'birth_time', 'birth_place', 'industry'];
    
    extendedKeys.forEach((key) => delete corePayload[key]);

    let res1 = await supabase.from('profiles').upsert(corePayload, { onConflict: 'id' });
    if (!res1.error) return { ok: true, fallbackUsed: true };

    let res2 = await supabase.from('profiles').upsert(corePayload, { onConflict: 'user_id' });
    if (!res2.error) return { ok: true, fallbackUsed: true };

    let res3 = await supabase.from('profiles').update(corePayload).or(`id.eq.${payload.id},user_id.eq.${payload.id}`);
    if (!res3.error) return { ok: true, fallbackUsed: true };

    throw res3.error || res2.error || res1.error || error;
  }

  throw error;
}
