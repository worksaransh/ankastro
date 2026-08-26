/**
 * ANKJYOTISH AI — PHOTOREALISTIC IMAGE GENERATION PROMPTS
 * Prepared by Creative Director & Senior UI Designer
 * 
 * Instructions:
 * 1. Use these prompts in Midjourney v6 (with --ar 16:9 or --ar 4:3) or DALL-E 3 via ChatGPT.
 * 2. Theme: Spiritual but Professional, Vedic Cosmic Luxury, Deep Violet/Midnight Blue gradients, warm Golden Auras.
 * 3. Human Subjects: Photorealistic Indian faces, natural skin textures (not plastic/airbrushed), realistic clothing, modern setups.
 */

export interface ImagePrompt {
  location: string;
  filename: string;
  dimensions: string;
  concept: string;
  midjourneyPrompt: string;
  dallePrompt: string;
}

export const IMAGE_THEME_GUIDELINES = {
  colors: "Dominant: Midnight Purple (#120326), Deep Violet (#1e053a), Dark Obsidian (#07020f). Accents: Warm Radiant Gold (#d4af37), Astral Gold (#f3e7ff).",
  aesthetic: "Vedic Cosmic Luxury. Blends ancient sacred geometry (Lo Shu Grid, Chakras, Mandalas) with high-end modern Indian lifestyle (premium interiors, smart technology, professional workspaces).",
  skinToneAndFaces: "Authentic, diverse Indian skin tones (wheatish, dusky, warm olive). Avoid flat airbrushed complexions. Real skin textures (pores, subtle moles, natural expression lines) are mandatory. Expressions: Calm confidence, introspective smile, high-trust eye contact.",
  photographyStyle: "Shot on Hasselblad H6D-100c, 85mm f/1.4 lens, cinematic volumetric lighting, warm gold hour rays filtering in, shallow depth of field, premium bokeh, high-fashion editorial texture."
};

export const CORE_PAGES_PROMPTS: ImagePrompt[] = [
  {
    location: "Homepage Hero Banner",
    filename: "homepage_hero.jpg",
    dimensions: "1600 x 900 px (16:9)",
    concept: "A majestic blend of ancient Indian astronomy and modern cosmic energy, inviting seekers into their self-realization journey.",
    midjourneyPrompt: "A premium widescreen banner of a modern Indian digital mandala glowing with golden sacred geometry, floating above a deep indigo-violet space background, soft golden rays, floating numbers (1-9) made of stardust, elegant, spiritual, high luxury aesthetic, shot on 35mm lens, photorealistic --ar 16:9 --v 6.0",
    dallePrompt: "A premium widescreen cosmic banner in 16:9 aspect ratio. The background is a rich dark purple and midnight blue gradient with faint stardust. In the center, a highly detailed, modern digital mandala inspired by Indian sacred geometry glows with warm golden light. Delicate numbers from 1 to 9, made of glowing golden particles, float gracefully around the mandala. The lighting is soft and volumetric, creating a luxurious and spiritual Vedic technology atmosphere. No text."
  },
  {
    location: "Plus Membership Landing Page",
    filename: "plus_membership_hero.jpg",
    dimensions: "1600 x 900 px (16:9)",
    concept: "A daily spiritual guidance pass representing clarity, lucky timing, and personal AI advisor.",
    midjourneyPrompt: "A premium cosmic pass card floating in mid-air, dark violet glassmorphic design, gold metallic edges, embossed with a glowing golden sun and stars, background of a cozy modern Indian apartment during sunrise, soft golden hour sunlight filtering through sheer curtains, photorealistic, cinematic lighting --ar 16:9 --v 6.0",
    dallePrompt: "A widescreen 16:9 banner featuring a premium digital card (spiritual pass) floating in a modern, luxury Indian apartment. The card is made of dark purple glass with polished gold borders, containing an emblem of a golden sun. The background shows a warm, sunlit room at sunrise with soft golden light filtering through a window, creating a serene and high-trust atmosphere. Cinematic focus, photorealistic."
  },
  {
    location: "Pricing Page Header Background",
    filename: "pricing_cosmic_wheel.jpg",
    dimensions: "1920 x 400 px (widescreen band)",
    concept: "Cosmic alignments representing different tiers of life maps.",
    midjourneyPrompt: "An abstract band of three concentric golden planetary orbits aligning together in cosmic purple space, glowing stardust trails, ancient Vedic zodiac wheel engravings on the gold rings, ultra-detailed, premium luxury layout --ar 21:9 --v 6.0",
    dallePrompt: "An abstract, wide banner showing three golden concentric planetary rings aligning perfectly against a dark violet space background. The golden rings have detailed, ancient Vedic numerology and zodiac symbols engraved on them. Nebulas and stardust glow softly, symbolizing lifetime paths and alignments. Premium luxury, high contrast."
  }
];

export const REPORTS_PROMPTS = {
  name_correction: {
    banner: {
      location: "Name Correction Report Banner",
      filename: "public/images/reports/name-correction/banner.jpg",
      dimensions: "1600 x 900 px (16:9)",
      midjourneyPrompt: "Premium cosmic banner, deep violet to midnight gradient, a stylized signature written in glowing liquid gold, flowing elegantly across the screen, surrounded by floating golden Chaldean numerology numbers, Indian spiritual luxury vibe, shot on 50mm, photorealistic --ar 16:9 --v 6.0",
      dallePrompt: "A high-end 16:9 cosmic banner. A deep violet and obsidian background. Across the center, a beautiful, abstract signature is written in glowing liquid gold, creating a wave of light. Tiny, elegant numerology numbers float around the signature. The lighting is rich, warm, and luxurious, resembling Vedic golden hora aura. No text."
    },
    proof: {
      location: "Name Correction Proof Image",
      filename: "public/images/reports/name-correction/proof-1.jpg",
      dimensions: "800 x 600 px (4:3)",
      midjourneyPrompt: "A professional Indian woman in her early 30s, wearing a premium cream linen saree, looking at her smartphone in a modern well-lit office with warm wooden interiors, she has a calm, confident, and satisfied expression, close-up, authentic skin texture, natural lighting, shot on 85mm f/1.8 lens --ar 4:3 --v 6.0",
      dallePrompt: "A realistic photograph of a professional Indian woman in her early 30s, dressed in a elegant cream linen saree. She is in a modern, warmly lit office setting, looking at her smartphone with a happy and satisfied expression. Authentic facial details, natural skin texture with visible pores, soft background blur, shot on an 85mm lens. No artificial plastic look."
    }
  },
  mobile_numerology: {
    banner: {
      location: "Mobile Numerology Report Banner",
      filename: "public/images/reports/mobile-numerology/banner.jpg",
      dimensions: "1600 x 900 px (16:9)",
      midjourneyPrompt: "Cosmic banner, a high-end smartphone with a dark glass screen, glowing golden numerology digits (1-9) emerging from the screen as trails of stardust, background is deep indigo-purple with golden flares, premium tech-spiritual hybrid, photorealistic --ar 16:9 --v 6.0",
      dallePrompt: "A 16:9 banner featuring a premium smartphone with a glossy screen. Trails of glowing golden stardust and numerology numbers (1 to 9) emerge from the screen. The background is a luxurious dark violet and deep blue gradient. High-tech meets ancient spirituality, warm golden accent lighting. No text."
    },
    proof: {
      location: "Mobile Numerology Proof Image",
      filename: "public/images/reports/mobile-numerology/proof-1.jpg",
      dimensions: "800 x 600 px (4:3)",
      midjourneyPrompt: "A successful Indian businessman in his late 30s, wearing a tailored navy blazer, standing in a modern Gurgaon high-rise lobby during sunset, looking at his phone with a pleasant smile of victory, natural lighting, shot on 50mm lens, photorealistic, realistic skin texture --ar 4:3 --v 6.0",
      dallePrompt: "A photorealistic picture of a successful Indian man in his late 30s, wearing a well-fitted navy blue blazer. He is standing in a modern corporate building lobby with sunset light streaming in, smiling warmly as he looks at his mobile phone. High trust, realistic skin texture with minor lines, natural eye contact, 50mm portrait shot."
    }
  },
  vehicle_numerology: {
    banner: {
      location: "Vehicle Numerology Report Banner",
      filename: "public/images/reports/vehicle-numerology/banner.jpg",
      dimensions: "1600 x 900 px (16:9)",
      midjourneyPrompt: "A premium SUV number plate glowing with a warm golden protective energy shield, floating in a dark purple cosmic space with constellations, auspicious Vedic energy aura, safety and luxury, photorealistic --ar 16:9 --v 6.0",
      dallePrompt: "A 16:9 banner showing a clean luxury car license plate glowing with a warm golden light beam, representing protective energy and luck. The backdrop is a deep cosmic purple with subtle constellations. The theme is safe journeys and spiritual alignment. No text."
    },
    proof: {
      location: "Vehicle Numerology Proof Image",
      filename: "public/images/reports/vehicle-numerology/proof-1.jpg",
      dimensions: "800 x 600 px (4:3)",
      midjourneyPrompt: "A happy Indian family (husband, wife, and child) receiving the keys to a new premium SUV at a modern dealership, warm emotional smiles, realistic expressions, professional clothing, natural overhead light, shot on 35mm lens, photorealistic --ar 4:3 --v 6.0",
      dallePrompt: "A realistic photograph of a middle-class Indian couple in their mid-30s with their 7-year-old child, happily receiving the keys to their new SUV. They have natural, joyful expressions, dressed in modern smart-casual outfits. The setting is a brightly lit car showroom. Photorealistic, shot on 35mm lens."
    }
  },
  career_numerology: {
    banner: {
      location: "Career Numerology Report Banner",
      filename: "public/images/reports/career-numerology/banner.jpg",
      dimensions: "1600 x 900 px (16:9)",
      midjourneyPrompt: "A golden pathway representing a career timeline made of glowing cosmic numbers (1-9), ascending upwards into a deep indigo sky, distant golden galaxy core, ambition and destiny, luxury spiritual aesthetic --ar 16:9 --v 6.0",
      dallePrompt: "A 16:9 cosmic banner showing a golden path built from glowing, structured numbers ascending towards a distant radiant golden galaxy core in a dark purple sky. The theme is destiny, ambition, and professional career alignment. Beautiful volumetric lighting."
    },
    proof: {
      location: "Career Numerology Proof Image",
      filename: "public/images/reports/career-numerology/proof-1.jpg",
      dimensions: "800 x 600 px (4:3)",
      midjourneyPrompt: "A confident young Indian male entrepreneur sitting in a chic modern co-working space in Bangalore, laptop open on a wooden desk, he is smiling introspectively at his progress, wearing a smart casual linen shirt, wheatish skin tone, authentic lighting, shot on 85mm lens --ar 4:3 --v 6.0",
      dallePrompt: "A realistic photo of a young Indian male professional in his late 20s, wearing a high-quality beige linen shirt. He is sitting at a wooden desk in a modern Bangalore office with a laptop in front of him, expressing a confident and optimistic smile. Natural light, visible skin pores, authentic look, 85mm lens."
    }
  },
  baby_name: {
    banner: {
      location: "Baby Name Report Banner",
      filename: "public/images/reports/baby-name/banner.jpg",
      dimensions: "1600 x 900 px (16:9)",
      midjourneyPrompt: "A luxury wooden baby cradle surrounded by glowing golden constellations and floating soft numbers, pastel violet and warm gold light, blessing and protection vibe, no text --ar 16:9 --v 6.0",
      dallePrompt: "A soft, beautiful 16:9 banner showing an empty, premium wooden baby cradle. Glowing golden stars and numbers float gently around it, creating a protective blessing aura. The background is a soft pastel purple and warm gold gradient. Spiritual and warm."
    },
    proof: {
      location: "Baby Name Proof Image",
      filename: "public/images/reports/baby-name/proof-1.jpg",
      dimensions: "800 x 600 px (4:3)",
      midjourneyPrompt: "A loving Indian couple in their late 20s holding their newborn baby wrapped in a soft blanket, warm Delhi home interior, natural window lighting, expressions of pure love and joy, photorealistic, shot on 50mm f/1.4 lens --ar 4:3 --v 6.0",
      dallePrompt: "A realistic close-up photo of a young Indian husband and wife in their home, holding their newborn baby. The parents have warm, emotional expressions of joy. Natural soft window lighting, realistic skin details, cozy home setting, high-trust appearance, shot on 50mm."
    }
  },
  compatibility_report: {
    banner: {
      location: "Compatibility Report Banner",
      filename: "public/images/reports/compatibility/banner.jpg",
      dimensions: "1600 x 900 px (16:9)",
      midjourneyPrompt: "Two glowing golden numerology numbers (2 and 6) merging to create a single glowing heart of stardust, deep violet-midnight gradient background, rose-gold accents, destiny of love, premium, no text --ar 16:9 --v 6.0",
      dallePrompt: "A 16:9 cosmic banner. Two large, glowing golden numbers align and merge into a single beautiful heart made of stars and dust. The background is deep violet with subtle rose-gold galaxy swirls. Highly romantic and spiritual. No text."
    },
    proof: {
      location: "Compatibility Proof Image",
      filename: "public/images/reports/compatibility/proof-1.jpg",
      dimensions: "800 x 600 px (4:3)",
      midjourneyPrompt: "A happy Indian married couple in their early 30s, sitting close on a sofa, laughing together, warm ambient home lighting, wearing stylish casual home clothing, high trust, natural skin textures, shot on 50mm lens --ar 4:3 --v 6.0",
      dallePrompt: "A realistic photograph of a young Indian husband and wife in their living room, sharing a genuine laugh. They are sitting close on a sofa, showing deep affection and happiness. Warm indoor lighting, wheatish skin tones with natural textures, 50mm portrait shot."
    }
  }
};
