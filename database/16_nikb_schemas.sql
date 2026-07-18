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
