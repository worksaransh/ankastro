-- =====================================================================
-- 25_remedies.sql / 20260623090000_create_remedies_table.sql
-- Creates the remedies table and seeds it with the initial 9 numbers' remedies.
-- Safe to rerun (idempotent).
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.remedies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  number int UNIQUE NOT NULL CHECK (number BETWEEN 1 AND 9),
  planet_en text NOT NULL,
  planet_hi text,
  color_en text NOT NULL,
  color_hi text,
  day_en text NOT NULL,
  day_hi text,
  gemstone_en text NOT NULL,
  gemstone_hi text,
  mantra text NOT NULL,
  remedies_en text[] NOT NULL,
  remedies_hi text[] NOT NULL,
  remedies_hinglish text[] NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.remedies ENABLE ROW LEVEL SECURITY;

-- Select policy
DROP POLICY IF EXISTS "remedies_read" ON public.remedies;
CREATE POLICY "remedies_read" ON public.remedies FOR SELECT USING (true);

-- Admin write policy
DROP POLICY IF EXISTS "remedies_admin" ON public.remedies;
CREATE POLICY "remedies_admin" ON public.remedies FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Grants
GRANT SELECT ON public.remedies TO anon, authenticated;
GRANT ALL ON public.remedies TO service_role;

-- Seed initial data
INSERT INTO public.remedies (number, planet_en, planet_hi, color_en, color_hi, day_en, day_hi, gemstone_en, gemstone_hi, mantra, remedies_en, remedies_hi, remedies_hinglish) VALUES
(1, 'Sun (Surya)', 'सूर्य', 'Gold / Orange', 'सुनहरा / नारंगी', 'Sunday', 'रविवार', 'Ruby', 'माणिक', 'Om Suryaya Namah', 
 ARRAY['Offer water to the rising Sun each morning', 'Wear gold or copper', 'Donate wheat or jaggery on Sundays', 'Respect your father and elders'],
 ARRAY['रोज़ सुबह उगते सूर्य को जल अर्पित करें', 'सोना या तांबा पहनें', 'रविवार को गेहूँ या गुड़ दान करें', 'पिता और बड़ों का सम्मान करें'],
 ARRAY['Roz subah ugte Surya ko jal arpit karo', 'Sona ya tamba pehno', 'Sunday ko gehoon ya gud daan karo', 'Pita aur elders ka respect karo']),

(2, 'Moon (Chandra)', 'चंद्र', 'White / Silver', 'सफ़ेद / चाँदी', 'Monday', 'सोमवार', 'Pearl', 'मोती', 'Om Chandraya Namah', 
 ARRAY['Keep water in a silver glass by your bed', 'Wear white on Mondays', 'Donate milk or rice', 'Respect your mother; stay calm'],
 ARRAY['बिस्तर के पास चाँदी के गिलास में जल रखें', 'सोमवार को सफ़ेद पहनें', 'दूध या चावल दान करें', 'माँ का सम्मान करें; शांत रहें'],
 ARRAY['Bed ke paas silver glass mein paani rakho', 'Monday ko white pehno', 'Doodh ya chawal daan karo', 'Maa ka respect karo; calm raho']),

(3, 'Jupiter (Guru)', 'गुरु (बृहस्पति)', 'Yellow', 'पीला', 'Thursday', 'गुरुवार', 'Yellow Sapphire', 'पुखराज', 'Om Gurave Namah', 
 ARRAY['Wear yellow on Thursdays', 'Donate turmeric, gram dal or bananas', 'Respect teachers and gurus', 'Apply a saffron/turmeric tilak'],
 ARRAY['गुरुवार को पीला पहनें', 'हल्दी, चना दाल या केला दान करें', 'गुरु-शिक्षकों का सम्मान करें', 'केसर/हल्दी का तिलक लगाएँ'],
 ARRAY['Thursday ko yellow pehno', 'Haldi, chana dal ya kele daan karo', 'Teachers aur gurus ka respect karo', 'Kesar/haldi ka tilak lagao']),

(4, 'Rahu', 'राहू', 'Grey / Blue', 'धूसर / नीला', 'Saturday', 'शनिवार', 'Hessonite (Gomed)', 'गोमेद', 'Om Rahave Namah', 
 ARRAY['Keep a square piece of silver with you', 'Donate black/brown items, mustard oil', 'Feed stray dogs', 'Avoid shortcuts and dishonesty'],
 ARRAY['चाँदी का चौकोर टुकड़ा साथ रखें', 'काले/भूरे सामान, सरसों तेल दान करें', 'आवारा कुत्तों को खिलाएँ', 'शॉर्टकट और बेईमानी से बचें'],
 ARRAY['Silver ka square piece saath rakho', 'Kaale/brown saamaan, sarson tel daan karo', 'Stray dogs ko khilao', 'Shortcuts aur beimani se bacho']),

(5, 'Mercury (Budh)', 'बुध', 'Green', 'हरा', 'Wednesday', 'बुधवार', 'Emerald', 'पन्ना', 'Om Budhaya Namah', 
 ARRAY['Wear green on Wednesdays', 'Donate green moong dal', 'Feed green grass to cows', 'Keep a tulsi plant at home'],
 ARRAY['बुधवार को हरा पहनें', 'हरी मूंग दाल दान करें', 'गाय को हरी घास खिलाएँ', 'घर में तुलसी का पौधा रखें'],
 ARRAY['Wednesday ko green pehno', 'Hari moong dal daan karo', 'Gaay ko hari ghaas khilao', 'Ghar mein tulsi ka paudha rakho']),

(6, 'Venus (Shukra)', 'शुक्र', 'White / Pink', 'सफ़ेद / गुलाबी', 'Friday', 'शुक्रवार', 'Diamond / Opal', 'हीरा / ओपल', 'Om Shukraya Namah', 
 ARRAY['Wear white or pastel on Fridays', 'Donate white sweets, curd or perfume', 'Keep your home beautiful and clean', 'Respect women'],
 ARRAY['शुक्रवार को सफ़ेद या हल्के रंग पहनें', 'सफ़ेद मिठाई, दही या इत्र दान करें', 'घर सुंदर और स्वच्छ रखें', 'महिलाओं का सम्मान करें'],
 ARRAY['Friday ko white ya pastel pehno', 'White sweets, dahi ya perfume daan karo', 'Ghar sundar aur clean rakho', 'Mahilaon ka respect karo']),

(7, 'Ketu', 'केतु', 'Smoky / Grey', 'धुएँ जैसा / धूसर', 'Saturday', 'शनिवार', 'Cat''s Eye (Lehsunia)', 'लहसुनिया', 'Om Ketave Namah', 
 ARRAY['Meditate daily; keep a spiritual practice', 'Donate to or feed dogs', 'Keep a fast on Saturdays if comfortable', 'Avoid intoxicants'],
 ARRAY['रोज़ ध्यान करें; आध्यात्मिक अभ्यास रखें', 'कुत्तों को दान/भोजन दें', 'सुविधानुसार शनिवार व्रत रखें', 'नशे से बचें'],
 ARRAY['Roz meditate karo; spiritual practice rakho', 'Dogs ko daan/khaana do', 'Comfortable ho to Saturday vrat rakho', 'Intoxicants se bacho']),

(8, 'Saturn (Shani)', 'शनि', 'Black / Dark Blue', 'काला / गहरा नीला', 'Saturday', 'शनिवार', 'Blue Sapphire (Neelam)', 'नीलम', 'Om Shanaye Namah', 
 ARRAY['Light a mustard-oil lamp on Saturdays', 'Donate black sesame, iron, or black cloth', 'Serve labourers and the underprivileged', 'Be patient and honest in work'],
 ARRAY['शनिवार को सरसों तेल का दीपक जलाएँ', 'काले तिल, लोहा या काला वस्त्र दान करें', 'मज़दूरों और वंचितों की सेवा करें', 'काम में धैर्य और ईमानदारी रखें'],
 ARRAY['Saturday ko sarson tel ka deepak jalao', 'Kaale til, loha ya kaala kapda daan karo', 'Mazdooron aur underprivileged ki seva karo', 'Kaam mein patience aur honesty rakho']),

(9, 'Mars (Mangal)', 'मंगल', 'Red', 'लाल', 'Tuesday', 'मंगलवार', 'Red Coral (Moonga)', 'मूंगा', 'Om Mangalaya Namah', 
 ARRAY['Wear red on Tuesdays', 'Donate red lentils (masoor) or jaggery', 'Offer sindoor at a Hanuman temple', 'Channel anger into exercise/sport'],
 ARRAY['मंगलवार को लाल पहनें', 'मसूर दाल या गुड़ दान करें', 'हनुमान मंदिर में सिंदूर अर्पित करें', 'क्रोध को व्यायाम/खेल में लगाएँ'],
 ARRAY['Tuesday ko red pehno', 'Masoor dal ya gud daan karo', 'Hanuman mandir mein sindoor arpit karo', 'Gusse ko exercise/sport mein lagao'])
ON CONFLICT (number) DO UPDATE SET
  planet_en = EXCLUDED.planet_en,
  planet_hi = EXCLUDED.planet_hi,
  color_en = EXCLUDED.color_en,
  color_hi = EXCLUDED.color_hi,
  day_en = EXCLUDED.day_en,
  day_hi = EXCLUDED.day_hi,
  gemstone_en = EXCLUDED.gemstone_en,
  gemstone_hi = EXCLUDED.gemstone_hi,
  mantra = EXCLUDED.mantra,
  remedies_en = EXCLUDED.remedies_en,
  remedies_hi = EXCLUDED.remedies_hi,
  remedies_hinglish = EXCLUDED.remedies_hinglish;
