// Remedies / Upay content — number-wise (1-9), 3 languages. Additive.
export interface Remedy {
  number: number;
  planet: string;
  color: { en: string; hi: string };
  day: string;
  gemstone: { en: string; hi: string };
  mantra: string;
  remedies: { en: string[]; hi: string[]; hinglish: string[] };
}

export const REMEDIES: Record<number, Remedy> = {
  1: {
    number: 1, planet: "Sun (Surya)", color: { en: "Gold / Orange", hi: "सुनहरा / नारंगी" }, day: "Sunday",
    gemstone: { en: "Ruby", hi: "माणिक" }, mantra: "Om Suryaya Namah",
    remedies: {
      en: ["Offer water to the rising Sun each morning", "Wear gold or copper", "Donate wheat or jaggery on Sundays", "Respect your father and elders"],
      hi: ["रोज़ सुबह उगते सूर्य को जल अर्पित करें", "सोना या तांबा पहनें", "रविवार को गेहूँ या गुड़ दान करें", "पिता और बड़ों का सम्मान करें"],
      hinglish: ["Roz subah ugte Surya ko jal arpit karo", "Sona ya tamba pehno", "Sunday ko gehoon ya gud daan karo", "Pita aur elders ka respect karo"],
    },
  },
  2: {
    number: 2, planet: "Moon (Chandra)", color: { en: "White / Silver", hi: "सफ़ेद / चाँदी" }, day: "Monday",
    gemstone: { en: "Pearl", hi: "मोती" }, mantra: "Om Chandraya Namah",
    remedies: {
      en: ["Keep water in a silver glass by your bed", "Wear white on Mondays", "Donate milk or rice", "Respect your mother; stay calm"],
      hi: ["बिस्तर के पास चाँदी के गिलास में जल रखें", "सोमवार को सफ़ेद पहनें", "दूध या चावल दान करें", "माँ का सम्मान करें; शांत रहें"],
      hinglish: ["Bed ke paas silver glass mein paani rakho", "Monday ko white pehno", "Doodh ya chawal daan karo", "Maa ka respect karo; calm raho"],
    },
  },
  3: {
    number: 3, planet: "Jupiter (Guru)", color: { en: "Yellow", hi: "पीला" }, day: "Thursday",
    gemstone: { en: "Yellow Sapphire", hi: "पुखराज" }, mantra: "Om Gurave Namah",
    remedies: {
      en: ["Wear yellow on Thursdays", "Donate turmeric, gram dal or bananas", "Respect teachers and gurus", "Apply a saffron/turmeric tilak"],
      hi: ["गुरुवार को पीला पहनें", "हल्दी, चना दाल या केला दान करें", "गुरु-शिक्षकों का सम्मान करें", "केसर/हल्दी का तिलक लगाएँ"],
      hinglish: ["Thursday ko yellow pehno", "Haldi, chana dal ya kele daan karo", "Teachers aur gurus ka respect karo", "Kesar/haldi ka tilak lagao"],
    },
  },
  4: {
    number: 4, planet: "Rahu", color: { en: "Grey / Blue", hi: "धूसर / नीला" }, day: "Saturday",
    gemstone: { en: "Hessonite (Gomed)", hi: "गोमेद" }, mantra: "Om Rahave Namah",
    remedies: {
      en: ["Keep a square piece of silver with you", "Donate black/brown items, mustard oil", "Feed stray dogs", "Avoid shortcuts and dishonesty"],
      hi: ["चाँदी का चौकोर टुकड़ा साथ रखें", "काले/भूरे सामान, सरसों तेल दान करें", "आवारा कुत्तों को खिलाएँ", "शॉर्टकट और बेईमानी से बचें"],
      hinglish: ["Silver ka square piece saath rakho", "Kaale/brown saamaan, sarson tel daan karo", "Stray dogs ko khilao", "Shortcuts aur beimani se bacho"],
    },
  },
  5: {
    number: 5, planet: "Mercury (Budh)", color: { en: "Green", hi: "हरा" }, day: "Wednesday",
    gemstone: { en: "Emerald", hi: "पन्ना" }, mantra: "Om Budhaya Namah",
    remedies: {
      en: ["Wear green on Wednesdays", "Donate green moong dal", "Feed green grass to cows", "Keep a tulsi plant at home"],
      hi: ["बुधवार को हरा पहनें", "हरी मूंग दाल दान करें", "गाय को हरी घास खिलाएँ", "घर में तुलसी का पौधा रखें"],
      hinglish: ["Wednesday ko green pehno", "Hari moong dal daan karo", "Gaay ko hari ghaas khilao", "Ghar mein tulsi ka paudha rakho"],
    },
  },
  6: {
    number: 6, planet: "Venus (Shukra)", color: { en: "White / Pink", hi: "सफ़ेद / गुलाबी" }, day: "Friday",
    gemstone: { en: "Diamond / Opal", hi: "हीरा / ओपल" }, mantra: "Om Shukraya Namah",
    remedies: {
      en: ["Wear white or pastel on Fridays", "Donate white sweets, curd or perfume", "Keep your home beautiful and clean", "Respect women"],
      hi: ["शुक्रवार को सफ़ेद या हल्के रंग पहनें", "सफ़ेद मिठाई, दही या इत्र दान करें", "घर सुंदर और स्वच्छ रखें", "महिलाओं का सम्मान करें"],
      hinglish: ["Friday ko white ya pastel pehno", "White sweets, dahi ya perfume daan karo", "Ghar sundar aur clean rakho", "Mahilaon ka respect karo"],
    },
  },
  7: {
    number: 7, planet: "Ketu", color: { en: "Smoky / Grey", hi: "धुएँ जैसा / धूसर" }, day: "Saturday",
    gemstone: { en: "Cat's Eye (Lehsunia)", hi: "लहसुनिया" }, mantra: "Om Ketave Namah",
    remedies: {
      en: ["Meditate daily; keep a spiritual practice", "Donate to or feed dogs", "Keep a fast on Saturdays if comfortable", "Avoid intoxicants"],
      hi: ["रोज़ ध्यान करें; आध्यात्मिक अभ्यास रखें", "कुत्तों को दान/भोजन दें", "सुविधानुसार शनिवार व्रत रखें", "नशे से बचें"],
      hinglish: ["Roz meditate karo; spiritual practice rakho", "Dogs ko daan/khaana do", "Comfortable ho to Saturday vrat rakho", "Intoxicants se bacho"],
    },
  },
  8: {
    number: 8, planet: "Saturn (Shani)", color: { en: "Black / Dark Blue", hi: "काला / गहरा नीला" }, day: "Saturday",
    gemstone: { en: "Blue Sapphire (Neelam)", hi: "नीलम" }, mantra: "Om Shanaye Namah",
    remedies: {
      en: ["Light a mustard-oil lamp on Saturdays", "Donate black sesame, iron, or black cloth", "Serve labourers and the underprivileged", "Be patient and honest in work"],
      hi: ["शनिवार को सरसों तेल का दीपक जलाएँ", "काले तिल, लोहा या काला वस्त्र दान करें", "मज़दूरों और वंचितों की सेवा करें", "काम में धैर्य और ईमानदारी रखें"],
      hinglish: ["Saturday ko sarson tel ka deepak jalao", "Kaale til, loha ya kaala kapda daan karo", "Mazdooron aur underprivileged ki seva karo", "Kaam mein patience aur honesty rakho"],
    },
  },
  9: {
    number: 9, planet: "Mars (Mangal)", color: { en: "Red", hi: "लाल" }, day: "Tuesday",
    gemstone: { en: "Red Coral (Moonga)", hi: "मूंगा" }, mantra: "Om Mangalaya Namah",
    remedies: {
      en: ["Wear red on Tuesdays", "Donate red lentils (masoor) or jaggery", "Offer sindoor at a Hanuman temple", "Channel anger into exercise/sport"],
      hi: ["मंगलवार को लाल पहनें", "मसूर दाल या गुड़ दान करें", "हनुमान मंदिर में सिंदूर अर्पित करें", "क्रोध को व्यायाम/खेल में लगाएँ"],
      hinglish: ["Tuesday ko red pehno", "Masoor dal ya gud daan karo", "Hanuman mandir mein sindoor arpit karo", "Gusse ko exercise/sport mein lagao"],
    },
  },
};

export const getRemediesForNumber = (num: number): Remedy => {
  const n = ((num - 1) % 9 + 9) % 9 + 1;
  return REMEDIES[n] || REMEDIES[1];
};
