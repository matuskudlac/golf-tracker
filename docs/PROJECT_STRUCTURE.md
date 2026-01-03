# Golf Tracker AI - Project Structure Guide

This document explains every directory and file in the Golf Tracker AI project.

---

## 📁 Root Directory Structure

```
golftracker/
├── .git/                    # Git version control data
├── .next/                   # Next.js build output (auto-generated)
├── docs/                    # Project documentation
├── node_modules/            # NPM dependencies (auto-generated)
├── public/                  # Static assets
├── src/                     # Source code
├── .gitignore              # Git ignore rules
├── components.json         # shadcn/ui configuration
├── eslint.config.mjs       # ESLint configuration
├── next-env.d.ts           # Next.js TypeScript declarations
├── next.config.ts          # Next.js configuration
├── package.json            # Project dependencies & scripts
├── package-lock.json       # Locked dependency versions
├── postcss.config.mjs      # PostCSS configuration
├── README.md               # Project README
└── tsconfig.json           # TypeScript configuration
```

---

## 🔧 Configuration Files

### `.gitignore`
**Purpose**: Tells Git which files/folders to ignore  
**Key Exclusions**:
- `node_modules/` - Dependencies (too large for Git)
- `.next/` - Build output (regenerated on build)
- `.env*.local` - Environment secrets (security)
- `*.log` - Log files

### `package.json`
**Purpose**: Project manifest with dependencies and scripts  
**Key Contents**:
```json
{
  "name": "golftracker",
  "version": "0.1.0",
  "scripts": {
    "dev": "next dev",           // Start development server
    "build": "next build",       // Build for production
    "start": "next start",       // Start production server
    "lint": "eslint"             // Run code linting
  }
}
```

**Dependencies Installed**:
- **Next.js 16.1.1** - React framework
- **React 19.2.3** - UI library
- **TypeScript 5** - Type safety
- **Tailwind CSS 4** - Styling
- **lucide-react** - Icon library
- **shadcn/ui components** (via Radix UI primitives)

### `components.json`
**Purpose**: shadcn/ui configuration file  
**Settings**:
- **Style**: `new-york` (shadcn design variant)
- **Base Color**: `slate` (theme color)
- **CSS Variables**: Enabled (for theming)
- **Icon Library**: `lucide`
- **Aliases**: Path shortcuts (`@/components`, `@/lib`, etc.)

### `tsconfig.json`
**Purpose**: TypeScript compiler configuration  
**Key Settings**:
- Strict mode enabled
- Path aliases configured (`@/*` → `./src/*`)
- JSX support for React
- Module resolution for Next.js

### `next.config.ts`
**Purpose**: Next.js framework configuration  
**Current**: Default configuration (can be extended for custom settings)

### `eslint.config.mjs`
**Purpose**: Code quality and style rules  
**Current**: Next.js recommended ESLint rules

### `postcss.config.mjs`
**Purpose**: CSS processing configuration  
**Current**: Tailwind CSS integration

### `next-env.d.ts`
**Purpose**: Next.js TypeScript type definitions  
**Note**: Auto-generated, do not edit manually

---

## 📂 Directory Breakdown

### `/docs/`
**Purpose**: Project documentation  
**Contents**:
- `Project Specification.txt` - Original project requirements and roadmap

### `/public/`
**Purpose**: Static assets served at root URL  
**Contents**:
- `file.svg` - Next.js starter icon
- `globe.svg` - Next.js starter icon
- `next.svg` - Next.js logo
- `vercel.svg` - Vercel logo
- `window.svg` - Next.js starter icon

**Usage**: Files here are accessible at `/filename.ext` (e.g., `/globe.svg`)

### `/src/`
**Purpose**: All application source code  
**Structure**:
```
src/
├── app/              # Next.js App Router pages & layouts
├── components/       # React components
└── lib/              # Utility functions & helpers
```

---

## 📄 Source Code Files

### `/src/app/`
**Purpose**: Next.js App Router - file-based routing system

#### `layout.tsx`
**Purpose**: Root layout component (wraps all pages)  
**Contains**:
- HTML structure (`<html>`, `<body>`)
- Global metadata (title, description)
- Font configuration
- Wraps all child pages

#### `page.tsx`
**Purpose**: Homepage component (`/` route)  
**Current**: Next.js starter page with links and examples

#### `globals.css`
**Purpose**: Global styles and Tailwind configuration  
**Contains**:
- Tailwind directives (`@import "tailwindcss"`)
- CSS custom properties for theming (shadcn/ui colors)
- Dark mode variables
- Base styles

#### `favicon.ico`
**Purpose**: Browser tab icon  
**Current**: Next.js default favicon

---

### `/src/components/ui/`
**Purpose**: shadcn/ui base components (reusable UI primitives)

#### `button.tsx`
**Purpose**: Customizable button component  
**Features**:
- Multiple variants (default, destructive, outline, ghost, link)
- Size options (default, sm, lg, icon)
- Built on Radix UI Slot
- Fully typed with TypeScript

#### `card.tsx`
**Purpose**: Card container component  
**Sub-components**:
- `Card` - Main container
- `CardHeader` - Top section
- `CardTitle` - Title text
- `CardDescription` - Subtitle text
- `CardContent` - Main content area
- `CardFooter` - Bottom section

#### `input.tsx`
**Purpose**: Text input field component  
**Features**:
- Styled with Tailwind
- Accessible (forwards refs)
- Supports all native input props

#### `label.tsx`
**Purpose**: Form label component  
**Features**:
- Built on Radix UI Label
- Accessible (proper ARIA attributes)
- Styled consistently

---

### `/src/lib/`
**Purpose**: Utility functions and helper code

#### `utils.ts`
**Purpose**: Common utility functions  
**Contains**:
- `cn()` function - Merges Tailwind classes intelligently
  - Uses `clsx` for conditional classes
  - Uses `tailwind-merge` to prevent conflicts

**Example Usage**:
```typescript
import { cn } from "@/lib/utils"

// Merges classes, removes duplicates
cn("px-4 py-2", "px-6") // Result: "py-2 px-6"
```

---

## 🚫 Auto-Generated Directories (Do Not Edit)

### `/.git/`
**Purpose**: Git version control internal data  
**Warning**: Never modify manually

### `/.next/`
**Purpose**: Next.js build cache and output  
**Warning**: Deleted and regenerated on each build

### `/node_modules/`
**Purpose**: Installed NPM packages  
**Size**: ~362 packages  
**Warning**: Regenerated via `npm install`

---

## 🎯 Import Aliases

The project uses TypeScript path aliases for cleaner imports:

| Alias | Resolves To | Example |
|-------|-------------|---------|
| `@/components` | `src/components` | `import { Button } from "@/components/ui/button"` |
| `@/lib` | `src/lib` | `import { cn } from "@/lib/utils"` |
| `@/app` | `src/app` | `import styles from "@/app/globals.css"` |

---

## 📦 Package Scripts

Run these commands in the terminal:

```bash
# Start development server (http://localhost:3000)
npm run dev

# Build production bundle
npm run build

# Start production server
npm run start

# Run ESLint code checks
npm run lint
```

---

## 🔄 Next Steps

Files/folders that will be added in future phases:

- **Phase 1 (Tomorrow)**:
  - `/src/lib/supabase.ts` - Supabase client
  - `.env.local` - Environment variables
  - `/src/app/login/page.tsx` - Login page
  - `/src/app/dashboard/page.tsx` - Dashboard page

- **Phase 2**:
  - `/src/components/RoundEntryForm.tsx` - Manual entry form
  - `/src/app/rounds/page.tsx` - Rounds listing

- **Phase 3**:
  - `/src/app/api/ocr/route.ts` - AI OCR endpoint
  - `/src/components/ImageUpload.tsx` - Upload component

---

## 📚 Key Technologies Reference

- **Next.js Docs**: https://nextjs.org/docs
- **shadcn/ui Docs**: https://ui.shadcn.com
- **Tailwind CSS Docs**: https://tailwindcss.com/docs
- **Lucide Icons**: https://lucide.dev
- **TypeScript Docs**: https://www.typescriptlang.org/docs

---

*Last Updated: 2026-01-02*
