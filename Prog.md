**Rigved-Explorer**

## Project Overview

Create a world-class, engaging web application for exploring the Rig Veda - matching the polish and UX excellence of quran.com and bible.com. This should be the definitive digital experience for Vedic scripture, combining beauty, scholarship, and intuitive interaction.

---

## 🎨 Design Philosophy

**Visual Identity:**

- Inspired by Vedic aesthetics: sacred geometry, cosmic themes, natural elements
- Color palette from Vedic deities and elements:
    
    Primary: Deep indigo `#2D3142` (cosmic/night)
    
    - Agni (fire): `#FF6B35`
    - Ushas (dawn): `#FFD93D`
    - Soma (moon): `#E8F1F5`
    - Accent gold: `#D4AF37` for highlights
- Typography:
    - Sanskrit: Noto Serif Devanagari (authentic, highly readable)
    - Transliteration: Gentium Plus (designed for IAST)
    - English: Crimson Pro or Spectral (elegant serif for long-form reading)
    - UI elements: Inter (clean, modern sans-serif)

**UX Principles:**

- **Immediate clarity**: User should understand purpose within 3 seconds
- **Progressive disclosure**: Don't overwhelm - reveal depth gradually
- **Respectful presentation**: This is sacred text - treat it with dignity
- **Smooth, delightful interactions**: Micro-animations, smooth transitions
- **Accessibility first**: WCAG AA compliant, keyboard navigation, screen reader friendly

---

## 🏗️ Technical Architecture  ✔️ completed

### Tech Stack  ✔️ completed

```
Frontend: React 18+ with Vite
Routing: React Router v6
Styling: Tailwind CSS + Framer Motion for animations
State: Zustand (lightweight, better than Redux for this scale)
Data Viz: D3.js for custom visualizations, Recharts for standard charts
Maps: Mapbox GL JS (beautiful, customizable)
Search: Fuse.js (fuzzy search for verses)
AI: Anthropic Claude API (for semantic understanding)
Icons: Lucide React
Fonts: Google Fonts CDN

```

### Folder Structure  ✔️ completed

```
rigveda-explorer/
├── public/
│   ├── data/
│   │   ├── verses.json (complete dataset)
│   │   ├── deities.json (deity metadata & relationships)
│   │   ├── rishis.json (sage information)
│   │   └── regions.json (geographic data)
│   └── assets/
│       ├── images/
│       └── audio/ (optional mantra pronunciations)
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.jsx (sticky, minimal)
│   │   │   ├── Footer.jsx
│   │   │   └── PageLayout.jsx
│   │   ├── verses/
│   │   │   ├── VerseCard.jsx (main display component)
│   │   │   ├── VerseReader.jsx (reading view)
│   │   │   ├── ParallelView.jsx (compare translations)
│   │   │   └── VerseBookmark.jsx
│   │   ├── filters/
│   │   │   ├── FilterPanel.jsx
│   │   │   ├── QuickFilters.jsx
│   │   │   └── AdvancedSearch.jsx
│   │   ├── visualizations/
│   │   │   ├── DeityNetwork.jsx (force-directed graph)
│   │   │   ├── ThemeExplorer.jsx (interactive theme map)
│   │   │   ├── GeographicMap.jsx (Vedic regions)
│   │   │   ├── TimelineView.jsx (chronological journey)
│   │   │   └── StatsDashboard.jsx
│   │   ├── ai/
│   │   │   ├── AIAssistant.jsx (chat interface)
│   │   │   └── SemanticSearch.jsx
│   │   ├── reading/
│   │   │   ├── ReadingPlan.jsx
│   │   │   ├── DailyVerse.jsx
│   │   │   └── ReadingProgress.jsx
│   │   └── common/
│   │       ├── LoadingSpinner.jsx
│   │       ├── ErrorBoundary.jsx
│   │       └── Modal.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Explore.jsx (main reading interface)
│   │   ├── Discover.jsx (visualizations & insights)
│   │   ├── Learn.jsx (introductory content)
│   │   ├── About.jsx
│   │   └── Settings.jsx
│   ├── hooks/
│   │   ├── useVerses.js (fetch & filter verses)
│   │   ├── useBookmarks.js (localStorage management)
│   │   ├── useTheme.js (dark/light mode)
│   │   ├── useSearch.js (fuzzy search logic)
│   │   └── useAI.js (Claude API integration)
│   ├── store/
│   │   ├── verseStore.js (Zustand store)
│   │   ├── uiStore.js (UI state)
│   │   └── userStore.js (preferences, bookmarks)
│   ├── utils/
│   │   ├── verseLoader.js
│   │   ├── searchEngine.js
│   │   ├── transliteration.js (Devanagari ↔ IAST)
│   │   └── analytics.js
│   ├── styles/
│   │   └── globals.css
│   ├── App.jsx
│   └── main.jsx

```

---

## 📊 Data Model (Comprehensive)

### verses.json  ✔️ completed

```json
{
  "verses": [
    {
      "id": "1.1.1",
      "mandala": 1,
      "sukta": 1,
      "verse": 1,

      "text": {
        "sanskrit": "अग्निमीळे पुरोहितं यज्ञस्य देवमृत्विजम् । होतारं रत्नधातमम् ॥",
        "iast": "agním īḷe puróhitaṃ yajñásya devám ṛtvíjam | hótāraṃ ratnadhā́tamam ||",
        "translations": [
          {
            "language": "en",
            "translator": "Griffith",
            "text": "I Laud Agni, the chosen Priest, God, minister of sacrifice, The hotar, lavishest of wealth.",
            "year": 1896
          },
          {
            "language": "en",
            "translator": "Jamison-Brereton",
            "text": "I summon Agni, the priest placed in front, the god of the ritual, the invoker, best bestower of treasure.",
            "year": 2014
          },
          {
            "language": "en",
            "translator": "Wilson",
            "text": "I glorify Agni, the high priest of the sacrifice, the divine, the ministrant, who presents the oblation, and is the possessor of great wealth.",
            "year": 1850
          }
        ]
      },

      "metadata": {
        "deity": {
          "primary": "Agni",
          "secondary": null
        },
        "rishi": {
          "name": "Madhuchchhandas Vaishvamitra",
          "gotra": "Vaishvamitra",
          "family": "Angiras"
        },
        "meter": "Gayatri",
        "category": "devata" // or daiva, aranya
      },

      "themes": [
        "fire",
        "sacrifice",
        "ritual",
        "priest",
        "wealth",
        "invocation"
      ],

      "keywords": {
        "sanskrit": ["अग्नि", "पुरोहित", "यज्ञ", "देव", "होतृ"],
        "english": ["agni", "priest", "sacrifice", "god", "wealth"]
      },

      "context": {
        "significance": "Opening verse of the entire Rig Veda Samhita",
        "ritual_use": "Invoked at the beginning of fire sacrifices",
        "symbolic_meaning": "Agni as the divine mediator between humans and gods",
        "note": "This hymn establishes Agni's preeminent position in Vedic ritual"
      },

      "connections": {
        "related_verses": ["1.1.2", "1.1.3", "2.1.1", "3.1.1"],
        "parallel_hymns": ["10.9.1"],
        "referenced_in": ["Shukla Yajurveda 1.1"]
      },

      "geography": {
        "region": "Sapta Sindhu",
        "modern_location": "Punjab and surrounding regions",
        "coordinates": {
          "lat": 31.1471,
          "lng": 75.3412
        }
      },

      "chronology": {
        "layer": "early", // early/middle/late
        "approx_period": "1500-1200 BCE",
        "relative_date": -1500
      },

      "audio": {
        "pronunciation_url": "/audio/1.1.1.mp3",
        "recitation_style": "Samhita Patha"
      },

      "analysis": {
        "word_count": 9,
        "complexity": "medium",
        "poetic_devices": ["alliteration", "compound words"],
        "grammatical_notes": "Accusative case for Agni as object of verb īḷe"
      }
    }
  ]
}

```

### deities.json

```json
{
  "deities": [
    {
      "name": "Agni",
      "name_sanskrit": "अग्नि",
      "element": "Fire",
      "role": "Mediator between humans and gods, messenger",
      "attributes": ["transformation", "purification", "sacrifice", "light"],
      "symbols": ["🔥", "flame", "smoke"],
      "color": "#FF6B35",
      "hymn_count": 200,
      "primary_mandalas": [1, 2, 3, 5, 6, 7, 10],
      "related_deities": ["Indra", "Soma", "Ushas"],
      "iconography": "Often depicted with seven tongues of flame",
      "epithets": ["Jatavedas", "Vaisvanara", "Havyavahana"]
    }
  ]
}

```

---

## 🎯 Page Specifications

### 1. HOME PAGE (`/`)

**Layout:**

```
┌─────────────────────────────────────────────────┐
│              Minimal Top Nav                     │
├─────────────────────────────────────────────────┤
│                                                  │
│           Hero Section (Full Height)             │
│                                                  │
│     ॐ भूर्भुवः स्वः (animated Sanskrit)          │
│                                                  │
│         Explore the Rig Veda                     │
│    The oldest scripture of humanity              │
│                                                  │
│         [Begin Your Journey →]                   │
│                                                  │
│    ∼ Gentle particle animation background ∼      │
│                                                  │
├─────────────────────────────────────────────────┤
│                                                  │
│         Quick Stats (3 cards)                    │
│   10 Mandalas | 1,028 Hymns | 10,552 Verses     │
│                                                  │
├─────────────────────────────────────────────────┤
│                                                  │
│         Featured Daily Verse                     │
│      (Beautiful typography + context)            │
│                                                  │
├─────────────────────────────────────────────────┤
│                                                  │
│    "What You Can Explore" (3-4 sections)        │
│   [Read] [Visualize] [Learn] [Discover]         │
│                                                  │
└─────────────────────────────────────────────────┘

```

**Features:**

- Subtle parallax scroll effect
- Animated Sanskrit text (fade in with stagger)
- Particle system representing cosmic energy
- Smooth scroll to sections
- Verse of the day rotates based on date
- Dark mode toggle in corner

---

### 2. EXPLORE PAGE (`/explore`) - MAIN READING INTERFACE

**Layout Options:**

**Option A: Side-by-side (like quran.com)**

```
┌──────────────────────────────────────────┐
│         Sticky Navigation Bar             │
├─────────────┬────────────────────────────┤
│             │                             │
│  Filters &  │     Verse Display           │
│  Navigation │                             │
│             │  ┌──────────────────────┐  │
│  Mandala ▼  │  │  Verse Card          │  │
│  Sukta   ▼  │  │                      │  │
│  Deity   ▼  │  │  Sanskrit (large)    │  │
│  Theme   ▼  │  │  Transliteration     │  │
│             │  │  Translation         │  │
│  [Search]   │  │  [Context] [Audio]   │  │
│             │  └──────────────────────┘  │
│  Bookmarks  │                             │
│  Recent     │  ┌──────────────────────┐  │
│             │  │  Next Verse Card     │  │
│             │  └──────────────────────┘  │
│             │                             │
│             │     [Load More]             │
│             │                             │
└─────────────┴────────────────────────────┘

```

**Key Features:**

1. **Verse Card Component** (the heart of the app):
    
    ```
    ┌────────────────────────────────────────┐
    │ Mandala 1, Sukta 1, Verse 1    [🔖][🔊] │
    ├────────────────────────────────────────┤
    │                                        │
    │   अग्निमीळे पुरोहितं यज्ञस्य देवम्     │
    │   ऋत्विजम् । होतारं रत्नधातमम् ॥      │
    │                                        │
    │   [Tabs: Sanskrit | IAST | Translation]│
    │                                        │
    │   agním īḷe puróhitaṃ yajñásya...     │
    │                                        │
    ├────────────────────────────────────────┤
    │ Translation by: [Griffith ▼]           │
    │                                        │
    │ I Laud Agni, the chosen Priest,       │
    │ God, minister of sacrifice,            │
    │ The hotar, lavishest of wealth.       │
    │                                        │
    ├────────────────────────────────────────┤
    │ 🔥 Deity: Agni  👤 Rishi: Madhuchchh.. │
    │ 📊 Meter: Gayatri  🏷️ fire, sacrifice  │
    ├────────────────────────────────────────┤
    │ ℹ️ Context: Opening verse of the      │
    │    entire Rig Veda...  [Read More]    │
    ├────────────────────────────────────────┤
    │ [🤖 Ask AI] [🔗 Share] [📋 Compare]   │
    └────────────────────────────────────────┘
    
    ```
    
2. **Reading Modes:**
    - **Continuous Scroll** (default): Verses flow like a book
    - **Card View**: One verse at a time with next/prev buttons
    - **Parallel View**: Multiple translations side-by-side
    - **Study Mode**: With notes, commentary, etymology
3. **Filter Panel:**
    - Smart filters that update in real-time
    - Show verse count for each filter option
    - Multi-select for themes
    - "Clear all" button
    - Save filter combinations
4. **Advanced Search:**
    - Fuzzy search across all text (Sanskrit, IAST, English)
    - Search by keyword, deity, rishi, meter
    - Regex support for scholarly research
    - Search history
5. **Audio Playback:**
    - Click speaker icon to hear Vedic chanting
    - Adjustable playback speed
    - Auto-play next verse option
    - Download option

---

### 3. DISCOVER PAGE (`/discover`) - VISUALIZATIONS & INSIGHTS

**Tab Structure:**

```
[🕸️ Connections] [🗺️ Geography] [📈 Analytics] [⏳ Timeline]

```

### Tab 1: **Deity Network Graph**

- Interactive force-directed graph
- Nodes = Deities (size = hymn count)
- Edges = Co-mentions in hymns
- Click node → see all related verses
- Hover → show deity info
- Filter by mandala
- **Tech**: D3.js force simulation

### Tab 2: **Geographic Explorer**

- Beautiful Mapbox map of ancient India
- Markers for regions mentioned in verses
- Heatmap of geographical references
- Timeline slider to see how geography evolved
- Click region → verses that mention it
- Historical overlays (Sapta Sindhu region, etc.)

### Tab 3: **Theme & Analytics Dashboard**

```
┌─────────────────┬──────────────────┐
│ Top Deities     │  Theme Cloud     │
│ (Bar Chart)     │  (Interactive)   │
├─────────────────┼──────────────────┤
│ Meter           │  Rishi Families  │
│ Distribution    │  (Sunburst)      │
└─────────────────┴──────────────────┘

```

### Tab 4: **Timeline Journey**

- Horizontal scrolling timeline
- Three layers: Early/Middle/Late Rigvedic
- Verses positioned chronologically
- Animated transitions
- Click era → filter verses by period

---

### 4. LEARN PAGE (`/learn`)

**Sections:**

1. **Introduction to Rig Veda**
    - What is it?
    - Historical context
    - Structure explanation
    - Cultural significance
2. **Reading Guide**
    - How to approach the text
    - Understanding meters
    - Deity guide
    - Glossary of terms
3. **Curated Collections**
    - "Start Here" - 10 essential hymns
    - "Cosmic Hymns" - Creation, nature
    - "Philosophical Gems"
    - "Ritual Texts"
4. **Reading Plans**
    - "Rig Veda in 30 days"
    - "One Mandala at a time"
    - Custom plan creator

---

### 5. SETTINGS PAGE (`/settings`)

**Preferences:**

- **Reading:**
    - Default script (Devanagari/IAST/Both)
    - Default translation (Griffith/Jamison/Wilson)
    - Font size slider
    - Line spacing
    - Reading mode
- **Display:**
    - Theme (Light/Dark/Auto)
    - Color scheme
    - Animation speed
    - Reduced motion option
- **Audio:**
    - Auto-play
    - Playback speed
    - Volume
- **Privacy:**
    - Data collection: None
    - Bookmarks stored locally
    - Export/Import bookmarks

---

## 🎨 Component Design Specifications

### VerseCard.jsx - Detailed Spec

```jsx
<VerseCard
  verse={verseData}
  viewMode="full" // full | compact | minimal
  showContext={true}
  showTranslation={true}
  translationPreference="Griffith"
  enableAudio={true}
  enableBookmark={true}
  onVerseClick={handleVerseClick}
/>

```

**Visual States:**

- Default
- Hover (subtle lift, shadow increase)
- Active/Selected (accent border)
- Bookmarked (gold star icon)
- Playing audio (pulsing indicator)

**Interactions:**

- Click anywhere → expand/collapse context
- Click deity → filter by that deity
- Click theme tag → filter by theme
- Long press → quick actions menu
- Swipe (mobile) → next/previous verse

---

## 🚀 Novel Features (Differentiation)

### 1. **AI Companion** (Sophisticated Implementation)

**Capabilities:**

- "What does this verse mean?"
- "Find verses about [concept]"
- "Explain the symbolism of Agni"
- "Compare this to [another verse]"
- "What's the historical context?"

**UI:**

- Floating action button in corner
- Slide-up chat panel (doesn't cover content)
- Context-aware: knows which verse you're viewing
- Shows source verses for answers
- **Important**: Never claims certainty, always cites sources

**Prompt Template for Claude:**

```
You are a knowledgeable but humble assistant for the Rig Veda Explorer.

User is viewing: Mandala {m}, Sukta {s}, Verse {v}

Context:
{verse_text}
{verse_metadata}

User asks: {user_question}

Provide a thoughtful response that:
1. Answers their question accurately
2. Cites specific verses when relevant
3. Acknowledges scholarly debate where applicable
4. Suggests related verses to explore
5. Uses respectful, educational tone

Format your response in markdown.

```

### 2. **Verse Constellations**

- Click "Explore Connections" on any verse
- Reveals force-directed graph of related verses
- Lines represent: shared deity, theme, meter, geographical reference
- Click any node → navigate to that verse
- Beautiful particle trails when navigating

### 3. **Comparative Translation View**

- Split screen showing 2-3 translations simultaneously
- Highlight differences in interpretation
- Scholar biography on hover
- "Why do they differ?" AI explanation

### 4. **Personal Library**

- Create custom collections
- Add notes to verses
- Highlight passages
- Export as PDF/Markdown
- Share collection via link

### 5. **Ritual Context Mode**

- Toggle showing how verses are used in actual rituals
- "This verse is chanted during..."
- Step-by-step ritual sequences
- Educational, not instructional

---

## 🎭 Animation & Interaction Details

### Micro-interactions:

1. **Page transitions**: Smooth fade + slight slide (300ms)
2. **Card hover**: Lift 4px, shadow blur 20px → 30px
3. **Filter selection**: Checkbox with checkmark animation
4. **Loading states**: Skeleton screens (not spinners)
5. **Verse navigation**: Slide in from right (next) / left (prev)
6. **Bookmark**: Heart fills with liquid animation
7. **Theme toggle**: Sun/moon morph animation

### Scroll animations:

- Parallax hero on homepage
- Fade-in verses as they enter viewport
- Sticky navigation with shadow on scroll
- "Back to top" button appears after 2 scrolls

### Transitions:

```css
/* Global transition config */
--transition-speed: 200ms;
--transition-easing: cubic-bezier(0.4, 0, 0.2, 1);

```

---

## ♿ Accessibility Requirements

**Must-haves:**

- Semantic HTML5 throughout
- ARIA labels on all interactive elements
- Keyboard navigation (Tab, Enter, Arrow keys)
- Focus visible states (not default browser outline)
- Skip to content link
- Alt text for all images
- Captions for audio
- Screen reader announcements for dynamic content
- Minimum contrast ratio: 4.5:1 for text
- Touch targets: minimum 44x44px
- No motion for users with `prefers-reduced-motion`

**Testing checklist:**

- [ ]  Works with keyboard only
- [ ]  Works with screen reader (NVDA/JAWS)
- [ ]  Passes WAVE accessibility checker
- [ ]  Passes Lighthouse accessibility audit (90+)

---

## 📱 Responsive Design

**Breakpoints:**

```
mobile: 320px - 640px
tablet: 641px - 1024px
desktop: 1025px+

```

**Mobile-specific:**

- Hamburger menu for navigation
- Single column layout on explore page
- Bottom nav bar (common for mobile apps)
- Swipe gestures for verse navigation
- Collapsible filter panel
- Larger touch targets

**Tablet:**

- Two-column layout where appropriate
- Side drawer for filters
- Hybrid navigation

---

## 🔍 SEO & Performance

**SEO:**

- Meaningful page titles: "Rig Veda 1.1.1 - Agni Invocation | RigVeda Explorer"
- Meta descriptions with verse preview
- Open Graph tags for social sharing
- Canonical URLs
- Sitemap.xml with all verses
- robots.txt

**Performance:**

- Code splitting by route
- Lazy load images
- Virtual scrolling for long lists (react-window)
- Debounce search input (300ms)
- Compress JSON data (gzip)
- CDN for fonts and assets
- Service worker for offline access
- Target Lighthouse score: 90+ in all categories

---

## 🛡️ Data Attribution & Ethics

**Critical Requirements:**

- Prominent attribution for translations
    - Griffith (1896) - Public domain
    - Jamison-Brereton (2014) - Cite with permission notes
    - Wilson (1850) - Public domain
- "About" page explaining sources
- Clear statement: "Educational and scholarly purpose"
- No paywalls (honor hackathon rules)
- Privacy-first: No tracking, no cookies, no analytics without consent
- Open source license consideration (MIT or Apache 2.0)

**Data Collection Statement:**

```
"RigVeda Explorer collects no personal data.
Bookmarks and preferences are stored only on your device.
We respect your privacy and the sacred nature of this text."

```

---

## 🎯 Implementation Priorities

### Phase 1: Core Experience (Foundation)

1. Set up React + Vite project
2. Implement routing
3. Create basic layout components (Navbar, Footer, PageLayout)
4. Build VerseCard component (this is the most important)
5. Create verse data structure + load sample data (50 verses)
6. Build Explore page with basic filtering
7. Implement search functionality
8. Add bookmarking (localStorage)

### Phase 2: Visual Polish

1. Design system: colors, typography, spacing
2. Animations with Framer Motion
3. Dark mode implementation
4. Responsive design for mobile/tablet
5. Beautiful Home page
6. Settings page

### Phase 3: Advanced Features

1. AI Assistant integration
2. Deity Network visualization (D3.js)
3. Geographic Map (Mapbox)
4. Timeline view
5. Analytics dashboard
6. Parallel translation view

### Phase 4: Refinement

1. Accessibility audit & fixes
2. Performance optimization
3. Cross-browser testing
4. User testing & iteration
5. Documentation (README, user guide)

---

## 🎨 Example Component Code Patterns

### Color System

```jsx
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        vedic: {
          night: '#2D3142',
          agni: '#FF6B35',
          ushas: '#FFD93D',
          soma: '#E8F1F5',
          gold: '#D4AF37',
          earth: '#8B7355',
          sky: '#4A90E2'
        }
      },
      fontFamily: {
        sanskrit: ['Noto Serif Devanagari', 'serif'],
        transliteration: ['Gentium Plus', 'serif'],
        reading: ['Crimson Pro', 'serif'],
        ui: ['Inter', 'sans-serif']
      }
    }
  }
}

```

### Animation Patterns

```jsx
// Framer Motion variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3 }
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

```

---

## 📋 Quality Checklist

Before considering the project complete, verify:

**UX:**

- [ ]  Can a new user understand the purpose in 3 seconds?
- [ ]  Can user find and read any verse in under 30 seconds?
- [ ]  Are all interactions smooth and responsive?
- [ ]  Is the design beautiful and cohesive?
- [ ]  Does it feel respectful of the sacred text?

**Technical:**

- [ ]  No console errors
- [ ]  Fast load time (<3 seconds)
- [ ]  Works on Chrome, Firefox, Safari
- [ ]  Fully responsive on mobile
- [ ]  Keyboard accessible
- [ ]  No accessibility errors

**Content:**

- [ ]  All translations properly attributed
- [ ]  Data is accurate (verify against source)
- [ ]  Context notes are factual
- [ ]  Citations are complete

**Hackathon Requirements:**

- [ ]  Uses only RigVeda Samhita (Mandalas 1-10)
- [ ]  Publicly accessible link
- [ ]  No login required
- [ ]  Works on desktop
- [ ]  AI is clearly labeled
- [ ]  Sources are attributed
- [ ]  No copyrighted content uploaded

---

## 🎬 Final Notes for Cursor AI

**Development Philosophy:**

- Write clean, commented code
- Use TypeScript for type safety
- Follow React best practices (hooks, composition)
- Keep components small and focused
- Test each feature thoroughly before moving on
- Commit frequently with clear messages

**Visual Philosophy:**

- Less is more - don't over-design
- Respect white space
- Consistent spacing system (4px, 8px, 16px, 24px, 32px, 48px)
- Typography hierarchy is crucial
- Every animation should have purpose

**User-First:**

- Performance > Features
- Clarity > Cleverness
- Accessibility > Aesthetics (but achieve both!)
- Respect > Innovation (this is sacred text)

---

## 🚀 Getting Started Prompt for Cursor

```
Create a new React + Vite project called "rigveda-explorer".

Set up the following:
1. Install dependencies: react-router-dom, zustand, framer-motion, tailwindcss, lucide-react
2. Configure Tailwind with the vedic color scheme provided
3. Set up folder structure as specified
4. Create basic routing for Home, Explore, Discover, Learn, About pages
5. Create a Navbar component with navigation links
6. Create a sample verses.json with 10 verses (Mandala 1, Sukta 1, Verses 1-10)
7. Create a VerseCard component that displays Sanskrit, IAST, and English translation
8. On the Explore page, load and display these 10 verses

Make it beautiful with good typography and spacing. Use the Crimson Pro font for body text.

```

Then iterate from there, building feature by feature!

---
