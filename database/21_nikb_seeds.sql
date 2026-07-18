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
