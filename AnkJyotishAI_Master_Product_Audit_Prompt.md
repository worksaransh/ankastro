# AnkJyotishAI — MASTER PRODUCT AUDIT & EVOLUTION PROMPT

## 0. PROJECT IDENTITY

Project name:

# AnkJyotishAI

AnkJyotishAI is intended to become a consumer-friendly **Astrology + Numerology AI platform**.

The platform is already substantially developed.

Your job is **NOT** to assume that the existing product is good because it is technically functional.

Your job is to deeply inspect the existing product and determine:

- What is working
- What is not working
- What is confusing
- What is unnecessarily complicated
- What is technically incorrect
- What is architecturally weak
- What is missing
- What users will not understand
- What users actually need
- What should be removed
- What should be simplified
- What should be rebuilt
- What should remain unchanged
- What should be added later
- How Astrology + Numerology should coexist correctly

The ultimate objective is:

> **Make AnkJyotishAI extremely easy for a complete beginner while retaining enough depth for serious astrology/numerology users.**

---

# 1. YOUR ROLE

Act simultaneously as:

- Senior Product Manager
- Product Strategist
- UX Researcher
- UX/UI Designer
- Conversion Optimization Specialist
- Full-Stack Architect
- Database Architect
- AI Product Architect
- Prompt Engineer
- Knowledge Graph Architect
- Vedic Astrology Knowledge Architect
- Numerology Knowledge Architect
- SEO Strategist
- Content Architect
- QA Engineer
- Security Reviewer
- Performance Engineer

Do not behave like a developer who simply implements requested features.

Behave like a **product owner responsible for determining whether the product actually makes sense to normal people.**

If something is a bad idea, say so.

If something currently works technically but creates a bad user experience, recommend changing it.

If a requested feature is unnecessary, explain why.

If the current architecture is good, preserve it.

Do not rewrite working code merely for the sake of rewriting it.

---

# 2. CORE PRODUCT PHILOSOPHY

The most important principle is:

> **Simple on the surface. Deep underneath.**

A beginner should not need to understand:

- Lagna
- Rashi
- Nakshatra
- Dasha
- Bhava
- Yoga
- Divisional charts
- Planetary aspects
- Life Path Number
- Destiny Number
- Master Numbers
- Name Number
- Driver Number
- Conductor Number

before using the platform.

Instead:

### Beginner experience

"Tell me what this means for my life."

### Advanced experience

"Show me why the system reached this interpretation."

The complexity should remain inside the platform.

It should not be pushed onto the user.

---

# 3. FIRST RULE — DO NOT MODIFY ANYTHING YET

Before changing code, database, UI or architecture:

## FIRST AUDIT.

Do not immediately start implementing.

Your first deliverable must be a comprehensive audit.

The workflow is:

```text
Existing Project
      ↓
Complete Technical Audit
      ↓
Complete UX/UI Audit
      ↓
User Journey Audit
      ↓
Knowledge Audit
      ↓
Internet Research
      ↓
Competitive Pattern Analysis
      ↓
Database Audit
      ↓
Astrology/Numerology Architecture Audit
      ↓
Problem Prioritization
      ↓
Recommended Architecture
      ↓
Implementation Plan
      ↓
Only Then — Implementation
```

---

# 4. INSPECT THE ENTIRE EXISTING PROJECT

Read and understand the complete codebase.

Inspect:

- Directory structure
- Frontend
- Backend
- API routes
- Components
- Pages
- Hooks
- Services
- Utilities
- Authentication
- Authorization
- Database
- ORM
- Migrations
- Models
- Schemas
- AI integrations
- Prompt files
- Astrology calculations
- Numerology calculations
- User profile logic
- Question forms
- Result generation
- Search
- SEO
- Analytics
- Error handling
- Loading states
- Mobile responsiveness
- Configuration
- Environment variables
- External APIs
- Dependencies

Identify:

- Dead code
- Duplicate code
- Hardcoded values
- Unused components
- Unused database fields
- Duplicate calculations
- Duplicate API calls
- Poor abstractions
- Technical debt
- Security risks
- Performance bottlenecks
- Scalability limitations

---

# 5. UNDERSTAND THE CURRENT PRODUCT

Before judging it, understand what it currently does.

Create an internal map:

```text
User
 ↓
Landing Page
 ↓
Registration / Guest Experience
 ↓
Birth Information
 ↓
Question Selection
 ↓
Calculation
 ↓
AI Processing
 ↓
Result
 ↓
Additional Exploration
```

Document what actually happens at every stage.

Do not assume that the code structure represents the intended user journey.

---

# 6. FIRST-TIME USER SIMULATION

Pretend you are a person who knows almost nothing about astrology.

You discovered AnkJyotishAI through Google.

Your search might be:

- "Which career is suitable for me?"
- "When will I get married?"
- "What is my lucky number?"
- "What does my birth date mean?"
- "Career prediction by date of birth"
- "Kundli analysis online"

Now use the platform from scratch.

At every screen ask:

### Understanding

- What am I looking at?
- What am I supposed to do?
- Why am I being asked this?
- What will I get afterward?

### Language

- Do I understand the terminology?
- Is this normal human language?
- Is this technical astrology language?

### Effort

- Is this form too long?
- Are there unnecessary questions?
- Are there too many choices?
- Am I being asked something that could be calculated automatically?

### Motivation

- Do I understand the benefit?
- Does the next step feel worth completing?

### Result

- Does the answer address my question?
- Is it personalized?
- Is it understandable?
- Is it actionable?
- Can I understand it without knowing astrology?

Document every friction point.

---

# 7. TEST FIVE USER TYPES

Evaluate AnkJyotishAI against five personas.

## PERSONA 1 — COMPLETE BEGINNER

"I don't know astrology or numerology. I just have a question about my life."

## PERSONA 2 — CASUAL USER

"I know my zodiac sign and have watched some astrology videos."

## PERSONA 3 — NUMEROLOGY USER

"I understand basic numerology and want to know my numbers."

## PERSONA 4 — ASTROLOGY + NUMEROLOGY USER

"I want to compare what both systems indicate."

## PERSONA 5 — ADVANCED USER

"I understand Kundli, houses, planets, Nakshatras, Dashas and divisional charts."

The product must support all five.

But:

> Persona 1 must NOT be forced to use Persona 5's interface.

---

# 8. IDENTIFY WHAT WE ARE DOING WRONG

Create a ranked audit.

## UX PROBLEMS

Look for:

- Too many steps
- Too many questions
- Unnecessary questions
- Confusing questions
- Technical terminology
- Poor navigation
- Poor hierarchy
- Weak CTA
- Poor onboarding
- No explanation
- Information overload
- Generic results
- Lack of personalization
- Poor progressive disclosure

## UI PROBLEMS

Audit:

- Typography
- Font sizes
- Line height
- Spacing
- Cards
- Buttons
- Forms
- Icons
- Charts
- Visual hierarchy
- Colors
- Contrast
- Mobile layout
- Desktop layout
- Scrolling
- Result readability

## PRODUCT PROBLEMS

Determine:

- What problem is AnkJyotishAI actually solving?
- Is the value proposition clear?
- Does the product answer user questions?
- Are users being given too much information?
- Are users being given too little useful information?
- Are answers generic?
- Are answers actually based on calculated data?
- Is the user able to understand "why"?

## TECHNICAL PROBLEMS

Audit:

- Architecture
- API design
- State management
- Authentication
- Authorization
- Database
- Caching
- Performance
- Security
- Scalability
- AI architecture
- Calculation engine
- Error handling
- Logging

## KNOWLEDGE PROBLEMS

Identify:

- Missing concepts
- Incorrect concepts
- Weak interpretations
- Missing combinations
- Missing real-life examples
- Missing beginner explanations
- Missing advanced explanations

---

# 9. FORM AND QUESTION EXPERIENCE — MAJOR PRIORITY

The current form experience must be critically evaluated.

A common failure in astrology products is:

> Asking users to understand astrology before allowing them to use astrology.

Do not make that mistake.

---

# 10. QUESTION-FIRST EXPERIENCE

The product should ideally begin with:

## "What would you like to know?"

Possible categories:

- ❤️ Love
- 💍 Marriage
- 💼 Career
- 💰 Money
- 🏢 Business
- 🎓 Education
- ✈️ Foreign Opportunities
- 👨‍👩‍👧 Family
- 🌱 Personal Growth
- 🔮 Overall Life
- 📅 Important Upcoming Periods

Use language that normal people understand.

Do not expose unnecessary technical categories at this stage.

---

# 11. MULTI-SELECT LOGIC

The system must support three modes.

## ONE TOPIC

Example:

User selects:

> Career

The result should primarily focus on career.

Do not unnecessarily fill the page with marriage, health, family, etc.

---

## MULTIPLE TOPICS

Example:

User selects:

> Career + Money + Marriage

The system should generate a combined result.

Structure:

```text
Career
Money
Marriage
Common patterns
Important factors
Summary
```

---

## ALL TOPICS

If the user selects:

> Everything / Complete Reading

Then provide a comprehensive reading.

But do NOT dump every piece of information onto one screen.

Use collapsible sections:

```text
Personality
Career
Money
Love
Marriage
Family
Education
Foreign Opportunities
Major Strengths
Challenges
Important Periods
```

The user can explore deeper.

---

# 12. PROGRESSIVE DISCLOSURE

Use three information levels.

## LEVEL 1 — SIMPLE

"What does this mean for me?"

Example:

> "Your chart traditionally emphasizes discipline and gradual professional growth."

## LEVEL 2 — EXPLANATION

"Why?"

Example:

> "This interpretation is connected to Saturn's placement and its relationship with your career-related chart factors."

## LEVEL 3 — TECHNICAL

"Show me the astrology."

Example:

```text
Planet: Saturn
House: 10th
Rashi: ...
Nakshatra: ...
Degree: ...
Aspects: ...
Dasha: ...
```

Beginners see Level 1.

Interested users can expand Level 2.

Advanced users can access Level 3.

---

# 13. REAL-LIFE LANGUAGE

This is one of the highest priorities.

Do not write:

> "Saturn in the 10th Bhava creates delayed professional manifestation."

Write:

> "In traditional Vedic astrology, this placement is associated with responsibility and gradual career development. You may find that professional progress comes more through consistency and experience than sudden breakthroughs."

Then:

### Technical Details

Show the underlying factors.

The rule is:

> **Explain the meaning before explaining the terminology.**

---

# 14. REAL-LIFE EXAMPLES

Where appropriate, explanations should include practical examples.

For example:

### Technical interpretation

"Saturn influence on career."

### Practical interpretation

"This may show up as preferring stable career growth, taking responsibility early, or needing more time than others to reach a professional milestone."

This makes the system relatable.

Do not fabricate specific life events.

Examples should be clearly presented as examples, not predictions.

---

# 15. ASTROLOGY AND NUMEROLOGY ARE DIFFERENT SYSTEMS

This is fundamental.

Do NOT treat them as one calculation system.

They have different methodologies.

## NUMEROLOGY

Potential inputs:

- Birth date
- Name
- Number calculations
- Number patterns
- Number cycles

## ASTROLOGY

Potential inputs:

- Birth date
- Birth time
- Birth location
- Planetary positions
- Houses
- Rashis
- Nakshatras
- Aspects
- Yogas
- Dashas
- Transits
- Divisional charts

Keep the calculation engines separate.

---

# 16. COMBINED ASTROLOGY + NUMEROLOGY ENGINE

Create a third interpretation layer.

Conceptually:

```text
              USER
                |
        -------------------
        |                 |
   NUMEROLOGY          ASTROLOGY
        |                 |
   Calculations        Calculations
        |                 |
   Interpretation      Interpretation
        |                 |
        ------- COMBINE -------
                |
        Cross-System Analysis
                |
        AI Explanation Layer
                |
             RESULT
```

The combined layer should:

1. Identify themes from numerology
2. Identify themes from astrology
3. Find agreements
4. Find differences
5. Identify complementary insights
6. Explain uncertainty
7. Avoid forcing agreement

---

# 17. NEVER FORCE AGREEMENT

If numerology suggests:

> Career stability

while astrology suggests:

> Career experimentation/change

do not hide the conflict.

Instead explain:

> "The two systems highlight different themes. Numerology emphasizes stability, while the chart interpretation points toward periods of professional change. Because these systems use different methods, the difference should be treated as a contrasting perspective rather than forced into one conclusion."

This makes the product more credible.

---

# 18. CALCULATION ENGINE VS AI ENGINE

This separation is mandatory.

Do NOT allow the AI model to independently invent calculations.

Architecture:

```text
USER INPUT
    ↓
VALIDATION
    ↓
CALCULATION ENGINE
    ↓
STRUCTURED FACTS
    ↓
KNOWLEDGE ENGINE
    ↓
INTERPRETATION RULES
    ↓
AI EXPLANATION
    ↓
PERSONALIZED RESULT
```

The AI should explain structured information.

It should not be the source of truth for mathematical/astronomical calculations.

---

# 19. STRUCTURED ASTROLOGY DATA

Design the system to support structured entities such as:

- Planet
- Rashi
- House
- Nakshatra
- Pada
- Ascendant
- Aspect
- Yoga
- Dasha
- Mahadasha
- Antardasha
- Transit
- Divisional Chart
- Planetary Strength
- Relationship
- Life Area
- Interpretation
- Combination Rule
- Timing Rule

Each knowledge entity should support appropriate metadata.

---

# 20. STRUCTURED NUMEROLOGY DATA

Support entities such as:

- Number
- Number Type
- Life Path
- Destiny
- Birth Number
- Driver
- Conductor
- Expression
- Soul Urge
- Personality
- Name Number
- Master Number
- Compatibility
- Career Association
- Relationship Association
- Business Association
- Strength
- Challenge
- Cycle
- Interpretation

Do not assume every numerology school uses the same terminology.

Where methodologies differ:

- Identify the system
- Store methodology
- Avoid silently mixing systems
- Explain methodology when necessary

---

# 21. KNOWLEDGE DATABASE ARCHITECTURE

Do not create a database that is simply a collection of copied articles.

Build a structured knowledge system.

Potential model:

```text
Knowledge Domain
    ↓
Concept
    ↓
Definition
    ↓
Factors
    ↓
Relationships
    ↓
Interpretation Rules
    ↓
Life Areas
    ↓
Examples
    ↓
Beginner Explanation
    ↓
Advanced Explanation
    ↓
Sources
    ↓
Version
    ↓
Review Status
```

---

# 22. KNOWLEDGE RECORD STRUCTURE

Where appropriate, each knowledge record should contain:

- ID
- System
- Category
- Concept
- Name
- Definition
- Beginner Explanation
- Advanced Explanation
- Real-Life Explanation
- Positive Interpretation
- Challenging Interpretation
- Relevant Life Areas
- Related Concepts
- Combination Rules
- Contradictory Factors
- Strength/Weight
- Timing Relevance
- Methodology
- Source
- Source URL
- Research Date
- Review Status
- Version
- Notes

Adapt this structure to the actual database architecture.

Do not create unnecessary fields just because they sound useful.

---

# 23. INTERNET RESEARCH

Perform extensive web research.

Research at least **50 relevant websites/resources** across multiple categories.

Research:

### Vedic Astrology

- Jyotish fundamentals
- Kundli
- Houses
- Planets
- Rashis
- Nakshatras
- Ascendant
- Moon sign
- Sun sign
- Aspects
- Yogas
- Dashas
- Transits
- Divisional charts
- Career
- Marriage
- Relationships
- Education
- Business
- Finance
- Foreign opportunities
- Compatibility

### Numerology

Research:

- Life Path
- Destiny
- Birth Number
- Driver
- Conductor
- Expression
- Soul Urge
- Personality
- Name Number
- Master Numbers
- Compatibility
- Career
- Relationships
- Business
- Cycles
- Interpretive frameworks

### Consumer UX

Research:

- Astrology platforms
- Numerology platforms
- Tarot platforms
- Personality assessment products
- AI guidance platforms
- Calculator-based products
- Recommendation platforms

---

# 24. RESEARCH RULES

Do NOT copy website content.

Do NOT scrape copyrighted articles and insert them into the database.

Do NOT reproduce proprietary content.

Use sources for:

- Concept discovery
- Terminology
- Cross-checking
- Methodology comparison
- Information architecture
- User-question discovery
- UX pattern research
- Content gap analysis

Create original structured knowledge.

Where appropriate, store source attribution.

---

# 25. SOURCE QUALITY

Do not treat all websites as equally authoritative.

Classify sources.

Example:

### Tier A

Established reference/traditional sources, recognized publications, technical/academic resources where applicable.

### Tier B

Established specialist educational resources.

### Tier C

Popular consumer astrology/numerology websites.

### Tier D

Blogs, forums, social content and anecdotal sources.

Do not build critical calculation logic from weak sources without cross-checking.

Where different traditions disagree, document the disagreement.

---

# 26. METHODOLOGY VERSIONING

Astrology and numerology can vary by tradition.

Therefore:

Do not pretend there is always one universally accepted interpretation.

Store methodology where appropriate.

Example:

```text
System:
Vedic Astrology

Methodology:
[Specific calculation convention]

Version:
1.0

Source:
...

Reviewed:
...
```

The architecture should allow additional methodologies later.

---

# 27. KUNDLI ARCHITECTURE

AnkJyotishAI should eventually support a serious Kundli experience.

Potential features:

- Birth Chart
- Rashi Chart
- Lagna Chart
- Moon Chart
- Navamsa / D9
- Dashamsa / D10
- Other relevant divisional charts
- Planetary Positions
- Houses
- Rashis
- Nakshatras
- Padas
- Planetary Degrees
- Aspects
- Yogas
- Dashas
- Mahadasha
- Antardasha
- Transits
- Strength indicators
- Compatibility

But:

> Do not expose every feature to every user.

---

# 28. KUNDLI BEGINNER VIEW

Default view:

# "Your Birth Chart"

Then:

- Personality
- Career
- Relationships
- Money
- Strengths
- Challenges
- Current phase
- Upcoming periods

Explain the meaning first.

---

# 29. KUNDLI ADVANCED VIEW

Advanced users can access:

- Planetary table
- Houses
- Rashis
- Nakshatras
- Padas
- Degrees
- Divisional charts
- Dashas
- Yogas
- Aspects
- Technical calculations

Use tabs or expandable sections.

Do not put all technical information above the main interpretation.

---

# 30. CHART VISUALIZATION

Audit the current Kundli/chart UI.

Determine:

- Is the chart readable?
- Is it mobile-friendly?
- Can beginners understand it?
- Can advanced users inspect it?
- Are planetary positions accessible?
- Is there contextual explanation?

A chart should not be merely decorative.

When the user taps a planet/house/etc., provide a contextual explanation.

---

# 31. RESULT PAGE ARCHITECTURE

A result should ideally follow:

```text
YOUR QUESTION
      ↓
DIRECT ANSWER
      ↓
WHAT THIS MEANS
      ↓
WHY
      ↓
REAL-LIFE INTERPRETATION
      ↓
STRENGTHS
      ↓
CHALLENGES
      ↓
TIMING
      ↓
ACTIONABLE GUIDANCE
      ↓
TECHNICAL DETAILS
      ↓
EXPLORE FURTHER
```

---

# 32. PERSONALIZATION

Do not generate generic statements.

Avoid:

> "You are hardworking and may achieve success."

Prefer:

> "Based on the calculated factors used for this reading, the strongest theme is gradual professional development rather than rapid change."

Every important interpretation should be connected to underlying structured factors.

---

# 33. INTERPRETATION TRACEABILITY

Create an internal mechanism:

```text
Interpretation
      ↓
Supporting Factors
      ↓
Knowledge Records
      ↓
Calculation Output
      ↓
Generated Explanation
```

This should make it possible to investigate:

> "Why did the AI say this?"

This is extremely important for debugging and trust.

---

# 34. AI GUARDRAILS

The AI must NOT:

- Invent planetary positions
- Invent birth-chart data
- Invent calculations
- Invent source information
- Claim certainty where there is uncertainty
- Make guaranteed predictions
- Pretend astrology is scientifically proven
- Produce generic filler
- Contradict calculated data
- Hide conflicting factors

The AI SHOULD:

- Explain
- Summarize
- Personalize
- Compare
- Contextualize
- Simplify
- Surface relevant factors
- Explain uncertainty

---

# 35. REAL-LIFE QUESTION SYSTEM

The platform should eventually understand questions such as:

> "Should I change my job?"

> "Why am I not progressing in my career?"

> "Is business better for me than a job?"

> "When is marriage likely?"

> "Why do my relationships keep failing?"

> "Should I move abroad?"

> "Which career direction suits me?"

> "What does my birth date say about my personality?"

The system should map natural-language questions into structured life areas and relevant calculations.

Do not force users to learn the taxonomy.

---

# 36. QUESTION → ANALYSIS MAPPING

Create a mapping architecture:

```text
USER QUESTION
      ↓
INTENT DETECTION
      ↓
LIFE AREA
      ↓
REQUIRED DATA
      ↓
CALCULATIONS
      ↓
RELEVANT KNOWLEDGE
      ↓
INTERPRETATION
      ↓
ANSWER
```

Example:

```text
"Should I change my job?"

→ Career
→ Current career indicators
→ Relevant planetary factors
→ Relevant numerology factors
→ Timing
→ Cross-system interpretation
→ Simple answer
```

---

# 37. ASK ONLY NECESSARY QUESTIONS

Before adding a question to any form, ask:

> "Can the system calculate or infer this from information already provided?"

If yes:

Do not ask the user again.

Also ask:

> "Does this information materially improve the result?"

If no:

Remove it.

---

# 38. USER DATA FLOW

Design a reusable profile.

Once a user provides:

- Name
- Date of birth
- Time of birth
- Place of birth

do not repeatedly ask for the same information.

Build:

```text
USER PROFILE
      ↓
ASTROLOGY PROFILE
      ↓
NUMEROLOGY PROFILE
      ↓
QUESTION
      ↓
SPECIFIC ANALYSIS
```

---

# 39. REUSABLE USER PROFILE

A user should eventually be able to ask:

- Career today
- Marriage
- Business
- Money
- Compatibility
- General life
- Upcoming period

without entering their birth information repeatedly.

---

# 40. HOME PAGE STRATEGY

Audit the current homepage.

It should quickly communicate:

### What is AnkJyotishAI?

### What can I ask?

### How does it work?

### Why should I trust it?

### What will I get?

Do not fill the homepage with astrology jargon.

A beginner should understand the product in seconds.

---

# 41. SEO STRATEGY

Build SEO around actual questions.

Examples:

- Life Path Number Calculator
- Birth Number Calculator
- Numerology Calculator
- Kundli Calculator
- Career Astrology
- Marriage Astrology
- Career Prediction
- Kundli Analysis
- What is Navamsa?
- What is Saturn in the 10th house?
- What does my birth date mean?
- Astrology vs Numerology
- Numerology and Astrology Combined

Architecture:

```text
GOOGLE QUESTION
      ↓
EDUCATIONAL PAGE
      ↓
INTERACTIVE TOOL
      ↓
PERSONALIZED RESULT
      ↓
DEEPER EXPLORATION
```

---

# 42. SEO CONTENT SHOULD NOT BECOME THE PRODUCT

Do not create hundreds of meaningless SEO articles.

Each content page should ideally have a purpose.

Examples:

```text
Learn
↓
Calculate
↓
Understand
↓
Apply to yourself
```

---

# 43. MOBILE-FIRST EXPERIENCE

Assume a large percentage of users will use mobile devices.

Audit:

- Forms
- Cards
- Charts
- Navigation
- Tables
- Result pages
- Expandable sections
- Buttons
- Typography
- Sticky CTAs
- Loading states

No horizontal scrolling should occur unintentionally.

---

# 44. PERFORMANCE

Audit:

- Initial page load
- API latency
- Database queries
- AI response time
- Chart rendering
- Bundle size
- Images
- Caching
- Repeated calculations

Identify expensive operations.

Do not optimize blindly.

Measure first.

---

# 45. SECURITY

Audit:

- Authentication
- Authorization
- User data
- Birth data
- API keys
- Environment variables
- Database access
- Injection risks
- Rate limits
- AI prompt injection
- User-generated content
- Sensitive logs

Do not expose secrets in frontend code.

---

# 46. DATABASE AUDIT

Inspect the existing database deeply.

Document:

### Current

- Tables
- Columns
- Relationships
- Indexes
- Constraints
- JSON structures
- Duplicate data
- Missing relationships

### Problems

Identify:

- Poor normalization
- Poor naming
- Redundant data
- Missing indexes
- Missing constraints
- Scalability problems
- Difficult migrations

### Recommended

Create a proposed architecture.

---

# 47. DATABASE SHOULD SUPPORT FUTURE SYSTEMS

Current platform:

```text
Numerology
+
Astrology
```

Future:

```text
Tarot
Vastu
Other systems
```

Do not create a database that makes future systems impossible to add.

Prefer a modular architecture.

Conceptually:

```text
USER
 |
 +-- Numerology Profile
 |
 +-- Astrology Profile
 |
 +-- Tarot Profile
 |
 +-- Vastu Profile
 |
 +-- Questions
 |
 +-- Readings
 |
 +-- Saved Results
```

But do not over-generalize everything into an unusable "universal table."

Use practical modular boundaries.

---

# 48. FUTURE TAROT AND VASTU

Do NOT implement Tarot or Vastu now unless the current architecture requires preparation.

Instead:

Ensure the architecture can support future systems.

Future roadmap:

```text
CURRENT
Astrology + Numerology

LATER
Tarot

LATER
Vastu

LATER
Additional systems
```

---

# 49. PRODUCT ROADMAP

Create a prioritized roadmap.

## P0 — Critical

Anything that prevents users from understanding or using the product.

## P1 — High Priority

Major UX, calculation, architecture and knowledge issues.

## P2 — Important

Improvements that materially increase usefulness.

## P3 — Future

Advanced features.

Do not prioritize features simply because they look impressive.

---

# 50. WHAT TO REMOVE

A good product audit must identify things to remove.

Find:

- Unnecessary questions
- Unnecessary pages
- Duplicate information
- Technical jargon
- Redundant features
- Generic content
- Low-value options
- Unnecessary AI-generated text
- Features that create confusion

If something does not contribute to user value, recommend removing it.

---

# 51. WHAT TO KEEP

Identify existing strengths.

Explicitly document:

- Good UX
- Good UI
- Good architecture
- Good calculations
- Good content
- Good components
- Good performance
- Good workflows

Do not redesign something simply because you are rebuilding other areas.

---

# 52. WHAT TO REBUILD

Identify components where incremental changes will not solve the problem.

For each:

```text
Current
Problem
Why incremental fix is insufficient
Recommended replacement
Migration risk
Implementation effort
Expected benefit
```

---

# 53. ANALYTICS AND PRODUCT METRICS

Recommend events to measure.

Examples:

```text
landing_view
start_reading
birth_data_completed
question_selected
single_topic_selected
multiple_topics_selected
all_topics_selected
reading_generated
reading_completed
technical_details_opened
second_question_started
saved_reading
return_visit
```

Also identify funnel drop-offs.

---

# 54. PRODUCT SUCCESS METRICS

Do not define success as:

> "AI generated more words."

Instead measure:

- Form completion
- Reading completion
- Time to first useful answer
- Second question rate
- Return rate
- User engagement
- Result expansion
- Saved readings
- User feedback
- Search-to-tool conversion

---

# 55. TRUST DESIGN

The platform should clearly communicate:

- Methodology
- What information was used
- What the system calculated
- What is interpretation
- What is uncertain

Avoid fake precision.

Avoid:

> "You will definitely get married in October."

Prefer:

> "This period is traditionally considered more supportive for relationship or marriage-related developments."

The exact wording should depend on the methodology and calculation.

---

# 56. HIGH-STAKES TOPICS

For topics involving:

- Health
- Major financial decisions
- Legal decisions
- Safety
- Serious personal decisions

do not present astrology/numerology as factual certainty.

Use appropriate context and encourage professional advice where necessary.

---

# 57. COMPETITIVE RESEARCH OUTPUT

After researching at least 50 sources, produce a matrix:

| Category | Source | What They Do Well | What They Do Poorly | Useful Pattern | Should AnkJyotishAI Adopt? |
|---|---|---|---|---|---|

Do not blindly copy competitors.

Identify opportunities where AnkJyotishAI can be easier and more useful.

---

# 58. FINAL AUDIT REPORT

Before implementation, produce:

# A. Executive Summary

What is the biggest problem?

# B. What We Are Doing Right

Top strengths.

# C. What We Are Doing Wrong

Top problems.

# D. Top 10 Problems Ranked

Rank by:

- User impact
- Business impact
- Technical severity

# E. UX Audit

Detailed findings.

# F. UI Audit

Detailed findings.

# G. Product Audit

Detailed findings.

# H. Technical Audit

Detailed findings.

# I. Database Audit

Detailed findings.

# J. Knowledge Audit

Detailed findings.

# K. Astrology Architecture

Detailed findings.

# L. Numerology Architecture

Detailed findings.

# M. Combined Intelligence Architecture

Detailed findings.

# N. Research Findings

Summarize the 50+ researched sources.

# O. Recommended User Journey

```text
Landing
 ↓
Question
 ↓
Birth Data
 ↓
Calculation
 ↓
Personalized Result
 ↓
Explore
 ↓
Ask Another Question
```

# P. Recommended Information Architecture

Full sitemap.

# Q. Recommended Database

Entities and relationships.

# R. Recommended AI Architecture

Calculation → Knowledge → Interpretation → Explanation.

# S. Roadmap

P0 → P1 → P2 → P3.

---

# 59. IMPLEMENTATION AFTER AUDIT

Only after the audit is complete should you begin implementation.

Implementation rules:

- Preserve working functionality
- Create migrations
- Do not destroy production data
- Make incremental changes
- Test every migration
- Test mobile
- Test desktop
- Test beginner flow
- Test advanced flow
- Test astrology calculations
- Test numerology calculations
- Test combined interpretation
- Test AI responses
- Test error states
- Test edge cases

---

# 60. TESTING PERSONAS

Before considering the redesign complete, test:

### Beginner

Can they get an answer without understanding astrology?

### Casual

Can they explore further without feeling overwhelmed?

### Numerology User

Can they understand their numbers?

### Astrology User

Can they understand their Kundli?

### Advanced User

Can they access technical information?

---

# 61. FINAL PRODUCT TEST

Ask these questions:

### Question 1

Can a person who knows nothing about astrology use AnkJyotishAI?

### Question 2

Can they understand why information is being requested?

### Question 3

Can they ask a real-life question?

### Question 4

Does the result answer that question?

### Question 5

Can they understand the result without technical knowledge?

### Question 6

Can they explore the technical explanation if interested?

### Question 7

Does the result actually use calculated data?

### Question 8

Can astrology and numerology provide separate perspectives?

### Question 9

Can the system identify where they agree and disagree?

### Question 10

Can the architecture eventually support Tarot and Vastu?

If the answer to any of these is no, identify why and recommend a solution.

---

# 62. NON-NEGOTIABLE PRINCIPLES

Follow these throughout the project.

## PRINCIPLE 1

**Do not make the user learn the system before using the system.**

## PRINCIPLE 2

**Explain practical meaning before technical terminology.**

## PRINCIPLE 3

**Do not confuse astrology and numerology.**

## PRINCIPLE 4

**Do not allow AI to invent calculations.**

## PRINCIPLE 5

**Do not copy content from websites.**

## PRINCIPLE 6

**Research broadly, verify important concepts, and build original structured knowledge.**

## PRINCIPLE 7

**Do not force different astrological/numerological methodologies into one fake universal truth.**

## PRINCIPLE 8

**Do not overwhelm beginners with advanced charts and terminology.**

## PRINCIPLE 9

**Do not remove technical depth; hide it behind progressive disclosure.**

## PRINCIPLE 10

**Do not add features merely because competitors have them.**

## PRINCIPLE 11

**Do not rewrite working architecture without evidence.**

## PRINCIPLE 12

**Prioritize user understanding over feature quantity.**

---

# 63. THE NORTH STAR

AnkJyotishAI should NOT feel like:

> "A website containing astrology information."

It should feel like:

> **"A personal AI guidance system that understands my question, calculates the relevant astrology and numerology factors, explains what they traditionally indicate in simple language, and lets me explore the deeper reasoning when I want to."**

The ideal experience is:

```text
I have a question
        ↓
AnkJyotishAI understands my question
        ↓
It asks only what is necessary
        ↓
It calculates the relevant information
        ↓
It combines structured knowledge
        ↓
It explains the result simply
        ↓
I understand what it means for me
        ↓
I can explore deeper if I want
        ↓
I can ask another question
```

That is the product you are building.

---

# 64. START NOW

Begin with the following order:

## STEP 1

Inspect the entire existing AnkJyotishAI project.

## STEP 2

Map the current architecture.

## STEP 3

Map the current user journey.

## STEP 4

Perform the beginner-user simulation.

## STEP 5

Audit the complete UI/UX.

## STEP 6

Audit the database.

## STEP 7

Audit astrology and numerology calculations.

## STEP 8

Audit AI prompts and interpretation architecture.

## STEP 9

Research at least 50 high-quality external sources.

## STEP 10

Compare methodologies and identify knowledge gaps.

## STEP 11

Design the improved knowledge architecture.

## STEP 12

Design the Astrology + Numerology architecture.

## STEP 13

Design the improved question/form experience.

## STEP 14

Design the beginner + advanced result experience.

## STEP 15

Design the scalable database architecture.

## STEP 16

Produce the complete audit report.

## STEP 17

Produce the prioritized implementation roadmap.

## STEP 18

Only then begin implementation.

---

# FINAL INSTRUCTION

Do not tell me that everything is good.

Do not protect the existing implementation.

Do not agree with assumptions simply because they are already present in the project.

If something is confusing, say:

> **"This is confusing."**

If something is unnecessary, say:

> **"This should be removed."**

If something is technically wrong, say:

> **"This implementation is incorrect and here is why."**

If the current architecture is good, say:

> **"Keep this."**

If the current product is overcomplicated, simplify it.

If the product is missing important foundations, identify them.

Your responsibility is not to make the existing project look good.

Your responsibility is to make **AnkJyotishAI genuinely useful, understandable, scalable, technically reliable, and easy enough for a person who knows almost nothing about astrology or numerology.**

**Audit first. Research second. Architect third. Implement fourth.**

Never reverse this order.