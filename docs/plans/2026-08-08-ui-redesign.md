# Medical Complex System UI Redesign Implementation Plan

> **For Antigravity:** REQUIRED WORKFLOW: Use `.agent/workflows/execute-plan.md` to execute this plan in single-flow mode.

**Goal:** Transform the clinic management user interface into a premium, modern medical dashboard featuring Cyan & Deep Navy aesthetics, glassmorphism, dynamic navbar with locale switcher, and enhanced interactive cards/tables.

**Architecture:** Update `globals.css` with a curated Medical Cyan & Navy color palette and utility classes. Create a reusable `Navbar` component with locale switching. Redesign `/clinics` listing page with hero stats and glass cards/tables. Redesign `/clinics/new` creation page with bilingual form sections and micro-interactions.

**Tech Stack:** Next.js 16 (App Router), Tailwind CSS v4, `shadcn/ui`, Lucide Icons, `next-intl`.

---

### Task 1: Design System & Globals Enhancements

**Files:**
- Modify: `src/app/globals.css`

**Step 1: Write failing test / check visual tokens**
Add `.glass-card` and `.glass-nav` utilities and custom medical color variables in `globals.css`.

**Step 2: Apply CSS changes**
```css
/* Update globals.css with medical theme and glass utilities */
```

**Step 3: Verify build**
Run: `npm run build`
Expected: PASS

**Step 4: Commit**
`git commit -m "feat: enhance globals.css with medical design system and glassmorphism"`

---

### Task 2: Navigation Bar Component (Header)

**Files:**
- Create: `src/components/navbar.tsx`
- Modify: `src/app/[locale]/layout.tsx`

**Step 1: Create Navbar component**
Includes Medical logo, status badge, title, and language switcher (`/ar` and `/en`).

**Step 2: Integrate into RootLayout**
Render `<Navbar />` inside `src/app/[locale]/layout.tsx`.

**Step 3: Verify build**
Run: `npm run build`
Expected: PASS

**Step 4: Commit**
`git commit -m "feat: add glassmorphic Navbar component with locale switcher"`

---

### Task 3: Redesign Clinics Listing Page

**Files:**
- Modify: `src/app/[locale]/clinics/page.tsx`

**Step 1: Update page layout**
Add Hero stats section (Total Clinics, Active Shift status, Quick actions), search bar, and glassmorphic clinic cards/table with colorful status badges.

**Step 2: Verify build & tests**
Run: `npm run build; npx vitest run`
Expected: PASS

**Step 3: Commit**
`git commit -m "feat: redesign clinics listing page with hero stats and glassmorphic tables"`

---

### Task 4: Redesign Clinic Creation Page

**Files:**
- Modify: `src/app/[locale]/clinics/new/page.tsx`

**Step 1: Update form layout**
Group inputs visually into Arabic & English sections with badges, add time picker icons, and dynamic loading button with `sonner` notifications.

**Step 2: Verify build & tests**
Run: `npm run build; npx vitest run`
Expected: PASS

**Step 3: Commit**
`git commit -m "feat: redesign clinic creation form with premium glassmorphic UI"`
