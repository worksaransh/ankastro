import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/Logo';
import LanguageToggle from '@/components/LanguageToggle';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useUserProfile } from '@/hooks/useUserProfile';
import { safeUpsertProfile } from '@/lib/profileHelper';
import { calculateBirthday, calculateLifePath } from '@/lib/numerology';
import { calculatePsychologicalBaseline, saveUserPsychology } from '@/lib/psychology';
import DobInput from '@/components/DobInput';
import SEO from '@/components/SEO';
import { ArrowLeft, User, Sparkles, CheckCircle2, Save, Crown, LogOut, ShieldCheck, Heart, Briefcase, Calendar, MapPin, Clock, Phone } from 'lucide-react';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isHi = language === 'hi';
  const userProfile = useUserProfile();

  const {
    user,
    profile,
    loading: isProfileLoading,
    refetch: refetchProfile
  } = userProfile;

  // Form State
  const [formDob, setFormDob] = useState('');
  const [formGender, setFormGender] = useState('male');
  const [formProfession, setFormProfession] = useState('');
  const [formGoals, setFormGoals] = useState('');
  const [formMaritalStatus, setFormMaritalStatus] = useState('single');
  const [formIsBusinessOwner, setFormIsBusinessOwner] = useState(false);
  const [formFullBirthName, setFormFullBirthName] = useState('');
  const [formDisplayName, setFormDisplayName] = useState('');
  const [formBirthTime, setFormBirthTime] = useState('');
  const [formBirthPlace, setFormBirthPlace] = useState('');
  const [formIndustry, setFormIndustry] = useState('');
  const [formPhone, setFormPhone] = useState('');

  const [saving, setSaving] = useState(false);

  // Populate form fields when profile is loaded
  useEffect(() => {
    if (profile) {
      setFormDob(profile.dob || '');
      setFormGender(profile.gender || 'male');
      setFormProfession(profile.profession || '');
      setFormGoals(profile.goals?.primary || '');
      setFormMaritalStatus(profile.marital_status || 'single');
      setFormIsBusinessOwner(profile.is_business_owner || false);
      setFormFullBirthName(profile.full_birth_name || profile.full_name || '');
      setFormDisplayName(profile.display_name || profile.full_name || '');
      setFormBirthTime(profile.birth_time || '');
      setFormBirthPlace(profile.birth_place || '');
      setFormIndustry(profile.industry || '');
      setFormPhone(profile.phone_number || user?.user_metadata?.phone_number || '');
    }
  }, [profile, user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);

    try {
      let phoneE164 = formPhone.trim();
      if (phoneE164) {
        phoneE164 = phoneE164.startsWith('+') ? phoneE164 : `+91${phoneE164.replace(/^0+/, '')}`;
        if (!/^\+[1-9]\d{7,14}$/.test(phoneE164)) {
          toast.error(isHi ? 'कृपया सही 10-अंकों का फोन नंबर दर्ज करें' : 'Please enter a valid phone number');
          setSaving(false);
          return;
        }
      }

      // Calculate Mulank & Bhagyank from DOB if available
      let mulank = profile?.mulank || 1;
      let bhagyank = profile?.bhagyank || 1;
      if (formDob) {
        let formattedDob = formDob;
        if (formDob.includes('-')) {
          const parts = formDob.split('-');
          if (parts.length === 3) {
            formattedDob = `${parts[2]}/${parts[1]}/${parts[0]}`;
          }
        }
        mulank = calculateBirthday(formattedDob);
        bhagyank = calculateLifePath(formattedDob);
      }

      // Compute personalization score
      let score = 30;
      if (formDob) score += 20;
      if (formFullBirthName) score += 15;
      if (formProfession) score += 15;
      if (formGoals) score += 10;
      if (phoneE164) score += 10;
      score = Math.min(score, 100);

      const profilePayload = {
        id: user.id,
        user_id: user.id,
        email: user.email || '',
        full_name: formDisplayName || formFullBirthName || user.user_metadata?.full_name || profile?.full_name || '',
        full_birth_name: formFullBirthName || '',
        display_name: formDisplayName || formFullBirthName || '',
        phone_number: phoneE164 || null,
        dob: formDob || null,
        gender: formGender,
        profession: formProfession,
        goals: { primary: formGoals },
        marital_status: formMaritalStatus,
        is_business_owner: formIsBusinessOwner,
        birth_time: formBirthTime || null,
        birth_place: formBirthPlace,
        industry: formIndustry,
        mulank,
        bhagyank,
        personalization_score: score,
        updated_at: new Date().toISOString(),
      };

      await safeUpsertProfile(profilePayload);
      if (phoneE164) {
        await supabase.from('profiles').update({ phone_number: phoneE164 }).or(`id.eq.${user.id},user_id.eq.${user.id}`);
        await supabase.auth.updateUser({ data: { phone_number: phoneE164 } });
      }

      // Save psychological baseline
      const baseline = calculatePsychologicalBaseline({
        mulank,
        bhagyank,
        profession: formProfession,
        isBusinessOwner: formIsBusinessOwner,
        goal: formGoals,
      });
      await saveUserPsychology(user.id, baseline);

      toast.success(isHi ? 'प्रोफ़ाइल सफलतापूर्वक अपडेट हो गई!' : 'My Profile updated successfully!');
      await refetchProfile();
    } catch (e: any) {
      toast.error(e.message || 'Error updating profile');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success('Logged out successfully');
    navigate('/');
  };

  if (isProfileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Sparkles className="w-12 h-12 text-primary animate-pulse mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    );
  }

  const score = profile?.personalization_score || 30;

  return (
    <>
      <SEO title="My Profile — AnkJyotish" description="Manage your personal numerology profile and details." canonical="/profile" noindex={true} />
      <div className="min-h-screen bg-background spiritual-pattern">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
          <div className="container mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')} className="gap-1 text-muted-foreground hover:text-foreground">
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">{isHi ? 'डैशबोर्ड' : 'Dashboard'}</span>
              </Button>
              <Link to="/"><Logo size="sm" /></Link>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <LanguageToggle />
              <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-1 text-xs sm:text-sm">
                <LogOut className="w-4 h-4 text-muted-foreground" />
                <span className="hidden sm:inline">{isHi ? 'लॉगआउट' : 'Logout'}</span>
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-6 sm:py-8 max-w-3xl">
          {/* Top Banner Card */}
          <Card className="glass-card-mystical border-primary/20 mb-6 overflow-hidden">
            <CardContent className="pt-6 pb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary to-violet-600 flex items-center justify-center text-white font-display text-2xl font-bold shadow-lg shadow-primary/20">
                    {(profile?.display_name || user?.email || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h1 className="font-display text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2">
                      {profile?.display_name || profile?.full_name || 'My Profile'}
                      <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    </h1>
                    <p className="text-xs sm:text-sm text-muted-foreground">{user?.email}</p>
                  </div>
                </div>

                <div className="w-full sm:w-auto bg-primary/10 border border-primary/20 rounded-xl p-3 text-center sm:text-right">
                  <span className="text-xs text-muted-foreground block">{isHi ? 'प्रोफ़ाइल स्कोर' : 'Profile Complete'}</span>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-28 bg-muted rounded-full h-2 overflow-hidden">
                      <div className="bg-gradient-to-r from-primary to-emerald-400 h-2 rounded-full transition-all duration-500" style={{ width: `${score}%` }} />
                    </div>
                    <span className="text-xs font-bold text-primary">{score}%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Form Card */}
          <Card className="glass-card-mystical border-border shadow-xl">
            <CardHeader className="border-b border-border/50">
              <CardTitle className="font-display text-lg sm:text-xl flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                {isHi ? 'व्यक्तिगत विवरण' : 'Personal Details'}
              </CardTitle>
              <CardDescription>
                {isHi
                  ? 'सटीक भविष्यफल और अंकज्योतिष रिपोर्ट के लिए अपनी जानकारी भरें।'
                  : 'Update your details to get hyper-personalized daily forecasts and reports.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {/* Names */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="prof-birthname" className="text-xs font-medium">
                    {isHi ? 'जन्म नाम (अंक ज्योतिष गणना हेतु)' : 'Full Birth Name (for Numerology)'} *
                  </Label>
                  <Input
                    id="prof-birthname"
                    type="text"
                    placeholder="Full birth name (e.g. Aarav Kumar Sharma)"
                    value={formFullBirthName}
                    onChange={(e) => setFormFullBirthName(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="prof-dispname" className="text-xs font-medium">
                    {isHi ? 'पुकारने का नाम / उपनाम' : 'Display / Nickname'}
                  </Label>
                  <Input
                    id="prof-dispname"
                    type="text"
                    placeholder="Preferred name (e.g. Aarav)"
                    value={formDisplayName}
                    onChange={(e) => setFormDisplayName(e.target.value)}
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-1.5 p-4 rounded-xl bg-muted/40 border border-border/50">
                <Label htmlFor="prof-phone" className="text-sm font-semibold flex items-center gap-1.5 text-primary">
                  <Phone className="w-4 h-4" />
                  {isHi ? 'फोन / मोबाइल नंबर' : 'Phone / Mobile Number'} *
                </Label>
                <Input
                  id="prof-phone"
                  type="tel"
                  placeholder="+91 9876543210"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  className="bg-background border-input"
                />
              </div>

              {/* Date of Birth (DOB) - iOS compatible DobInput */}
              <div className="space-y-1.5 p-4 rounded-xl bg-muted/40 border border-border/50">
                <Label htmlFor="prof-dob" className="text-sm font-semibold flex items-center gap-1.5 text-primary">
                  <Calendar className="w-4 h-4" />
                  {isHi ? 'जन्म तिथि (Date of Birth)' : 'Date of Birth'} *
                </Label>
                <DobInput
                  id="prof-dob"
                  value={formDob}
                  onChange={(val) => setFormDob(val)}
                  outputFormat="yyyy-mm-dd"
                  language={language}
                />
              </div>

              {/* Birth Time & Place */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="prof-birthtime" className="text-xs font-medium flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                    {isHi ? 'जन्म का समय (वैकल्पिक)' : 'Birth Time (optional)'}
                  </Label>
                  <Input
                    id="prof-birthtime"
                    type="time"
                    value={formBirthTime}
                    onChange={(e) => setFormBirthTime(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="prof-birthplace" className="text-xs font-medium flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                    {isHi ? 'जन्म स्थान (शहर/राज्य)' : 'Birth Place (City/State)'}
                  </Label>
                  <Input
                    id="prof-birthplace"
                    type="text"
                    placeholder="e.g. Mumbai, Maharashtra"
                    value={formBirthPlace}
                    onChange={(e) => setFormBirthPlace(e.target.value)}
                  />
                </div>
              </div>

              {/* Gender & Marital Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="prof-gender" className="text-xs font-medium">
                    {isHi ? 'लिंग' : 'Gender'}
                  </Label>
                  <select
                    id="prof-gender"
                    className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    value={formGender}
                    onChange={(e) => setFormGender(e.target.value)}
                  >
                    <option value="male">{isHi ? 'पुरुष' : 'Male'}</option>
                    <option value="female">{isHi ? 'महिला' : 'Female'}</option>
                    <option value="other">{isHi ? 'अन्य' : 'Other'}</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="prof-marital" className="text-xs font-medium">
                    {isHi ? 'वैवाहिक स्थिति' : 'Relationship Status'}
                  </Label>
                  <select
                    id="prof-marital"
                    className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    value={formMaritalStatus}
                    onChange={(e) => setFormMaritalStatus(e.target.value)}
                  >
                    <option value="single">{isHi ? 'अविवाहित' : 'Single'}</option>
                    <option value="married">{isHi ? 'विवाहित' : 'Married'}</option>
                    <option value="divorced">{isHi ? 'तलाकशुदा' : 'Divorced'}</option>
                    <option value="separated">{isHi ? 'अलग' : 'Separated'}</option>
                  </select>
                </div>
              </div>

              {/* Profession & Industry */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="prof-job" className="text-xs font-medium flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5 text-muted-foreground" />
                    {isHi ? 'व्यवसाय / नौकरी' : 'Profession / Occupation'}
                  </Label>
                  <Input
                    id="prof-job"
                    type="text"
                    placeholder="e.g. Software Engineer"
                    value={formProfession}
                    onChange={(e) => setFormProfession(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="prof-industry" className="text-xs font-medium">
                    {isHi ? 'उद्योग / डोमेन' : 'Industry / Domain'}
                  </Label>
                  <Input
                    id="prof-industry"
                    type="text"
                    placeholder="e.g. IT, Healthcare, Retail"
                    value={formIndustry}
                    onChange={(e) => setFormIndustry(e.target.value)}
                  />
                </div>
              </div>

              {/* Primary Life Goal */}
              <div className="space-y-1.5">
                <Label htmlFor="prof-goals" className="text-xs font-medium flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 text-muted-foreground" />
                  {isHi ? 'प्राथमिक जीवन लक्ष्य' : 'Primary Life Goal'}
                </Label>
                <Input
                  id="prof-goals"
                  type="text"
                  placeholder="e.g. Career growth, financial freedom, finding love"
                  value={formGoals}
                  onChange={(e) => setFormGoals(e.target.value)}
                />
              </div>

              {/* Business Owner Checkbox */}
              <div className="flex items-center gap-3 pt-2 p-3 rounded-lg bg-primary/5 border border-primary/10">
                <input
                  id="prof-biz"
                  type="checkbox"
                  className="w-4 h-4 rounded text-primary focus:ring-primary bg-background border-input cursor-pointer"
                  checked={formIsBusinessOwner}
                  onChange={(e) => setFormIsBusinessOwner(e.target.checked)}
                />
                <Label htmlFor="prof-biz" className="cursor-pointer select-none text-sm font-medium text-foreground">
                  {isHi ? 'मैं व्यवसाय स्वामी / संस्थापक हूँ' : 'I am a Business Owner / Founder'}
                </Label>
              </div>

              {/* Save Button */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-border/50">
                <Button
                  variant="outline"
                  onClick={() => navigate('/dashboard')}
                  className="w-full sm:w-auto"
                >
                  {isHi ? 'रद्द करें' : 'Cancel'}
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full sm:w-auto gap-2 bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-600/90 text-white font-semibold shadow-md shadow-primary/20"
                >
                  <Save className="w-4 h-4" />
                  {saving ? (isHi ? 'सेव हो रहा है...' : 'Saving Changes...') : (isHi ? 'सेव करें' : 'Save Changes')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </>
  );
};

export default ProfilePage;
