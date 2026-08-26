import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CalendarDays, Plus, Trash2, Milestone, Info } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface LifeEvent {
  id: string;
  event_type: string;
  event_date: string;
  notes: string;
}

export const LifeEventTracker: React.FC = () => {
  const [events, setEvents] = useState<LifeEvent[]>([]);
  const [eventType, setEventType] = useState<string>('');
  const [eventDate, setEventDate] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const eventOptions = [
    { value: 'job_change', label: '💼 Job Change' },
    { value: 'promotion', label: '🚀 Promotion' },
    { value: 'business_start', label: '📈 Started Business' },
    { value: 'marriage', label: '💍 Marriage' },
    { value: 'engagement', label: '💑 Engagement' },
    { value: 'child_birth', label: '👶 Child Birth' },
    { value: 'house_purchase', label: '🏡 House Purchase' },
    { value: 'relocation', label: '🗺️ Relocation' }
  ];

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from('user_life_events')
        .select('id, event_type, event_date, notes')
        .eq('user_id', session.user.id)
        .order('event_date', { ascending: false });

      if (error) throw error;
      setEvents(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventType || !eventDate) {
      toast.error('Please select an event type and date.');
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Please sign in to track life events.');
        setIsSubmitting(false);
        return;
      }

      const year = new Date(eventDate).getFullYear();

      const { error } = await supabase
        .from('user_life_events')
        .insert({
          user_id: session.user.id,
          event_type: eventType,
          event_date: eventDate,
          notes: notes,
          numerology_year: year
        });

      if (error) throw error;

      toast.success('Life milestone recorded successfully!');
      setEventType('');
      setEventDate('');
      setNotes('');
      fetchEvents();
    } catch (err) {
      console.error(err);
      toast.error('Failed to log event.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('user_life_events')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Event deleted.');
      fetchEvents();
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete event.');
    }
  };

  const getLabel = (value: string) => {
    return eventOptions.find((o) => o.value === value)?.label || value;
  };

  return (
    <Card className="card-premium relative overflow-hidden border border-primary/10 bg-gradient-to-br from-card to-primary/5 shadow-xl transition-all duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 font-display text-lg font-semibold text-foreground">
          <Milestone className="h-5 w-5 text-primary" />
          Life Milestone Tracker
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Logging past and recent milestones enriches AI chatbot memory and future numerology predictions.
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Form to add new milestone */}
        <form onSubmit={handleSubmit} className="space-y-3 p-3 bg-muted/30 rounded-lg border border-border/40">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Milestone Event</label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                className="w-full text-xs rounded-md border border-input bg-background px-3 py-2 text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="">Select Event...</option>
                {eventOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Event Date</label>
              <Input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="text-xs h-auto py-1.5"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Notes (Optional context)</label>
            <Input
              type="text"
              placeholder="e.g. Started role in marketing, relocated to Mumbai"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="text-xs h-auto py-1.5"
            />
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full text-xs py-1.5 h-auto font-medium">
            <Plus className="mr-1 h-3.5 w-3.5" /> Record Milestone
          </Button>
        </form>

        {/* List of milestones */}
        <div className="space-y-2">
          <label className="text-xs font-semibold block text-foreground">Logged Milestones</label>
          {isLoading ? (
            <p className="text-xs text-muted-foreground animate-pulse">Loading milestone logs...</p>
          ) : events.length === 0 ? (
            <div className="flex items-center gap-2 p-3 bg-muted/20 border border-border/40 rounded-lg text-xs text-muted-foreground">
              <Info className="h-4 w-4 text-primary shrink-0" />
              <span>No milestones logged yet. Share key events to align your timeline.</span>
            </div>
          ) : (
            <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
              {events.map((ev) => (
                <div
                  key={ev.id}
                  className="flex items-center justify-between p-2 bg-card border border-primary/5 rounded-lg text-xs hover:border-primary/10 transition-colors"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 font-medium text-foreground">
                      <span>{getLabel(ev.event_type)}</span>
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-mono">
                        <CalendarDays className="h-3 w-3" />
                        {new Date(ev.event_date).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    {ev.notes && <p className="text-[11px] text-muted-foreground leading-normal">{ev.notes}</p>}
                  </div>
                  <Button
                    onClick={() => handleDelete(ev.id)}
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/5 shrink-0"
                  >
                    <Trash2 className="h-4.5 w-4.5" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
