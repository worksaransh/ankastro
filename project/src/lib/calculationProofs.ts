// Calculation Proof Generator - Shows step-by-step breakdown of all numerology calculations

export interface CalculationStep {
  step: number;
  description: { en: string; hi: string; hinglish: string };
  calculation: string;
  result: string | number;
}

export interface CalculationProof {
  numberName: string;
  finalValue: number;
  steps: CalculationStep[];
  whyThisNumber: { en: string; hi: string; hinglish: string };
  spiritualSignificance: { en: string; hi: string; hinglish: string };
}

// Pythagorean letter values
const pythagoreanValues: Record<string, number> = {
  a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9,
  j: 1, k: 2, l: 3, m: 4, n: 5, o: 6, p: 7, q: 8, r: 9,
  s: 1, t: 2, u: 3, v: 4, w: 5, x: 6, y: 7, z: 8
};

const vowels = ['a', 'e', 'i', 'o', 'u'];

// Helper to reduce number with steps
const reduceWithSteps = (num: number, preserveMaster = true): { steps: string[]; result: number } => {
  const steps: string[] = [];
  let current = num;
  
  while (current > 9 && !(preserveMaster && [11, 22, 33].includes(current))) {
    const digits = String(current).split('');
    const sum = digits.reduce((a, d) => a + parseInt(d), 0);
    steps.push(`${digits.join(' + ')} = ${sum}`);
    current = sum;
  }
  
  return { steps, result: current };
};

// Life Path Number Proof
export const generateLifePathProof = (dob: string): CalculationProof => {
  const [day, month, year] = dob.split('/').map(Number);
  const steps: CalculationStep[] = [];
  
  // Step 1: Show the date
  steps.push({
    step: 1,
    description: {
      en: 'Start with your date of birth',
      hi: 'अपनी जन्म तिथि से शुरू करें',
      hinglish: 'Apni date of birth se start karo'
    },
    calculation: `Date: ${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`,
    result: dob
  });
  
  // Step 2: Add all digits
  const allDigits = `${day}${month}${year}`.split('').map(Number);
  const digitSum = allDigits.reduce((a, b) => a + b, 0);
  steps.push({
    step: 2,
    description: {
      en: 'Add all individual digits of your birth date',
      hi: 'जन्म तिथि के सभी अंकों को जोड़ें',
      hinglish: 'Birth date ke sab digits add karo'
    },
    calculation: `${allDigits.join(' + ')} = ${digitSum}`,
    result: digitSum
  });
  
  // Step 3: Reduce if needed
  const { steps: reductionSteps, result: finalValue } = reduceWithSteps(digitSum, true);
  if (reductionSteps.length > 0) {
    steps.push({
      step: 3,
      description: {
        en: 'Reduce to single digit (keep 11, 22, 33 as Master Numbers)',
        hi: 'एक अंक में बदलें (11, 22, 33 मास्टर नंबर रखें)',
        hinglish: 'Single digit mein reduce karo (11, 22, 33 Master Numbers raho)'
      },
      calculation: reductionSteps.join(' → '),
      result: finalValue
    });
  }
  
  return {
    numberName: 'Life Path Number',
    finalValue,
    steps,
    whyThisNumber: {
      en: `Your Life Path is ${finalValue} because all the digits of your birth date (${dob}) add up to this number. This is the most important number in numerology - it reveals your life purpose, core traits, and the path you are meant to walk.`,
      hi: `आपका जीवन पथ ${finalValue} है क्योंकि आपकी जन्म तिथि (${dob}) के सभी अंक इस संख्या में जुड़ते हैं। यह अंकशास्त्र में सबसे महत्वपूर्ण संख्या है - यह आपके जीवन का उद्देश्य और मुख्य विशेषताएं बताती है।`,
      hinglish: `Aapka Life Path ${finalValue} hai kyunki aapki birth date (${dob}) ke sab digits is number mein add hote hain. Yeh numerology ka sabse important number hai - yeh aapki life purpose aur core traits batata hai.`
    },
    spiritualSignificance: getLifePathSignificance(finalValue)
  };
};

// Destiny/Expression Number Proof
export const generateDestinyProof = (fullName: string): CalculationProof => {
  const steps: CalculationStep[] = [];
  const cleanName = fullName.toLowerCase().replace(/[^a-z\s]/g, '');
  const nameParts = cleanName.split(/\s+/).filter(Boolean);
  
  // Step 1: Show the name
  steps.push({
    step: 1,
    description: {
      en: 'Start with your full birth name',
      hi: 'अपने पूरे जन्म नाम से शुरू करें',
      hinglish: 'Apne full birth name se start karo'
    },
    calculation: `Name: ${fullName.toUpperCase()}`,
    result: fullName
  });
  
  // Step 2: Show letter to number mapping
  let totalSum = 0;
  const partCalculations: string[] = [];
  
  nameParts.forEach((part, idx) => {
    const letters = part.split('');
    const values = letters.map(l => pythagoreanValues[l] || 0);
    const partSum = values.reduce((a, b) => a + b, 0);
    totalSum += partSum;
    
    const mapping = letters.map((l, i) => `${l.toUpperCase()}=${values[i]}`).join(', ');
    partCalculations.push(`${part.toUpperCase()}: ${mapping} → ${values.join('+')}=${partSum}`);
  });
  
  steps.push({
    step: 2,
    description: {
      en: 'Convert each letter to its Pythagorean number value',
      hi: 'प्रत्येक अक्षर को उसके पाइथागोरियन संख्या मूल्य में बदलें',
      hinglish: 'Har letter ko uske Pythagorean number value mein convert karo'
    },
    calculation: partCalculations.join('\n'),
    result: totalSum
  });
  
  // Step 3: Add all parts
  steps.push({
    step: 3,
    description: {
      en: 'Add all name values together',
      hi: 'सभी नाम मूल्यों को एक साथ जोड़ें',
      hinglish: 'Sab name values ko add karo'
    },
    calculation: `Total: ${totalSum}`,
    result: totalSum
  });
  
  // Step 4: Reduce if needed
  const { steps: reductionSteps, result: finalValue } = reduceWithSteps(totalSum, true);
  if (reductionSteps.length > 0) {
    steps.push({
      step: 4,
      description: {
        en: 'Reduce to single digit (keep 11, 22, 33 as Master Numbers)',
        hi: 'एक अंक में बदलें (11, 22, 33 मास्टर नंबर रखें)',
        hinglish: 'Single digit mein reduce karo (11, 22, 33 Master Numbers raho)'
      },
      calculation: reductionSteps.join(' → '),
      result: finalValue
    });
  }
  
  return {
    numberName: 'Destiny/Expression Number',
    finalValue,
    steps,
    whyThisNumber: {
      en: `Your Destiny Number is ${finalValue} because all the letters in your name "${fullName}" add up to this value. Your name carries a unique vibration that shapes your talents, goals, and what you are meant to express in this lifetime.`,
      hi: `आपकी नियति संख्या ${finalValue} है क्योंकि आपके नाम "${fullName}" के सभी अक्षर इस मूल्य में जुड़ते हैं। आपका नाम एक अद्वितीय कंपन वहन करता है जो आपकी प्रतिभाओं और लक्ष्यों को आकार देता है।`,
      hinglish: `Aapka Destiny Number ${finalValue} hai kyunki aapke naam "${fullName}" ke sab letters is value mein add hote hain. Aapka naam ek unique vibration carry karta hai jo aapki talents aur goals ko shape karta hai.`
    },
    spiritualSignificance: getDestinySignificance(finalValue)
  };
};

// Soul Urge Number Proof
export const generateSoulUrgeProof = (fullName: string): CalculationProof => {
  const steps: CalculationStep[] = [];
  const cleanName = fullName.toLowerCase().replace(/[^a-z\s]/g, '');
  
  // Step 1: Show the name
  steps.push({
    step: 1,
    description: {
      en: 'Start with your full birth name',
      hi: 'अपने पूरे जन्म नाम से शुरू करें',
      hinglish: 'Apne full birth name se start karo'
    },
    calculation: `Name: ${fullName.toUpperCase()}`,
    result: fullName
  });
  
  // Step 2: Extract vowels only
  const allLetters = cleanName.replace(/\s/g, '').split('');
  const vowelLetters = allLetters.filter(l => vowels.includes(l));
  const vowelValues = vowelLetters.map(l => pythagoreanValues[l] || 0);
  const vowelSum = vowelValues.reduce((a, b) => a + b, 0);
  
  steps.push({
    step: 2,
    description: {
      en: 'Extract only vowels (A, E, I, O, U) and their values',
      hi: 'केवल स्वर (A, E, I, O, U) और उनके मूल्य निकालें',
      hinglish: 'Sirf vowels (A, E, I, O, U) aur unke values nikalo'
    },
    calculation: `Vowels: ${vowelLetters.map((l, i) => `${l.toUpperCase()}=${vowelValues[i]}`).join(', ')}\nSum: ${vowelValues.join(' + ')} = ${vowelSum}`,
    result: vowelSum
  });
  
  // Step 3: Reduce if needed
  const { steps: reductionSteps, result: finalValue } = reduceWithSteps(vowelSum, true);
  if (reductionSteps.length > 0) {
    steps.push({
      step: 3,
      description: {
        en: 'Reduce to single digit (keep 11, 22, 33 as Master Numbers)',
        hi: 'एक अंक में बदलें (11, 22, 33 मास्टर नंबर रखें)',
        hinglish: 'Single digit mein reduce karo (11, 22, 33 Master Numbers raho)'
      },
      calculation: reductionSteps.join(' → '),
      result: finalValue
    });
  }
  
  return {
    numberName: 'Soul Urge / Heart Desire Number',
    finalValue,
    steps,
    whyThisNumber: {
      en: `Your Soul Urge is ${finalValue} because it comes from the vowels in your name. Vowels represent the soul - the hidden, inner self. This number reveals your deepest desires, what your heart truly wants, and what motivates you at the soul level.`,
      hi: `आपकी आत्मा की इच्छा ${finalValue} है क्योंकि यह आपके नाम के स्वरों से आती है। स्वर आत्मा का प्रतिनिधित्व करते हैं। यह संख्या आपकी सबसे गहरी इच्छाओं को प्रकट करती है।`,
      hinglish: `Aapki Soul Urge ${finalValue} hai kyunki yeh aapke naam ke vowels se aati hai. Vowels soul ko represent karte hain. Yeh number aapki deepest desires aur dil ki asli chahaton ko batata hai.`
    },
    spiritualSignificance: getSoulUrgeSignificance(finalValue)
  };
};

// Personality Number Proof
export const generatePersonalityProof = (fullName: string): CalculationProof => {
  const steps: CalculationStep[] = [];
  const cleanName = fullName.toLowerCase().replace(/[^a-z\s]/g, '');
  
  // Step 1: Show the name
  steps.push({
    step: 1,
    description: {
      en: 'Start with your full birth name',
      hi: 'अपने पूरे जन्म नाम से शुरू करें',
      hinglish: 'Apne full birth name se start karo'
    },
    calculation: `Name: ${fullName.toUpperCase()}`,
    result: fullName
  });
  
  // Step 2: Extract consonants only
  const allLetters = cleanName.replace(/\s/g, '').split('');
  const consonantLetters = allLetters.filter(l => !vowels.includes(l));
  const consonantValues = consonantLetters.map(l => pythagoreanValues[l] || 0);
  const consonantSum = consonantValues.reduce((a, b) => a + b, 0);
  
  steps.push({
    step: 2,
    description: {
      en: 'Extract only consonants (all letters except A, E, I, O, U)',
      hi: 'केवल व्यंजन (A, E, I, O, U के अलावा सभी अक्षर) निकालें',
      hinglish: 'Sirf consonants (A, E, I, O, U ke alawa sab letters) nikalo'
    },
    calculation: `Consonants: ${consonantLetters.map((l, i) => `${l.toUpperCase()}=${consonantValues[i]}`).join(', ')}\nSum: ${consonantValues.join(' + ')} = ${consonantSum}`,
    result: consonantSum
  });
  
  // Step 3: Reduce if needed
  const { steps: reductionSteps, result: finalValue } = reduceWithSteps(consonantSum, true);
  if (reductionSteps.length > 0) {
    steps.push({
      step: 3,
      description: {
        en: 'Reduce to single digit (keep 11, 22, 33 as Master Numbers)',
        hi: 'एक अंक में बदलें (11, 22, 33 मास्टर नंबर रखें)',
        hinglish: 'Single digit mein reduce karo (11, 22, 33 Master Numbers raho)'
      },
      calculation: reductionSteps.join(' → '),
      result: finalValue
    });
  }
  
  return {
    numberName: 'Personality Number',
    finalValue,
    steps,
    whyThisNumber: {
      en: `Your Personality Number is ${finalValue} because it comes from the consonants in your name. Consonants represent the outer self - how others see you. This is your social mask, your first impression, and the image you project to the world.`,
      hi: `आपका व्यक्तित्व अंक ${finalValue} है क्योंकि यह आपके नाम के व्यंजनों से आता है। व्यंजन बाहरी स्व का प्रतिनिधित्व करते हैं। यह आपका सामाजिक मुखौटा और पहली छाप है।`,
      hinglish: `Aapka Personality Number ${finalValue} hai kyunki yeh aapke naam ke consonants se aata hai. Consonants outer self ko represent karte hain - doosre aapko kaise dekhte hain. Yeh aapka social mask aur first impression hai.`
    },
    spiritualSignificance: getPersonalitySignificance(finalValue)
  };
};

// Birthday Number Proof
export const generateBirthdayProof = (dob: string): CalculationProof => {
  const day = parseInt(dob.split('/')[0]);
  const steps: CalculationStep[] = [];
  
  steps.push({
    step: 1,
    description: {
      en: 'Take just the day of your birth',
      hi: 'केवल अपने जन्म का दिन लें',
      hinglish: 'Sirf apne birth ka day lo'
    },
    calculation: `Day: ${day}`,
    result: day
  });
  
  let finalValue = day;
  if (day > 9 && day !== 11 && day !== 22) {
    const digits = String(day).split('').map(Number);
    finalValue = digits.reduce((a, b) => a + b, 0);
    if (finalValue > 9 && finalValue !== 11 && finalValue !== 22) {
      const secondReduce = String(finalValue).split('').map(Number).reduce((a, b) => a + b, 0);
      steps.push({
        step: 2,
        description: {
          en: 'Reduce to single digit',
          hi: 'एक अंक में बदलें',
          hinglish: 'Single digit mein reduce karo'
        },
        calculation: `${digits.join(' + ')} = ${finalValue} → ${String(finalValue).split('').join(' + ')} = ${secondReduce}`,
        result: secondReduce
      });
      finalValue = secondReduce;
    } else {
      steps.push({
        step: 2,
        description: {
          en: 'Reduce to single digit (keep 11, 22 if they appear)',
          hi: 'एक अंक में बदलें (11, 22 रखें अगर आएं)',
          hinglish: 'Single digit mein reduce karo (11, 22 rakho agar aaye)'
        },
        calculation: `${digits.join(' + ')} = ${finalValue}`,
        result: finalValue
      });
    }
  }
  
  return {
    numberName: 'Birthday Number',
    finalValue,
    steps,
    whyThisNumber: {
      en: `Your Birthday Number is ${finalValue} because you were born on the ${day}${getOrdinalSuffix(day)} of the month. This number represents a special talent or gift you brought into this life - a tool to help you fulfill your Life Path.`,
      hi: `आपका जन्मदिन अंक ${finalValue} है क्योंकि आप महीने की ${day} तारीख को पैदा हुए थे। यह संख्या एक विशेष प्रतिभा या उपहार का प्रतिनिधित्व करती है जो आप इस जीवन में लाए हैं।`,
      hinglish: `Aapka Birthday Number ${finalValue} hai kyunki aap month ki ${day} tareekh ko paida hue the. Yeh number ek special talent ya gift represent karta hai jo aap is life mein lekar aaye ho.`
    },
    spiritualSignificance: getBirthdaySignificance(finalValue)
  };
};

// Mulank Proof
export const generateMulankProof = (dob: string): CalculationProof => {
  const day = parseInt(dob.split('/')[0]);
  const steps: CalculationStep[] = [];
  
  steps.push({
    step: 1,
    description: {
      en: 'Take the day of your birth (Vedic method)',
      hi: 'अपने जन्म का दिन लें (वैदिक विधि)',
      hinglish: 'Apne birth ka day lo (Vedic method)'
    },
    calculation: `जन्म दिन / Birth Day: ${day}`,
    result: day
  });
  
  let finalValue = day;
  if (day > 9 && day !== 11 && day !== 22) {
    const digits = String(day).split('').map(Number);
    finalValue = digits.reduce((a, b) => a + b, 0);
    steps.push({
      step: 2,
      description: {
        en: 'Reduce to single digit (मूलांक)',
        hi: 'एक अंक में बदलें (मूलांक)',
        hinglish: 'Single digit mein reduce karo (Mulank)'
      },
      calculation: `${digits.join(' + ')} = ${finalValue}`,
      result: finalValue
    });
  }
  
  return {
    numberName: 'Mulank (मूलांक / जन्मांक)',
    finalValue,
    steps,
    whyThisNumber: {
      en: `Your Mulank is ${finalValue} - this is your core identity number in Vedic numerology. It represents your natural personality, how you think, and your emotional core. This number influences your daily behavior and relationships.`,
      hi: `आपका मूलांक ${finalValue} है - यह वैदिक अंकशास्त्र में आपकी मूल पहचान संख्या है। यह आपके प्राकृतिक व्यक्तित्व, सोच और भावनात्मक केंद्र को दर्शाता है।`,
      hinglish: `Aapka Mulank ${finalValue} hai - yeh Vedic numerology mein aapki core identity number hai. Yeh aapki natural personality, sochne ka tarika, aur emotional core ko represent karta hai.`
    },
    spiritualSignificance: getMulankSignificance(finalValue)
  };
};

// Bhagyank Proof
export const generateBhagyankProof = (dob: string): CalculationProof => {
  const [day, month, year] = dob.split('/').map(Number);
  const steps: CalculationStep[] = [];
  
  steps.push({
    step: 1,
    description: {
      en: 'Take your complete date of birth (Vedic method)',
      hi: 'अपनी पूरी जन्म तिथि लें (वैदिक विधि)',
      hinglish: 'Apni complete date of birth lo (Vedic method)'
    },
    calculation: `जन्म तिथि / DOB: ${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`,
    result: dob
  });
  
  const allDigits = `${day}${month}${year}`.split('').map(Number);
  const digitSum = allDigits.reduce((a, b) => a + b, 0);
  
  steps.push({
    step: 2,
    description: {
      en: 'Add all digits of the birth date',
      hi: 'जन्म तिथि के सभी अंक जोड़ें',
      hinglish: 'Birth date ke sab digits add karo'
    },
    calculation: `${allDigits.join(' + ')} = ${digitSum}`,
    result: digitSum
  });
  
  const { steps: reductionSteps, result: finalValue } = reduceWithSteps(digitSum, true);
  if (reductionSteps.length > 0) {
    steps.push({
      step: 3,
      description: {
        en: 'Reduce to single digit (भाग्यांक)',
        hi: 'एक अंक में बदलें (भाग्यांक)',
        hinglish: 'Single digit mein reduce karo (Bhagyank)'
      },
      calculation: reductionSteps.join(' → '),
      result: finalValue
    });
  }
  
  return {
    numberName: 'Bhagyank (भाग्यांक)',
    finalValue,
    steps,
    whyThisNumber: {
      en: `Your Bhagyank is ${finalValue} - this is your destiny number in Vedic numerology. It reveals your life's purpose, karmic path, and what the universe has planned for you. This number becomes more influential as you age.`,
      hi: `आपका भाग्यांक ${finalValue} है - यह वैदिक अंकशास्त्र में आपकी नियति संख्या है। यह आपके जीवन का उद्देश्य, कर्म पथ और ब्रह्मांड की आपके लिए योजना को प्रकट करता है।`,
      hinglish: `Aapka Bhagyank ${finalValue} hai - yeh Vedic numerology mein aapki destiny number hai. Yeh aapki life ka purpose, karmic path, aur universe ki aapke liye planning ko batata hai.`
    },
    spiritualSignificance: getBhagyankSignificance(finalValue)
  };
};

// Maturity Number Proof
export const generateMaturityProof = (dob: string, fullName: string): CalculationProof => {
  const lifePathProof = generateLifePathProof(dob);
  const destinyProof = generateDestinyProof(fullName);
  const steps: CalculationStep[] = [];
  
  steps.push({
    step: 1,
    description: {
      en: 'Get your Life Path Number',
      hi: 'अपना जीवन पथ अंक लें',
      hinglish: 'Apna Life Path Number lo'
    },
    calculation: `Life Path: ${lifePathProof.finalValue}`,
    result: lifePathProof.finalValue
  });
  
  steps.push({
    step: 2,
    description: {
      en: 'Get your Destiny Number',
      hi: 'अपना नियति अंक लें',
      hinglish: 'Apna Destiny Number lo'
    },
    calculation: `Destiny: ${destinyProof.finalValue}`,
    result: destinyProof.finalValue
  });
  
  const sum = lifePathProof.finalValue + destinyProof.finalValue;
  steps.push({
    step: 3,
    description: {
      en: 'Add Life Path + Destiny',
      hi: 'जीवन पथ + नियति जोड़ें',
      hinglish: 'Life Path + Destiny add karo'
    },
    calculation: `${lifePathProof.finalValue} + ${destinyProof.finalValue} = ${sum}`,
    result: sum
  });
  
  const { steps: reductionSteps, result: finalValue } = reduceWithSteps(sum, true);
  if (reductionSteps.length > 0) {
    steps.push({
      step: 4,
      description: {
        en: 'Reduce to single digit',
        hi: 'एक अंक में बदलें',
        hinglish: 'Single digit mein reduce karo'
      },
      calculation: reductionSteps.join(' → '),
      result: finalValue
    });
  }
  
  return {
    numberName: 'Maturity Number',
    finalValue,
    steps,
    whyThisNumber: {
      en: `Your Maturity Number is ${finalValue} because it combines your Life Path (${lifePathProof.finalValue}) and Destiny (${destinyProof.finalValue}). This number reveals the person you are becoming - your true self that emerges around age 45-50 when life experience meets soul purpose.`,
      hi: `आपका परिपक्वता अंक ${finalValue} है क्योंकि यह आपके जीवन पथ और नियति को जोड़ता है। यह संख्या बताती है कि आप कैसे व्यक्ति बन रहे हैं।`,
      hinglish: `Aapka Maturity Number ${finalValue} hai kyunki yeh aapke Life Path (${lifePathProof.finalValue}) aur Destiny (${destinyProof.finalValue}) ko combine karta hai. Yeh number batata hai ki aap kaise insaan ban rahe ho - 45-50 age ke baad.`
    },
    spiritualSignificance: getMaturitySignificance(finalValue)
  };
};

// Generate all proofs at once
export const generateAllProofs = (dob: string, fullName: string): CalculationProof[] => {
  return [
    generateLifePathProof(dob),
    generateDestinyProof(fullName),
    generateSoulUrgeProof(fullName),
    generatePersonalityProof(fullName),
    generateBirthdayProof(dob),
    generateMulankProof(dob),
    generateBhagyankProof(dob),
    generateMaturityProof(dob, fullName)
  ];
};

// Helper functions for significance
function getOrdinalSuffix(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

function getLifePathSignificance(num: number): { en: string; hi: string; hinglish: string } {
  const meanings: Record<number, { en: string; hi: string; hinglish: string }> = {
    1: { en: 'You are meant to be a leader, pioneer, and innovator. Your soul chose to learn independence and self-reliance.', hi: 'आप एक नेता और अग्रणी बनने के लिए हैं। आपकी आत्मा ने स्वतंत्रता सीखना चुना।', hinglish: 'Aap leader aur pioneer banne ke liye ho. Aapki soul ne independence seekhna choose kiya.' },
    2: { en: 'You are meant to be a peacemaker and partner. Your soul chose to learn cooperation, patience, and harmony.', hi: 'आप शांतिदूत और साथी बनने के लिए हैं। आपकी आत्मा ने सहयोग और धैर्य सीखना चुना।', hinglish: 'Aap peacemaker aur partner banne ke liye ho. Aapki soul ne cooperation aur patience seekhna choose kiya.' },
    3: { en: 'You are meant to be a creative communicator. Your soul chose to learn self-expression and bringing joy to others.', hi: 'आप रचनात्मक संचारक बनने के लिए हैं। आपकी आत्मा ने आत्म-अभिव्यक्ति सीखना चुना।', hinglish: 'Aap creative communicator banne ke liye ho. Aapki soul ne self-expression seekhna choose kiya.' },
    4: { en: 'You are meant to be a builder of foundations. Your soul chose to learn discipline, stability, and hard work.', hi: 'आप नींव के निर्माता बनने के लिए हैं। आपकी आत्मा ने अनुशासन और स्थिरता सीखना चुना।', hinglish: 'Aap foundation builder banne ke liye ho. Aapki soul ne discipline aur stability seekhna choose kiya.' },
    5: { en: 'You are meant to be an adventurer and freedom seeker. Your soul chose to learn adaptability and experiencing life fully.', hi: 'आप साहसी और स्वतंत्रता खोजने वाले बनने के लिए हैं।', hinglish: 'Aap adventurer aur freedom seeker banne ke liye ho. Aapki soul ne adaptability seekhna choose kiya.' },
    6: { en: 'You are meant to be a nurturer and healer. Your soul chose to learn responsibility, love, and service to family.', hi: 'आप पालनकर्ता और उपचारक बनने के लिए हैं।', hinglish: 'Aap nurturer aur healer banne ke liye ho. Aapki soul ne responsibility aur love seekhna choose kiya.' },
    7: { en: 'You are meant to be a seeker of truth. Your soul chose to learn spiritual wisdom, analysis, and inner knowing.', hi: 'आप सत्य के खोजी बनने के लिए हैं।', hinglish: 'Aap truth seeker banne ke liye ho. Aapki soul ne spiritual wisdom seekhna choose kiya.' },
    8: { en: 'You are meant to be a master of material success. Your soul chose to learn power, abundance, and karmic balance.', hi: 'आप भौतिक सफलता के मालिक बनने के लिए हैं।', hinglish: 'Aap material success master banne ke liye ho. Aapki soul ne power aur abundance seekhna choose kiya.' },
    9: { en: 'You are meant to be a humanitarian. Your soul chose to learn compassion, universal love, and selfless service.', hi: 'आप मानवतावादी बनने के लिए हैं।', hinglish: 'Aap humanitarian banne ke liye ho. Aapki soul ne compassion aur universal love seekhna choose kiya.' },
    11: { en: 'You carry a Master Number vibration of spiritual illumination. You are meant to inspire and lead others to higher awareness.', hi: 'आप आध्यात्मिक प्रकाश का मास्टर नंबर कंपन वहन करते हैं।', hinglish: 'Aap spiritual illumination ka Master Number vibration carry karte ho. Aap inspire aur lead karne ke liye ho.' },
    22: { en: 'You carry a Master Number vibration of the Master Builder. You are meant to create lasting structures that benefit humanity.', hi: 'आप मास्टर बिल्डर का मास्टर नंबर कंपन वहन करते हैं।', hinglish: 'Aap Master Builder ka Master Number vibration carry karte ho. Aap lasting structures create karne ke liye ho.' },
    33: { en: 'You carry a Master Number vibration of the Master Teacher. You are meant to heal and uplift humanity through unconditional love.', hi: 'आप मास्टर टीचर का मास्टर नंबर कंपन वहन करते हैं।', hinglish: 'Aap Master Teacher ka Master Number vibration carry karte ho. Aap heal aur uplift karne ke liye ho.' },
  };
  return meanings[num] || meanings[9];
}

function getDestinySignificance(num: number): { en: string; hi: string; hinglish: string } {
  return { 
    en: `Destiny ${num} shapes your talents and life goals. Your name vibrates to this frequency, attracting experiences that develop these qualities.`,
    hi: `नियति ${num} आपकी प्रतिभाओं और जीवन लक्ष्यों को आकार देती है।`,
    hinglish: `Destiny ${num} aapki talents aur life goals ko shape karti hai. Aapka naam is frequency pe vibrate karta hai.`
  };
}

function getSoulUrgeSignificance(num: number): { en: string; hi: string; hinglish: string } {
  return {
    en: `Soul Urge ${num} reveals what your heart truly desires. This is your inner motivation that drives you even when others don't understand.`,
    hi: `आत्मा की इच्छा ${num} बताती है कि आपका दिल वास्तव में क्या चाहता है।`,
    hinglish: `Soul Urge ${num} batata hai ki aapka dil asal mein kya chahta hai. Yeh aapki inner motivation hai.`
  };
}

function getPersonalitySignificance(num: number): { en: string; hi: string; hinglish: string } {
  return {
    en: `Personality ${num} is how others see you. This is the image you project, your social mask, and first impressions you create.`,
    hi: `व्यक्तित्व ${num} दिखाता है कि दूसरे आपको कैसे देखते हैं।`,
    hinglish: `Personality ${num} dikhata hai ki doosre aapko kaise dekhte hain. Yeh aapka social mask aur first impression hai.`
  };
}

function getBirthdaySignificance(num: number): { en: string; hi: string; hinglish: string } {
  return {
    en: `Birthday ${num} is a special gift or talent you brought into this life. Use this ability to support your Life Path journey.`,
    hi: `जन्मदिन ${num} एक विशेष उपहार या प्रतिभा है जो आप इस जीवन में लाए।`,
    hinglish: `Birthday ${num} ek special gift ya talent hai jo aap is life mein lekar aaye ho. Ise apne Life Path journey mein use karo.`
  };
}

function getMulankSignificance(num: number): { en: string; hi: string; hinglish: string } {
  return {
    en: `Mulank ${num} is your core identity in Vedic numerology. It shows your natural personality and daily behavior patterns.`,
    hi: `मूलांक ${num} वैदिक अंकशास्त्र में आपकी मूल पहचान है।`,
    hinglish: `Mulank ${num} Vedic numerology mein aapki core identity hai. Yeh aapki natural personality aur daily behavior batata hai.`
  };
}

function getBhagyankSignificance(num: number): { en: string; hi: string; hinglish: string } {
  return {
    en: `Bhagyank ${num} is your destiny path in Vedic tradition. It reveals your karmic purpose and what you are meant to achieve in this lifetime.`,
    hi: `भाग्यांक ${num} वैदिक परंपरा में आपका नियति पथ है।`,
    hinglish: `Bhagyank ${num} Vedic tradition mein aapka destiny path hai. Yeh aapka karmic purpose aur is life mein kya achieve karna hai batata hai.`
  };
}

function getMaturitySignificance(num: number): { en: string; hi: string; hinglish: string } {
  return {
    en: `Maturity ${num} is who you are becoming. This energy becomes stronger after age 45-50 as you integrate life experience with soul purpose.`,
    hi: `परिपक्वता ${num} दिखाता है कि आप कैसे व्यक्ति बन रहे हैं।`,
    hinglish: `Maturity ${num} dikhata hai ki aap kaise insaan ban rahe ho. Yeh energy 45-50 age ke baad strong hoti hai.`
  };
}
