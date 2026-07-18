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
