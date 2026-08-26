// Master Cosmic Database & Engine (AnkJyotishAI)
// Complete 3-Language (EN, HI, HINGLISH) Knowledge Base & Calculation Models
// Covering Pythagorean, Chaldean, Vedic Numerology, Lo Shu Grid, Applied Numbers,
// 9 Grahas, 12 Rashis, 12 Bhavas, 27 Nakshatras, Vimshottari Dashas, Yogas, Doshas, Karakas, Sade Sati & Angel Numbers.

export type Lang = 'en' | 'hi' | 'hinglish';

// ==========================================
// 1. HAR NUMBER KE ASSOCIATIONS (1 to 9)
// ==========================================
export interface NumberAssociation {
  number: number;
  planet: { en: string; hi: string; hinglish: string };
  deity: { en: string; hi: string; hinglish: string };
  nature: { en: string; hi: string; hinglish: string };
  element: { en: string; hi: string; hinglish: string };
  direction: { en: string; hi: string; hinglish: string };
  luckyColors: { en: string[]; hi: string[]; hinglish: string[] };
  gemstone: { en: string; hi: string; hinglish: string };
  luckyDays: { en: string[]; hi: string[]; hinglish: string[] };
  friendlyNumbers: number[];
  neutralNumbers: number[];
  enemyNumbers: number[];
  mantra: string;
  remedy: { en: string; hi: string; hinglish: string };
}

export const NUMBER_ASSOCIATIONS: Record<number, NumberAssociation> = {
  1: {
    number: 1,
    planet: { en: 'Sun (Surya)', hi: 'सूर्य', hinglish: 'Surya (Sun)' },
    deity: { en: 'Lord Shiva & Surya Dev', hi: 'भगवान शिव व सूर्य देव', hinglish: 'Lord Shiva & Surya Dev' },
    nature: { en: 'Leadership, Authority, Willpower, Creation', hi: 'नेतृत्व, अधिकार, आत्मबल, तेज', hinglish: 'Leadership, Authority, Atma-bal' },
    element: { en: 'Fire (Agni)', hi: 'अग्नि', hinglish: 'Agni (Fire)' },
    direction: { en: 'East (Purva)', hi: 'पूर्व', hinglish: 'East (Purva)' },
    luckyColors: { en: ['Gold', 'Orange', 'Yellow', 'Copper'], hi: ['सुनहरा', 'नारंगी', 'पीला', 'ताम्र'], hinglish: ['Gold', 'Orange', 'Yellow', 'Copper'] },
    gemstone: { en: 'Ruby (Manikya)', hi: 'माणिक्य', hinglish: 'Ruby (Manikya)' },
    luckyDays: { en: ['Sunday'], hi: ['रविवार'], hinglish: ['Sunday (Ravivar)'] },
    friendlyNumbers: [1, 2, 3, 5, 9],
    neutralNumbers: [4, 7],
    enemyNumbers: [6, 8],
    mantra: 'ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः (Om Hram Hreem Hroum Sah Suryaya Namah)',
    remedy: {
      en: 'Offer water to the rising Sun daily in a copper vessel with red flowers and chant Gayatri Mantra.',
      hi: 'प्रातःकाल तांबे के लोटे से सूर्य देव को लाल पुष्प व रोली डालकर अर्घ्य दें और गायत्री मंत्र का जप करें।',
      hinglish: 'Subah taambe ke lote se Surya dev ko arghya dein aur Gayatri mantra ka jaap karein.',
    },
  },
  2: {
    number: 2,
    planet: { en: 'Moon (Chandra)', hi: 'चंद्र', hinglish: 'Chandra (Moon)' },
    deity: { en: 'Lord Shiva & Goddess Parvati', hi: 'भगवान शिव व माता पार्वती', hinglish: 'Lord Shiva & Mata Parvati' },
    nature: { en: 'Intuition, Emotion, Harmony, Diplomacy', hi: 'संवेदनशीलता, सौम्यता, कल्पनाशीलता', hinglish: 'Intuition, Emotional Balance, Kalpana' },
    element: { en: 'Water (Jal)', hi: 'जल', hinglish: 'Jal (Water)' },
    direction: { en: 'North-West (Vayavya)', hi: 'उत्तर-पश्चिम (वायव्य)', hinglish: 'North-West (Vayavya)' },
    luckyColors: { en: ['White', 'Silver', 'Cream', 'Pearl'], hi: ['सफेद', 'चांदी', 'हल्का पीला'], hinglish: ['White', 'Silver', 'Cream'] },
    gemstone: { en: 'Pearl (Moti) / Moonstone', hi: 'मोती', hinglish: 'Pearl (Moti) / Moonstone' },
    luckyDays: { en: ['Monday'], hi: ['सोमवार'], hinglish: ['Monday (Somvar)'] },
    friendlyNumbers: [1, 2, 3, 5],
    neutralNumbers: [4, 7, 8],
    enemyNumbers: [6, 9],
    mantra: 'ॐ श्रां श्रीं श्रौं सः चंद्रमसे नमः (Om Shram Shreem Shroum Sah Chandramase Namah)',
    remedy: {
      en: 'Respect mother and motherly figures, drink water from silver glass, and perform Shivling Jalabhishek on Mondays.',
      hi: 'माता का आदर करें, चांदी के पात्र में जल पिएं और सोमवार को शिवलिंग पर कच्चा दूध व जल चढ़ाएं।',
      hinglish: 'Mother ka aashirwad lein, chandi ke glass me paani piyein aur Somvar ko Shivling par jal chadhayein.',
    },
  },
  3: {
    number: 3,
    planet: { en: 'Jupiter (Guru / Brihaspati)', hi: 'बृहस्पति (गुरु)', hinglish: 'Guru (Jupiter)' },
    deity: { en: 'Lord Vishnu & Brihaspati Dev', hi: 'भगवान विष्णु व देवगुरु बृहस्पति', hinglish: 'Lord Vishnu & Guru Brihaspati' },
    nature: { en: 'Wisdom, Expansion, Teaching, Counsel, Fortune', hi: 'ज्ञान, विस्तार, विवेक, धर्म, गुरु कृपा', hinglish: 'Wisdom, Dharmik Gyan, Expansion, Fortune' },
    element: { en: 'Ether / Space (Akasha)', hi: 'आकाश', hinglish: 'Akash (Ether)' },
    direction: { en: 'North-East (Ishanya)', hi: 'उत्तर-पूर्व (ईशान)', hinglish: 'North-East (Ishan)' },
    luckyColors: { en: ['Bright Yellow', 'Saffron', 'Gold'], hi: ['पीला', 'केसरिया', 'स्वर्ण'], hinglish: ['Bright Yellow', 'Kesari', 'Gold'] },
    gemstone: { en: 'Yellow Sapphire (Pukhraj)', hi: 'पुखराज', hinglish: 'Yellow Sapphire (Pukhraj)' },
    luckyDays: { en: ['Thursday'], hi: ['गुरुवार'], hinglish: ['Thursday (Guruvar)'] },
    friendlyNumbers: [1, 2, 3, 9],
    neutralNumbers: [5, 7, 8],
    enemyNumbers: [4, 6],
    mantra: 'ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः (Om Gram Greem Groum Sah Gurave Namah)',
    remedy: {
      en: 'Apply saffron/turmeric tilak on forehead, respect teachers and elders, and chant Vishnu Sahasranama.',
      hi: 'माथे पर केसर या हल्दी का तिलक लगाएं, गुरुजनों का आशीर्वाद लें और गुरुवार को केले के पेड़ की पूजा करें।',
      hinglish: 'Forehead par haldi/kesar tilak lagayein, teachers ka samman karein aur Guruvar ko Pili daal daan karein.',
    },
  },
  4: {
    number: 4,
    planet: { en: 'Rahu (North Node / Uranus)', hi: 'राहु', hinglish: 'Rahu' },
    deity: { en: 'Lord Ganesha & Goddess Saraswati', hi: 'भगवान गणेश व मां सरस्वती', hinglish: 'Lord Ganesha & Maa Saraswati' },
    nature: { en: 'Unconventional, Strategy, Tech, Revolution, Structure', hi: 'तीक्ष्ण बुद्धि, रहस्य, नवीनता, अचानक बदलाव', hinglish: 'Out-of-the-box Strategy, Tech, Revolution' },
    element: { en: 'Earth / Air (Vayu-Prithvi)', hi: 'वायु-पृथ्वी', hinglish: 'Air-Earth (Vayu-Prithvi)' },
    direction: { en: 'South-West (Nairutya)', hi: 'दक्षिण-पश्चिम (नैऋत्य)', hinglish: 'South-West (Nairutya)' },
    luckyColors: { en: ['Electric Blue', 'Grey', 'Brown', 'Khaki'], hi: ['नीला', 'धूसर', 'भूरा'], hinglish: ['Electric Blue', 'Grey', 'Brown'] },
    gemstone: { en: 'Hessonite (Gomed)', hi: 'गोमेद', hinglish: 'Hessonite (Gomed)' },
    luckyDays: { en: ['Sunday', 'Saturday'], hi: ['रविवार', 'शनिवार'], hinglish: ['Sunday', 'Saturday'] },
    friendlyNumbers: [1, 5, 6, 7],
    neutralNumbers: [2, 8],
    enemyNumbers: [3, 4, 9],
    mantra: 'ॐ भ्रां भ्रीं भ्रौं सः राहवे नमः (Om Bhram Bhreem Bhroum Sah Rahave Namah)',
    remedy: {
      en: 'Worship Lord Ganesha, keep your electronic devices uncluttered, and feed stray dogs.',
      hi: 'भगवान गणेश की आराधना करें, घर के इलेक्ट्रॉनिक उपकरण साफ रखें और काले कुत्ते को रोटी खिलाएं।',
      hinglish: 'Lord Ganesha ki pooja karein, room/electronics clean rakhein aur street dogs ko feed karein.',
    },
  },
  5: {
    number: 5,
    planet: { en: 'Mercury (Budh)', hi: 'बुध', hinglish: 'Budh (Mercury)' },
    deity: { en: 'Lord Ganesha & Vishnu Dev', hi: 'भगवान गणेश व श्री हरि विष्णु', hinglish: 'Lord Ganesha & Vishnu' },
    nature: { en: 'Communication, Business, Adaptability, Networking', hi: 'बुद्धि, व्यापार, संचार, हास्य, गतिशीलता', hinglish: 'Communication, Business Acumen, Agility' },
    element: { en: 'Earth (Prithvi)', hi: 'पृथ्वी', hinglish: 'Prithvi (Earth)' },
    direction: { en: 'North (Uttara)', hi: 'उत्तर', hinglish: 'North (Uttar)' },
    luckyColors: { en: ['Emerald Green', 'Mint', 'Turquoise'], hi: ['हरा', 'तोतिया', 'फिरोजी'], hinglish: ['Emerald Green', 'Mint Green'] },
    gemstone: { en: 'Emerald (Panna)', hi: 'पन्ना', hinglish: 'Emerald (Panna)' },
    luckyDays: { en: ['Wednesday'], hi: ['बुधवार'], hinglish: ['Wednesday (Budhvar)'] },
    friendlyNumbers: [1, 2, 3, 5, 6],
    neutralNumbers: [7, 8, 9],
    enemyNumbers: [4],
    mantra: 'ॐ ब्रां ब्रीं ब्रौं सः बुधाय नमः (Om Bram Breem Broum Sah Budhaya Namah)',
    remedy: {
      en: 'Feed green grass or spinach to cows on Wednesday, chant Budh mantra, and use green pens for accounts.',
      hi: 'बुधवार को गाय को हरा चारा या पालक खिलाएं, श्री गणेश को दूर्वा अर्पित करें और व्यापार में हरा रंग रखें।',
      hinglish: 'Budhvar ko cow ko green fodder/spinach khilayein aur Ganesh ji ko Durva ghaas chadhayein.',
    },
  },
  6: {
    number: 6,
    planet: { en: 'Venus (Shukra)', hi: 'शुक्र', hinglish: 'Shukra (Venus)' },
    deity: { en: 'Goddess Lakshmi & Shukracharya', hi: 'मां महालक्ष्मी व शुक्राचार्य', hinglish: 'Maa Lakshmi & Shukradev' },
    nature: { en: 'Love, Beauty, Luxury, Art, Romance, Glamour', hi: 'सौंदर्य, कला, प्रेम, विलासिता, ऐश्वर्य', hinglish: 'Luxury, Beauty, Romance, Glamour, Art' },
    element: { en: 'Water (Jal)', hi: 'जल', hinglish: 'Jal (Water)' },
    direction: { en: 'South-East (Agneya)', hi: 'दक्षिण-पूर्व (आग्नेय)', hinglish: 'South-East (Agneya)' },
    luckyColors: { en: ['Pink', 'White', 'Pastel Blue', 'Silver'], hi: ['गुलाबी', 'श्वेत', 'हल्का नीला'], hinglish: ['Pink', 'White', 'Pastel Shades'] },
    gemstone: { en: 'Diamond (Heera) / White Zircon / Opal', hi: 'हीरा / ओपल', hinglish: 'Diamond (Heera) / White Zircon / Opal' },
    luckyDays: { en: ['Friday'], hi: ['शुक्रवार'], hinglish: ['Friday (Shukravar)'] },
    friendlyNumbers: [1, 5, 6, 7, 8],
    neutralNumbers: [9],
    enemyNumbers: [2, 3],
    mantra: 'ॐ द्रां द्रीं द्रौं सः शुक्राय नमः (Om Dram Dreem Droum Sah Shukraya Namah)',
    remedy: {
      en: 'Wear clean, fragrant clothes, respect women, and chant Sri Suktam or Lakshmi Chalisa on Fridays.',
      hi: 'सुगंधित इत्र और साफ वस्त्र धारण करें, स्त्रियों का आदर करें और शुक्रवार को श्रीसूक्त का पाठ करें।',
      hinglish: 'Clean & fragrant clothes pehnein, women ka samman karein aur Shukravar ko Kheer ka daan karein.',
    },
  },
  7: {
    number: 7,
    planet: { en: 'Ketu (South Node / Neptune)', hi: 'केतु', hinglish: 'Ketu' },
    deity: { en: 'Lord Ganesha & Lord Shiva', hi: 'भगवान गणेश व भगवान भैरव', hinglish: 'Lord Ganesha & Lord Shiva' },
    nature: { en: 'Spirituality, Research, Solitude, Occult, Mysticism', hi: 'अध्यात्म, शोध, गूढ़ विद्या, वैराग्य, अंतर्ज्ञान', hinglish: 'Spirituality, Deep Research, Occult, Mysticism' },
    element: { en: 'Water / Ether (Jal-Akasha)', hi: 'जल-आकाश', hinglish: 'Water-Ether (Jal-Akash)' },
    direction: { en: 'North-East (Ishanya)', hi: 'उत्तर-पूर्व (ईशान)', hinglish: 'North-East (Ishan)' },
    luckyColors: { en: ['Light Green', 'White', 'Smoky Grey'], hi: ['हल्का हरा', 'श्वेत', 'धूम्र वर्ण'], hinglish: ['Light Green', 'White', 'Smoky Grey'] },
    gemstone: { en: "Cat's Eye (Lehsunia)", hi: 'लहसुनिया', hinglish: "Cat's Eye (Lehsunia)" },
    luckyDays: { en: ['Sunday', 'Monday'], hi: ['रविवार', 'सोमवार'], hinglish: ['Sunday', 'Monday'] },
    friendlyNumbers: [1, 4, 5, 6],
    neutralNumbers: [2, 3, 8],
    enemyNumbers: [9],
    mantra: 'ॐ स्रां स्रीं स्रौं सः केतवे नमः (Om Sram Sreem Sroum Sah Ketave Namah)',
    remedy: {
      en: 'Practice daily meditation and breathwork, feed multi-colored dogs, and donate blankets in winter.',
      hi: 'नियमित ध्यान और योग करें, चितकबरे कुत्ते को भोजन दें और जरूरतमंदों को कंबल दान करें।',
      hinglish: 'Daily meditation karein, multi-colored dog ko feed karein aur spiritual books padhein.',
    },
  },
  8: {
    number: 8,
    planet: { en: 'Saturn (Shani Dev)', hi: 'शनि', hinglish: 'Shani (Saturn)' },
    deity: { en: 'Lord Shani & Lord Hanuman', hi: 'शनि देव व संकटमोचन हनुमान', hinglish: 'Shani Dev & Lord Hanuman' },
    nature: { en: 'Karma, Discipline, Patience, Long-term Wealth, Justice', hi: 'कर्म, न्याय, धैर्य, कठोर परिश्रम, स्थिर संपत्ति', hinglish: 'Karma, Discipline, Patience, Long-term Wealth' },
    element: { en: 'Air (Vayu)', hi: 'वायु', hinglish: 'Vayu (Air)' },
    direction: { en: 'West (Pashchim)', hi: 'पश्चिम', hinglish: 'West (Pashchim)' },
    luckyColors: { en: ['Navy Blue', 'Black', 'Dark Grey', 'Purple'], hi: ['नीला', 'काला', 'गहरा भूरा'], hinglish: ['Navy Blue', 'Black', 'Dark Grey'] },
    gemstone: { en: 'Blue Sapphire (Neelam) / Amethyst', hi: 'नीलम / कटैला', hinglish: 'Blue Sapphire (Neelam) / Amethyst' },
    luckyDays: { en: ['Saturday'], hi: ['शनिवार'], hinglish: ['Saturday (Shanivar)'] },
    friendlyNumbers: [3, 5, 6],
    neutralNumbers: [4, 7],
    enemyNumbers: [1, 2, 9],
    mantra: 'ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः (Om Pram Preem Proum Sah Shanaishcharaya Namah)',
    remedy: {
      en: 'Help laborers, avoid cheating anyone, light a mustard oil lamp under a Peepal tree on Saturdays, and chant Hanuman Chalisa.',
      hi: 'शनिवार शाम पीपल के वृक्ष के नीचे सरसों के तेल का दीपक जलाएं, मजदूरों की मदद करें और हनुमान चालीसा का पाठ करें।',
      hinglish: 'Shanivar ko Peepal ke neeche sarson tel ka diya jalayein, laborers ki help karein aur Hanuman Chalisa padhein.',
    },
  },
  9: {
    number: 9,
    planet: { en: 'Mars (Mangal Dev)', hi: 'मंगल', hinglish: 'Mangal (Mars)' },
    deity: { en: 'Lord Hanuman & Kartikeya Dev', hi: 'श्री हनुमान जी व भगवान कार्तिकेय', hinglish: 'Lord Hanuman & Kartikeya' },
    nature: { en: 'Courage, Vitality, Passion, Protection, Humanitarian', hi: 'साहस, पराक्रम, ऊर्जा, नेतृत्व, परोपकार', hinglish: 'Courage, High Vitality, Passion, Protection' },
    element: { en: 'Fire (Agni)', hi: 'अग्नि', hinglish: 'Agni (Fire)' },
    direction: { en: 'South (Dakshin)', hi: 'दक्षिण', hinglish: 'South (Dakshin)' },
    luckyColors: { en: ['Bright Red', 'Crimson', 'Rose Pink'], hi: ['लाल', 'सिंदूरी', 'गुलाबी'], hinglish: ['Bright Red', 'Crimson Red'] },
    gemstone: { en: 'Red Coral (Moonga)', hi: 'मूंगा', hinglish: 'Red Coral (Moonga)' },
    luckyDays: { en: ['Tuesday'], hi: ['मंगलवार'], hinglish: ['Tuesday (Mangalvar)'] },
    friendlyNumbers: [1, 2, 3, 5],
    neutralNumbers: [6, 8],
    enemyNumbers: [4, 7],
    mantra: 'ॐ क्रां क्रीं क्रौं सः भौमाय नमः (Om Kram Kreem Kroum Sah Bhaumaya Namah)',
    remedy: {
      en: 'Chant Hanuman Chalisa or Sundarkand on Tuesdays, donate blood if healthy, and offer jaggery/gram to monkeys.',
      hi: 'मंगलवार को हनुमान जी को सिंदूर व चमेली का तेल चढ़ाएं, सुंदरकांड का पाठ करें और गुड़-चने का भोग लगाएं।',
      hinglish: 'Mangalvar ko Hanuman Chalisa/Sundarkand padhein, blood donate karein aur gud-chana distribute karein.',
    },
  },
};

// ==========================================
// 2. CHALDEAN & PYTHAGOREAN LETTER TABLES
// ==========================================
export const CHALDEAN_MAP: Record<string, number> = {
  A: 1, I: 1, J: 1, Q: 1, Y: 1,
  B: 2, K: 2, R: 2,
  C: 3, G: 3, L: 3, S: 3,
  D: 4, M: 4, T: 4,
  E: 5, H: 5, N: 5, X: 5,
  U: 6, V: 6, W: 6,
  O: 7, Z: 7,
  F: 8, P: 8,
};

export const PYTHAGOREAN_MAP: Record<string, number> = {
  A: 1, J: 1, S: 1,
  B: 2, K: 2, T: 2,
  C: 3, L: 3, U: 3,
  D: 4, M: 4, V: 4,
  E: 5, N: 5, W: 5,
  F: 6, O: 6, X: 6,
  G: 7, P: 7, Y: 7,
  H: 8, Q: 8, Z: 8,
  I: 9, R: 9,
};

export function calculateChaldeanNameSum(name: string): { root: number; compound: number } {
  const clean = name.toUpperCase().replace(/[^A-Z]/g, '');
  let sum = 0;
  for (const ch of clean) {
    sum += CHALDEAN_MAP[ch] || 0;
  }
  const compound = sum;
  let root = sum;
  while (root > 9 && root !== 11 && root !== 22 && root !== 33) {
    root = String(root).split('').reduce((acc, digit) => acc + parseInt(digit, 10), 0);
  }
  return { root: root > 9 ? root % 9 || 9 : root, compound };
}

export function calculateDigitSum(digits: string): { root: number; compound: number } {
  const clean = digits.replace(/[^0-9]/g, '');
  let sum = 0;
  for (const ch of clean) {
    sum += parseInt(ch, 10);
  }
  const compound = sum;
  let root = sum;
  while (root > 9) {
    root = String(root).split('').reduce((acc, digit) => acc + parseInt(digit, 10), 0);
  }
  return { root: root || 1, compound };
}

// ==========================================
// 3. 12 VEDIC RASHIS (SIGNS) TAXONOMY
// ==========================================
export interface RashiTaxonomy {
  index: number;
  name: { en: string; hi: string; hinglish: string };
  symbol: string;
  rulingPlanet: string;
  element: 'Fire' | 'Earth' | 'Air' | 'Water';
  quality: 'Chara (Movable)' | 'Sthira (Fixed)' | 'Dvisvabhava (Dual)';
  bodyPart: string;
  exaltedPlanet: string;
  debilitatedPlanet: string;
}

export const VEDIC_RASHIS_TAXONOMY: Record<number, RashiTaxonomy> = {
  1: { index: 1, name: { en: 'Aries (Mesha)', hi: 'मेष', hinglish: 'Mesh (Aries)' }, symbol: '♈', rulingPlanet: 'Mars (मंगल)', element: 'Fire', quality: 'Chara (Movable)', bodyPart: 'Head & Brain', exaltedPlanet: 'Sun (10°)', debilitatedPlanet: 'Saturn (20°)' },
  2: { index: 2, name: { en: 'Taurus (Vrishabha)', hi: 'वृषभ', hinglish: 'Vrishabh (Taurus)' }, symbol: '♉', rulingPlanet: 'Venus (शुक्र)', element: 'Earth', quality: 'Sthira (Fixed)', bodyPart: 'Face & Throat', exaltedPlanet: 'Moon (3°)', debilitatedPlanet: 'Rahu / Ketu' },
  3: { index: 3, name: { en: 'Gemini (Mithuna)', hi: 'मिथुन', hinglish: 'Mithun (Gemini)' }, symbol: '♊', rulingPlanet: 'Mercury (बुध)', element: 'Air', quality: 'Dvisvabhava (Dual)', bodyPart: 'Shoulders & Arms', exaltedPlanet: 'Rahu (15°)', debilitatedPlanet: 'Ketu (15°)' },
  4: { index: 4, name: { en: 'Cancer (Karka)', hi: 'कर्क', hinglish: 'Kark (Cancer)' }, symbol: '♋', rulingPlanet: 'Moon (चंद्र)', element: 'Water', quality: 'Chara (Movable)', bodyPart: 'Chest & Lungs', exaltedPlanet: 'Jupiter (5°)', debilitatedPlanet: 'Mars (28°)' },
  5: { index: 5, name: { en: 'Leo (Simha)', hi: 'सिंह', hinglish: 'Singh (Leo)' }, symbol: '♌', rulingPlanet: 'Sun (सूर्य)', element: 'Fire', quality: 'Sthira (Fixed)', bodyPart: 'Heart & Spine', exaltedPlanet: 'None (Moolatrikona)', debilitatedPlanet: 'None' },
  6: { index: 6, name: { en: 'Virgo (Kanya)', hi: 'कन्या', hinglish: 'Kanya (Virgo)' }, symbol: '♍', rulingPlanet: 'Mercury (बुध)', element: 'Earth', quality: 'Dvisvabhava (Dual)', bodyPart: 'Stomach & Intestines', exaltedPlanet: 'Mercury (15°)', debilitatedPlanet: 'Venus (27°)' },
  7: { index: 7, name: { en: 'Libra (Tula)', hi: 'तुला', hinglish: 'Tula (Libra)' }, symbol: '♎', rulingPlanet: 'Venus (शुक्र)', element: 'Air', quality: 'Chara (Movable)', bodyPart: 'Lower Back & Kidneys', exaltedPlanet: 'Saturn (20°)', debilitatedPlanet: 'Sun (10°)' },
  8: { index: 8, name: { en: 'Scorpio (Vrishchika)', hi: 'वृश्चिक', hinglish: 'Vrishchik (Scorpio)' }, symbol: '♏', rulingPlanet: 'Mars & Ketu', element: 'Water', quality: 'Sthira (Fixed)', bodyPart: 'Reproductive Organs', exaltedPlanet: 'None', debilitatedPlanet: 'Moon (3°)' },
  9: { index: 9, name: { en: 'Sagittarius (Dhanu)', hi: 'धनु', hinglish: 'Dhanu (Sagittarius)' }, symbol: '♐', rulingPlanet: 'Jupiter (गुरु)', element: 'Fire', quality: 'Dvisvabhava (Dual)', bodyPart: 'Thighs & Hips', exaltedPlanet: 'Ketu (15°)', debilitatedPlanet: 'Rahu (15°)' },
  10: { index: 10, name: { en: 'Capricorn (Makara)', hi: 'मकर', hinglish: 'Makar (Capricorn)' }, symbol: '♑', rulingPlanet: 'Saturn (शनि)', element: 'Earth', quality: 'Chara (Movable)', bodyPart: 'Knees & Bones', exaltedPlanet: 'Mars (28°)', debilitatedPlanet: 'Jupiter (5°)' },
  11: { index: 11, name: { en: 'Aquarius (Kumbha)', hi: 'कुंभ', hinglish: 'Kumbh (Aquarius)' }, symbol: '♒', rulingPlanet: 'Saturn & Rahu', element: 'Air', quality: 'Sthira (Fixed)', bodyPart: 'Shins & Ankles', exaltedPlanet: 'None', debilitatedPlanet: 'None' },
  12: { index: 12, name: { en: 'Pisces (Meena)', hi: 'मीन', hinglish: 'Meen (Pisces)' }, symbol: '♓', rulingPlanet: 'Jupiter (गुरु)', element: 'Water', quality: 'Dvisvabhava (Dual)', bodyPart: 'Feet & Toes', exaltedPlanet: 'Venus (27°)', debilitatedPlanet: 'Mercury (15°)' },
};

// ==========================================
// 4. 12 BHAVAS (HOUSES) SIGNIFICANCE
// ==========================================
export interface BhavaSignificance {
  house: number;
  sanskritName: string;
  category: 'Kendra' | 'Trikona' | 'Upachaya' | 'Dusthana' | 'Maraka';
  themes: { en: string[]; hi: string[]; hinglish: string[] };
  bodyPart: string;
  karakaPlanet: string;
}

export const BHAVAS_TAXONOMY: Record<number, BhavaSignificance> = {
  1: { house: 1, sanskritName: 'Tanu Bhava (Lagna)', category: 'Kendra', themes: { en: ['Self', 'Physical Body', 'Appearance', 'Vitality', 'Personality'], hi: ['स्वयं', 'शरीर', 'स्वास्थ्य', 'व्यक्तित्व'], hinglish: ['Self', 'Personality', 'Physical Health'] }, bodyPart: 'Head', karakaPlanet: 'Sun' },
  2: { house: 2, sanskritName: 'Dhana / Kutumba Bhava', category: 'Maraka', themes: { en: ['Accumulated Wealth', 'Speech', 'Family Lineage', 'Food habits'], hi: ['संचित धन', 'वाणी', 'परिवार', 'खान-पान'], hinglish: ['Accumulated Wealth', 'Speech/Vaani', 'Family'] }, bodyPart: 'Face & Teeth', karakaPlanet: 'Jupiter' },
  3: { house: 3, sanskritName: 'Sahaja / Bhratru Bhava', category: 'Upachaya', themes: { en: ['Courage', 'Siblings', 'Short Journeys', 'Hands-on Skills', 'Efforts'], hi: ['साहस', 'पराक्रम', 'छोटे भाई-बहन', 'संचार'], hinglish: ['Courage/Parakram', 'Younger Siblings', 'Initiatives'] }, bodyPart: 'Hands & Shoulders', karakaPlanet: 'Mars' },
  4: { house: 4, sanskritName: 'Sukha / Matru Bhava', category: 'Kendra', themes: { en: ['Mother', 'Home & Real Estate', 'Vehicles', 'Inner Happiness (Sukha)'], hi: ['माता', 'गृह सुख', 'भूमि व वाहन', 'मानसिक शांति'], hinglish: ['Mother', 'Property & Vehicles', 'Inner Peace'] }, bodyPart: 'Chest & Heart', karakaPlanet: 'Moon' },
  5: { house: 5, sanskritName: 'Putra / Purva Punya Bhava', category: 'Trikona', themes: { en: ['Children', 'Intelligence', 'Past Life Karma', 'Speculation & Creativity'], hi: ['संतान', 'बुद्धि', 'पूर्व जन्म के पुण्य', 'सृजनात्मकता'], hinglish: ['Children', 'Intelligence/Gyan', 'Past Karma Merits'] }, bodyPart: 'Stomach', karakaPlanet: 'Jupiter' },
  6: { house: 6, sanskritName: 'Ripu / Roga / Rina Bhava', category: 'Dusthana', themes: { en: ['Enemies', 'Debts', 'Diseases', 'Daily Service', 'Litigation'], hi: ['शत्रु', 'रोग', 'कर्ज', 'प्रतियोगिता', 'नौकरी'], hinglish: ['Enemies (Ripu)', 'Health Hurdles', 'Debts (Rina)'] }, bodyPart: 'Intestines', karakaPlanet: 'Mars & Saturn' },
  7: { house: 7, sanskritName: 'Kalatra / Jaya Bhava', category: 'Kendra', themes: { en: ['Marriage Partner', 'Spouse', 'Business Partnerships', 'Public Reputation'], hi: ['विवाह', 'जीवनसाथी', 'व्यापारिक साझेदारी', 'सामाजिक संबंध'], hinglish: ['Spouse & Marriage', 'Business Partnerships'] }, bodyPart: 'Lower Abdomen', karakaPlanet: 'Venus' },
  8: { house: 8, sanskritName: 'Ayu / Randhra Bhava', category: 'Dusthana', themes: { en: ['Longevity', 'Sudden Events', 'Transformation', 'Occult', 'In-laws Wealth'], hi: ['आयु', 'अचानक लाभ/हानि', 'रहस्य विद्या', 'ससुराल'], hinglish: ['Longevity/Ayu', 'Sudden Transformations', 'Occult'] }, bodyPart: 'Pelvic Organs', karakaPlanet: 'Saturn' },
  9: { house: 9, sanskritName: 'Dharma / Bhagya Bhava', category: 'Trikona', themes: { en: ['Fortune / Luck', 'Father / Guru', 'Higher Wisdom', 'Pilgrimage', 'Dharma'], hi: ['भाग्य', 'धर्म', 'पिता व गुरु', 'तीर्थ यात्रा'], hinglish: ['Fortune/Bhagya', 'Father & Gurus', 'Higher Wisdom'] }, bodyPart: 'Thighs', karakaPlanet: 'Jupiter' },
  10: { house: 10, sanskritName: 'Karma / Rajya Bhava', category: 'Kendra', themes: { en: ['Career', 'Profession', 'Social Status', 'Authority & Achievements'], hi: ['कर्म', 'व्यवसाय', 'पद-प्रतिष्ठा', 'शासकीय सम्मान'], hinglish: ['Career/Karma', 'Social Status', 'Leadership'] }, bodyPart: 'Knees', karakaPlanet: 'Sun, Mercury, Jupiter, Saturn' },
  11: { house: 11, sanskritName: 'Labha / Aaya Bhava', category: 'Upachaya', themes: { en: ['Income & Profits', 'Fulfillment of Desires', 'Elder Siblings', 'Friends Circle'], hi: ['आय व लाभ', 'इच्छा पूर्ति', 'बड़े भाई-बहन', 'मित्र मंडली'], hinglish: ['Gains/Labha', 'Income Growth', 'Elder Siblings'] }, bodyPart: 'Shins', karakaPlanet: 'Jupiter' },
  12: { house: 12, sanskritName: 'Vyaya / Moksha Bhava', category: 'Dusthana', themes: { en: ['Expenditure', 'Foreign Travel / Settlement', 'Moksha (Liberation)', 'Sleep'], hi: ['व्यय (खर्च)', 'विदेश गमन', 'मोक्ष', 'शयन सुख'], hinglish: ['Expenditures', 'Foreign Relocation', 'Moksha/Spiritual Liberation'] }, bodyPart: 'Feet', karakaPlanet: 'Saturn & Ketu' },
};

// ==========================================
// 5. 8 LO SHU PLANES TAXONOMY
// ==========================================
export interface LoShuPlane {
  name: { en: string; hi: string; hinglish: string };
  numbers: number[];
  meaning: { en: string; hi: string; hinglish: string };
  direction: 'Horizontal' | 'Vertical' | 'Diagonal';
}

export const LOSHU_PLANES: LoShuPlane[] = [
  {
    name: { en: 'Mental Plane (4-9-2)', hi: 'मानसिक तल (4-9-2)', hinglish: 'Mental Plane (4-9-2)' },
    numbers: [4, 9, 2],
    meaning: {
      en: 'Sharp memory, analytical thinking, and intellectual sharpness.',
      hi: 'तीक्ष्ण स्मरण शक्ति, तार्किक सोच और बौद्धिक क्षमता।',
      hinglish: 'Strong memory, logical analysis aur intellectual sharpness.',
    },
    direction: 'Horizontal',
  },
  {
    name: { en: 'Emotional Plane (3-5-7)', hi: 'भावनात्मक तल (3-5-7)', hinglish: 'Emotional / Spiritual Plane (3-5-7)' },
    numbers: [3, 5, 7],
    meaning: {
      en: 'Heart-centered feelings, deep intuition, and spiritual awareness.',
      hi: 'हृदय की संवेदनशीलता, अंतर्ज्ञान और आध्यात्मिक झुकाव।',
      hinglish: 'Emotional intelligence, spiritual intuition aur heart-centered nature.',
    },
    direction: 'Horizontal',
  },
  {
    name: { en: 'Practical Plane (8-1-6)', hi: 'व्यावहारिक तल (8-1-6)', hinglish: 'Practical Plane (8-1-6)' },
    numbers: [8, 1, 6],
    meaning: {
      en: 'Grounding, financial management, physical execution, and business savvy.',
      hi: 'व्यावहारिक कुशलता, धन प्रबंधन और योजना को धरातल पर उतारना।',
      hinglish: 'Grounding, practical business execution aur financial management.',
    },
    direction: 'Horizontal',
  },
  {
    name: { en: 'Thought Plane (4-3-8)', hi: 'विचार तल (4-3-8)', hinglish: 'Thought Plane (4-3-8)' },
    numbers: [4, 3, 8],
    meaning: {
      en: 'Visionary thinking, planning ahead, and strategic ideation.',
      hi: 'दूरदर्शिता, योजना निर्माण और रणनीतिक सोच।',
      hinglish: 'Visionary planning, strategic ideation aur future forecasting.',
    },
    direction: 'Vertical',
  },
  {
    name: { en: 'Willpower Plane (9-5-1)', hi: 'इच्छाशक्ति तल (9-5-1)', hinglish: 'Willpower Plane (9-5-1)' },
    numbers: [9, 5, 1],
    meaning: {
      en: 'Unyielding determination, perseverance, and overcoming life obstacles.',
      hi: 'अटल संकल्प, दृढ़ इच्छाशक्ति और बाधाओं को पार करने का जज्बा।',
      hinglish: 'Unshakable determination, grit aur goal achievement.',
    },
    direction: 'Vertical',
  },
  {
    name: { en: 'Action Plane (2-7-6)', hi: 'कर्म तल (2-7-6)', hinglish: 'Action Plane (2-7-6)' },
    numbers: [2, 7, 6],
    meaning: {
      en: 'Speedy execution, putting ideas into tangible action without delay.',
      hi: 'शीघ्र निर्णय, कर्मठता और विचारों को तुरंत कार्य रूप देना।',
      hinglish: 'Fast execution, practical action aur getting things done.',
    },
    direction: 'Vertical',
  },
  {
    name: { en: 'Golden Raj Yoga (4-5-6)', hi: 'स्वर्ण राजयोग (4-5-6)', hinglish: 'Golden Raj Yoga (4-5-6)' },
    numbers: [4, 5, 6],
    meaning: {
      en: 'Supreme success, wealth attraction, high social status, and luck.',
      hi: 'असाधारण सफलता, धन समृद्धि, उच्च पद और भाग्य का साथ।',
      hinglish: 'Supreme prosperity, wealth attraction aur high social stature.',
    },
    direction: 'Diagonal',
  },
  {
    name: { en: 'Silver Property Yoga (2-5-8)', hi: 'रजत संपदा योग (2-5-8)', hinglish: 'Silver Property Yoga (2-5-8)' },
    numbers: [2, 5, 8],
    meaning: {
      en: 'Real estate, land ownership, immovable assets, and grounded stability.',
      hi: 'भूमि, भवन, अचल संपत्ति और स्थिर धन संचय का प्रबल योग।',
      hinglish: 'Land & property gains, immovable assets aur grounded wealth.',
    },
    direction: 'Diagonal',
  },
];

// ==========================================
// 6. SHANI SADE SATI & DHAIYA CALCULATOR
// ==========================================
export interface SadeSatiAnalysis {
  status: 'Rising' | 'Peak' | 'Setting' | 'Dhaiya' | 'Free';
  phaseName: { en: string; hi: string; hinglish: string };
  description: { en: string; hi: string; hinglish: string };
  remedy: { en: string; hi: string; hinglish: string };
}

export function calculateSadeSatiStatus(moonSignIndex: number): SadeSatiAnalysis {
  // Current Saturn is transiting Aquarius (11) and Pisces (12)
  if (moonSignIndex === 11) {
    return {
      status: 'Peak',
      phaseName: { en: 'Peak Phase (Madhya Shani)', hi: 'मध्य / शिखर साढ़े साती (द्वितीय चरण)', hinglish: 'Peak Sade Sati (2nd Phase)' },
      description: {
        en: 'Saturn is directly over your Natal Moon in Aquarius. Major career realignment, high discipline required.',
        hi: 'शनि देव सीधे आपकी चंद्र राशि पर गोचर कर रहे हैं। मानसिक धैर्य, कर्मठता और अनुशासन बनाए रखें।',
        hinglish: 'Shani dev aapki moon sign par transit kar rahe hain. Career aur hard work me consistent rahein.',
      },
      remedy: {
        en: 'Light mustard oil lamp under Peepal tree on Saturdays, chant Hanuman Chalisa, avoid ego.',
        hi: 'शनिवार को पीपल वृक्ष के पास सरसों के तेल का दीपक लगाएं और श्री हनुमान चालीसा का नित्य पाठ करें।',
        hinglish: 'Shanivar ko Peepal ke paas sarson tel ka diya jalayein aur Hanuman Chalisa padhein.',
      },
    };
  } else if (moonSignIndex === 12) {
    return {
      status: 'Rising',
      phaseName: { en: 'Rising Phase (Pratham Charan)', hi: 'चढ़ती साढ़े साती (प्रथम चरण)', hinglish: 'Rising Sade Sati (1st Phase)' },
      description: {
        en: 'Saturn is transiting your 12th house. Pay attention to budget management and sleep quality.',
        hi: 'शनि देव व्यय भाव से गुजर रहे हैं। अनावश्यक खर्चों पर नियंत्रण रखें और स्वास्थ्य का ध्यान रखें।',
        hinglish: 'Expenses manage karein aur travel/health me precautions rakhein.',
      },
      remedy: {
        en: 'Donate black sesame seeds, avoid speculative trading, practice evening meditation.',
        hi: 'काले तिल और उड़द दाल का दान करें और शाम को ध्यान लगाएं।',
        hinglish: 'Black sesame seeds donate karein aur meditation karein.',
      },
    };
  } else if (moonSignIndex === 10) {
    return {
      status: 'Setting',
      phaseName: { en: 'Setting Phase (Antya Charan)', hi: 'उतरती साढ़े साती (तृतीय चरण)', hinglish: 'Setting Sade Sati (3rd Phase)' },
      description: {
        en: 'Saturn is in your 2nd house of accumulated wealth. The pressure eases, leaving mature wisdom.',
        hi: 'साढ़े साती अंतिम चरण में है। पिछले संघर्षों का शुभ परिणाम और स्थिरता प्राप्त होने का समय है।',
        hinglish: 'Sade Sati ka ending phase hai. Hard work ka reward aur financial stability aayegi.',
      },
      remedy: {
        en: 'Feed birds and stray dogs, maintain harmonious speech with family.',
        hi: 'पक्षियों को दाना डालें, कुत्तों को भोजन दें और मीठी वाणी बोलें।',
        hinglish: 'Birds aur dogs ko feed karein aur family me polite communication rakhein.',
      },
    };
  } else if (moonSignIndex === 4 || moonSignIndex === 8) {
    return {
      status: 'Dhaiya',
      phaseName: { en: 'Shani Dhaiya (Kantaka / Ashtama Shani)', hi: 'शनि की अढ़ैया (ढैय्या)', hinglish: 'Shani Dhaiya (2.5 Years)' },
      description: {
        en: 'Saturn aspects your chart with 2.5-year Dhaiya. Keep property matters and contracts transparent.',
        hi: 'शनि की ढैय्या का प्रभाव है। संपत्ति और साझेदारी में पारदर्शिता बनाए रखें।',
        hinglish: 'Shani Dhaiya active hai. Financial agreements aur health ka dhyan rakhein.',
      },
      remedy: {
        en: 'Chant Shani Beej Mantra 108 times on Saturdays.',
        hi: 'शनिवार को शनि बीज मंत्र का 108 बार जप करें।',
        hinglish: 'Shanivar ko 108 bar Shani beej mantra ka jaap karein.',
      },
    };
  }

  return {
    status: 'Free',
    phaseName: { en: 'Sade Sati Free (सदा शुभ)', hi: 'साढ़े साती मुक्त', hinglish: 'Sade Sati Free' },
    description: {
      en: 'You are currently completely free from Saturn Sade Sati and Dhaiya. Auspicious period for progress.',
      hi: 'वर्तमान में आप साढ़े साती और ढैय्या के प्रभाव से पूर्णतः मुक्त हैं। शुभ समय का लाभ उठाएं।',
      hinglish: 'Aap Sade Sati se completely free hain. Growth aur expansion ke liye excellent time hai.',
    },
    remedy: {
      en: 'Maintain righteous karma and offer gratitude to your Ishta Devata.',
      hi: 'सत्कर्म करते रहें और अपने इष्ट देव का ध्यान करें।',
      hinglish: 'Good karma maintain karein aur Ishta Devata ki pooja karein.',
    },
  };
}

// ==========================================
// 7. ANGEL NUMBERS DIRECTORY
// ==========================================
export const ANGEL_NUMBERS: Record<string, { title: string; meaning: { en: string; hi: string; hinglish: string } }> = {
  '111': {
    title: 'Intuition & Manifestation Portal',
    meaning: {
      en: 'Your thoughts are manifesting rapidly. Keep your focus strictly on high goals and positive outcomes.',
      hi: 'आपके विचार शीघ्र वास्तविकता में बदल रहे हैं। केवल सकारात्मक और ऊंचे लक्ष्यों पर ध्यान केंद्रित करें।',
      hinglish: 'Aapke thoughts fast manifest ho rahe hain. Only positive goals par focus rakhein.',
    },
  },
  '222': {
    title: 'Divine Timing & Harmony',
    meaning: {
      en: 'Everything is falling into place in divine timing. Trust the process and cultivate peace in relationships.',
      hi: 'सब कुछ सही समय पर व्यवस्थित हो रहा है। प्रक्रिया पर विश्वास रखें और संबंधों में सामंजस्य बनाए रखें।',
      hinglish: 'Divine timing par vishwas rakhein. Relationships aur career me patience se sab acha hoga.',
    },
  },
  '333': {
    title: 'Ascended Masters Alignment',
    meaning: {
      en: 'Holy guides and masters are blessing you with creativity, wisdom, and spiritual protection.',
      hi: 'ईश्वरीय मार्गदर्शक और गुरु आपका मार्गदर्शन कर रहे हैं। अपनी रचनात्मक प्रतिभा का पूरा उपयोग करें।',
      hinglish: 'Gurus aur divine masters ka aashirwad aapke sath hai. Wisdom aur creativity ko use karein.',
    },
  },
  '444': {
    title: 'Angel Protection & Solid Foundations',
    meaning: {
      en: 'Angels surround you with unwavering protection. Your disciplined hard work will yield permanent fruits.',
      hi: 'दिव्य शक्तियां आपकी रक्षा कर रही हैं। आपका कठिन परिश्रम स्थायी और ठोस परिणाम देगा।',
      hinglish: 'Universal protection aapke sath hai. Hard work continue karein, success permanent hogi.',
    },
  },
  '555': {
    title: 'Major Positive Transformation',
    meaning: {
      en: 'A massive wave of positive life transformation is entering. Release old patterns and welcome the new.',
      hi: 'जीवन में सकारात्मक बदलाव का नया दौर आ रहा है। पुरानी सीमाओं को छोड़ें और नए अवसरों को अपनाएं।',
      hinglish: 'Life me big positive change aa raha hai. Old limitations chhod kar new opportunities accept karein.',
    },
  },
  '777': {
    title: 'Divine Luck & Spiritual Awakening',
    meaning: {
      en: 'You are in direct spiritual alignment. Miraculous luck and profound wisdom accompany your path.',
      hi: 'आप पूर्णतः आध्यात्मिक संतुलन में हैं। अप्रत्याशित सौभाग्य और आत्मज्ञान आपका साथ देगा।',
      hinglish: 'Divine luck aur spiritual awakening ka symbol hai. Miracles aapki life me enter karenge.',
    },
  },
  '888': {
    title: 'Infinite Financial Abundance',
    meaning: {
      en: 'The universal flow of wealth and karmic rewards is unlocking. Maintain ethical business practices.',
      hi: 'धन-धान्य और कर्म फल की भरपूर समृद्धि का द्वार खुल रहा है। ईमानदारी से आगे बढ़ें।',
      hinglish: 'Financial abundance aur wealth flow ka sign hai. Ethical work se unlimited growth hogi.',
    },
  },
  '11:11': {
    title: 'Cosmic Gateway & Soul Awakening',
    meaning: {
      en: 'A supreme cosmic gateway is open. Your soul purpose is awakening to higher dimensions.',
      hi: 'महा-ब्रह्मांडीय द्वार खुला है। अपने आत्मा के उच्च उद्देश्य और अंतरात्मा की आवाज को पहचानें।',
      hinglish: 'Cosmic portal open hai. Aapka soul purpose activate ho raha hai, stay aware.',
    },
  },
};

// ==========================================
// 8. 27 NAKSHATRAS & BABY NAME SYLLABLES
// ==========================================
export const NAKSHATRA_SYLLABLES: Record<string, string[]> = {
  Ashwini: ['Chu (चू)', 'Che (चे)', 'Cho (चो)', 'La (ला)'],
  Bharani: ['Lee (ली)', 'Lu (लू)', 'Ley (ले)', 'Lo (लो)'],
  Krittika: ['Aa (अ)', 'Ee (ई)', 'Oo (उ)', 'Eh (ए)'],
  Rohini: ['O (ओ)', 'Va (वा)', 'Vee (वी)', 'Vu (वू)'],
  Mrigashirsha: ['Ve (वे)', 'Vo (वो)', 'Ka (का)', 'Kee (की)'],
  Ardra: ['Ku (कु)', 'Gha (घ)', 'Ng (ङ)', 'Chha (छ)'],
  Punarvasu: ['Ke (के)', 'Ko (को)', 'Haa (हा)', 'Hee (ही)'],
  Pushya: ['Hoo (हू)', 'He (हे)', 'Ho (हो)', 'Daa (डा)'],
  Ashlesha: ['Dee (डी)', 'Doo (डू)', 'De (डे)', 'Do (डो)'],
  Magha: ['Maa (मा)', 'Mee (मी)', 'Moo (मू)', 'Me (मे)'],
  'Purva Phalguni': ['Mo (मो)', 'Taa (टा)', 'Tee (टी)', 'Too (टू)'],
  'Uttara Phalguni': ['Te (टे)', 'To (टो)', 'Paa (पा)', 'Pee (पी)'],
  Hasta: ['Poo (पू)', 'Sha (ष)', 'Nna (ण)', 'Tha (ठ)'],
  Chitra: ['Pe (पे)', 'Po (पो)', 'Raa (रा)', 'Ree (री)'],
  Swati: ['Roo (रू)', 'Re (रे)', 'Ro (रो)', 'Taa (ता)'],
  Vishakha: ['Tee (ती)', 'Too (तू)', 'Te (ते)', 'To (तो)'],
  Anuradha: ['Naa (ना)', 'Nee (नी)', 'Noo (तू)', 'Ne (ने)'],
  Jyeshtha: ['No (नो)', 'Yaa (या)', 'Yee (यी)', 'Yoo (यू)'],
  Mula: ['Ye (ये)', 'Yo (यो)', 'Bhaa (भा)', 'Bhee (भी)'],
  'Purva Ashadha': ['Bhoo (भू)', 'Dhaa (धा)', 'Pha (फा)', 'Dha (ढा)'],
  'Uttara Ashadha': ['Bhe (भे)', 'Bho (भो)', 'Jaa (जा)', 'Jee (जी)'],
  Shravana: ['Khee (खी)', 'Khoo (खू)', 'Khe (खे)', 'Kho (खो)'],
  Dhanishta: ['Gaa (गा)', 'Gee (गी)', 'Goo (गू)', 'Ge (गे)'],
  Shatabhisha: ['Go (गो)', 'Saa (सा)', 'See (सी)', 'Soo (सू)'],
  'Purva Bhadrapada': ['Se (से)', 'So (सो)', 'Daa (दा)', 'Dee (दी)'],
  'Uttara Bhadrapada': ['Doo (दू)', 'Tha (थ)', 'Jha (झ)', 'Nna (ञ)'],
  Revati: ['De (दे)', 'Do (दो)', 'Chaa (चा)', 'Chee (ची)'],
};
