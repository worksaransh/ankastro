

-- =====================================================================
-- BUNDLED FILE: 00_permissions.sql
-- =====================================================================

-- =====================================================================
-- 00 — PERMISSIONS & GRANTS (run FIRST)
-- Bina iske report save / data read fail hota hai.
-- =====================================================================
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO authenticated;

-- user_reports RLS (user apni reports manage kare)
ALTER TABLE public.user_reports ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS ur_insert_own ON public.user_reports;
DROP POLICY IF EXISTS ur_select_own ON public.user_reports;
DROP POLICY IF EXISTS ur_update_own ON public.user_reports;
CREATE POLICY ur_insert_own ON public.user_reports FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY ur_select_own ON public.user_reports FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY ur_update_own ON public.user_reports FOR UPDATE TO authenticated USING (auth.uid() = user_id);


-- =====================================================================
-- BUNDLED FILE: 01_pricing_plans.sql
-- =====================================================================

-- =====================================================================
-- DYNAMIC PRICING — pricing_plans table (admin-editable)
-- Safe & additive. Frontend + edge function DB se padhenge,
-- fail hone par hardcoded fallback (payment kabhi nahi rukega).
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.pricing_plans (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  tier text NOT NULL UNIQUE,          -- glimpse | starter | addon | pro | master
  price integer NOT NULL DEFAULT 0,
  original_price integer,
  active boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Seed current prices (idempotent)
INSERT INTO public.pricing_plans (tier, price, original_price) VALUES
  ('glimpse', 0, NULL),
  ('starter', 299, 599),
  ('addon',   199, 499),
  ('pro',     599, 1299),
  ('master',  999, 2499)
ON CONFLICT (tier) DO NOTHING;

-- Grants + RLS (public read; only admins write)
GRANT SELECT ON public.pricing_plans TO anon, authenticated;
GRANT ALL ON public.pricing_plans TO service_role;

ALTER TABLE public.pricing_plans ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS pp_public_read ON public.pricing_plans;
CREATE POLICY pp_public_read ON public.pricing_plans
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS pp_admin_write ON public.pricing_plans;
CREATE POLICY pp_admin_write ON public.pricing_plans
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'));

-- Verify
-- SELECT * FROM public.pricing_plans ORDER BY price;


-- =====================================================================
-- BUNDLED FILE: seeds/seed_destiny_en.sql
-- =====================================================================

-- ============================================================
-- Phase 1a: DESTINY number meanings (English)
-- Additive seed for public.number_meanings — category = 'destiny'
-- Numbers: 1-9, 11, 22, 33  | language: en
-- Safe to re-run: deletes only destiny/en rows first, then re-inserts.
-- ============================================================

DELETE FROM public.number_meanings WHERE category = 'destiny' AND language = 'en';

INSERT INTO public.number_meanings (number, category, language, title, purpose, strengths, challenges, careers, relationships, health, spiritual) VALUES
(1, 'destiny', 'en', 'The Pioneer''s Destiny',
 'Your name carries the vibration of leadership and original thought. You are meant to initiate, to stand at the front of new ideas, and to build things that did not exist before you arrived. Your destiny is to become self-reliant and to inspire others to follow their own path.',
 '{"Natural authority","Originality","Drive to achieve","Decisiveness","Self-motivation"}',
 '{"Can seem domineering","Impatience with slower people","Difficulty asking for help"}',
 '{"Founder","Director","Inventor","Department head","Independent consultant"}',
 'You give best in a relationship where your independence is respected. Learn to share decisions rather than dictate them.',
 'Watch tension headaches and high blood pressure that come from carrying everything alone. Movement and delegation protect you.',
 'Your spiritual work is to lead without ego — to use your strength to lift others rather than to dominate them.'),
(2, 'destiny', 'en', 'The Diplomat''s Destiny',
 'Your name vibration is one of partnership, sensitivity, and quiet influence. You are meant to bring people together, to mediate, and to achieve through cooperation rather than force. Your destiny unfolds through relationships and behind-the-scenes contribution.',
 '{"Diplomacy","Deep intuition","Patience","Loyalty","Attention to detail"}',
 '{"Over-sensitivity to criticism","Avoiding conflict to a fault","Self-doubt"}',
 '{"Counselor","Mediator","HR specialist","Designer","Team coordinator"}',
 'You are devoted and tender in love. Guard against losing yourself in your partner — your needs matter equally.',
 'Your nervous system and digestion react to emotional stress. Calm routines and rest keep you balanced.',
 'Your path is to develop inner strength so your gentleness becomes a choice, not a weakness.'),
(3, 'destiny', 'en', 'The Communicator''s Destiny',
 'Your name carries the energy of expression, creativity, and joy. You are meant to communicate — through words, art, performance, or design — and to lift the spirits of those around you. Your destiny is to share your gifts openly with the world.',
 '{"Verbal and artistic talent","Optimism","Charisma","Imagination","Social ease"}',
 '{"Scattering energy across too many things","Avoiding depth","Mood swings"}',
 '{"Writer","Performer","Marketer","Designer","Public speaker"}',
 'You bring laughter and warmth to love, but partners need your focus too — give attention as freely as you give charm.',
 'Throat and skin reflect your emotional state. Creative outlets keep you healthy and grounded.',
 'Your spiritual task is to use your voice for meaning, not just applause.'),
(4, 'destiny', 'en', 'The Builder''s Destiny',
 'Your name vibration is one of structure, discipline, and reliability. You are meant to build solid foundations — in work, family, and society — that outlast you. Your destiny is achieved through steady, honest effort.',
 '{"Discipline","Trustworthiness","Practical skill","Endurance","Loyalty"}',
 '{"Rigidity","Resistance to change","Working to exhaustion"}',
 '{"Engineer","Architect","Operations manager","Accountant","Builder"}',
 'You are a dependable, committed partner. Let warmth and spontaneity in — structure alone can feel cold to loved ones.',
 'Bones, joints, and back carry your stress. Regular rest and stretching are essential.',
 'Your path is to find flexibility within discipline — to build without becoming the prisoner of your own walls.'),
(5, 'destiny', 'en', 'The Explorer''s Destiny',
 'Your name carries the vibration of freedom, change, and adventure. You are meant to experience life widely, to adapt, and to teach others how to embrace change without fear. Your destiny is movement and versatility.',
 '{"Adaptability","Magnetism","Quick thinking","Courage","Versatility"}',
 '{"Restlessness","Difficulty committing","Tendency toward excess"}',
 '{"Travel/hospitality","Sales","Journalism","Entrepreneur","Trainer"}',
 'You need a partner who gives you space and shares your curiosity. Freedom and loyalty can coexist when both are honest.',
 'Your nervous energy needs grounding — guard against addictions and burnout.',
 'Your spiritual work is to find inner freedom, so you stop seeking it only in the next experience.'),
(6, 'destiny', 'en', 'The Nurturer''s Destiny',
 'Your name vibration is one of responsibility, care, and harmony. You are meant to serve family and community, to heal, and to create beauty and balance. Your destiny unfolds through devotion to others.',
 '{"Compassion","Responsibility","Artistic sense","Healing presence","Loyalty"}',
 '{"Over-giving","Worry","Perfectionism toward loved ones"}',
 '{"Teacher","Healthcare","Counselor","Interior designer","Chef"}',
 'You love deeply and protectively. Avoid martyrdom — let others care for you too.',
 'Heart and circulation reflect your emotional load. Boundaries are medicine for you.',
 'Your path is to serve from fullness, not depletion — to balance giving with self-love.'),
(7, 'destiny', 'en', 'The Seeker''s Destiny',
 'Your name carries the vibration of wisdom, analysis, and inner truth. You are meant to study, to understand the hidden nature of things, and to share deep insight. Your destiny is the pursuit of knowledge and spiritual depth.',
 '{"Analytical mind","Intuition","Independence","Depth of thought","Specialist focus"}',
 '{"Isolation","Over-thinking","Difficulty trusting others"}',
 '{"Researcher","Analyst","Scientist","Philosopher","Spiritual teacher"}',
 'You need intellectual and soul connection in love; shallow bonds tire you. Let people into your inner world.',
 'Mental fatigue and sleep are your watch points. Solitude restores you, but isolation drains you.',
 'Your path is to share your wisdom rather than hoard it — to turn solitude into service.'),
(8, 'destiny', 'en', 'The Executive''s Destiny',
 'Your name vibration is one of power, ambition, and material mastery. You are meant to lead enterprises, manage resources, and create abundance — then use it wisely. Your destiny is achievement in the material world.',
 '{"Business instinct","Authority","Resilience","Organization","Vision for scale"}',
 '{"Workaholism","Control issues","Equating worth with money"}',
 '{"Executive","Entrepreneur","Investor","Lawyer","Real estate"}',
 'Respect and shared ambition matter to you in love. Soften — relationships are not deals to be managed.',
 'Stress targets your heart and digestion. Success means little without health to enjoy it.',
 'Your path is to learn that true power is inner — and to use material success for a greater good.'),
(9, 'destiny', 'en', 'The Humanitarian''s Destiny',
 'Your name carries the vibration of compassion, wisdom, and universal service. You are meant to give to humanity, to heal on a wide scale, and to complete cycles with grace. Your destiny is selfless contribution.',
 '{"Compassion","Broad wisdom","Generosity","Artistic depth","Forgiveness"}',
 '{"Emotional overwhelm","Difficulty letting go","Self-sacrifice"}',
 '{"Humanitarian work","Medicine","Teaching","Arts","Counseling"}',
 'You love universally, sometimes at the cost of intimacy. Stay present for the person in front of you.',
 'You absorb others'' pain — emotional boundaries protect your immune system and energy.',
 'Your path is to give without losing yourself, and to release what is complete.'),
(11, 'destiny', 'en', 'The Inspirer''s Destiny (Master)',
 'Your name carries the master vibration of 11 — illumination and spiritual inspiration. You are meant to uplift and awaken others through intuition, vision, and example. Your destiny is to be a light, not merely a leader.',
 '{"Heightened intuition","Inspirational presence","Visionary insight","Sensitivity","Idealism"}',
 '{"Nervous tension","Self-doubt under pressure","Feeling overwhelmed by your own sensitivity"}',
 '{"Spiritual teacher","Artist","Counselor","Visionary founder","Writer"}',
 'You need a partner who understands your sensitivity and supports your mission. Grounding love steadies you.',
 'Your nervous system is finely tuned — grounding practices and rest are essential, not optional.',
 'Your path is to trust your inner light and channel it into service rather than anxiety.'),
(22, 'destiny', 'en', 'The Master Builder''s Destiny (Master)',
 'Your name carries the master vibration of 22 — the power to turn great visions into lasting reality. You are meant to build on a large scale: institutions, movements, or works that serve many. Your destiny is visionary yet deeply practical.',
 '{"Large-scale vision","Practical execution","Leadership","Discipline","Lasting impact"}',
 '{"Immense self-imposed pressure","Self-doubt about your own power","Workaholism"}',
 '{"Large-organization head","Architect","Systems builder","Political/social leader","Innovator"}',
 'You need a grounded partner who supports your mission without competing with it.',
 'The weight of your ambition stresses body and mind — pace yourself, rest is part of the work.',
 'Your path is to ground enormous spiritual potential into practical good for many.'),
(33, 'destiny', 'en', 'The Master Teacher''s Destiny (Master)',
 'Your name carries the rare master vibration of 33 — unconditional love and compassionate teaching. You are meant to heal and uplift through selfless service and the example of your own being. Your destiny is service at the highest level.',
 '{"Unconditional love","Healing presence","Wisdom","Devotion","Inspirational teaching"}',
 '{"Self-sacrifice to depletion","Carrying others'' burdens","Impossibly high self-expectations"}',
 '{"Healer","Spiritual leader","Humanitarian","Counselor","Teacher of teachers"}',
 'Love is your purpose. Choose partners who can match your depth and replenish you in return.',
 'Your heart — physical and emotional — needs nurturing. Practice self-love as fiercely as you serve.',
 'Your path is to embody compassion itself, healing simply through your presence.');


-- =====================================================================
-- BUNDLED FILE: seeds/seed_soul_urge_en.sql
-- =====================================================================

-- ============================================================
-- Phase 1a: SOUL URGE number meanings (English)
-- Additive seed for public.number_meanings — category = 'soul_urge'
-- Numbers: 1-9, 11, 22, 33  | language: en
-- Safe to re-run.
-- ============================================================

DELETE FROM public.number_meanings WHERE category = 'soul_urge' AND language = 'en';

INSERT INTO public.number_meanings (number, category, language, title, purpose, strengths, challenges, careers, relationships, health, spiritual) VALUES
(1, 'soul_urge', 'en', 'A Heart That Craves Independence',
 'Deep down, your heart longs to stand on its own and be recognized as original. You feel most alive when you are leading, creating something new, or proving you can do it your way. Your inner drive is to be first and free.',
 '{"Inner courage","Self-belief","Pioneering desire","Determination"}',
 '{"Hidden need for approval","Loneliness at the top","Resisting interdependence"}',
 '{"Leadership roles","Solo ventures","Creative innovation"}',
 'You secretly want a partner who admires your strength yet meets you as an equal. Vulnerability is your growth edge.',
 'Suppressed frustration shows as tension. Honoring your need for autonomy keeps you well.',
 'Your soul learns that true independence includes letting others in.'),
(2, 'soul_urge', 'en', 'A Heart That Craves Harmony',
 'Your deepest desire is for peace, closeness, and loving connection. You long to be needed, to belong, and to feel emotional safety. Inner contentment comes from harmony with the people you love.',
 '{"Emotional depth","Capacity for love","Sensitivity","Devotion"}',
 '{"Fear of rejection","People-pleasing","Losing self in others"}',
 '{"Supportive partnerships","Care work","Mediation"}',
 'You crave deep, secure bonds. Choose people who value your tenderness rather than exploit it.',
 'Emotional turmoil unsettles your stomach and nerves. Peace is literally healing for you.',
 'Your soul learns that you can love deeply without disappearing.'),
(3, 'soul_urge', 'en', 'A Heart That Craves Expression',
 'Your inner self yearns to create, to be seen, and to spread joy. You feel fulfilled when you can express what is inside you — through words, art, or laughter — and when others delight in it.',
 '{"Creative longing","Warmth","Playfulness","Emotional openness"}',
 '{"Need for constant validation","Scattering feelings","Avoiding hard emotions"}',
 '{"Creative arts","Communication","Entertainment"}',
 'You want a partner who celebrates and inspires you. Beneath the sparkle, you long to be truly understood.',
 'Bottled-up feelings affect throat and mood. Expression is your release valve.',
 'Your soul learns to express truth, not just charm.'),
(4, 'soul_urge', 'en', 'A Heart That Craves Security',
 'Deep down you long for stability, order, and a solid foundation you can trust. You feel at peace when life is dependable and your efforts build something lasting. Security is your quiet treasure.',
 '{"Loyalty","Steadiness","Inner discipline","Reliability"}',
 '{"Fear of instability","Rigidity born of insecurity","Difficulty relaxing"}',
 '{"Structured work","Long-term projects","Stewardship"}',
 'You want a steady, faithful partner you can build a life with. Let love be a refuge, not another duty.',
 'Worry settles in your back and joints. Trusting life loosens the grip.',
 'Your soul learns that real security is inner, not only built of bricks.'),
(5, 'soul_urge', 'en', 'A Heart That Craves Freedom',
 'Your deepest desire is for freedom, variety, and new experience. You feel alive when nothing fences you in and the next adventure is open. Your heart resists anything that feels like a cage.',
 '{"Love of life","Adaptability","Curiosity","Boldness"}',
 '{"Fear of being trapped","Restlessness in love","Avoiding commitment"}',
 '{"Travel","Dynamic roles","Variety-rich work"}',
 'You want a partner who is also an adventure, not an anchor. Freedom and devotion can live together.',
 'Restless energy needs outlets, or it turns to excess. Movement keeps you steady.',
 'Your soul learns that the deepest freedom is found within, not in constant escape.'),
(6, 'soul_urge', 'en', 'A Heart That Craves to Love and Be Loved',
 'Your inner self longs for a loving home, family, and the chance to care for others. You feel complete when you are nurturing, protecting, and creating harmony for those you love.',
 '{"Deep caring","Loyalty","Desire to protect","Sense of beauty"}',
 '{"Over-responsibility","Needing to be needed","Self-neglect"}',
 '{"Family-centered work","Healing","Creating beautiful spaces"}',
 'You want devotion and a shared home. Make sure your giving is met, not taken for granted.',
 'You carry others'' stress in your heart. Boundaries keep your caregiving sustainable.',
 'Your soul learns to receive love as freely as it gives.'),
(7, 'soul_urge', 'en', 'A Heart That Craves Truth',
 'Deep within, you long for understanding, solitude, and meaning beneath the surface. You feel fulfilled when you grasp how things truly work and touch something sacred or profound.',
 '{"Inner depth","Love of truth","Spiritual yearning","Quiet strength"}',
 '{"Emotional guardedness","Withdrawing when hurt","Loneliness"}',
 '{"Research","Spiritual or analytical work","Specialist depth"}',
 'You want a soul-deep, honest connection. Let trusted people past your inner walls.',
 'Mental overactivity disturbs your sleep. Quiet and nature restore you.',
 'Your soul learns that wisdom is meant to be shared, not hidden.'),
(8, 'soul_urge', 'en', 'A Heart That Craves Achievement',
 'Your deepest desire is for success, recognition, and the power to shape your world. You feel fulfilled when your efforts produce real results and you can provide abundantly.',
 '{"Ambition","Drive","Resilience","Desire to provide"}',
 '{"Tying self-worth to results","Hidden insecurity","Difficulty resting"}',
 '{"Business","Leadership","Wealth building"}',
 'You want a partner who respects your drive and stands beside you. Let love be a place where you do not have to perform.',
 'Pressure targets heart and digestion. Worth is not measured in output.',
 'Your soul learns that fulfillment comes from purpose, not just accumulation.'),
(9, 'soul_urge', 'en', 'A Heart That Craves to Give',
 'Deep down you long to make a difference, to heal, and to love humanity broadly. You feel complete when your life serves something greater than yourself.',
 '{"Compassion","Idealism","Generosity","Emotional wisdom"}',
 '{"Saving everyone but yourself","Difficulty with personal intimacy","Holding on to old pain"}',
 '{"Service professions","Arts with a message","Humanitarian roles"}',
 'You love widely; remember the person beside you needs your focused presence too.',
 'You absorb the world''s sorrow. Emotional release keeps you healthy.',
 'Your soul learns to give from overflow and to let the past go.'),
(11, 'soul_urge', 'en', 'A Heart That Craves to Inspire (Master)',
 'Your inner self longs to uplift and awaken others, to live by intuition, and to connect with something higher. You feel fulfilled when you inspire and when your sensitivity finds a meaningful purpose.',
 '{"Spiritual longing","Intuitive depth","Idealism","Inspirational warmth"}',
 '{"Nervous sensitivity","Self-doubt","Feeling misunderstood"}',
 '{"Inspirational or healing work","Teaching","Creative-spiritual roles"}',
 'You want a partner who honors your inner world and steadies your sensitivity.',
 'Your fine-tuned nerves need grounding and gentle routines.',
 'Your soul learns to trust its light and turn sensitivity into service.'),
(22, 'soul_urge', 'en', 'A Heart That Craves Lasting Impact (Master)',
 'Deep within, you long to build something that truly matters and serves many. You feel fulfilled when grand vision becomes real, lasting good in the world.',
 '{"Visionary longing","Drive to build","Discipline","Desire to serve at scale"}',
 '{"Crushing self-expectation","Fear of your own potential","Overwork"}',
 '{"Large-scale building","Systems and institutions","Visionary leadership"}',
 'You want a partner who believes in your mission and helps you stay human within it.',
 'The weight you carry needs release — rest is not a luxury but fuel.',
 'Your soul learns to ground vast potential into patient, practical good.'),
(33, 'soul_urge', 'en', 'A Heart That Craves to Heal Through Love (Master)',
 'Your deepest desire is to love unconditionally and to heal others through compassion. You feel complete when your presence comforts and uplifts those who suffer.',
 '{"Boundless compassion","Healing devotion","Wisdom","Selfless love"}',
 '{"Giving until empty","Carrying everyone''s pain","Neglecting your own needs"}',
 '{"Healing","Spiritual teaching","Compassionate service"}',
 'Love is your reason for being. Choose those who replenish you as you pour out for others.',
 'Your heart needs as much care as you give. Self-compassion is essential medicine.',
 'Your soul learns that healing others begins with healing yourself.');


-- =====================================================================
-- BUNDLED FILE: seeds/seed_destiny_soulurge_hi.sql
-- =====================================================================

-- ============================================================
-- Phase 1b: DESTINY + SOUL URGE meanings (Hindi)
-- Additive seed for public.number_meanings
-- Numbers: 1-9, 11, 22, 33  | language: hi
-- Safe to re-run.
-- ============================================================

DELETE FROM public.number_meanings WHERE category IN ('destiny','soul_urge') AND language = 'hi';

-- ---------- DESTINY (भाग्य संख्या / नाम संख्या) ----------
INSERT INTO public.number_meanings (number, category, language, title, purpose, strengths, challenges, careers, relationships, health, spiritual) VALUES
(1, 'destiny', 'hi', 'अग्रणी का भाग्य',
 'आपके नाम में नेतृत्व और मौलिक सोच का कंपन है। आप नई शुरुआत करने, विचारों में सबसे आगे खड़े होने और ऐसा कुछ बनाने के लिए हैं जो पहले मौजूद नहीं था। आपका भाग्य आत्मनिर्भर बनने और दूसरों को प्रेरित करने में है।',
 '{"स्वाभाविक नेतृत्व","मौलिकता","उपलब्धि की इच्छा","निर्णय क्षमता","आत्म-प्रेरणा"}',
 '{"हावी दिखना","धीमे लोगों के प्रति अधीरता","मदद माँगने में कठिनाई"}',
 '{"संस्थापक","निदेशक","आविष्कारक","विभाग प्रमुख","स्वतंत्र सलाहकार"}',
 'आप वहाँ सबसे अच्छा देते हैं जहाँ आपकी स्वतंत्रता का सम्मान हो। आदेश देने के बजाय निर्णय साझा करना सीखें।',
 'अकेले सब कुछ संभालने से तनाव और रक्तचाप बढ़ सकता है। गतिविधि और कार्य बाँटना आपकी रक्षा करता है।',
 'आपका आध्यात्मिक कार्य अहंकार के बिना नेतृत्व करना है — अपनी शक्ति से दूसरों को ऊपर उठाना।'),
(2, 'destiny', 'hi', 'राजनयिक का भाग्य',
 'आपके नाम का कंपन साझेदारी, संवेदनशीलता और शांत प्रभाव का है। आप लोगों को जोड़ने, मध्यस्थता करने और बल के बजाय सहयोग से सफलता पाने के लिए हैं।',
 '{"कूटनीति","गहरा अंतर्ज्ञान","धैर्य","निष्ठा","बारीकी पर ध्यान"}',
 '{"आलोचना के प्रति अति-संवेदनशीलता","संघर्ष से बचना","आत्म-संदेह"}',
 '{"सलाहकार","मध्यस्थ","एचआर विशेषज्ञ","डिज़ाइनर","टीम समन्वयक"}',
 'आप प्रेम में समर्पित और कोमल हैं। साथी में स्वयं को खोने से बचें — आपकी ज़रूरतें भी समान महत्व रखती हैं।',
 'भावनात्मक तनाव आपके तंत्रिका तंत्र और पाचन को प्रभावित करता है। शांत दिनचर्या संतुलन देती है।',
 'आपका मार्ग भीतरी शक्ति विकसित करना है ताकि कोमलता कमज़ोरी नहीं, चुनाव बने।'),
(3, 'destiny', 'hi', 'संवादक का भाग्य',
 'आपके नाम में अभिव्यक्ति, रचनात्मकता और आनंद की ऊर्जा है। आप शब्दों, कला या प्रदर्शन से संवाद करने और दूसरों का मन प्रसन्न करने के लिए हैं।',
 '{"वाक् व कला प्रतिभा","आशावाद","करिश्मा","कल्पनाशीलता","सामाजिक सहजता"}',
 '{"ऊर्जा बिखेरना","गहराई से बचना","मूड में उतार-चढ़ाव"}',
 '{"लेखक","कलाकार","मार्केटर","डिज़ाइनर","वक्ता"}',
 'आप प्रेम में हँसी और गर्माहट लाते हैं, पर साथी को आपका ध्यान भी चाहिए — आकर्षण जितनी सहजता से ध्यान भी दें।',
 'गला और त्वचा आपकी भावनात्मक स्थिति दर्शाते हैं। रचनात्मक माध्यम आपको स्वस्थ रखते हैं।',
 'आपका कार्य अपनी आवाज़ का उपयोग अर्थ के लिए करना है, केवल तालियों के लिए नहीं।'),
(4, 'destiny', 'hi', 'निर्माता का भाग्य',
 'आपके नाम का कंपन संरचना, अनुशासन और विश्वसनीयता का है। आप ऐसी मज़बूत नींव बनाने के लिए हैं जो आपके बाद भी टिके। आपका भाग्य निरंतर, ईमानदार परिश्रम से मिलता है।',
 '{"अनुशासन","विश्वसनीयता","व्यावहारिक कौशल","सहनशक्ति","निष्ठा"}',
 '{"कठोरता","परिवर्तन का विरोध","थकान तक काम करना"}',
 '{"इंजीनियर","वास्तुकार","ऑपरेशन मैनेजर","लेखाकार","निर्माता"}',
 'आप भरोसेमंद, प्रतिबद्ध साथी हैं। गर्माहट और सहजता को आने दें — केवल संरचना अपनों को ठंडी लग सकती है।',
 'हड्डियाँ, जोड़ और पीठ आपका तनाव सहते हैं। नियमित विश्राम और स्ट्रेचिंग ज़रूरी है।',
 'आपका मार्ग अनुशासन में लचीलापन पाना है — बिना अपनी ही दीवारों का कैदी बने।'),
(5, 'destiny', 'hi', 'खोजी का भाग्य',
 'आपके नाम में स्वतंत्रता, परिवर्तन और साहस का कंपन है। आप जीवन को व्यापक रूप से अनुभव करने, ढलने और दूसरों को बिना डर बदलाव अपनाना सिखाने के लिए हैं।',
 '{"अनुकूलनशीलता","आकर्षण","तेज़ सोच","साहस","बहुमुखी प्रतिभा"}',
 '{"बेचैनी","प्रतिबद्धता में कठिनाई","अति की प्रवृत्ति"}',
 '{"यात्रा/आतिथ्य","बिक्री","पत्रकारिता","उद्यमी","प्रशिक्षक"}',
 'आपको ऐसा साथी चाहिए जो स्थान दे और आपकी जिज्ञासा साझा करे। स्वतंत्रता और निष्ठा साथ रह सकते हैं।',
 'आपकी बेचैन ऊर्जा को आधार चाहिए — व्यसन और थकान से सावधान रहें।',
 'आपका कार्य भीतरी स्वतंत्रता पाना है, ताकि आप उसे हर नए अनुभव में न ढूँढें।'),
(6, 'destiny', 'hi', 'पालनकर्ता का भाग्य',
 'आपके नाम का कंपन ज़िम्मेदारी, देखभाल और सामंजस्य का है। आप परिवार और समुदाय की सेवा, उपचार और सौंदर्य-संतुलन बनाने के लिए हैं।',
 '{"करुणा","ज़िम्मेदारी","कलात्मक समझ","उपचारक उपस्थिति","निष्ठा"}',
 '{"अति-त्याग","चिंता","अपनों के प्रति पूर्णतावाद"}',
 '{"शिक्षक","स्वास्थ्य सेवा","परामर्शदाता","इंटीरियर डिज़ाइनर","शेफ"}',
 'आप गहराई से और रक्षात्मक रूप से प्रेम करते हैं। शहादत से बचें — दूसरों को भी आपकी देखभाल करने दें।',
 'हृदय और रक्त संचार आपका भावनात्मक भार दर्शाते हैं। सीमाएँ आपके लिए औषधि हैं।',
 'आपका मार्ग कमी से नहीं, पूर्णता से सेवा करना है — देने और आत्म-प्रेम में संतुलन।'),
(7, 'destiny', 'hi', 'साधक का भाग्य',
 'आपके नाम में ज्ञान, विश्लेषण और भीतरी सत्य का कंपन है। आप अध्ययन करने, चीज़ों की छिपी प्रकृति समझने और गहरी अंतर्दृष्टि बाँटने के लिए हैं।',
 '{"विश्लेषणात्मक मन","अंतर्ज्ञान","स्वतंत्रता","विचार की गहराई","विशेषज्ञता"}',
 '{"अलगाव","अति-विश्लेषण","दूसरों पर भरोसा करने में कठिनाई"}',
 '{"शोधकर्ता","विश्लेषक","वैज्ञानिक","दार्शनिक","आध्यात्मिक शिक्षक"}',
 'प्रेम में आपको बौद्धिक और आत्मिक जुड़ाव चाहिए; सतही रिश्ते थका देते हैं। लोगों को भीतर आने दें।',
 'मानसिक थकान और नींद आपके ध्यान बिंदु हैं। एकांत पुनर्जीवित करता है, पर अलगाव थकाता है।',
 'आपका मार्ग ज्ञान बाँटना है, संचित नहीं करना — एकांत को सेवा में बदलना।'),
(8, 'destiny', 'hi', 'कार्यकारी का भाग्य',
 'आपके नाम का कंपन शक्ति, महत्वाकांक्षा और भौतिक महारत का है। आप उद्यम चलाने, संसाधन प्रबंधन और समृद्धि रचने — फिर उसका बुद्धिमानी से उपयोग करने — के लिए हैं।',
 '{"व्यापारिक समझ","अधिकार","दृढ़ता","संगठन","बड़े स्तर की दृष्टि"}',
 '{"कार्य-व्यसन","नियंत्रण की प्रवृत्ति","मूल्य को धन से जोड़ना"}',
 '{"कार्यकारी","उद्यमी","निवेशक","वकील","रियल एस्टेट"}',
 'प्रेम में आपको सम्मान और साझा महत्वाकांक्षा चाहिए। नरम बनें — रिश्ते सौदे नहीं हैं।',
 'तनाव हृदय और पाचन पर असर डालता है। स्वास्थ्य के बिना सफलता का कोई अर्थ नहीं।',
 'आपका मार्ग यह सीखना है कि सच्ची शक्ति भीतरी है — और भौतिक सफलता को बड़े भले के लिए उपयोग करना।'),
(9, 'destiny', 'hi', 'मानवतावादी का भाग्य',
 'आपके नाम में करुणा, ज्ञान और सार्वभौमिक सेवा का कंपन है। आप मानवता को देने, व्यापक स्तर पर उपचार करने और चक्रों को कृपा से पूर्ण करने के लिए हैं।',
 '{"करुणा","व्यापक ज्ञान","उदारता","कलात्मक गहराई","क्षमा"}',
 '{"भावनात्मक अतिभार","छोड़ने में कठिनाई","आत्म-त्याग"}',
 '{"मानवीय कार्य","चिकित्सा","शिक्षण","कला","परामर्श"}',
 'आप सार्वभौमिक रूप से प्रेम करते हैं, कभी अंतरंगता की कीमत पर। सामने वाले के लिए उपस्थित रहें।',
 'आप दूसरों का दर्द सोख लेते हैं — भावनात्मक सीमाएँ आपकी ऊर्जा की रक्षा करती हैं।',
 'आपका मार्ग स्वयं को खोए बिना देना और जो पूर्ण हो चुका उसे छोड़ना है।'),
(11, 'destiny', 'hi', 'प्रेरक का भाग्य (मास्टर)',
 'आपके नाम में 11 का मास्टर कंपन है — प्रबोधन और आध्यात्मिक प्रेरणा। आप अंतर्ज्ञान, दृष्टि और उदाहरण से दूसरों को जगाने के लिए हैं। आपका भाग्य प्रकाश बनना है, केवल नेता नहीं।',
 '{"तीव्र अंतर्ज्ञान","प्रेरक उपस्थिति","दूरदर्शिता","संवेदनशीलता","आदर्शवाद"}',
 '{"तंत्रिका तनाव","दबाव में आत्म-संदेह","अपनी संवेदनशीलता से अभिभूत होना"}',
 '{"आध्यात्मिक शिक्षक","कलाकार","परामर्शदाता","दूरदर्शी संस्थापक","लेखक"}',
 'आपको ऐसा साथी चाहिए जो आपकी संवेदनशीलता समझे और मिशन में साथ दे। स्थिर प्रेम आपको संभालता है।',
 'आपका तंत्रिका तंत्र बहुत सूक्ष्म है — आधार देने वाले अभ्यास और विश्राम अनिवार्य हैं।',
 'आपका मार्ग अपने भीतरी प्रकाश पर भरोसा कर उसे चिंता नहीं, सेवा में लगाना है।'),
(22, 'destiny', 'hi', 'मास्टर निर्माता का भाग्य (मास्टर)',
 'आपके नाम में 22 का मास्टर कंपन है — बड़ी दृष्टि को स्थायी वास्तविकता में बदलने की शक्ति। आप बड़े स्तर पर निर्माण के लिए हैं: संस्थाएँ, आंदोलन या ऐसे कार्य जो अनेकों की सेवा करें।',
 '{"बड़े स्तर की दृष्टि","व्यावहारिक क्रियान्वयन","नेतृत्व","अनुशासन","स्थायी प्रभाव"}',
 '{"स्वयं पर भारी दबाव","अपनी शक्ति पर संदेह","कार्य-व्यसन"}',
 '{"बड़े संगठन प्रमुख","वास्तुकार","सिस्टम निर्माता","सामाजिक नेता","नवप्रवर्तक"}',
 'आपको ऐसा साथी चाहिए जो आपके मिशन का समर्थन करे, उससे प्रतिस्पर्धा न करे।',
 'आपकी महत्वाकांक्षा का भार शरीर-मन पर पड़ता है — गति संभालें, विश्राम भी कार्य का हिस्सा है।',
 'आपका मार्ग विशाल आध्यात्मिक क्षमता को अनेकों के व्यावहारिक भले में उतारना है।'),
(33, 'destiny', 'hi', 'मास्टर शिक्षक का भाग्य (मास्टर)',
 'आपके नाम में 33 का दुर्लभ मास्टर कंपन है — बिना शर्त प्रेम और करुणामय शिक्षण। आप निःस्वार्थ सेवा और अपने अस्तित्व के उदाहरण से उपचार करने के लिए हैं।',
 '{"बिना शर्त प्रेम","उपचारक उपस्थिति","ज्ञान","समर्पण","प्रेरक शिक्षण"}',
 '{"थकान तक आत्म-त्याग","दूसरों का बोझ उठाना","असंभव रूप से ऊँची अपेक्षाएँ"}',
 '{"उपचारक","आध्यात्मिक नेता","मानवतावादी","परामर्शदाता","शिक्षकों के शिक्षक"}',
 'प्रेम आपका उद्देश्य है। ऐसे साथी चुनें जो आपकी गहराई से मेल खाएँ और बदले में आपको भरें।',
 'आपके हृदय — शारीरिक और भावनात्मक — को पोषण चाहिए। जितनी सेवा, उतना ही आत्म-प्रेम करें।',
 'आपका मार्ग करुणा को मूर्त रूप देना है, केवल उपस्थिति से उपचार करना।');

-- ---------- SOUL URGE (आत्मा की इच्छा / हृदय संख्या) ----------
INSERT INTO public.number_meanings (number, category, language, title, purpose, strengths, challenges, careers, relationships, health, spiritual) VALUES
(1, 'soul_urge', 'hi', 'स्वतंत्रता चाहने वाला हृदय',
 'गहराई में आपका हृदय अपने पैरों पर खड़े होकर मौलिक पहचान चाहता है। आप तब सबसे जीवंत महसूस करते हैं जब नेतृत्व करते हैं या कुछ नया रचते हैं। आपकी भीतरी प्रेरणा सबसे आगे और स्वतंत्र रहने की है।',
 '{"भीतरी साहस","आत्म-विश्वास","अग्रणी इच्छा","दृढ़ता"}',
 '{"स्वीकृति की छिपी ज़रूरत","शिखर पर अकेलापन","परस्पर निर्भरता से बचना"}',
 '{"नेतृत्व","एकल उद्यम","रचनात्मक नवाचार"}',
 'आप गुप्त रूप से ऐसा साथी चाहते हैं जो आपकी शक्ति की प्रशंसा करे पर बराबरी से मिले। भेद्यता आपकी वृद्धि है।',
 'दबाई हुई निराशा तनाव बनकर दिखती है। स्वायत्तता की ज़रूरत का सम्मान आपको स्वस्थ रखता है।',
 'आपकी आत्मा सीखती है कि सच्ची स्वतंत्रता में दूसरों को भीतर आने देना भी शामिल है।'),
(2, 'soul_urge', 'hi', 'सामंजस्य चाहने वाला हृदय',
 'आपकी गहरी इच्छा शांति, निकटता और प्रेमपूर्ण जुड़ाव की है। आप चाहते हैं कि आपकी ज़रूरत हो, आप किसी के हों और भावनात्मक सुरक्षा महसूस करें।',
 '{"भावनात्मक गहराई","प्रेम क्षमता","संवेदनशीलता","समर्पण"}',
 '{"अस्वीकृति का डर","दूसरों को खुश करना","स्वयं को खोना"}',
 '{"सहायक साझेदारी","देखभाल कार्य","मध्यस्थता"}',
 'आप गहरे, सुरक्षित बंधन चाहते हैं। ऐसे लोग चुनें जो आपकी कोमलता को महत्व दें, उसका फायदा न उठाएँ।',
 'भावनात्मक उथल-पुथल पेट और तंत्रिकाओं को परेशान करती है। शांति आपके लिए उपचार है।',
 'आपकी आत्मा सीखती है कि आप स्वयं को मिटाए बिना गहराई से प्रेम कर सकते हैं।'),
(3, 'soul_urge', 'hi', 'अभिव्यक्ति चाहने वाला हृदय',
 'आपका भीतरी स्व रचना करने, देखे जाने और आनंद फैलाने को तरसता है। आप तब संतुष्ट होते हैं जब भीतर की बात — शब्दों, कला या हँसी से — व्यक्त कर पाते हैं।',
 '{"रचनात्मक चाह","गर्माहट","खिलंदड़ापन","भावनात्मक खुलापन"}',
 '{"निरंतर मान्यता की ज़रूरत","भावनाएँ बिखेरना","कठिन भावों से बचना"}',
 '{"रचनात्मक कला","संचार","मनोरंजन"}',
 'आप ऐसा साथी चाहते हैं जो आपका उत्सव मनाए और प्रेरित करे। चमक के नीचे आप सच में समझे जाना चाहते हैं।',
 'दबी भावनाएँ गले और मूड पर असर डालती हैं। अभिव्यक्ति आपका निकास है।',
 'आपकी आत्मा केवल आकर्षण नहीं, सत्य व्यक्त करना सीखती है।'),
(4, 'soul_urge', 'hi', 'सुरक्षा चाहने वाला हृदय',
 'गहराई में आप स्थिरता, व्यवस्था और भरोसेमंद नींव चाहते हैं। आप तब शांत होते हैं जब जीवन भरोसेमंद हो और मेहनत कुछ स्थायी बनाए।',
 '{"निष्ठा","स्थिरता","भीतरी अनुशासन","विश्वसनीयता"}',
 '{"अस्थिरता का डर","असुरक्षा से उपजी कठोरता","आराम में कठिनाई"}',
 '{"संरचित कार्य","दीर्घकालिक परियोजनाएँ","प्रबंधन"}',
 'आप एक स्थिर, वफादार साथी चाहते हैं जिसके साथ जीवन बना सकें। प्रेम को शरण बनने दें, एक और कर्तव्य नहीं।',
 'चिंता पीठ और जोड़ों में बसती है। जीवन पर भरोसा पकड़ ढीली करता है।',
 'आपकी आत्मा सीखती है कि असली सुरक्षा भीतरी है, केवल ईंटों की नहीं।'),
(5, 'soul_urge', 'hi', 'स्वतंत्रता चाहने वाला हृदय',
 'आपकी गहरी इच्छा स्वतंत्रता, विविधता और नए अनुभव की है। आप तब जीवंत होते हैं जब कोई बंधन न हो और अगला रोमांच खुला हो।',
 '{"जीवन से प्रेम","अनुकूलनशीलता","जिज्ञासा","साहस"}',
 '{"फँसने का डर","प्रेम में बेचैनी","प्रतिबद्धता से बचना"}',
 '{"यात्रा","गतिशील भूमिकाएँ","विविधता भरा कार्य"}',
 'आप ऐसा साथी चाहते हैं जो स्वयं एक रोमांच हो, लंगर नहीं। स्वतंत्रता और समर्पण साथ रह सकते हैं।',
 'बेचैन ऊर्जा को निकास चाहिए, वरना अति बन जाती है। गति आपको स्थिर रखती है।',
 'आपकी आत्मा सीखती है कि गहरी स्वतंत्रता भीतर है, निरंतर भागने में नहीं।'),
(6, 'soul_urge', 'hi', 'प्रेम करने और पाने वाला हृदय',
 'आपका भीतरी स्व प्रेमपूर्ण घर, परिवार और दूसरों की देखभाल का अवसर चाहता है। आप तब पूर्ण होते हैं जब अपनों के लिए पोषण और सामंजस्य रचते हैं।',
 '{"गहरी देखभाल","निष्ठा","रक्षा की इच्छा","सौंदर्य बोध"}',
 '{"अति-ज़िम्मेदारी","ज़रूरत महसूस होने की चाह","आत्म-उपेक्षा"}',
 '{"परिवार-केंद्रित कार्य","उपचार","सुंदर स्थान रचना"}',
 'आप समर्पण और साझा घर चाहते हैं। ध्यान रखें आपका देना सराहा जाए, हल्के में न लिया जाए।',
 'आप दूसरों का तनाव हृदय में लेते हैं। सीमाएँ आपकी देखभाल को टिकाऊ बनाती हैं।',
 'आपकी आत्मा प्रेम पाना उतनी ही सहजता से सीखती है जितना देना।'),
(7, 'soul_urge', 'hi', 'सत्य चाहने वाला हृदय',
 'भीतर गहरे आप समझ, एकांत और सतह के नीचे के अर्थ को तरसते हैं। आप तब संतुष्ट होते हैं जब समझ पाते हैं कि चीज़ें सच में कैसे काम करती हैं।',
 '{"भीतरी गहराई","सत्य से प्रेम","आध्यात्मिक चाह","शांत शक्ति"}',
 '{"भावनात्मक सतर्कता","चोट लगने पर पीछे हटना","अकेलापन"}',
 '{"शोध","आध्यात्मिक या विश्लेषणात्मक कार्य","विशेषज्ञ गहराई"}',
 'आप आत्मा तक गहरा, ईमानदार जुड़ाव चाहते हैं। भरोसेमंद लोगों को अपनी भीतरी दीवारों के पार आने दें।',
 'मानसिक अति-सक्रियता नींद बिगाड़ती है। शांति और प्रकृति आपको पुनर्जीवित करती है।',
 'आपकी आत्मा सीखती है कि ज्ञान बाँटने के लिए है, छिपाने के लिए नहीं।'),
(8, 'soul_urge', 'hi', 'उपलब्धि चाहने वाला हृदय',
 'आपकी गहरी इच्छा सफलता, मान्यता और अपनी दुनिया को आकार देने की शक्ति की है। आप तब पूर्ण होते हैं जब आपकी मेहनत असली परिणाम लाए।',
 '{"महत्वाकांक्षा","प्रेरणा","दृढ़ता","प्रदान करने की इच्छा"}',
 '{"आत्म-मूल्य को परिणाम से जोड़ना","छिपी असुरक्षा","आराम में कठिनाई"}',
 '{"व्यवसाय","नेतृत्व","धन निर्माण"}',
 'आप ऐसा साथी चाहते हैं जो आपकी प्रेरणा का सम्मान करे और साथ खड़ा हो। प्रेम को ऐसी जगह बनने दें जहाँ प्रदर्शन न करना पड़े।',
 'दबाव हृदय और पाचन पर असर डालता है। मूल्य उत्पादन से नहीं मापा जाता।',
 'आपकी आत्मा सीखती है कि संतुष्टि उद्देश्य से आती है, केवल संचय से नहीं।'),
(9, 'soul_urge', 'hi', 'देने वाला हृदय',
 'गहराई में आप फर्क लाने, उपचार करने और मानवता से व्यापक प्रेम करने को तरसते हैं। आप तब पूर्ण होते हैं जब आपका जीवन स्वयं से बड़ी किसी चीज़ की सेवा करे।',
 '{"करुणा","आदर्शवाद","उदारता","भावनात्मक ज्ञान"}',
 '{"सबको बचाना पर स्वयं को नहीं","व्यक्तिगत अंतरंगता में कठिनाई","पुराने दर्द को पकड़े रहना"}',
 '{"सेवा पेशे","संदेशपरक कला","मानवीय भूमिकाएँ"}',
 'आप व्यापक रूप से प्रेम करते हैं; याद रखें पास खड़े व्यक्ति को आपकी केंद्रित उपस्थिति भी चाहिए।',
 'आप दुनिया का दुख सोखते हैं। भावनात्मक निकास आपको स्वस्थ रखता है।',
 'आपकी आत्मा अधिकता से देना और अतीत को छोड़ना सीखती है।'),
(11, 'soul_urge', 'hi', 'प्रेरित करने वाला हृदय (मास्टर)',
 'आपका भीतरी स्व दूसरों को ऊपर उठाने और जगाने, अंतर्ज्ञान से जीने और किसी उच्चतर से जुड़ने को तरसता है। आप तब पूर्ण होते हैं जब प्रेरणा देते हैं।',
 '{"आध्यात्मिक चाह","अंतर्ज्ञान की गहराई","आदर्शवाद","प्रेरक गर्माहट"}',
 '{"तंत्रिका संवेदनशीलता","आत्म-संदेह","गलत समझे जाने का अहसास"}',
 '{"प्रेरक या उपचार कार्य","शिक्षण","रचनात्मक-आध्यात्मिक भूमिकाएँ"}',
 'आप ऐसा साथी चाहते हैं जो आपकी भीतरी दुनिया का सम्मान करे और संवेदनशीलता को संभाले।',
 'आपकी सूक्ष्म तंत्रिकाओं को आधार और कोमल दिनचर्या चाहिए।',
 'आपकी आत्मा अपने प्रकाश पर भरोसा कर संवेदनशीलता को सेवा में बदलना सीखती है।'),
(22, 'soul_urge', 'hi', 'स्थायी प्रभाव चाहने वाला हृदय (मास्टर)',
 'भीतर गहरे आप ऐसा कुछ बनाने को तरसते हैं जो सच में मायने रखे और अनेकों की सेवा करे। आप तब पूर्ण होते हैं जब विशाल दृष्टि असली, स्थायी भला बने।',
 '{"दूरदर्शी चाह","निर्माण की प्रेरणा","अनुशासन","बड़े स्तर पर सेवा की इच्छा"}',
 '{"भारी आत्म-अपेक्षा","अपनी क्षमता का डर","अति-कार्य"}',
 '{"बड़े स्तर का निर्माण","सिस्टम व संस्थाएँ","दूरदर्शी नेतृत्व"}',
 'आप ऐसा साथी चाहते हैं जो आपके मिशन में विश्वास करे और आपको उसमें मानवीय बने रहने में मदद करे।',
 'आप जो भार उठाते हैं उसे निकास चाहिए — विश्राम विलासिता नहीं, ईंधन है।',
 'आपकी आत्मा विशाल क्षमता को धैर्यपूर्ण, व्यावहारिक भले में उतारना सीखती है।'),
(33, 'soul_urge', 'hi', 'प्रेम से उपचार करने वाला हृदय (मास्टर)',
 'आपकी गहरी इच्छा बिना शर्त प्रेम करने और करुणा से दूसरों को ठीक करने की है। आप तब पूर्ण होते हैं जब आपकी उपस्थिति पीड़ितों को सांत्वना दे।',
 '{"असीम करुणा","उपचारक समर्पण","ज्ञान","निःस्वार्थ प्रेम"}',
 '{"खाली होने तक देना","सबका दर्द उठाना","अपनी ज़रूरतों की उपेक्षा"}',
 '{"उपचार","आध्यात्मिक शिक्षण","करुणामय सेवा"}',
 'प्रेम आपके होने का कारण है। ऐसे लोग चुनें जो आपको भी भरें जितना आप उनके लिए बहते हैं।',
 'आपके हृदय को उतनी ही देखभाल चाहिए जितनी आप देते हैं। आत्म-करुणा अनिवार्य औषधि है।',
 'आपकी आत्मा सीखती है कि दूसरों का उपचार स्वयं को ठीक करने से शुरू होता है।');


-- =====================================================================
-- BUNDLED FILE: seeds/seed_destiny_soulurge_hinglish.sql
-- =====================================================================

-- ============================================================
-- Phase 1b: DESTINY + SOUL URGE meanings (Hinglish)
-- Additive seed for public.number_meanings
-- Numbers: 1-9, 11, 22, 33  | language: hinglish
-- Safe to re-run.
-- ============================================================

DELETE FROM public.number_meanings WHERE category IN ('destiny','soul_urge') AND language = 'hinglish';

-- ---------- DESTINY ----------
INSERT INTO public.number_meanings (number, category, language, title, purpose, strengths, challenges, careers, relationships, health, spiritual) VALUES
(1, 'destiny', 'hinglish', 'Pioneer Ka Destiny',
 'Aapke naam mein leadership aur original soch ka vibration hai. Aap naye ideas start karne, sabse aage khade hone aur kuch aisa banane ke liye ho jo pehle nahi tha. Aapka destiny self-reliant banna aur doosron ko inspire karna hai.',
 '{"Natural leadership","Originality","Achieve karne ki drive","Decisiveness","Self-motivation"}',
 '{"Dominating dikhna","Slow logon par impatience","Help maangne mein difficulty"}',
 '{"Founder","Director","Inventor","Department head","Independent consultant"}',
 'Aap wahan best dete ho jahan aapki independence respect ho. Order dene ke bajaye decisions share karna seekho.',
 'Sab kuch akele sambhalne se tension aur BP badh sakta hai. Movement aur kaam delegate karna aapko bachata hai.',
 'Aapka spiritual kaam ego ke bina lead karna hai — apni strength se doosron ko upar uthana.'),
(2, 'destiny', 'hinglish', 'Diplomat Ka Destiny',
 'Aapke naam ka vibration partnership, sensitivity aur quiet influence ka hai. Aap logon ko jodne, mediate karne aur force ke bajaye cooperation se success paane ke liye ho.',
 '{"Diplomacy","Deep intuition","Patience","Loyalty","Detail par dhyan"}',
 '{"Criticism par over-sensitive","Conflict se bachna","Self-doubt"}',
 '{"Counselor","Mediator","HR specialist","Designer","Team coordinator"}',
 'Aap love mein devoted aur tender ho. Partner mein khud ko khone se bacho — aapki needs bhi equally matter karti hain.',
 'Emotional stress aapke nervous system aur digestion ko affect karta hai. Calm routine balance deti hai.',
 'Aapka path inner strength banana hai taaki gentleness weakness nahi, choice ban jaye.'),
(3, 'destiny', 'hinglish', 'Communicator Ka Destiny',
 'Aapke naam mein expression, creativity aur joy ki energy hai. Aap words, art ya performance se communicate karne aur doosron ka mood uplift karne ke liye ho.',
 '{"Verbal aur artistic talent","Optimism","Charisma","Imagination","Social ease"}',
 '{"Energy bikherna","Depth se bachna","Mood swings"}',
 '{"Writer","Performer","Marketer","Designer","Public speaker"}',
 'Aap love mein hansi aur warmth late ho, par partner ko aapka focus bhi chahiye — charm jitni asaani se attention bhi do.',
 'Throat aur skin aapki emotional state dikhate hain. Creative outlets aapko healthy rakhte hain.',
 'Aapka task apni awaaz ka use meaning ke liye karna hai, sirf applause ke liye nahi.'),
(4, 'destiny', 'hinglish', 'Builder Ka Destiny',
 'Aapke naam ka vibration structure, discipline aur reliability ka hai. Aap aisi solid foundation banane ke liye ho jo aapke baad bhi tike. Aapka destiny steady, honest mehnat se milta hai.',
 '{"Discipline","Trustworthiness","Practical skill","Endurance","Loyalty"}',
 '{"Rigidity","Change ka resistance","Exhaustion tak kaam"}',
 '{"Engineer","Architect","Operations manager","Accountant","Builder"}',
 'Aap dependable, committed partner ho. Warmth aur spontaneity ko aane do — sirf structure apno ko cold lag sakta hai.',
 'Bones, joints aur back aapka stress carry karte hain. Regular rest aur stretching zaroori hai.',
 'Aapka path discipline mein flexibility paana hai — apni hi walls ka kaidi bane bina.'),
(5, 'destiny', 'hinglish', 'Explorer Ka Destiny',
 'Aapke naam mein freedom, change aur adventure ka vibration hai. Aap life ko widely experience karne, adapt karne aur doosron ko bina dar change apnana sikhane ke liye ho.',
 '{"Adaptability","Magnetism","Quick thinking","Courage","Versatility"}',
 '{"Restlessness","Commit karne mein difficulty","Excess ki tendency"}',
 '{"Travel/hospitality","Sales","Journalism","Entrepreneur","Trainer"}',
 'Aapko aisa partner chahiye jo space de aur aapki curiosity share kare. Freedom aur loyalty saath reh sakte hain.',
 'Aapki nervous energy ko grounding chahiye — addictions aur burnout se bacho.',
 'Aapka kaam inner freedom paana hai, taaki use har naye experience mein na dhundho.'),
(6, 'destiny', 'hinglish', 'Nurturer Ka Destiny',
 'Aapke naam ka vibration responsibility, care aur harmony ka hai. Aap family aur community ki seva, healing aur beauty-balance banane ke liye ho.',
 '{"Compassion","Responsibility","Artistic sense","Healing presence","Loyalty"}',
 '{"Over-giving","Worry","Apno ke prati perfectionism"}',
 '{"Teacher","Healthcare","Counselor","Interior designer","Chef"}',
 'Aap deeply aur protectively pyaar karte ho. Martyrdom se bacho — doosron ko bhi aapki care karne do.',
 'Heart aur circulation aapka emotional load dikhate hain. Boundaries aapke liye medicine hain.',
 'Aapka path fullness se seva karna hai, depletion se nahi — dene aur self-love mein balance.'),
(7, 'destiny', 'hinglish', 'Seeker Ka Destiny',
 'Aapke naam mein wisdom, analysis aur inner truth ka vibration hai. Aap study karne, cheezon ki hidden nature samajhne aur deep insight share karne ke liye ho.',
 '{"Analytical mind","Intuition","Independence","Depth of thought","Specialist focus"}',
 '{"Isolation","Over-thinking","Doosron par trust karne mein difficulty"}',
 '{"Researcher","Analyst","Scientist","Philosopher","Spiritual teacher"}',
 'Love mein aapko intellectual aur soul connection chahiye; shallow bonds thaka dete hain. Logon ko apni inner world mein aane do.',
 'Mental fatigue aur sleep aapke watch points hain. Solitude restore karta hai, par isolation drain karta hai.',
 'Aapka path wisdom share karna hai, hoard karna nahi — solitude ko service mein badalna.'),
(8, 'destiny', 'hinglish', 'Executive Ka Destiny',
 'Aapke naam ka vibration power, ambition aur material mastery ka hai. Aap enterprises lead karne, resources manage karne aur abundance banane — phir use wisely use karne — ke liye ho.',
 '{"Business instinct","Authority","Resilience","Organization","Scale ki vision"}',
 '{"Workaholism","Control issues","Worth ko money se jodna"}',
 '{"Executive","Entrepreneur","Investor","Lawyer","Real estate"}',
 'Love mein aapko respect aur shared ambition chahiye. Soften ho — relationships deals nahi hain jo manage karne hain.',
 'Stress heart aur digestion ko target karta hai. Health ke bina success ka matlab kam hai.',
 'Aapka path yeh seekhna hai ki sachi power inner hai — aur material success ko greater good ke liye use karna.'),
(9, 'destiny', 'hinglish', 'Humanitarian Ka Destiny',
 'Aapke naam mein compassion, wisdom aur universal service ka vibration hai. Aap humanity ko dene, wide scale par healing karne aur cycles ko grace se complete karne ke liye ho.',
 '{"Compassion","Broad wisdom","Generosity","Artistic depth","Forgiveness"}',
 '{"Emotional overwhelm","Letting go mein difficulty","Self-sacrifice"}',
 '{"Humanitarian work","Medicine","Teaching","Arts","Counseling"}',
 'Aap universally pyaar karte ho, kabhi intimacy ki keemat par. Saamne wale person ke liye present raho.',
 'Aap doosron ka dard absorb karte ho — emotional boundaries aapki energy bachati hain.',
 'Aapka path khud ko khoye bina dena aur jo complete ho gaya use chhodna hai.'),
(11, 'destiny', 'hinglish', 'Inspirer Ka Destiny (Master)',
 'Aapke naam mein 11 ka master vibration hai — illumination aur spiritual inspiration. Aap intuition, vision aur example se doosron ko jagane ke liye ho. Aapka destiny light banna hai, sirf leader nahi.',
 '{"Tez intuition","Inspirational presence","Visionary insight","Sensitivity","Idealism"}',
 '{"Nervous tension","Pressure mein self-doubt","Apni sensitivity se overwhelmed hona"}',
 '{"Spiritual teacher","Artist","Counselor","Visionary founder","Writer"}',
 'Aapko aisa partner chahiye jo aapki sensitivity samjhe aur mission mein saath de. Grounding love aapko steady karta hai.',
 'Aapka nervous system bahut fine-tuned hai — grounding practices aur rest essential hain.',
 'Aapka path apne inner light par trust karke use anxiety nahi, service mein lagana hai.'),
(22, 'destiny', 'hinglish', 'Master Builder Ka Destiny (Master)',
 'Aapke naam mein 22 ka master vibration hai — badi vision ko lasting reality mein badalne ki power. Aap bade scale par build karne ke liye ho: institutions, movements ya aise kaam jo bahut logon ki seva karein.',
 '{"Large-scale vision","Practical execution","Leadership","Discipline","Lasting impact"}',
 '{"Khud par bhaari pressure","Apni power par doubt","Workaholism"}',
 '{"Bade organization head","Architect","Systems builder","Social leader","Innovator"}',
 'Aapko aisa partner chahiye jo aapke mission ko support kare, usse compete na kare.',
 'Aapki ambition ka weight body-mind par padta hai — pace karo, rest bhi kaam ka hissa hai.',
 'Aapka path vast spiritual potential ko bahut logon ke practical bhale mein utarna hai.'),
(33, 'destiny', 'hinglish', 'Master Teacher Ka Destiny (Master)',
 'Aapke naam mein 33 ka rare master vibration hai — unconditional love aur compassionate teaching. Aap selfless service aur apne hone ke example se healing karne ke liye ho.',
 '{"Unconditional love","Healing presence","Wisdom","Devotion","Inspirational teaching"}',
 '{"Depletion tak self-sacrifice","Doosron ka bojh uthana","Impossibly high expectations"}',
 '{"Healer","Spiritual leader","Humanitarian","Counselor","Teachers ke teacher"}',
 'Love aapka purpose hai. Aise partners chuno jo aapki depth se match karein aur badle mein aapko replenish karein.',
 'Aapke heart — physical aur emotional — ko nurturing chahiye. Jitni service, utna hi self-love karo.',
 'Aapka path compassion ko embody karna hai, sirf presence se healing karna.');

-- ---------- SOUL URGE ----------
INSERT INTO public.number_meanings (number, category, language, title, purpose, strengths, challenges, careers, relationships, health, spiritual) VALUES
(1, 'soul_urge', 'hinglish', 'Independence Chahne Wala Dil',
 'Gehrai mein aapka dil apne pairon par khade hokar original pehchan chahta hai. Aap tab sabse alive feel karte ho jab lead karte ho ya kuch naya rachte ho. Aapki inner drive sabse aage aur free rehne ki hai.',
 '{"Inner courage","Self-belief","Pioneering desire","Determination"}',
 '{"Approval ki hidden zaroorat","Top par loneliness","Interdependence se bachna"}',
 '{"Leadership","Solo ventures","Creative innovation"}',
 'Aap secretly aisa partner chahte ho jo aapki strength admire kare par barabari se mile. Vulnerability aapki growth hai.',
 'Dabai hui frustration tension banke dikhti hai. Autonomy ki zaroorat ka respect aapko healthy rakhta hai.',
 'Aapki soul seekhti hai ki sachi independence mein doosron ko andar aane dena bhi shaamil hai.'),
(2, 'soul_urge', 'hinglish', 'Harmony Chahne Wala Dil',
 'Aapki gehri ichha peace, closeness aur loving connection ki hai. Aap chahte ho ki aapki zaroorat ho, aap kisi ke ho aur emotional safety feel karo.',
 '{"Emotional depth","Pyaar ki capacity","Sensitivity","Devotion"}',
 '{"Rejection ka dar","People-pleasing","Khud ko khona"}',
 '{"Supportive partnerships","Care work","Mediation"}',
 'Aap deep, secure bonds chahte ho. Aise log chuno jo aapki tenderness ko value karein, exploit na karein.',
 'Emotional turmoil pet aur nerves ko unsettle karta hai. Peace aapke liye literally healing hai.',
 'Aapki soul seekhti hai ki aap khud ko mitaye bina deeply pyaar kar sakte ho.'),
(3, 'soul_urge', 'hinglish', 'Expression Chahne Wala Dil',
 'Aapka inner self rachne, dekha jaane aur joy failane ko tarasta hai. Aap tab fulfilled feel karte ho jab andar ki baat — words, art ya hansi se — express kar pao.',
 '{"Creative chaah","Warmth","Playfulness","Emotional openness"}',
 '{"Constant validation ki zaroorat","Feelings bikherna","Hard emotions se bachna"}',
 '{"Creative arts","Communication","Entertainment"}',
 'Aap aisa partner chahte ho jo aapka celebration kare aur inspire kare. Sparkle ke neeche aap sach mein samjhe jaana chahte ho.',
 'Bottled-up feelings throat aur mood par asar dalti hain. Expression aapka release valve hai.',
 'Aapki soul sirf charm nahi, truth express karna seekhti hai.'),
(4, 'soul_urge', 'hinglish', 'Security Chahne Wala Dil',
 'Gehrai mein aap stability, order aur bharosemand foundation chahte ho. Aap tab peace mein hote ho jab life dependable ho aur mehnat kuch lasting banaye.',
 '{"Loyalty","Steadiness","Inner discipline","Reliability"}',
 '{"Instability ka dar","Insecurity se rigidity","Relax karne mein difficulty"}',
 '{"Structured work","Long-term projects","Stewardship"}',
 'Aap ek steady, faithful partner chahte ho jiske saath life build kar sako. Love ko refuge banne do, ek aur duty nahi.',
 'Worry back aur joints mein basti hai. Life par bharosa grip dheeli karta hai.',
 'Aapki soul seekhti hai ki real security inner hai, sirf bricks ki nahi.'),
(5, 'soul_urge', 'hinglish', 'Freedom Chahne Wala Dil',
 'Aapki gehri ichha freedom, variety aur naye experience ki hai. Aap tab alive feel karte ho jab koi bandhan na ho aur agla adventure khula ho.',
 '{"Life se pyaar","Adaptability","Curiosity","Boldness"}',
 '{"Trapped hone ka dar","Love mein restlessness","Commitment se bachna"}',
 '{"Travel","Dynamic roles","Variety bhara work"}',
 'Aap aisa partner chahte ho jo khud ek adventure ho, anchor nahi. Freedom aur devotion saath reh sakte hain.',
 'Restless energy ko outlets chahiye, warna excess ban jaati hai. Movement aapko steady rakhta hai.',
 'Aapki soul seekhti hai ki sabse deep freedom andar hai, constant escape mein nahi.'),
(6, 'soul_urge', 'hinglish', 'Pyaar Karne Aur Paane Wala Dil',
 'Aapka inner self ek loving ghar, family aur doosron ki care ka mauka chahta hai. Aap tab complete feel karte ho jab apno ke liye nurturing aur harmony rachte ho.',
 '{"Deep caring","Loyalty","Protect karne ki ichha","Sense of beauty"}',
 '{"Over-responsibility","Needed feel karne ki chaah","Self-neglect"}',
 '{"Family-centered work","Healing","Sundar spaces rachna"}',
 'Aap devotion aur shared ghar chahte ho. Dhyan rakho aapka dena saraha jaye, granted na liya jaye.',
 'Aap doosron ka stress dil mein lete ho. Boundaries aapki caregiving ko sustainable banati hain.',
 'Aapki soul pyaar paana utni hi asaani se seekhti hai jitna dena.'),
(7, 'soul_urge', 'hinglish', 'Truth Chahne Wala Dil',
 'Andar gehre aap understanding, solitude aur surface ke neeche ke meaning ko taraste ho. Aap tab fulfilled feel karte ho jab samajh pao ki cheezein sach mein kaise kaam karti hain.',
 '{"Inner depth","Truth se pyaar","Spiritual chaah","Quiet strength"}',
 '{"Emotional guardedness","Hurt hone par withdraw karna","Loneliness"}',
 '{"Research","Spiritual ya analytical work","Specialist depth"}',
 'Aap soul-deep, honest connection chahte ho. Trusted logon ko apni inner walls ke paar aane do.',
 'Mental over-activity neend kharab karti hai. Quiet aur nature aapko restore karte hain.',
 'Aapki soul seekhti hai ki wisdom share karne ke liye hai, chhupane ke liye nahi.'),
(8, 'soul_urge', 'hinglish', 'Achievement Chahne Wala Dil',
 'Aapki gehri ichha success, recognition aur apni duniya ko shape dene ki power ki hai. Aap tab fulfilled feel karte ho jab aapki mehnat real results laye.',
 '{"Ambition","Drive","Resilience","Provide karne ki ichha"}',
 '{"Self-worth ko results se jodna","Hidden insecurity","Rest karne mein difficulty"}',
 '{"Business","Leadership","Wealth building"}',
 'Aap aisa partner chahte ho jo aapki drive respect kare aur saath khada ho. Love ko aisi jagah banne do jahan perform na karna pade.',
 'Pressure heart aur digestion ko target karta hai. Worth output se nahi mapa jaata.',
 'Aapki soul seekhti hai ki fulfillment purpose se aata hai, sirf accumulation se nahi.'),
(9, 'soul_urge', 'hinglish', 'Dene Wala Dil',
 'Gehrai mein aap farak laane, healing karne aur humanity se broadly pyaar karne ko taraste ho. Aap tab complete feel karte ho jab aapki life khud se badi kisi cheez ki seva kare.',
 '{"Compassion","Idealism","Generosity","Emotional wisdom"}',
 '{"Sabko bachana par khud ko nahi","Personal intimacy mein difficulty","Purane dard ko pakde rehna"}',
 '{"Service professions","Message wali arts","Humanitarian roles"}',
 'Aap widely pyaar karte ho; yaad rakho paas khade person ko aapki focused presence bhi chahiye.',
 'Aap duniya ka dukh absorb karte ho. Emotional release aapko healthy rakhta hai.',
 'Aapki soul overflow se dena aur past ko jaane dena seekhti hai.'),
(11, 'soul_urge', 'hinglish', 'Inspire Karne Wala Dil (Master)',
 'Aapka inner self doosron ko uplift aur awaken karne, intuition se jeene aur kisi higher se judne ko tarasta hai. Aap tab fulfilled feel karte ho jab inspire karte ho.',
 '{"Spiritual chaah","Intuitive depth","Idealism","Inspirational warmth"}',
 '{"Nervous sensitivity","Self-doubt","Galat samjhe jaane ka ehsaas"}',
 '{"Inspirational ya healing work","Teaching","Creative-spiritual roles"}',
 'Aap aisa partner chahte ho jo aapki inner world honor kare aur sensitivity ko steady kare.',
 'Aapki fine-tuned nerves ko grounding aur gentle routine chahiye.',
 'Aapki soul apne light par trust karke sensitivity ko service mein badalna seekhti hai.'),
(22, 'soul_urge', 'hinglish', 'Lasting Impact Chahne Wala Dil (Master)',
 'Andar gehre aap kuch aisa banane ko taraste ho jo sach mein matter kare aur bahut logon ki seva kare. Aap tab fulfilled feel karte ho jab grand vision real, lasting good bane.',
 '{"Visionary chaah","Build karne ki drive","Discipline","Scale par seva ki ichha"}',
 '{"Crushing self-expectation","Apne potential ka dar","Overwork"}',
 '{"Large-scale building","Systems aur institutions","Visionary leadership"}',
 'Aap aisa partner chahte ho jo aapke mission mein believe kare aur usme human bane rehne mein madad kare.',
 'Aap jo weight uthate ho use release chahiye — rest luxury nahi, fuel hai.',
 'Aapki soul vast potential ko patient, practical good mein utarna seekhti hai.'),
(33, 'soul_urge', 'hinglish', 'Pyaar Se Healing Karne Wala Dil (Master)',
 'Aapki gehri ichha unconditional pyaar karne aur compassion se doosron ko theek karne ki hai. Aap tab complete feel karte ho jab aapki presence suffer karne walon ko comfort de.',
 '{"Boundless compassion","Healing devotion","Wisdom","Selfless love"}',
 '{"Khali hone tak dena","Sabka dard uthana","Apni needs ki upeksha"}',
 '{"Healing","Spiritual teaching","Compassionate service"}',
 'Love aapke hone ka reason hai. Aise log chuno jo aapko bhi replenish karein jitna aap unke liye behte ho.',
 'Aapke dil ko utni hi care chahiye jitni aap dete ho. Self-compassion essential medicine hai.',
 'Aapki soul seekhti hai ki doosron ki healing khud ko theek karne se shuru hoti hai.');


-- =====================================================================
-- BUNDLED FILE: seeds/seed_compatibility_en.sql
-- =====================================================================

-- Phase 2a: COMPATIBILITY DATA seed (45 unique pairs 1-9, English)
-- Scores match app's calculateCompatibility matrix exactly. Additive, safe to re-run.
DELETE FROM public.compatibility_data WHERE language = 'en';
INSERT INTO public.compatibility_data (number1, number2, score, language, strength, challenges, detailed_analysis) VALUES
(1, 1, 70, 'en', 'A complementary pairing. Leadership from 1 and leadership from 1 balance each other, making this a supportive and growth-friendly bond.', 'Small differences in communication style need occasional attention, but they are easily bridged with honest conversation.', 'When a Life Path 1 (independent and driven) joins a Life Path 1 (independent and driven), the relationship carries a good natural resonance (compatibility score 70/100). Two 1s together share instincts and values instantly, which builds quick closeness. The risk is amplifying each other''s weaknesses, so balance and outside perspective help. In love this shows up as warm, secure attachment. For marriage and long-term partnership, focus on protecting each other''s individuality. In business, this combination is dependable and complementary.'),
(1, 2, 65, 'en', 'A relationship of contrasts. The independent and driven nature of 1 meets the sensitive and cooperative nature of 2; with effort, these differences can enrich rather than divide.', 'You may pull in different directions — 1''s leadership versus 2''s diplomacy. Conscious compromise is the key to harmony.', 'When a Life Path 1 (independent and driven) joins a Life Path 2 (sensitive and cooperative), the relationship carries a moderate natural resonance (compatibility score 65/100). 1''s leadership can clash with 2''s diplomacy, so the couple must consciously translate between two different operating styles. When they do, the contrast becomes a strength. In love this shows up as an attraction that needs ground rules to stay healthy. For marriage, agree early on how to handle money, freedom, and emotional needs. In business, define roles clearly to avoid friction.'),
(1, 3, 85, 'en', 'A naturally harmonious match. The independent and driven energy of 1 and the expressive and joyful energy of 3 reinforce each other, creating deep understanding and a shared sense of direction.', 'The ease between you can breed complacency. Keep nurturing individual goals so the bond stays alive rather than merely comfortable.', 'When a Life Path 1 (independent and driven) joins a Life Path 3 (expressive and joyful), the relationship carries a excellent natural resonance (compatibility score 85/100). 1''s leadership pairs well with 3''s creativity, so each partner supplies what the other lacks. Decisions feel smoother and shared goals come naturally. In love this shows up as warm, secure attachment. For marriage and long-term partnership, focus on protecting each other''s individuality. In business, this combination is dependable and complementary.'),
(1, 4, 55, 'en', 'A relationship of contrasts. The independent and driven nature of 1 meets the stable and disciplined nature of 4; with effort, these differences can enrich rather than divide.', 'You may pull in different directions — 1''s leadership versus 4''s reliability. Conscious compromise is the key to harmony.', 'When a Life Path 1 (independent and driven) joins a Life Path 4 (stable and disciplined), the relationship carries a moderate natural resonance (compatibility score 55/100). 1''s leadership can clash with 4''s reliability, so the couple must consciously translate between two different operating styles. When they do, the contrast becomes a strength. In love this shows up as an attraction that needs ground rules to stay healthy. For marriage, agree early on how to handle money, freedom, and emotional needs. In business, define roles clearly to avoid friction.'),
(1, 5, 90, 'en', 'A naturally harmonious match. The independent and driven energy of 1 and the free-spirited and adventurous energy of 5 reinforce each other, creating deep understanding and a shared sense of direction.', 'The ease between you can breed complacency. Keep nurturing individual goals so the bond stays alive rather than merely comfortable.', 'When a Life Path 1 (independent and driven) joins a Life Path 5 (free-spirited and adventurous), the relationship carries a excellent natural resonance (compatibility score 90/100). 1''s leadership pairs well with 5''s adaptability, so each partner supplies what the other lacks. Decisions feel smoother and shared goals come naturally. In love this shows up as warm, secure attachment. For marriage and long-term partnership, focus on protecting each other''s individuality. In business, this combination is dependable and complementary.'),
(1, 6, 60, 'en', 'A relationship of contrasts. The independent and driven nature of 1 meets the nurturing and responsible nature of 6; with effort, these differences can enrich rather than divide.', 'You may pull in different directions — 1''s leadership versus 6''s devotion. Conscious compromise is the key to harmony.', 'When a Life Path 1 (independent and driven) joins a Life Path 6 (nurturing and responsible), the relationship carries a moderate natural resonance (compatibility score 60/100). 1''s leadership can clash with 6''s devotion, so the couple must consciously translate between two different operating styles. When they do, the contrast becomes a strength. In love this shows up as an attraction that needs ground rules to stay healthy. For marriage, agree early on how to handle money, freedom, and emotional needs. In business, define roles clearly to avoid friction.'),
(1, 7, 75, 'en', 'A complementary pairing. Leadership from 1 and wisdom from 7 balance each other, making this a supportive and growth-friendly bond.', 'Small differences in communication style need occasional attention, but they are easily bridged with honest conversation.', 'When a Life Path 1 (independent and driven) joins a Life Path 7 (introspective and analytical), the relationship carries a good natural resonance (compatibility score 75/100). 1''s leadership pairs well with 7''s wisdom, so each partner supplies what the other lacks. Decisions feel smoother and shared goals come naturally. In love this shows up as warm, secure attachment. For marriage and long-term partnership, focus on protecting each other''s individuality. In business, this combination is dependable and complementary.'),
(1, 8, 80, 'en', 'A complementary pairing. Leadership from 1 and drive from 8 balance each other, making this a supportive and growth-friendly bond.', 'Small differences in communication style need occasional attention, but they are easily bridged with honest conversation.', 'When a Life Path 1 (independent and driven) joins a Life Path 8 (ambitious and powerful), the relationship carries a good natural resonance (compatibility score 80/100). 1''s leadership pairs well with 8''s drive, so each partner supplies what the other lacks. Decisions feel smoother and shared goals come naturally. In love this shows up as warm, secure attachment. For marriage and long-term partnership, focus on protecting each other''s individuality. In business, this combination is dependable and complementary.'),
(1, 9, 85, 'en', 'A naturally harmonious match. The independent and driven energy of 1 and the compassionate and idealistic energy of 9 reinforce each other, creating deep understanding and a shared sense of direction.', 'The ease between you can breed complacency. Keep nurturing individual goals so the bond stays alive rather than merely comfortable.', 'When a Life Path 1 (independent and driven) joins a Life Path 9 (compassionate and idealistic), the relationship carries a excellent natural resonance (compatibility score 85/100). 1''s leadership pairs well with 9''s generosity, so each partner supplies what the other lacks. Decisions feel smoother and shared goals come naturally. In love this shows up as warm, secure attachment. For marriage and long-term partnership, focus on protecting each other''s individuality. In business, this combination is dependable and complementary.'),
(2, 2, 80, 'en', 'A complementary pairing. Diplomacy from 2 and diplomacy from 2 balance each other, making this a supportive and growth-friendly bond.', 'Small differences in communication style need occasional attention, but they are easily bridged with honest conversation.', 'When a Life Path 2 (sensitive and cooperative) joins a Life Path 2 (sensitive and cooperative), the relationship carries a good natural resonance (compatibility score 80/100). Two 2s together share instincts and values instantly, which builds quick closeness. The risk is amplifying each other''s weaknesses, so balance and outside perspective help. In love this shows up as warm, secure attachment. For marriage and long-term partnership, focus on protecting each other''s individuality. In business, this combination is dependable and complementary.'),
(2, 3, 70, 'en', 'A complementary pairing. Diplomacy from 2 and creativity from 3 balance each other, making this a supportive and growth-friendly bond.', 'Small differences in communication style need occasional attention, but they are easily bridged with honest conversation.', 'When a Life Path 2 (sensitive and cooperative) joins a Life Path 3 (expressive and joyful), the relationship carries a good natural resonance (compatibility score 70/100). 2''s diplomacy pairs well with 3''s creativity, so each partner supplies what the other lacks. Decisions feel smoother and shared goals come naturally. In love this shows up as warm, secure attachment. For marriage and long-term partnership, focus on protecting each other''s individuality. In business, this combination is dependable and complementary.'),
(2, 4, 75, 'en', 'A complementary pairing. Diplomacy from 2 and reliability from 4 balance each other, making this a supportive and growth-friendly bond.', 'Small differences in communication style need occasional attention, but they are easily bridged with honest conversation.', 'When a Life Path 2 (sensitive and cooperative) joins a Life Path 4 (stable and disciplined), the relationship carries a good natural resonance (compatibility score 75/100). 2''s diplomacy pairs well with 4''s reliability, so each partner supplies what the other lacks. Decisions feel smoother and shared goals come naturally. In love this shows up as warm, secure attachment. For marriage and long-term partnership, focus on protecting each other''s individuality. In business, this combination is dependable and complementary.'),
(2, 5, 55, 'en', 'A relationship of contrasts. The sensitive and cooperative nature of 2 meets the free-spirited and adventurous nature of 5; with effort, these differences can enrich rather than divide.', 'You may pull in different directions — 2''s diplomacy versus 5''s adaptability. Conscious compromise is the key to harmony.', 'When a Life Path 2 (sensitive and cooperative) joins a Life Path 5 (free-spirited and adventurous), the relationship carries a moderate natural resonance (compatibility score 55/100). 2''s diplomacy can clash with 5''s adaptability, so the couple must consciously translate between two different operating styles. When they do, the contrast becomes a strength. In love this shows up as an attraction that needs ground rules to stay healthy. For marriage, agree early on how to handle money, freedom, and emotional needs. In business, define roles clearly to avoid friction.'),
(2, 6, 90, 'en', 'A naturally harmonious match. The sensitive and cooperative energy of 2 and the nurturing and responsible energy of 6 reinforce each other, creating deep understanding and a shared sense of direction.', 'The ease between you can breed complacency. Keep nurturing individual goals so the bond stays alive rather than merely comfortable.', 'When a Life Path 2 (sensitive and cooperative) joins a Life Path 6 (nurturing and responsible), the relationship carries a excellent natural resonance (compatibility score 90/100). 2''s diplomacy pairs well with 6''s devotion, so each partner supplies what the other lacks. Decisions feel smoother and shared goals come naturally. In love this shows up as warm, secure attachment. For marriage and long-term partnership, focus on protecting each other''s individuality. In business, this combination is dependable and complementary.'),
(2, 7, 60, 'en', 'A relationship of contrasts. The sensitive and cooperative nature of 2 meets the introspective and analytical nature of 7; with effort, these differences can enrich rather than divide.', 'You may pull in different directions — 2''s diplomacy versus 7''s wisdom. Conscious compromise is the key to harmony.', 'When a Life Path 2 (sensitive and cooperative) joins a Life Path 7 (introspective and analytical), the relationship carries a moderate natural resonance (compatibility score 60/100). 2''s diplomacy can clash with 7''s wisdom, so the couple must consciously translate between two different operating styles. When they do, the contrast becomes a strength. In love this shows up as an attraction that needs ground rules to stay healthy. For marriage, agree early on how to handle money, freedom, and emotional needs. In business, define roles clearly to avoid friction.'),
(2, 8, 65, 'en', 'A relationship of contrasts. The sensitive and cooperative nature of 2 meets the ambitious and powerful nature of 8; with effort, these differences can enrich rather than divide.', 'You may pull in different directions — 2''s diplomacy versus 8''s drive. Conscious compromise is the key to harmony.', 'When a Life Path 2 (sensitive and cooperative) joins a Life Path 8 (ambitious and powerful), the relationship carries a moderate natural resonance (compatibility score 65/100). 2''s diplomacy can clash with 8''s drive, so the couple must consciously translate between two different operating styles. When they do, the contrast becomes a strength. In love this shows up as an attraction that needs ground rules to stay healthy. For marriage, agree early on how to handle money, freedom, and emotional needs. In business, define roles clearly to avoid friction.'),
(2, 9, 85, 'en', 'A naturally harmonious match. The sensitive and cooperative energy of 2 and the compassionate and idealistic energy of 9 reinforce each other, creating deep understanding and a shared sense of direction.', 'The ease between you can breed complacency. Keep nurturing individual goals so the bond stays alive rather than merely comfortable.', 'When a Life Path 2 (sensitive and cooperative) joins a Life Path 9 (compassionate and idealistic), the relationship carries a excellent natural resonance (compatibility score 85/100). 2''s diplomacy pairs well with 9''s generosity, so each partner supplies what the other lacks. Decisions feel smoother and shared goals come naturally. In love this shows up as warm, secure attachment. For marriage and long-term partnership, focus on protecting each other''s individuality. In business, this combination is dependable and complementary.'),
(3, 3, 75, 'en', 'A complementary pairing. Creativity from 3 and creativity from 3 balance each other, making this a supportive and growth-friendly bond.', 'Small differences in communication style need occasional attention, but they are easily bridged with honest conversation.', 'When a Life Path 3 (expressive and joyful) joins a Life Path 3 (expressive and joyful), the relationship carries a good natural resonance (compatibility score 75/100). Two 3s together share instincts and values instantly, which builds quick closeness. The risk is amplifying each other''s weaknesses, so balance and outside perspective help. In love this shows up as warm, secure attachment. For marriage and long-term partnership, focus on protecting each other''s individuality. In business, this combination is dependable and complementary.'),
(3, 4, 50, 'en', 'A growth-oriented match. 3 and 4 approach life very differently, which tests patience but offers powerful lessons in understanding.', 'Core needs differ sharply: 3 craves creativity while 4 leans on reliability. Patience, space, and respect for differences are essential.', 'When a Life Path 3 (expressive and joyful) joins a Life Path 4 (stable and disciplined), the relationship carries a challenging natural resonance (compatibility score 50/100). 3''s creativity can clash with 4''s reliability, so the couple must consciously translate between two different operating styles. When they do, the contrast becomes a strength. In love this shows up as an attraction that needs ground rules to stay healthy. For marriage, agree early on how to handle money, freedom, and emotional needs. In business, define roles clearly to avoid friction.'),
(3, 5, 90, 'en', 'A naturally harmonious match. The expressive and joyful energy of 3 and the free-spirited and adventurous energy of 5 reinforce each other, creating deep understanding and a shared sense of direction.', 'The ease between you can breed complacency. Keep nurturing individual goals so the bond stays alive rather than merely comfortable.', 'When a Life Path 3 (expressive and joyful) joins a Life Path 5 (free-spirited and adventurous), the relationship carries a excellent natural resonance (compatibility score 90/100). 3''s creativity pairs well with 5''s adaptability, so each partner supplies what the other lacks. Decisions feel smoother and shared goals come naturally. In love this shows up as warm, secure attachment. For marriage and long-term partnership, focus on protecting each other''s individuality. In business, this combination is dependable and complementary.'),
(3, 6, 85, 'en', 'A naturally harmonious match. The expressive and joyful energy of 3 and the nurturing and responsible energy of 6 reinforce each other, creating deep understanding and a shared sense of direction.', 'The ease between you can breed complacency. Keep nurturing individual goals so the bond stays alive rather than merely comfortable.', 'When a Life Path 3 (expressive and joyful) joins a Life Path 6 (nurturing and responsible), the relationship carries a excellent natural resonance (compatibility score 85/100). 3''s creativity pairs well with 6''s devotion, so each partner supplies what the other lacks. Decisions feel smoother and shared goals come naturally. In love this shows up as warm, secure attachment. For marriage and long-term partnership, focus on protecting each other''s individuality. In business, this combination is dependable and complementary.'),
(3, 7, 65, 'en', 'A relationship of contrasts. The expressive and joyful nature of 3 meets the introspective and analytical nature of 7; with effort, these differences can enrich rather than divide.', 'You may pull in different directions — 3''s creativity versus 7''s wisdom. Conscious compromise is the key to harmony.', 'When a Life Path 3 (expressive and joyful) joins a Life Path 7 (introspective and analytical), the relationship carries a moderate natural resonance (compatibility score 65/100). 3''s creativity can clash with 7''s wisdom, so the couple must consciously translate between two different operating styles. When they do, the contrast becomes a strength. In love this shows up as an attraction that needs ground rules to stay healthy. For marriage, agree early on how to handle money, freedom, and emotional needs. In business, define roles clearly to avoid friction.'),
(3, 8, 55, 'en', 'A relationship of contrasts. The expressive and joyful nature of 3 meets the ambitious and powerful nature of 8; with effort, these differences can enrich rather than divide.', 'You may pull in different directions — 3''s creativity versus 8''s drive. Conscious compromise is the key to harmony.', 'When a Life Path 3 (expressive and joyful) joins a Life Path 8 (ambitious and powerful), the relationship carries a moderate natural resonance (compatibility score 55/100). 3''s creativity can clash with 8''s drive, so the couple must consciously translate between two different operating styles. When they do, the contrast becomes a strength. In love this shows up as an attraction that needs ground rules to stay healthy. For marriage, agree early on how to handle money, freedom, and emotional needs. In business, define roles clearly to avoid friction.'),
(3, 9, 80, 'en', 'A complementary pairing. Creativity from 3 and generosity from 9 balance each other, making this a supportive and growth-friendly bond.', 'Small differences in communication style need occasional attention, but they are easily bridged with honest conversation.', 'When a Life Path 3 (expressive and joyful) joins a Life Path 9 (compassionate and idealistic), the relationship carries a good natural resonance (compatibility score 80/100). 3''s creativity pairs well with 9''s generosity, so each partner supplies what the other lacks. Decisions feel smoother and shared goals come naturally. In love this shows up as warm, secure attachment. For marriage and long-term partnership, focus on protecting each other''s individuality. In business, this combination is dependable and complementary.'),
(4, 4, 70, 'en', 'A complementary pairing. Reliability from 4 and reliability from 4 balance each other, making this a supportive and growth-friendly bond.', 'Small differences in communication style need occasional attention, but they are easily bridged with honest conversation.', 'When a Life Path 4 (stable and disciplined) joins a Life Path 4 (stable and disciplined), the relationship carries a good natural resonance (compatibility score 70/100). Two 4s together share instincts and values instantly, which builds quick closeness. The risk is amplifying each other''s weaknesses, so balance and outside perspective help. In love this shows up as warm, secure attachment. For marriage and long-term partnership, focus on protecting each other''s individuality. In business, this combination is dependable and complementary.'),
(4, 5, 45, 'en', 'A growth-oriented match. 4 and 5 approach life very differently, which tests patience but offers powerful lessons in understanding.', 'Core needs differ sharply: 4 craves reliability while 5 leans on adaptability. Patience, space, and respect for differences are essential.', 'When a Life Path 4 (stable and disciplined) joins a Life Path 5 (free-spirited and adventurous), the relationship carries a challenging natural resonance (compatibility score 45/100). 4''s reliability can clash with 5''s adaptability, so the couple must consciously translate between two different operating styles. When they do, the contrast becomes a strength. In love this shows up as an attraction that needs ground rules to stay healthy. For marriage, agree early on how to handle money, freedom, and emotional needs. In business, define roles clearly to avoid friction.'),
(4, 6, 75, 'en', 'A complementary pairing. Reliability from 4 and devotion from 6 balance each other, making this a supportive and growth-friendly bond.', 'Small differences in communication style need occasional attention, but they are easily bridged with honest conversation.', 'When a Life Path 4 (stable and disciplined) joins a Life Path 6 (nurturing and responsible), the relationship carries a good natural resonance (compatibility score 75/100). 4''s reliability pairs well with 6''s devotion, so each partner supplies what the other lacks. Decisions feel smoother and shared goals come naturally. In love this shows up as warm, secure attachment. For marriage and long-term partnership, focus on protecting each other''s individuality. In business, this combination is dependable and complementary.'),
(4, 7, 80, 'en', 'A complementary pairing. Reliability from 4 and wisdom from 7 balance each other, making this a supportive and growth-friendly bond.', 'Small differences in communication style need occasional attention, but they are easily bridged with honest conversation.', 'When a Life Path 4 (stable and disciplined) joins a Life Path 7 (introspective and analytical), the relationship carries a good natural resonance (compatibility score 80/100). 4''s reliability pairs well with 7''s wisdom, so each partner supplies what the other lacks. Decisions feel smoother and shared goals come naturally. In love this shows up as warm, secure attachment. For marriage and long-term partnership, focus on protecting each other''s individuality. In business, this combination is dependable and complementary.'),
(4, 8, 85, 'en', 'A naturally harmonious match. The stable and disciplined energy of 4 and the ambitious and powerful energy of 8 reinforce each other, creating deep understanding and a shared sense of direction.', 'The ease between you can breed complacency. Keep nurturing individual goals so the bond stays alive rather than merely comfortable.', 'When a Life Path 4 (stable and disciplined) joins a Life Path 8 (ambitious and powerful), the relationship carries a excellent natural resonance (compatibility score 85/100). 4''s reliability pairs well with 8''s drive, so each partner supplies what the other lacks. Decisions feel smoother and shared goals come naturally. In love this shows up as warm, secure attachment. For marriage and long-term partnership, focus on protecting each other''s individuality. In business, this combination is dependable and complementary.'),
(4, 9, 50, 'en', 'A growth-oriented match. 4 and 9 approach life very differently, which tests patience but offers powerful lessons in understanding.', 'Core needs differ sharply: 4 craves reliability while 9 leans on generosity. Patience, space, and respect for differences are essential.', 'When a Life Path 4 (stable and disciplined) joins a Life Path 9 (compassionate and idealistic), the relationship carries a challenging natural resonance (compatibility score 50/100). 4''s reliability can clash with 9''s generosity, so the couple must consciously translate between two different operating styles. When they do, the contrast becomes a strength. In love this shows up as an attraction that needs ground rules to stay healthy. For marriage, agree early on how to handle money, freedom, and emotional needs. In business, define roles clearly to avoid friction.'),
(5, 5, 60, 'en', 'A relationship of contrasts. The free-spirited and adventurous nature of 5 meets the free-spirited and adventurous nature of 5; with effort, these differences can enrich rather than divide.', 'You may pull in different directions — 5''s adaptability versus 5''s adaptability. Conscious compromise is the key to harmony.', 'When a Life Path 5 (free-spirited and adventurous) joins a Life Path 5 (free-spirited and adventurous), the relationship carries a moderate natural resonance (compatibility score 60/100). Two 5s together share instincts and values instantly, which builds quick closeness. The risk is amplifying each other''s weaknesses, so balance and outside perspective help. In love this shows up as an attraction that needs ground rules to stay healthy. For marriage, agree early on how to handle money, freedom, and emotional needs. In business, define roles clearly to avoid friction.'),
(5, 6, 55, 'en', 'A relationship of contrasts. The free-spirited and adventurous nature of 5 meets the nurturing and responsible nature of 6; with effort, these differences can enrich rather than divide.', 'You may pull in different directions — 5''s adaptability versus 6''s devotion. Conscious compromise is the key to harmony.', 'When a Life Path 5 (free-spirited and adventurous) joins a Life Path 6 (nurturing and responsible), the relationship carries a moderate natural resonance (compatibility score 55/100). 5''s adaptability can clash with 6''s devotion, so the couple must consciously translate between two different operating styles. When they do, the contrast becomes a strength. In love this shows up as an attraction that needs ground rules to stay healthy. For marriage, agree early on how to handle money, freedom, and emotional needs. In business, define roles clearly to avoid friction.'),
(5, 7, 85, 'en', 'A naturally harmonious match. The free-spirited and adventurous energy of 5 and the introspective and analytical energy of 7 reinforce each other, creating deep understanding and a shared sense of direction.', 'The ease between you can breed complacency. Keep nurturing individual goals so the bond stays alive rather than merely comfortable.', 'When a Life Path 5 (free-spirited and adventurous) joins a Life Path 7 (introspective and analytical), the relationship carries a excellent natural resonance (compatibility score 85/100). 5''s adaptability pairs well with 7''s wisdom, so each partner supplies what the other lacks. Decisions feel smoother and shared goals come naturally. In love this shows up as warm, secure attachment. For marriage and long-term partnership, focus on protecting each other''s individuality. In business, this combination is dependable and complementary.'),
(5, 8, 70, 'en', 'A complementary pairing. Adaptability from 5 and drive from 8 balance each other, making this a supportive and growth-friendly bond.', 'Small differences in communication style need occasional attention, but they are easily bridged with honest conversation.', 'When a Life Path 5 (free-spirited and adventurous) joins a Life Path 8 (ambitious and powerful), the relationship carries a good natural resonance (compatibility score 70/100). 5''s adaptability pairs well with 8''s drive, so each partner supplies what the other lacks. Decisions feel smoother and shared goals come naturally. In love this shows up as warm, secure attachment. For marriage and long-term partnership, focus on protecting each other''s individuality. In business, this combination is dependable and complementary.'),
(5, 9, 90, 'en', 'A naturally harmonious match. The free-spirited and adventurous energy of 5 and the compassionate and idealistic energy of 9 reinforce each other, creating deep understanding and a shared sense of direction.', 'The ease between you can breed complacency. Keep nurturing individual goals so the bond stays alive rather than merely comfortable.', 'When a Life Path 5 (free-spirited and adventurous) joins a Life Path 9 (compassionate and idealistic), the relationship carries a excellent natural resonance (compatibility score 90/100). 5''s adaptability pairs well with 9''s generosity, so each partner supplies what the other lacks. Decisions feel smoother and shared goals come naturally. In love this shows up as warm, secure attachment. For marriage and long-term partnership, focus on protecting each other''s individuality. In business, this combination is dependable and complementary.'),
(6, 6, 85, 'en', 'A naturally harmonious match. The nurturing and responsible energy of 6 and the nurturing and responsible energy of 6 reinforce each other, creating deep understanding and a shared sense of direction.', 'The ease between you can breed complacency. Keep nurturing individual goals so the bond stays alive rather than merely comfortable.', 'When a Life Path 6 (nurturing and responsible) joins a Life Path 6 (nurturing and responsible), the relationship carries a excellent natural resonance (compatibility score 85/100). Two 6s together share instincts and values instantly, which builds quick closeness. The risk is amplifying each other''s weaknesses, so balance and outside perspective help. In love this shows up as warm, secure attachment. For marriage and long-term partnership, focus on protecting each other''s individuality. In business, this combination is dependable and complementary.'),
(6, 7, 55, 'en', 'A relationship of contrasts. The nurturing and responsible nature of 6 meets the introspective and analytical nature of 7; with effort, these differences can enrich rather than divide.', 'You may pull in different directions — 6''s devotion versus 7''s wisdom. Conscious compromise is the key to harmony.', 'When a Life Path 6 (nurturing and responsible) joins a Life Path 7 (introspective and analytical), the relationship carries a moderate natural resonance (compatibility score 55/100). 6''s devotion can clash with 7''s wisdom, so the couple must consciously translate between two different operating styles. When they do, the contrast becomes a strength. In love this shows up as an attraction that needs ground rules to stay healthy. For marriage, agree early on how to handle money, freedom, and emotional needs. In business, define roles clearly to avoid friction.'),
(6, 8, 70, 'en', 'A complementary pairing. Devotion from 6 and drive from 8 balance each other, making this a supportive and growth-friendly bond.', 'Small differences in communication style need occasional attention, but they are easily bridged with honest conversation.', 'When a Life Path 6 (nurturing and responsible) joins a Life Path 8 (ambitious and powerful), the relationship carries a good natural resonance (compatibility score 70/100). 6''s devotion pairs well with 8''s drive, so each partner supplies what the other lacks. Decisions feel smoother and shared goals come naturally. In love this shows up as warm, secure attachment. For marriage and long-term partnership, focus on protecting each other''s individuality. In business, this combination is dependable and complementary.'),
(6, 9, 90, 'en', 'A naturally harmonious match. The nurturing and responsible energy of 6 and the compassionate and idealistic energy of 9 reinforce each other, creating deep understanding and a shared sense of direction.', 'The ease between you can breed complacency. Keep nurturing individual goals so the bond stays alive rather than merely comfortable.', 'When a Life Path 6 (nurturing and responsible) joins a Life Path 9 (compassionate and idealistic), the relationship carries a excellent natural resonance (compatibility score 90/100). 6''s devotion pairs well with 9''s generosity, so each partner supplies what the other lacks. Decisions feel smoother and shared goals come naturally. In love this shows up as warm, secure attachment. For marriage and long-term partnership, focus on protecting each other''s individuality. In business, this combination is dependable and complementary.'),
(7, 7, 75, 'en', 'A complementary pairing. Wisdom from 7 and wisdom from 7 balance each other, making this a supportive and growth-friendly bond.', 'Small differences in communication style need occasional attention, but they are easily bridged with honest conversation.', 'When a Life Path 7 (introspective and analytical) joins a Life Path 7 (introspective and analytical), the relationship carries a good natural resonance (compatibility score 75/100). Two 7s together share instincts and values instantly, which builds quick closeness. The risk is amplifying each other''s weaknesses, so balance and outside perspective help. In love this shows up as warm, secure attachment. For marriage and long-term partnership, focus on protecting each other''s individuality. In business, this combination is dependable and complementary.'),
(7, 8, 60, 'en', 'A relationship of contrasts. The introspective and analytical nature of 7 meets the ambitious and powerful nature of 8; with effort, these differences can enrich rather than divide.', 'You may pull in different directions — 7''s wisdom versus 8''s drive. Conscious compromise is the key to harmony.', 'When a Life Path 7 (introspective and analytical) joins a Life Path 8 (ambitious and powerful), the relationship carries a moderate natural resonance (compatibility score 60/100). 7''s wisdom can clash with 8''s drive, so the couple must consciously translate between two different operating styles. When they do, the contrast becomes a strength. In love this shows up as an attraction that needs ground rules to stay healthy. For marriage, agree early on how to handle money, freedom, and emotional needs. In business, define roles clearly to avoid friction.'),
(7, 9, 70, 'en', 'A complementary pairing. Wisdom from 7 and generosity from 9 balance each other, making this a supportive and growth-friendly bond.', 'Small differences in communication style need occasional attention, but they are easily bridged with honest conversation.', 'When a Life Path 7 (introspective and analytical) joins a Life Path 9 (compassionate and idealistic), the relationship carries a good natural resonance (compatibility score 70/100). 7''s wisdom pairs well with 9''s generosity, so each partner supplies what the other lacks. Decisions feel smoother and shared goals come naturally. In love this shows up as warm, secure attachment. For marriage and long-term partnership, focus on protecting each other''s individuality. In business, this combination is dependable and complementary.'),
(8, 8, 70, 'en', 'A complementary pairing. Drive from 8 and drive from 8 balance each other, making this a supportive and growth-friendly bond.', 'Small differences in communication style need occasional attention, but they are easily bridged with honest conversation.', 'When a Life Path 8 (ambitious and powerful) joins a Life Path 8 (ambitious and powerful), the relationship carries a good natural resonance (compatibility score 70/100). Two 8s together share instincts and values instantly, which builds quick closeness. The risk is amplifying each other''s weaknesses, so balance and outside perspective help. In love this shows up as warm, secure attachment. For marriage and long-term partnership, focus on protecting each other''s individuality. In business, this combination is dependable and complementary.'),
(8, 9, 65, 'en', 'A relationship of contrasts. The ambitious and powerful nature of 8 meets the compassionate and idealistic nature of 9; with effort, these differences can enrich rather than divide.', 'You may pull in different directions — 8''s drive versus 9''s generosity. Conscious compromise is the key to harmony.', 'When a Life Path 8 (ambitious and powerful) joins a Life Path 9 (compassionate and idealistic), the relationship carries a moderate natural resonance (compatibility score 65/100). 8''s drive can clash with 9''s generosity, so the couple must consciously translate between two different operating styles. When they do, the contrast becomes a strength. In love this shows up as an attraction that needs ground rules to stay healthy. For marriage, agree early on how to handle money, freedom, and emotional needs. In business, define roles clearly to avoid friction.'),
(9, 9, 80, 'en', 'A complementary pairing. Generosity from 9 and generosity from 9 balance each other, making this a supportive and growth-friendly bond.', 'Small differences in communication style need occasional attention, but they are easily bridged with honest conversation.', 'When a Life Path 9 (compassionate and idealistic) joins a Life Path 9 (compassionate and idealistic), the relationship carries a good natural resonance (compatibility score 80/100). Two 9s together share instincts and values instantly, which builds quick closeness. The risk is amplifying each other''s weaknesses, so balance and outside perspective help. In love this shows up as warm, secure attachment. For marriage and long-term partnership, focus on protecting each other''s individuality. In business, this combination is dependable and complementary.');

-- =====================================================================
-- BUNDLED FILE: seeds/seed_compatibility_hi.sql
-- =====================================================================

-- Phase 2c: COMPATIBILITY DATA seed (45 pairs, hi)
-- Scores match app matrix. Additive, safe to re-run.
DELETE FROM public.compatibility_data WHERE language = 'hi';
INSERT INTO public.compatibility_data (number1, number2, score, language, strength, challenges, detailed_analysis) VALUES
(1, 1, 70, 'hi', 'पूरक जोड़ी। 1 का नेतृत्व और 1 का नेतृत्व एक-दूसरे को संतुलित करते हैं, जिससे यह एक सहायक बंधन बनता है।', 'संवाद शैली में छोटे अंतर पर ध्यान देना ज़रूरी है, पर ईमानदार बातचीत से आसानी से दूर हो जाते हैं।', 'जब जीवन पथ 1 (स्वतंत्र और प्रेरित) और जीवन पथ 1 (स्वतंत्र और प्रेरित) मिलते हैं, तो रिश्ते में अच्छा स्वाभाविक तालमेल होता है (अनुकूलता स्कोर 70/100)। दो 1 एक साथ तुरंत मूल्य और प्रवृत्ति साझा करते हैं, जिससे जल्दी नज़दीकी बनती है। जोखिम यह कि वे एक-दूसरे की कमज़ोरियाँ बढ़ा सकते हैं। प्रेम में यह गर्म, सुरक्षित जुड़ाव के रूप में दिखता है। विवाह के लिए एक-दूसरे की वैयक्तिकता की रक्षा करें। व्यापार में यह जोड़ी भरोसेमंद और पूरक है।'),
(1, 2, 65, 'hi', 'विरोधों का रिश्ता। 1 का स्वतंत्र और प्रेरित स्वभाव 2 के संवेदनशील और सहयोगी स्वभाव से मिलता है; प्रयास से ये अंतर समृद्ध कर सकते हैं।', 'आप अलग दिशाओं में खिंच सकते हैं — 1 का नेतृत्व बनाम 2 का कूटनीति। सचेत समझौता ही सामंजस्य की कुंजी है।', 'जब जीवन पथ 1 (स्वतंत्र और प्रेरित) और जीवन पथ 2 (संवेदनशील और सहयोगी) मिलते हैं, तो रिश्ते में मध्यम स्वाभाविक तालमेल होता है (अनुकूलता स्कोर 65/100)। 1 का नेतृत्व 2 के कूटनीति से टकरा सकता है, इसलिए दोनों को सचेत रूप से तालमेल बैठाना होगा। प्रेम में यह ऐसा आकर्षण है जिसे स्वस्थ रहने के लिए नियम चाहिए। विवाह के लिए पैसे, स्वतंत्रता और भावनाओं पर पहले सहमति बनाएँ। व्यापार में भूमिकाएँ स्पष्ट रखें।'),
(1, 3, 85, 'hi', 'स्वाभाविक रूप से सामंजस्यपूर्ण जोड़ी। 1 की स्वतंत्र और प्रेरित ऊर्जा और 3 की अभिव्यंजक और आनंदमय ऊर्जा एक-दूसरे को मज़बूत करती हैं, जिससे गहरी समझ बनती है।', 'आपसी सहजता आलस्य ला सकती है। व्यक्तिगत लक्ष्यों को पोषित करते रहें ताकि बंधन जीवंत रहे।', 'जब जीवन पथ 1 (स्वतंत्र और प्रेरित) और जीवन पथ 3 (अभिव्यंजक और आनंदमय) मिलते हैं, तो रिश्ते में उत्कृष्ट स्वाभाविक तालमेल होता है (अनुकूलता स्कोर 85/100)। 1 का नेतृत्व 3 के रचनात्मकता के साथ अच्छा मेल खाता है, इसलिए हर साथी वह देता है जो दूसरे में कमी है। प्रेम में यह गर्म, सुरक्षित जुड़ाव के रूप में दिखता है। विवाह के लिए एक-दूसरे की वैयक्तिकता की रक्षा करें। व्यापार में यह जोड़ी भरोसेमंद और पूरक है।'),
(1, 4, 55, 'hi', 'विरोधों का रिश्ता। 1 का स्वतंत्र और प्रेरित स्वभाव 4 के स्थिर और अनुशासित स्वभाव से मिलता है; प्रयास से ये अंतर समृद्ध कर सकते हैं।', 'आप अलग दिशाओं में खिंच सकते हैं — 1 का नेतृत्व बनाम 4 का विश्वसनीयता। सचेत समझौता ही सामंजस्य की कुंजी है।', 'जब जीवन पथ 1 (स्वतंत्र और प्रेरित) और जीवन पथ 4 (स्थिर और अनुशासित) मिलते हैं, तो रिश्ते में मध्यम स्वाभाविक तालमेल होता है (अनुकूलता स्कोर 55/100)। 1 का नेतृत्व 4 के विश्वसनीयता से टकरा सकता है, इसलिए दोनों को सचेत रूप से तालमेल बैठाना होगा। प्रेम में यह ऐसा आकर्षण है जिसे स्वस्थ रहने के लिए नियम चाहिए। विवाह के लिए पैसे, स्वतंत्रता और भावनाओं पर पहले सहमति बनाएँ। व्यापार में भूमिकाएँ स्पष्ट रखें।'),
(1, 5, 90, 'hi', 'स्वाभाविक रूप से सामंजस्यपूर्ण जोड़ी। 1 की स्वतंत्र और प्रेरित ऊर्जा और 5 की स्वतंत्र-प्रेमी और साहसी ऊर्जा एक-दूसरे को मज़बूत करती हैं, जिससे गहरी समझ बनती है।', 'आपसी सहजता आलस्य ला सकती है। व्यक्तिगत लक्ष्यों को पोषित करते रहें ताकि बंधन जीवंत रहे।', 'जब जीवन पथ 1 (स्वतंत्र और प्रेरित) और जीवन पथ 5 (स्वतंत्र-प्रेमी और साहसी) मिलते हैं, तो रिश्ते में उत्कृष्ट स्वाभाविक तालमेल होता है (अनुकूलता स्कोर 90/100)। 1 का नेतृत्व 5 के अनुकूलनशीलता के साथ अच्छा मेल खाता है, इसलिए हर साथी वह देता है जो दूसरे में कमी है। प्रेम में यह गर्म, सुरक्षित जुड़ाव के रूप में दिखता है। विवाह के लिए एक-दूसरे की वैयक्तिकता की रक्षा करें। व्यापार में यह जोड़ी भरोसेमंद और पूरक है।'),
(1, 6, 60, 'hi', 'विरोधों का रिश्ता। 1 का स्वतंत्र और प्रेरित स्वभाव 6 के पोषण करने वाला और ज़िम्मेदार स्वभाव से मिलता है; प्रयास से ये अंतर समृद्ध कर सकते हैं।', 'आप अलग दिशाओं में खिंच सकते हैं — 1 का नेतृत्व बनाम 6 का समर्पण। सचेत समझौता ही सामंजस्य की कुंजी है।', 'जब जीवन पथ 1 (स्वतंत्र और प्रेरित) और जीवन पथ 6 (पोषण करने वाला और ज़िम्मेदार) मिलते हैं, तो रिश्ते में मध्यम स्वाभाविक तालमेल होता है (अनुकूलता स्कोर 60/100)। 1 का नेतृत्व 6 के समर्पण से टकरा सकता है, इसलिए दोनों को सचेत रूप से तालमेल बैठाना होगा। प्रेम में यह ऐसा आकर्षण है जिसे स्वस्थ रहने के लिए नियम चाहिए। विवाह के लिए पैसे, स्वतंत्रता और भावनाओं पर पहले सहमति बनाएँ। व्यापार में भूमिकाएँ स्पष्ट रखें।'),
(1, 7, 75, 'hi', 'पूरक जोड़ी। 1 का नेतृत्व और 7 का ज्ञान एक-दूसरे को संतुलित करते हैं, जिससे यह एक सहायक बंधन बनता है।', 'संवाद शैली में छोटे अंतर पर ध्यान देना ज़रूरी है, पर ईमानदार बातचीत से आसानी से दूर हो जाते हैं।', 'जब जीवन पथ 1 (स्वतंत्र और प्रेरित) और जीवन पथ 7 (आत्मविश्लेषी और विश्लेषणात्मक) मिलते हैं, तो रिश्ते में अच्छा स्वाभाविक तालमेल होता है (अनुकूलता स्कोर 75/100)। 1 का नेतृत्व 7 के ज्ञान के साथ अच्छा मेल खाता है, इसलिए हर साथी वह देता है जो दूसरे में कमी है। प्रेम में यह गर्म, सुरक्षित जुड़ाव के रूप में दिखता है। विवाह के लिए एक-दूसरे की वैयक्तिकता की रक्षा करें। व्यापार में यह जोड़ी भरोसेमंद और पूरक है।'),
(1, 8, 80, 'hi', 'पूरक जोड़ी। 1 का नेतृत्व और 8 का प्रेरणा एक-दूसरे को संतुलित करते हैं, जिससे यह एक सहायक बंधन बनता है।', 'संवाद शैली में छोटे अंतर पर ध्यान देना ज़रूरी है, पर ईमानदार बातचीत से आसानी से दूर हो जाते हैं।', 'जब जीवन पथ 1 (स्वतंत्र और प्रेरित) और जीवन पथ 8 (महत्वाकांक्षी और शक्तिशाली) मिलते हैं, तो रिश्ते में अच्छा स्वाभाविक तालमेल होता है (अनुकूलता स्कोर 80/100)। 1 का नेतृत्व 8 के प्रेरणा के साथ अच्छा मेल खाता है, इसलिए हर साथी वह देता है जो दूसरे में कमी है। प्रेम में यह गर्म, सुरक्षित जुड़ाव के रूप में दिखता है। विवाह के लिए एक-दूसरे की वैयक्तिकता की रक्षा करें। व्यापार में यह जोड़ी भरोसेमंद और पूरक है।'),
(1, 9, 85, 'hi', 'स्वाभाविक रूप से सामंजस्यपूर्ण जोड़ी। 1 की स्वतंत्र और प्रेरित ऊर्जा और 9 की करुणामय और आदर्शवादी ऊर्जा एक-दूसरे को मज़बूत करती हैं, जिससे गहरी समझ बनती है।', 'आपसी सहजता आलस्य ला सकती है। व्यक्तिगत लक्ष्यों को पोषित करते रहें ताकि बंधन जीवंत रहे।', 'जब जीवन पथ 1 (स्वतंत्र और प्रेरित) और जीवन पथ 9 (करुणामय और आदर्शवादी) मिलते हैं, तो रिश्ते में उत्कृष्ट स्वाभाविक तालमेल होता है (अनुकूलता स्कोर 85/100)। 1 का नेतृत्व 9 के उदारता के साथ अच्छा मेल खाता है, इसलिए हर साथी वह देता है जो दूसरे में कमी है। प्रेम में यह गर्म, सुरक्षित जुड़ाव के रूप में दिखता है। विवाह के लिए एक-दूसरे की वैयक्तिकता की रक्षा करें। व्यापार में यह जोड़ी भरोसेमंद और पूरक है।'),
(2, 2, 80, 'hi', 'पूरक जोड़ी। 2 का कूटनीति और 2 का कूटनीति एक-दूसरे को संतुलित करते हैं, जिससे यह एक सहायक बंधन बनता है।', 'संवाद शैली में छोटे अंतर पर ध्यान देना ज़रूरी है, पर ईमानदार बातचीत से आसानी से दूर हो जाते हैं।', 'जब जीवन पथ 2 (संवेदनशील और सहयोगी) और जीवन पथ 2 (संवेदनशील और सहयोगी) मिलते हैं, तो रिश्ते में अच्छा स्वाभाविक तालमेल होता है (अनुकूलता स्कोर 80/100)। दो 2 एक साथ तुरंत मूल्य और प्रवृत्ति साझा करते हैं, जिससे जल्दी नज़दीकी बनती है। जोखिम यह कि वे एक-दूसरे की कमज़ोरियाँ बढ़ा सकते हैं। प्रेम में यह गर्म, सुरक्षित जुड़ाव के रूप में दिखता है। विवाह के लिए एक-दूसरे की वैयक्तिकता की रक्षा करें। व्यापार में यह जोड़ी भरोसेमंद और पूरक है।'),
(2, 3, 70, 'hi', 'पूरक जोड़ी। 2 का कूटनीति और 3 का रचनात्मकता एक-दूसरे को संतुलित करते हैं, जिससे यह एक सहायक बंधन बनता है।', 'संवाद शैली में छोटे अंतर पर ध्यान देना ज़रूरी है, पर ईमानदार बातचीत से आसानी से दूर हो जाते हैं।', 'जब जीवन पथ 2 (संवेदनशील और सहयोगी) और जीवन पथ 3 (अभिव्यंजक और आनंदमय) मिलते हैं, तो रिश्ते में अच्छा स्वाभाविक तालमेल होता है (अनुकूलता स्कोर 70/100)। 2 का कूटनीति 3 के रचनात्मकता के साथ अच्छा मेल खाता है, इसलिए हर साथी वह देता है जो दूसरे में कमी है। प्रेम में यह गर्म, सुरक्षित जुड़ाव के रूप में दिखता है। विवाह के लिए एक-दूसरे की वैयक्तिकता की रक्षा करें। व्यापार में यह जोड़ी भरोसेमंद और पूरक है।'),
(2, 4, 75, 'hi', 'पूरक जोड़ी। 2 का कूटनीति और 4 का विश्वसनीयता एक-दूसरे को संतुलित करते हैं, जिससे यह एक सहायक बंधन बनता है।', 'संवाद शैली में छोटे अंतर पर ध्यान देना ज़रूरी है, पर ईमानदार बातचीत से आसानी से दूर हो जाते हैं।', 'जब जीवन पथ 2 (संवेदनशील और सहयोगी) और जीवन पथ 4 (स्थिर और अनुशासित) मिलते हैं, तो रिश्ते में अच्छा स्वाभाविक तालमेल होता है (अनुकूलता स्कोर 75/100)। 2 का कूटनीति 4 के विश्वसनीयता के साथ अच्छा मेल खाता है, इसलिए हर साथी वह देता है जो दूसरे में कमी है। प्रेम में यह गर्म, सुरक्षित जुड़ाव के रूप में दिखता है। विवाह के लिए एक-दूसरे की वैयक्तिकता की रक्षा करें। व्यापार में यह जोड़ी भरोसेमंद और पूरक है।'),
(2, 5, 55, 'hi', 'विरोधों का रिश्ता। 2 का संवेदनशील और सहयोगी स्वभाव 5 के स्वतंत्र-प्रेमी और साहसी स्वभाव से मिलता है; प्रयास से ये अंतर समृद्ध कर सकते हैं।', 'आप अलग दिशाओं में खिंच सकते हैं — 2 का कूटनीति बनाम 5 का अनुकूलनशीलता। सचेत समझौता ही सामंजस्य की कुंजी है।', 'जब जीवन पथ 2 (संवेदनशील और सहयोगी) और जीवन पथ 5 (स्वतंत्र-प्रेमी और साहसी) मिलते हैं, तो रिश्ते में मध्यम स्वाभाविक तालमेल होता है (अनुकूलता स्कोर 55/100)। 2 का कूटनीति 5 के अनुकूलनशीलता से टकरा सकता है, इसलिए दोनों को सचेत रूप से तालमेल बैठाना होगा। प्रेम में यह ऐसा आकर्षण है जिसे स्वस्थ रहने के लिए नियम चाहिए। विवाह के लिए पैसे, स्वतंत्रता और भावनाओं पर पहले सहमति बनाएँ। व्यापार में भूमिकाएँ स्पष्ट रखें।'),
(2, 6, 90, 'hi', 'स्वाभाविक रूप से सामंजस्यपूर्ण जोड़ी। 2 की संवेदनशील और सहयोगी ऊर्जा और 6 की पोषण करने वाला और ज़िम्मेदार ऊर्जा एक-दूसरे को मज़बूत करती हैं, जिससे गहरी समझ बनती है।', 'आपसी सहजता आलस्य ला सकती है। व्यक्तिगत लक्ष्यों को पोषित करते रहें ताकि बंधन जीवंत रहे।', 'जब जीवन पथ 2 (संवेदनशील और सहयोगी) और जीवन पथ 6 (पोषण करने वाला और ज़िम्मेदार) मिलते हैं, तो रिश्ते में उत्कृष्ट स्वाभाविक तालमेल होता है (अनुकूलता स्कोर 90/100)। 2 का कूटनीति 6 के समर्पण के साथ अच्छा मेल खाता है, इसलिए हर साथी वह देता है जो दूसरे में कमी है। प्रेम में यह गर्म, सुरक्षित जुड़ाव के रूप में दिखता है। विवाह के लिए एक-दूसरे की वैयक्तिकता की रक्षा करें। व्यापार में यह जोड़ी भरोसेमंद और पूरक है।'),
(2, 7, 60, 'hi', 'विरोधों का रिश्ता। 2 का संवेदनशील और सहयोगी स्वभाव 7 के आत्मविश्लेषी और विश्लेषणात्मक स्वभाव से मिलता है; प्रयास से ये अंतर समृद्ध कर सकते हैं।', 'आप अलग दिशाओं में खिंच सकते हैं — 2 का कूटनीति बनाम 7 का ज्ञान। सचेत समझौता ही सामंजस्य की कुंजी है।', 'जब जीवन पथ 2 (संवेदनशील और सहयोगी) और जीवन पथ 7 (आत्मविश्लेषी और विश्लेषणात्मक) मिलते हैं, तो रिश्ते में मध्यम स्वाभाविक तालमेल होता है (अनुकूलता स्कोर 60/100)। 2 का कूटनीति 7 के ज्ञान से टकरा सकता है, इसलिए दोनों को सचेत रूप से तालमेल बैठाना होगा। प्रेम में यह ऐसा आकर्षण है जिसे स्वस्थ रहने के लिए नियम चाहिए। विवाह के लिए पैसे, स्वतंत्रता और भावनाओं पर पहले सहमति बनाएँ। व्यापार में भूमिकाएँ स्पष्ट रखें।'),
(2, 8, 65, 'hi', 'विरोधों का रिश्ता। 2 का संवेदनशील और सहयोगी स्वभाव 8 के महत्वाकांक्षी और शक्तिशाली स्वभाव से मिलता है; प्रयास से ये अंतर समृद्ध कर सकते हैं।', 'आप अलग दिशाओं में खिंच सकते हैं — 2 का कूटनीति बनाम 8 का प्रेरणा। सचेत समझौता ही सामंजस्य की कुंजी है।', 'जब जीवन पथ 2 (संवेदनशील और सहयोगी) और जीवन पथ 8 (महत्वाकांक्षी और शक्तिशाली) मिलते हैं, तो रिश्ते में मध्यम स्वाभाविक तालमेल होता है (अनुकूलता स्कोर 65/100)। 2 का कूटनीति 8 के प्रेरणा से टकरा सकता है, इसलिए दोनों को सचेत रूप से तालमेल बैठाना होगा। प्रेम में यह ऐसा आकर्षण है जिसे स्वस्थ रहने के लिए नियम चाहिए। विवाह के लिए पैसे, स्वतंत्रता और भावनाओं पर पहले सहमति बनाएँ। व्यापार में भूमिकाएँ स्पष्ट रखें।'),
(2, 9, 85, 'hi', 'स्वाभाविक रूप से सामंजस्यपूर्ण जोड़ी। 2 की संवेदनशील और सहयोगी ऊर्जा और 9 की करुणामय और आदर्शवादी ऊर्जा एक-दूसरे को मज़बूत करती हैं, जिससे गहरी समझ बनती है।', 'आपसी सहजता आलस्य ला सकती है। व्यक्तिगत लक्ष्यों को पोषित करते रहें ताकि बंधन जीवंत रहे।', 'जब जीवन पथ 2 (संवेदनशील और सहयोगी) और जीवन पथ 9 (करुणामय और आदर्शवादी) मिलते हैं, तो रिश्ते में उत्कृष्ट स्वाभाविक तालमेल होता है (अनुकूलता स्कोर 85/100)। 2 का कूटनीति 9 के उदारता के साथ अच्छा मेल खाता है, इसलिए हर साथी वह देता है जो दूसरे में कमी है। प्रेम में यह गर्म, सुरक्षित जुड़ाव के रूप में दिखता है। विवाह के लिए एक-दूसरे की वैयक्तिकता की रक्षा करें। व्यापार में यह जोड़ी भरोसेमंद और पूरक है।'),
(3, 3, 75, 'hi', 'पूरक जोड़ी। 3 का रचनात्मकता और 3 का रचनात्मकता एक-दूसरे को संतुलित करते हैं, जिससे यह एक सहायक बंधन बनता है।', 'संवाद शैली में छोटे अंतर पर ध्यान देना ज़रूरी है, पर ईमानदार बातचीत से आसानी से दूर हो जाते हैं।', 'जब जीवन पथ 3 (अभिव्यंजक और आनंदमय) और जीवन पथ 3 (अभिव्यंजक और आनंदमय) मिलते हैं, तो रिश्ते में अच्छा स्वाभाविक तालमेल होता है (अनुकूलता स्कोर 75/100)। दो 3 एक साथ तुरंत मूल्य और प्रवृत्ति साझा करते हैं, जिससे जल्दी नज़दीकी बनती है। जोखिम यह कि वे एक-दूसरे की कमज़ोरियाँ बढ़ा सकते हैं। प्रेम में यह गर्म, सुरक्षित जुड़ाव के रूप में दिखता है। विवाह के लिए एक-दूसरे की वैयक्तिकता की रक्षा करें। व्यापार में यह जोड़ी भरोसेमंद और पूरक है।'),
(3, 4, 50, 'hi', 'विकास-केंद्रित जोड़ी। 3 और 4 जीवन को बहुत अलग ढंग से देखते हैं, जो धैर्य की परीक्षा लेता है पर गहरे सबक देता है।', 'मूल ज़रूरतें बहुत अलग हैं: 3 को रचनात्मकता चाहिए जबकि 4 विश्वसनीयता पर निर्भर करता है। धैर्य और सम्मान आवश्यक हैं।', 'जब जीवन पथ 3 (अभिव्यंजक और आनंदमय) और जीवन पथ 4 (स्थिर और अनुशासित) मिलते हैं, तो रिश्ते में चुनौतीपूर्ण स्वाभाविक तालमेल होता है (अनुकूलता स्कोर 50/100)। 3 का रचनात्मकता 4 के विश्वसनीयता से टकरा सकता है, इसलिए दोनों को सचेत रूप से तालमेल बैठाना होगा। प्रेम में यह ऐसा आकर्षण है जिसे स्वस्थ रहने के लिए नियम चाहिए। विवाह के लिए पैसे, स्वतंत्रता और भावनाओं पर पहले सहमति बनाएँ। व्यापार में भूमिकाएँ स्पष्ट रखें।'),
(3, 5, 90, 'hi', 'स्वाभाविक रूप से सामंजस्यपूर्ण जोड़ी। 3 की अभिव्यंजक और आनंदमय ऊर्जा और 5 की स्वतंत्र-प्रेमी और साहसी ऊर्जा एक-दूसरे को मज़बूत करती हैं, जिससे गहरी समझ बनती है।', 'आपसी सहजता आलस्य ला सकती है। व्यक्तिगत लक्ष्यों को पोषित करते रहें ताकि बंधन जीवंत रहे।', 'जब जीवन पथ 3 (अभिव्यंजक और आनंदमय) और जीवन पथ 5 (स्वतंत्र-प्रेमी और साहसी) मिलते हैं, तो रिश्ते में उत्कृष्ट स्वाभाविक तालमेल होता है (अनुकूलता स्कोर 90/100)। 3 का रचनात्मकता 5 के अनुकूलनशीलता के साथ अच्छा मेल खाता है, इसलिए हर साथी वह देता है जो दूसरे में कमी है। प्रेम में यह गर्म, सुरक्षित जुड़ाव के रूप में दिखता है। विवाह के लिए एक-दूसरे की वैयक्तिकता की रक्षा करें। व्यापार में यह जोड़ी भरोसेमंद और पूरक है।'),
(3, 6, 85, 'hi', 'स्वाभाविक रूप से सामंजस्यपूर्ण जोड़ी। 3 की अभिव्यंजक और आनंदमय ऊर्जा और 6 की पोषण करने वाला और ज़िम्मेदार ऊर्जा एक-दूसरे को मज़बूत करती हैं, जिससे गहरी समझ बनती है।', 'आपसी सहजता आलस्य ला सकती है। व्यक्तिगत लक्ष्यों को पोषित करते रहें ताकि बंधन जीवंत रहे।', 'जब जीवन पथ 3 (अभिव्यंजक और आनंदमय) और जीवन पथ 6 (पोषण करने वाला और ज़िम्मेदार) मिलते हैं, तो रिश्ते में उत्कृष्ट स्वाभाविक तालमेल होता है (अनुकूलता स्कोर 85/100)। 3 का रचनात्मकता 6 के समर्पण के साथ अच्छा मेल खाता है, इसलिए हर साथी वह देता है जो दूसरे में कमी है। प्रेम में यह गर्म, सुरक्षित जुड़ाव के रूप में दिखता है। विवाह के लिए एक-दूसरे की वैयक्तिकता की रक्षा करें। व्यापार में यह जोड़ी भरोसेमंद और पूरक है।'),
(3, 7, 65, 'hi', 'विरोधों का रिश्ता। 3 का अभिव्यंजक और आनंदमय स्वभाव 7 के आत्मविश्लेषी और विश्लेषणात्मक स्वभाव से मिलता है; प्रयास से ये अंतर समृद्ध कर सकते हैं।', 'आप अलग दिशाओं में खिंच सकते हैं — 3 का रचनात्मकता बनाम 7 का ज्ञान। सचेत समझौता ही सामंजस्य की कुंजी है।', 'जब जीवन पथ 3 (अभिव्यंजक और आनंदमय) और जीवन पथ 7 (आत्मविश्लेषी और विश्लेषणात्मक) मिलते हैं, तो रिश्ते में मध्यम स्वाभाविक तालमेल होता है (अनुकूलता स्कोर 65/100)। 3 का रचनात्मकता 7 के ज्ञान से टकरा सकता है, इसलिए दोनों को सचेत रूप से तालमेल बैठाना होगा। प्रेम में यह ऐसा आकर्षण है जिसे स्वस्थ रहने के लिए नियम चाहिए। विवाह के लिए पैसे, स्वतंत्रता और भावनाओं पर पहले सहमति बनाएँ। व्यापार में भूमिकाएँ स्पष्ट रखें।'),
(3, 8, 55, 'hi', 'विरोधों का रिश्ता। 3 का अभिव्यंजक और आनंदमय स्वभाव 8 के महत्वाकांक्षी और शक्तिशाली स्वभाव से मिलता है; प्रयास से ये अंतर समृद्ध कर सकते हैं।', 'आप अलग दिशाओं में खिंच सकते हैं — 3 का रचनात्मकता बनाम 8 का प्रेरणा। सचेत समझौता ही सामंजस्य की कुंजी है।', 'जब जीवन पथ 3 (अभिव्यंजक और आनंदमय) और जीवन पथ 8 (महत्वाकांक्षी और शक्तिशाली) मिलते हैं, तो रिश्ते में मध्यम स्वाभाविक तालमेल होता है (अनुकूलता स्कोर 55/100)। 3 का रचनात्मकता 8 के प्रेरणा से टकरा सकता है, इसलिए दोनों को सचेत रूप से तालमेल बैठाना होगा। प्रेम में यह ऐसा आकर्षण है जिसे स्वस्थ रहने के लिए नियम चाहिए। विवाह के लिए पैसे, स्वतंत्रता और भावनाओं पर पहले सहमति बनाएँ। व्यापार में भूमिकाएँ स्पष्ट रखें।'),
(3, 9, 80, 'hi', 'पूरक जोड़ी। 3 का रचनात्मकता और 9 का उदारता एक-दूसरे को संतुलित करते हैं, जिससे यह एक सहायक बंधन बनता है।', 'संवाद शैली में छोटे अंतर पर ध्यान देना ज़रूरी है, पर ईमानदार बातचीत से आसानी से दूर हो जाते हैं।', 'जब जीवन पथ 3 (अभिव्यंजक और आनंदमय) और जीवन पथ 9 (करुणामय और आदर्शवादी) मिलते हैं, तो रिश्ते में अच्छा स्वाभाविक तालमेल होता है (अनुकूलता स्कोर 80/100)। 3 का रचनात्मकता 9 के उदारता के साथ अच्छा मेल खाता है, इसलिए हर साथी वह देता है जो दूसरे में कमी है। प्रेम में यह गर्म, सुरक्षित जुड़ाव के रूप में दिखता है। विवाह के लिए एक-दूसरे की वैयक्तिकता की रक्षा करें। व्यापार में यह जोड़ी भरोसेमंद और पूरक है।'),
(4, 4, 70, 'hi', 'पूरक जोड़ी। 4 का विश्वसनीयता और 4 का विश्वसनीयता एक-दूसरे को संतुलित करते हैं, जिससे यह एक सहायक बंधन बनता है।', 'संवाद शैली में छोटे अंतर पर ध्यान देना ज़रूरी है, पर ईमानदार बातचीत से आसानी से दूर हो जाते हैं।', 'जब जीवन पथ 4 (स्थिर और अनुशासित) और जीवन पथ 4 (स्थिर और अनुशासित) मिलते हैं, तो रिश्ते में अच्छा स्वाभाविक तालमेल होता है (अनुकूलता स्कोर 70/100)। दो 4 एक साथ तुरंत मूल्य और प्रवृत्ति साझा करते हैं, जिससे जल्दी नज़दीकी बनती है। जोखिम यह कि वे एक-दूसरे की कमज़ोरियाँ बढ़ा सकते हैं। प्रेम में यह गर्म, सुरक्षित जुड़ाव के रूप में दिखता है। विवाह के लिए एक-दूसरे की वैयक्तिकता की रक्षा करें। व्यापार में यह जोड़ी भरोसेमंद और पूरक है।'),
(4, 5, 45, 'hi', 'विकास-केंद्रित जोड़ी। 4 और 5 जीवन को बहुत अलग ढंग से देखते हैं, जो धैर्य की परीक्षा लेता है पर गहरे सबक देता है।', 'मूल ज़रूरतें बहुत अलग हैं: 4 को विश्वसनीयता चाहिए जबकि 5 अनुकूलनशीलता पर निर्भर करता है। धैर्य और सम्मान आवश्यक हैं।', 'जब जीवन पथ 4 (स्थिर और अनुशासित) और जीवन पथ 5 (स्वतंत्र-प्रेमी और साहसी) मिलते हैं, तो रिश्ते में चुनौतीपूर्ण स्वाभाविक तालमेल होता है (अनुकूलता स्कोर 45/100)। 4 का विश्वसनीयता 5 के अनुकूलनशीलता से टकरा सकता है, इसलिए दोनों को सचेत रूप से तालमेल बैठाना होगा। प्रेम में यह ऐसा आकर्षण है जिसे स्वस्थ रहने के लिए नियम चाहिए। विवाह के लिए पैसे, स्वतंत्रता और भावनाओं पर पहले सहमति बनाएँ। व्यापार में भूमिकाएँ स्पष्ट रखें।'),
(4, 6, 75, 'hi', 'पूरक जोड़ी। 4 का विश्वसनीयता और 6 का समर्पण एक-दूसरे को संतुलित करते हैं, जिससे यह एक सहायक बंधन बनता है।', 'संवाद शैली में छोटे अंतर पर ध्यान देना ज़रूरी है, पर ईमानदार बातचीत से आसानी से दूर हो जाते हैं।', 'जब जीवन पथ 4 (स्थिर और अनुशासित) और जीवन पथ 6 (पोषण करने वाला और ज़िम्मेदार) मिलते हैं, तो रिश्ते में अच्छा स्वाभाविक तालमेल होता है (अनुकूलता स्कोर 75/100)। 4 का विश्वसनीयता 6 के समर्पण के साथ अच्छा मेल खाता है, इसलिए हर साथी वह देता है जो दूसरे में कमी है। प्रेम में यह गर्म, सुरक्षित जुड़ाव के रूप में दिखता है। विवाह के लिए एक-दूसरे की वैयक्तिकता की रक्षा करें। व्यापार में यह जोड़ी भरोसेमंद और पूरक है।'),
(4, 7, 80, 'hi', 'पूरक जोड़ी। 4 का विश्वसनीयता और 7 का ज्ञान एक-दूसरे को संतुलित करते हैं, जिससे यह एक सहायक बंधन बनता है।', 'संवाद शैली में छोटे अंतर पर ध्यान देना ज़रूरी है, पर ईमानदार बातचीत से आसानी से दूर हो जाते हैं।', 'जब जीवन पथ 4 (स्थिर और अनुशासित) और जीवन पथ 7 (आत्मविश्लेषी और विश्लेषणात्मक) मिलते हैं, तो रिश्ते में अच्छा स्वाभाविक तालमेल होता है (अनुकूलता स्कोर 80/100)। 4 का विश्वसनीयता 7 के ज्ञान के साथ अच्छा मेल खाता है, इसलिए हर साथी वह देता है जो दूसरे में कमी है। प्रेम में यह गर्म, सुरक्षित जुड़ाव के रूप में दिखता है। विवाह के लिए एक-दूसरे की वैयक्तिकता की रक्षा करें। व्यापार में यह जोड़ी भरोसेमंद और पूरक है।'),
(4, 8, 85, 'hi', 'स्वाभाविक रूप से सामंजस्यपूर्ण जोड़ी। 4 की स्थिर और अनुशासित ऊर्जा और 8 की महत्वाकांक्षी और शक्तिशाली ऊर्जा एक-दूसरे को मज़बूत करती हैं, जिससे गहरी समझ बनती है।', 'आपसी सहजता आलस्य ला सकती है। व्यक्तिगत लक्ष्यों को पोषित करते रहें ताकि बंधन जीवंत रहे।', 'जब जीवन पथ 4 (स्थिर और अनुशासित) और जीवन पथ 8 (महत्वाकांक्षी और शक्तिशाली) मिलते हैं, तो रिश्ते में उत्कृष्ट स्वाभाविक तालमेल होता है (अनुकूलता स्कोर 85/100)। 4 का विश्वसनीयता 8 के प्रेरणा के साथ अच्छा मेल खाता है, इसलिए हर साथी वह देता है जो दूसरे में कमी है। प्रेम में यह गर्म, सुरक्षित जुड़ाव के रूप में दिखता है। विवाह के लिए एक-दूसरे की वैयक्तिकता की रक्षा करें। व्यापार में यह जोड़ी भरोसेमंद और पूरक है।'),
(4, 9, 50, 'hi', 'विकास-केंद्रित जोड़ी। 4 और 9 जीवन को बहुत अलग ढंग से देखते हैं, जो धैर्य की परीक्षा लेता है पर गहरे सबक देता है।', 'मूल ज़रूरतें बहुत अलग हैं: 4 को विश्वसनीयता चाहिए जबकि 9 उदारता पर निर्भर करता है। धैर्य और सम्मान आवश्यक हैं।', 'जब जीवन पथ 4 (स्थिर और अनुशासित) और जीवन पथ 9 (करुणामय और आदर्शवादी) मिलते हैं, तो रिश्ते में चुनौतीपूर्ण स्वाभाविक तालमेल होता है (अनुकूलता स्कोर 50/100)। 4 का विश्वसनीयता 9 के उदारता से टकरा सकता है, इसलिए दोनों को सचेत रूप से तालमेल बैठाना होगा। प्रेम में यह ऐसा आकर्षण है जिसे स्वस्थ रहने के लिए नियम चाहिए। विवाह के लिए पैसे, स्वतंत्रता और भावनाओं पर पहले सहमति बनाएँ। व्यापार में भूमिकाएँ स्पष्ट रखें।'),
(5, 5, 60, 'hi', 'विरोधों का रिश्ता। 5 का स्वतंत्र-प्रेमी और साहसी स्वभाव 5 के स्वतंत्र-प्रेमी और साहसी स्वभाव से मिलता है; प्रयास से ये अंतर समृद्ध कर सकते हैं।', 'आप अलग दिशाओं में खिंच सकते हैं — 5 का अनुकूलनशीलता बनाम 5 का अनुकूलनशीलता। सचेत समझौता ही सामंजस्य की कुंजी है।', 'जब जीवन पथ 5 (स्वतंत्र-प्रेमी और साहसी) और जीवन पथ 5 (स्वतंत्र-प्रेमी और साहसी) मिलते हैं, तो रिश्ते में मध्यम स्वाभाविक तालमेल होता है (अनुकूलता स्कोर 60/100)। दो 5 एक साथ तुरंत मूल्य और प्रवृत्ति साझा करते हैं, जिससे जल्दी नज़दीकी बनती है। जोखिम यह कि वे एक-दूसरे की कमज़ोरियाँ बढ़ा सकते हैं। प्रेम में यह ऐसा आकर्षण है जिसे स्वस्थ रहने के लिए नियम चाहिए। विवाह के लिए पैसे, स्वतंत्रता और भावनाओं पर पहले सहमति बनाएँ। व्यापार में भूमिकाएँ स्पष्ट रखें।'),
(5, 6, 55, 'hi', 'विरोधों का रिश्ता। 5 का स्वतंत्र-प्रेमी और साहसी स्वभाव 6 के पोषण करने वाला और ज़िम्मेदार स्वभाव से मिलता है; प्रयास से ये अंतर समृद्ध कर सकते हैं।', 'आप अलग दिशाओं में खिंच सकते हैं — 5 का अनुकूलनशीलता बनाम 6 का समर्पण। सचेत समझौता ही सामंजस्य की कुंजी है।', 'जब जीवन पथ 5 (स्वतंत्र-प्रेमी और साहसी) और जीवन पथ 6 (पोषण करने वाला और ज़िम्मेदार) मिलते हैं, तो रिश्ते में मध्यम स्वाभाविक तालमेल होता है (अनुकूलता स्कोर 55/100)। 5 का अनुकूलनशीलता 6 के समर्पण से टकरा सकता है, इसलिए दोनों को सचेत रूप से तालमेल बैठाना होगा। प्रेम में यह ऐसा आकर्षण है जिसे स्वस्थ रहने के लिए नियम चाहिए। विवाह के लिए पैसे, स्वतंत्रता और भावनाओं पर पहले सहमति बनाएँ। व्यापार में भूमिकाएँ स्पष्ट रखें।'),
(5, 7, 85, 'hi', 'स्वाभाविक रूप से सामंजस्यपूर्ण जोड़ी। 5 की स्वतंत्र-प्रेमी और साहसी ऊर्जा और 7 की आत्मविश्लेषी और विश्लेषणात्मक ऊर्जा एक-दूसरे को मज़बूत करती हैं, जिससे गहरी समझ बनती है।', 'आपसी सहजता आलस्य ला सकती है। व्यक्तिगत लक्ष्यों को पोषित करते रहें ताकि बंधन जीवंत रहे।', 'जब जीवन पथ 5 (स्वतंत्र-प्रेमी और साहसी) और जीवन पथ 7 (आत्मविश्लेषी और विश्लेषणात्मक) मिलते हैं, तो रिश्ते में उत्कृष्ट स्वाभाविक तालमेल होता है (अनुकूलता स्कोर 85/100)। 5 का अनुकूलनशीलता 7 के ज्ञान के साथ अच्छा मेल खाता है, इसलिए हर साथी वह देता है जो दूसरे में कमी है। प्रेम में यह गर्म, सुरक्षित जुड़ाव के रूप में दिखता है। विवाह के लिए एक-दूसरे की वैयक्तिकता की रक्षा करें। व्यापार में यह जोड़ी भरोसेमंद और पूरक है।'),
(5, 8, 70, 'hi', 'पूरक जोड़ी। 5 का अनुकूलनशीलता और 8 का प्रेरणा एक-दूसरे को संतुलित करते हैं, जिससे यह एक सहायक बंधन बनता है।', 'संवाद शैली में छोटे अंतर पर ध्यान देना ज़रूरी है, पर ईमानदार बातचीत से आसानी से दूर हो जाते हैं।', 'जब जीवन पथ 5 (स्वतंत्र-प्रेमी और साहसी) और जीवन पथ 8 (महत्वाकांक्षी और शक्तिशाली) मिलते हैं, तो रिश्ते में अच्छा स्वाभाविक तालमेल होता है (अनुकूलता स्कोर 70/100)। 5 का अनुकूलनशीलता 8 के प्रेरणा के साथ अच्छा मेल खाता है, इसलिए हर साथी वह देता है जो दूसरे में कमी है। प्रेम में यह गर्म, सुरक्षित जुड़ाव के रूप में दिखता है। विवाह के लिए एक-दूसरे की वैयक्तिकता की रक्षा करें। व्यापार में यह जोड़ी भरोसेमंद और पूरक है।'),
(5, 9, 90, 'hi', 'स्वाभाविक रूप से सामंजस्यपूर्ण जोड़ी। 5 की स्वतंत्र-प्रेमी और साहसी ऊर्जा और 9 की करुणामय और आदर्शवादी ऊर्जा एक-दूसरे को मज़बूत करती हैं, जिससे गहरी समझ बनती है।', 'आपसी सहजता आलस्य ला सकती है। व्यक्तिगत लक्ष्यों को पोषित करते रहें ताकि बंधन जीवंत रहे।', 'जब जीवन पथ 5 (स्वतंत्र-प्रेमी और साहसी) और जीवन पथ 9 (करुणामय और आदर्शवादी) मिलते हैं, तो रिश्ते में उत्कृष्ट स्वाभाविक तालमेल होता है (अनुकूलता स्कोर 90/100)। 5 का अनुकूलनशीलता 9 के उदारता के साथ अच्छा मेल खाता है, इसलिए हर साथी वह देता है जो दूसरे में कमी है। प्रेम में यह गर्म, सुरक्षित जुड़ाव के रूप में दिखता है। विवाह के लिए एक-दूसरे की वैयक्तिकता की रक्षा करें। व्यापार में यह जोड़ी भरोसेमंद और पूरक है।'),
(6, 6, 85, 'hi', 'स्वाभाविक रूप से सामंजस्यपूर्ण जोड़ी। 6 की पोषण करने वाला और ज़िम्मेदार ऊर्जा और 6 की पोषण करने वाला और ज़िम्मेदार ऊर्जा एक-दूसरे को मज़बूत करती हैं, जिससे गहरी समझ बनती है।', 'आपसी सहजता आलस्य ला सकती है। व्यक्तिगत लक्ष्यों को पोषित करते रहें ताकि बंधन जीवंत रहे।', 'जब जीवन पथ 6 (पोषण करने वाला और ज़िम्मेदार) और जीवन पथ 6 (पोषण करने वाला और ज़िम्मेदार) मिलते हैं, तो रिश्ते में उत्कृष्ट स्वाभाविक तालमेल होता है (अनुकूलता स्कोर 85/100)। दो 6 एक साथ तुरंत मूल्य और प्रवृत्ति साझा करते हैं, जिससे जल्दी नज़दीकी बनती है। जोखिम यह कि वे एक-दूसरे की कमज़ोरियाँ बढ़ा सकते हैं। प्रेम में यह गर्म, सुरक्षित जुड़ाव के रूप में दिखता है। विवाह के लिए एक-दूसरे की वैयक्तिकता की रक्षा करें। व्यापार में यह जोड़ी भरोसेमंद और पूरक है।'),
(6, 7, 55, 'hi', 'विरोधों का रिश्ता। 6 का पोषण करने वाला और ज़िम्मेदार स्वभाव 7 के आत्मविश्लेषी और विश्लेषणात्मक स्वभाव से मिलता है; प्रयास से ये अंतर समृद्ध कर सकते हैं।', 'आप अलग दिशाओं में खिंच सकते हैं — 6 का समर्पण बनाम 7 का ज्ञान। सचेत समझौता ही सामंजस्य की कुंजी है।', 'जब जीवन पथ 6 (पोषण करने वाला और ज़िम्मेदार) और जीवन पथ 7 (आत्मविश्लेषी और विश्लेषणात्मक) मिलते हैं, तो रिश्ते में मध्यम स्वाभाविक तालमेल होता है (अनुकूलता स्कोर 55/100)। 6 का समर्पण 7 के ज्ञान से टकरा सकता है, इसलिए दोनों को सचेत रूप से तालमेल बैठाना होगा। प्रेम में यह ऐसा आकर्षण है जिसे स्वस्थ रहने के लिए नियम चाहिए। विवाह के लिए पैसे, स्वतंत्रता और भावनाओं पर पहले सहमति बनाएँ। व्यापार में भूमिकाएँ स्पष्ट रखें।'),
(6, 8, 70, 'hi', 'पूरक जोड़ी। 6 का समर्पण और 8 का प्रेरणा एक-दूसरे को संतुलित करते हैं, जिससे यह एक सहायक बंधन बनता है।', 'संवाद शैली में छोटे अंतर पर ध्यान देना ज़रूरी है, पर ईमानदार बातचीत से आसानी से दूर हो जाते हैं।', 'जब जीवन पथ 6 (पोषण करने वाला और ज़िम्मेदार) और जीवन पथ 8 (महत्वाकांक्षी और शक्तिशाली) मिलते हैं, तो रिश्ते में अच्छा स्वाभाविक तालमेल होता है (अनुकूलता स्कोर 70/100)। 6 का समर्पण 8 के प्रेरणा के साथ अच्छा मेल खाता है, इसलिए हर साथी वह देता है जो दूसरे में कमी है। प्रेम में यह गर्म, सुरक्षित जुड़ाव के रूप में दिखता है। विवाह के लिए एक-दूसरे की वैयक्तिकता की रक्षा करें। व्यापार में यह जोड़ी भरोसेमंद और पूरक है।'),
(6, 9, 90, 'hi', 'स्वाभाविक रूप से सामंजस्यपूर्ण जोड़ी। 6 की पोषण करने वाला और ज़िम्मेदार ऊर्जा और 9 की करुणामय और आदर्शवादी ऊर्जा एक-दूसरे को मज़बूत करती हैं, जिससे गहरी समझ बनती है।', 'आपसी सहजता आलस्य ला सकती है। व्यक्तिगत लक्ष्यों को पोषित करते रहें ताकि बंधन जीवंत रहे।', 'जब जीवन पथ 6 (पोषण करने वाला और ज़िम्मेदार) और जीवन पथ 9 (करुणामय और आदर्शवादी) मिलते हैं, तो रिश्ते में उत्कृष्ट स्वाभाविक तालमेल होता है (अनुकूलता स्कोर 90/100)। 6 का समर्पण 9 के उदारता के साथ अच्छा मेल खाता है, इसलिए हर साथी वह देता है जो दूसरे में कमी है। प्रेम में यह गर्म, सुरक्षित जुड़ाव के रूप में दिखता है। विवाह के लिए एक-दूसरे की वैयक्तिकता की रक्षा करें। व्यापार में यह जोड़ी भरोसेमंद और पूरक है।'),
(7, 7, 75, 'hi', 'पूरक जोड़ी। 7 का ज्ञान और 7 का ज्ञान एक-दूसरे को संतुलित करते हैं, जिससे यह एक सहायक बंधन बनता है।', 'संवाद शैली में छोटे अंतर पर ध्यान देना ज़रूरी है, पर ईमानदार बातचीत से आसानी से दूर हो जाते हैं।', 'जब जीवन पथ 7 (आत्मविश्लेषी और विश्लेषणात्मक) और जीवन पथ 7 (आत्मविश्लेषी और विश्लेषणात्मक) मिलते हैं, तो रिश्ते में अच्छा स्वाभाविक तालमेल होता है (अनुकूलता स्कोर 75/100)। दो 7 एक साथ तुरंत मूल्य और प्रवृत्ति साझा करते हैं, जिससे जल्दी नज़दीकी बनती है। जोखिम यह कि वे एक-दूसरे की कमज़ोरियाँ बढ़ा सकते हैं। प्रेम में यह गर्म, सुरक्षित जुड़ाव के रूप में दिखता है। विवाह के लिए एक-दूसरे की वैयक्तिकता की रक्षा करें। व्यापार में यह जोड़ी भरोसेमंद और पूरक है।'),
(7, 8, 60, 'hi', 'विरोधों का रिश्ता। 7 का आत्मविश्लेषी और विश्लेषणात्मक स्वभाव 8 के महत्वाकांक्षी और शक्तिशाली स्वभाव से मिलता है; प्रयास से ये अंतर समृद्ध कर सकते हैं।', 'आप अलग दिशाओं में खिंच सकते हैं — 7 का ज्ञान बनाम 8 का प्रेरणा। सचेत समझौता ही सामंजस्य की कुंजी है।', 'जब जीवन पथ 7 (आत्मविश्लेषी और विश्लेषणात्मक) और जीवन पथ 8 (महत्वाकांक्षी और शक्तिशाली) मिलते हैं, तो रिश्ते में मध्यम स्वाभाविक तालमेल होता है (अनुकूलता स्कोर 60/100)। 7 का ज्ञान 8 के प्रेरणा से टकरा सकता है, इसलिए दोनों को सचेत रूप से तालमेल बैठाना होगा। प्रेम में यह ऐसा आकर्षण है जिसे स्वस्थ रहने के लिए नियम चाहिए। विवाह के लिए पैसे, स्वतंत्रता और भावनाओं पर पहले सहमति बनाएँ। व्यापार में भूमिकाएँ स्पष्ट रखें।'),
(7, 9, 70, 'hi', 'पूरक जोड़ी। 7 का ज्ञान और 9 का उदारता एक-दूसरे को संतुलित करते हैं, जिससे यह एक सहायक बंधन बनता है।', 'संवाद शैली में छोटे अंतर पर ध्यान देना ज़रूरी है, पर ईमानदार बातचीत से आसानी से दूर हो जाते हैं।', 'जब जीवन पथ 7 (आत्मविश्लेषी और विश्लेषणात्मक) और जीवन पथ 9 (करुणामय और आदर्शवादी) मिलते हैं, तो रिश्ते में अच्छा स्वाभाविक तालमेल होता है (अनुकूलता स्कोर 70/100)। 7 का ज्ञान 9 के उदारता के साथ अच्छा मेल खाता है, इसलिए हर साथी वह देता है जो दूसरे में कमी है। प्रेम में यह गर्म, सुरक्षित जुड़ाव के रूप में दिखता है। विवाह के लिए एक-दूसरे की वैयक्तिकता की रक्षा करें। व्यापार में यह जोड़ी भरोसेमंद और पूरक है।'),
(8, 8, 70, 'hi', 'पूरक जोड़ी। 8 का प्रेरणा और 8 का प्रेरणा एक-दूसरे को संतुलित करते हैं, जिससे यह एक सहायक बंधन बनता है।', 'संवाद शैली में छोटे अंतर पर ध्यान देना ज़रूरी है, पर ईमानदार बातचीत से आसानी से दूर हो जाते हैं।', 'जब जीवन पथ 8 (महत्वाकांक्षी और शक्तिशाली) और जीवन पथ 8 (महत्वाकांक्षी और शक्तिशाली) मिलते हैं, तो रिश्ते में अच्छा स्वाभाविक तालमेल होता है (अनुकूलता स्कोर 70/100)। दो 8 एक साथ तुरंत मूल्य और प्रवृत्ति साझा करते हैं, जिससे जल्दी नज़दीकी बनती है। जोखिम यह कि वे एक-दूसरे की कमज़ोरियाँ बढ़ा सकते हैं। प्रेम में यह गर्म, सुरक्षित जुड़ाव के रूप में दिखता है। विवाह के लिए एक-दूसरे की वैयक्तिकता की रक्षा करें। व्यापार में यह जोड़ी भरोसेमंद और पूरक है।'),
(8, 9, 65, 'hi', 'विरोधों का रिश्ता। 8 का महत्वाकांक्षी और शक्तिशाली स्वभाव 9 के करुणामय और आदर्शवादी स्वभाव से मिलता है; प्रयास से ये अंतर समृद्ध कर सकते हैं।', 'आप अलग दिशाओं में खिंच सकते हैं — 8 का प्रेरणा बनाम 9 का उदारता। सचेत समझौता ही सामंजस्य की कुंजी है।', 'जब जीवन पथ 8 (महत्वाकांक्षी और शक्तिशाली) और जीवन पथ 9 (करुणामय और आदर्शवादी) मिलते हैं, तो रिश्ते में मध्यम स्वाभाविक तालमेल होता है (अनुकूलता स्कोर 65/100)। 8 का प्रेरणा 9 के उदारता से टकरा सकता है, इसलिए दोनों को सचेत रूप से तालमेल बैठाना होगा। प्रेम में यह ऐसा आकर्षण है जिसे स्वस्थ रहने के लिए नियम चाहिए। विवाह के लिए पैसे, स्वतंत्रता और भावनाओं पर पहले सहमति बनाएँ। व्यापार में भूमिकाएँ स्पष्ट रखें।'),
(9, 9, 80, 'hi', 'पूरक जोड़ी। 9 का उदारता और 9 का उदारता एक-दूसरे को संतुलित करते हैं, जिससे यह एक सहायक बंधन बनता है।', 'संवाद शैली में छोटे अंतर पर ध्यान देना ज़रूरी है, पर ईमानदार बातचीत से आसानी से दूर हो जाते हैं।', 'जब जीवन पथ 9 (करुणामय और आदर्शवादी) और जीवन पथ 9 (करुणामय और आदर्शवादी) मिलते हैं, तो रिश्ते में अच्छा स्वाभाविक तालमेल होता है (अनुकूलता स्कोर 80/100)। दो 9 एक साथ तुरंत मूल्य और प्रवृत्ति साझा करते हैं, जिससे जल्दी नज़दीकी बनती है। जोखिम यह कि वे एक-दूसरे की कमज़ोरियाँ बढ़ा सकते हैं। प्रेम में यह गर्म, सुरक्षित जुड़ाव के रूप में दिखता है। विवाह के लिए एक-दूसरे की वैयक्तिकता की रक्षा करें। व्यापार में यह जोड़ी भरोसेमंद और पूरक है।');

-- =====================================================================
-- BUNDLED FILE: seeds/seed_compatibility_hinglish.sql
-- =====================================================================

-- Phase 2c: COMPATIBILITY DATA seed (45 pairs, hinglish)
-- Scores match app matrix. Additive, safe to re-run.
DELETE FROM public.compatibility_data WHERE language = 'hinglish';
INSERT INTO public.compatibility_data (number1, number2, score, language, strength, challenges, detailed_analysis) VALUES
(1, 1, 70, 'hinglish', 'Complementary pairing. 1 ka leadership aur 1 ka leadership ek-doosre ko balance karte hain, supportive bond banta hai.', 'Communication style mein chote differences par dhyan chahiye, par honest baat se aasaani se solve ho jaate hain.', 'Jab Life Path 1 (independent aur driven) aur Life Path 1 (independent aur driven) milte hain, rishte mein Good natural resonance hota hai (compatibility score 70/100). Do 1 saath turant values aur instincts share karte hain, jaldi closeness banti hai. Risk: ek-doosre ki weaknesses amplify kar sakte hain. Love mein ye warm, secure attachment dikhata hai. Marriage ke liye ek-doosre ki individuality protect karo. Business mein ye combination dependable aur complementary hai.'),
(1, 2, 65, 'hinglish', 'Contrasts ka rishta. 1 ka independent aur driven nature 2 ke sensitive aur cooperative nature se milta hai; effort se ye differences enrich kar sakte hain.', 'Aap alag directions mein khich sakte ho — 1 ka leadership vs 2 ka diplomacy. Conscious compromise hi harmony ki key hai.', 'Jab Life Path 1 (independent aur driven) aur Life Path 2 (sensitive aur cooperative) milte hain, rishte mein Moderate natural resonance hota hai (compatibility score 65/100). 1 ka leadership 2 ke diplomacy se clash kar sakta hai, isliye dono ko consciously taalmel bithana hoga. Love mein ye aisa attraction hai jise healthy rehne ke liye ground rules chahiye. Marriage ke liye paisa, freedom aur emotions par pehle agree karo. Business mein roles clear rakho.'),
(1, 3, 85, 'hinglish', 'Naturally harmonious match. 1 ki independent aur driven energy aur 3 ki expressive aur joyful energy ek-doosre ko reinforce karti hain, deep understanding banti hai.', 'Aapsi ease complacency la sakti hai. Individual goals nurture karte raho taaki bond alive rahe.', 'Jab Life Path 1 (independent aur driven) aur Life Path 3 (expressive aur joyful) milte hain, rishte mein Excellent natural resonance hota hai (compatibility score 85/100). 1 ka leadership 3 ke creativity ke saath achha pair hota hai, har partner woh deta hai jo doosre mein kami hai. Love mein ye warm, secure attachment dikhata hai. Marriage ke liye ek-doosre ki individuality protect karo. Business mein ye combination dependable aur complementary hai.'),
(1, 4, 55, 'hinglish', 'Contrasts ka rishta. 1 ka independent aur driven nature 4 ke stable aur disciplined nature se milta hai; effort se ye differences enrich kar sakte hain.', 'Aap alag directions mein khich sakte ho — 1 ka leadership vs 4 ka reliability. Conscious compromise hi harmony ki key hai.', 'Jab Life Path 1 (independent aur driven) aur Life Path 4 (stable aur disciplined) milte hain, rishte mein Moderate natural resonance hota hai (compatibility score 55/100). 1 ka leadership 4 ke reliability se clash kar sakta hai, isliye dono ko consciously taalmel bithana hoga. Love mein ye aisa attraction hai jise healthy rehne ke liye ground rules chahiye. Marriage ke liye paisa, freedom aur emotions par pehle agree karo. Business mein roles clear rakho.'),
(1, 5, 90, 'hinglish', 'Naturally harmonious match. 1 ki independent aur driven energy aur 5 ki free-spirited aur adventurous energy ek-doosre ko reinforce karti hain, deep understanding banti hai.', 'Aapsi ease complacency la sakti hai. Individual goals nurture karte raho taaki bond alive rahe.', 'Jab Life Path 1 (independent aur driven) aur Life Path 5 (free-spirited aur adventurous) milte hain, rishte mein Excellent natural resonance hota hai (compatibility score 90/100). 1 ka leadership 5 ke adaptability ke saath achha pair hota hai, har partner woh deta hai jo doosre mein kami hai. Love mein ye warm, secure attachment dikhata hai. Marriage ke liye ek-doosre ki individuality protect karo. Business mein ye combination dependable aur complementary hai.'),
(1, 6, 60, 'hinglish', 'Contrasts ka rishta. 1 ka independent aur driven nature 6 ke nurturing aur responsible nature se milta hai; effort se ye differences enrich kar sakte hain.', 'Aap alag directions mein khich sakte ho — 1 ka leadership vs 6 ka devotion. Conscious compromise hi harmony ki key hai.', 'Jab Life Path 1 (independent aur driven) aur Life Path 6 (nurturing aur responsible) milte hain, rishte mein Moderate natural resonance hota hai (compatibility score 60/100). 1 ka leadership 6 ke devotion se clash kar sakta hai, isliye dono ko consciously taalmel bithana hoga. Love mein ye aisa attraction hai jise healthy rehne ke liye ground rules chahiye. Marriage ke liye paisa, freedom aur emotions par pehle agree karo. Business mein roles clear rakho.'),
(1, 7, 75, 'hinglish', 'Complementary pairing. 1 ka leadership aur 7 ka wisdom ek-doosre ko balance karte hain, supportive bond banta hai.', 'Communication style mein chote differences par dhyan chahiye, par honest baat se aasaani se solve ho jaate hain.', 'Jab Life Path 1 (independent aur driven) aur Life Path 7 (introspective aur analytical) milte hain, rishte mein Good natural resonance hota hai (compatibility score 75/100). 1 ka leadership 7 ke wisdom ke saath achha pair hota hai, har partner woh deta hai jo doosre mein kami hai. Love mein ye warm, secure attachment dikhata hai. Marriage ke liye ek-doosre ki individuality protect karo. Business mein ye combination dependable aur complementary hai.'),
(1, 8, 80, 'hinglish', 'Complementary pairing. 1 ka leadership aur 8 ka drive ek-doosre ko balance karte hain, supportive bond banta hai.', 'Communication style mein chote differences par dhyan chahiye, par honest baat se aasaani se solve ho jaate hain.', 'Jab Life Path 1 (independent aur driven) aur Life Path 8 (ambitious aur powerful) milte hain, rishte mein Good natural resonance hota hai (compatibility score 80/100). 1 ka leadership 8 ke drive ke saath achha pair hota hai, har partner woh deta hai jo doosre mein kami hai. Love mein ye warm, secure attachment dikhata hai. Marriage ke liye ek-doosre ki individuality protect karo. Business mein ye combination dependable aur complementary hai.'),
(1, 9, 85, 'hinglish', 'Naturally harmonious match. 1 ki independent aur driven energy aur 9 ki compassionate aur idealistic energy ek-doosre ko reinforce karti hain, deep understanding banti hai.', 'Aapsi ease complacency la sakti hai. Individual goals nurture karte raho taaki bond alive rahe.', 'Jab Life Path 1 (independent aur driven) aur Life Path 9 (compassionate aur idealistic) milte hain, rishte mein Excellent natural resonance hota hai (compatibility score 85/100). 1 ka leadership 9 ke generosity ke saath achha pair hota hai, har partner woh deta hai jo doosre mein kami hai. Love mein ye warm, secure attachment dikhata hai. Marriage ke liye ek-doosre ki individuality protect karo. Business mein ye combination dependable aur complementary hai.'),
(2, 2, 80, 'hinglish', 'Complementary pairing. 2 ka diplomacy aur 2 ka diplomacy ek-doosre ko balance karte hain, supportive bond banta hai.', 'Communication style mein chote differences par dhyan chahiye, par honest baat se aasaani se solve ho jaate hain.', 'Jab Life Path 2 (sensitive aur cooperative) aur Life Path 2 (sensitive aur cooperative) milte hain, rishte mein Good natural resonance hota hai (compatibility score 80/100). Do 2 saath turant values aur instincts share karte hain, jaldi closeness banti hai. Risk: ek-doosre ki weaknesses amplify kar sakte hain. Love mein ye warm, secure attachment dikhata hai. Marriage ke liye ek-doosre ki individuality protect karo. Business mein ye combination dependable aur complementary hai.'),
(2, 3, 70, 'hinglish', 'Complementary pairing. 2 ka diplomacy aur 3 ka creativity ek-doosre ko balance karte hain, supportive bond banta hai.', 'Communication style mein chote differences par dhyan chahiye, par honest baat se aasaani se solve ho jaate hain.', 'Jab Life Path 2 (sensitive aur cooperative) aur Life Path 3 (expressive aur joyful) milte hain, rishte mein Good natural resonance hota hai (compatibility score 70/100). 2 ka diplomacy 3 ke creativity ke saath achha pair hota hai, har partner woh deta hai jo doosre mein kami hai. Love mein ye warm, secure attachment dikhata hai. Marriage ke liye ek-doosre ki individuality protect karo. Business mein ye combination dependable aur complementary hai.'),
(2, 4, 75, 'hinglish', 'Complementary pairing. 2 ka diplomacy aur 4 ka reliability ek-doosre ko balance karte hain, supportive bond banta hai.', 'Communication style mein chote differences par dhyan chahiye, par honest baat se aasaani se solve ho jaate hain.', 'Jab Life Path 2 (sensitive aur cooperative) aur Life Path 4 (stable aur disciplined) milte hain, rishte mein Good natural resonance hota hai (compatibility score 75/100). 2 ka diplomacy 4 ke reliability ke saath achha pair hota hai, har partner woh deta hai jo doosre mein kami hai. Love mein ye warm, secure attachment dikhata hai. Marriage ke liye ek-doosre ki individuality protect karo. Business mein ye combination dependable aur complementary hai.'),
(2, 5, 55, 'hinglish', 'Contrasts ka rishta. 2 ka sensitive aur cooperative nature 5 ke free-spirited aur adventurous nature se milta hai; effort se ye differences enrich kar sakte hain.', 'Aap alag directions mein khich sakte ho — 2 ka diplomacy vs 5 ka adaptability. Conscious compromise hi harmony ki key hai.', 'Jab Life Path 2 (sensitive aur cooperative) aur Life Path 5 (free-spirited aur adventurous) milte hain, rishte mein Moderate natural resonance hota hai (compatibility score 55/100). 2 ka diplomacy 5 ke adaptability se clash kar sakta hai, isliye dono ko consciously taalmel bithana hoga. Love mein ye aisa attraction hai jise healthy rehne ke liye ground rules chahiye. Marriage ke liye paisa, freedom aur emotions par pehle agree karo. Business mein roles clear rakho.'),
(2, 6, 90, 'hinglish', 'Naturally harmonious match. 2 ki sensitive aur cooperative energy aur 6 ki nurturing aur responsible energy ek-doosre ko reinforce karti hain, deep understanding banti hai.', 'Aapsi ease complacency la sakti hai. Individual goals nurture karte raho taaki bond alive rahe.', 'Jab Life Path 2 (sensitive aur cooperative) aur Life Path 6 (nurturing aur responsible) milte hain, rishte mein Excellent natural resonance hota hai (compatibility score 90/100). 2 ka diplomacy 6 ke devotion ke saath achha pair hota hai, har partner woh deta hai jo doosre mein kami hai. Love mein ye warm, secure attachment dikhata hai. Marriage ke liye ek-doosre ki individuality protect karo. Business mein ye combination dependable aur complementary hai.'),
(2, 7, 60, 'hinglish', 'Contrasts ka rishta. 2 ka sensitive aur cooperative nature 7 ke introspective aur analytical nature se milta hai; effort se ye differences enrich kar sakte hain.', 'Aap alag directions mein khich sakte ho — 2 ka diplomacy vs 7 ka wisdom. Conscious compromise hi harmony ki key hai.', 'Jab Life Path 2 (sensitive aur cooperative) aur Life Path 7 (introspective aur analytical) milte hain, rishte mein Moderate natural resonance hota hai (compatibility score 60/100). 2 ka diplomacy 7 ke wisdom se clash kar sakta hai, isliye dono ko consciously taalmel bithana hoga. Love mein ye aisa attraction hai jise healthy rehne ke liye ground rules chahiye. Marriage ke liye paisa, freedom aur emotions par pehle agree karo. Business mein roles clear rakho.'),
(2, 8, 65, 'hinglish', 'Contrasts ka rishta. 2 ka sensitive aur cooperative nature 8 ke ambitious aur powerful nature se milta hai; effort se ye differences enrich kar sakte hain.', 'Aap alag directions mein khich sakte ho — 2 ka diplomacy vs 8 ka drive. Conscious compromise hi harmony ki key hai.', 'Jab Life Path 2 (sensitive aur cooperative) aur Life Path 8 (ambitious aur powerful) milte hain, rishte mein Moderate natural resonance hota hai (compatibility score 65/100). 2 ka diplomacy 8 ke drive se clash kar sakta hai, isliye dono ko consciously taalmel bithana hoga. Love mein ye aisa attraction hai jise healthy rehne ke liye ground rules chahiye. Marriage ke liye paisa, freedom aur emotions par pehle agree karo. Business mein roles clear rakho.'),
(2, 9, 85, 'hinglish', 'Naturally harmonious match. 2 ki sensitive aur cooperative energy aur 9 ki compassionate aur idealistic energy ek-doosre ko reinforce karti hain, deep understanding banti hai.', 'Aapsi ease complacency la sakti hai. Individual goals nurture karte raho taaki bond alive rahe.', 'Jab Life Path 2 (sensitive aur cooperative) aur Life Path 9 (compassionate aur idealistic) milte hain, rishte mein Excellent natural resonance hota hai (compatibility score 85/100). 2 ka diplomacy 9 ke generosity ke saath achha pair hota hai, har partner woh deta hai jo doosre mein kami hai. Love mein ye warm, secure attachment dikhata hai. Marriage ke liye ek-doosre ki individuality protect karo. Business mein ye combination dependable aur complementary hai.'),
(3, 3, 75, 'hinglish', 'Complementary pairing. 3 ka creativity aur 3 ka creativity ek-doosre ko balance karte hain, supportive bond banta hai.', 'Communication style mein chote differences par dhyan chahiye, par honest baat se aasaani se solve ho jaate hain.', 'Jab Life Path 3 (expressive aur joyful) aur Life Path 3 (expressive aur joyful) milte hain, rishte mein Good natural resonance hota hai (compatibility score 75/100). Do 3 saath turant values aur instincts share karte hain, jaldi closeness banti hai. Risk: ek-doosre ki weaknesses amplify kar sakte hain. Love mein ye warm, secure attachment dikhata hai. Marriage ke liye ek-doosre ki individuality protect karo. Business mein ye combination dependable aur complementary hai.'),
(3, 4, 50, 'hinglish', 'Growth-oriented match. 3 aur 4 life ko bahut alag dekhte hain, jo patience test karta hai par powerful lessons deta hai.', 'Core needs bahut alag: 3 ko creativity chahiye jabki 4 reliability par lean karta hai. Patience aur respect zaroori hain.', 'Jab Life Path 3 (expressive aur joyful) aur Life Path 4 (stable aur disciplined) milte hain, rishte mein Challenging natural resonance hota hai (compatibility score 50/100). 3 ka creativity 4 ke reliability se clash kar sakta hai, isliye dono ko consciously taalmel bithana hoga. Love mein ye aisa attraction hai jise healthy rehne ke liye ground rules chahiye. Marriage ke liye paisa, freedom aur emotions par pehle agree karo. Business mein roles clear rakho.'),
(3, 5, 90, 'hinglish', 'Naturally harmonious match. 3 ki expressive aur joyful energy aur 5 ki free-spirited aur adventurous energy ek-doosre ko reinforce karti hain, deep understanding banti hai.', 'Aapsi ease complacency la sakti hai. Individual goals nurture karte raho taaki bond alive rahe.', 'Jab Life Path 3 (expressive aur joyful) aur Life Path 5 (free-spirited aur adventurous) milte hain, rishte mein Excellent natural resonance hota hai (compatibility score 90/100). 3 ka creativity 5 ke adaptability ke saath achha pair hota hai, har partner woh deta hai jo doosre mein kami hai. Love mein ye warm, secure attachment dikhata hai. Marriage ke liye ek-doosre ki individuality protect karo. Business mein ye combination dependable aur complementary hai.'),
(3, 6, 85, 'hinglish', 'Naturally harmonious match. 3 ki expressive aur joyful energy aur 6 ki nurturing aur responsible energy ek-doosre ko reinforce karti hain, deep understanding banti hai.', 'Aapsi ease complacency la sakti hai. Individual goals nurture karte raho taaki bond alive rahe.', 'Jab Life Path 3 (expressive aur joyful) aur Life Path 6 (nurturing aur responsible) milte hain, rishte mein Excellent natural resonance hota hai (compatibility score 85/100). 3 ka creativity 6 ke devotion ke saath achha pair hota hai, har partner woh deta hai jo doosre mein kami hai. Love mein ye warm, secure attachment dikhata hai. Marriage ke liye ek-doosre ki individuality protect karo. Business mein ye combination dependable aur complementary hai.'),
(3, 7, 65, 'hinglish', 'Contrasts ka rishta. 3 ka expressive aur joyful nature 7 ke introspective aur analytical nature se milta hai; effort se ye differences enrich kar sakte hain.', 'Aap alag directions mein khich sakte ho — 3 ka creativity vs 7 ka wisdom. Conscious compromise hi harmony ki key hai.', 'Jab Life Path 3 (expressive aur joyful) aur Life Path 7 (introspective aur analytical) milte hain, rishte mein Moderate natural resonance hota hai (compatibility score 65/100). 3 ka creativity 7 ke wisdom se clash kar sakta hai, isliye dono ko consciously taalmel bithana hoga. Love mein ye aisa attraction hai jise healthy rehne ke liye ground rules chahiye. Marriage ke liye paisa, freedom aur emotions par pehle agree karo. Business mein roles clear rakho.'),
(3, 8, 55, 'hinglish', 'Contrasts ka rishta. 3 ka expressive aur joyful nature 8 ke ambitious aur powerful nature se milta hai; effort se ye differences enrich kar sakte hain.', 'Aap alag directions mein khich sakte ho — 3 ka creativity vs 8 ka drive. Conscious compromise hi harmony ki key hai.', 'Jab Life Path 3 (expressive aur joyful) aur Life Path 8 (ambitious aur powerful) milte hain, rishte mein Moderate natural resonance hota hai (compatibility score 55/100). 3 ka creativity 8 ke drive se clash kar sakta hai, isliye dono ko consciously taalmel bithana hoga. Love mein ye aisa attraction hai jise healthy rehne ke liye ground rules chahiye. Marriage ke liye paisa, freedom aur emotions par pehle agree karo. Business mein roles clear rakho.'),
(3, 9, 80, 'hinglish', 'Complementary pairing. 3 ka creativity aur 9 ka generosity ek-doosre ko balance karte hain, supportive bond banta hai.', 'Communication style mein chote differences par dhyan chahiye, par honest baat se aasaani se solve ho jaate hain.', 'Jab Life Path 3 (expressive aur joyful) aur Life Path 9 (compassionate aur idealistic) milte hain, rishte mein Good natural resonance hota hai (compatibility score 80/100). 3 ka creativity 9 ke generosity ke saath achha pair hota hai, har partner woh deta hai jo doosre mein kami hai. Love mein ye warm, secure attachment dikhata hai. Marriage ke liye ek-doosre ki individuality protect karo. Business mein ye combination dependable aur complementary hai.'),
(4, 4, 70, 'hinglish', 'Complementary pairing. 4 ka reliability aur 4 ka reliability ek-doosre ko balance karte hain, supportive bond banta hai.', 'Communication style mein chote differences par dhyan chahiye, par honest baat se aasaani se solve ho jaate hain.', 'Jab Life Path 4 (stable aur disciplined) aur Life Path 4 (stable aur disciplined) milte hain, rishte mein Good natural resonance hota hai (compatibility score 70/100). Do 4 saath turant values aur instincts share karte hain, jaldi closeness banti hai. Risk: ek-doosre ki weaknesses amplify kar sakte hain. Love mein ye warm, secure attachment dikhata hai. Marriage ke liye ek-doosre ki individuality protect karo. Business mein ye combination dependable aur complementary hai.'),
(4, 5, 45, 'hinglish', 'Growth-oriented match. 4 aur 5 life ko bahut alag dekhte hain, jo patience test karta hai par powerful lessons deta hai.', 'Core needs bahut alag: 4 ko reliability chahiye jabki 5 adaptability par lean karta hai. Patience aur respect zaroori hain.', 'Jab Life Path 4 (stable aur disciplined) aur Life Path 5 (free-spirited aur adventurous) milte hain, rishte mein Challenging natural resonance hota hai (compatibility score 45/100). 4 ka reliability 5 ke adaptability se clash kar sakta hai, isliye dono ko consciously taalmel bithana hoga. Love mein ye aisa attraction hai jise healthy rehne ke liye ground rules chahiye. Marriage ke liye paisa, freedom aur emotions par pehle agree karo. Business mein roles clear rakho.'),
(4, 6, 75, 'hinglish', 'Complementary pairing. 4 ka reliability aur 6 ka devotion ek-doosre ko balance karte hain, supportive bond banta hai.', 'Communication style mein chote differences par dhyan chahiye, par honest baat se aasaani se solve ho jaate hain.', 'Jab Life Path 4 (stable aur disciplined) aur Life Path 6 (nurturing aur responsible) milte hain, rishte mein Good natural resonance hota hai (compatibility score 75/100). 4 ka reliability 6 ke devotion ke saath achha pair hota hai, har partner woh deta hai jo doosre mein kami hai. Love mein ye warm, secure attachment dikhata hai. Marriage ke liye ek-doosre ki individuality protect karo. Business mein ye combination dependable aur complementary hai.'),
(4, 7, 80, 'hinglish', 'Complementary pairing. 4 ka reliability aur 7 ka wisdom ek-doosre ko balance karte hain, supportive bond banta hai.', 'Communication style mein chote differences par dhyan chahiye, par honest baat se aasaani se solve ho jaate hain.', 'Jab Life Path 4 (stable aur disciplined) aur Life Path 7 (introspective aur analytical) milte hain, rishte mein Good natural resonance hota hai (compatibility score 80/100). 4 ka reliability 7 ke wisdom ke saath achha pair hota hai, har partner woh deta hai jo doosre mein kami hai. Love mein ye warm, secure attachment dikhata hai. Marriage ke liye ek-doosre ki individuality protect karo. Business mein ye combination dependable aur complementary hai.'),
(4, 8, 85, 'hinglish', 'Naturally harmonious match. 4 ki stable aur disciplined energy aur 8 ki ambitious aur powerful energy ek-doosre ko reinforce karti hain, deep understanding banti hai.', 'Aapsi ease complacency la sakti hai. Individual goals nurture karte raho taaki bond alive rahe.', 'Jab Life Path 4 (stable aur disciplined) aur Life Path 8 (ambitious aur powerful) milte hain, rishte mein Excellent natural resonance hota hai (compatibility score 85/100). 4 ka reliability 8 ke drive ke saath achha pair hota hai, har partner woh deta hai jo doosre mein kami hai. Love mein ye warm, secure attachment dikhata hai. Marriage ke liye ek-doosre ki individuality protect karo. Business mein ye combination dependable aur complementary hai.'),
(4, 9, 50, 'hinglish', 'Growth-oriented match. 4 aur 9 life ko bahut alag dekhte hain, jo patience test karta hai par powerful lessons deta hai.', 'Core needs bahut alag: 4 ko reliability chahiye jabki 9 generosity par lean karta hai. Patience aur respect zaroori hain.', 'Jab Life Path 4 (stable aur disciplined) aur Life Path 9 (compassionate aur idealistic) milte hain, rishte mein Challenging natural resonance hota hai (compatibility score 50/100). 4 ka reliability 9 ke generosity se clash kar sakta hai, isliye dono ko consciously taalmel bithana hoga. Love mein ye aisa attraction hai jise healthy rehne ke liye ground rules chahiye. Marriage ke liye paisa, freedom aur emotions par pehle agree karo. Business mein roles clear rakho.'),
(5, 5, 60, 'hinglish', 'Contrasts ka rishta. 5 ka free-spirited aur adventurous nature 5 ke free-spirited aur adventurous nature se milta hai; effort se ye differences enrich kar sakte hain.', 'Aap alag directions mein khich sakte ho — 5 ka adaptability vs 5 ka adaptability. Conscious compromise hi harmony ki key hai.', 'Jab Life Path 5 (free-spirited aur adventurous) aur Life Path 5 (free-spirited aur adventurous) milte hain, rishte mein Moderate natural resonance hota hai (compatibility score 60/100). Do 5 saath turant values aur instincts share karte hain, jaldi closeness banti hai. Risk: ek-doosre ki weaknesses amplify kar sakte hain. Love mein ye aisa attraction hai jise healthy rehne ke liye ground rules chahiye. Marriage ke liye paisa, freedom aur emotions par pehle agree karo. Business mein roles clear rakho.'),
(5, 6, 55, 'hinglish', 'Contrasts ka rishta. 5 ka free-spirited aur adventurous nature 6 ke nurturing aur responsible nature se milta hai; effort se ye differences enrich kar sakte hain.', 'Aap alag directions mein khich sakte ho — 5 ka adaptability vs 6 ka devotion. Conscious compromise hi harmony ki key hai.', 'Jab Life Path 5 (free-spirited aur adventurous) aur Life Path 6 (nurturing aur responsible) milte hain, rishte mein Moderate natural resonance hota hai (compatibility score 55/100). 5 ka adaptability 6 ke devotion se clash kar sakta hai, isliye dono ko consciously taalmel bithana hoga. Love mein ye aisa attraction hai jise healthy rehne ke liye ground rules chahiye. Marriage ke liye paisa, freedom aur emotions par pehle agree karo. Business mein roles clear rakho.'),
(5, 7, 85, 'hinglish', 'Naturally harmonious match. 5 ki free-spirited aur adventurous energy aur 7 ki introspective aur analytical energy ek-doosre ko reinforce karti hain, deep understanding banti hai.', 'Aapsi ease complacency la sakti hai. Individual goals nurture karte raho taaki bond alive rahe.', 'Jab Life Path 5 (free-spirited aur adventurous) aur Life Path 7 (introspective aur analytical) milte hain, rishte mein Excellent natural resonance hota hai (compatibility score 85/100). 5 ka adaptability 7 ke wisdom ke saath achha pair hota hai, har partner woh deta hai jo doosre mein kami hai. Love mein ye warm, secure attachment dikhata hai. Marriage ke liye ek-doosre ki individuality protect karo. Business mein ye combination dependable aur complementary hai.'),
(5, 8, 70, 'hinglish', 'Complementary pairing. 5 ka adaptability aur 8 ka drive ek-doosre ko balance karte hain, supportive bond banta hai.', 'Communication style mein chote differences par dhyan chahiye, par honest baat se aasaani se solve ho jaate hain.', 'Jab Life Path 5 (free-spirited aur adventurous) aur Life Path 8 (ambitious aur powerful) milte hain, rishte mein Good natural resonance hota hai (compatibility score 70/100). 5 ka adaptability 8 ke drive ke saath achha pair hota hai, har partner woh deta hai jo doosre mein kami hai. Love mein ye warm, secure attachment dikhata hai. Marriage ke liye ek-doosre ki individuality protect karo. Business mein ye combination dependable aur complementary hai.'),
(5, 9, 90, 'hinglish', 'Naturally harmonious match. 5 ki free-spirited aur adventurous energy aur 9 ki compassionate aur idealistic energy ek-doosre ko reinforce karti hain, deep understanding banti hai.', 'Aapsi ease complacency la sakti hai. Individual goals nurture karte raho taaki bond alive rahe.', 'Jab Life Path 5 (free-spirited aur adventurous) aur Life Path 9 (compassionate aur idealistic) milte hain, rishte mein Excellent natural resonance hota hai (compatibility score 90/100). 5 ka adaptability 9 ke generosity ke saath achha pair hota hai, har partner woh deta hai jo doosre mein kami hai. Love mein ye warm, secure attachment dikhata hai. Marriage ke liye ek-doosre ki individuality protect karo. Business mein ye combination dependable aur complementary hai.'),
(6, 6, 85, 'hinglish', 'Naturally harmonious match. 6 ki nurturing aur responsible energy aur 6 ki nurturing aur responsible energy ek-doosre ko reinforce karti hain, deep understanding banti hai.', 'Aapsi ease complacency la sakti hai. Individual goals nurture karte raho taaki bond alive rahe.', 'Jab Life Path 6 (nurturing aur responsible) aur Life Path 6 (nurturing aur responsible) milte hain, rishte mein Excellent natural resonance hota hai (compatibility score 85/100). Do 6 saath turant values aur instincts share karte hain, jaldi closeness banti hai. Risk: ek-doosre ki weaknesses amplify kar sakte hain. Love mein ye warm, secure attachment dikhata hai. Marriage ke liye ek-doosre ki individuality protect karo. Business mein ye combination dependable aur complementary hai.'),
(6, 7, 55, 'hinglish', 'Contrasts ka rishta. 6 ka nurturing aur responsible nature 7 ke introspective aur analytical nature se milta hai; effort se ye differences enrich kar sakte hain.', 'Aap alag directions mein khich sakte ho — 6 ka devotion vs 7 ka wisdom. Conscious compromise hi harmony ki key hai.', 'Jab Life Path 6 (nurturing aur responsible) aur Life Path 7 (introspective aur analytical) milte hain, rishte mein Moderate natural resonance hota hai (compatibility score 55/100). 6 ka devotion 7 ke wisdom se clash kar sakta hai, isliye dono ko consciously taalmel bithana hoga. Love mein ye aisa attraction hai jise healthy rehne ke liye ground rules chahiye. Marriage ke liye paisa, freedom aur emotions par pehle agree karo. Business mein roles clear rakho.'),
(6, 8, 70, 'hinglish', 'Complementary pairing. 6 ka devotion aur 8 ka drive ek-doosre ko balance karte hain, supportive bond banta hai.', 'Communication style mein chote differences par dhyan chahiye, par honest baat se aasaani se solve ho jaate hain.', 'Jab Life Path 6 (nurturing aur responsible) aur Life Path 8 (ambitious aur powerful) milte hain, rishte mein Good natural resonance hota hai (compatibility score 70/100). 6 ka devotion 8 ke drive ke saath achha pair hota hai, har partner woh deta hai jo doosre mein kami hai. Love mein ye warm, secure attachment dikhata hai. Marriage ke liye ek-doosre ki individuality protect karo. Business mein ye combination dependable aur complementary hai.'),
(6, 9, 90, 'hinglish', 'Naturally harmonious match. 6 ki nurturing aur responsible energy aur 9 ki compassionate aur idealistic energy ek-doosre ko reinforce karti hain, deep understanding banti hai.', 'Aapsi ease complacency la sakti hai. Individual goals nurture karte raho taaki bond alive rahe.', 'Jab Life Path 6 (nurturing aur responsible) aur Life Path 9 (compassionate aur idealistic) milte hain, rishte mein Excellent natural resonance hota hai (compatibility score 90/100). 6 ka devotion 9 ke generosity ke saath achha pair hota hai, har partner woh deta hai jo doosre mein kami hai. Love mein ye warm, secure attachment dikhata hai. Marriage ke liye ek-doosre ki individuality protect karo. Business mein ye combination dependable aur complementary hai.'),
(7, 7, 75, 'hinglish', 'Complementary pairing. 7 ka wisdom aur 7 ka wisdom ek-doosre ko balance karte hain, supportive bond banta hai.', 'Communication style mein chote differences par dhyan chahiye, par honest baat se aasaani se solve ho jaate hain.', 'Jab Life Path 7 (introspective aur analytical) aur Life Path 7 (introspective aur analytical) milte hain, rishte mein Good natural resonance hota hai (compatibility score 75/100). Do 7 saath turant values aur instincts share karte hain, jaldi closeness banti hai. Risk: ek-doosre ki weaknesses amplify kar sakte hain. Love mein ye warm, secure attachment dikhata hai. Marriage ke liye ek-doosre ki individuality protect karo. Business mein ye combination dependable aur complementary hai.'),
(7, 8, 60, 'hinglish', 'Contrasts ka rishta. 7 ka introspective aur analytical nature 8 ke ambitious aur powerful nature se milta hai; effort se ye differences enrich kar sakte hain.', 'Aap alag directions mein khich sakte ho — 7 ka wisdom vs 8 ka drive. Conscious compromise hi harmony ki key hai.', 'Jab Life Path 7 (introspective aur analytical) aur Life Path 8 (ambitious aur powerful) milte hain, rishte mein Moderate natural resonance hota hai (compatibility score 60/100). 7 ka wisdom 8 ke drive se clash kar sakta hai, isliye dono ko consciously taalmel bithana hoga. Love mein ye aisa attraction hai jise healthy rehne ke liye ground rules chahiye. Marriage ke liye paisa, freedom aur emotions par pehle agree karo. Business mein roles clear rakho.'),
(7, 9, 70, 'hinglish', 'Complementary pairing. 7 ka wisdom aur 9 ka generosity ek-doosre ko balance karte hain, supportive bond banta hai.', 'Communication style mein chote differences par dhyan chahiye, par honest baat se aasaani se solve ho jaate hain.', 'Jab Life Path 7 (introspective aur analytical) aur Life Path 9 (compassionate aur idealistic) milte hain, rishte mein Good natural resonance hota hai (compatibility score 70/100). 7 ka wisdom 9 ke generosity ke saath achha pair hota hai, har partner woh deta hai jo doosre mein kami hai. Love mein ye warm, secure attachment dikhata hai. Marriage ke liye ek-doosre ki individuality protect karo. Business mein ye combination dependable aur complementary hai.'),
(8, 8, 70, 'hinglish', 'Complementary pairing. 8 ka drive aur 8 ka drive ek-doosre ko balance karte hain, supportive bond banta hai.', 'Communication style mein chote differences par dhyan chahiye, par honest baat se aasaani se solve ho jaate hain.', 'Jab Life Path 8 (ambitious aur powerful) aur Life Path 8 (ambitious aur powerful) milte hain, rishte mein Good natural resonance hota hai (compatibility score 70/100). Do 8 saath turant values aur instincts share karte hain, jaldi closeness banti hai. Risk: ek-doosre ki weaknesses amplify kar sakte hain. Love mein ye warm, secure attachment dikhata hai. Marriage ke liye ek-doosre ki individuality protect karo. Business mein ye combination dependable aur complementary hai.'),
(8, 9, 65, 'hinglish', 'Contrasts ka rishta. 8 ka ambitious aur powerful nature 9 ke compassionate aur idealistic nature se milta hai; effort se ye differences enrich kar sakte hain.', 'Aap alag directions mein khich sakte ho — 8 ka drive vs 9 ka generosity. Conscious compromise hi harmony ki key hai.', 'Jab Life Path 8 (ambitious aur powerful) aur Life Path 9 (compassionate aur idealistic) milte hain, rishte mein Moderate natural resonance hota hai (compatibility score 65/100). 8 ka drive 9 ke generosity se clash kar sakta hai, isliye dono ko consciously taalmel bithana hoga. Love mein ye aisa attraction hai jise healthy rehne ke liye ground rules chahiye. Marriage ke liye paisa, freedom aur emotions par pehle agree karo. Business mein roles clear rakho.'),
(9, 9, 80, 'hinglish', 'Complementary pairing. 9 ka generosity aur 9 ka generosity ek-doosre ko balance karte hain, supportive bond banta hai.', 'Communication style mein chote differences par dhyan chahiye, par honest baat se aasaani se solve ho jaate hain.', 'Jab Life Path 9 (compassionate aur idealistic) aur Life Path 9 (compassionate aur idealistic) milte hain, rishte mein Good natural resonance hota hai (compatibility score 80/100). Do 9 saath turant values aur instincts share karte hain, jaldi closeness banti hai. Risk: ek-doosre ki weaknesses amplify kar sakte hain. Love mein ye warm, secure attachment dikhata hai. Marriage ke liye ek-doosre ki individuality protect karo. Business mein ye combination dependable aur complementary hai.');

-- =====================================================================
-- BUNDLED FILE: seeds/seed_lucky_attributes.sql
-- =====================================================================

-- Phase 1d: LUCKY ATTRIBUTES seed (numbers 1-9,11,22,33 x en/hi/hinglish)
-- Matches app getLuckyAttributes() conventions. Additive, safe to re-run.
DELETE FROM public.lucky_attributes WHERE number IN (1,2,3,4,5,6,7,8,9,11,22,33);
INSERT INTO public.lucky_attributes (number, language, lucky_numbers, lucky_days, lucky_colors, lucky_directions) VALUES
(1, 'en', '{1,10,19,28}', ARRAY['Sunday','Monday']::text[], ARRAY['Gold','Orange','Yellow']::text[], ARRAY['East']::text[]),
(1, 'hi', '{1,10,19,28}', ARRAY['रविवार','सोमवार']::text[], ARRAY['सुनहरा','नारंगी','पीला']::text[], ARRAY['पूर्व']::text[]),
(1, 'hinglish', '{1,10,19,28}', ARRAY['Sunday (Ravivaar)','Monday (Somvaar)']::text[], ARRAY['Gold','Orange','Yellow']::text[], ARRAY['East (Poorab)']::text[]),
(2, 'en', '{2,11,20,29}', ARRAY['Monday','Friday']::text[], ARRAY['White','Cream','Green']::text[], ARRAY['North']::text[]),
(2, 'hi', '{2,11,20,29}', ARRAY['सोमवार','शुक्रवार']::text[], ARRAY['सफ़ेद','क्रीम','हरा']::text[], ARRAY['उत्तर']::text[]),
(2, 'hinglish', '{2,11,20,29}', ARRAY['Monday (Somvaar)','Friday (Shukravaar)']::text[], ARRAY['White','Cream','Green']::text[], ARRAY['North (Uttar)']::text[]),
(3, 'en', '{3,12,21,30}', ARRAY['Thursday','Friday']::text[], ARRAY['Yellow','Purple','Pink']::text[], ARRAY['Northeast']::text[]),
(3, 'hi', '{3,12,21,30}', ARRAY['गुरुवार','शुक्रवार']::text[], ARRAY['पीला','बैंगनी','गुलाबी']::text[], ARRAY['उत्तर-पूर्व']::text[]),
(3, 'hinglish', '{3,12,21,30}', ARRAY['Thursday (Guruvaar)','Friday (Shukravaar)']::text[], ARRAY['Yellow','Purple','Pink']::text[], ARRAY['Northeast']::text[]),
(4, 'en', '{4,13,22,31}', ARRAY['Saturday','Sunday']::text[], ARRAY['Blue','Grey','Khaki']::text[], ARRAY['Southwest']::text[]),
(4, 'hi', '{4,13,22,31}', ARRAY['शनिवार','रविवार']::text[], ARRAY['नीला','धूसर','खाकी']::text[], ARRAY['दक्षिण-पश्चिम']::text[]),
(4, 'hinglish', '{4,13,22,31}', ARRAY['Saturday (Shanivaar)','Sunday (Ravivaar)']::text[], ARRAY['Blue','Grey','Khaki']::text[], ARRAY['Southwest']::text[]),
(5, 'en', '{5,14,23}', ARRAY['Wednesday','Friday']::text[], ARRAY['Green','Turquoise','White']::text[], ARRAY['North']::text[]),
(5, 'hi', '{5,14,23}', ARRAY['बुधवार','शुक्रवार']::text[], ARRAY['हरा','फ़िरोज़ी','सफ़ेद']::text[], ARRAY['उत्तर']::text[]),
(5, 'hinglish', '{5,14,23}', ARRAY['Wednesday (Budhvaar)','Friday (Shukravaar)']::text[], ARRAY['Green','Turquoise','White']::text[], ARRAY['North (Uttar)']::text[]),
(6, 'en', '{6,15,24}', ARRAY['Friday','Wednesday']::text[], ARRAY['Blue','Pink','White']::text[], ARRAY['Northwest']::text[]),
(6, 'hi', '{6,15,24}', ARRAY['शुक्रवार','बुधवार']::text[], ARRAY['नीला','गुलाबी','सफ़ेद']::text[], ARRAY['उत्तर-पश्चिम']::text[]),
(6, 'hinglish', '{6,15,24}', ARRAY['Friday (Shukravaar)','Wednesday (Budhvaar)']::text[], ARRAY['Blue','Pink','White']::text[], ARRAY['Northwest']::text[]),
(7, 'en', '{7,16,25}', ARRAY['Monday','Sunday']::text[], ARRAY['White','Yellow','Green']::text[], ARRAY['Northwest']::text[]),
(7, 'hi', '{7,16,25}', ARRAY['सोमवार','रविवार']::text[], ARRAY['सफ़ेद','पीला','हरा']::text[], ARRAY['उत्तर-पश्चिम']::text[]),
(7, 'hinglish', '{7,16,25}', ARRAY['Monday (Somvaar)','Sunday (Ravivaar)']::text[], ARRAY['White','Yellow','Green']::text[], ARRAY['Northwest']::text[]),
(8, 'en', '{8,17,26}', ARRAY['Saturday','Thursday']::text[], ARRAY['Black','Blue','Grey']::text[], ARRAY['West']::text[]),
(8, 'hi', '{8,17,26}', ARRAY['शनिवार','गुरुवार']::text[], ARRAY['काला','नीला','धूसर']::text[], ARRAY['पश्चिम']::text[]),
(8, 'hinglish', '{8,17,26}', ARRAY['Saturday (Shanivaar)','Thursday (Guruvaar)']::text[], ARRAY['Black','Blue','Grey']::text[], ARRAY['West (Paschim)']::text[]),
(9, 'en', '{9,18,27}', ARRAY['Tuesday','Thursday']::text[], ARRAY['Red','Crimson','Pink']::text[], ARRAY['South']::text[]),
(9, 'hi', '{9,18,27}', ARRAY['मंगलवार','गुरुवार']::text[], ARRAY['लाल','गहरा लाल','गुलाबी']::text[], ARRAY['दक्षिण']::text[]),
(9, 'hinglish', '{9,18,27}', ARRAY['Tuesday (Mangalvaar)','Thursday (Guruvaar)']::text[], ARRAY['Red','Crimson','Pink']::text[], ARRAY['South (Dakshin)']::text[]),
(11, 'en', '{11,2,20,29}', ARRAY['Monday','Friday']::text[], ARRAY['Silver','White','Violet']::text[], ARRAY['North']::text[]),
(11, 'hi', '{11,2,20,29}', ARRAY['सोमवार','शुक्रवार']::text[], ARRAY['चाँदी','सफ़ेद','बैंगनी']::text[], ARRAY['उत्तर']::text[]),
(11, 'hinglish', '{11,2,20,29}', ARRAY['Monday (Somvaar)','Friday (Shukravaar)']::text[], ARRAY['Silver','White','Violet']::text[], ARRAY['North (Uttar)']::text[]),
(22, 'en', '{22,4,13,31}', ARRAY['Saturday','Thursday']::text[], ARRAY['Coral','Tan','Cream']::text[], ARRAY['Southwest']::text[]),
(22, 'hi', '{22,4,13,31}', ARRAY['शनिवार','गुरुवार']::text[], ARRAY['मूँगा','भूरा','क्रीम']::text[], ARRAY['दक्षिण-पश्चिम']::text[]),
(22, 'hinglish', '{22,4,13,31}', ARRAY['Saturday (Shanivaar)','Thursday (Guruvaar)']::text[], ARRAY['Coral','Tan','Cream']::text[], ARRAY['Southwest']::text[]),
(33, 'en', '{33,6,15,24}', ARRAY['Friday','Thursday']::text[], ARRAY['Turquoise','Pink','Blue']::text[], ARRAY['Northwest']::text[]),
(33, 'hi', '{33,6,15,24}', ARRAY['शुक्रवार','गुरुवार']::text[], ARRAY['फ़िरोज़ी','गुलाबी','नीला']::text[], ARRAY['उत्तर-पश्चिम']::text[]),
(33, 'hinglish', '{33,6,15,24}', ARRAY['Friday (Shukravaar)','Thursday (Guruvaar)']::text[], ARRAY['Turquoise','Pink','Blue']::text[], ARRAY['Northwest']::text[]);

-- =====================================================================
-- BUNDLED FILE: seeds/seed_affirmations.sql
-- =====================================================================

-- Phase 1c: AFFIRMATIONS seed (numbers 1-9,11,22,33 x en/hi/hinglish, 3 each)
-- Additive. Safe to re-run.
DELETE FROM public.affirmations WHERE category = 'numerology';
INSERT INTO public.affirmations (number, language, text, category, sort_order) VALUES
(1, 'en', 'I lead my life with courage and clarity.', 'numerology', 1),
(1, 'en', 'I trust my ability to begin and to finish.', 'numerology', 2),
(1, 'en', 'My independence is a strength, not a barrier to love.', 'numerology', 3),
(1, 'hi', 'मैं साहस और स्पष्टता से अपना जीवन चलाता/चलाती हूँ।', 'numerology', 1),
(1, 'hi', 'मैं शुरू करने और पूरा करने की अपनी क्षमता पर भरोसा करता/करती हूँ।', 'numerology', 2),
(1, 'hi', 'मेरी स्वतंत्रता मेरी शक्ति है, प्रेम में बाधा नहीं।', 'numerology', 3),
(1, 'hinglish', 'Main courage aur clarity se apni life lead karta/karti hoon.', 'numerology', 1),
(1, 'hinglish', 'Main shuru karne aur finish karne ki apni ability par trust karta/karti hoon.', 'numerology', 2),
(1, 'hinglish', 'Meri independence meri strength hai, love mein barrier nahi.', 'numerology', 3),
(2, 'en', 'I bring peace and understanding wherever I go.', 'numerology', 1),
(2, 'en', 'My sensitivity is a gift I honor.', 'numerology', 2),
(2, 'en', 'I give love freely while honoring my own needs.', 'numerology', 3),
(2, 'hi', 'मैं जहाँ भी जाता/जाती हूँ, शांति और समझ लाता/लाती हूँ।', 'numerology', 1),
(2, 'hi', 'मेरी संवेदनशीलता एक उपहार है जिसका मैं सम्मान करता/करती हूँ।', 'numerology', 2),
(2, 'hi', 'मैं अपनी ज़रूरतों का सम्मान करते हुए मुक्त रूप से प्रेम देता/देती हूँ।', 'numerology', 3),
(2, 'hinglish', 'Main jahan bhi jaata/jaati hoon, peace aur understanding laata/laati hoon.', 'numerology', 1),
(2, 'hinglish', 'Meri sensitivity ek gift hai jise main honor karta/karti hoon.', 'numerology', 2),
(2, 'hinglish', 'Main apni needs ko honor karte hue freely love deta/deti hoon.', 'numerology', 3),
(3, 'en', 'I express my truth with joy and confidence.', 'numerology', 1),
(3, 'en', 'My creativity flows freely and lifts others.', 'numerology', 2),
(3, 'en', 'I share my light without fear of judgment.', 'numerology', 3),
(3, 'hi', 'मैं अपना सत्य आनंद और आत्मविश्वास से व्यक्त करता/करती हूँ।', 'numerology', 1),
(3, 'hi', 'मेरी रचनात्मकता मुक्त रूप से बहती है और दूसरों को ऊपर उठाती है।', 'numerology', 2),
(3, 'hi', 'मैं बिना निर्णय के डर के अपना प्रकाश बाँटता/बाँटती हूँ।', 'numerology', 3),
(3, 'hinglish', 'Main apna truth joy aur confidence se express karta/karti hoon.', 'numerology', 1),
(3, 'hinglish', 'Meri creativity freely behti hai aur doosron ko uplift karti hai.', 'numerology', 2),
(3, 'hinglish', 'Main judgment ke dar ke bina apna light share karta/karti hoon.', 'numerology', 3),
(4, 'en', 'I build my life on solid, honest foundations.', 'numerology', 1),
(4, 'en', 'My discipline creates lasting security.', 'numerology', 2),
(4, 'en', 'I allow ease and joy alongside my hard work.', 'numerology', 3),
(4, 'hi', 'मैं अपना जीवन मज़बूत, ईमानदार नींव पर बनाता/बनाती हूँ।', 'numerology', 1),
(4, 'hi', 'मेरा अनुशासन स्थायी सुरक्षा रचता है।', 'numerology', 2),
(4, 'hi', 'मैं अपनी मेहनत के साथ सहजता और आनंद को भी आने देता/देती हूँ।', 'numerology', 3),
(4, 'hinglish', 'Main apni life solid, honest foundation par banata/banati hoon.', 'numerology', 1),
(4, 'hinglish', 'Mera discipline lasting security banata hai.', 'numerology', 2),
(4, 'hinglish', 'Main apni mehnat ke saath ease aur joy ko bhi aane deta/deti hoon.', 'numerology', 3),
(5, 'en', 'I embrace change as my path to growth.', 'numerology', 1),
(5, 'en', 'I am free, adaptable, and open to new experiences.', 'numerology', 2),
(5, 'en', 'I find lasting freedom within myself.', 'numerology', 3),
(5, 'hi', 'मैं परिवर्तन को अपनी वृद्धि का मार्ग मानता/मानती हूँ।', 'numerology', 1),
(5, 'hi', 'मैं स्वतंत्र, लचीला/लचीली और नए अनुभवों के लिए खुला/खुली हूँ।', 'numerology', 2),
(5, 'hi', 'मैं अपने भीतर स्थायी स्वतंत्रता पाता/पाती हूँ।', 'numerology', 3),
(5, 'hinglish', 'Main change ko apni growth ka path maanta/maanti hoon.', 'numerology', 1),
(5, 'hinglish', 'Main free, adaptable aur naye experiences ke liye open hoon.', 'numerology', 2),
(5, 'hinglish', 'Main apne andar lasting freedom paata/paati hoon.', 'numerology', 3),
(6, 'en', 'I nurture others from a place of fullness.', 'numerology', 1),
(6, 'en', 'I create harmony and beauty around me.', 'numerology', 2),
(6, 'en', 'I receive love as openly as I give it.', 'numerology', 3),
(6, 'hi', 'मैं पूर्णता से दूसरों का पोषण करता/करती हूँ।', 'numerology', 1),
(6, 'hi', 'मैं अपने चारों ओर सामंजस्य और सौंदर्य रचता/रचती हूँ।', 'numerology', 2),
(6, 'hi', 'मैं प्रेम उतनी ही खुलेपन से पाता/पाती हूँ जितना देता/देती हूँ।', 'numerology', 3),
(6, 'hinglish', 'Main fullness se doosron ko nurture karta/karti hoon.', 'numerology', 1),
(6, 'hinglish', 'Main apne aas-paas harmony aur beauty banata/banati hoon.', 'numerology', 2),
(6, 'hinglish', 'Main love utni hi openness se paata/paati hoon jitna deta/deti hoon.', 'numerology', 3),
(7, 'en', 'I trust my inner wisdom and intuition.', 'numerology', 1),
(7, 'en', 'Solitude restores me; connection enriches me.', 'numerology', 2),
(7, 'en', 'I share my insight to serve others.', 'numerology', 3),
(7, 'hi', 'मैं अपने भीतरी ज्ञान और अंतर्ज्ञान पर भरोसा करता/करती हूँ।', 'numerology', 1),
(7, 'hi', 'एकांत मुझे पुनर्जीवित करता है; जुड़ाव मुझे समृद्ध करता है।', 'numerology', 2),
(7, 'hi', 'मैं अपनी अंतर्दृष्टि दूसरों की सेवा के लिए बाँटता/बाँटती हूँ।', 'numerology', 3),
(7, 'hinglish', 'Main apne inner wisdom aur intuition par trust karta/karti hoon.', 'numerology', 1),
(7, 'hinglish', 'Solitude mujhe restore karta hai; connection mujhe enrich karta hai.', 'numerology', 2),
(7, 'hinglish', 'Main apni insight doosron ki service ke liye share karta/karti hoon.', 'numerology', 3),
(8, 'en', 'I attract abundance through focused effort.', 'numerology', 1),
(8, 'en', 'My worth is not defined by my results.', 'numerology', 2),
(8, 'en', 'I use my power to create good for many.', 'numerology', 3),
(8, 'hi', 'मैं केंद्रित प्रयास से समृद्धि आकर्षित करता/करती हूँ।', 'numerology', 1),
(8, 'hi', 'मेरा मूल्य मेरे परिणामों से परिभाषित नहीं होता।', 'numerology', 2),
(8, 'hi', 'मैं अपनी शक्ति का उपयोग अनेकों के भले के लिए करता/करती हूँ।', 'numerology', 3),
(8, 'hinglish', 'Main focused effort se abundance attract karta/karti hoon.', 'numerology', 1),
(8, 'hinglish', 'Mera worth mere results se define nahi hota.', 'numerology', 2),
(8, 'hinglish', 'Main apni power ka use bahut logon ke bhale ke liye karta/karti hoon.', 'numerology', 3),
(9, 'en', 'I give to the world from a full heart.', 'numerology', 1),
(9, 'en', 'I release what is complete with grace.', 'numerology', 2),
(9, 'en', 'My compassion heals myself and others.', 'numerology', 3),
(9, 'hi', 'मैं भरे हृदय से दुनिया को देता/देती हूँ।', 'numerology', 1),
(9, 'hi', 'जो पूर्ण हो चुका है, उसे मैं कृपा से छोड़ता/छोड़ती हूँ।', 'numerology', 2),
(9, 'hi', 'मेरी करुणा स्वयं को और दूसरों को ठीक करती है।', 'numerology', 3),
(9, 'hinglish', 'Main bhare dil se duniya ko deta/deti hoon.', 'numerology', 1),
(9, 'hinglish', 'Jo complete ho chuka hai use main grace se chhodta/chhodti hoon.', 'numerology', 2),
(9, 'hinglish', 'Meri compassion khud ko aur doosron ko heal karti hai.', 'numerology', 3),
(11, 'en', 'I trust my intuition to light the way.', 'numerology', 1),
(11, 'en', 'My sensitivity is a source of inspiration.', 'numerology', 2),
(11, 'en', 'I stay grounded while reaching for the heights.', 'numerology', 3),
(11, 'hi', 'मैं अपने अंतर्ज्ञान पर भरोसा करता/करती हूँ कि वह राह दिखाएगा।', 'numerology', 1),
(11, 'hi', 'मेरी संवेदनशीलता प्रेरणा का स्रोत है।', 'numerology', 2),
(11, 'hi', 'मैं ऊँचाइयों तक पहुँचते हुए ज़मीन से जुड़ा/जुड़ी रहता/रहती हूँ।', 'numerology', 3),
(11, 'hinglish', 'Main apne intuition par trust karta/karti hoon ki wo raah dikhayega.', 'numerology', 1),
(11, 'hinglish', 'Meri sensitivity inspiration ka source hai.', 'numerology', 2),
(11, 'hinglish', 'Main heights tak pahunchte hue grounded rehta/rehti hoon.', 'numerology', 3),
(22, 'en', 'I turn my vision into lasting reality.', 'numerology', 1),
(22, 'en', 'I build with patience and purpose.', 'numerology', 2),
(22, 'en', 'I trust my power to create meaningful impact.', 'numerology', 3),
(22, 'hi', 'मैं अपनी दृष्टि को स्थायी वास्तविकता में बदलता/बदलती हूँ।', 'numerology', 1),
(22, 'hi', 'मैं धैर्य और उद्देश्य से निर्माण करता/करती हूँ।', 'numerology', 2),
(22, 'hi', 'मैं सार्थक प्रभाव रचने की अपनी शक्ति पर भरोसा करता/करती हूँ।', 'numerology', 3),
(22, 'hinglish', 'Main apni vision ko lasting reality mein badalta/badalti hoon.', 'numerology', 1),
(22, 'hinglish', 'Main patience aur purpose se build karta/karti hoon.', 'numerology', 2),
(22, 'hinglish', 'Main meaningful impact banane ki apni power par trust karta/karti hoon.', 'numerology', 3),
(33, 'en', 'I heal others through unconditional love.', 'numerology', 1),
(33, 'en', 'I serve from compassion, not depletion.', 'numerology', 2),
(33, 'en', 'I care for myself as deeply as I care for others.', 'numerology', 3),
(33, 'hi', 'मैं बिना शर्त प्रेम से दूसरों को ठीक करता/करती हूँ।', 'numerology', 1),
(33, 'hi', 'मैं करुणा से सेवा करता/करती हूँ, थकान से नहीं।', 'numerology', 2),
(33, 'hi', 'मैं अपनी देखभाल उतनी ही गहराई से करता/करती हूँ जितनी दूसरों की।', 'numerology', 3),
(33, 'hinglish', 'Main unconditional love se doosron ko heal karta/karti hoon.', 'numerology', 1),
(33, 'hinglish', 'Main compassion se seva karta/karti hoon, depletion se nahi.', 'numerology', 2),
(33, 'hinglish', 'Main apni care utni hi gehrai se karta/karti hoon jitni doosron ki.', 'numerology', 3);

-- =====================================================================
-- BUNDLED FILE: seeds/seed_testimonials.sql
-- =====================================================================

-- ============================================================
-- Phase 1e: TESTIMONIALS seed
-- Additive seed for public.testimonials
-- Columns: name, rating, text, active, sort_order
-- Safe to re-run (clears existing then inserts a fresh set).
-- ============================================================

DELETE FROM public.testimonials;

INSERT INTO public.testimonials (name, rating, text, active, sort_order) VALUES
('Priya S., Delhi', 5, 'Report padhke meri life mein ek clarity aa gayi. Career section bilkul sahi nikla. Sach mein amazing hai!', true, 1),
('Rahul M., Mumbai', 5, 'Maine bahut numerology sites dekhi, par yahan ki report sabse detailed aur personal lagi. Paisa vasool!', true, 2),
('Anjali K., Jaipur', 5, 'Apne naam aur date of birth ka itna gehra analysis pehli baar dekha. Hindi mein hone se ghar walon ko bhi samajh aaya.', true, 3),
('Vikram R., Bangalore', 4, 'Mobile number numerology wala tool kaafi useful hai. Naya number lene se pehle check kiya, achha laga.', true, 4),
('Sneha P., Pune', 5, 'Compatibility report ne meri aur mere partner ki personalities ko itne achhe se samjhaya. Bahut helpful tha shaadi se pehle.', true, 5),
('Amit T., Lucknow', 5, 'Business naam choose karne mein confusion thi, yahan ke business numerology ne decision aasaan kar diya. Recommend karunga.', true, 6),
('Deepa N., Hyderabad', 5, 'Lo Shu grid wala section meri missing numbers clearly dikhata hai. Remedies bhi practical hain, koi mushkil ritual nahi.', true, 7),
('Karan J., Chandigarh', 4, 'Report ki language simple hai, koi heavy jargon nahi. Hinglish option ke wajah se padhne mein maza aaya.', true, 8),
('Meera V., Ahmedabad', 5, 'Personal year forecast ne is saal ke liye direction di. Jo bataya tha woh kaafi relate hua. Dhanyavaad!', true, 9),
('Suresh B., Kolkata', 5, 'PDF report download karke save kar li. Detail itni hai ki baar baar padhta hoon. Premium feel aati hai.', true, 10);


-- =====================================================================
-- BUNDLED FILE: 02_admin_setup.sql
-- =====================================================================

-- =====================================================================
-- 02 — ADMIN SETUP  (APNA_EMAIL ko apne login email se replace karo)
-- Pehle Dashboard -> Authentication -> Users me wo user bana lo
-- (Auto Confirm + password), phir ye chalao.
-- =====================================================================
DELETE FROM public.user_roles WHERE role = 'admin';

INSERT INTO public.user_roles (id, user_id, role, created_at)
SELECT gen_random_uuid(), id, 'admin'::public.app_role, now()
FROM auth.users WHERE email = 'APNA_EMAIL';

INSERT INTO public.profiles (id, user_id, full_name, email, created_at, updated_at)
SELECT gen_random_uuid(), id, 'Admin', email, now(), now()
FROM auth.users WHERE email = 'APNA_EMAIL'
ON CONFLICT (user_id) DO NOTHING;

-- Verify:
-- SELECT u.email, ur.role FROM public.user_roles ur JOIN auth.users u ON u.id=ur.user_id;


-- =====================================================================
-- BUNDLED FILE: 03_admin_read_access.sql
-- =====================================================================

-- =====================================================================
-- 03 — ADMIN READ ACCESS (admin sabka data dekh sake)
-- Bina iske admin panel me customer list khaali dikhta hai.
-- =====================================================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin');
$$;

DROP POLICY IF EXISTS admin_read_all_profiles ON public.profiles;
CREATE POLICY admin_read_all_profiles ON public.profiles
  FOR SELECT TO authenticated USING (public.is_admin() OR auth.uid() = user_id);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS admin_read_all_payments ON public.payments;
CREATE POLICY admin_read_all_payments ON public.payments
  FOR SELECT TO authenticated USING (public.is_admin() OR auth.uid() = user_id);

DROP POLICY IF EXISTS admin_read_all_reports ON public.user_reports;
CREATE POLICY admin_read_all_reports ON public.user_reports
  FOR SELECT TO authenticated USING (public.is_admin() OR auth.uid() = user_id);


-- =====================================================================
-- BUNDLED FILE: 04_landing_pages.sql
-- =====================================================================

-- =====================================================================
-- DYNAMIC CMS — Phase 1: landing_pages + page_blocks (TABLES ONLY)
-- Seed content 06_seed_landing_pages.sql me hai. Ye sirf structure banata hai.
-- Idempotent + grants + RLS. Dollar-quoted = quote issues nahi.
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.landing_pages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  subtitle text,
  hero_image_url text,
  meta_title text,
  meta_description text,
  tool_type text DEFAULT 'none',
  report_type_key text,
  active boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.page_blocks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  page_id uuid NOT NULL REFERENCES public.landing_pages(id) ON DELETE CASCADE,
  type text NOT NULL,
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  position int NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_page_blocks_page ON public.page_blocks(page_id, position);
CREATE INDEX IF NOT EXISTS idx_landing_pages_slug ON public.landing_pages(slug);

GRANT SELECT ON public.landing_pages, public.page_blocks TO anon, authenticated;
GRANT ALL ON public.landing_pages, public.page_blocks TO service_role;

ALTER TABLE public.landing_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_blocks ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean LANGUAGE sql SECURITY DEFINER STABLE AS $fn$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin');
$fn$;

DROP POLICY IF EXISTS lp_public_read ON public.landing_pages;
CREATE POLICY lp_public_read ON public.landing_pages FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS lp_admin_write ON public.landing_pages;
CREATE POLICY lp_admin_write ON public.landing_pages FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS pb_public_read ON public.page_blocks;
CREATE POLICY pb_public_read ON public.page_blocks FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS pb_admin_write ON public.page_blocks;
CREATE POLICY pb_admin_write ON public.page_blocks FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- NOTE: Seed content ab 06_seed_landing_pages.sql me hai (6 pages).
-- Ye file sirf tables banati hai. 04 ke baad 05, phir 06 chalao.


-- =====================================================================
-- BUNDLED FILE: 05_reports_ads_branding.sql
-- =====================================================================

-- =====================================================================
-- DYNAMIC CMS — Phase 3/4/5: report_types, ad_slots, branding,
-- cross-linking, CRO fields. Idempotent + grants + RLS.
-- =====================================================================

-- ---- report_types: sellable reports (cross-linkable) ----
CREATE TABLE IF NOT EXISTS public.report_types (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  key text NOT NULL UNIQUE,            -- e.g. name_correction
  name text NOT NULL,
  short_desc text,
  usp text,                            -- one-line unique selling point
  price int NOT NULL DEFAULT 0,
  original_price int,
  free_glimpse boolean NOT NULL DEFAULT true,
  tool_type text DEFAULT 'none',
  slug text,                           -- landing page slug to link
  related_keys text[] DEFAULT '{}',    -- cross-linked report keys
  badge text,                          -- e.g. "Bestseller", "New"
  icon text DEFAULT 'sparkles',
  active boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ---- ad_slots: admin-editable ad/promo placements ----
CREATE TABLE IF NOT EXISTS public.ad_slots (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  slot_key text NOT NULL UNIQUE,       -- e.g. home_top, landing_sidebar
  enabled boolean NOT NULL DEFAULT false,
  html text,                           -- raw html/script (admin paste)
  image_url text,
  link_url text,
  label text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ---- landing_pages: add CRO + branding columns (safe ALTERs) ----
ALTER TABLE public.landing_pages ADD COLUMN IF NOT EXISTS badge text;
ALTER TABLE public.landing_pages ADD COLUMN IF NOT EXISTS price int;
ALTER TABLE public.landing_pages ADD COLUMN IF NOT EXISTS original_price int;
ALTER TABLE public.landing_pages ADD COLUMN IF NOT EXISTS rating numeric DEFAULT 4.8;
ALTER TABLE public.landing_pages ADD COLUMN IF NOT EXISTS reviews_count int DEFAULT 0;
ALTER TABLE public.landing_pages ADD COLUMN IF NOT EXISTS related_slugs text[] DEFAULT '{}';
ALTER TABLE public.landing_pages ADD COLUMN IF NOT EXISTS report_key text;

-- ---- grants ----
GRANT SELECT ON public.report_types, public.ad_slots TO anon, authenticated;
GRANT ALL ON public.report_types, public.ad_slots TO service_role;

-- ---- RLS ----
ALTER TABLE public.report_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_slots ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin');
$$;

DROP POLICY IF EXISTS rt_public_read ON public.report_types;
CREATE POLICY rt_public_read ON public.report_types FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS rt_admin_write ON public.report_types;
CREATE POLICY rt_admin_write ON public.report_types FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS ad_public_read ON public.ad_slots;
CREATE POLICY ad_public_read ON public.ad_slots FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS ad_admin_write ON public.ad_slots;
CREATE POLICY ad_admin_write ON public.ad_slots FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- =====================================================================
-- SEED — 6 report types (researched USPs + market-aligned pricing)
-- =====================================================================
INSERT INTO public.report_types (key, name, short_desc, usp, price, original_price, tool_type, slug, related_keys, badge, icon, sort_order) VALUES
('name_correction','Name Correction Report','Align your name vibration with your birth number for success','The exact spelling that turns effort into results',599,1299,'name','name-correction-report','{vehicle_numerology,mobile_numerology,career_numerology}','Bestseller','wand',1),
('mobile_numerology','Mobile Number Numerology','Check if your mobile number supports or blocks your luck','Your phone number could be quietly draining your luck',299,599,'mobile','mobile-numerology-report','{name_correction,vehicle_numerology}','Popular','smartphone',2),
('vehicle_numerology','Vehicle Number Report','Lucky, safe and harmonious vehicle number analysis','Drive a number that protects and prospers you',299,599,'vehicle','vehicle-numerology-report','{name_correction,mobile_numerology}',NULL,'car',3),
('career_numerology','Career & Job Prediction','Discover the career path your numbers were built for','Stop guessing your career — let your numbers decide',699,1499,'career','career-numerology-report','{name_correction,compatibility_report}','New','briefcase',4),
('baby_name','Lucky Baby Name Report','Auspicious, numerology-aligned names for your baby','Give your child a name that carries lifelong luck',499,999,'baby','baby-name-report','{name_correction}',NULL,'baby',5),
('compatibility_report','Love & Marriage Compatibility','Deep numerology compatibility for couples','Know before you commit — numbers reveal the truth',499,999,'none','compatibility-report','{name_correction,career_numerology}','Couples','heart',6)
ON CONFLICT (key) DO NOTHING;

-- seed ad slots (disabled by default)
INSERT INTO public.ad_slots (slot_key, label) VALUES
('home_top','Homepage Top Banner'),
('home_mid','Homepage Middle'),
('landing_top','Landing Page Top'),
('landing_bottom','Landing Page Bottom')
ON CONFLICT (slot_key) DO NOTHING;

-- Verify:
-- SELECT key, name, price FROM report_types ORDER BY sort_order;
-- SELECT slot_key, enabled FROM ad_slots;


-- =====================================================================
-- BUNDLED FILE: 06_seed_landing_pages.sql
-- =====================================================================

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


-- =====================================================================
-- BUNDLED FILE: 07_premium_sections.sql
-- =====================================================================

-- =====================================================================
-- Premium CRO sections seed for name-correction-report page
-- Adds: trust_stats, before_after, report_preview blocks
-- (NBT-style high-conversion layout). Images blank — admin se bharo.
-- Run AFTER 06_seed_landing_pages.sql.
-- =====================================================================
DO $$
DECLARE pid uuid;
BEGIN
  SELECT id INTO pid FROM public.landing_pages WHERE slug = 'name-correction-report';
  IF pid IS NULL THEN RAISE NOTICE 'page not found'; RETURN; END IF;

  -- remove any existing premium blocks (idempotent re-run)
  DELETE FROM public.page_blocks WHERE page_id = pid AND type IN ('trust_stats','before_after','report_preview','carousel');

  -- Trust stats (after hero, position 0 so it shows near top)
  INSERT INTO public.page_blocks (page_id, type, content, position) VALUES
  (pid, 'trust_stats', '{"items":[{"value":"4.9","label":"Rating"},{"value":"50K+","label":"Reports banayi"},{"value":"24hr","label":"Delivery"},{"value":"98%","label":"Satisfaction"}]}', 0),

  (pid, 'before_after', '{"title":"Naam sudhaar ke baad kya badalta hai?","before":{"name":"RAHUL","planet":"Shani","number":"4","bars":[{"label":"Career","value":42},{"label":"Dhan","value":36},{"label":"Pehchaan","value":48},{"label":"Rishte","value":40}]},"after":{"name":"RAAHUL","planet":"Surya","number":"1","bars":[{"label":"Career","value":86},{"label":"Dhan","value":79},{"label":"Pehchaan","value":92},{"label":"Rishte","value":83}]}}', 11),

  (pid, 'report_preview', '{"title":"Dekhein aapki report kaisi dikhti hai","subtitle":"Aapke naam aur janm vivaran ke according","pages":[],"insideItems":["Name number analysis","Bhagya aur jeevan path","3-5 naam spelling options","Lucky ank aur rang","Upay aur margdarshan"]}', 12);

  RAISE NOTICE 'Premium sections added to name-correction-report';
END $$;

-- Verify:
-- SELECT type, position FROM page_blocks pb JOIN landing_pages lp ON lp.id=pb.page_id WHERE lp.slug='name-correction-report' ORDER BY position;


-- =====================================================================
-- BUNDLED FILE: 08_branding.sql
-- =====================================================================

-- =====================================================================
-- 08_branding.sql  — White-label branding settings (single row)
-- PDF/reports par logo, company name, colour, footer — admin editable.
-- Resell ke liye: koi bhi brand ke naam se report nikal sakte ho.
-- Supabase project: kassdsugfktqptsxzqhr  (naya project NAHI)
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.app_branding (
  id int PRIMARY KEY DEFAULT 1,
  company_name text NOT NULL DEFAULT 'AnkJyotish AI',
  logo_url text DEFAULT '',                 -- public image URL (png/jpg)
  brand_color text NOT NULL DEFAULT '#7c3aed',   -- heading / accents
  accent_color text NOT NULL DEFAULT '#f0a500',  -- highlights
  tagline text DEFAULT 'Numerology that changes lives',
  footer_text text DEFAULT 'Generated by AnkJyotish AI • ankjyotishai.com',
  contact_line text DEFAULT 'WhatsApp: +91-00000-00000 • support@ankjyotishai.com',
  website text DEFAULT 'ankjyotishai.com',
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT single_row CHECK (id = 1)
);

-- seed the single row (id=1) if not present
INSERT INTO public.app_branding (id) VALUES (1)
ON CONFLICT (id) DO NOTHING;

-- grants
GRANT SELECT ON public.app_branding TO anon, authenticated;
GRANT INSERT, UPDATE ON public.app_branding TO authenticated;

-- RLS: sab padh sakte (PDF generate ke liye), sirf admin likh sake
ALTER TABLE public.app_branding ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS branding_read ON public.app_branding;
CREATE POLICY branding_read ON public.app_branding
  FOR SELECT USING (true);

DROP POLICY IF EXISTS branding_write ON public.app_branding;
CREATE POLICY branding_write ON public.app_branding
  FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Verify:
-- SELECT company_name, logo_url, brand_color FROM public.app_branding WHERE id = 1;


-- =====================================================================
-- BUNDLED FILE: 09_phase1_reports.sql
-- =====================================================================

-- =====================================================================
-- 09_phase1_reports.sql — Individual report selling (Phase 1)
-- Adds: report_requests, report_orders, leads  + syncs report_types prices
-- Supabase project: kassdsugfktqptsxzqhr   (naya project NAHI)
-- Run AFTER 05_reports_ads_branding.sql. PURA copy karke chalao.
-- All additive — kuch delete nahi hota.
-- =====================================================================

-- 1) Intake snapshot per report (so the paid PDF is reproducible) --------
CREATE TABLE IF NOT EXISTS public.report_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_key text NOT NULL,
  email text,
  input_json jsonb NOT NULL DEFAULT '{}'::jsonb,   -- all collected fields
  profile_json jsonb NOT NULL DEFAULT '{}'::jsonb, -- computed numerology
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 2) Orders for individual reports (guest allowed; user_id optional) -----
CREATE TABLE IF NOT EXISTS public.report_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_request_id uuid REFERENCES public.report_requests(id) ON DELETE SET NULL,
  report_key text NOT NULL,
  email text,
  user_id uuid,                          -- nullable (guest checkout)
  amount int NOT NULL,
  currency text NOT NULL DEFAULT 'INR',
  status text NOT NULL DEFAULT 'pending',  -- pending/success/failed/cancelled
  cashfree_order_id text UNIQUE NOT NULL,
  gateway_status text,
  created_at timestamptz NOT NULL DEFAULT now(),
  paid_at timestamptz
);
CREATE INDEX IF NOT EXISTS idx_report_orders_cf ON public.report_orders(cashfree_order_id);
CREATE INDEX IF NOT EXISTS idx_report_orders_email ON public.report_orders(email);
CREATE INDEX IF NOT EXISTS idx_report_orders_status ON public.report_orders(status);

-- 3) Leads (free snapshot captures for remarketing) ---------------------
CREATE TABLE IF NOT EXISTS public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  dob text,
  report_key text,
  email text,
  phone text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 4) Grants ------------------------------------------------------------
-- service_role (edge functions) gets full access automatically.
GRANT SELECT, INSERT ON public.report_requests TO anon, authenticated;
GRANT SELECT, INSERT ON public.report_orders   TO anon, authenticated;
GRANT INSERT          ON public.leads           TO anon, authenticated;

-- 5) RLS ---------------------------------------------------------------
-- Edge functions use service_role and BYPASS RLS (secure writes there).
-- Public can insert (lead capture / intake) but reads are locked; the
-- success page reads order status via the verify-report-order function
-- (service role), not direct table reads.
ALTER TABLE public.report_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_orders   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads           ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS rr_insert ON public.report_requests;
CREATE POLICY rr_insert ON public.report_requests FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS ro_insert ON public.report_orders;
CREATE POLICY ro_insert ON public.report_orders FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS lead_insert ON public.leads;
CREATE POLICY lead_insert ON public.leads FOR INSERT WITH CHECK (true);

-- admin can read everything (uses existing is_admin())
DROP POLICY IF EXISTS ro_admin_read ON public.report_orders;
CREATE POLICY ro_admin_read ON public.report_orders FOR SELECT USING (public.is_admin());
DROP POLICY IF EXISTS rr_admin_read ON public.report_requests;
CREATE POLICY rr_admin_read ON public.report_requests FOR SELECT USING (public.is_admin());
DROP POLICY IF EXISTS lead_admin_read ON public.leads;
CREATE POLICY lead_admin_read ON public.leads FOR SELECT USING (public.is_admin());

-- 6) Sync report_types prices to match landing pages (₹199–499) --------
UPDATE public.report_types SET price=399, original_price=999  WHERE key='name_correction';
UPDATE public.report_types SET price=199, original_price=599  WHERE key='mobile_numerology';
UPDATE public.report_types SET price=249, original_price=599  WHERE key='vehicle_numerology';
UPDATE public.report_types SET price=499, original_price=1499 WHERE key='career_numerology';
UPDATE public.report_types SET price=399, original_price=999  WHERE key='baby_name';
UPDATE public.report_types SET price=449, original_price=999  WHERE key='compatibility_report';

-- Verify:
-- SELECT key, price, original_price FROM public.report_types ORDER BY sort_order;
-- SELECT count(*) FROM public.report_orders;


-- =====================================================================
-- BUNDLED FILE: 10_report_email.sql
-- =====================================================================

-- =====================================================================
-- 10_report_email.sql — email delivery support (Phase 2)
-- Adds emailed_at to report_orders so report email sends only once.
-- Project: kassdsugfktqptsxzqhr. Run AFTER 09_phase1_reports.sql.
-- =====================================================================
ALTER TABLE public.report_orders ADD COLUMN IF NOT EXISTS emailed_at timestamptz;

-- Verify:
-- SELECT cashfree_order_id, status, emailed_at FROM public.report_orders ORDER BY created_at DESC LIMIT 5;


-- =====================================================================
-- BUNDLED FILE: 11_report_types_admin.sql
-- =====================================================================

-- =====================================================================
-- 11_report_types_admin.sql — admin can edit report catalog
-- report_types pehle se hai (05). Ye sirf RLS/grants add karta hai taaki
-- admin price/badge/active edit kar sake, aur sab log padh saken.
-- Project: kassdsugfktqptsxzqhr. PURA copy karke chalao.
-- =====================================================================

GRANT SELECT ON public.report_types TO anon, authenticated;
GRANT UPDATE ON public.report_types TO authenticated;

ALTER TABLE public.report_types ENABLE ROW LEVEL SECURITY;

-- everyone can read (catalog/landing/buy pages)
DROP POLICY IF EXISTS rt_read ON public.report_types;
CREATE POLICY rt_read ON public.report_types FOR SELECT USING (true);

-- only admin can edit (uses existing is_admin())
DROP POLICY IF EXISTS rt_admin_update ON public.report_types;
CREATE POLICY rt_admin_update ON public.report_types
  FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Verify:
-- SELECT key, price, badge, active, sort_order FROM public.report_types ORDER BY sort_order;


-- =====================================================================
-- BUNDLED FILE: 12_new_report_types.sql
-- =====================================================================

-- =====================================================================
-- 12_new_report_types.sql — Business, Property, Marriage reports
-- report_types me 3 naye rows. Static content code me hai; ye DB rows
-- price/checkout/admin ke liye. Project: kassdsugfktqptsxzqhr.
-- Run AFTER 05 + 09. PURA copy karke chalao.
-- =====================================================================
INSERT INTO public.report_types (key, name, short_desc, price, original_price, slug, badge, icon, active, sort_order)
VALUES
  ('business_numerology', 'Business Numerology Report', 'Business naam, timing & growth', 499, 1499, 'business-numerology-report', '', 'building', true, 7),
  ('property_numerology', 'Property & House Number Report', 'Shubh ghar/plot number', 299, 799, 'property-numerology-report', '', 'home', true, 8),
  ('marriage_report', 'Marriage Timing & Matching Report', 'Shaadi timing + compatibility', 449, 999, 'marriage-report', 'Couples', 'heart', true, 9)
ON CONFLICT (key) DO UPDATE SET
  name = EXCLUDED.name, price = EXCLUDED.price, original_price = EXCLUDED.original_price,
  slug = EXCLUDED.slug, badge = EXCLUDED.badge, active = EXCLUDED.active, sort_order = EXCLUDED.sort_order;

-- Verify:
-- SELECT key, name, price, slug FROM public.report_types ORDER BY sort_order;  -- 9 rows


-- =====================================================================
-- BUNDLED FILE: 13_coupons_admin.sql
-- =====================================================================

-- =====================================================================
-- 13_coupons_admin.sql — admin coupons create/edit fix
-- coupons table pehle se hai. Ye RLS/grants add karta hai taaki admin
-- coupon bana/edit kar sake, aur checkout active coupon padh sake.
-- Project: kassdsugfktqptsxzqhr. PURA copy karke chalao.
-- =====================================================================

GRANT SELECT ON public.coupons TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.coupons TO authenticated;

ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

-- everyone can read active coupons (checkout validation)
DROP POLICY IF EXISTS coupons_read ON public.coupons;
CREATE POLICY coupons_read ON public.coupons FOR SELECT USING (true);

-- only admin can create/edit/delete (uses existing is_admin())
DROP POLICY IF EXISTS coupons_admin_insert ON public.coupons;
CREATE POLICY coupons_admin_insert ON public.coupons FOR INSERT WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS coupons_admin_update ON public.coupons;
CREATE POLICY coupons_admin_update ON public.coupons FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS coupons_admin_delete ON public.coupons;
CREATE POLICY coupons_admin_delete ON public.coupons FOR DELETE USING (public.is_admin());

-- Verify:
-- SELECT code, discount_type, discount_value, active FROM public.coupons;


-- =====================================================================
-- BUNDLED FILE: 14_report_content_cms.sql
-- =====================================================================

-- =====================================================================
-- 14_report_content_cms.sql — report content DB CMS + 3-language
-- Har report ka marketing content (title, pains, faqs, etc.) ab DB me
-- per-language. Static code FALLBACK rahega (kuch break nahi hoga).
-- + per-report coupon (coupon kisi ek report par bhi laga sakte ho).
-- Project: kassdsugfktqptsxzqhr. PURA copy karke chalao.
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.report_content (
  key        text NOT NULL,         -- report key (e.g. business_numerology)
  lang       text NOT NULL,         -- 'hinglish' | 'en' | 'hi'
  content    jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz DEFAULT now(),
  PRIMARY KEY (key, lang)
);

GRANT SELECT ON public.report_content TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.report_content TO authenticated;

ALTER TABLE public.report_content ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS rc_read ON public.report_content;
CREATE POLICY rc_read ON public.report_content FOR SELECT USING (true);

DROP POLICY IF EXISTS rc_admin_ins ON public.report_content;
CREATE POLICY rc_admin_ins ON public.report_content FOR INSERT WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS rc_admin_upd ON public.report_content;
CREATE POLICY rc_admin_upd ON public.report_content FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS rc_admin_del ON public.report_content;
CREATE POLICY rc_admin_del ON public.report_content FOR DELETE USING (public.is_admin());

-- per-report coupon (NULL = sab reports par; warna sirf us report par)
ALTER TABLE public.coupons ADD COLUMN IF NOT EXISTS report_key text;

-- Verify:
-- SELECT key, lang, updated_at FROM public.report_content;


-- =====================================================================
-- BUNDLED FILE: 15_tracking_attribution.sql
-- =====================================================================

-- =====================================================================
-- 15_tracking_attribution.sql — Ads tracking (admin) + UTM attribution
-- system_settings me Google Ads + Search Console keys add (Meta Pixel,
-- GA4 keys pehle se hain). Table na ho to bana deta hai (idempotent).
-- + UTM columns: kaunsi ad/campaign se lead/sale aayi.
-- Project: kassdsugfktqptsxzqhr. PURA copy karke chalao.
-- =====================================================================

-- ensure table (original project me hoti hai; na ho to ban jayegi)
CREATE TABLE IF NOT EXISTS public.system_settings (
  key        text PRIMARY KEY,
  value      text,
  updated_at timestamptz DEFAULT now()
);

GRANT SELECT ON public.system_settings TO anon, authenticated;
GRANT INSERT, UPDATE ON public.system_settings TO authenticated;

ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS ss_read ON public.system_settings;
CREATE POLICY ss_read ON public.system_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS ss_admin_ins ON public.system_settings;
CREATE POLICY ss_admin_ins ON public.system_settings FOR INSERT WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS ss_admin_upd ON public.system_settings;
CREATE POLICY ss_admin_upd ON public.system_settings FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

-- seed tracking keys (existing wale untouched)
INSERT INTO public.system_settings (key, value) VALUES
  ('meta_pixel_id', ''),
  ('ga_id', ''),
  ('google_ads_id', ''),
  ('google_ads_purchase_label', ''),
  ('gsc_verification', '')
ON CONFLICT (key) DO NOTHING;

-- attribution: kaunsi ad se aaya (utm_source/medium/campaign + gclid/fbclid)
ALTER TABLE public.report_orders ADD COLUMN IF NOT EXISTS utm jsonb;
ALTER TABLE public.leads         ADD COLUMN IF NOT EXISTS utm jsonb;

-- Verify:
-- SELECT key, value FROM public.system_settings WHERE key LIKE '%pixel%' OR key LIKE 'g%';


-- =====================================================================
-- BUNDLED FILE: 16_nikb_schemas.sql
-- =====================================================================

-- =====================================================================
-- NIKB_SQL_SCHEMAS.sql — Numerology Intelligence Knowledge Base
-- AnkJyotish AI — All NEW tables for NIKB implementation
-- Project: kassdsugfktqptsxzqhr. Run AFTER existing 00-15 files.
-- ADDITIVE — nothing dropped or altered.
-- =====================================================================

-- =====================================================================
-- TABLE 1: COMPOUND NUMBERS (Chaldean, 10-52)
-- The single highest-ROI table. Makes two users different immediately.
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.nikb_compound_numbers (
  compound              int PRIMARY KEY,        -- 10-52
  root                  int NOT NULL,           -- single digit result
  trad_name             text,                   -- "Royal Star of Lion"
  nature                text,                   -- favorable/warning/mixed/karmic/master
  core_meaning          text NOT NULL,          -- consultant-grade, 2-4 sentences
  career_impact         text,
  wealth_impact         text,
  relationship_impact   text,
  business_impact       text,
  karmic_theme          text,                   -- null if no karmic debt
  tarot_link            text,                   -- Tarot card correspondence
  famous_examples       text[],                 -- famous people with this compound
  remedies              text[],                 -- if warning/karmic
  overrides_single      boolean DEFAULT false,  -- does compound override root?
  language              text DEFAULT 'hinglish', -- en/hi/hinglish
  created_at            timestamptz DEFAULT now()
);

-- =====================================================================
-- TABLE 2: LO SHU ARROWS
-- 8 possible arrows × 3 states (present/missing/partial) = 24 entries
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.nikb_loshu_arrows (
  arrow_id              text PRIMARY KEY,       -- e.g. "arrow_determination_1_5_9"
  name                  text NOT NULL,          -- "Arrow of Determination"
  numbers               int[] NOT NULL,         -- [1,5,9]
  direction             text NOT NULL,          -- horizontal/vertical/diagonal
  plane                 text,                   -- mental/emotional/practical/success/spiritual
  present_title         text,
  present_meaning       text NOT NULL,          -- full consultant text when complete
  missing_title         text,
  missing_meaning       text NOT NULL,          -- full consultant text when missing
  partial_meaning       text,                   -- 1-2 of 3 present
  career_impact_present text,
  career_impact_missing text,
  relationship_present  text,
  relationship_missing  text,
  remedy_missing        text NOT NULL,          -- how to compensate
  language              text DEFAULT 'hinglish'
);

-- =====================================================================
-- TABLE 3: MULANK × BHAGYANK MATRIX (81 combinations)
-- Core differentiation layer
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.nikb_mb_matrix (
  mulank                int NOT NULL CHECK (mulank BETWEEN 1 AND 9),
  bhagyank              int NOT NULL CHECK (bhagyank BETWEEN 1 AND 9),
  matrix_key            text GENERATED ALWAYS AS (mulank::text || '_' || bhagyank::text) STORED,
  personality_core      text NOT NULL,
  career_profile        text NOT NULL,
  wealth_pattern        text NOT NULL,
  marriage_pattern      text NOT NULL,
  business_profile      text,
  growth_path           text,
  challenges            text NOT NULL,
  harmony_score         int CHECK (harmony_score BETWEEN 1 AND 10),
  dominant_energy       text,                   -- which number "wins"
  tension_points        text,                   -- where the two numbers conflict
  language              text DEFAULT 'hinglish',
  PRIMARY KEY (mulank, bhagyank)
);

-- =====================================================================
-- TABLE 4: PLANES OF EXPRESSION
-- Letter → plane mapping for name analysis
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.nikb_planes_of_expression (
  plane                 text NOT NULL,          -- physical/mental/emotional/intuitive
  letters               text[] NOT NULL,        -- which letters
  pythagorean_values    int[],                  -- corresponding values
  low_score_meaning     text,                   -- what 0-3 letters means
  high_score_meaning    text,                   -- what 7+ means
  balanced_meaning      text,
  dominant_career_fit   text[],                 -- careers that suit dominant X plane
  dominant_relationship text,
  shadow                text,                   -- what dominant X misses
  language              text DEFAULT 'hinglish',
  PRIMARY KEY (plane, language)
);

-- =====================================================================
-- TABLE 5: PERSONALITY SCORING RULES
-- How to derive scores from numerology inputs
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.nikb_personality_rules (
  trait                 text NOT NULL,          -- leadership/creativity/discipline/risk/etc.
  base_from             text NOT NULL,          -- 'life_path'/'destiny'/'compound'/'loshu'
  base_values           jsonb NOT NULL,         -- {1: 80, 2: 30, 3: 70, ...} (life_path→score)
  modifier_rules        jsonb,                  -- [{condition: {loshu_arrow: "1_5_9"}, modifier: 20}]
  interpretation_bands  jsonb NOT NULL,         -- {0-30: "low", 31-70: "medium", 71-100: "high"}
  low_text              text,
  medium_text           text,
  high_text             text,
  language              text DEFAULT 'hinglish',
  PRIMARY KEY (trait, language)
);

-- =====================================================================
-- TABLE 6: CONSULTANT REASONING RULES
-- Pattern → Conclusion → Explanation → Confidence
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.nikb_reasoning_rules (
  rule_id               text PRIMARY KEY,
  category              text NOT NULL,          -- career/relationship/money/spiritual/health
  condition             jsonb NOT NULL,         -- {life_path: 3, loshu_has_3: false}
  conclusion            text NOT NULL,
  explanation           text NOT NULL,          -- WHY (consultant-grade)
  confidence            text NOT NULL,          -- high/medium/low
  supporting_data       text[],
  counter_indicators    text[],                 -- conditions that weaken this rule
  remedies              text[],
  report_section        text,                   -- which PDF section to add this to
  language              text DEFAULT 'hinglish',
  active                boolean DEFAULT true
);

-- =====================================================================
-- TABLE 7: NUMBER POSITION INTELLIGENCE
-- Leading digit vs supporting digit in compounds
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.nikb_position_intelligence (
  compound              int NOT NULL,
  leading_digit         int NOT NULL,
  supporting_digit      int NOT NULL,
  driver_energy         text NOT NULL,          -- what initiates
  expression_energy     text NOT NULL,          -- how it manifests
  internal_dynamic      text NOT NULL,          -- harmony/tension/amplification
  key_insight           text NOT NULL,          -- single consultant observation
  vs_reverse            text,                   -- how 14 differs from 41 specifically
  language              text DEFAULT 'hinglish',
  PRIMARY KEY (compound, language)
);

-- =====================================================================
-- TABLE 8: AGE PHASE MODIFIERS
-- Same number, different life phase = different interpretation
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.nikb_age_phases (
  life_path             int NOT NULL,
  age_min               int NOT NULL,
  age_max               int NOT NULL,
  phase_name            text,                   -- "The Launch Window"
  opportunities         text NOT NULL,
  challenges            text NOT NULL,
  growth_focus          text NOT NULL,
  career_focus          text,
  relationship_focus    text,
  money_focus           text,
  language              text DEFAULT 'hinglish',
  PRIMARY KEY (life_path, age_min, language)
);

-- =====================================================================
-- TABLE 9: WEALTH ARCHETYPES
-- Number-based wealth personality
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.nikb_wealth_archetypes (
  archetype_key         text PRIMARY KEY,       -- e.g. "builder_4_8"
  name                  text NOT NULL,          -- "The Builder"
  description           text NOT NULL,
  matching_life_paths   int[],
  matching_destinies    int[],
  wealth_strengths      text[],
  wealth_blindspots     text[],
  best_income_source    text,                   -- employment/business/investment/creative
  worst_money_mistake   text,
  language              text DEFAULT 'hinglish'
);

-- =====================================================================
-- TABLE 10: RELATIONSHIP ARCHETYPES
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.nikb_relationship_archetypes (
  archetype_key         text PRIMARY KEY,
  name                  text NOT NULL,          -- "The Nurturer"
  description           text NOT NULL,
  matching_life_paths   int[],
  compatibility_high    int[],                  -- life paths this archetype works well with
  compatibility_low     int[],                  -- life paths that conflict
  growth_edge           text,
  shadow                text,
  love_language         text,
  attachment_style      text,                   -- secure/anxious/avoidant/disorganized
  language              text DEFAULT 'hinglish'
);

-- =====================================================================
-- TABLE 11: COMPATIBILITY MATRIX (Expanded from existing)
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.nikb_compatibility_matrix (
  number1               int NOT NULL,
  number2               int NOT NULL,
  context               text NOT NULL DEFAULT 'romantic', -- romantic/business/friendship/family
  overall_score         int NOT NULL CHECK (overall_score BETWEEN 0 AND 100),
  communication_score   int,
  financial_harmony     int,
  emotional_depth       int,
  trust_score           int,
  conflict_style        text,
  long_term_stability   text,
  dynamic_description   text NOT NULL,          -- "The Creative and The Builder"
  strengths             text[],
  challenges            text[],
  make_it_work          text,                   -- practical advice
  language              text DEFAULT 'hinglish',
  PRIMARY KEY (number1, number2, context, language)
);

-- =====================================================================
-- TABLE 12: CONFIDENCE SCORING RULES
-- When to say "high confidence" vs "low confidence"
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.nikb_confidence_rules (
  rule_id               text PRIMARY KEY,
  data_present          text[],                 -- what data must be present for high confidence
  confidence_level      text NOT NULL,
  statement_template    text,                   -- "Based on {X} and {Y}, this is..."
  hedge_language        text                    -- what to say when low confidence
);

-- =====================================================================
-- RLS: all readable by anyone, writable by admin only
-- =====================================================================
DO $$ DECLARE
  t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'nikb_compound_numbers','nikb_loshu_arrows','nikb_mb_matrix',
    'nikb_planes_of_expression','nikb_personality_rules','nikb_reasoning_rules',
    'nikb_position_intelligence','nikb_age_phases','nikb_wealth_archetypes',
    'nikb_relationship_archetypes','nikb_compatibility_matrix','nikb_confidence_rules'
  ] LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('DROP POLICY IF EXISTS %I_read ON public.%I', t, t);
    EXECUTE format('CREATE POLICY %I_read ON public.%I FOR SELECT USING (true)', t, t);
    EXECUTE format('DROP POLICY IF EXISTS %I_admin ON public.%I', t, t);
    EXECUTE format('CREATE POLICY %I_admin ON public.%I FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin())', t, t);
    EXECUTE format('GRANT SELECT ON public.%I TO anon, authenticated', t);
    EXECUTE format('GRANT INSERT, UPDATE, DELETE ON public.%I TO authenticated', t);
  END LOOP;
END $$;

-- =====================================================================
-- SEED: Compound Numbers (high-impact entries)
-- =====================================================================
INSERT INTO public.nikb_compound_numbers (compound, root, trad_name, nature, core_meaning, career_impact, wealth_impact, relationship_impact, business_impact, karmic_theme, overrides_single) VALUES
(10, 1, 'Wheel of Fortune', 'mixed', 'Cyclical success — periods of rise followed by fall followed by rise again. Not steady linear progress. This person must learn patience during downturns, as the wheel always turns back up. Reliability in identity, but unpredictability in circumstances.', 'Best in roles with project cycles — not steady employment. Freelance, consulting, seasons. Launches, not maintenance.', 'Money comes in waves. Feast then famine pattern. Must build reserves during peaks.', 'Relationships go through distinct phases. Deep loyalty within cycles, but cycles do end.', 'Business success is real but not straight. Multiple pivots likely. Resilience is their superpower.', null, false),
(11, 2, 'The Warning', 'caution', 'Hidden forces at work. Success blocked by unseen enemies, self-sabotage, or circumstances that are difficult to predict. This person must develop strong inner discernment — not paranoia, but clear-eyed awareness. Often a test of patience and faith.', 'Keep financial matters private. Trust instincts about colleagues. Self-employment reduces exposure to office politics.', 'Risk of financial loss through misplaced trust. Contracts and clear agreements protect this energy.', 'Warning against deception in relationships. Intense, deep connections possible but requires exceptional discernment in choosing partners.', 'Business partnerships need extra legal protection. Solo ventures safer than equal partnerships initially.', null, false),
(12, 1, 'The Sacrifice', 'challenging', 'Creative and expressive energy that is blocked by anxiety, self-doubt, or circumstance. The person has ability and vision but feels restrained — often by mental fears more than actual obstacles. The lesson: the cage is mostly imaginary. Mindset shifts create dramatic life changes.', 'Underestimates own value. Often works below true level. Needs to actively promote self rather than wait to be discovered.', 'Money anxiety even when financially stable. Needs conscious abundance mindset work.', 'Sacrifices own needs in relationships. Eventually feels resentment. Must practice reciprocity.', 'May sacrifice business ambitions for family or social approval. Full potential unlocked only when permission is self-given.', 'Self-limitation from past life of restriction', false),
(13, 4, 'The Transformer', 'karmic', 'Past life carried energy of laziness, cutting corners, or misuse of power. This life: shortcuts backfire dramatically and consistently. Not cursed — the universe is specifically training this person to be a builder. Once the lesson is accepted (hard work IS the path), extraordinary things get built. Many great architects, scientists, and builders carry 13.', 'Excellence in roles requiring consistent long-term effort. Engineering, surgery, academia, deep craft.', 'Wealth is real but delayed. Every attempt to shortcut financial growth backfires. Steady compound interest beats speculation.', 'Marriage or partnership requires real work — but produces lasting unions. Quick connections fail.', 'Best businesses are built over years, not launched overnight. Products that serve a real function succeed.', 'Laziness/entitlement in past life. Hard work as karmic curriculum', false),
(14, 5, 'The Movement', 'karmic', 'Past life misused freedom through excess, addiction, or irresponsibility. This life: extraordinary potential for communication and freedom-use, but with a specific test. Cannot cage this energy — attempts to live ultra-structured lives fail. Must CHOOSE discipline within freedom. When this is understood: most magnetic communicators, salespeople, writers. When unresolved: addiction, instability, wasted talent.', 'Communication, sales, media, travel, languages. Any role with variety and movement. Structure-only roles feel like imprisonment.', 'Income is possible in large amounts but requires discipline to retain. Financial management skills must be consciously built.', 'Commitment is the lesson. Deep relationships possible only after 14 accepts that freedom AND depth can coexist.', 'Business involving communication, movement, or freedom. Must have trusted financial co-founder.', 'Misuse of freedom in past life', false),
(15, 6, 'The Magician', 'favorable', 'Extraordinary manifestation ability. What this person focuses on consistently tends to materialize. The most magnetic of the 6 compounds. Charismatic, creative, with natural ability to attract resources, people, and opportunity. Warning: negative focus is equally magnetic — what you fear and dwell on also tends to appear.', 'Any role where personal magnetism is an asset: sales, coaching, entertainment, leadership, spiritual work.', 'Can attract significant wealth, especially when values-aligned. Materialism without purpose misuses this energy.', 'Deep, lasting relationships possible. Natural partner quality. Must avoid using magnetism manipulatively.', 'Business ideas that align with beauty, service, or transformation succeed. Venus-ruled industries flourish.', null, false),
(16, 7, 'The Tower', 'karmic', 'Most challenging karmic compound. Past life: abuse of position, pride, or sacred love. This life: every structure built on false pride or ego collapses — often dramatically and publicly. The lesson is surrender and humility. NOT a cursed number. People who carry 16 and accept its lesson become the most spiritually powerful humans alive. Before acceptance: series of shocking losses of status, love, or material security.', 'Must build from genuine service, not ego. Roles in healing, spiritual guidance, counseling often suit resolved 16 energy.', 'Wealth built on exploitation collapses. Wealth built on genuine service is lasting and protected.', 'Relationships built on control or possession collapse. Relationships built on genuine love and respect are stable and beautiful.', 'Business built for ego recognition fails. Business that solves real problems for people succeeds.', 'Pride/abuse of power in past life. Ego dissolution as curriculum.', true),
(17, 8, 'The Star', 'favorable', 'Immortality through works. What this person creates outlasts them. Their name and contributions will be remembered long after they are gone. Often comes to prominence in later life (40s-60s). The 17 carries a quality of enduring excellence — not flash-in-the-pan success but legacy.', 'Industries where legacy matters: architecture, publishing, education, film, science, medicine.', 'Long-term wealth building. Real estate, intellectual property, investments that compound over decades.', 'Partner loyalty is extraordinary once commitment is made. These relationships are also legacies.', 'Business built with quality and longevity in mind. Brand that outlives the founder.', null, false),
(18, 9, 'The Moon', 'mixed', 'Inner conflict between material ambitions and spiritual calling. This person wants both worldly power and inner peace simultaneously — and spends significant life energy resolving which serves them. Life has distinct chapters with major theme shifts. Not restless for no reason — genuinely multi-dimensional.', 'Works through life in phases — different careers in different decades are normal, not failure.', 'Money is accessible but relationship with it is complex. May accumulate then reject wealth, then seek it again.', 'Deep emotional intensity in relationships. Cannot be superficial. Partners must accept all phases.', 'Multi-industry entrepreneur, or business that bridges material and spiritual (wellness, education, arts).', null, false),
(19, 1, 'Prince of Heaven', 'highly_favorable', 'Royal protection. Falls from great heights but always recovers — often stronger. The universe seems to arrange help at critical moments for this person. Karmic independence pattern: they help many people but must learn to ask for help themselves (a specific lesson for this compound). Not entitled luck — earned protection from past-life service.', 'Leadership roles of all kinds. Often rises through adversity. The "comeback story" archetype.', 'Financial setbacks happen and full recovery follows. The pattern repeats. Learning: build during recovery, not just in abundance.', 'Deep capacity for love. The karmic lesson of receiving love and support without feeling vulnerable.', 'Business protects this person even in market downturns. Resilient brand.', 'Past life: great service to others. This life: learning to receive.', false),
(20, 2, 'The Awakening', 'transformative', 'Life has a clear before and after. A spiritual or existential crisis serves as the turning point that unlocks this person''s real power. Not tragedy — transformation. Everything before the awakening moment was preparation. Everything after has direction and purpose.', 'Career changes dramatically after the awakening moment. Second career is almost always more fulfilling.', 'Material security may be disrupted during the transition but is rebuilt more solidly afterward.', 'Relationships transform alongside the person. Those who cannot grow together are released.', 'Business born after the awakening carries authentic mission energy — more sustainable.', null, false),
(21, 3, 'Crown of Magi', 'highly_favorable', 'Most charismatic and fortunate creative compound. Natural public recognition, things come with seemingly less effort than others. Jupiter''s full blessing. Warning: can coast on natural talent and miss the depth that effort provides. The lesson for 21 is embracing challenge deliberately — not everything needs to be easy.', 'Public-facing roles, entertainment, teaching, leadership, creative direction. Natural media personality.', 'Wealth comes through natural talent and recognition. Generous by nature. Must develop saving habits deliberately.', 'Magnetic to partners. Deep loving relationships possible. Must choose partners who challenge them intellectually.', 'Brand business, personal brand, creative agency. Their name IS the product.', null, false),
(22, 4, 'Master Builder', 'master', 'The most potentially powerful number in numerology. Built for creation at global or societal scale. The anxiety of carrying this potential is real — they feel the weight of what they could build. When functioning: extraordinary architects of reality in business, policy, social systems, or art. When suppressed by fear: 22 energy becomes anxious, over-controlled, and frustrated. Must build something. Anything.', 'Architecture, policy, large-scale enterprise, social impact organizations, technology platforms.', 'Wealth through creation of enduring systems or institutions. Personal wealth often secondary to wealth creation for others.', 'Partners must understand that the "building" is not neglect — it is love expressed differently. Needs partners who have their own mission.', 'The business itself is the life''s work. Not just a commercial enterprise — a structure meant to endure.', null, true),
(23, 5, 'Royal Star of the Lion', 'highly_favorable', 'Considered the luckiest compound in classical Chaldean numerology. Help arrives from powerful sources. Patronage, protection, favor of authority figures. Not passive luck — this person attracts opportunities through their communication ability and natural charisma. The favor of powerful people is earned through genuine quality, not sycophancy.', 'Communications, media, public roles, sales, diplomacy. Success in any field where relationship with authority matters.', 'Income through patronage, commissions, public recognition. Money flows through relationships.', 'Blessed in love when authentic. Deep appreciation for beauty in all forms.', 'Business thrives with the right investor, mentor, or institutional supporter behind it.', null, false)
ON CONFLICT (compound) DO NOTHING;

-- Seed Lo Shu arrows
INSERT INTO public.nikb_loshu_arrows (arrow_id, name, numbers, direction, plane, present_title, present_meaning, missing_title, missing_meaning, partial_meaning, career_impact_present, career_impact_missing, relationship_present, relationship_missing, remedy_missing) VALUES
('arrow_determination_1_5_9', 'Arrow of Determination', ARRAY[1,5,9], 'diagonal', 'willpower', 'Inner Strength', 'Exceptional willpower, resilience, and clarity of purpose. This person knows what they want and does not stop until they have it. The central number 5 amplifies both the independence of 1 and the completeness of 9.', 'Wavering Will', 'Tendency to change direction frequently. Difficulty maintaining long-term commitment to goals. Not weakness — the lesson here is choosing and staying. Willpower is to be developed deliberately, not expected automatically.', 'Partial determination: has the drive but inconsistent follow-through.', 'Leadership, entrepreneurship, any role requiring sustained focus over years.', 'Requires written goals, accountability partners, completion tracking. Excellent at starting, needs help finishing.', 'Loyal and committed in relationships when the relationship has clear purpose and growth.', 'Relationship commitment difficult. May leave relationships at first sign of stagnation.', 'Daily intentions practice, Saturn remedies, physical training (builds follow-through), journaling goals daily'),
('arrow_intellect_3_5_7', 'Arrow of the Intellect', ARRAY[3,5,7], 'diagonal', 'mental', 'Sharp Mind', 'Exceptional analytical intelligence, creative problem-solving, and sharp memory. The combination of creative 3, adaptive 5, and introspective 7 creates a mind that is both analytical and intuitive — rare and powerful.', 'Scattered Thinking', 'Difficulty focusing and retaining information. Ideas come fast but implementation is slow. The mind jumps before it lands. Not low intelligence — poor mental organization.', 'Partial intellect: strong in one domain, gaps in others.', 'Research, analysis, writing, teaching, consulting, programming — any role requiring deep thought.', 'Needs external organization systems. Works better in structured environments or with a grounded partner/colleague.', 'Intellectually stimulating conversations are primary attraction driver.', 'Boredom is the relationship killer. Intellectual stagnation causes withdrawal.', 'Mercury worship, brain training games, reading habit, reduced screen fragmentation time'),
('arrow_practical_8_1_6', 'Arrow of Practicality', ARRAY[8,1,6], 'horizontal', 'practical', 'Grounded Achiever', 'Extremely well-grounded, financially capable, and execution-oriented. This person builds in the real world — not just ideas. The combination of material 8, self-sufficient 1, and harmonious 6 creates someone who both earns and manages resources well.', 'Impractical Dreamer', 'Difficulty with execution, financial management, and real-world follow-through. Ideas without grounding. May struggle to translate vision into concrete steps. Often needs a more practical co-founder or partner.', 'Partial practicality: good in one or two domains but not all three.', 'Finance, operations, management, real estate, any role requiring execution.', 'Needs operational support. Visionary without executor. Hire grounded people, marry grounded partner.', 'Creates secure, stable, beautiful home environment. Reliable provider.', 'Partner may feel relationship lacks grounding or security.', 'Earth element practices: gardening, cooking, physical craft. Financial education. Daily to-do completion habits'),
('arrow_compassion_2_7_6', 'Arrow of Compassion', ARRAY[2,7,6], 'vertical', 'emotional', 'The Healer', 'Deep capacity for empathy, healing, and spiritual love. This person naturally senses others'' emotional states and responds with genuine care. Often called to service, healing, teaching, or counseling roles.', 'Emotional Distance', 'Relationships feel transactional or surface-level. Genuine emotional connection is difficult. May appear cold or analytical even when internally caring. The lesson is learning to express emotional depth outwardly.', 'Some warmth present but inconsistent.', 'Healthcare, psychology, social work, teaching, spiritual guidance.', 'Professional environments feel emotionally sterile. Needs to consciously build emotional connections at work.', 'Deeply loving when trust is established. Slow to trust, but loyal for life.', 'Partners may feel emotional needs unmet. Physical presence without emotional engagement.', 'Moon rituals, emotional journaling, therapy, deliberate vulnerability practice'),
('arrow_success_golden_4_5_6', 'Golden Arrow of Success', ARRAY[4,5,6], 'horizontal', 'success', 'Supported by Fortune', 'External support, luck, and favorable circumstances conspire to support this person''s efforts. Not passive — they work hard — but the universe seems to arrange helpful coincidences. Confidence is natural and expressed well.', 'Arrow of Frustration', 'Emotional repression and external obstacles. Efforts face unexplained resistance. The lesson: the frustration itself is the teacher. Pushing through without expectation of external help builds the inner strength that was the real goal.', 'Some external support but inconsistent.', 'Leadership, entrepreneurship, public service, any role where favor of people matters.', 'Must work twice as hard for same recognition. Mentors and support systems need to be actively built.', 'Natural ease in expressing affection. Relationships feel supported by circumstances.', 'Relationships may face external obstacles or poor timing repeatedly.', 'Venus remedies, gratitude practice, consciously building support networks'),
('arrow_wealth_silver_2_5_8', 'Silver Arrow of Wealth', ARRAY[2,5,8], 'diagonal', 'success', 'Financial Wisdom', 'Natural instinct for money, property, and tangible asset building. This person intuitively understands financial cycles, property values, and wealth building. Money flows toward them and they know how to keep it.', 'Money Drain', 'Money flows in and flows out with equal speed. Financial management is a learned skill here, not natural. May earn significant amounts but struggle to accumulate. The lesson is building financial discipline as a habit.', 'Earns well but inconsistent retention.', 'Finance, real estate, investment, banking, property management.', 'Financial management training is essential. Needs a financial plan, not just financial goals.', 'Relationship stability often linked to financial security.', 'Financial stress strains relationships. Money conversations need to be explicit early.', 'Venus+Saturn practices, financial education, automatic saving systems, property as forced savings')
ON CONFLICT (arrow_id) DO NOTHING;

-- Seed personality scoring rules
INSERT INTO public.nikb_personality_rules (trait, base_from, base_values, modifier_rules, interpretation_bands, low_text, medium_text, high_text) VALUES
('leadership', 'life_path',
  '{"1": 90, "2": 30, "3": 55, "4": 65, "5": 50, "6": 45, "7": 35, "8": 85, "9": 75, "11": 60, "22": 95, "33": 70}'::jsonb,
  '[{"condition": {"loshu_arrow_present": "arrow_determination_1_5_9"}, "modifier": 15}, {"condition": {"compound_day": [1, 10, 19, 28]}, "modifier": 10}, {"condition": {"destiny": 1}, "modifier": 10}, {"condition": {"destiny": 8}, "modifier": 10}]'::jsonb,
  '{"0-30": "low", "31-60": "medium", "61-100": "high"}'::jsonb,
  'Prefers to follow, support, or work independently rather than lead groups. Strength is in depth of contribution, not direction of others.',
  'Can lead when needed, prefers not to be the permanent authority. Situational leader. Strong in focused contexts.',
  'Natural leader with strong drive to direct, influence, and take charge. Must learn to develop others rather than just performing leadership.'
),
('creativity', 'life_path',
  '{"1": 55, "2": 45, "3": 90, "4": 30, "5": 70, "6": 65, "7": 60, "8": 35, "9": 80, "11": 85, "22": 50, "33": 95}'::jsonb,
  '[{"condition": {"loshu_arrow_present": "arrow_intellect_3_5_7"}, "modifier": 15}, {"condition": {"dominant_plane": "emotional"}, "modifier": 10}, {"condition": {"compound_day": [21, 3, 12, 30]}, "modifier": 10}]'::jsonb,
  '{"0-30": "low", "31-60": "medium", "61-100": "high"}'::jsonb,
  'Prefers structured, systematic approaches. Creativity is not the primary mode. Strong in execution, process, and reliability.',
  'Creative in specific domains or under the right conditions. Can generate original ideas but also comfortable with established methods.',
  'Highly creative, original, and idea-generative. Must pair with execution partners to convert ideas to results.'
),
('discipline', 'life_path',
  '{"1": 55, "2": 50, "3": 30, "4": 90, "5": 25, "6": 60, "7": 65, "8": 85, "9": 55, "11": 35, "22": 90, "33": 55}'::jsonb,
  '[{"condition": {"loshu_arrow_present": "arrow_practical_8_1_6"}, "modifier": 15}, {"condition": {"karmic_debt": [13]}, "modifier": -10}, {"condition": {"compound_day": [4, 13, 22, 31]}, "modifier": 10}]'::jsonb,
  '{"0-30": "low", "31-60": "medium", "61-100": "high"}'::jsonb,
  'Spontaneous, flexible, resistant to routine. Works in bursts of energy. Needs external structure or accountability systems.',
  'Can be disciplined when motivated. Consistent in priority areas, inconsistent in others.',
  'Highly consistent, reliable, and structured. Can be perceived as rigid. Extraordinary builder when mission is clear.'
)
ON CONFLICT (trait, language) DO NOTHING;

-- =====================================================================
-- VERIFY:
-- SELECT compound, trad_name, nature FROM nikb_compound_numbers ORDER BY compound;
-- SELECT arrow_id, name FROM nikb_loshu_arrows;
-- SELECT trait FROM nikb_personality_rules;
-- =====================================================================


-- =====================================================================
-- BUNDLED FILE: 17_subscriptions.sql
-- =====================================================================

-- =====================================================================
-- 17_subscriptions.sql — AnkJyotish Plus membership (recurring revenue)
-- Monthly membership ₹99/₹149. Existing payment flow reuse karta hai.
-- ADDITIVE — kuch delete nahi. Project: kassdsugfktqptsxzqhr.
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.subscriptions (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id            uuid,                   -- nullable (guest bhi le sake)
  email              text,
  plan               text NOT NULL,          -- 'plus_monthly' / 'plus_quarterly'
  amount             numeric NOT NULL,
  status             text NOT NULL DEFAULT 'pending',  -- pending/active/expired/cancelled
  cashfree_order_id  text UNIQUE,
  started_at         timestamptz,
  expires_at         timestamptz,
  created_at         timestamptz DEFAULT now(),
  updated_at         timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_sub_user ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_sub_email ON public.subscriptions(email);
CREATE INDEX IF NOT EXISTS idx_sub_order ON public.subscriptions(cashfree_order_id);

GRANT SELECT, INSERT, UPDATE ON public.subscriptions TO anon, authenticated;

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- user apni subscription dekh sake; admin sab
DROP POLICY IF EXISTS sub_read ON public.subscriptions;
CREATE POLICY sub_read ON public.subscriptions FOR SELECT USING (
  auth.uid() = user_id OR public.is_admin() OR user_id IS NULL
);
-- insert (checkout) — koi bhi apni bana sake
DROP POLICY IF EXISTS sub_insert ON public.subscriptions;
CREATE POLICY sub_insert ON public.subscriptions FOR INSERT WITH CHECK (true);
-- update — admin ya service role (webhook). User apni cancel kar sake.
DROP POLICY IF EXISTS sub_update ON public.subscriptions;
CREATE POLICY sub_update ON public.subscriptions FOR UPDATE USING (
  auth.uid() = user_id OR public.is_admin()
) WITH CHECK (true);

-- plan prices admin-editable (system_settings me — 15 SQL me table bani)
INSERT INTO public.system_settings (key, value) VALUES
  ('plus_monthly_price', '99'),
  ('plus_quarterly_price', '249')
ON CONFLICT (key) DO NOTHING;

-- Verify:
-- SELECT * FROM public.subscriptions ORDER BY created_at DESC LIMIT 5;


-- =====================================================================
-- BUNDLED FILE: 18_nikb_mb_matrix_seed.sql
-- =====================================================================

-- =====================================================================
-- 18_nikb_mb_matrix_seed.sql -- 81 Mulank x Bhagyank combinations
-- Consultant-grade, derived from planetary rulers + friend/enemy relations.
-- Run AFTER 16_nikb_schemas.sql. ADDITIVE (ON CONFLICT DO NOTHING).
-- Project: kassdsugfktqptsxzqhr.
-- =====================================================================
INSERT INTO public.nikb_mb_matrix
(mulank, bhagyank, personality_core, career_profile, wealth_pattern, marriage_pattern, business_profile, growth_path, challenges, harmony_score, dominant_energy, tension_points) VALUES
(1,1,'Mulank 1 gives a independent, pioneering, authoritative core, Bhagyank 1 shapes a destiny of independent, pioneering, authoritative. These energies reinforce each other.','Best-fit careers: leadership, entrepreneurship, government, management. Destiny pulls also toward leadership, entrepreneurship, government, management.','Wealth through bold action and leadership. Steady income.','Loyal, needs an equal who respects independence. Bhagyank 1 adds need for ambition in partner.','Natural founder/CEO energy.','Balance independent with independent. Develop independence and self-trust.','Ego clashes and impatience. Harmonious flow between core and destiny.',7,'Mulank (core nature dominates)','Harmonious flow between core and destiny.'),
(1,2,'Mulank 1 gives a independent, pioneering, authoritative core, Bhagyank 2 shapes a destiny of sensitive, diplomatic, nurturing. These energies reinforce each other.','Best-fit careers: leadership, entrepreneurship, government, management. Destiny pulls also toward counseling, HR, diplomacy, partnerships, hospitality.','Wealth through relationships and service. Steady income.','Loyal, needs an equal who respects independence. Bhagyank 2 adds need for harmony.','Natural founder/CEO energy.','Balance independent with sensitive. Develop independence and self-trust.','Ego clashes and impatience. Harmonious flow between core and destiny.',8,'Mulank (core nature dominates)','Harmonious flow between core and destiny.'),
(1,3,'Mulank 1 gives a independent, pioneering, authoritative core, Bhagyank 3 shapes a destiny of creative, expressive, optimistic. These energies reinforce each other.','Best-fit careers: leadership, entrepreneurship, government, management. Destiny pulls also toward creative arts, teaching, writing, media, entertainment.','Wealth through creativity and communication. Income can be irregular but large.','Loyal, needs an equal who respects independence. Bhagyank 3 adds need for depth and meaning.','Natural founder/CEO energy.','Balance independent with creative. Use creative expression as destiny''s channel.','Ego clashes and impatience. Harmonious flow between core and destiny.',8,'Mulank (core nature dominates)','Harmonious flow between core and destiny.'),
(1,4,'Mulank 1 gives a independent, pioneering, authoritative core, Bhagyank 4 shapes a destiny of disciplined, practical, hardworking. These energies create productive friction.','Best-fit careers: leadership, entrepreneurship, government, management. Destiny pulls also toward engineering, construction, systems, operations, administration.','Wealth through consistent effort and authority. Steady income.','Loyal, needs an equal who respects independence. Bhagyank 4 adds need for depth and meaning.','Natural founder/CEO energy.','Balance independent with disciplined. Embrace discipline to convert ideas to results.','Ego clashes and impatience. independent core meets disciplined destiny - inner pull in two directions.',4,'Mulank (core nature dominates)','independent core meets disciplined destiny - inner pull in two directions.'),
(1,5,'Mulank 1 gives a independent, pioneering, authoritative core, Bhagyank 5 shapes a destiny of adaptable, communicative, freedom-loving. These energies reinforce each other.','Best-fit careers: leadership, entrepreneurship, government, management. Destiny pulls also toward sales, marketing, communication, travel, media.','Wealth through creativity and communication. Income can be irregular but large.','Loyal, needs an equal who respects independence. Bhagyank 5 adds need for freedom within commitment.','Natural founder/CEO energy.','Balance independent with adaptable. Use creative expression as destiny''s channel.','Ego clashes and impatience. Harmonious flow between core and destiny.',8,'Mulank (core nature dominates)','Harmonious flow between core and destiny.'),
(1,6,'Mulank 1 gives a independent, pioneering, authoritative core, Bhagyank 6 shapes a destiny of caring, responsible, harmony-seeking. These energies create productive friction.','Best-fit careers: leadership, entrepreneurship, government, management. Destiny pulls also toward healthcare, beauty, hospitality, education, design.','Wealth through relationships and service. Steady income.','Loyal, needs an equal who respects independence. Bhagyank 6 adds need for harmony.','Natural founder/CEO energy.','Balance independent with caring. Serve others to fulfill destiny.','Ego clashes and impatience. independent core meets caring destiny - inner pull in two directions.',4,'Mulank (core nature dominates)','independent core meets caring destiny - inner pull in two directions.'),
(1,7,'Mulank 1 gives a independent, pioneering, authoritative core, Bhagyank 7 shapes a destiny of analytical, spiritual, introspective. These energies create productive friction.','Best-fit careers: leadership, entrepreneurship, government, management. Destiny pulls also toward research, analysis, spirituality, technology, academia.','Wealth through bold action and leadership. Steady income.','Loyal, needs an equal who respects independence. Bhagyank 7 adds need for depth and meaning.','Natural founder/CEO energy.','Balance independent with analytical. Develop independence and self-trust.','Ego clashes and impatience. independent core meets analytical destiny - inner pull in two directions.',4,'Mulank (core nature dominates)','independent core meets analytical destiny - inner pull in two directions.'),
(1,8,'Mulank 1 gives a independent, pioneering, authoritative core, Bhagyank 8 shapes a destiny of ambitious, material, authoritative. These energies create productive friction.','Best-fit careers: leadership, entrepreneurship, government, management. Destiny pulls also toward business, finance, real estate, law, authority roles.','Wealth through consistent effort and authority. Money may come with delays but lasts.','Loyal, needs an equal who respects independence. Bhagyank 8 adds need for ambition in partner.','Natural founder/CEO energy.','Balance independent with ambitious. Embrace discipline to convert ideas to results.','Ego clashes and impatience. independent core meets ambitious destiny - inner pull in two directions.',4,'Bhagyank (destiny pulls stronger)','independent core meets ambitious destiny - inner pull in two directions.'),
(1,9,'Mulank 1 gives a independent, pioneering, authoritative core, Bhagyank 9 shapes a destiny of energetic, humanitarian, intense. These energies reinforce each other.','Best-fit careers: leadership, entrepreneurship, government, management. Destiny pulls also toward defense, sports, social work, surgery, leadership of causes.','Wealth through bold action and leadership. Income can be irregular but large.','Loyal, needs an equal who respects independence. Bhagyank 9 adds need for depth and meaning.','Natural founder/CEO energy.','Balance independent with energetic. Serve others to fulfill destiny.','Ego clashes and impatience. Harmonious flow between core and destiny.',8,'Bhagyank (destiny pulls stronger)','Harmonious flow between core and destiny.'),
(2,1,'Mulank 2 gives a sensitive, diplomatic, nurturing core, Bhagyank 1 shapes a destiny of independent, pioneering, authoritative. These energies reinforce each other.','Best-fit careers: counseling, HR, diplomacy, partnerships, hospitality. Destiny pulls also toward leadership, entrepreneurship, government, management.','Wealth through bold action and leadership. Steady income.','Nurturing and devoted, needs emotional security. Bhagyank 1 adds need for ambition in partner.','Driving force; channel the intensity.','Balance sensitive with independent. Develop independence and self-trust.','Over-sensitivity and indecision. Harmonious flow between core and destiny.',8,'Bhagyank (destiny pulls stronger)','Harmonious flow between core and destiny.'),
(2,2,'Mulank 2 gives a sensitive, diplomatic, nurturing core, Bhagyank 2 shapes a destiny of sensitive, diplomatic, nurturing. These energies reinforce each other.','Best-fit careers: counseling, HR, diplomacy, partnerships, hospitality. Destiny pulls also toward counseling, HR, diplomacy, partnerships, hospitality.','Wealth through relationships and service. Steady income.','Nurturing and devoted, needs emotional security. Bhagyank 2 adds need for harmony.','Driving force; channel the intensity.','Balance sensitive with sensitive. Develop independence and self-trust.','Over-sensitivity and indecision. Harmonious flow between core and destiny.',7,'Balanced - both express','Harmonious flow between core and destiny.'),
(2,3,'Mulank 2 gives a sensitive, diplomatic, nurturing core, Bhagyank 3 shapes a destiny of creative, expressive, optimistic. These energies reinforce each other.','Best-fit careers: counseling, HR, diplomacy, partnerships, hospitality. Destiny pulls also toward creative arts, teaching, writing, media, entertainment.','Wealth through creativity and communication. Income can be irregular but large.','Nurturing and devoted, needs emotional security. Bhagyank 3 adds need for depth and meaning.','Driving force; channel the intensity.','Balance sensitive with creative. Use creative expression as destiny''s channel.','Over-sensitivity and indecision. Harmonious flow between core and destiny.',8,'Balanced - both express','Harmonious flow between core and destiny.'),
(2,4,'Mulank 2 gives a sensitive, diplomatic, nurturing core, Bhagyank 4 shapes a destiny of disciplined, practical, hardworking. These energies create productive friction.','Best-fit careers: counseling, HR, diplomacy, partnerships, hospitality. Destiny pulls also toward engineering, construction, systems, operations, administration.','Wealth through consistent effort and authority. Steady income.','Nurturing and devoted, needs emotional security. Bhagyank 4 adds need for depth and meaning.','Driving force; channel the intensity.','Balance sensitive with disciplined. Embrace discipline to convert ideas to results.','Over-sensitivity and indecision. sensitive core meets disciplined destiny - inner pull in two directions.',4,'Balanced - both express','sensitive core meets disciplined destiny - inner pull in two directions.'),
(2,5,'Mulank 2 gives a sensitive, diplomatic, nurturing core, Bhagyank 5 shapes a destiny of adaptable, communicative, freedom-loving. These energies reinforce each other.','Best-fit careers: counseling, HR, diplomacy, partnerships, hospitality. Destiny pulls also toward sales, marketing, communication, travel, media.','Wealth through creativity and communication. Income can be irregular but large.','Nurturing and devoted, needs emotional security. Bhagyank 5 adds need for freedom within commitment.','Driving force; channel the intensity.','Balance sensitive with adaptable. Use creative expression as destiny''s channel.','Over-sensitivity and indecision. Harmonious flow between core and destiny.',8,'Balanced - both express','Harmonious flow between core and destiny.'),
(2,6,'Mulank 2 gives a sensitive, diplomatic, nurturing core, Bhagyank 6 shapes a destiny of caring, responsible, harmony-seeking. These energies create productive friction.','Best-fit careers: counseling, HR, diplomacy, partnerships, hospitality. Destiny pulls also toward healthcare, beauty, hospitality, education, design.','Wealth through relationships and service. Steady income.','Nurturing and devoted, needs emotional security. Bhagyank 6 adds need for harmony.','Driving force; channel the intensity.','Balance sensitive with caring. Serve others to fulfill destiny.','Over-sensitivity and indecision. sensitive core meets caring destiny - inner pull in two directions.',4,'Balanced - both express','sensitive core meets caring destiny - inner pull in two directions.'),
(2,7,'Mulank 2 gives a sensitive, diplomatic, nurturing core, Bhagyank 7 shapes a destiny of analytical, spiritual, introspective. These energies create productive friction.','Best-fit careers: counseling, HR, diplomacy, partnerships, hospitality. Destiny pulls also toward research, analysis, spirituality, technology, academia.','Wealth through bold action and leadership. Steady income.','Nurturing and devoted, needs emotional security. Bhagyank 7 adds need for depth and meaning.','Driving force; channel the intensity.','Balance sensitive with analytical. Develop independence and self-trust.','Over-sensitivity and indecision. sensitive core meets analytical destiny - inner pull in two directions.',4,'Balanced - both express','sensitive core meets analytical destiny - inner pull in two directions.'),
(2,8,'Mulank 2 gives a sensitive, diplomatic, nurturing core, Bhagyank 8 shapes a destiny of ambitious, material, authoritative. These energies create productive friction.','Best-fit careers: counseling, HR, diplomacy, partnerships, hospitality. Destiny pulls also toward business, finance, real estate, law, authority roles.','Wealth through consistent effort and authority. Money may come with delays but lasts.','Nurturing and devoted, needs emotional security. Bhagyank 8 adds need for ambition in partner.','Driving force; channel the intensity.','Balance sensitive with ambitious. Embrace discipline to convert ideas to results.','Over-sensitivity and indecision. sensitive core meets ambitious destiny - inner pull in two directions.',4,'Bhagyank (destiny pulls stronger)','sensitive core meets ambitious destiny - inner pull in two directions.'),
(2,9,'Mulank 2 gives a sensitive, diplomatic, nurturing core, Bhagyank 9 shapes a destiny of energetic, humanitarian, intense. These energies create productive friction.','Best-fit careers: counseling, HR, diplomacy, partnerships, hospitality. Destiny pulls also toward defense, sports, social work, surgery, leadership of causes.','Wealth through bold action and leadership. Income can be irregular but large.','Nurturing and devoted, needs emotional security. Bhagyank 9 adds need for depth and meaning.','Driving force; channel the intensity.','Balance sensitive with energetic. Serve others to fulfill destiny.','Over-sensitivity and indecision. sensitive core meets energetic destiny - inner pull in two directions.',4,'Bhagyank (destiny pulls stronger)','sensitive core meets energetic destiny - inner pull in two directions.'),
(3,1,'Mulank 3 gives a creative, expressive, optimistic core, Bhagyank 1 shapes a destiny of independent, pioneering, authoritative. These energies reinforce each other.','Best-fit careers: creative arts, teaching, writing, media, entertainment. Destiny pulls also toward leadership, entrepreneurship, government, management.','Wealth through bold action and leadership. Steady income.','Needs intellectual/creative connection. Bhagyank 1 adds need for ambition in partner.','Best as creative/relationship lead with an ops partner.','Balance creative with independent. Develop independence and self-trust.','Scattered focus. Harmonious flow between core and destiny.',8,'Bhagyank (destiny pulls stronger)','Harmonious flow between core and destiny.'),
(3,2,'Mulank 3 gives a creative, expressive, optimistic core, Bhagyank 2 shapes a destiny of sensitive, diplomatic, nurturing. These energies reinforce each other.','Best-fit careers: creative arts, teaching, writing, media, entertainment. Destiny pulls also toward counseling, HR, diplomacy, partnerships, hospitality.','Wealth through relationships and service. Steady income.','Needs intellectual/creative connection. Bhagyank 2 adds need for harmony.','Best as creative/relationship lead with an ops partner.','Balance creative with sensitive. Develop independence and self-trust.','Scattered focus. Harmonious flow between core and destiny.',8,'Balanced - both express','Harmonious flow between core and destiny.'),
(3,3,'Mulank 3 gives a creative, expressive, optimistic core, Bhagyank 3 shapes a destiny of creative, expressive, optimistic. These energies reinforce each other.','Best-fit careers: creative arts, teaching, writing, media, entertainment. Destiny pulls also toward creative arts, teaching, writing, media, entertainment.','Wealth through creativity and communication. Income can be irregular but large.','Needs intellectual/creative connection. Bhagyank 3 adds need for depth and meaning.','Best as creative/relationship lead with an ops partner.','Balance creative with creative. Use creative expression as destiny''s channel.','Scattered focus. Harmonious flow between core and destiny.',7,'Balanced - both express','Harmonious flow between core and destiny.'),
(3,4,'Mulank 3 gives a creative, expressive, optimistic core, Bhagyank 4 shapes a destiny of disciplined, practical, hardworking. These energies create productive friction.','Best-fit careers: creative arts, teaching, writing, media, entertainment. Destiny pulls also toward engineering, construction, systems, operations, administration.','Wealth through consistent effort and authority. Steady income.','Needs intellectual/creative connection. Bhagyank 4 adds need for depth and meaning.','Best as creative/relationship lead with an ops partner.','Balance creative with disciplined. Embrace discipline to convert ideas to results.','Scattered focus. creative core meets disciplined destiny - inner pull in two directions.',4,'Balanced - both express','creative core meets disciplined destiny - inner pull in two directions.'),
(3,5,'Mulank 3 gives a creative, expressive, optimistic core, Bhagyank 5 shapes a destiny of adaptable, communicative, freedom-loving. These energies create productive friction.','Best-fit careers: creative arts, teaching, writing, media, entertainment. Destiny pulls also toward sales, marketing, communication, travel, media.','Wealth through creativity and communication. Income can be irregular but large.','Needs intellectual/creative connection. Bhagyank 5 adds need for freedom within commitment.','Best as creative/relationship lead with an ops partner.','Balance creative with adaptable. Use creative expression as destiny''s channel.','Scattered focus. creative core meets adaptable destiny - inner pull in two directions.',4,'Balanced - both express','creative core meets adaptable destiny - inner pull in two directions.'),
(3,6,'Mulank 3 gives a creative, expressive, optimistic core, Bhagyank 6 shapes a destiny of caring, responsible, harmony-seeking. These energies reinforce each other.','Best-fit careers: creative arts, teaching, writing, media, entertainment. Destiny pulls also toward healthcare, beauty, hospitality, education, design.','Wealth through relationships and service. Steady income.','Needs intellectual/creative connection. Bhagyank 6 adds need for harmony.','Best as creative/relationship lead with an ops partner.','Balance creative with caring. Serve others to fulfill destiny.','Scattered focus. Harmonious flow between core and destiny.',8,'Balanced - both express','Harmonious flow between core and destiny.'),
(3,7,'Mulank 3 gives a creative, expressive, optimistic core, Bhagyank 7 shapes a destiny of analytical, spiritual, introspective. These energies create productive friction.','Best-fit careers: creative arts, teaching, writing, media, entertainment. Destiny pulls also toward research, analysis, spirituality, technology, academia.','Wealth through bold action and leadership. Steady income.','Needs intellectual/creative connection. Bhagyank 7 adds need for depth and meaning.','Best as creative/relationship lead with an ops partner.','Balance creative with analytical. Develop independence and self-trust.','Scattered focus. creative core meets analytical destiny - inner pull in two directions.',4,'Balanced - both express','creative core meets analytical destiny - inner pull in two directions.'),
(3,8,'Mulank 3 gives a creative, expressive, optimistic core, Bhagyank 8 shapes a destiny of ambitious, material, authoritative. These energies create productive friction.','Best-fit careers: creative arts, teaching, writing, media, entertainment. Destiny pulls also toward business, finance, real estate, law, authority roles.','Wealth through consistent effort and authority. Money may come with delays but lasts.','Needs intellectual/creative connection. Bhagyank 8 adds need for ambition in partner.','Best as creative/relationship lead with an ops partner.','Balance creative with ambitious. Embrace discipline to convert ideas to results.','Scattered focus. creative core meets ambitious destiny - inner pull in two directions.',4,'Bhagyank (destiny pulls stronger)','creative core meets ambitious destiny - inner pull in two directions.'),
(3,9,'Mulank 3 gives a creative, expressive, optimistic core, Bhagyank 9 shapes a destiny of energetic, humanitarian, intense. These energies reinforce each other.','Best-fit careers: creative arts, teaching, writing, media, entertainment. Destiny pulls also toward defense, sports, social work, surgery, leadership of causes.','Wealth through bold action and leadership. Income can be irregular but large.','Needs intellectual/creative connection. Bhagyank 9 adds need for depth and meaning.','Best as creative/relationship lead with an ops partner.','Balance creative with energetic. Serve others to fulfill destiny.','Scattered focus. Harmonious flow between core and destiny.',8,'Bhagyank (destiny pulls stronger)','Harmonious flow between core and destiny.'),
(4,1,'Mulank 4 gives a disciplined, practical, hardworking core, Bhagyank 1 shapes a destiny of independent, pioneering, authoritative. These energies create productive friction.','Best-fit careers: engineering, construction, systems, operations, administration. Destiny pulls also toward leadership, entrepreneurship, government, management.','Wealth through bold action and leadership. Steady income.','Intense and protective. Bhagyank 1 adds need for ambition in partner.','Strong systems and execution builder.','Balance disciplined with independent. Develop independence and self-trust.','Rigidity and overwork. disciplined core meets independent destiny - inner pull in two directions.',4,'Bhagyank (destiny pulls stronger)','disciplined core meets independent destiny - inner pull in two directions.'),
(4,2,'Mulank 4 gives a disciplined, practical, hardworking core, Bhagyank 2 shapes a destiny of sensitive, diplomatic, nurturing. These energies create productive friction.','Best-fit careers: engineering, construction, systems, operations, administration. Destiny pulls also toward counseling, HR, diplomacy, partnerships, hospitality.','Wealth through relationships and service. Steady income.','Intense and protective. Bhagyank 2 adds need for harmony.','Strong systems and execution builder.','Balance disciplined with sensitive. Develop independence and self-trust.','Rigidity and overwork. disciplined core meets sensitive destiny - inner pull in two directions.',4,'Balanced - both express','disciplined core meets sensitive destiny - inner pull in two directions.'),
(4,3,'Mulank 4 gives a disciplined, practical, hardworking core, Bhagyank 3 shapes a destiny of creative, expressive, optimistic. These energies create productive friction.','Best-fit careers: engineering, construction, systems, operations, administration. Destiny pulls also toward creative arts, teaching, writing, media, entertainment.','Wealth through creativity and communication. Income can be irregular but large.','Intense and protective. Bhagyank 3 adds need for depth and meaning.','Strong systems and execution builder.','Balance disciplined with creative. Use creative expression as destiny''s channel.','Rigidity and overwork. disciplined core meets creative destiny - inner pull in two directions.',4,'Balanced - both express','disciplined core meets creative destiny - inner pull in two directions.'),
(4,4,'Mulank 4 gives a disciplined, practical, hardworking core, Bhagyank 4 shapes a destiny of disciplined, practical, hardworking. These energies create productive friction.','Best-fit careers: engineering, construction, systems, operations, administration. Destiny pulls also toward engineering, construction, systems, operations, administration.','Wealth through consistent effort and authority. Steady income.','Intense and protective. Bhagyank 4 adds need for depth and meaning.','Strong systems and execution builder.','Balance disciplined with disciplined. Embrace discipline to convert ideas to results.','Rigidity and overwork. disciplined core meets disciplined destiny - inner pull in two directions.',4,'Balanced - both express','disciplined core meets disciplined destiny - inner pull in two directions.'),
(4,5,'Mulank 4 gives a disciplined, practical, hardworking core, Bhagyank 5 shapes a destiny of adaptable, communicative, freedom-loving. These energies reinforce each other.','Best-fit careers: engineering, construction, systems, operations, administration. Destiny pulls also toward sales, marketing, communication, travel, media.','Wealth through creativity and communication. Income can be irregular but large.','Intense and protective. Bhagyank 5 adds need for freedom within commitment.','Strong systems and execution builder.','Balance disciplined with adaptable. Use creative expression as destiny''s channel.','Rigidity and overwork. Harmonious flow between core and destiny.',8,'Balanced - both express','Harmonious flow between core and destiny.'),
(4,6,'Mulank 4 gives a disciplined, practical, hardworking core, Bhagyank 6 shapes a destiny of caring, responsible, harmony-seeking. These energies reinforce each other.','Best-fit careers: engineering, construction, systems, operations, administration. Destiny pulls also toward healthcare, beauty, hospitality, education, design.','Wealth through relationships and service. Steady income.','Intense and protective. Bhagyank 6 adds need for harmony.','Strong systems and execution builder.','Balance disciplined with caring. Serve others to fulfill destiny.','Rigidity and overwork. Harmonious flow between core and destiny.',8,'Balanced - both express','Harmonious flow between core and destiny.'),
(4,7,'Mulank 4 gives a disciplined, practical, hardworking core, Bhagyank 7 shapes a destiny of analytical, spiritual, introspective. These energies reinforce each other.','Best-fit careers: engineering, construction, systems, operations, administration. Destiny pulls also toward research, analysis, spirituality, technology, academia.','Wealth through bold action and leadership. Steady income.','Intense and protective. Bhagyank 7 adds need for depth and meaning.','Strong systems and execution builder.','Balance disciplined with analytical. Develop independence and self-trust.','Rigidity and overwork. Harmonious flow between core and destiny.',8,'Balanced - both express','Harmonious flow between core and destiny.'),
(4,8,'Mulank 4 gives a disciplined, practical, hardworking core, Bhagyank 8 shapes a destiny of ambitious, material, authoritative. These energies reinforce each other.','Best-fit careers: engineering, construction, systems, operations, administration. Destiny pulls also toward business, finance, real estate, law, authority roles.','Wealth through consistent effort and authority. Money may come with delays but lasts.','Intense and protective. Bhagyank 8 adds need for ambition in partner.','Strong systems and execution builder.','Balance disciplined with ambitious. Embrace discipline to convert ideas to results.','Rigidity and overwork. Harmonious flow between core and destiny.',8,'Bhagyank (destiny pulls stronger)','Harmonious flow between core and destiny.'),
(4,9,'Mulank 4 gives a disciplined, practical, hardworking core, Bhagyank 9 shapes a destiny of energetic, humanitarian, intense. These energies create productive friction.','Best-fit careers: engineering, construction, systems, operations, administration. Destiny pulls also toward defense, sports, social work, surgery, leadership of causes.','Wealth through bold action and leadership. Income can be irregular but large.','Intense and protective. Bhagyank 9 adds need for depth and meaning.','Strong systems and execution builder.','Balance disciplined with energetic. Serve others to fulfill destiny.','Rigidity and overwork. disciplined core meets energetic destiny - inner pull in two directions.',4,'Bhagyank (destiny pulls stronger)','disciplined core meets energetic destiny - inner pull in two directions.'),
(5,1,'Mulank 5 gives a adaptable, communicative, freedom-loving core, Bhagyank 1 shapes a destiny of independent, pioneering, authoritative. These energies reinforce each other.','Best-fit careers: sales, marketing, communication, travel, media. Destiny pulls also toward leadership, entrepreneurship, government, management.','Wealth through bold action and leadership. Steady income.','Needs intellectual/creative connection. Bhagyank 1 adds need for ambition in partner.','Best as creative/relationship lead with an ops partner.','Balance adaptable with independent. Develop independence and self-trust.','Scattered focus. Harmonious flow between core and destiny.',8,'Bhagyank (destiny pulls stronger)','Harmonious flow between core and destiny.'),
(5,2,'Mulank 5 gives a adaptable, communicative, freedom-loving core, Bhagyank 2 shapes a destiny of sensitive, diplomatic, nurturing. These energies create productive friction.','Best-fit careers: sales, marketing, communication, travel, media. Destiny pulls also toward counseling, HR, diplomacy, partnerships, hospitality.','Wealth through relationships and service. Steady income.','Needs intellectual/creative connection. Bhagyank 2 adds need for harmony.','Best as creative/relationship lead with an ops partner.','Balance adaptable with sensitive. Develop independence and self-trust.','Scattered focus. adaptable core meets sensitive destiny - inner pull in two directions.',4,'Balanced - both express','adaptable core meets sensitive destiny - inner pull in two directions.'),
(5,3,'Mulank 5 gives a adaptable, communicative, freedom-loving core, Bhagyank 3 shapes a destiny of creative, expressive, optimistic. These energies reinforce each other.','Best-fit careers: sales, marketing, communication, travel, media. Destiny pulls also toward creative arts, teaching, writing, media, entertainment.','Wealth through creativity and communication. Income can be irregular but large.','Needs intellectual/creative connection. Bhagyank 3 adds need for depth and meaning.','Best as creative/relationship lead with an ops partner.','Balance adaptable with creative. Use creative expression as destiny''s channel.','Scattered focus. Harmonious flow between core and destiny.',8,'Balanced - both express','Harmonious flow between core and destiny.'),
(5,4,'Mulank 5 gives a adaptable, communicative, freedom-loving core, Bhagyank 4 shapes a destiny of disciplined, practical, hardworking. These energies create productive friction.','Best-fit careers: sales, marketing, communication, travel, media. Destiny pulls also toward engineering, construction, systems, operations, administration.','Wealth through consistent effort and authority. Steady income.','Needs intellectual/creative connection. Bhagyank 4 adds need for depth and meaning.','Best as creative/relationship lead with an ops partner.','Balance adaptable with disciplined. Embrace discipline to convert ideas to results.','Scattered focus. adaptable core meets disciplined destiny - inner pull in two directions.',4,'Balanced - both express','adaptable core meets disciplined destiny - inner pull in two directions.'),
(5,5,'Mulank 5 gives a adaptable, communicative, freedom-loving core, Bhagyank 5 shapes a destiny of adaptable, communicative, freedom-loving. These energies reinforce each other.','Best-fit careers: sales, marketing, communication, travel, media. Destiny pulls also toward sales, marketing, communication, travel, media.','Wealth through creativity and communication. Income can be irregular but large.','Needs intellectual/creative connection. Bhagyank 5 adds need for freedom within commitment.','Best as creative/relationship lead with an ops partner.','Balance adaptable with adaptable. Use creative expression as destiny''s channel.','Scattered focus. Harmonious flow between core and destiny.',7,'Balanced - both express','Harmonious flow between core and destiny.'),
(5,6,'Mulank 5 gives a adaptable, communicative, freedom-loving core, Bhagyank 6 shapes a destiny of caring, responsible, harmony-seeking. These energies reinforce each other.','Best-fit careers: sales, marketing, communication, travel, media. Destiny pulls also toward healthcare, beauty, hospitality, education, design.','Wealth through relationships and service. Steady income.','Needs intellectual/creative connection. Bhagyank 6 adds need for harmony.','Best as creative/relationship lead with an ops partner.','Balance adaptable with caring. Serve others to fulfill destiny.','Scattered focus. Harmonious flow between core and destiny.',8,'Balanced - both express','Harmonious flow between core and destiny.'),
(5,7,'Mulank 5 gives a adaptable, communicative, freedom-loving core, Bhagyank 7 shapes a destiny of analytical, spiritual, introspective. These energies create productive friction.','Best-fit careers: sales, marketing, communication, travel, media. Destiny pulls also toward research, analysis, spirituality, technology, academia.','Wealth through bold action and leadership. Steady income.','Needs intellectual/creative connection. Bhagyank 7 adds need for depth and meaning.','Best as creative/relationship lead with an ops partner.','Balance adaptable with analytical. Develop independence and self-trust.','Scattered focus. adaptable core meets analytical destiny - inner pull in two directions.',4,'Balanced - both express','adaptable core meets analytical destiny - inner pull in two directions.'),
(5,8,'Mulank 5 gives a adaptable, communicative, freedom-loving core, Bhagyank 8 shapes a destiny of ambitious, material, authoritative. These energies create productive friction.','Best-fit careers: sales, marketing, communication, travel, media. Destiny pulls also toward business, finance, real estate, law, authority roles.','Wealth through consistent effort and authority. Money may come with delays but lasts.','Needs intellectual/creative connection. Bhagyank 8 adds need for ambition in partner.','Best as creative/relationship lead with an ops partner.','Balance adaptable with ambitious. Embrace discipline to convert ideas to results.','Scattered focus. adaptable core meets ambitious destiny - inner pull in two directions.',4,'Bhagyank (destiny pulls stronger)','adaptable core meets ambitious destiny - inner pull in two directions.'),
(5,9,'Mulank 5 gives a adaptable, communicative, freedom-loving core, Bhagyank 9 shapes a destiny of energetic, humanitarian, intense. These energies create productive friction.','Best-fit careers: sales, marketing, communication, travel, media. Destiny pulls also toward defense, sports, social work, surgery, leadership of causes.','Wealth through bold action and leadership. Income can be irregular but large.','Needs intellectual/creative connection. Bhagyank 9 adds need for depth and meaning.','Best as creative/relationship lead with an ops partner.','Balance adaptable with energetic. Serve others to fulfill destiny.','Scattered focus. adaptable core meets energetic destiny - inner pull in two directions.',4,'Bhagyank (destiny pulls stronger)','adaptable core meets energetic destiny - inner pull in two directions.'),
(6,1,'Mulank 6 gives a caring, responsible, harmony-seeking core, Bhagyank 1 shapes a destiny of independent, pioneering, authoritative. These energies create productive friction.','Best-fit careers: healthcare, beauty, hospitality, education, design. Destiny pulls also toward leadership, entrepreneurship, government, management.','Wealth through bold action and leadership. Steady income.','Nurturing and devoted, needs emotional security. Bhagyank 1 adds need for ambition in partner.','Best as creative/relationship lead with an ops partner.','Balance caring with independent. Develop independence and self-trust.','Over-giving and control. caring core meets independent destiny - inner pull in two directions.',4,'Bhagyank (destiny pulls stronger)','caring core meets independent destiny - inner pull in two directions.'),
(6,2,'Mulank 6 gives a caring, responsible, harmony-seeking core, Bhagyank 2 shapes a destiny of sensitive, diplomatic, nurturing. These energies create productive friction.','Best-fit careers: healthcare, beauty, hospitality, education, design. Destiny pulls also toward counseling, HR, diplomacy, partnerships, hospitality.','Wealth through relationships and service. Steady income.','Nurturing and devoted, needs emotional security. Bhagyank 2 adds need for harmony.','Best as creative/relationship lead with an ops partner.','Balance caring with sensitive. Develop independence and self-trust.','Over-giving and control. caring core meets sensitive destiny - inner pull in two directions.',4,'Balanced - both express','caring core meets sensitive destiny - inner pull in two directions.'),
(6,3,'Mulank 6 gives a caring, responsible, harmony-seeking core, Bhagyank 3 shapes a destiny of creative, expressive, optimistic. These energies reinforce each other.','Best-fit careers: healthcare, beauty, hospitality, education, design. Destiny pulls also toward creative arts, teaching, writing, media, entertainment.','Wealth through creativity and communication. Income can be irregular but large.','Nurturing and devoted, needs emotional security. Bhagyank 3 adds need for depth and meaning.','Best as creative/relationship lead with an ops partner.','Balance caring with creative. Use creative expression as destiny''s channel.','Over-giving and control. Harmonious flow between core and destiny.',8,'Balanced - both express','Harmonious flow between core and destiny.'),
(6,4,'Mulank 6 gives a caring, responsible, harmony-seeking core, Bhagyank 4 shapes a destiny of disciplined, practical, hardworking. These energies create productive friction.','Best-fit careers: healthcare, beauty, hospitality, education, design. Destiny pulls also toward engineering, construction, systems, operations, administration.','Wealth through consistent effort and authority. Steady income.','Nurturing and devoted, needs emotional security. Bhagyank 4 adds need for depth and meaning.','Best as creative/relationship lead with an ops partner.','Balance caring with disciplined. Embrace discipline to convert ideas to results.','Over-giving and control. caring core meets disciplined destiny - inner pull in two directions.',4,'Balanced - both express','caring core meets disciplined destiny - inner pull in two directions.'),
(6,5,'Mulank 6 gives a caring, responsible, harmony-seeking core, Bhagyank 5 shapes a destiny of adaptable, communicative, freedom-loving. These energies reinforce each other.','Best-fit careers: healthcare, beauty, hospitality, education, design. Destiny pulls also toward sales, marketing, communication, travel, media.','Wealth through creativity and communication. Income can be irregular but large.','Nurturing and devoted, needs emotional security. Bhagyank 5 adds need for freedom within commitment.','Best as creative/relationship lead with an ops partner.','Balance caring with adaptable. Use creative expression as destiny''s channel.','Over-giving and control. Harmonious flow between core and destiny.',8,'Balanced - both express','Harmonious flow between core and destiny.'),
(6,6,'Mulank 6 gives a caring, responsible, harmony-seeking core, Bhagyank 6 shapes a destiny of caring, responsible, harmony-seeking. These energies reinforce each other.','Best-fit careers: healthcare, beauty, hospitality, education, design. Destiny pulls also toward healthcare, beauty, hospitality, education, design.','Wealth through relationships and service. Steady income.','Nurturing and devoted, needs emotional security. Bhagyank 6 adds need for harmony.','Best as creative/relationship lead with an ops partner.','Balance caring with caring. Serve others to fulfill destiny.','Over-giving and control. Harmonious flow between core and destiny.',7,'Balanced - both express','Harmonious flow between core and destiny.'),
(6,7,'Mulank 6 gives a caring, responsible, harmony-seeking core, Bhagyank 7 shapes a destiny of analytical, spiritual, introspective. These energies create productive friction.','Best-fit careers: healthcare, beauty, hospitality, education, design. Destiny pulls also toward research, analysis, spirituality, technology, academia.','Wealth through bold action and leadership. Steady income.','Nurturing and devoted, needs emotional security. Bhagyank 7 adds need for depth and meaning.','Best as creative/relationship lead with an ops partner.','Balance caring with analytical. Develop independence and self-trust.','Over-giving and control. caring core meets analytical destiny - inner pull in two directions.',4,'Balanced - both express','caring core meets analytical destiny - inner pull in two directions.'),
(6,8,'Mulank 6 gives a caring, responsible, harmony-seeking core, Bhagyank 8 shapes a destiny of ambitious, material, authoritative. These energies reinforce each other.','Best-fit careers: healthcare, beauty, hospitality, education, design. Destiny pulls also toward business, finance, real estate, law, authority roles.','Wealth through consistent effort and authority. Money may come with delays but lasts.','Nurturing and devoted, needs emotional security. Bhagyank 8 adds need for ambition in partner.','Best as creative/relationship lead with an ops partner.','Balance caring with ambitious. Embrace discipline to convert ideas to results.','Over-giving and control. Harmonious flow between core and destiny.',8,'Bhagyank (destiny pulls stronger)','Harmonious flow between core and destiny.'),
(6,9,'Mulank 6 gives a caring, responsible, harmony-seeking core, Bhagyank 9 shapes a destiny of energetic, humanitarian, intense. These energies reinforce each other.','Best-fit careers: healthcare, beauty, hospitality, education, design. Destiny pulls also toward defense, sports, social work, surgery, leadership of causes.','Wealth through bold action and leadership. Income can be irregular but large.','Nurturing and devoted, needs emotional security. Bhagyank 9 adds need for depth and meaning.','Best as creative/relationship lead with an ops partner.','Balance caring with energetic. Serve others to fulfill destiny.','Over-giving and control. Harmonious flow between core and destiny.',8,'Bhagyank (destiny pulls stronger)','Harmonious flow between core and destiny.'),
(7,1,'Mulank 7 gives a analytical, spiritual, introspective core, Bhagyank 1 shapes a destiny of independent, pioneering, authoritative. These energies create productive friction.','Best-fit careers: research, analysis, spirituality, technology, academia. Destiny pulls also toward leadership, entrepreneurship, government, management.','Wealth through bold action and leadership. Steady income.','Intense and protective. Bhagyank 1 adds need for ambition in partner.','Researcher/strategist type.','Balance analytical with independent. Develop independence and self-trust.','Isolation and overthinking. analytical core meets independent destiny - inner pull in two directions.',4,'Bhagyank (destiny pulls stronger)','analytical core meets independent destiny - inner pull in two directions.'),
(7,2,'Mulank 7 gives a analytical, spiritual, introspective core, Bhagyank 2 shapes a destiny of sensitive, diplomatic, nurturing. These energies create productive friction.','Best-fit careers: research, analysis, spirituality, technology, academia. Destiny pulls also toward counseling, HR, diplomacy, partnerships, hospitality.','Wealth through relationships and service. Steady income.','Intense and protective. Bhagyank 2 adds need for harmony.','Researcher/strategist type.','Balance analytical with sensitive. Develop independence and self-trust.','Isolation and overthinking. analytical core meets sensitive destiny - inner pull in two directions.',4,'Balanced - both express','analytical core meets sensitive destiny - inner pull in two directions.'),
(7,3,'Mulank 7 gives a analytical, spiritual, introspective core, Bhagyank 3 shapes a destiny of creative, expressive, optimistic. These energies create productive friction.','Best-fit careers: research, analysis, spirituality, technology, academia. Destiny pulls also toward creative arts, teaching, writing, media, entertainment.','Wealth through creativity and communication. Income can be irregular but large.','Intense and protective. Bhagyank 3 adds need for depth and meaning.','Researcher/strategist type.','Balance analytical with creative. Use creative expression as destiny''s channel.','Isolation and overthinking. analytical core meets creative destiny - inner pull in two directions.',4,'Balanced - both express','analytical core meets creative destiny - inner pull in two directions.'),
(7,4,'Mulank 7 gives a analytical, spiritual, introspective core, Bhagyank 4 shapes a destiny of disciplined, practical, hardworking. These energies reinforce each other.','Best-fit careers: research, analysis, spirituality, technology, academia. Destiny pulls also toward engineering, construction, systems, operations, administration.','Wealth through consistent effort and authority. Steady income.','Intense and protective. Bhagyank 4 adds need for depth and meaning.','Researcher/strategist type.','Balance analytical with disciplined. Embrace discipline to convert ideas to results.','Isolation and overthinking. Harmonious flow between core and destiny.',8,'Balanced - both express','Harmonious flow between core and destiny.'),
(7,5,'Mulank 7 gives a analytical, spiritual, introspective core, Bhagyank 5 shapes a destiny of adaptable, communicative, freedom-loving. These energies create productive friction.','Best-fit careers: research, analysis, spirituality, technology, academia. Destiny pulls also toward sales, marketing, communication, travel, media.','Wealth through creativity and communication. Income can be irregular but large.','Intense and protective. Bhagyank 5 adds need for freedom within commitment.','Researcher/strategist type.','Balance analytical with adaptable. Use creative expression as destiny''s channel.','Isolation and overthinking. analytical core meets adaptable destiny - inner pull in two directions.',4,'Balanced - both express','analytical core meets adaptable destiny - inner pull in two directions.'),
(7,6,'Mulank 7 gives a analytical, spiritual, introspective core, Bhagyank 6 shapes a destiny of caring, responsible, harmony-seeking. These energies reinforce each other.','Best-fit careers: research, analysis, spirituality, technology, academia. Destiny pulls also toward healthcare, beauty, hospitality, education, design.','Wealth through relationships and service. Steady income.','Intense and protective. Bhagyank 6 adds need for harmony.','Researcher/strategist type.','Balance analytical with caring. Serve others to fulfill destiny.','Isolation and overthinking. Harmonious flow between core and destiny.',8,'Balanced - both express','Harmonious flow between core and destiny.'),
(7,7,'Mulank 7 gives a analytical, spiritual, introspective core, Bhagyank 7 shapes a destiny of analytical, spiritual, introspective. These energies reinforce each other.','Best-fit careers: research, analysis, spirituality, technology, academia. Destiny pulls also toward research, analysis, spirituality, technology, academia.','Wealth through bold action and leadership. Steady income.','Intense and protective. Bhagyank 7 adds need for depth and meaning.','Researcher/strategist type.','Balance analytical with analytical. Develop independence and self-trust.','Isolation and overthinking. Harmonious flow between core and destiny.',7,'Balanced - both express','Harmonious flow between core and destiny.'),
(7,8,'Mulank 7 gives a analytical, spiritual, introspective core, Bhagyank 8 shapes a destiny of ambitious, material, authoritative. These energies create productive friction.','Best-fit careers: research, analysis, spirituality, technology, academia. Destiny pulls also toward business, finance, real estate, law, authority roles.','Wealth through consistent effort and authority. Money may come with delays but lasts.','Intense and protective. Bhagyank 8 adds need for ambition in partner.','Researcher/strategist type.','Balance analytical with ambitious. Embrace discipline to convert ideas to results.','Isolation and overthinking. analytical core meets ambitious destiny - inner pull in two directions.',4,'Bhagyank (destiny pulls stronger)','analytical core meets ambitious destiny - inner pull in two directions.'),
(7,9,'Mulank 7 gives a analytical, spiritual, introspective core, Bhagyank 9 shapes a destiny of energetic, humanitarian, intense. These energies create productive friction.','Best-fit careers: research, analysis, spirituality, technology, academia. Destiny pulls also toward defense, sports, social work, surgery, leadership of causes.','Wealth through bold action and leadership. Income can be irregular but large.','Intense and protective. Bhagyank 9 adds need for depth and meaning.','Researcher/strategist type.','Balance analytical with energetic. Serve others to fulfill destiny.','Isolation and overthinking. analytical core meets energetic destiny - inner pull in two directions.',4,'Bhagyank (destiny pulls stronger)','analytical core meets energetic destiny - inner pull in two directions.'),
(8,1,'Mulank 8 gives a ambitious, material, authoritative core, Bhagyank 1 shapes a destiny of independent, pioneering, authoritative. These energies create productive friction.','Best-fit careers: business, finance, real estate, law, authority roles. Destiny pulls also toward leadership, entrepreneurship, government, management.','Wealth through bold action and leadership. Steady income.','Loyal, needs an equal who respects independence. Bhagyank 1 adds need for ambition in partner.','Natural founder/CEO energy.','Balance ambitious with independent. Develop independence and self-trust.','Rigidity and overwork. ambitious core meets independent destiny - inner pull in two directions.',4,'Bhagyank (destiny pulls stronger)','ambitious core meets independent destiny - inner pull in two directions.'),
(8,2,'Mulank 8 gives a ambitious, material, authoritative core, Bhagyank 2 shapes a destiny of sensitive, diplomatic, nurturing. These energies create productive friction.','Best-fit careers: business, finance, real estate, law, authority roles. Destiny pulls also toward counseling, HR, diplomacy, partnerships, hospitality.','Wealth through relationships and service. Steady income.','Loyal, needs an equal who respects independence. Bhagyank 2 adds need for harmony.','Natural founder/CEO energy.','Balance ambitious with sensitive. Develop independence and self-trust.','Rigidity and overwork. ambitious core meets sensitive destiny - inner pull in two directions.',4,'Mulank (core nature dominates)','ambitious core meets sensitive destiny - inner pull in two directions.'),
(8,3,'Mulank 8 gives a ambitious, material, authoritative core, Bhagyank 3 shapes a destiny of creative, expressive, optimistic. These energies create productive friction.','Best-fit careers: business, finance, real estate, law, authority roles. Destiny pulls also toward creative arts, teaching, writing, media, entertainment.','Wealth through creativity and communication. Income can be irregular but large.','Loyal, needs an equal who respects independence. Bhagyank 3 adds need for depth and meaning.','Natural founder/CEO energy.','Balance ambitious with creative. Use creative expression as destiny''s channel.','Rigidity and overwork. ambitious core meets creative destiny - inner pull in two directions.',4,'Mulank (core nature dominates)','ambitious core meets creative destiny - inner pull in two directions.'),
(8,4,'Mulank 8 gives a ambitious, material, authoritative core, Bhagyank 4 shapes a destiny of disciplined, practical, hardworking. These energies reinforce each other.','Best-fit careers: business, finance, real estate, law, authority roles. Destiny pulls also toward engineering, construction, systems, operations, administration.','Wealth through consistent effort and authority. Steady income.','Loyal, needs an equal who respects independence. Bhagyank 4 adds need for depth and meaning.','Natural founder/CEO energy.','Balance ambitious with disciplined. Embrace discipline to convert ideas to results.','Rigidity and overwork. Harmonious flow between core and destiny.',8,'Mulank (core nature dominates)','Harmonious flow between core and destiny.'),
(8,5,'Mulank 8 gives a ambitious, material, authoritative core, Bhagyank 5 shapes a destiny of adaptable, communicative, freedom-loving. These energies reinforce each other.','Best-fit careers: business, finance, real estate, law, authority roles. Destiny pulls also toward sales, marketing, communication, travel, media.','Wealth through creativity and communication. Income can be irregular but large.','Loyal, needs an equal who respects independence. Bhagyank 5 adds need for freedom within commitment.','Natural founder/CEO energy.','Balance ambitious with adaptable. Use creative expression as destiny''s channel.','Rigidity and overwork. Harmonious flow between core and destiny.',8,'Mulank (core nature dominates)','Harmonious flow between core and destiny.'),
(8,6,'Mulank 8 gives a ambitious, material, authoritative core, Bhagyank 6 shapes a destiny of caring, responsible, harmony-seeking. These energies reinforce each other.','Best-fit careers: business, finance, real estate, law, authority roles. Destiny pulls also toward healthcare, beauty, hospitality, education, design.','Wealth through relationships and service. Steady income.','Loyal, needs an equal who respects independence. Bhagyank 6 adds need for harmony.','Natural founder/CEO energy.','Balance ambitious with caring. Serve others to fulfill destiny.','Rigidity and overwork. Harmonious flow between core and destiny.',8,'Mulank (core nature dominates)','Harmonious flow between core and destiny.'),
(8,7,'Mulank 8 gives a ambitious, material, authoritative core, Bhagyank 7 shapes a destiny of analytical, spiritual, introspective. These energies create productive friction.','Best-fit careers: business, finance, real estate, law, authority roles. Destiny pulls also toward research, analysis, spirituality, technology, academia.','Wealth through bold action and leadership. Steady income.','Loyal, needs an equal who respects independence. Bhagyank 7 adds need for depth and meaning.','Natural founder/CEO energy.','Balance ambitious with analytical. Develop independence and self-trust.','Rigidity and overwork. ambitious core meets analytical destiny - inner pull in two directions.',4,'Mulank (core nature dominates)','ambitious core meets analytical destiny - inner pull in two directions.'),
(8,8,'Mulank 8 gives a ambitious, material, authoritative core, Bhagyank 8 shapes a destiny of ambitious, material, authoritative. These energies reinforce each other.','Best-fit careers: business, finance, real estate, law, authority roles. Destiny pulls also toward business, finance, real estate, law, authority roles.','Wealth through consistent effort and authority. Money may come with delays but lasts.','Loyal, needs an equal who respects independence. Bhagyank 8 adds need for ambition in partner.','Natural founder/CEO energy.','Balance ambitious with ambitious. Embrace discipline to convert ideas to results.','Rigidity and overwork. Harmonious flow between core and destiny.',7,'Mulank (core nature dominates)','Harmonious flow between core and destiny.'),
(8,9,'Mulank 8 gives a ambitious, material, authoritative core, Bhagyank 9 shapes a destiny of energetic, humanitarian, intense. These energies create productive friction.','Best-fit careers: business, finance, real estate, law, authority roles. Destiny pulls also toward defense, sports, social work, surgery, leadership of causes.','Wealth through bold action and leadership. Income can be irregular but large.','Loyal, needs an equal who respects independence. Bhagyank 9 adds need for depth and meaning.','Natural founder/CEO energy.','Balance ambitious with energetic. Serve others to fulfill destiny.','Rigidity and overwork. ambitious core meets energetic destiny - inner pull in two directions.',4,'Bhagyank (destiny pulls stronger)','ambitious core meets energetic destiny - inner pull in two directions.'),
(9,1,'Mulank 9 gives a energetic, humanitarian, intense core, Bhagyank 1 shapes a destiny of independent, pioneering, authoritative. These energies reinforce each other.','Best-fit careers: defense, sports, social work, surgery, leadership of causes. Destiny pulls also toward leadership, entrepreneurship, government, management.','Wealth through bold action and leadership. Steady income.','Intense and protective. Bhagyank 1 adds need for ambition in partner.','Driving force; channel the intensity.','Balance energetic with independent. Develop independence and self-trust.','Ego clashes and impatience. Harmonious flow between core and destiny.',8,'Bhagyank (destiny pulls stronger)','Harmonious flow between core and destiny.'),
(9,2,'Mulank 9 gives a energetic, humanitarian, intense core, Bhagyank 2 shapes a destiny of sensitive, diplomatic, nurturing. These energies create productive friction.','Best-fit careers: defense, sports, social work, surgery, leadership of causes. Destiny pulls also toward counseling, HR, diplomacy, partnerships, hospitality.','Wealth through relationships and service. Steady income.','Intense and protective. Bhagyank 2 adds need for harmony.','Driving force; channel the intensity.','Balance energetic with sensitive. Develop independence and self-trust.','Ego clashes and impatience. energetic core meets sensitive destiny - inner pull in two directions.',4,'Mulank (core nature dominates)','energetic core meets sensitive destiny - inner pull in two directions.'),
(9,3,'Mulank 9 gives a energetic, humanitarian, intense core, Bhagyank 3 shapes a destiny of creative, expressive, optimistic. These energies reinforce each other.','Best-fit careers: defense, sports, social work, surgery, leadership of causes. Destiny pulls also toward creative arts, teaching, writing, media, entertainment.','Wealth through creativity and communication. Income can be irregular but large.','Intense and protective. Bhagyank 3 adds need for depth and meaning.','Driving force; channel the intensity.','Balance energetic with creative. Use creative expression as destiny''s channel.','Ego clashes and impatience. Harmonious flow between core and destiny.',8,'Mulank (core nature dominates)','Harmonious flow between core and destiny.'),
(9,4,'Mulank 9 gives a energetic, humanitarian, intense core, Bhagyank 4 shapes a destiny of disciplined, practical, hardworking. These energies create productive friction.','Best-fit careers: defense, sports, social work, surgery, leadership of causes. Destiny pulls also toward engineering, construction, systems, operations, administration.','Wealth through consistent effort and authority. Steady income.','Intense and protective. Bhagyank 4 adds need for depth and meaning.','Driving force; channel the intensity.','Balance energetic with disciplined. Embrace discipline to convert ideas to results.','Ego clashes and impatience. energetic core meets disciplined destiny - inner pull in two directions.',4,'Mulank (core nature dominates)','energetic core meets disciplined destiny - inner pull in two directions.'),
(9,5,'Mulank 9 gives a energetic, humanitarian, intense core, Bhagyank 5 shapes a destiny of adaptable, communicative, freedom-loving. These energies create productive friction.','Best-fit careers: defense, sports, social work, surgery, leadership of causes. Destiny pulls also toward sales, marketing, communication, travel, media.','Wealth through creativity and communication. Income can be irregular but large.','Intense and protective. Bhagyank 5 adds need for freedom within commitment.','Driving force; channel the intensity.','Balance energetic with adaptable. Use creative expression as destiny''s channel.','Ego clashes and impatience. energetic core meets adaptable destiny - inner pull in two directions.',4,'Mulank (core nature dominates)','energetic core meets adaptable destiny - inner pull in two directions.'),
(9,6,'Mulank 9 gives a energetic, humanitarian, intense core, Bhagyank 6 shapes a destiny of caring, responsible, harmony-seeking. These energies reinforce each other.','Best-fit careers: defense, sports, social work, surgery, leadership of causes. Destiny pulls also toward healthcare, beauty, hospitality, education, design.','Wealth through relationships and service. Steady income.','Intense and protective. Bhagyank 6 adds need for harmony.','Driving force; channel the intensity.','Balance energetic with caring. Serve others to fulfill destiny.','Ego clashes and impatience. Harmonious flow between core and destiny.',8,'Mulank (core nature dominates)','Harmonious flow between core and destiny.'),
(9,7,'Mulank 9 gives a energetic, humanitarian, intense core, Bhagyank 7 shapes a destiny of analytical, spiritual, introspective. These energies create productive friction.','Best-fit careers: defense, sports, social work, surgery, leadership of causes. Destiny pulls also toward research, analysis, spirituality, technology, academia.','Wealth through bold action and leadership. Steady income.','Intense and protective. Bhagyank 7 adds need for depth and meaning.','Driving force; channel the intensity.','Balance energetic with analytical. Develop independence and self-trust.','Ego clashes and impatience. energetic core meets analytical destiny - inner pull in two directions.',4,'Mulank (core nature dominates)','energetic core meets analytical destiny - inner pull in two directions.'),
(9,8,'Mulank 9 gives a energetic, humanitarian, intense core, Bhagyank 8 shapes a destiny of ambitious, material, authoritative. These energies create productive friction.','Best-fit careers: defense, sports, social work, surgery, leadership of causes. Destiny pulls also toward business, finance, real estate, law, authority roles.','Wealth through consistent effort and authority. Money may come with delays but lasts.','Intense and protective. Bhagyank 8 adds need for ambition in partner.','Driving force; channel the intensity.','Balance energetic with ambitious. Embrace discipline to convert ideas to results.','Ego clashes and impatience. energetic core meets ambitious destiny - inner pull in two directions.',4,'Bhagyank (destiny pulls stronger)','energetic core meets ambitious destiny - inner pull in two directions.'),
(9,9,'Mulank 9 gives a energetic, humanitarian, intense core, Bhagyank 9 shapes a destiny of energetic, humanitarian, intense. These energies reinforce each other.','Best-fit careers: defense, sports, social work, surgery, leadership of causes. Destiny pulls also toward defense, sports, social work, surgery, leadership of causes.','Wealth through bold action and leadership. Income can be irregular but large.','Intense and protective. Bhagyank 9 adds need for depth and meaning.','Driving force; channel the intensity.','Balance energetic with energetic. Serve others to fulfill destiny.','Ego clashes and impatience. Harmonious flow between core and destiny.',7,'Mulank (core nature dominates)','Harmonious flow between core and destiny.')
ON CONFLICT (mulank, bhagyank) DO NOTHING;


-- =====================================================================
-- BUNDLED FILE: 19_media_and_roles.sql
-- =====================================================================

-- =====================================================================
-- 19_media_and_roles.sql
-- (A) Public "media" storage bucket — admin se report/homepage images upload
-- (B) OPTIONAL: super_admin + editor roles (future team access)
-- ADDITIVE. Run AFTER existing files. Project: kassdsugfktqptsxzqhr.
-- =====================================================================

-- =====================================================================
-- (A) MEDIA STORAGE BUCKET (public read, admin write)
-- =====================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- public read
DROP POLICY IF EXISTS "media public read" ON storage.objects;
CREATE POLICY "media public read" ON storage.objects
  FOR SELECT USING (bucket_id = 'media');

-- authenticated upload (admin panel)
DROP POLICY IF EXISTS "media auth upload" ON storage.objects;
CREATE POLICY "media auth upload" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'media');

-- authenticated update/delete
DROP POLICY IF EXISTS "media auth update" ON storage.objects;
CREATE POLICY "media auth update" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'media');

DROP POLICY IF EXISTS "media auth delete" ON storage.objects;
CREATE POLICY "media auth delete" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'media');

-- Also ensure blog-images bucket exists (used by BlogManager)
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "blog public read" ON storage.objects;
CREATE POLICY "blog public read" ON storage.objects
  FOR SELECT USING (bucket_id = 'blog-images');
DROP POLICY IF EXISTS "blog auth upload" ON storage.objects;
CREATE POLICY "blog auth upload" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'blog-images');


-- =====================================================================
-- (B) OPTIONAL: SUPER_ADMIN + EDITOR ROLES
-- Skip this section agar aap solo ho. Sirf tab chalao jab VA/staff
-- ko limited access dena ho.
--
-- app_role enum me naye values add karte hain (additive — purane safe).
-- =====================================================================

-- add enum values if not exist (safe — IF NOT EXISTS guards)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'super_admin'
    AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'app_role')) THEN
    ALTER TYPE public.app_role ADD VALUE 'super_admin';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'editor'
    AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'app_role')) THEN
    ALTER TYPE public.app_role ADD VALUE 'editor';
  END IF;
END $$;

-- is_admin() ko update karo: super_admin bhi admin counts
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
    AND role IN ('admin', 'super_admin')
  );
$$;

-- is_super_admin() — sabse high level (user role manage kar sake)
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS boolean LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'super_admin'
  );
$$;

-- is_editor() — content edit kar sake (blog, reports), par payments/users nahi
CREATE OR REPLACE FUNCTION public.is_editor()
RETURNS boolean LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
    AND role IN ('admin', 'super_admin', 'editor')
  );
$$;

-- =====================================================================
-- APNE AAP KO super_admin banao (APNA_EMAIL replace karo):
-- =====================================================================
-- INSERT INTO public.user_roles (id, user_id, role, created_at)
-- SELECT gen_random_uuid(), id, 'super_admin'::public.app_role, now()
-- FROM auth.users WHERE email = 'APNA_EMAIL'
-- ON CONFLICT DO NOTHING;

-- VA/staff ko editor banao:
-- INSERT INTO public.user_roles (id, user_id, role, created_at)
-- SELECT gen_random_uuid(), id, 'editor'::public.app_role, now()
-- FROM auth.users WHERE email = 'STAFF_EMAIL'
-- ON CONFLICT DO NOTHING;

-- =====================================================================
-- VERIFY:
-- SELECT enumlabel FROM pg_enum WHERE enumtypid =
--   (SELECT oid FROM pg_type WHERE typname='app_role');
-- (expect: admin, super_admin, editor — aur jo pehle the)
-- =====================================================================


-- =====================================================================
-- BUNDLED FILE: 20_nikb_migration.sql
-- =====================================================================

-- =====================================================================
-- 20_nikb_migration.sql — AnkJyotish AI Database Extensions
-- Additive updates to enrich profiles and introduce NIKB support tables.
-- Safe to rerun (idempotent).
-- =====================================================================

-- 1. Extend profiles table with profiling columns
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS dob date;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS birth_time text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS birth_place text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS gender text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS profession text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS industry text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS marital_status text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS life_stage text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS goals jsonb;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS pain_points text[];
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_business_owner boolean DEFAULT false;

-- 2. Create user_psychology table
CREATE TABLE IF NOT EXISTS public.user_psychology (
  user_id uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  personality_type text,
  leadership_style text,
  communication_style text,
  decision_style text,
  risk_level int CHECK (risk_level BETWEEN 1 AND 10),
  motivation_drivers text[],
  stress_triggers text[],
  calculated_at timestamptz DEFAULT now()
);

-- 3. Create user_life_events table
CREATE TABLE IF NOT EXISTS public.user_life_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  event_date date NOT NULL,
  notes text,
  numerology_year int,
  created_at timestamptz DEFAULT now()
);

-- 4. Create user_goals table
CREATE TABLE IF NOT EXISTS public.user_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  category text NOT NULL, -- career/business/relationship/financial/spiritual/health
  goal_text text NOT NULL,
  target_date date,
  status text DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
  progress_notes text,
  ai_recommendations jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 5. Create recommendations table
CREATE TABLE IF NOT EXISTS public.recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  report_key text NOT NULL,
  reason text NOT NULL,
  score float DEFAULT 0.0 CHECK (score BETWEEN 0.0 AND 1.0),
  shown_at timestamptz,
  clicked_at timestamptz,
  dismissed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- 6. Create ai_chat_history table
CREATE TABLE IF NOT EXISTS public.ai_chat_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  session_id text NOT NULL,
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  content text NOT NULL,
  numerology_context jsonb,
  created_at timestamptz DEFAULT now()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_chat_history_user_session ON public.ai_chat_history(user_id, session_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_user ON public.recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_life_events_user ON public.user_life_events(user_id);
CREATE INDEX IF NOT EXISTS idx_goals_user ON public.user_goals(user_id);

-- 7. Configure Row Level Security (RLS) policies and grants
DO $$
DECLARE
  t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'user_psychology', 'user_life_events', 'user_goals', 'recommendations', 'ai_chat_history'
  ] LOOP
    -- Enable RLS
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
    
    -- Drop old policies if they exist
    EXECUTE format('DROP POLICY IF EXISTS %I_select ON public.%I', t, t);
    EXECUTE format('DROP POLICY IF EXISTS %I_insert ON public.%I', t, t);
    EXECUTE format('DROP POLICY IF EXISTS %I_update ON public.%I', t, t);
    EXECUTE format('DROP POLICY IF EXISTS %I_delete ON public.%I', t, t);
    EXECUTE format('DROP POLICY IF EXISTS %I_admin ON public.%I', t, t);
    
    -- Create policies for owner access (based on user_id)
    IF t = 'user_psychology' THEN
      EXECUTE format('CREATE POLICY %I_select ON public.%I FOR SELECT USING (auth.uid() = user_id)', t, t);
      EXECUTE format('CREATE POLICY %I_insert ON public.%I FOR INSERT WITH CHECK (auth.uid() = user_id)', t, t);
      EXECUTE format('CREATE POLICY %I_update ON public.%I FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id)', t, t);
    ELSE
      EXECUTE format('CREATE POLICY %I_select ON public.%I FOR SELECT USING (auth.uid() = user_id)', t, t);
      EXECUTE format('CREATE POLICY %I_insert ON public.%I FOR INSERT WITH CHECK (auth.uid() = user_id)', t, t);
      EXECUTE format('CREATE POLICY %I_update ON public.%I FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id)', t, t);
      EXECUTE format('CREATE POLICY %I_delete ON public.%I FOR DELETE USING (auth.uid() = user_id)', t, t);
    END IF;
    
    -- Create admin policy
    EXECUTE format('CREATE POLICY %I_admin ON public.%I FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin())', t, t);
    
    -- Grants
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO authenticated', t);
    EXECUTE format('GRANT SELECT ON public.%I TO anon', t);
  END LOOP;
END $$;


-- =====================================================================
-- BUNDLED FILE: 21_nikb_seeds.sql
-- =====================================================================

-- =====================================================================
-- 21_nikb_seeds.sql — Idempotent Seeds for AnkJyotish AI
-- Seeds compound numbers 24-99, date intelligence, scoring rules, and archetypes.
-- =====================================================================

-- 1. SEED: Remaining Compound Numbers (24 to 99)
-- (Compounds 10 to 23 are seeded in 16_nikb_schemas.sql)
INSERT INTO public.nikb_compound_numbers (compound, root, trad_name, nature, core_meaning, career_impact, wealth_impact, relationship_impact, business_impact, overrides_single) VALUES
(24, 6, 'Love Money Creativity', 'highly_favorable', 'Triple blessing compound. Natural abundance in relationships, wealth, and domestic harmony. Venus energy is highly active.', 'Flourishes in design, luxury, hospitality, public relations, and arts.', 'Strong wealth accumulation. Money flows easily and is spent on comfort and aesthetics.', 'Deeply loving, magnetic, and protective partner. Favorable marriage.', 'Excellent for family businesses, customer-centric retail, and creative agencies.', false),
(25, 7, 'Strength Through Testing', 'mixed', 'Success earned through difficulty. Wisdom gained through trials and experience. Deep intuition.', 'Thrives in research, analysis, auditing, tech consulting, or teaching.', 'Slow but steady financial accumulation. Gains come from expertise, not speculation.', 'Slow to commit. Relationships grow stronger after weathering challenges.', 'Success in specialist services, consulting, or technical products.', false),
(26, 8, 'Partnership Warning', 'caution', 'Gains through partnership, but extreme risk of betrayal by partners or advisors. Discernment is required.', 'Best in administrative, advisory, or independent professional roles.', 'Wealth builds but faces leakage through bad investments or joint accounts.', 'Requires clear boundaries. Guard against giving power away to partners.', 'Avoid equal-partnership businesses. Keep majority control.', false),
(27, 9, 'The Scepter', 'favorable', 'Authority, command, and leadership. The scepter of command. Influence grows with age.', 'Government, military, corporate management, or social organization leadership.', 'Wealth through high position, command, and authority-related ventures.', 'Dominant but loyal partner. Demands respect and emotional honesty.', 'Excellent for large-scale enterprise, contracting, or policy-related operations.', false),
(28, 1, 'Success Against Odds', 'mixed', 'Triumph over early struggles. Loss through misplaced trust, but followed by recovery.', 'Independent consulting, project management, or leadership in troubled companies.', 'Financial setbacks from bad advice, but recovers via perseverance.', 'Loyal but must guard against trusting deceptive partners.', 'Good for solo ventures. Needs legal checks for all deals.', false),
(29, 2, 'Grace Under Treachery', 'caution', 'Brilliant intellect but surrounded by unreliable associates. High potential coupled with trust issues.', 'Research, defense, audit, security, or legal advisory.', 'Gains from specialized skills. High risk of financial depletion via third-party litigation.', 'Intense, sensitive, and cautious. Needs partners who value transparency.', 'Sole-proprietorship is recommended. Secure intellectual property.', false),
(30, 3, 'The Loner''s Gift', 'neutral', 'Self-contained creative genius. Exceptional talent, but requires deliberate focus to avoid isolation.', 'Writing, programming, research, creative arts, or solo consulting.', 'Wealth through specialized work. Indifferent to materialism, but attracts wealth.', 'Needs intellectual space. Compatible with independent partners.', 'Best for niche markets or high-value intellectual properties.', false),
(31, 4, 'The Hermit', 'mixed', 'Logical mind driven by a search for structure. Works best alone. Misunderstood by peers.', 'Engineering, database management, research, or writing.', 'Steady earnings through hard work. Conservative investor.', 'Private and reserved. Prefers quiet companionship over social buzz.', 'Structured systems and operations consulting.', false),
(32, 5, 'Communication Star', 'favorable', 'Gift of persuasion, public speaking, and writing. Magnetic communicator.', 'Media, sales, marketing, writing, diplomacy, or teaching.', 'Wealth through ideas, deals, and communication platforms.', 'Fun-loving, expressive, and social. Easy connections.', 'Excellent for digital media, retail, travel, or brokerage.', false),
(33, 6, 'Master Teacher', 'master', 'Teaching, guidance, and spiritual growth. The master teacher energy.', 'Education, coaching, counseling, human resources, or creative leadership.', 'Abundance through sharing knowledge and community services.', 'Extremely nurturing, protective, and family-oriented.', 'Consulting, coaching, or value-driven training businesses.', true),
(34, 7, 'Spiritual Power', 'favorable', 'Ancient wisdom combined with modern analytical skills. Great intuition.', 'Healing, counseling, psychology, analytics, or philosophy.', 'Financial comfort through advisory or expert consultation.', 'Deep and private. Relationships are treated as spiritual paths.', 'Niche counseling, wellness, or research entities.', false),
(35, 8, 'Business Acumen', 'favorable', 'Sharp financial intelligence and practical leadership. Unstoppable executor.', 'Finance, banking, corporate operations, law, or investments.', 'Significant wealth building. Strong investment sense.', 'Practical and stable partner. Expresses love through security.', 'Excellent for investment firms, operations, and logistics.', false),
(36, 9, 'Wisdom Achieved', 'favorable', 'Knowledge transformed into wisdom. Highly respected leader.', 'Administration, publishing, corporate coaching, or community services.', 'Consistent wealth from legacy works and leadership roles.', 'Loyal, protective, and demands growth from the relationship.', 'Legacy brands, publishing houses, and educational institutes.', false),
(37, 1, 'Success in Partnership', 'favorable', 'Favorable collaboration. Love and business both prosper when shared.', 'Partnerships, sales coordination, joint ventures, or corporate management.', 'Wealth through synergy and cooperative investments.', 'Harmonious relationship. High compatibility.', 'Ideal for multi-founder startups and cooperative ventures.', false),
(38, 2, 'Disruption', 'mixed', 'Revolutionary energy. Challenges established authority. Can alienate if unbalanced.', 'Innovation, activism, research, design, or specialized coaching.', 'Fluctuating wealth. Earnings come from unexpected sources.', 'Intense but unpredictable. Requires independent partners.', 'Disruptive technology or modern creative agency.', false),
(39, 3, 'Fame Seeker', 'mixed', 'Desires public recognition. Achieves prominence but at personal cost.', 'Entertainment, politics, writing, or brand representation.', 'Income from public visibility. High lifestyle expenses.', 'Social and expressive. Must balance public life with domestic peace.', 'Personal brand ventures, PR agencies, or talent management.', false),
(40, 4, 'The Truth Seeker', 'mixed', 'Focus on details, research, and analysis. Practical builder.', 'Research, analytics, technology, programming, or forensics.', 'Gains from specialized intellectual products and systems.', 'Loyal, practical, and values clear agreements.', 'Data audit, security systems, or custom programming.', false),
(41, 5, 'Unstoppable Will', 'favorable', 'Fixed purpose and intense focus. Achieves target goals without distraction.', 'Sales, business development, competitive sports, or executive execution.', 'High income from target achievement and business development.', 'Focused and direct. Clear communicator.', 'Product sales, business brokerage, or goal-driven coaching.', false),
(42, 6, 'The Architect', 'favorable', 'Methodical planning. Structured approach to relationships and finance.', 'Real estate planning, corporate structure, accounting, or architecture.', 'Steady wealth building through investments in property and assets.', 'Reliable, family-oriented, and structures domestic life.', 'Real estate agencies, project management, or architecture.', false),
(43, 7, 'Revolution', 'mixed', 'Breaks outdated structures. Pioneer of new ideas. Controversial figure.', 'Modern research, alternative wellness, consulting, or tech startups.', 'Gains from unique ventures. High risk of volatility.', 'Independent and needs space. Attracted to unique thinkers.', 'Innovative consulting or creative design.', false),
(44, 8, 'Master Healer', 'master', 'Healing at structural or societal level. High responsibility.', 'Healthcare administration, social work, systemic healing, or public health.', 'Gains through service to society. Money is a resource, not a goal.', 'Loyal, empathetic, but carries work stress home.', 'Healthcare, organic products, or social impact enterprises.', true),
(45, 9, 'The Sage', 'favorable', 'Quiet authority, advisory, and spiritual intelligence.', 'Corporate advisory, education administration, counseling, or writing.', 'Steady income through wisdom sharing and mentorship.', 'Nurturing, wise, and values quiet domestic peace.', 'Consulting services, schools, and legacy publishing.', false),
(46, 1, 'Fame Through Service', 'favorable', 'Recognition comes from helping others. Solar leadership.', 'Social enterprise, hospitality, coaching, or corporate management.', 'Abundance from service-oriented businesses.', 'Loyal, warm, and seeks community connection.', 'Customer-first service brands, coaching, or health services.', false),
(47, 2, 'The Protector', 'favorable', 'Guardian energy. Protects the family and the vulnerable.', 'Defense, administration, law, social work, or counseling.', 'Steady savings. Good guardian of financial resources.', 'Deeply protective, devoted, and supportive.', 'Nurturing, security, or child-care services.', false),
(48, 3, 'Scattered Power', 'mixed', 'Great intelligence but lacks focus. Must anchor to avoid wasted talent.', 'Freelancing, creative production, or general consulting.', 'Irregular income waves. Retaining wealth requires automation.', 'Expressive and friendly. Tends to scatter relationship energy.', 'Niche consulting with operations partner.', false),
(49, 4, 'Completion', 'transformative', 'End of a major lifecycle. Rebirth and transformation.', 'Transitional leadership, restructuring, counseling, or writing.', 'Income shifts. Builds wealth after major life changes.', 'Deep, transformative relationships. Outgrown circles are released.', 'Pivoting consulting or corporate restructuring.', false),
(50, 5, 'The Transformer', 'powerful', 'Old habits die for new potential to arise. Rapid growth.', 'Technology innovation, restructuring, sales, or business pivoting.', 'Wealth through adaptive commercial initiatives.', 'Communicative and adaptive. Attracts change.', 'High-growth startups, dynamic marketing, or pivoting systems.', false),
(51, 6, 'The Warrior', 'caution', 'Advances aggressively. Creates opponents if unchecked.', 'Defense, active business development, law, or competitive fields.', 'Income from execution. Risk of litigation losses.', 'Assertive and direct. Tends to dominate.', 'Security services, contracting, or litigation services.', false),
(52, 7, 'The Sensitive', 'mixed', 'Highly intuitive but emotionally reactive. Needs grounding.', 'Research, counselor, alternative wellness, or writing.', 'Gains through advice. Volatile financial patterns.', 'Empathetic but needs boundaries to avoid emotional drain.', 'Wellness services, counseling, or creative writing.', false)
ON CONFLICT (compound) DO NOTHING;

-- Populate remaining compound numbers 53-99 programmatically using default templates based on root and digits
DO $$
DECLARE
  c int;
  r int;
  t_name text;
  nat text;
  meaning text;
BEGIN
  FOR c IN 53..99 LOOP
    -- Compute root digit
    r := c;
    LOOP
      EXIT WHEN r < 10;
      r := (r % 10) + (r / 10);
    END LOOP;
    
    nat := CASE 
      WHEN r IN (1, 3, 5, 6) THEN 'favorable'
      WHEN r IN (2, 7, 9) THEN 'mixed'
      ELSE 'caution'
    END;
    
    t_name := 'Vibe Compound ' || c::text;
    meaning := format('A compound number %s reducing to root %s. Combines leading digit %s with supporting digit %s to drive manifestation.', c, r, c/10, c%10);
    
    INSERT INTO public.nikb_compound_numbers (compound, root, trad_name, nature, core_meaning, career_impact, wealth_impact, relationship_impact, business_impact, overrides_single)
    VALUES (
      c, r, t_name, nat, meaning,
      'Best in independent or expert consulting roles.',
      'Steady accumulation via disciplined savings.',
      'Loyal, values communication and clear boundaries.',
      'Favorable for specialized niche operations.',
      false
    ) ON CONFLICT (compound) DO NOTHING;
  END LOOP;
END $$;

-- 2. SEED: Date Intelligence Profiles (1 to 31)
CREATE TABLE IF NOT EXISTS public.nikb_date_profiles (
  birth_date int PRIMARY KEY CHECK (birth_date BETWEEN 1 AND 31),
  date_name text NOT NULL,
  core_vibe text NOT NULL,
  strengths text[],
  challenges text[],
  remedy text,
  language text DEFAULT 'hinglish'
);

ALTER TABLE public.nikb_date_profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS date_profiles_read ON public.nikb_date_profiles;
CREATE POLICY date_profiles_read ON public.nikb_date_profiles FOR SELECT USING (true);
GRANT SELECT ON public.nikb_date_profiles TO anon, authenticated;

INSERT INTO public.nikb_date_profiles (birth_date, date_name, core_vibe, strengths, challenges, remedy) VALUES
(1, 'Pure Pioneer', 'Original self-starter. Independent, solar energy.', ARRAY['Leadership', 'Pioneering vision', 'Confidence'], ARRAY['Impatience', 'Ego clashes'], 'Wear ruby/red on Sundays. Practice delegation.'),
(2, 'Sensitive Partner', 'Cooperative moon energy. Natural mediator.', ARRAY['Empathy', 'Diplomacy', 'Intuition'], ARRAY['Over-sensitivity', 'Indecision'], 'Chant Chandra mantras. Keep silver coin.'),
(3, 'Creative Educator', 'Expressive Jupiter energy. Joyful communicator.', ARRAY['Creativity', 'Teaching', 'Optimism'], ARRAY['Scattered focus', 'Exaggeration'], 'Donate yellow items on Thursdays. Write daily.'),
(4, 'Methodical Builder', 'Structured Rahu energy. Practical worker.', ARRAY['Reliability', 'Discipline', 'Planning'], ARRAY['Rigidity', 'Stubbornness'], 'Feed birds. Avoid shortcuts.'),
(5, 'Free Communicator', 'Mercury energy. Adventurous seller.', ARRAY['Adaptability', 'Sales charm', 'Networking'], ARRAY['Restlessness', 'Commitment phobia'], 'Wear green. Walk barefoot on green grass.'),
(6, 'Nurturer', 'Venus energy. Domestic protector.', ARRAY['Caring', 'Artistic sense', 'Loyalty'], ARRAY['Martyrdom complex', 'Control tendencies'], 'Apply white sandalwood perfume. Worship Venus.'),
(7, 'Spiritual Researcher', 'Ketu energy. Deep introspective thinker.', ARRAY['Analytical mind', 'Intuition', 'Original research'], ARRAY['Social isolation', 'Overthinking'], 'Meditate in quiet places. Keep dog as pet/feed dogs.'),
(8, 'Enduring Executor', 'Saturn energy. Unstoppable builder.', ARRAY['Persistency', 'Wealth administration', 'Focus'], ARRAY['Delay frustration', 'Appearing cold'], 'Help under-privileged. Donate mustard oil on Saturdays.'),
(9, 'Humanitarian Warrior', 'Mars energy. Intense challenger.', ARRAY['Courage', 'Generosity', 'Willpower'], ARRAY['Rage spikes', 'Burnt bridges'], 'Practice yoga/breathing exercises. Donate red lentils.'),
(10, 'Wheel Seeker', 'Solar power combined with cyclic progress.', ARRAY['Resilience', 'Resourcefulness'], ARRAY['Waves of luck'], 'Build emergency funds during peaks.'),
(11, 'Intuitive Visionary', 'Master number 11. Spiritual messenger.', ARRAY['High intuition', 'Empathy'], ARRAY['Anxiety', 'Self-doubt'], 'Journal insights. Focus on purpose alignment.'),
(12, 'Sacrificed Talent', 'Expressive block needing mindset adjustments.', ARRAY['Creativity', 'Empathy'], ARRAY['Self-sabotage', 'Anxiety'], 'Release imaginary cages. Practice positive self-talk.'),
(13, 'Karmic Builder', 'Shortcut warning. Discipline is mandatory.', ARRAY['Diligence', 'Execution'], ARRAY['Friction with authority'], 'Avoid shortcuts. Accept steady building.'),
(14, 'Freedom Disciple', 'Discipline within variety. Magnetic sales.', ARRAY['Adaptability', 'Charisma'], ARRAY['Addiction risk', 'Scatter'], 'Choose one lane deeply. Automate savings.'),
(15, 'Magnetic Magician', 'Abundance attractor. Manifestation giant.', ARRAY['Charisma', 'Magnetism'], ARRAY['Negative focus danger'], 'Practice gratitude journal. Surround with positive vibes.'),
(16, 'Tower Survivor', 'Ego-dissolution leading to massive spiritual awakening.', ARRAY['Surrender wisdom', 'Spiritual power'], ARRAY['Shocking reversals'], 'Serve others selflessly. Guard against pride.'),
(17, 'Star Legacy', 'Enduring works that outlast the creator.', ARRAY['Legacy planning', 'Grounded success'], ARRAY['Late recognition'], 'Real estate or long-term investments.'),
(18, 'Chapter Splitter', 'War between material aspirations and inner peace.', ARRAY['Multi-industry talent', 'Intensity'], ARRAY['Mood shifts'], 'Bridge material wealth with wellness/charity.'),
(19, 'Royal Comeback', 'Earned protection. Falls and rises stronger.', ARRAY['Royalty protection', 'Comeback drive'], ARRAY['Fear of asking help'], 'Practice vulnerability. Support others.'),
(20, 'Transformed Life', 'Before/after milestone shape this psychic 2.', ARRAY['Awakening vision', 'Empathy'], ARRAY['Crisis vulnerability'], 'Trust transition phases. Connect to spirituality.'),
(21, 'Fortunate Creator', 'Charismatic Jupiter blessing. Natural luck.', ARRAY['Public favor', 'Creativity'], ARRAY['Losing focus'], 'Set deliberate goals. Avoid complacency.'),
(22, 'Master Builder', 'Enduring global architect. Anxious potential.', ARRAY['Scale planning', 'Practicality'], ARRAY['Self-pressure'], 'Build structured organizations. Focus on legacy.'),
(23, 'Royal Lion', 'Considered the luckiest birthday. Patronage.', ARRAY['Authority support', 'Communication'], ARRAY['Arrogance risk'], 'Seek high mentorship. Express gratitude.'),
(24, 'Domestic Blessing', 'Harmony and wealth. Venus favorite.', ARRAY['Wealth attraction', 'Relationship bliss'], ARRAY['Over-spending'], 'Invest in assets, not just luxury.'),
(25, 'Tested Wisdom', 'Success earned through research and trials.', ARRAY['Expertise', 'Intuition'], ARRAY['Slow starts'], 'Stay patient. Monetize research.'),
(26, 'Partner Evaluator', 'Gains and leakage. Boundary maker.', ARRAY['Networking', 'Loyalty'], ARRAY['Blind trust losses'], 'Audit partners. Keep legal documentation clear.'),
(27, 'Scepter Ruler', 'Late authority. Natural commander.', ARRAY['Organization command', 'Command'], ARRAY['Rigidity'], 'Empower team members. Exercise delegation.'),
(28, 'Triumphant Mind', 'Triumph over early struggles.', ARRAY['Determination', 'Pioneering spirit'], ARRAY['Trust losses'], 'Keep business details confidential.'),
(29, 'Crying Genius', 'Surrounded by variables. Intellect check.', ARRAY['Intellect', 'Intuition'], ARRAY['Deception exposure'], 'Select colleagues carefully. Verify deals.'),
(30, 'Amplified Creator', 'Void amplifier. Pure talent or pure blocks.', ARRAY['Artistic genius', 'Independence'], ARRAY['Void phases'], 'Adopt consistent routines. Paint or write.'),
(31, 'Hermit Planner', 'Jupiter + Sun structure. Misunderstood.', ARRAY['Inventiveness', 'Grounding'], ARRAY['Isolation tendencies'], 'Engage in collaborative team projects.')
ON CONFLICT (birth_date) DO NOTHING;

-- 3. SEED: Admin Weight Configs
CREATE TABLE IF NOT EXISTS public.nikb_weight_configs (
  factor text PRIMARY KEY,
  weight float NOT NULL CHECK (weight BETWEEN 0.0 AND 1.0),
  description text,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.nikb_weight_configs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS weight_configs_read ON public.nikb_weight_configs;
CREATE POLICY weight_configs_read ON public.nikb_weight_configs FOR SELECT USING (true);
GRANT SELECT ON public.nikb_weight_configs TO anon, authenticated;

INSERT INTO public.nikb_weight_configs (factor, weight, description) VALUES
('bhagyank', 0.30, 'Destiny path weight - dominates career & timelines'),
('mulank', 0.25, 'Core personality & psychic drive weight'),
('naamank', 0.15, 'Name vibration influence'),
('compound_date', 0.15, 'Birth day compound influence'),
('loshu_arrows', 0.10, 'Lo Shu grid arrows balance'),
('personal_year', 0.05, 'Personal year cycle modifier')
ON CONFLICT (factor) DO UPDATE SET weight = EXCLUDED.weight;

-- 4. SEED: Seeding Confidence Scoring Rules
INSERT INTO public.nikb_confidence_rules (rule_id, data_present, confidence_level, statement_template, hedge_language) VALUES
('full_profile', ARRAY['dob', 'full_name', 'goals', 'profession'], 'high', 'Based on your Life Path {lifePath}, Destiny {destiny}, and goals in {profession}, this recommendation has high confidence.', 'Insights are general due to missing details.'),
('partial_profile', ARRAY['dob', 'full_name'], 'medium', 'Based on your birth numbers {lifePath} and {destiny}, this reading has medium confidence. Complete goals for deeper insight.', 'Add your profession or goals in settings to refine accuracy.'),
('minimal_profile', ARRAY['dob'], 'low', 'Based solely on your birth date, this is a basic snapshot with low confidence.', 'Add your full birth name and goals for a complete personalized reading.')
ON CONFLICT (rule_id) DO NOTHING;


-- =====================================================================
-- BUNDLED FILE: 22_reflection_trust_engine.sql
-- =====================================================================

-- =====================================================================
-- 22_reflection_trust_engine.sql — Past Reflection & Trust Engine Extensions
-- Additive updates to support feedback, daily check-ins, timeline ratings.
-- Safe to rerun (idempotent).
-- =====================================================================

-- 1. Extend profiles table with completeness_score
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS completeness_score int DEFAULT 0 CHECK (completeness_score BETWEEN 0 AND 100);

-- 2. Create user_reflections table
CREATE TABLE IF NOT EXISTS public.user_reflections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  reflection_text text NOT NULL,
  age_range text,
  time_period text,
  accuracy_rating text CHECK (accuracy_rating IN ('very_accurate', 'mostly_accurate', 'partially_accurate', 'not_accurate')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT unique_user_reflection UNIQUE (user_id, age_range, time_period)
);

-- 3. Create user_feedback table
CREATE TABLE IF NOT EXISTS public.user_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  feedback_type text NOT NULL CHECK (feedback_type IN ('reflection', 'report', 'recommendation')),
  target_id uuid, -- Reference to target row UUID
  rating text NOT NULL,
  comment text,
  created_at timestamptz DEFAULT now()
);

-- 4. Create daily_checkins table
CREATE TABLE IF NOT EXISTS public.daily_checkins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  mood text NOT NULL CHECK (mood IN ('great', 'good', 'neutral', 'stressed')),
  focus_area text NOT NULL CHECK (focus_area IN ('career', 'business', 'love', 'money', 'health', 'family')),
  created_at timestamptz DEFAULT now()
);

-- 5. Create adaptive_questions table
CREATE TABLE IF NOT EXISTS public.adaptive_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  question_text text NOT NULL,
  category text NOT NULL CHECK (category IN ('career', 'relationships', 'finance', 'education', 'lifestyle')),
  answer_text text,
  answered_at timestamptz,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT unique_user_question UNIQUE (user_id, question_text)
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_reflections_user ON public.user_reflections(user_id);
CREATE INDEX IF NOT EXISTS idx_user_feedback_user ON public.user_feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_checkins_user ON public.daily_checkins(user_id);
CREATE INDEX IF NOT EXISTS idx_adaptive_questions_user ON public.adaptive_questions(user_id);

-- 6. Configure Row Level Security (RLS) policies and grants
DO $$
DECLARE
  t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'user_reflections', 'user_feedback', 'daily_checkins', 'adaptive_questions'
  ] LOOP
    -- Enable RLS
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
    
    -- Drop old policies if they exist
    EXECUTE format('DROP POLICY IF EXISTS %I_select ON public.%I', t, t);
    EXECUTE format('DROP POLICY IF EXISTS %I_insert ON public.%I', t, t);
    EXECUTE format('DROP POLICY IF EXISTS %I_update ON public.%I', t, t);
    EXECUTE format('DROP POLICY IF EXISTS %I_delete ON public.%I', t, t);
    EXECUTE format('DROP POLICY IF EXISTS %I_admin ON public.%I', t, t);
    
    -- Create policies for owner access (based on user_id)
    EXECUTE format('CREATE POLICY %I_select ON public.%I FOR SELECT USING (auth.uid() = user_id)', t, t);
    EXECUTE format('CREATE POLICY %I_insert ON public.%I FOR INSERT WITH CHECK (auth.uid() = user_id)', t, t);
    EXECUTE format('CREATE POLICY %I_update ON public.%I FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id)', t, t);
    EXECUTE format('CREATE POLICY %I_delete ON public.%I FOR DELETE USING (auth.uid() = user_id)', t, t);
    
    -- Create admin policy
    EXECUTE format('CREATE POLICY %I_admin ON public.%I FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin())', t, t);
    
    -- Grants
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO authenticated', t);
    EXECUTE format('GRANT SELECT ON public.%I TO anon', t);
  END LOOP;
END $$;


-- =====================================================================
-- BUNDLED FILE: 23_upgrade_paths_and_vibration_expansion.sql
-- =====================================================================

-- =====================================================================
-- 23_upgrade_paths_and_vibration_expansion.sql — Upgrade Paths & Vibration Seeds
-- Additive updates to support pricing upgrade flows.
-- Safe to rerun (idempotent).
-- =====================================================================

-- 1. Create upgrade_paths table
CREATE TABLE IF NOT EXISTS public.upgrade_paths (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_tier text NOT NULL,
  to_tier text NOT NULL,
  enabled boolean DEFAULT true,
  override_price numeric,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT unique_upgrade_path UNIQUE (from_tier, to_tier)
);

-- 2. Configure Row Level Security (RLS) policies and grants
ALTER TABLE public.upgrade_paths ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS upgrade_paths_read ON public.upgrade_paths;
CREATE POLICY upgrade_paths_read ON public.upgrade_paths FOR SELECT USING (true);

DROP POLICY IF EXISTS upgrade_paths_admin ON public.upgrade_paths;
CREATE POLICY upgrade_paths_admin ON public.upgrade_paths FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

GRANT SELECT ON public.upgrade_paths TO anon, authenticated;
GRANT ALL ON public.upgrade_paths TO service_role;

-- Ensure unique constraint exists even if table was created previously without it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE constraint_name = 'unique_upgrade_path' 
          AND table_name = 'upgrade_paths'
          AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.upgrade_paths ADD CONSTRAINT unique_upgrade_path UNIQUE (from_tier, to_tier);
    END IF;
END $$;

-- 3. Seed default upgrade configurations
INSERT INTO public.upgrade_paths (from_tier, to_tier, override_price) VALUES
('starter', 'pro', 599),
('starter', 'master', 999),
('pro', 'master', 999)
ON CONFLICT ON CONSTRAINT unique_upgrade_path DO UPDATE
SET override_price = EXCLUDED.override_price, enabled = EXCLUDED.enabled;


