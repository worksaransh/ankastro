// =====================================================================
// Static CRO content for per-report landing pages.
// Marketing + numerology + CRO crafted. Edit text here anytime.
// Prices in 199-499 range (individual reports). Master = 999 (full suite).
// =====================================================================
import type { ReportKey } from '@/lib/whiteLabelPdf';

export interface ReportLandingContent {
  key: ReportKey;
  slug: string;
  badge: string;
  emoji: string;
  title: string;            // H1
  subtitle: string;         // hero sub
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  deliveryHrs: number;
  // creative media (upload to /public/images/reports/<folder>/)
  imgFolder: string;        // folder name under /images/reports/
  bannerImg: string;        // hero banner filename
  previewImgs: string[];    // report preview page images
  proofImgs: string[];      // celebrity/result proof images
  videoId: string;          // YouTube video id (blank = hidden)
  // sections
  painHeadline: string;
  pains: string[];
  promiseHeadline: string;
  promise: string;
  steps: { title: string; desc: string }[];
  deliverables: string[];   // "what you get" (paid)
  beforeAfter: {
    headline: string;
    before: { name: string; bars: { label: string; value: number }[] };
    after: { name: string; bars: { label: string; value: number }[] };
  };
  whyHeadline: string;
  why: string[];
  testimonials: { name: string; city: string; text: string; stars: number }[];
  faqs: { q: string; a: string }[];
  finalCta: string;
}

const MASTER_PRICE = 999;
export const getMasterPrice = () => MASTER_PRICE;

export const REPORTS: ReportLandingContent[] = [
  // ---------------- NAME CORRECTION ----------------
  {
    key: 'name_correction', slug: 'name-correction-report', badge: 'Bestseller', emoji: '✍️',
    title: 'Naam Correction Report — Apne Naam Ki Energy Theek Karo',
    subtitle: 'Aapka naam aapki kismat ka 30% control karta hai. Sahi spelling se career, paisa aur respect — sab badal sakta hai.',
    price: 399, originalPrice: 999, rating: 4.9, reviews: 12480, deliveryHrs: 24,
    imgFolder: 'name-correction', bannerImg: 'banner.jpg', previewImgs: ['preview-1.jpg','preview-2.jpg','preview-3.jpg'], proofImgs: ['proof-1.jpg','proof-2.jpg','proof-3.jpg'], videoId: '',
    painHeadline: 'Kya aapke saath ye ho raha hai?',
    pains: [
      'Mehnat poori, par result aadha — kahin ruk jaate ho',
      'Log naam galat bolte ya likhte hain baar-baar',
      'Documents me naam ki spelling ek jaisi nahi',
      'Sab theek hai phir bhi "kuch atak raha hai" wala feeling',
    ],
    promiseHeadline: 'Naam thoda sa badlo, kismat poori badlo',
    promise: 'Numerology me naam ka har akshar ek number aur vibration carry karta hai. Jab aapke naam ka total aapke janm-ank ke saath align hota hai, opportunities khulti hain. Hum aapke exact naam ko analyse karke 3–5 best spelling options dete hain — bina aapki pehchaan badle.',
    steps: [
      { title: 'Apna naam + DOB do', desc: 'Bas current naam aur birth date — 30 second me' },
      { title: 'Hum calculate karte hain', desc: 'Naam ka root, vibration aur aapke Mulank se match' },
      { title: 'Best spelling milti hai', desc: '3-5 options + match % + remedies, PDF me' },
    ],
    deliverables: [
      'Aapke current naam ka pura numerology analysis',
      '3–5 corrected spelling options (match % ke saath)',
      'Har option ka kyun behtar hai — clear reason',
      'Lucky signature style & lucky initial',
      'Personalised remedies (rang, din, mantra)',
      'Lifetime valid PDF — WhatsApp/email par',
    ],
    beforeAfter: {
      headline: 'Naam sudhaar ke baad asar (sample)',
      before: { name: 'RAHUL', bars: [{ label: 'Career', value: 42 }, { label: 'Paisa', value: 36 }, { label: 'Pehchaan', value: 48 }, { label: 'Rishte', value: 40 }] },
      after: { name: 'RAAHUL', bars: [{ label: 'Career', value: 86 }, { label: 'Paisa', value: 79 }, { label: 'Pehchaan', value: 92 }, { label: 'Rishte', value: 83 }] },
    },
    whyHeadline: 'Naam itna important kyun?',
    why: [
      'Din me 50-100 baar aapka naam bola/likha jaata hai — har baar ek vibration banti hai',
      'Bade business aur celebrities apne naam ki spelling soch-samajh ke rakhte hain',
      'Galat naam-number mehnat aur result ke beech "gap" paida karta hai',
    ],
    testimonials: [
      { name: 'Priya S.', city: 'Pune', text: 'Spelling change ki, 3 mahine me job promotion mila. Coincidence ho ya nahi, confidence badh gaya.', stars: 5 },
      { name: 'Amit K.', city: 'Delhi', text: 'Business card pe naya naam, clients ka response hi badal gaya. Worth it.', stars: 5 },
      { name: 'Sneha R.', city: 'Mumbai', text: 'Report bahut detailed thi, har cheez explain ki. Recommend karungi.', stars: 4 },
    ],
    faqs: [
      { q: 'Kya mujhe legally naam badalna padega?', a: 'Nahi. Aap sirf spelling/signature me chhota change kar sakte ho — daily use, social media, business card par. Legal change optional hai.' },
      { q: 'Report kab milegi?', a: 'Payment ke baad turant free snapshot, aur full personalised PDF 24 ghante ke andar WhatsApp/email par.' },
      { q: 'Kya ye sach me kaam karta hai?', a: 'Numerology ek belief-based ancient science hai. Hum accurate calculation aur clear guidance dete hain; result aapke action + faith par depend karta hai.' },
    ],
    finalCta: 'Aaj hi apne naam ki energy theek karo',
  },

  // ---------------- MOBILE NUMEROLOGY ----------------
  {
    key: 'mobile_numerology', slug: 'mobile-numerology-report', badge: 'Popular', emoji: '📱',
    title: 'Mobile Number Numerology — Kya Aapka Number Lucky Hai?',
    subtitle: 'Aapka phone number din-raat aapke saath hai. Galat number chupke-chupke aapki luck, paisa aur peace drain kar sakta hai.',
    price: 199, originalPrice: 599, rating: 4.8, reviews: 9650, deliveryHrs: 24,
    imgFolder: 'mobile-numerology', bannerImg: 'banner.jpg', previewImgs: ['preview-1.jpg','preview-2.jpg','preview-3.jpg'], proofImgs: ['proof-1.jpg','proof-2.jpg','proof-3.jpg'], videoId: '',
    painHeadline: 'Mobile number aur aapki life',
    pains: [
      'Number badalne ke baad se cheezein theek nahi lag rahi',
      'Paisa aata hai par tikta nahi',
      'Important calls/opportunities miss ho jaati hain',
      'Mann hi mann lagta hai "ye number suit nahi kar raha"',
    ],
    promiseHeadline: 'Aapka number aapko support kare ya block — pata karo',
    promise: 'Har mobile number ka ek total aur root vibration hota hai. Jab wo aapke Mulank ke saath friendly hota hai, communication, money flow aur opportunities smooth chalti hain. Hum aapke number ko analyse karke batate hain — supportive hai ya nahi, aur best alternative bhi.',
    steps: [
      { title: 'Number + DOB do', desc: 'Apna mobile number aur birth date' },
      { title: 'Vibration check', desc: 'Number ka root aur aapse compatibility' },
      { title: 'Verdict + suggestion', desc: 'Lucky hai ya nahi + behtar number ki range' },
    ],
    deliverables: [
      'Aapke number ka pura vibration analysis',
      'Supportive / neutral / draining verdict',
      'Lucky aur unlucky digits aapke liye',
      'Best number combination suggestion',
      'Money & career par asar',
      'Lifetime valid PDF',
    ],
    beforeAfter: {
      headline: 'Number compatibility (sample)',
      before: { name: 'Purana No.', bars: [{ label: 'Money', value: 38 }, { label: 'Career', value: 44 }, { label: 'Peace', value: 35 }, { label: 'Luck', value: 41 }] },
      after: { name: 'Lucky No.', bars: [{ label: 'Money', value: 82 }, { label: 'Career', value: 88 }, { label: 'Peace', value: 80 }, { label: 'Luck', value: 90 }] },
    },
    whyHeadline: 'Phone number itna matter kyun karta hai?',
    why: [
      'Aapka number sabse zyada repeat hone wala number hai — daily exposure',
      'Har OTP, payment, call us number ki vibration se hota hai',
      'Successful log apna number numerology se choose karte hain',
    ],
    testimonials: [
      { name: 'Rohit M.', city: 'Jaipur', text: 'Number change kiya jaisा bataya, business calls 2x ho gayi. Mast report.', stars: 5 },
      { name: 'Kavita P.', city: 'Indore', text: 'Sirf 199 me itni clarity, paisa vasool.', stars: 5 },
      { name: 'Sahil T.', city: 'Lucknow', text: 'Verdict ekdam clear tha, ab naya number le liya.', stars: 4 },
    ],
    faqs: [
      { q: 'Number badalna zaroori hai?', a: 'Nahi. Hum verdict aur suggestion dete hain; decision aapka. Bahut log secondary/business number lucky rakhte hain.' },
      { q: 'WhatsApp number bhi check hota hai?', a: 'Haan, koi bhi mobile number — primary, business ya WhatsApp.' },
      { q: 'Delivery time?', a: 'Free snapshot turant, full PDF 24 ghante me.' },
    ],
    finalCta: 'Sirf ₹199 me apna number check karo',
  },

  // ---------------- VEHICLE NUMEROLOGY ----------------
  {
    key: 'vehicle_numerology', slug: 'vehicle-numerology-report', badge: '', emoji: '🚗',
    title: 'Vehicle Number Report — Lucky & Safe Number Choose Karo',
    subtitle: 'Nayi gaadi le rahe ho? Galat number safety aur luck dono affect karta hai. Sahi number drive ko shubh banata hai.',
    price: 249, originalPrice: 599, rating: 4.8, reviews: 6320, deliveryHrs: 24,
    imgFolder: 'vehicle-numerology', bannerImg: 'banner.jpg', previewImgs: ['preview-1.jpg','preview-2.jpg','preview-3.jpg'], proofImgs: ['proof-1.jpg','proof-2.jpg','proof-3.jpg'], videoId: '',
    painHeadline: 'Gaadi ka number sirf number nahi',
    pains: [
      'Nayi gaadi ke baad se chhoti-moti dikkatein',
      'Bar-bar service/repair ya bad luck feel',
      'Naya number choose karna hai par confusion',
      'Safety ki tension — number shubh hai ya nahi',
    ],
    promiseHeadline: 'Aisा number jo aapko protect aur prosper kare',
    promise: 'Vehicle plate ka total ek vibration deta hai jo aapki energy se interact karta hai. Hum plate ko analyse karke safety, luck aur harmony score dete hain — aur aapke Mulank ke liye best number range bhi.',
    steps: [
      { title: 'Plate + DOB do', desc: 'Current/proposed number aur birth date' },
      { title: 'Vibration analysis', desc: 'Safety, luck, harmony scoring' },
      { title: 'Best number', desc: 'Aapke liye shubh number range + remedies' },
    ],
    deliverables: [
      'Plate number ka safety/luck/harmony score',
      'Aapke Mulank se compatibility',
      'Accident-prone digits ki warning',
      'Lucky vehicle number range',
      'Remedies agar number change na ho sake',
      'Lifetime valid PDF',
    ],
    beforeAfter: {
      headline: 'Vehicle number score (sample)',
      before: { name: 'Random No.', bars: [{ label: 'Safety', value: 45 }, { label: 'Luck', value: 40 }, { label: 'Harmony', value: 38 }, { label: 'Smooth', value: 42 }] },
      after: { name: 'Lucky No.', bars: [{ label: 'Safety', value: 88 }, { label: 'Luck', value: 84 }, { label: 'Harmony', value: 86 }, { label: 'Smooth', value: 90 }] },
    },
    whyHeadline: 'Vehicle number ka asar',
    why: [
      'Gaadi me roz time bitate ho — vibration ka daily exposure',
      'Safe + lucky number drive me confidence deta hai',
      'Choosing a number is one-time — lifetime ka asar',
    ],
    testimonials: [
      { name: 'Manish G.', city: 'Surat', text: 'Nayi car ka number isi report se choose kiya. Mann ko shanti.', stars: 5 },
      { name: 'Deepa N.', city: 'Bhopal', text: 'Safety score dekhke number change karwaya. Achhi guidance.', stars: 4 },
      { name: 'Vikram S.', city: 'Nagpur', text: 'Bike ke liye liya tha, clear analysis mila.', stars: 5 },
    ],
    faqs: [
      { q: 'RTO se number choose kar sakte hain?', a: 'Haan, kai RTO me VIP/choice number milta hai. Hamari report best range bata deti hai.' },
      { q: 'Purani gaadi ka kya?', a: 'Remedies dete hain jisse existing number ka asar balance ho.' },
      { q: 'Car aur bike dono?', a: 'Haan, dono ke liye applicable.' },
    ],
    finalCta: 'Apni gaadi ka lucky number pao',
  },

  // ---------------- CAREER NUMEROLOGY ----------------
  {
    key: 'career_numerology', slug: 'career-numerology-report', badge: 'New', emoji: '💼',
    title: 'Career & Job Prediction — Apne Numbers Wala Sahi Rasta',
    subtitle: 'Confused ho job vs business? Kaunsा field? Aapke numbers me aapke liye bana hua career path chhupa hai.',
    price: 499, originalPrice: 1499, rating: 4.9, reviews: 7890, deliveryHrs: 24,
    imgFolder: 'career-numerology', bannerImg: 'banner.jpg', previewImgs: ['preview-1.jpg','preview-2.jpg','preview-3.jpg'], proofImgs: ['proof-1.jpg','proof-2.jpg','proof-3.jpg'], videoId: '',
    painHeadline: 'Career ko lekar ye sawaal?',
    pains: [
      'Job karu ya business — decide nahi ho pa raha',
      'Field galat to nahi chun liya, ye doubt',
      'Mehnat to hai par growth slow',
      'Switch karu ya rukoon — confusion',
    ],
    promiseHeadline: 'Aapke numbers jo career ke liye bane the',
    promise: 'Aapka Bhagyank aur Mulank batate hain kis tarah ka kaam aapko natural success dega. Hum aapke liye best-fit careers, job vs business clarity, aur lucky timing — sab ek report me dete hain.',
    steps: [
      { title: 'Naam + DOB do', desc: 'Basic details, 30 second' },
      { title: 'Career mapping', desc: 'Numbers se best-fit fields nikaalte hain' },
      { title: 'Clear roadmap', desc: 'Top careers + timing + strengths PDF me' },
    ],
    deliverables: [
      'Aapke liye top 5 best-fit careers',
      'Job vs business — clear verdict',
      'Lucky career timing (kab move karein)',
      'Strength & weakness map',
      'Industry/role suggestions',
      'Lifetime valid PDF',
    ],
    beforeAfter: {
      headline: 'Career clarity (sample)',
      before: { name: 'Confused', bars: [{ label: 'Clarity', value: 35 }, { label: 'Growth', value: 40 }, { label: 'Income', value: 44 }, { label: 'Satisfaction', value: 38 }] },
      after: { name: 'Aligned', bars: [{ label: 'Clarity', value: 90 }, { label: 'Growth', value: 85 }, { label: 'Income', value: 82 }, { label: 'Satisfaction', value: 88 }] },
    },
    whyHeadline: 'Career numerology kyun?',
    why: [
      'Galat field me mehnat double, result half',
      'Numbers aapki natural strengths reveal karte hain',
      'Sahi timing par move = bada difference',
    ],
    testimonials: [
      { name: 'Arjun V.', city: 'Hyderabad', text: 'Report ne business ki taraf push kiya, ab apna kaam kar raha hoon.', stars: 5 },
      { name: 'Neha J.', city: 'Chandigarh', text: 'Field switch karne ka confidence mila. Clear analysis.', stars: 5 },
      { name: 'Sameer A.', city: 'Kanpur', text: 'Timing wali baat sach nikli, promotion mila.', stars: 4 },
    ],
    faqs: [
      { q: 'Already job me hoon, faayda?', a: 'Haan — growth timing, switch ya stay, aur strength-based roles ki clarity milti hai.' },
      { q: 'Students ke liye?', a: 'Bilkul — stream/field choose karne me madad.' },
      { q: 'Kitni detailed report?', a: 'Top careers + verdict + timing + strengths — multi-section PDF.' },
    ],
    finalCta: 'Apna sahi career rasta jaano',
  },

  // ---------------- BABY NAME ----------------
  {
    key: 'baby_name', slug: 'baby-name-report', badge: '', emoji: '👶',
    title: 'Lucky Baby Name Report — Bachche Ko Shubh Naam Do',
    subtitle: 'Naam bachche ke saath zindagi bhar rehta hai. Numerology-aligned naam usko lifelong luck aur confidence deta hai.',
    price: 399, originalPrice: 999, rating: 4.9, reviews: 8430, deliveryHrs: 24,
    imgFolder: 'baby-name', bannerImg: 'banner.jpg', previewImgs: ['preview-1.jpg','preview-2.jpg','preview-3.jpg'], proofImgs: ['proof-1.jpg','proof-2.jpg','proof-3.jpg'], videoId: '',
    painHeadline: 'Naam choose karna aasaan nahi',
    pains: [
      'Family ke 10 log, 10 alag naam suggest karte hain',
      'Sundar naam to hai par "lucky" hai ya nahi pata nahi',
      'Rashi/nakshatra match ki tension',
      'Ek galat decision lifetime ka',
    ],
    promiseHeadline: 'Aisा naam jo lifelong luck carry kare',
    promise: 'Hum bachche ki birth details ke according numerology-aligned naam suggest karte hain — har naam ka number score, lucky alignment aur shubh naamkaran timing ke saath. Aap confidently best naam choose kar paoge.',
    steps: [
      { title: 'Birth details do', desc: 'DOB/time + pasand ka starting letter (optional)' },
      { title: 'Name matching', desc: 'Numerology + lucky alignment se naam chunte hain' },
      { title: 'Naam list milti hai', desc: '10+ options score ke saath, PDF me' },
    ],
    deliverables: [
      '10+ auspicious naam options',
      'Har naam ka numerology score',
      'Meaning + lucky alignment',
      'Shubh naamkaran date suggestion',
      'Lucky letter & number for baby',
      'Lifetime valid PDF',
    ],
    beforeAfter: {
      headline: 'Naam alignment (sample)',
      before: { name: 'Random', bars: [{ label: 'Luck', value: 45 }, { label: 'Health', value: 48 }, { label: 'Confidence', value: 42 }, { label: 'Success', value: 40 }] },
      after: { name: 'Aligned', bars: [{ label: 'Luck', value: 88 }, { label: 'Health', value: 85 }, { label: 'Confidence', value: 90 }, { label: 'Success', value: 86 }] },
    },
    whyHeadline: 'Baby naam numerology kyun?',
    why: [
      'Naam bachche ki pehli aur lifelong identity hai',
      'Aligned naam confidence aur luck ko support karta hai',
      'Ek baar sahi choose karo, zindagi bhar faayda',
    ],
    testimonials: [
      { name: 'Anjali & Rohan', city: 'Ahmedabad', text: 'Beti ka naam isi se choose kiya, poori family khush.', stars: 5 },
      { name: 'Meera K.', city: 'Patna', text: '10 naam options the, har ek ka score. Bahut helpful.', stars: 5 },
      { name: 'Suresh P.', city: 'Raipur', text: 'Naamkaran date bhi mili, ekdum complete.', stars: 4 },
    ],
    faqs: [
      { q: 'Bachcha abhi paida nahi hua?', a: 'Expected date se bhi suggestions de sakte hain, birth ke baad finalize.' },
      { q: 'Pasand ka letter de sakte hain?', a: 'Haan, starting letter ya sound bata sakte ho, hum usi me se lucky naam denge.' },
      { q: 'Rashi ke according?', a: 'Numerology + lucky alignment dono consider karte hain.' },
    ],
    finalCta: 'Apne bachche ko shubh naam dijiye',
  },

  // ---------------- COMPATIBILITY ----------------
  {
    key: 'compatibility_report', slug: 'compatibility-report', badge: 'Couples', emoji: '❤️',
    title: 'Love & Marriage Compatibility — Numbers Sach Bolte Hain',
    subtitle: 'Shaadi se pehle ya rishte me — numbers batate hain aap dono kitne compatible ho, aur kahaan dhyaan dena hai.',
    price: 449, originalPrice: 999, rating: 4.9, reviews: 10240, deliveryHrs: 24,
    imgFolder: 'compatibility', bannerImg: 'banner.jpg', previewImgs: ['preview-1.jpg','preview-2.jpg','preview-3.jpg'], proofImgs: ['proof-1.jpg','proof-2.jpg','proof-3.jpg'], videoId: '',
    painHeadline: 'Rishte me ye sawaal?',
    pains: [
      'Ye rishta sahi hai ya nahi — confusion',
      'Choti baat pe ladai, samajh nahi aata kyun',
      'Shaadi ka decision, par dil me doubt',
      'Future saath ka — clarity chahiye',
    ],
    promiseHeadline: 'Commit karne se pehle sach jaano',
    promise: 'Dono ke birth numbers ka deep comparison — emotional, financial aur life-goal compatibility. Hum strength areas, risk areas aur harmony ke remedies batate hain taaki aap clear decision le sako.',
    steps: [
      { title: 'Dono ke details do', desc: 'Dono ke naam + DOB' },
      { title: 'Match analysis', desc: 'Emotional, money, goals — full compatibility' },
      { title: 'Clear report', desc: 'Match % + strengths + remedies PDF me' },
    ],
    deliverables: [
      'Overall compatibility match %',
      'Emotional, financial & goal alignment',
      'Strength areas (kya strong hai)',
      'Risk areas (kahaan dhyaan dena)',
      'Marriage timing guidance',
      'Harmony ke liye remedies',
    ],
    beforeAfter: {
      headline: 'Compatibility breakdown (sample)',
      before: { name: 'Doubt', bars: [{ label: 'Emotional', value: 50 }, { label: 'Money', value: 45 }, { label: 'Goals', value: 48 }, { label: 'Harmony', value: 44 }] },
      after: { name: 'Clarity', bars: [{ label: 'Emotional', value: 85 }, { label: 'Money', value: 80 }, { label: 'Goals', value: 88 }, { label: 'Harmony', value: 82 }] },
    },
    whyHeadline: 'Compatibility numerology kyun?',
    why: [
      'Numbers emotional patterns reveal karte hain',
      'Pehle se risk pata ho to relationship sambhalna easy',
      'Bada decision — data + clarity ke saath lo',
    ],
    testimonials: [
      { name: 'Riya & Karan', city: 'Gurgaon', text: 'Shaadi se pehle liya, risk areas pe kaam kiya. Helpful tha.', stars: 5 },
      { name: 'Pooja M.', city: 'Nashik', text: 'Match report ne bahut clarity di. Recommend.', stars: 5 },
      { name: 'Aakash D.', city: 'Vadodara', text: 'Remedies wali baat acchi lagi.', stars: 4 },
    ],
    faqs: [
      { q: 'Dono ki details chahiye?', a: 'Haan — dono ke naam aur DOB se accurate compatibility nikalti hai.' },
      { q: 'Already married ho to?', a: 'Bilkul — harmony improve karne ke liye strength/risk + remedies useful hain.' },
      { q: 'Confidential hai?', a: 'Haan, aapki details private rehti hain.' },
    ],
    finalCta: 'Apni compatibility abhi jaano',
  },
  // ---------------- BUSINESS ----------------
  {
    key: 'business_numerology', slug: 'business-numerology-report', badge: '', emoji: '🏢',
    imgFolder: 'business', bannerImg: 'banner.jpg', previewImgs: ['preview-1.jpg','preview-2.jpg','preview-3.jpg'], proofImgs: ['proof-1.jpg','proof-2.jpg','proof-3.jpg'], videoId: '',
    title: 'Business Numerology Report — Naam, Timing, Growth',
    subtitle: 'Business naam, start date aur aapke numbers — sab milke success ya struggle decide karte hain. Sahi alignment se growth tezi se aata hai.',
    price: 499, originalPrice: 1499, rating: 4.9, reviews: 5120, deliveryHrs: 24,
    painHeadline: 'Business mein ye dikkat?',
    pains: ['Mehnat poori par profit slow', 'Business naam lucky hai ya nahi pata nahi', 'Partnership/expansion ka decision', 'Sab sahi lagta hai phir bhi growth atki'],
    promiseHeadline: 'Aapke business ko numbers ka boost',
    promise: 'Hum aapke business naam ki vibration, aapke core numbers aur best-fit direction analyse karke batate hain — naam shubh hai ya nahi, growth ke lucky factors, aur timing.',
    steps: [
      { title: 'Business + apni details', desc: 'Business naam + aapka naam/DOB' },
      { title: 'Numerology analysis', desc: 'Naam vibration + aapse compatibility' },
      { title: 'Growth report', desc: 'Lucky factors + suggestions PDF me' },
    ],
    deliverables: ['Business naam ka numerology analysis', 'Aapke numbers se compatibility', 'Best-fit business areas', 'Lucky factors (number/colour/day)', 'Naam tuning suggestion (agar zaroori)', 'Lifetime valid PDF'],
    beforeAfter: { headline: 'Business alignment (sample)', before: { name: 'Misaligned', bars: [{ label: 'Growth', value: 40 }, { label: 'Profit', value: 38 }, { label: 'Brand', value: 44 }, { label: 'Stability', value: 42 }] }, after: { name: 'Aligned', bars: [{ label: 'Growth', value: 88 }, { label: 'Profit', value: 82 }, { label: 'Brand', value: 90 }, { label: 'Stability', value: 85 }] } },
    whyHeadline: 'Business numerology kyun?',
    why: ['Bade brands apna naam soch-samajh ke rakhte hain', 'Naam vibration daily customers tak jaati hai', 'Sahi timing + naam = smooth growth'],
    testimonials: [
      { name: 'Rajesh T.', city: 'Surat', text: 'Business naam thoda tune kiya, naye clients aane lage.', stars: 5 },
      { name: 'Pooja S.', city: 'Indore', text: 'Report ne clarity di kis direction me jaana hai.', stars: 5 },
      { name: 'Imran K.', city: 'Hyderabad', text: 'Partnership decision me madad mili.', stars: 4 },
    ],
    faqs: [
      { q: 'Naya business shuru kar raha hoon?', a: 'Perfect time — naam aur launch timing dono shubh choose kar sakte ho.' },
      { q: 'Purana business hai?', a: 'Naam tuning + lucky factors se existing business ko boost de sakte hain.' },
      { q: 'Logo/brand bhi?', a: 'Report me naam + numbers focus hai; lucky colours brand ke liye bhi useful.' },
    ],
    finalCta: 'Apne business ko numbers se aage badhao',
  },

  // ---------------- PROPERTY ----------------
  {
    key: 'property_numerology', slug: 'property-numerology-report', badge: '', emoji: '🏠',
    imgFolder: 'property', bannerImg: 'banner.jpg', previewImgs: ['preview-1.jpg','preview-2.jpg','preview-3.jpg'], proofImgs: ['proof-1.jpg','proof-2.jpg','proof-3.jpg'], videoId: '',
    title: 'Property & House Number Report — Shubh Ghar Choose Karo',
    subtitle: 'Ghar ya plot ka number aapki energy se match karta hai ya nahi — peace, paisa aur health par seedha asar.',
    price: 299, originalPrice: 799, rating: 4.8, reviews: 4380, deliveryHrs: 24,
    painHeadline: 'Ghar/property ko lekar?',
    pains: ['Naya ghar/flat le rahe ho, number shubh hai?', 'Shifting ke baad se cheezein theek nahi', 'Plot/property me invest karna hai', 'Vastu to dekha, number nahi'],
    promiseHeadline: 'Aisा ghar jo aapko suit kare',
    promise: 'Hum property/house number ko aapke core numbers ke saath analyse karke batate hain — harmonious hai ya nahi, aur agar number na badle to remedies.',
    steps: [
      { title: 'Property + details', desc: 'House/plot number + apna naam/DOB' },
      { title: 'Suitability check', desc: 'Number vibration + aapse match' },
      { title: 'Report + remedies', desc: 'Verdict + lucky tips PDF me' },
    ],
    deliverables: ['Property number ka analysis', 'Aapse compatibility verdict', 'Lucky direction & colours', 'Remedies (agar number na badle)', 'Griha-pravesh shubh timing', 'Lifetime valid PDF'],
    beforeAfter: { headline: 'Property suitability (sample)', before: { name: 'Random', bars: [{ label: 'Peace', value: 42 }, { label: 'Money', value: 40 }, { label: 'Health', value: 45 }, { label: 'Harmony', value: 38 }] }, after: { name: 'Suitable', bars: [{ label: 'Peace', value: 88 }, { label: 'Money', value: 84 }, { label: 'Health', value: 86 }, { label: 'Harmony', value: 90 }] } },
    whyHeadline: 'Property number kyun matter karta hai?',
    why: ['Ghar me sabse zyada time bitate ho — daily energy', 'Number vibration parivaar ki harmony affect karti hai', 'Ek baar sahi choose karo, lifetime ka faayda'],
    testimonials: [
      { name: 'Sunita M.', city: 'Pune', text: 'Naye flat ka number check karwaya, mann shaant.', stars: 5 },
      { name: 'Harish P.', city: 'Jaipur', text: 'Remedies wali baat acchi lagi, helpful.', stars: 4 },
      { name: 'Anita R.', city: 'Bhopal', text: 'Plot lene se pehle clarity mili.', stars: 5 },
    ],
    faqs: [
      { q: 'Flat number ya building?', a: 'Dono dekh sakte hain — jo number daily use hota hai (flat) sabse zyada matter karta hai.' },
      { q: 'Number badal nahi sakta?', a: 'Remedies dete hain jo energy balance karte hain.' },
      { q: 'Rented ghar?', a: 'Haan, rented par bhi applicable.' },
    ],
    finalCta: 'Apne ghar ka shubh number jaano',
  },

  // ---------------- MARRIAGE ----------------
  {
    key: 'marriage_report', slug: 'marriage-report', badge: 'Couples', emoji: '💍',
    imgFolder: 'marriage', bannerImg: 'banner.jpg', previewImgs: ['preview-1.jpg','preview-2.jpg','preview-3.jpg'], proofImgs: ['proof-1.jpg','proof-2.jpg','proof-3.jpg'], videoId: '',
    title: 'Marriage Timing & Matching Report — Sahi Waqt, Sahi Saathi',
    subtitle: 'Shaadi kab, kaisे saathi ke saath, aur compatibility kitni — aapke numbers saaf jawab dete hain.',
    price: 449, originalPrice: 999, rating: 4.9, reviews: 7640, deliveryHrs: 24,
    painHeadline: 'Shaadi ko lekar sawaal?',
    pains: ['Shaadi kab hogi — timing ki tension', 'Rishta sahi hai ya nahi', 'Family pressure, par clarity nahi', 'Compatibility ka doubt'],
    promiseHeadline: 'Shaadi ka sahi waqt aur saathi',
    promise: 'Hum aapke numbers se marriage timing, ideal partner traits aur (partner details ho to) compatibility match batate hain — taaki aap confident decision lo.',
    steps: [
      { title: 'Apni details do', desc: 'Naam + DOB (partner ka bhi ho to behtar)' },
      { title: 'Timing + match', desc: 'Marriage window + compatibility' },
      { title: 'Clear report', desc: 'Timing + strengths + remedies PDF me' },
    ],
    deliverables: ['Marriage timing window', 'Ideal partner traits', 'Compatibility (partner details ke saath)', 'Strengths & areas to work on', 'Harmony ke remedies', 'Lifetime valid PDF'],
    beforeAfter: { headline: 'Marriage clarity (sample)', before: { name: 'Confused', bars: [{ label: 'Timing', value: 40 }, { label: 'Match', value: 45 }, { label: 'Harmony', value: 42 }, { label: 'Confidence', value: 38 }] }, after: { name: 'Clear', bars: [{ label: 'Timing', value: 88 }, { label: 'Match', value: 85 }, { label: 'Harmony', value: 84 }, { label: 'Confidence', value: 90 }] } },
    whyHeadline: 'Marriage numerology kyun?',
    why: ['Sahi timing par decision = smoother life', 'Numbers compatibility patterns reveal karte hain', 'Bada decision data + clarity ke saath lo'],
    testimonials: [
      { name: 'Neha & Vikas', city: 'Lucknow', text: 'Timing wali guidance sach nikli, shaadi tay hui.', stars: 5 },
      { name: 'Ritu S.', city: 'Patna', text: 'Compatibility report ne bahut clarity di.', stars: 5 },
      { name: 'Mohit D.', city: 'Nagpur', text: 'Remedies follow kiye, rishte me improvement.', stars: 4 },
    ],
    faqs: [
      { q: 'Partner ki details nahi hain?', a: 'Tab bhi marriage timing + ideal partner traits milte hain; partner details ho to full match.' },
      { q: 'Already engaged ho?', a: 'Compatibility + harmony remedies useful rahenge.' },
      { q: 'Confidential?', a: 'Haan, details private rehti hain.' },
    ],
    finalCta: 'Apni shaadi ka sahi waqt jaano',
  },
];

export const getReport = (slug: string) => REPORTS.find((r) => r.slug === slug);

// ---------------- 3-LANGUAGE OVERLAY ----------------
// Base content (REPORTS above) = Hinglish. Yahan en + hi translations.
// Helper rt() language ke hisaab se sahi text deta hai (fallback = base/hinglish).
type Tr = { title: string; subtitle: string; badge?: string };
export const REPORT_I18N: Record<string, { en: Tr; hi: Tr }> = {
  name_correction: {
    en: { title: 'Name Correction Report — Fix Your Name, Change Your Luck', subtitle: 'A tiny spelling tweak can shift your name vibration. Discover the luckiest spelling of your name.', badge: 'Bestseller' },
    hi: { title: 'नेम करेक्शन रिपोर्ट — नाम सुधारें, किस्मत बदलें', subtitle: 'नाम की छोटी सी स्पेलिंग बदलने से वाइब्रेशन बदल जाती है। अपने नाम की सबसे शुभ स्पेलिंग जानें।', badge: 'बेस्टसेलर' },
  },
  mobile_numerology: {
    en: { title: 'Mobile Number Numerology — Is Your Number Lucky?', subtitle: 'Your mobile number vibrates with you all day. Check if it supports money, luck and growth.', badge: 'Popular' },
    hi: { title: 'मोबाइल नंबर न्यूमेरोलॉजी — क्या आपका नंबर लकी है?', subtitle: 'आपका मोबाइल नंबर दिनभर आपके साथ वाइब्रेट करता है। जानें ये पैसा, किस्मत और ग्रोथ में मदद करता है या नहीं।', badge: 'लोकप्रिय' },
  },
  vehicle_numerology: {
    en: { title: 'Vehicle Number Report — Drive Safe & Lucky', subtitle: 'Your vehicle number affects safety, luck and harmony. Find out if yours suits you.', badge: '' },
    hi: { title: 'व्हीकल नंबर रिपोर्ट — सेफ और लकी ड्राइव', subtitle: 'गाड़ी का नंबर सेफ्टी, किस्मत और तालमेल पर असर डालता है। जानें आपका नंबर आपको सूट करता है या नहीं।', badge: '' },
  },
  career_numerology: {
    en: { title: 'Career & Job Prediction — Find Your Right Path', subtitle: 'Job or business? Which field? When will growth come? Your numbers have clear answers.', badge: 'New' },
    hi: { title: 'करियर और जॉब प्रेडिक्शन — सही रास्ता चुनें', subtitle: 'जॉब या बिज़नेस? कौन सा फील्ड? ग्रोथ कब आएगी? आपके नंबरों में साफ़ जवाब हैं।', badge: 'नया' },
  },
  baby_name: {
    en: { title: 'Lucky Baby Name Report — A Blessed Start', subtitle: 'Give your child a name aligned with lucky numbers — for a bright, blessed life.', badge: '' },
    hi: { title: 'लकी बेबी नेम रिपोर्ट — शुभ शुरुआत', subtitle: 'अपने बच्चे को शुभ अंकों से मेल खाता नाम दें — एक उज्ज्वल, शुभ जीवन के लिए।', badge: '' },
  },
  compatibility_report: {
    en: { title: 'Love & Marriage Compatibility — Are You Made For Each Other?', subtitle: 'Discover your relationship strengths, challenges and how well your numbers match.', badge: 'Couples' },
    hi: { title: 'लव और मैरिज कम्पैटिबिलिटी — क्या आप एक-दूसरे के लिए बने हैं?', subtitle: 'अपने रिश्ते की ताक़त, चुनौतियाँ और नंबरों का मेल कितना है, ये जानें।', badge: 'कपल्स' },
  },
  business_numerology: {
    en: { title: 'Business Numerology Report — Name, Timing, Growth', subtitle: 'Your business name, start date and your numbers together decide success or struggle.', badge: '' },
    hi: { title: 'बिज़नेस न्यूमेरोलॉजी रिपोर्ट — नाम, समय, ग्रोथ', subtitle: 'बिज़नेस का नाम, शुरुआत की तारीख़ और आपके नंबर मिलकर सफलता या संघर्ष तय करते हैं।', badge: '' },
  },
  property_numerology: {
    en: { title: 'Property & House Number Report — Choose an Auspicious Home', subtitle: 'Does your house or plot number match your energy? It directly affects peace, money and health.', badge: '' },
    hi: { title: 'प्रॉपर्टी और हाउस नंबर रिपोर्ट — शुभ घर चुनें', subtitle: 'क्या आपके घर/प्लॉट का नंबर आपकी एनर्जी से मेल खाता है? ये शांति, पैसे और सेहत पर सीधा असर डालता है।', badge: '' },
  },
  marriage_report: {
    en: { title: 'Marriage Timing & Matching Report — Right Time, Right Partner', subtitle: 'When will marriage happen, with what kind of partner, and how strong is compatibility — your numbers answer clearly.', badge: 'Couples' },
    hi: { title: 'मैरिज टाइमिंग और मैचिंग रिपोर्ट — सही समय, सही साथी', subtitle: 'शादी कब होगी, कैसे साथी के साथ, और कम्पैटिबिलिटी कितनी — आपके नंबर साफ़ जवाब देते हैं।', badge: 'कपल्स' },
  },
};

// language: 'en' | 'hi' | anything else => hinglish (base)
export const rt = (r: ReportLandingContent, field: 'title' | 'subtitle' | 'badge', lang?: string): string => {
  if (lang === 'en' || lang === 'hi') {
    const tr = REPORT_I18N[r.key]?.[lang];
    if (tr && tr[field] !== undefined && tr[field] !== '') return tr[field] as string;
    if (tr && field === 'badge') return tr.badge ?? r.badge; // allow empty badge
  }
  return (r as any)[field];
};
