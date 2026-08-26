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

  // ---------------- 10. SHANI SADE SATI & DHAIYA ----------------
  {
    key: 'shani_sade_sati', slug: 'shani-sade-sati-report', badge: 'High Demand', emoji: '🪐',
    title: 'Shani Sade Sati & Dhaiya Blueprint — Protection & Timing',
    subtitle: 'Decode your 7.5-year Saturn transit phases (Rising, Peak, Setting) and unlock classical remedies to turn delays into unstoppable discipline.',
    price: 499, originalPrice: 1499, rating: 4.9, reviews: 8420, deliveryHrs: 24,
    imgFolder: 'career-numerology', bannerImg: 'banner.jpg', previewImgs: ['preview-1.jpg','preview-2.jpg','preview-3.jpg'], proofImgs: ['proof-1.jpg','proof-2.jpg','proof-3.jpg'], videoId: '',
    painHeadline: 'Kya aap Shani ke kathin prabhav se joojh rahe hain?',
    pains: [
      'Bina kisi wajah ke kaam atakna aur unexpected financial loss',
      'Mental stress, loneliness aur health challenges',
      'Career promotions aur decisions me continuous delays',
      'Relationships aur family me misunderstandings'
    ],
    promiseHeadline: 'Shani ke prabhav ko safalta aur sthirta me badlo',
    promise: 'Shani dev Dandadhikari hain jo discipline aur purva karma ka phal dete hain. Sade Sati ka har charan (Phase 1, 2, 3) alag fal deta hai. Sahi Vedic upaay, mantra, aur daan se Shani ki kripa prapt hoti hai.',
    steps: [
      { title: 'Date, Time & Place do', desc: 'Exact birth details for planetary coordinates' },
      { title: 'Transit timing calculation', desc: 'Saturn exact degree and Moon sign distance' },
      { title: 'Remedial roadmap', desc: 'Lal Kitab, Vedic Mantras, and Shani Shanti rituals' }
    ],
    deliverables: [
      'Sade Sati Active Phase & Exact Duration Dates',
      'Kantaka Shani & Ashtama Shani Analysis',
      'Specific Effects on Career, Health & Finances',
      'Auspicious Shani Beej Mantra & Yantra Guidance',
      'Gemstone Recommendation (Neelam / Amethyst vs Iron Ring)',
      'Lifetime downloadable PDF report'
    ],
    beforeAfter: {
      headline: 'Shani Upay ke baad parinaam',
      before: { name: 'Before Remedies', bars: [{ label: 'Mental Peace', value: 30 }, { label: 'Career Growth', value: 35 }, { label: 'Health', value: 40 }, { label: 'Stability', value: 25 }] },
      after: { name: 'After Remedies', bars: [{ label: 'Mental Peace', value: 85 }, { label: 'Career Growth', value: 90 }, { label: 'Health', value: 80 }, { label: 'Stability', value: 88 }] }
    },
    whyHeadline: 'Sade Sati Report kyun zaroori hai?',
    why: [
      'Shani ka 7.5 saal ka transit har insaan ki life ka turning point hota hai',
      'Wrong remedies can increase problems, exact guidance brings massive rise',
      'Know exact start and end dates of peak trials'
    ],
    testimonials: [
      { name: 'Rajesh V.', city: 'Indore', text: 'Peak phase chal raha tha, remedies follow karne ke baad court case me relief mila.', stars: 5 },
      { name: 'Meera S.', city: 'Jaipur', text: 'Very detailed explanation of all 3 phases. Highly recommended.', stars: 5 }
    ],
    faqs: [
      { q: 'Kya Sade Sati sabke liye buri hoti hai?', a: 'Nahi! Taurus, Libra, Capricorn, aur Aquarius lagna ke liye Shani Rajayoga karak ho sakte hain.' }
    ],
    finalCta: 'Shani Sade Sati ka purna vishleshan prapt karein'
  },

  // ---------------- 11. PITRA DOSH & ANCESTRAL KARMA ----------------
  {
    key: 'pitra_dosh_karmic', slug: 'pitra-dosh-karmic-report', badge: 'Karmic Relief', emoji: '🏛️',
    title: 'Pitra Dosh & Ancestral Karma Blueprint — Divine Blessing',
    subtitle: 'Identify 9th house afflictions, Sun-Rahu grahan yogas, and unlock ancestral blessings for uninterrupted family and career prosperity.',
    price: 499, originalPrice: 1499, rating: 5.0, reviews: 6310, deliveryHrs: 24,
    imgFolder: 'business', bannerImg: 'banner.jpg', previewImgs: ['preview-1.jpg','preview-2.jpg','preview-3.jpg'], proofImgs: ['proof-1.jpg','proof-2.jpg','proof-3.jpg'], videoId: '',
    painHeadline: 'Anjaane me Pitra Rin ka shikar toh nahi?',
    pains: [
      'Ghar me barkat na hona aur bar-bar dhan ki kami',
      'Santaan prapti me badha ya parivar me ashanti',
      'Mehnat ke bawajood saphalta na milna',
      'Sapno me purvaj dikhai dena'
    ],
    promiseHeadline: 'Purvajo ka aashirwaad prapt karein',
    promise: 'Pitra Dosh tab banta hai jab 9th house ya Surya par Rahu/Ketu/Shani ka prabhav ho. Saral Vedic tarpan, daan aur shradh kriya se purvajo ki aatma tript hokar shubh aashirwad deti hai.',
    steps: [
      { title: 'Birth details submit karein', desc: '9th House and Sun affliction analysis' },
      { title: 'Karmic debt evaluation', desc: 'Pitra Rin vs Matru Rin vs Dev Rin' },
      { title: 'Remedial action plan', desc: 'Specific Peepal Puja, Daan and Mantra Vidhi' }
    ],
    deliverables: [
      'Pitra Dosh Severity Score (Mild / Moderate / Severe)',
      'Specific Karmic Lineage Analysis',
      'Step-by-step Home Puja & Daan Schedule',
      'Auspicious Amavasya & Pitru Paksha Rituals',
      'Free consultation with Vedic Pandit guidance'
    ],
    beforeAfter: {
      headline: 'Pitra Shanti ke baad prabhav',
      before: { name: 'Before Shanti', bars: [{ label: 'Family Harmony', value: 35 }, { label: 'Prosperity', value: 30 }, { label: 'Peace', value: 40 }] },
      after: { name: 'After Shanti', bars: [{ label: 'Family Harmony', value: 92 }, { label: 'Prosperity', value: 88 }, { label: 'Peace', value: 95 }] }
    },
    whyHeadline: 'Pitra Dosh Nivaaran kyun avashyak hai?',
    why: [
      'Ancestral blessings are required for generation-wide wealth and health',
      'Clears hidden invisible roadblocks that no normal effort can fix'
    ],
    testimonials: [
      { name: 'Gaurav M.', city: 'Varanasi', text: 'Bohot saalo se financial blockages the. Report ki vidhi se shanti karwayi, 2 mahine me result dikha.', stars: 5 }
    ],
    faqs: [
      { q: 'Kya har amavasya par daan karna hoga?', a: 'Report me aapke horoscope ke anusaar specific daan dates aur dravya bataye jaate hain.' }
    ],
    finalCta: 'Apne horoscope me Pitra Dosh check karein'
  },

  // ---------------- 12. DHANA YOGAS & LAXMI PRAPTI ----------------
  {
    key: 'wealth_yogas_kundli', slug: 'wealth-yogas-kundli-report', badge: 'High Wealth', emoji: '💰',
    title: 'Dhana Yogas & Laxmi Prapti Blueprint — Financial Power',
    subtitle: 'Pinpoint the wealth-producing combinations (2nd, 5th, 9th, 11th Bhavas), Gajakesari Yoga, and auspicious money cycles in your Kundli.',
    price: 499, originalPrice: 1999, rating: 4.9, reviews: 11200, deliveryHrs: 24,
    imgFolder: 'business', bannerImg: 'banner.jpg', previewImgs: ['preview-1.jpg','preview-2.jpg','preview-3.jpg'], proofImgs: ['proof-1.jpg','proof-2.jpg','proof-3.jpg'], videoId: '',
    painHeadline: 'Paisa aata hai par tikta nahi?',
    pains: [
      'Income limited rehna aur savings na ban pana',
      'Investment me unexpected loss',
      'Loan aur debts ka chakravyuh'
    ],
    promiseHeadline: 'Apni Kundli ke Dhana Yogas ko activate karein',
    promise: 'Kundli me 2nd (Dhana), 5th (Purva Punya), 9th (Bhagya) aur 11th (Labha) houses milkar Mahadhana Yoga banate hain. Unki active dasha me sahi steps lene se wealth multiply hoti hai.',
    steps: [
      { title: 'Submit birth details', desc: 'Analysis of 4 wealth houses and planetary dignities' },
      { title: 'Identify active yogas', desc: 'Gajakesari, Lakshmi, Pancha Mahapurusha, Vasumati Yogas' },
      { title: 'Wealth activation plan', desc: 'Investment sectors, lucky directions, and Kuber yantra' }
    ],
    deliverables: [
      'Comprehensive Analysis of 12 Major Wealth Yogas',
      'Best Financial Sectors (Stocks, Real Estate, Business, Gold)',
      '10-Year Wealth Dasha Cycles Timeline',
      'Energized Kuber & Mahalaxmi Mantra prescription',
      'Lifetime downloadable PDF report'
    ],
    beforeAfter: {
      headline: 'Dhana Yoga activation results',
      before: { name: 'Before Activation', bars: [{ label: 'Savings', value: 20 }, { label: 'Returns', value: 30 }, { label: 'Cash Flow', value: 40 }] },
      after: { name: 'After Activation', bars: [{ label: 'Savings', value: 85 }, { label: 'Returns', value: 88 }, { label: 'Cash Flow', value: 92 }] }
    },
    whyHeadline: 'Wealth Report kyun zaroori hai?',
    why: [
      'Know when the cosmic timing is right for big investments or business launches',
      'Prevent financial losses during challenging planetary transits'
    ],
    testimonials: [
      { name: 'Kavita D.', city: 'Surat', text: 'Followed the recommended investment timings and doubled my portfolio in 18 months.', stars: 5 }
    ],
    faqs: [
      { q: 'Is it suitable for business owners?', a: 'Yes, ideal for salaried professionals, traders, and entrepreneurs alike.' }
    ],
    finalCta: 'Apne Dhana Yogas ko unlock karein'
  },

  // ---------------- 13. MEDICAL ASTROLOGY & HEALTH ----------------
  {
    key: 'health_vitality_kundli', slug: 'health-vitality-kundli-report', badge: 'Vitality', emoji: '🌿',
    title: 'Medical Astrology & Vitality Blueprint — Ayurvedic Balance',
    subtitle: 'Evaluate 6th and 8th house indicators, 7 Chakras alignment, and Tridosha balance (Vata, Pitta, Kapha) for enduring longevity.',
    price: 399, originalPrice: 999, rating: 4.8, reviews: 4980, deliveryHrs: 24,
    imgFolder: 'career-numerology', bannerImg: 'banner.jpg', previewImgs: ['preview-1.jpg','preview-2.jpg','preview-3.jpg'], proofImgs: ['proof-1.jpg','proof-2.jpg','proof-3.jpg'], videoId: '',
    painHeadline: 'Chronic fatigue ya unexpected health issues?',
    pains: [
      'Low energy aur digestive troubles',
      'Stress-induced sleep disorders',
      'Vulnerable organ systems identification needed'
    ],
    promiseHeadline: 'Cosmic health aur Ayurvedic balance',
    promise: 'Vedic astrology connects planets with bodily doshas and organs. Knowing vulnerable houses helps in proactive lifestyle adjustments, yoga, and dietary harmony.',
    steps: [
      { title: 'Birth details submit karein', desc: '6th House Ari and 8th House Ayur analysis' },
      { title: 'Tridosha calculation', desc: 'Vata vs Pitta vs Kapha planetary dominance' },
      { title: 'Holistic wellness blueprint', desc: 'Diet, herbs, crystal therapy, and Surya Namaskar' }
    ],
    deliverables: [
      'Vulnerable Organ Systems Matrix',
      'Ayurvedic Tridosha Constitution Analysis',
      '7 Chakras Resonance & Balancing Guide',
      'Auspicious Medical Muhurat recommendations',
      'Lifetime downloadable PDF report'
    ],
    beforeAfter: {
      headline: 'Health vitality balance',
      before: { name: 'Before Balance', bars: [{ label: 'Vitality', value: 40 }, { label: 'Immunity', value: 45 }, { label: 'Sleep Quality', value: 35 }] },
      after: { name: 'After Balance', bars: [{ label: 'Vitality', value: 90 }, { label: 'Immunity', value: 85 }, { label: 'Sleep Quality', value: 92 }] }
    },
    whyHeadline: 'Health Kundli kyun janna chahiye?',
    why: [
      'Preventive cosmic health insights empower better dietary and wellness choices'
    ],
    testimonials: [
      { name: 'Dr. Manish P.', city: 'Chandigarh', text: 'Incredible accuracy on digestive vulnerabilities. The dietary tips worked wonders.', stars: 5 }
    ],
    faqs: [
      { q: 'Is this medical advice?', a: 'No, this provides astrological and spiritual wellness guidance to complement professional medical care.' }
    ],
    finalCta: 'Apna Medical Astrology Blueprint prapt karein'
  },

  // ---------------- 14. FOREIGN SETTLEMENT & TRAVEL ----------------
  {
    key: 'foreign_settlement_travel', slug: 'foreign-settlement-travel-report', badge: 'Overseas PR', emoji: '✈️',
    title: 'Foreign Settlement & PR Immigration Report — Global Destiny',
    subtitle: 'Discover 12th, 9th, and 4th house foreign travel indicators, auspicious visa timing, and overseas career settlement yogas.',
    price: 499, originalPrice: 1499, rating: 4.9, reviews: 7890, deliveryHrs: 24,
    imgFolder: 'business', bannerImg: 'banner.jpg', previewImgs: ['preview-1.jpg','preview-2.jpg','preview-3.jpg'], proofImgs: ['proof-1.jpg','proof-2.jpg','proof-3.jpg'], videoId: '',
    painHeadline: 'Visa rejection ya videsh yatra me rukawat?',
    pains: [
      'PR / Visa application stuck in processing',
      'Confused between settling abroad or staying in India',
      'Overseas job offers not materializing'
    ],
    promiseHeadline: 'Apne Videsh Yog ko pehchanein aur timing jaanein',
    promise: '12th Bhava (Foreign lands), 9th Bhava (Long travels), aur Rahu/Moon yogas videsh gaman aur PR settlement tay karte hain. Sahi dasha me apply karne se visa rejection avoid hota hai.',
    steps: [
      { title: 'Submit birth data', desc: '12th, 9th, 4th house analysis' },
      { title: 'Immigration timeline', desc: 'Active Dasha and Gochar transit support' },
      { title: 'Remedies for visa success', desc: 'Rahu & Moon propitiation for smooth travel' }
    ],
    deliverables: [
      'Foreign Settlement Probability Score (0–100%)',
      'Auspicious Visa Application Timing Windows',
      'Ideal Countries / Directions based on Astakavarga',
      'Specific Remedies to clear immigration hurdles',
      'Lifetime downloadable PDF report'
    ],
    beforeAfter: {
      headline: 'Visa & PR success outcomes',
      before: { name: 'Before Remedies', bars: [{ label: 'Visa Chances', value: 35 }, { label: 'Clarity', value: 40 }] },
      after: { name: 'After Remedies', bars: [{ label: 'Visa Chances', value: 92 }, { label: 'Clarity', value: 96 }] }
    },
    whyHeadline: 'Foreign Travel Report kyun zaroori hai?',
    why: [
      'Applying in the wrong planetary dasha leads to visa rejection and financial loss',
      'Know if permanent settlement is supported or short-term projects'
    ],
    testimonials: [
      { name: 'Simranjeet K.', city: 'Ludhiana', text: 'Canada PR was stuck for 2 years. Applied in the recommended window and got approval in 3 months!', stars: 5 }
    ],
    faqs: [
      { q: 'Does it predict specific countries?', a: 'Yes, based on directional strengths (Digbala) and zodiac element compatibility.' }
    ],
    finalCta: 'Apna Foreign Settlement Report unlock karein'
  },

  // ---------------- 15. MANGLIK DOSHA & REMEDIES ----------------
  {
    key: 'mangal_dosha_analysis', slug: 'mangal-dosha-analysis-report', badge: 'High Priority', emoji: '🔥',
    title: 'Complete Manglik Dosha & Remedies Report — Marital Peace',
    subtitle: 'Accurate evaluation of Mars placement (1st, 2nd, 4th, 7th, 8th, 12th houses), cancellation factors (Bhanga Yogas), and matching compatibility.',
    price: 399, originalPrice: 999, rating: 5.0, reviews: 10400, deliveryHrs: 24,
    imgFolder: 'marriage', bannerImg: 'banner.jpg', previewImgs: ['preview-1.jpg','preview-2.jpg','preview-3.jpg'], proofImgs: ['proof-1.jpg','proof-2.jpg','proof-3.jpg'], videoId: '',
    painHeadline: 'Manglik hone ka darr aur rishto me rukawat?',
    pains: [
      'Manglik tag ki wajah se ache rishte chhoot jana',
      'Shadi ke baad jhagde aur temper issues ka darr',
      'Cancellation (Bhanga) ka pata na hona'
    ],
    promiseHeadline: 'Mangal ke tejasvi prabhav ko samjhein aur shant karein',
    promise: 'Mars is energy, passion, and vitality. 80% logon ki Kundli me Manglik dosha sharto (cancellations) ke kaaran cancel ho jata hai. Accurate analysis se bina darr ke shadi ka rasta khulta hai.',
    steps: [
      { title: 'Submit birth coordinates', desc: 'Mars exact degree, house, and aspects' },
      { title: 'Check cancellation rules', desc: '28 Classical Manglik Bhanga Yogas verified' },
      { title: 'Remedial prescription', desc: 'Kumbh Vivah, Hanuman Chalisa, Coral guidance' }
    ],
    deliverables: [
      'Exact Manglik Severity (No Dosha / Anshik / Purna Manglik)',
      'Verification of 28 Manglik Cancellation Exceptions',
      'Compatibility Rules with Non-Manglik Partners',
      'Authentic Vedic & Lal Kitab Mangal Remedies',
      'Lifetime downloadable PDF report'
    ],
    beforeAfter: {
      headline: 'Manglik clarity results',
      before: { name: 'Before Analysis', bars: [{ label: 'Clarity', value: 25 }, { label: 'Peace of Mind', value: 30 }] },
      after: { name: 'After Analysis', bars: [{ label: 'Clarity', value: 98 }, { label: 'Peace of Mind', value: 95 }] }
    },
    whyHeadline: 'Manglik Report kyun avashyak hai?',
    why: [
      'Avoid rejecting ideal life partners due to half-knowledge',
      'Unlock authentic Vedic remedies if dosha is active'
    ],
    testimonials: [
      { name: 'Ananya & Rohan', city: 'Delhi', text: 'Was told I am severe Manglik. This report proved cancellation due to Jupiter aspect. Married happily now!', stars: 5 }
    ],
    faqs: [
      { q: 'Can a Manglik marry a non-Manglik?', a: 'Yes, if cancellation yogas exist or if the partner has offsetting Saturn/Mars placements.' }
    ],
    finalCta: 'Manglik Dosha ka sach aur upay jaanein'
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
    en: { title: 'Career & 10th House Karma Report — Find Your Right Path', subtitle: 'Job or business? Which field? When will growth come? Your numbers have clear answers.', badge: 'New' },
    hi: { title: 'करियर और 10th हाउस कर्म रिपोर्ट — सही रास्ता चुनें', subtitle: 'जॉब या बिज़नेस? कौन सा फील्ड? ग्रोथ कब आएगी? आपके नंबरों में साफ़ जवाब हैं।', badge: 'नया' },
  },
  baby_name: {
    en: { title: 'Lucky Baby Name Selection Report — A Blessed Start', subtitle: 'Give your child a name aligned with lucky numbers — for a bright, blessed life.', badge: '' },
    hi: { title: 'लकी बेबी नेम रिपोर्ट — शुभ शुरुआत', subtitle: 'अपने बच्चे को शुभ अंकों से मेल खाता नाम दें — एक उज्ज्वल, शुभ जीवन के लिए।', badge: '' },
  },
  compatibility_report: {
    en: { title: 'Love & Relationship Compatibility — Are You Made For Each Other?', subtitle: 'Discover your relationship strengths, challenges and how well your numbers match.', badge: 'Couples' },
    hi: { title: 'लव और रिलेशनशिप कम्पैटिबिलिटी — क्या आप एक-दूसरे के लिए बने हैं?', subtitle: 'अपने रिश्ते की ताक़त, चुनौतियाँ और नंबरों का मेल कितना है, ये जानें।', badge: 'कपल्स' },
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
    en: { title: 'Marriage Timing & 36-Gun Milan Report — Right Time, Right Partner', subtitle: 'When will marriage happen, with what kind of partner, and how strong is compatibility — your numbers answer clearly.', badge: 'Couples' },
    hi: { title: 'मैरिज टाइमिंग और 36-गुण मिलान रिपोर्ट — सही समय, सही साथी', subtitle: 'शादी कब होगी, कैसे साथी के साथ, और कम्पैटिबिलिटी कितनी — आपके नंबर साफ़ जवाब देते हैं।', badge: 'कपल्स' },
  },
  shani_sade_sati: {
    en: { title: 'Shani Sade Sati & Dhaiya Blueprint — Protection & Timing', subtitle: 'Decode your 7.5-year Saturn transit phases and unlock classical remedies to turn delays into discipline.', badge: 'High Demand' },
    hi: { title: 'शनि साढ़े साती एवं ढैय्या ब्लूप्रिंट — सुरक्षा और उपाय', subtitle: 'शनि के 7.5 वर्षीय गोचर के तीनों चरणों का सटीक विश्लेषण और प्रामाणिक वैदिक शांति उपाय।', badge: 'अधिक मांग' },
  },
  pitra_dosh_karmic: {
    en: { title: 'Pitra Dosh & Ancestral Karma Report — Divine Blessing', subtitle: 'Identify 9th house afflictions, Sun-Rahu yogas, and unlock ancestral blessings for uninterrupted prosperity.', badge: 'Karmic Relief' },
    hi: { title: 'पितृ दोष एवं पूर्वज कर्म रिपोर्ट — पितृ आशीर्वाद', subtitle: 'कुंडली में 9वें भाव और सूर्य के दोषों का विश्लेषण कर पूर्वजों का शुभ आशीर्वाद प्राप्त करें।', badge: 'पितृ कृपा' },
  },
  wealth_yogas_kundli: {
    en: { title: 'Dhana Yogas & Laxmi Prapti Blueprint — Financial Power', subtitle: 'Pinpoint wealth combinations in 2nd, 5th, 9th, 11th houses and auspicious money cycles in your Kundli.', badge: 'High Wealth' },
    hi: { title: 'धन योग एवं लक्ष्मी प्राप्ति ब्लूप्रिंट — महाधन योग', subtitle: 'कुंडली के 2, 5, 9 और 11वें भाव के धन योगों और लक्ष्मी प्राप्ति के शुभ समय की पहचान।', badge: 'धन वृद्धि' },
  },
  health_vitality_kundli: {
    en: { title: 'Medical Astrology & Vitality Blueprint — Ayurvedic Balance', subtitle: 'Evaluate 6th/8th house indicators, 7 Chakras alignment, and Tridosha balance (Vata, Pitta, Kapha).', badge: 'Vitality' },
    hi: { title: 'मेडिकल एस्ट्रोलॉजी एवं स्वास्थ्य ब्लूप्रिंट — त्रिदोष संतुलन', subtitle: 'कुंडली के 6ठे और 8वें भाव के स्वास्थ्य योग, 7 चक्र और वात-पित्त-कफ का संतुलन।', badge: 'आरोग्य' },
  },
  foreign_settlement_travel: {
    en: { title: 'Foreign Settlement & PR Immigration Report — Global Destiny', subtitle: 'Discover 12th, 9th, and 4th house foreign travel indicators, auspicious visa timing, and overseas career yogas.', badge: 'Overseas PR' },
    hi: { title: 'विदेश यात्रा एवं पीआर सेटलमेंट रिपोर्ट — विदेश योग', subtitle: 'कुंडली में विदेश गमन, वीज़ा प्राप्ति का शुभ समय और विदेश में स्थायी निवास के योग।', badge: 'विदेश योग' },
  },
  mangal_dosha_analysis: {
    en: { title: 'Complete Manglik Dosha & Remedies Report — Marital Peace', subtitle: 'Accurate evaluation of Mars placement, 28 cancellation factors (Bhanga Yogas), and remedies.', badge: 'High Priority' },
    hi: { title: 'सम्पूर्ण मांगलिक दोष एवं निवारण रिपोर्ट — वैवाहिक सुख', subtitle: 'मंगल दोष की तीव्रता, 28 मंगल दोष भंग योग और प्रामाणिक निवारण उपाय।', badge: 'मंगल शांति' },
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
