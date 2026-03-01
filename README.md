# Golf Tracker AI

A premium, high-performance golf tracking application with assistance provided by AI. Upload a photo of your physical scorecard and let Gemini Vision extract your scores automatically — or enter them manually. Track every round, manage your courses, and monitor your performance over time.

```markdown
## 🛠️ Tech Stack

- **Next.js 16**
- **React 19**
- **TypeScript 5**
- **Supabase** (PostgreSQL)
- **Tailwind CSS 4**
- **Gemini 1.5 Flash**
```

## Features

### AI Scorecard OCR
- **Upload a scorecard photo** and let **Gemini 3 Flash** extract your handwritten scores automatically
- Supports both **course data extraction** (par, distance, handicap per hole by tee color) and **round score extraction**
- Review and verify AI-extracted data before saving

### Dashboard
- **Bento grid layout** with at-a-glance stats: scoring average, handicap index, fairways hit %, GIR %, putts per round, scrambling %
- **Performance chart** (Recharts) tracking score, fairways, GIR, and putts across rounds
- **Recent rounds list** with quick-view of scores vs. par

### Round Management
- **Add rounds** via dialog with two modes: **Manual Entry** or **Upload Scorecard**
- Hole-by-hole score entry with auto-calculated subtotals (Out / In / Total)
- Course selection with combobox search, date picker, 9/18 hole toggle
- Optional weather and notes fields
- Full **data table** with search, sorting, pagination, and row actions (edit/delete)

### Course Management
- Add and manage golf courses with full hole-by-hole data (par, distance, handicap)
- Support for 9 and 18 hole courses with multiple tee colors
- AI-powered course data extraction from scorecard images
- Course rating and slope rating tracking
- Edit and delete courses with data table UI

### Settings
- **Account** settings (email display)
- **Preferences**: unit selection (yards/meters), theme toggle (light/dark/system via `next-themes`)
- **Golf**: default tee color selection

### Authentication
- Email/password login and sign-up with Supabase Auth
- Google OAuth integration
- Animated auth UI with success/error states and transitions
- Protected routes with automatic redirect

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript (strict mode) |
| **UI Library** | React 19 |
| **Styling** | Tailwind CSS 4 + shadcn/ui (New York variant) |
| **Animations** | Framer Motion / Motion |
| **Database & Auth** | Supabase (PostgreSQL + Auth + RLS) |
| **AI / OCR** | Google Gemini 3 Flash (Vision) |
| **Charts** | Recharts |
| **Data Tables** | TanStack Table |
| **Icons** | Lucide React, Radix Icons, Tabler Icons, Remix Icons |
| **Runtime** | Bun |

---

## Project Structure

```
golftracker/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── courses/        # CRUD API routes for courses
│   │   │   ├── rounds/         # CRUD API routes for rounds
│   │   │   ├── ocr/            # AI scorecard processing
│   │   │   │   ├── course/     # Extract course data from image
│   │   │   │   └── round/      # Extract scores from image
│   │   │   └── settings/       # User preferences API
│   │   ├── dashboard/          # Main dashboard page
│   │   ├── courses/            # Course management page
│   │   ├── rounds/             # Round management page
│   │   ├── statistics/         # Statistics page (coming soon)
│   │   ├── settings/           # Settings page with categories
│   │   ├── login/              # Login page
│   │   └── signup/             # Sign-up page
│   ├── components/
│   │   ├── auth/               # Auth layout, login/signup forms, Google OAuth
│   │   ├── courses/            # AddCourseDialog
│   │   ├── dashboard/          # HeroStatsCard, PerformanceChart, RecentRoundsList
│   │   ├── navigation/         # UserMenu
│   │   ├── rounds/             # AddRoundDialog (manual entry + OCR upload)
│   │   └── ui/                 # 28 shadcn/ui & custom components
│   └── lib/
│       ├── auth.ts             # Auth helper functions
│       ├── gemini.ts           # Gemini AI client
│       ├── chartUtils.ts       # Chart data utilities
│       ├── utils.ts            # cn() and general utilities
│       └── supabase/           # Supabase client (server + browser)
├── supabase/
│   ├── migrations/             # 12 SQL migrations
│   └── seeds/                  # Seed data
├── docs/                       # Project documentation
└── public/                     # Static assets (logo, backgrounds)
```

---

## Database Schema

Built on **Supabase PostgreSQL** with **Row Level Security** on all tables:

| Table | Purpose |
|---|---|
| `accounts` | User profiles (handicap, avatar, home course, preferences) |
| `courses` | Golf course master data (name, location, holes, rating, slope) |
| `course_holes` | Hole-by-hole template data (par, distance, handicap, tee color) |
| `rounds` | Round metadata (date, course, total score, weather, notes) |
| `round_holes` | Hole-by-hole performance (score, putts, fairway hit, GIR, penalties) |

Auto-managed `updated_at` timestamps and automatic account creation on signup via database triggers.

---

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) (or Node.js 18+)
- A [Supabase](https://supabase.com) project
- A [Google AI Studio](https://aistudio.google.com) API key (for Gemini)

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd golftracker

# Install dependencies
bun install
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
```

### Database Setup

Run the SQL migrations in your Supabase project's SQL Editor in order, starting with `supabase/migrations/001_initial_schema.sql`.

### Development

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Build

```bash
bun run build
bun run start
```

---

## Scripts

| Command | Description |
|---|---|
| `bun run dev` | Start development server |
| `bun run build` | Build for production |
| `bun run start` | Start production server |
| `bun run lint` | Run ESLint |

---

## Roadmap

- [ ] **Statistics page** — in-depth analytics (GIR %, fairway %, scoring trends, scrambling)
- [ ] **Landing page** — public-facing marketing page
- [ ] **Handicap calculation** — automatic handicap index tracking
- [ ] **Social features** — share rounds and compare with friends
