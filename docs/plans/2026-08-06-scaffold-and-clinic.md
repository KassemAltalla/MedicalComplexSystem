# Scaffold & Clinic Entity Implementation Plan

> **For Antigravity:** REQUIRED WORKFLOW: Use `.agent/workflows/execute-plan.md` to execute this plan in single-flow mode.

**Goal:** Scaffold Next.js 16 (i18n, RTL), Tailwind v4, Prisma (PostgreSQL with JSONB for languages), and implement Clinic entity with TDD.

**Architecture:** Next.js App Router with `next-intl` for bilingual (AR/EN) routing and RTL layout. Prisma `Json` type for translatable fields (`name`). Server actions for Clinic creation, verified by Vitest.

**Tech Stack:** Next.js 16, Tailwind CSS v4, Prisma, PostgreSQL, Zod, Vitest, next-intl.

---

### Task 1: Initialize Next.js Project & Tailwind v4 & i18n

**Files:**
- Create: `package.json`
- Create: `next.config.mjs`

**Step 1: Write the failing test**
*(Scaffolding)*

**Step 2: Run test to verify it fails**
N/A

**Step 3: Write minimal implementation**
Run: `npx -y create-next-app@latest . --typescript --eslint --tailwind --app --src-dir --import-alias "@/*" --use-npm`
Run: `npm install next-intl`

**Step 4: Run test to verify it passes**
Run: `npm run build`
Expected: PASS

**Step 5: Commit**
```bash
git add .
git commit -m "chore: scaffold next.js project with tailwind and next-intl"
```

### Task 2: Setup Prisma and Bilingual Clinic Schema

**Files:**
- Create: `prisma/schema.prisma`
- Create: `src/lib/prisma.ts`

**Step 1: Write the failing test**
*(Schema configuration)*

**Step 2: Run test to verify it fails**
N/A

**Step 3: Write minimal implementation**
Run: `npm install prisma --save-dev`
Run: `npx prisma init`
Modify `prisma/schema.prisma`:
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Clinic {
  id          String   @id @default(cuid())
  name        Json     // { "ar": "عيادة الأسنان", "en": "Dental Clinic" }
  workingDays String
  startTime   String
  endTime     String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

**Step 4: Run test to verify it passes**
Run: `npx prisma generate`
Expected: PASS

**Step 5: Commit**
```bash
git add .
git commit -m "chore: setup prisma and clinic schema with jsonb"
```

### Task 3: Clinic Server Action with TDD

**Files:**
- Create: `src/actions/clinic.ts`
- Create: `src/actions/__tests__/clinic.test.ts`

**Step 1: Write the failing test**
File: `src/actions/__tests__/clinic.test.ts`
```typescript
import { expect, test, vi } from 'vitest';
import { createClinic } from '../clinic';

vi.mock('../../lib/prisma', () => ({
  prisma: {
    clinic: {
      create: vi.fn().mockResolvedValue({ id: '1', name: { ar: 'أسنان', en: 'Dental' } }),
    },
  },
}));

test('createClinic successfully creates a clinic', async () => {
  const result = await createClinic({ 
    name: { ar: 'أسنان', en: 'Dental' }, 
    workingDays: 'Mon-Fri', 
    startTime: '08:00', 
    endTime: '16:00' 
  });
  expect(result.id).toBe('1');
});
```

**Step 2: Run test to verify it fails**
Run: `npm test`
Expected: FAIL 

**Step 3: Write minimal implementation**
File: `src/actions/clinic.ts`
```typescript
'use server'
import { prisma } from '../lib/prisma';
import { z } from 'zod';

const LocalizedStringSchema = z.object({
  ar: z.string().min(1),
  en: z.string().min(1),
});

const ClinicSchema = z.object({
  name: LocalizedStringSchema,
  workingDays: z.string().min(1),
  startTime: z.string().min(1),
  endTime: z.string().min(1),
});

export async function createClinic(data: z.infer<typeof ClinicSchema>) {
  const validData = ClinicSchema.parse(data);
  return await prisma.clinic.create({
    data: validData,
  });
}
```

**Step 4: Run test to verify it passes**
Run: `npm test`
Expected: PASS

**Step 5: Commit**
```bash
git add src/actions/
git commit -m "feat: add createClinic server action with i18n support"
```
