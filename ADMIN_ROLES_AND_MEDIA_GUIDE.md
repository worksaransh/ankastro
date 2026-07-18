# AnkJyotish AI — Admin Roles + Media (Images/Videos) Guide
### Super admin kab chahiye + images/videos kaise add karein + AI prompts

---

# PART 1: ADMIN ROLES — Super Admin Chahiye Ya Nahi?

## Honest Answer: ABHI NAHI (aap solo ho)

Aap ek hi admin ho. Multiple roles tab chahiye jab team grow ho.
Maine ek **optional** upgrade bana diya hai — jab zaroorat ho tab chalao.

## 3 Role Levels (optional — `19_media_and_roles.sql` mein)

| Role | Kya Access | Kab Use |
|------|-----------|---------|
| **super_admin** | Sab kuch + user roles manage | Aap (owner) |
| **admin** | Sab kuch except role management | Trusted partner |
| **editor** | Sirf content (blog, reports, images) — payments/users NAHI | VA / content writer |

## Kab Setup Karo:
**Abhi:** kuch mat karo — current single `admin` (aap) kaafi hai.

**Jab VA hire karo:**
1. `19_media_and_roles.sql` chalao (roles add honge)
2. VA ko signup karao site pe
3. SQL Editor mein (STAFF_EMAIL replace karke):
```sql
INSERT INTO public.user_roles (id, user_id, role, created_at)
SELECT gen_random_uuid(), id, 'editor'::public.app_role, now()
FROM auth.users WHERE email = 'STAFF_EMAIL'
ON CONFLICT DO NOTHING;
```
4. Ab VA blog/reports edit kar sakta hai, par payments/users nahi dekh sakta

> **Note:** Editor role ke liye frontend mein abhi alag UI nahi — ye DB-level permission hai. Agar aapko editor ke liye limited admin panel chahiye to bolo, bana dunga.

---

# PART 2: IMAGES & VIDEOS — Kahan, Kaise Add Karein

## Sabse Pehle: Storage Bucket Banao (ek baar)
`19_media_and_roles.sql` chalao → `media` aur `blog-images` buckets ban jaayenge.
**Ye zaroori hai** — iske bina image upload fail hoga.

## Ab Image/Video Yahan Add Kar Sakte Ho:

### A. Report Landing Pages (NEW — abhi add kiya)
```
Admin → Pages tab → Report Content → koi report select karo
→ "Hero Image" section dikhega
→ "Upload Image" click karo (ya URL paste) → image upload
→ video chahiye to "YouTube URL" field mein link daalo
→ Save
```
**Dikhega:** /report/[slug] page ke hero mein (title ke neeche)
**Language-wise:** har language (en/hi/hinglish) ke liye alag image set kar sakte ho

### B. Blog Posts (already tha)
```
Admin → Blog tab → New/Edit post → "Featured Image" → Upload
```

### C. Landing Pages — Custom (already tha)
```
Admin → Pages → Landing Pages → Add Block
→ "image" block (upload) ya "youtube" block (video URL)
```

### D. Logo / Branding (already tha)
```
Admin → Settings → Branding → Logo Upload
```

## Image Specs (best results):
| Use | Size | Format |
|-----|------|--------|
| Report hero | 1200×800px | JPG/PNG/WebP |
| Blog featured | 1200×630px | JPG/WebP |
| Logo | 400×400px (transparent) | PNG |
| Max file size | 5MB | — |

## Video:
- YouTube link paste karo (full URL ya video ID dono chalega)
- Auto-embed ho jayega
- Apni video pehle YouTube pe upload karo (unlisted bhi chalega)

---

# PART 3: AI IMAGE PROMPTS (Realistic, Report-wise)

Ye prompts use karo **Midjourney / DALL-E / Leonardo / Ideogram** mein.
Har report ke liye specific, realistic, Indian-context prompt.
**Cosmic theme: violet, gold, deep blue — brand match karega.**

## 1. Name Correction Report
```
A serene Indian woman in her 30s writing her name in elegant golden calligraphy 
on parchment, soft violet and gold cosmic background with subtle numerology 
symbols floating, warm spiritual lighting, professional photography style, 
shallow depth of field, mystical but premium aesthetic, 4k, photorealistic
```

## 2. Mobile Number Numerology
```
A modern smartphone displaying glowing golden numbers floating above the screen, 
held by Indian hands, deep violet cosmic background with constellation patterns, 
numerology digits 1-9 softly glowing in gold, premium tech-meets-spirituality 
aesthetic, professional product photography, cinematic lighting, 4k photorealistic
```

## 3. Vehicle Number Report
```
A car license plate with glowing golden numbers, parked car silhouette against 
a mystical violet twilight sky with stars, subtle numerology wheel overlay, 
auspicious spiritual energy, professional automotive photography with cosmic 
spiritual elements, warm golden hour lighting, 4k photorealistic
```

## 4. Career & Job Prediction
```
A confident Indian professional standing at a crossroads with multiple glowing 
golden paths ahead, cosmic violet background with career symbols (briefcase, 
graph, building) softly glowing, numerology numbers in the sky, inspirational 
and premium aesthetic, professional photography, cinematic golden lighting, 4k
```

## 5. Lucky Baby Name Report
```
A peaceful newborn baby sleeping, soft golden numerology symbols and stars 
floating gently above, warm violet and cream cosmic nursery background, 
tender spiritual blessing atmosphere, soft dreamy lighting, professional 
newborn photography with mystical golden elements, 4k photorealistic, gentle
```

## 6. Love & Marriage Compatibility
```
Two interlocking golden rings with glowing numerology numbers, romantic Indian 
couple silhouette in background, deep violet and rose cosmic atmosphere with 
heart constellation, premium spiritual wedding aesthetic, warm romantic lighting, 
professional photography, 4k photorealistic, elegant and emotional
```

## 7. Business Numerology Report
```
A modern Indian business storefront or office with a glowing golden business 
name sign, numerology numbers radiating prosperity energy, deep violet cosmic 
sky with abundance symbols, professional and premium aesthetic, success and 
growth atmosphere, cinematic golden lighting, 4k photorealistic
```

## 8. Property & House Number Report
```
A beautiful Indian home with a glowing golden house number plate, warm 
welcoming light from windows, mystical violet evening sky with star patterns, 
Vastu and numerology energy symbols softly glowing, peaceful prosperous home 
aesthetic, professional architectural photography with spiritual elements, 4k
```

## 9. Marriage Timing & Matching Report
```
An elegant Indian wedding scene with golden mandala patterns, glowing 
numerology numbers and auspicious timing symbols in cosmic violet sky, 
two souls connecting with golden light thread, premium spiritual matrimony 
aesthetic, warm celebratory lighting, professional photography, 4k photorealistic
```

## Brand/Hero Image (Homepage)
```
A mystical cosmic numerology mandala with glowing golden numbers 1-9 arranged 
in sacred geometry, deep violet and midnight blue universe background with 
stars and nebula, central glowing Om or lotus symbol in gold, premium spiritual 
brand aesthetic, ethereal and trustworthy, 4k photorealistic, elegant
```

---

# PART 4: AI VIDEO PROMPTS (for Runway / Pika / Sora / Kling)

## Report Explainer (short, 5-10 sec loop)
```
Slow cinematic zoom into a glowing golden numerology wheel rotating gently in 
deep violet cosmic space, numbers 1-9 illuminating one by one, soft particle 
effects, premium spiritual brand aesthetic, smooth motion, 4k
```

## Homepage Hero Background (looping)
```
Gentle floating golden numerology symbols and constellation lines slowly 
drifting across a deep violet cosmic background, subtle particle glow, 
calm meditative motion, seamless loop, premium aesthetic, 4k
```

## Testimonial Background
```
Soft abstract violet and gold bokeh lights gently moving, warm spiritual 
atmosphere, blurred cosmic background suitable for text overlay, slow calm 
motion, seamless loop, 4k
```

---

# PART 5: WHERE AI IMAGES GO (step-by-step)

```
1. AI se image generate karo (upar wala prompt use karke)
2. Download karo (JPG/PNG)
3. Admin → Pages → Report Content → report select
4. "Hero Image" → "Upload Image" → file choose
5. Save
6. /report/[slug] kholo → image dikhegi
```

## Pro Tip — Consistency:
Sabhi 9 reports ke liye **same style** rakho (violet+gold cosmic).
Tab brand professional aur trustworthy lagega — competitor jaisa.

---

# SETUP CHECKLIST

```
[ ] 19_media_and_roles.sql chalao (media bucket + optional roles)
[ ] npm run build + dist upload
[ ] Admin → Pages → Report Content → ek report → Hero Image upload → Save
[ ] /report/[slug] → image dikhe (verify)
[ ] (optional) Super admin: APNA_EMAIL se super_admin role set karo
[ ] (optional) VA hire karo to editor role do
```

---

## Summary
- **Super admin:** abhi nahi chahiye (solo ho). Optional upgrade ready hai.
- **Images/Videos:** ab report landing pe bhi add kar sakte ho (pehle sirf blog/branding tha)
- **AI prompts:** 9 reports + hero + video — sab realistic, brand-matched
- **Bucket:** `19_media_and_roles.sql` zaroor chalao warna upload fail hoga

Sab additive, live site safe. 🙏
