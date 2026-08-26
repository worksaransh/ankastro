import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getMasterPrice } from '@/content/reportContent';
import { useReport } from '@/hooks/useReports';
import { useCoupon } from '@/hooks/useCoupon';
import { getUtm } from '@/lib/utm';
import { trackInitiateCheckout } from '@/lib/tracking';
import { calculateFullProfile } from '@/lib/numerology';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Shield, Lock, Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import SEO from '@/components/SEO';
import DobInput from '@/components/DobInput';

// Cashfree v3 SDK loader (no npm install)
let sdkP: Promise<any> | null = null;
const loadCF = (): Promise<any> => {
  if ((window as any).Cashfree) return Promise.resolve((window as any).Cashfree);
  if (sdkP) return sdkP;
  sdkP = new Promise((res, rej) => {
    const s = document.createElement('script');
    s.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
    s.onload = () => res((window as any).Cashfree); s.onerror = () => rej(new Error('SDK load failed'));
    document.head.appendChild(s);
  });
  return sdkP;
};

// per-report extra fields (beyond name + DOB). Phase 3 makes these admin-dynamic.
type FieldSpec = { key: string; label: string; type?: string; required?: boolean; placeholder?: string; options?: string[] };
const EXTRA_FIELDS: Record<string, FieldSpec[]> = {
  name_correction: [{ key: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female', 'Other'] }],
  mobile_numerology: [{ key: 'mobileNumber', label: 'Mobile number (jo check karna hai)', required: true, placeholder: '10-digit number' }],
  vehicle_numerology: [
    { key: 'vehicleNumber', label: 'Vehicle number', required: true, placeholder: 'Jaise: DL01AB1234' },
    { key: 'vehicleType', label: 'Vehicle type', type: 'select', options: ['Car', 'Bike', 'Commercial'] },
  ],
  career_numerology: [
    { key: 'currentRole', label: 'Current role / field', placeholder: 'Jaise: Sales, Student' },
    { key: 'employeeOrOwner', label: 'Aap ho', type: 'select', options: ['Job', 'Business', 'Student', 'Looking'] },
  ],
  baby_name: [
    { key: 'babyGender', label: 'Baby Gender *', type: 'select', options: ['boy', 'girl', 'unisex'], required: true },
    { key: 'preferredLetter', label: 'Pasand ka starting letter (optional)', placeholder: 'Jaise: A, R, S' },
  ],
  compatibility_report: [
    { key: 'partnerName', label: 'Partner ka naam', required: true },
    { key: 'partnerDob', label: 'Partner DOB', type: 'date', required: true },
  ],
  business_numerology: [
    { key: 'businessName', label: 'Business / brand naam', required: true, placeholder: 'Jaise: Sharma Traders' },
    { key: 'businessStart', label: 'Business start date (optional)', type: 'date' },
  ],
  property_numerology: [
    { key: 'propertyNumber', label: 'House / flat / plot number', required: true, placeholder: 'Jaise: 301, A-12' },
    { key: 'propertyType', label: 'Property type', type: 'select', options: ['Flat', 'House', 'Plot', 'Commercial'] },
  ],
  marriage_report: [
    { key: 'partnerName', label: 'Partner ka naam (optional)' },
    { key: 'partnerDob', label: 'Partner DOB (optional)', type: 'date' },
  ],
};

export default function BuyReportPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const report = useReport(slug);
  const { couponCode, setCouponCode, result: couponResult, checking: couponChecking, applyCoupon } = useCoupon(report?.price || 0);
  useEffect(() => { if (report) { const t = report.title || ''; trackInitiateCheckout(report.price, report.key, (t.includes('—') ? t.split('—')[0] : t).trim()); } /* eslint-disable-next-line */ }, [report?.key]);
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [extra, setExtra] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  const [entitlements, setEntitlements] = useState<Record<string, string | boolean>>({});
  const [hasPlus, setHasPlus] = useState(false);
  const [hasMaster, setHasMaster] = useState(false);
  const [entitlementsLoading, setEntitlementsLoading] = useState(true);

  useEffect(() => {
    const fetchEntitlementsAndProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setEntitlementsLoading(false);
          return;
        }
        
        setEmail(session.user.email || '');

        // Prefill profile details
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, dob, phone_number')
          .eq('user_id', session.user.id)
          .maybeSingle();
        if (profile) {
          setName(profile.full_name || '');
          if (profile.dob) setDob(profile.dob);
          setPhone(profile.phone_number || '');
        }
        
        const { data, error } = await supabase.functions.invoke('get-report-tier');
        if (error) {
          setEntitlementsLoading(false);
          return;
        }

        const map: Record<string, string | boolean> = {};
        if (data?.isMaster) {
          map.master = true;
          setHasMaster(true);
        }
        if (data?.hasPlus) {
          setHasPlus(true);
        }

        if (data?.purchasedReportsMap) {
          Object.assign(map, data.purchasedReportsMap);
        }
        
        setEntitlements(map);
      } catch (e) {
        console.warn('Failed to load entitlements/profile:', e);
      } finally {
        setEntitlementsLoading(false);
      }
    };
    fetchEntitlementsAndProfile();
  }, []);

  const isEntitled = report && (hasMaster || !!entitlements[report.key]);
  const isFreeUnlock = hasMaster;
  const existingId = report ? (typeof entitlements[report.key] === 'string' ? entitlements[report.key] as string : null) : null;

  if (!report) {
    return <div className="min-h-screen flex flex-col items-center justify-center gap-4"><p>Report not found.</p><Link to="/"><Button variant="cosmic">Home</Button></Link></div>;
  }

  if (entitlementsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-cosmic/5 flex flex-col items-center justify-center p-4">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="mt-4 text-sm text-muted-foreground animate-pulse">Checking access...</p>
      </div>
    );
  }

  const fields = EXTRA_FIELDS[report.key] || [];
  
  // Active Plus subscribers get a 50% member discount on report base prices
  const baseReportPrice = hasPlus ? Math.round(report.price * 0.5) : report.price;
  const displayPrice = couponResult?.valid && couponResult.finalPrice !== undefined
    ? (hasPlus ? Math.max(0, Math.round(couponResult.finalPrice * 0.5)) : couponResult.finalPrice)
    : baseReportPrice;
  const off = Math.round(((report.originalPrice - displayPrice) / report.originalPrice) * 100);

  const setEx = (k: string, v: string) => setExtra((p) => ({ ...p, [k]: v }));

  const proceed = async () => {
    if (!name.trim() || !dob) { toast.error('Naam aur DOB bharo'); return; }
    if (!email.trim() || !email.includes('@')) { toast.error('Sahi email daalo (report yahan milegi)'); return; }
    for (const f of fields) if (f.required && !extra[f.key]) { toast.error(`${f.label} bharo`); return; }

    setBusy(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const currentUserId = session?.user?.id || null;

      const [yy, mm, dd] = dob.split('-');
      const dobFmt = `${dd}/${mm}/${yy}`;
      const profile = calculateFullProfile(name.trim(), dobFmt);
      const inputJson: Record<string, any> = {
        fullBirthName: name.trim(), displayName: name.trim(), dateOfBirth: dobFmt,
        email: email.trim(), phone: phone.trim(), ...extra,
      };

      const { data, error } = await supabase.functions.invoke('create-report-order', {
        body: {
          utm: getUtm() || undefined,
          couponCode: couponResult?.valid ? couponCode : null,
          reportKey: report.key, inputJson, profileJson: profile,
          email: email.trim(), name: name.trim(), phone: phone.trim(),
          userId: currentUserId,
          returnOrigin: window.location.origin,
        },
      });
      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || 'Order banane mein dikkat');

      if (data.mock) { // no Cashfree -> straight to success (testing)
        navigate(`/order/${data.orderId}`); return;
      }
      if (data.paymentSessionId) {
        const CF = await loadCF();
        const cashfree = CF({ mode: data.paymentMode === 'production' ? 'production' : 'sandbox' });
        await cashfree.checkout({ paymentSessionId: data.paymentSessionId, redirectTarget: '_self' });
        return;
      }
      throw new Error('Payment start nahi ho paya');
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || 'Kuch galat hua, dobara try karo');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-cosmic/5">
      <SEO title={`Buy ${report.title.split('—')[0].trim()} | AnkJyotish AI`} description={report.subtitle} canonical={`/buy/${report.slug}`} />
      <div className="max-w-2xl mx-auto px-4 py-10">
        <Link to={`/report/${report.slug}`} className="text-sm text-muted-foreground hover:text-foreground">← Wapas</Link>

        <div className="text-center my-6 flex flex-col items-center">
          <span className="text-4xl">{report.emoji}</span>
          <h1 className="font-display text-2xl mt-2">{report.title.split('—')[0].trim()}</h1>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="text-2xl font-bold text-gold">{isFreeUnlock ? 'Free' : `₹${displayPrice}`}</span>
            <span className="text-muted-foreground line-through">{isFreeUnlock ? '' : `₹${report.originalPrice}`}</span>
            {!isFreeUnlock && <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400">{off}% OFF</span>}
          </div>
          {hasPlus && !isFreeUnlock && (
            <div className="inline-flex items-center gap-1.5 mt-3 text-xs font-bold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-3.5 py-1 rounded-full uppercase tracking-wider">
              👑 Plus Member 50% Discount Applied!
            </div>
          )}
        </div>

        <Card className="border-gold/30">
          <CardContent className="pt-6 space-y-4">
            <p className="font-medium">Apni details bharo — report inhi pe bnegi</p>

            <div>
              <label className="block text-sm font-medium mb-1.5">Poora naam *</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Jaise: Rahul Sharma" className="h-11" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Date of Birth *</label>
              <DobInput value={dob} onChange={(v) => setDob(v)} outputFormat="yyyy-mm-dd" />
            </div>

            {fields.map((f) => (
              <div key={f.key}>
                <label className="block text-sm font-medium mb-1.5">{f.label}{f.required ? ' *' : ''}</label>
                {f.type === 'select' ? (
                  <select value={extra[f.key] || ''} onChange={(e) => setEx(f.key, e.target.value)} className="w-full h-11 rounded-md border border-input bg-background px-3 text-sm">
                    <option value="">Choose…</option>
                    {f.options!.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                ) : (
                  <Input type={f.type || 'text'} value={extra[f.key] || ''} onChange={(e) => setEx(f.key, e.target.value)} placeholder={f.placeholder} className="h-11" />
                )}
              </div>
            ))}

            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1.5">Email *</label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="aap@email.com" className="h-11" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">WhatsApp / Phone Number</label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="10-digit" className="h-11" />
              </div>
            </div>

            {existingId && (
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 text-center text-sm">
                <span className="text-muted-foreground">Aapke paas is report ka active order pehle se hai. </span>
                <button 
                  type="button"
                  onClick={() => navigate(`/order/${existingId}`)}
                  className="text-primary font-semibold hover:underline cursor-pointer inline-flex items-center gap-0.5"
                >
                  Open Your Existing Report →
                </button>
              </div>
            )}

            <Button variant="cosmic" size="lg" className="w-full" onClick={proceed} disabled={busy}>
              {busy 
                ? (isFreeUnlock ? 'Generating…' : 'Aage badh rahe hain…') 
                : isFreeUnlock 
                  ? (hasMaster ? 'Get Report (Free with Master)' : 'Get Report (Free with Plus)')
                  : `Pay ₹${displayPrice} & Get Report`
              } 
              {!isFreeUnlock && <Lock className="w-4 h-4 ml-1.5" />}
            </Button>

            {/* Coupon code */}
            {!isFreeUnlock && (
              <>
                <div className="flex gap-2 mb-2">
                  <input
                    className="flex-1 h-9 rounded-md border border-border bg-background px-3 text-sm placeholder:text-muted-foreground"
                    placeholder="Coupon code (optional)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  />
                  <Button variant="outline" size="sm" onClick={applyCoupon} disabled={couponChecking}>
                    {couponChecking ? '...' : 'Apply'}
                  </Button>
                </div>
                {couponResult?.valid && <p className="text-xs text-emerald-500 mb-2">✓ {couponResult.message}</p>}
                {couponResult && !couponResult.valid && <p className="text-xs text-red-500 mb-2">{couponResult.message}</p>}
              </>
            )}

            <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5 text-emerald-500" /> Secure Cashfree payment</span>
              <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-emerald-500" /> 24hr delivery</span>
            </div>

            {!isFreeUnlock && (
              <button onClick={() => navigate('/payment?tier=master')} className="w-full text-center text-xs text-primary/80 hover:text-primary border-t border-border/50 pt-3 mt-1">
                👑 Ya saari reports + AI chat — <b>Master ₹{getMasterPrice()}</b> (best value)
              </button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
