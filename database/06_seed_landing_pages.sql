-- =====================================================================
-- DYNAMIC CMS — Phase 5: 6 USP sale landing pages (high-CRO content)
-- Researched, India-market numerology copy. Idempotent.
-- Images/YouTube blank — admin se bharo (URL paste). Text ready.
-- =====================================================================

-- helper to upsert a page + return id
DO $$
DECLARE pid uuid;
BEGIN

-- ============ 1. NAME CORRECTION ============
INSERT INTO public.landing_pages (slug, title, subtitle, meta_title, meta_description, tool_type, badge, price, original_price, rating, reviews_count, report_key, related_slugs, sort_order)
VALUES ('name-correction-report','Name Correction Report','Apne naam ki spelling theek karke bhagya, career aur rishte sudhaarein — sirf ₹599 mein',
  'Name Correction Report by Numerology — Lucky Name as per DOB | Ankjyotish AI',
  'Personalised name correction report. Discover the exact spelling that aligns your name with your birth number for success, money and relationships. Free glimpse + detailed PDF.',
  'name','Bestseller',599,1299,4.9,2143,'name_correction','{mobile-numerology-report,vehicle-numerology-report,career-numerology-report}',1)
ON CONFLICT (slug) DO UPDATE SET subtitle=EXCLUDED.subtitle, badge=EXCLUDED.badge, price=EXCLUDED.price, original_price=EXCLUDED.original_price, report_key=EXCLUDED.report_key, related_slugs=EXCLUDED.related_slugs
RETURNING id INTO pid;
DELETE FROM public.page_blocks WHERE page_id = pid;
INSERT INTO public.page_blocks (page_id, type, content, position) VALUES
(pid,'heading','{"text":"Kya aapki mehnat ka pura fal nahi mil raha?","level":2}',1),
(pid,'paragraph','{"text":"Numerology mein aapka naam sirf ek label nahi — ek vibration hai. Har akshar ka ek number hota hai, aur unka jod aapke bhagya ko set karta hai. Agar aapka naam aapke janm-ank (Mulank) se takraata hai, toh mehnat ke baad bhi rukawatein aati rehti hain. Sahi spelling aapke naam ko aapke destiny ke saath align kar deti hai."}',2),
(pid,'list','{"items":["Career aur business mein naye avsar","Paison ka behtar flow aur stability","Rishton mein tarakki aur samman","Aatmvishwas aur clarity","Repeating problems ka ant"]}',3),
(pid,'youtube','{"videoId":"","title":"Name Correction kaise kaam karta hai (apna video URL daalein)"}',4),
(pid,'heading','{"text":"Aapko kya milega is report mein","level":3}',5),
(pid,'list','{"items":["Aapke current naam ka Chaldean + Pythagorean analysis","Mulank aur Bhagyank ke saath compatibility","Sahi spelling ke exact suggestions (chhote badlav)","Lucky number, colour, day","Naya naam social media/branding mein kaise use karein","White-label PDF report (logo ke saath)"]}',6),
(pid,'image','{"url":"","alt":"Sample name correction report","caption":"Sample report preview (apni image daalein)"}',7),
(pid,'testimonial','{"text":"Spelling badalne ke 3 mahine baad naya job mil gaya. Pehle interviews mein hi atak jaata tha.","author":"Rahul, Delhi"}',8),
(pid,'faq','{"items":[{"q":"Kya legally naam badalna padega?","a":"Nahi. Aksar aap nayi spelling social media, business card, signature mein use kar sakte ho — vibration dheere-dheere asar dikhati hai."},{"q":"Kitne din mein result?","a":"Har vyakti alag. Bahut log kuch hafton-mahinon mein confidence aur avsaron mein badlav mehsoos karte hain."},{"q":"Kaunsa system use hota hai?","a":"Chaldean (sabse precise) + Pythagorean dono — aur aapki DOB ke saath match karke."}]}',9),
(pid,'cta','{"label":"Get My Name Correction Report — ₹599","href":"/payment?tier=pro&returnUrl=/r/name-correction-report","style":"primary"}',10);

-- ============ 2. MOBILE NUMEROLOGY ============
INSERT INTO public.landing_pages (slug, title, subtitle, meta_title, meta_description, tool_type, badge, price, original_price, rating, reviews_count, report_key, related_slugs, sort_order)
VALUES ('mobile-numerology-report','Mobile Number Numerology Report','Aapka phone number aapki luck badha raha hai ya gira raha hai? Jaaniye — ₹299',
  'Mobile Number Numerology Report — Lucky Number Check | Ankjyotish AI',
  'Is your mobile number lucky? Get a numerology analysis of your phone number against your birth number, with a luck score and remedies. Free check + detailed report.',
  'mobile','Popular',299,599,4.8,1670,'mobile_numerology','{name-correction-report,vehicle-numerology-report}',2)
ON CONFLICT (slug) DO UPDATE SET subtitle=EXCLUDED.subtitle, badge=EXCLUDED.badge, price=EXCLUDED.price, original_price=EXCLUDED.original_price, report_key=EXCLUDED.report_key, related_slugs=EXCLUDED.related_slugs
RETURNING id INTO pid;
DELETE FROM public.page_blocks WHERE page_id = pid;
INSERT INTO public.page_blocks (page_id, type, content, position) VALUES
(pid,'heading','{"text":"Aap din mein 100 baar apna number use karte ho — kya wo aapke saath hai?","level":2}',1),
(pid,'paragraph','{"text":"Aapka mobile number ek constant vibration hai jo aapke saath rehti hai. Numerology ke anusaar, agar aapke number ka jod aapke janm-ank se nahi milta, toh ye energy ko bikher sakta hai — financial leaks, misunderstandings, ya rukावटें. Ek favourable number support karta hai."}',2),
(pid,'list','{"items":["Aapke number ka total + root analysis","Mulank ke saath friendly hai ya nahi","Luck score (0-100)","Behtar number ke suggestions","Simple remedies"]}',3),
(pid,'youtube','{"videoId":"","title":"Mobile number numerology samjhaiye (video URL daalein)"}',4),
(pid,'testimonial','{"text":"Business number change kiya, 2 mahine mein calls badhe. Coincidence ho ya na ho, farak pada.","author":"Sneha, Pune"}',5),
(pid,'faq','{"items":[{"q":"Number badalna zaroori hai?","a":"Zaroori nahi. Report aapko score aur options deti hai — aap decide karein."},{"q":"Kaise calculate hota hai?","a":"Number ke saare digits ka jod, single digit mein reduce, phir aapke Mulank se compatibility."}]}',6),
(pid,'cta','{"label":"Check My Mobile Number — ₹299","href":"/payment?tier=starter&returnUrl=/r/mobile-numerology-report","style":"primary"}',7);

-- ============ 3. VEHICLE NUMEROLOGY ============
INSERT INTO public.landing_pages (slug, title, subtitle, meta_title, meta_description, tool_type, price, original_price, rating, reviews_count, report_key, related_slugs, sort_order)
VALUES ('vehicle-numerology-report','Vehicle Number Numerology Report','Apni gaadi ka number lucky, safe aur aapke liye shubh hai? — ₹299',
  'Vehicle Number Numerology Report — Lucky Vehicle Number | Ankjyotish AI',
  'Check if your vehicle/plate number is lucky and safe in numerology. Get a harmony score with your birth number, plus tips for a luckier plate. Free check + report.',
  'vehicle',299,599,4.8,980,'vehicle_numerology','{name-correction-report,mobile-numerology-report}',3)
ON CONFLICT (slug) DO UPDATE SET subtitle=EXCLUDED.subtitle, price=EXCLUDED.price, original_price=EXCLUDED.original_price, report_key=EXCLUDED.report_key, related_slugs=EXCLUDED.related_slugs
RETURNING id INTO pid;
DELETE FROM public.page_blocks WHERE page_id = pid;
INSERT INTO public.page_blocks (page_id, type, content, position) VALUES
(pid,'heading','{"text":"Gaadi sirf transport nahi — ek chalti hui vibration hai","level":2}',1),
(pid,'paragraph','{"text":"Aapke vehicle ka number safety, luck aur harmony ko prabhावit karta hai. Numerology mein plate ka root number aapke Mulank ke saath friendly hona chahiye — taaki safar surakshit aur shubh rahe."}',2),
(pid,'list','{"items":["Plate number ka root analysis","Safety, luck aur harmony score","Aapke Mulank ke saath match","Shubh plate ke liye guidance"]}',3),
(pid,'youtube','{"videoId":"","title":"Vehicle numerology (video URL daalein)"}',4),
(pid,'faq','{"items":[{"q":"Naya number lena padega?","a":"Zaroori nahi — report guidance deti hai. Naye vehicle ke liye behtar choice mein madad."}]}',5),
(pid,'cta','{"label":"Check My Vehicle Number — ₹299","href":"/payment?tier=starter&returnUrl=/r/vehicle-numerology-report","style":"primary"}',6);

-- ============ 4. CAREER NUMEROLOGY ============
INSERT INTO public.landing_pages (slug, title, subtitle, meta_title, meta_description, tool_type, badge, price, original_price, rating, reviews_count, report_key, related_slugs, sort_order)
VALUES ('career-numerology-report','Career & Job Prediction Report','Aapke numbers kis career ke liye bane hain? Confusion khatam karein — ₹699',
  'Career & Job Prediction by Numerology | Ankjyotish AI',
  'Numerology-based career and job prediction. Discover the fields, timing and strengths your numbers support — and avoid mismatched paths. Detailed personalised report.',
  'career','New',699,1499,4.9,1320,'career_numerology','{name-correction-report,compatibility-report}',4)
ON CONFLICT (slug) DO UPDATE SET subtitle=EXCLUDED.subtitle, badge=EXCLUDED.badge, price=EXCLUDED.price, original_price=EXCLUDED.original_price, report_key=EXCLUDED.report_key, related_slugs=EXCLUDED.related_slugs
RETURNING id INTO pid;
DELETE FROM public.page_blocks WHERE page_id = pid;
INSERT INTO public.page_blocks (page_id, type, content, position) VALUES
(pid,'heading','{"text":"Galat field mein mehnat = thakaan. Sahi field = flow.","level":2}',1),
(pid,'paragraph','{"text":"Numerology aapke Mulank, Bhagyank aur naam ke through batati hai ki aap kis tarah ke kaam mein natural roop se chamak sakte ho — leadership, creativity, communication, service ya business. Confusion ki jagah clarity."}',2),
(pid,'list','{"items":["Aapke numbers ke according best career fields","Strengths aur natural talents","Kaam mein challenges aur unka samadhan","Favourable timing (saal/mahine)","Business vs job guidance"]}',3),
(pid,'youtube','{"videoId":"","title":"Career numerology (video URL daalein)"}',4),
(pid,'testimonial','{"text":"Engineering chhod ke content/communication mein gaya — report ne wahi suggest kiya tha. Ab khush hoon.","author":"Aditya, Bangalore"}',5),
(pid,'faq','{"items":[{"q":"Kya ye job guarantee deta hai?","a":"Nahi. Ye guidance hai — sahi direction taaki aapki mehnat sahi jagah lage."},{"q":"Already working hoon, faayda?","a":"Haan — switch, promotion timing aur strengths samajhne mein madad."}]}',6),
(pid,'cta','{"label":"Get My Career Report — ₹699","href":"/payment?tier=master&returnUrl=/r/career-numerology-report","style":"primary"}',7);

-- ============ 5. BABY NAME ============
INSERT INTO public.landing_pages (slug, title, subtitle, meta_title, meta_description, tool_type, price, original_price, rating, reviews_count, report_key, related_slugs, sort_order)
VALUES ('baby-name-report','Lucky Baby Name Report','Apne bachche ko ek aisa naam dein jo zindagi bhar luck laaye — ₹499',
  'Lucky Baby Name Report by Numerology | Ankjyotish AI',
  'Auspicious, numerology-aligned baby names matched to your child''s birth details. Meanings, lucky numbers and shortlist. Personalised baby name report.',
  'baby',499,999,4.9,1105,'baby_name','{name-correction-report}',5)
ON CONFLICT (slug) DO UPDATE SET subtitle=EXCLUDED.subtitle, price=EXCLUDED.price, original_price=EXCLUDED.original_price, report_key=EXCLUDED.report_key, related_slugs=EXCLUDED.related_slugs
RETURNING id INTO pid;
DELETE FROM public.page_blocks WHERE page_id = pid;
INSERT INTO public.page_blocks (page_id, type, content, position) VALUES
(pid,'heading','{"text":"Naam ek tohfa hai jo zindagi bhar saath rehta hai","level":2}',1),
(pid,'paragraph','{"text":"Bachche ka naam uske vyaktitva aur bhagya ki neev rakhta hai. Hum aapke bachche ki janm-tithi ke lucky number se mel khaate shubh naam suggest karte hain — arth ke saath."}',2),
(pid,'list','{"items":["Janm-tithi se lucky number","Us number se match karte naam (arth ke saath)","Boy/girl/unisex options","Naamank explanation"]}',3),
(pid,'youtube','{"videoId":"","title":"Baby name numerology (video URL daalein)"}',4),
(pid,'cta','{"label":"Get Lucky Baby Names — ₹499","href":"/payment?tier=pro&returnUrl=/r/baby-name-report","style":"primary"}',5);

-- ============ 6. COMPATIBILITY ============
INSERT INTO public.landing_pages (slug, title, subtitle, meta_title, meta_description, tool_type, badge, price, original_price, rating, reviews_count, report_key, related_slugs, sort_order)
VALUES ('compatibility-report','Love & Marriage Compatibility Report','Commitment se pehle jaaniye — numbers sach bolte hain — ₹499',
  'Love & Marriage Numerology Compatibility Report | Ankjyotish AI',
  'Deep numerology compatibility for couples — love, marriage and business. Know your strengths, challenges and long-term harmony before you commit.',
  'none','Couples',499,999,4.8,1430,'compatibility_report','{name-correction-report,career-numerology-report}',6)
ON CONFLICT (slug) DO UPDATE SET subtitle=EXCLUDED.subtitle, badge=EXCLUDED.badge, price=EXCLUDED.price, original_price=EXCLUDED.original_price, report_key=EXCLUDED.report_key, related_slugs=EXCLUDED.related_slugs
RETURNING id INTO pid;
DELETE FROM public.page_blocks WHERE page_id = pid;
INSERT INTO public.page_blocks (page_id, type, content, position) VALUES
(pid,'heading','{"text":"Pyaar andha ho sakta hai — numbers nahi","level":2}',1),
(pid,'paragraph','{"text":"Do logon ke numbers ke beech ka taalmel rishte ki neev batata hai. Hum dono ke Mulank/Bhagyank ka deep compatibility analysis dete hain — love, marriage aur business ke liye."}',2),
(pid,'list','{"items":["Dono ke numbers ka match score","Strengths aur growth areas","Love, marriage, business compatibility","Long-term harmony guidance"]}',3),
(pid,'youtube','{"videoId":"","title":"Compatibility numerology (video URL daalein)"}',4),
(pid,'testimonial','{"text":"Shaadi se pehle report li — jo challenges bataye, wahi the. Pehle se taiyaar the hum.","author":"Priya & Karan"}',5),
(pid,'cta','{"label":"Get Compatibility Report — ₹499","href":"/payment?tier=pro&returnUrl=/r/compatibility-report","style":"primary"}',6);

END $$;

-- Verify:
-- SELECT slug, badge, price FROM landing_pages ORDER BY sort_order;
