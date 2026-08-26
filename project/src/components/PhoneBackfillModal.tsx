import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { safeUpsertProfile } from '@/lib/profileHelper';
import { toast } from 'sonner';
import { Phone, X } from 'lucide-react';

interface PhoneBackfillModalProps {
  open: boolean;
  userId: string;
  onDone: (phone: string) => void;
  onClose?: () => void;
}

export default function PhoneBackfillModal({
  open, userId, onDone, onClose,
}: PhoneBackfillModalProps) {
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);

  const save = async () => {
    const raw = phone.trim();
    if (!raw) {
      toast.error('Please enter your phone number');
      return;
    }
    const e164 = raw.startsWith('+') ? raw : `+91${raw.replace(/^0+/, '')}`;
    if (!/^\+[1-9]\d{7,14}$/.test(e164)) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    setSaving(true);
    try {
      // 1. Update profiles table
      await safeUpsertProfile({ id: userId, user_id: userId, phone_number: e164 });
      await supabase.from('profiles').update({ phone_number: e164 }).or(`id.eq.${userId},user_id.eq.${userId}`);

      // 2. Also sync with auth metadata
      await supabase.auth.updateUser({
        data: { phone_number: e164 }
      });

      toast.success('Phone number saved successfully');
      onDone(e164);
    } catch (err: any) {
      console.error('Phone save error:', err);
      toast.error(err.message || 'Failed to save phone number');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose?.(); }}>
      <DialogContent className="w-[92vw] max-w-md bg-[#110e21] border border-white/10 text-white rounded-2xl shadow-2xl p-5 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl font-display font-semibold text-white flex items-center gap-2">
            <Phone className="w-5 h-5 text-primary" />
            Add Phone Number
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-gray-300">
            Please provide your phone number to complete your profile and receive instant notifications.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          <Label htmlFor="bf-phone" className="text-xs font-medium text-gray-200">
            Phone / Mobile Number *
          </Label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="bf-phone"
              type="tel"
              placeholder="+91 9876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="pl-10 h-11 bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-primary focus:ring-1 focus:ring-primary text-sm rounded-xl"
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0 flex-col sm:flex-row pt-2">
          {onClose && (
            <Button
              variant="outline"
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto border-white/10 text-gray-300 hover:bg-white/5 hover:text-white rounded-xl text-xs sm:text-sm h-10"
            >
              Later / Skip
            </Button>
          )}
          <Button
            onClick={save}
            disabled={saving}
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white rounded-xl text-xs sm:text-sm h-10 font-semibold"
          >
            {saving ? 'Saving…' : 'Submit & Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

