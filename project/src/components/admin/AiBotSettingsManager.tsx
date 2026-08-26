import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Bot, Sparkles, Save, RefreshCw, MessageSquare, Crown } from 'lucide-react';

export default function AiBotSettingsManager() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [botGreetingEn, setBotGreetingEn] = useState(
    "Namaste! 🙏 I'm your numerology guide. Ask me about your birth number, name vibration, lucky days, or compatibility."
  );
  const [botGreetingHi, setBotGreetingHi] = useState(
    'नमस्ते! 🙏 मैं आपका अंक ज्योतिष मार्गदर्शक हूँ। अपने जन्म अंक, नाम कंपन, शुभ दिन या अनुकूलता के बारे में पूछें।'
  );
  const [botGreetingHinglish, setBotGreetingHinglish] = useState(
    'Namaste! 🙏 Main aapka numerology guide hoon. Birth number, naam vibration, lucky days ya compatibility ke baare mein poochein.'
  );
  const [freeTrialLimit, setFreeTrialLimit] = useState('3');
  const [upgradeBannerTextEn, setUpgradeBannerTextEn] = useState(
    '🔒 You have used your 3 Free AI Chat credits! Upgrade to Plus for unlimited chats.'
  );
  const [upgradeBannerTextHi, setUpgradeBannerTextHi] = useState(
    '🔒 आपकी 3 फ्री AI चैट की सीमा समाप्त हो गई है! असीमित चैट के लिए प्लस सदस्यता लें।'
  );
  const [aiSystemPrompt, setAiSystemPrompt] = useState(
    'You are an expert Vedic and Pythagorean Numerology AI Astrologer. Analyze Mulank, Bhagyank, Naamank, Lo Shu grid, Pinnacles, and Karmic Debts with empathy and actionable remedies.'
  );

  const loadSettings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('site_content').select('key, value');
      if (error) throw error;

      if (data && data.length > 0) {
        const kv: Record<string, string> = {};
        data.forEach((item: { key: string; value: string }) => {
          kv[item.key] = item.value;
        });

        if (kv.ai_bot_greeting_en) setBotGreetingEn(kv.ai_bot_greeting_en);
        if (kv.ai_bot_greeting_hi) setBotGreetingHi(kv.ai_bot_greeting_hi);
        if (kv.ai_bot_greeting_hinglish) setBotGreetingHinglish(kv.ai_bot_greeting_hinglish);
        if (kv.ai_free_trial_limit) setFreeTrialLimit(kv.ai_free_trial_limit);
        if (kv.ai_upgrade_banner_en) setUpgradeBannerTextEn(kv.ai_upgrade_banner_en);
        if (kv.ai_upgrade_banner_hi) setUpgradeBannerTextHi(kv.ai_upgrade_banner_hi);
        if (kv.ai_system_prompt) setAiSystemPrompt(kv.ai_system_prompt);
      }
    } catch (err: any) {
      console.warn('Could not load AI Bot settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = [
        { key: 'ai_bot_greeting_en', value: botGreetingEn, category: 'ai_chat' },
        { key: 'ai_bot_greeting_hi', value: botGreetingHi, category: 'ai_chat' },
        { key: 'ai_bot_greeting_hinglish', value: botGreetingHinglish, category: 'ai_chat' },
        { key: 'ai_free_trial_limit', value: freeTrialLimit, category: 'ai_chat' },
        { key: 'ai_upgrade_banner_en', value: upgradeBannerTextEn, category: 'ai_chat' },
        { key: 'ai_upgrade_banner_hi', value: upgradeBannerTextHi, category: 'ai_chat' },
        { key: 'ai_system_prompt', value: aiSystemPrompt, category: 'ai_chat' },
      ];

      for (const item of payload) {
        const { error } = await supabase.from('site_content').upsert(item, { onConflict: 'key' });
        if (error) throw error;
      }

      toast.success('AI Chatbot settings updated successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="glass-card-mystical border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-display font-bold text-white flex items-center gap-2">
              <Bot className="w-5 h-5 text-amber-400" />
              AI Chatbot & Prompts Dynamic Manager
            </CardTitle>
            <CardDescription className="text-gray-400">
              Configure system prompts, free trial message limits, greetings, and paywall banners dynamically.
            </CardDescription>
          </div>
          <Badge variant="outline" className="bg-amber-400/10 text-amber-300 border-amber-400/30">
            <Sparkles className="w-3.5 h-3.5 mr-1" /> Dynamic Control
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-2">
        {/* Trial Limits */}
        <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
          <h4 className="font-semibold text-sm text-amber-400 flex items-center gap-2">
            <Crown className="w-4 h-4" /> Free Trial Chat Limit & Paywall Settings
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label className="text-xs text-gray-300">Free Trial Messages Limit (per user)</Label>
              <Input
                type="number"
                value={freeTrialLimit}
                onChange={(e) => setFreeTrialLimit(e.target.value)}
                className="mt-1 bg-background border-input text-white"
              />
            </div>
            <div>
              <Label className="text-xs text-gray-300">Upgrade Banner (English)</Label>
              <Input
                value={upgradeBannerTextEn}
                onChange={(e) => setUpgradeBannerTextEn(e.target.value)}
                className="mt-1 bg-background border-input text-white"
              />
            </div>
            <div>
              <Label className="text-xs text-gray-300">Upgrade Banner (Hindi)</Label>
              <Input
                value={upgradeBannerTextHi}
                onChange={(e) => setUpgradeBannerTextHi(e.target.value)}
                className="mt-1 bg-background border-input text-white"
              />
            </div>
          </div>
        </div>

        {/* Greetings */}
        <div className="space-y-4">
          <h4 className="font-semibold text-sm text-white flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-primary" /> Auto Greetings by Language
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-xs text-gray-300">English Greeting</Label>
              <Textarea
                rows={3}
                value={botGreetingEn}
                onChange={(e) => setBotGreetingEn(e.target.value)}
                className="mt-1 bg-background border-input text-white text-xs"
              />
            </div>
            <div>
              <Label className="text-xs text-gray-300">Hindi Greeting (हिन्दी)</Label>
              <Textarea
                rows={3}
                value={botGreetingHi}
                onChange={(e) => setBotGreetingHi(e.target.value)}
                className="mt-1 bg-background border-input text-white text-xs"
              />
            </div>
            <div>
              <Label className="text-xs text-gray-300">Hinglish Greeting</Label>
              <Textarea
                rows={3}
                value={botGreetingHinglish}
                onChange={(e) => setBotGreetingHinglish(e.target.value)}
                className="mt-1 bg-background border-input text-white text-xs"
              />
            </div>
          </div>
        </div>

        {/* System Prompt */}
        <div className="space-y-2">
          <Label className="text-xs text-gray-300 font-semibold">AI System Prompt & Astrologer Instructions</Label>
          <Textarea
            rows={4}
            value={aiSystemPrompt}
            onChange={(e) => setAiSystemPrompt(e.target.value)}
            className="bg-background border-input text-white text-xs leading-relaxed"
            placeholder="System prompt for AI Numerologist model..."
          />
        </div>

        {/* Actions */}
        <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
          <Button variant="outline" onClick={loadSettings} disabled={loading} className="gap-1.5">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Reset
          </Button>
          <Button onClick={handleSave} disabled={saving} className="bg-primary hover:bg-primary/90 text-white gap-2 font-semibold shadow-md">
            <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save AI Settings'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
