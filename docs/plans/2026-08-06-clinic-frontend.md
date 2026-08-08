# Clinic Frontend Implementation Plan

> **For Antigravity:** REQUIRED WORKFLOW: Use `.agent/workflows/execute-plan.md` to execute this plan in single-flow mode.

**Goal:** Build a modern, premium, bilingual (AR/EN) frontend for managing clinics, including a listing page and a creation form, using Next.js App Router, `next-intl`, and `shadcn/ui`.

**Architecture:** Setup `next-intl` routing. Use `shadcn/ui` with Tailwind v4 for premium glassmorphism. Fetch data directly via React Server Components and submit forms via Server Actions.

**Tech Stack:** Next.js 16, Tailwind CSS v4, shadcn/ui, next-intl, react-hook-form, zod.

---

### Task 1: Internationalization (next-intl) Routing Setup

**Files:**
- Create: `src/i18n/routing.ts`
- Create: `src/i18n/request.ts`
- Create: `src/middleware.ts`
- Create: `messages/en.json`
- Create: `messages/ar.json`
- Modify: Move `src/app/layout.tsx` and `src/app/page.tsx` to `src/app/[locale]/`

**Step 1: Write the routing files**
File: `src/i18n/routing.ts`
```typescript
import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['en', 'ar'],
  defaultLocale: 'ar'
});

export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);
```

File: `src/i18n/request.ts`
```typescript
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }
  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});
```

File: `src/middleware.ts`
```typescript
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: ['/', '/(ar|en)/:path*']
};
```

**Step 2: Create translations**
File: `messages/en.json`
```json
{
  "Clinic": {
    "title": "Clinics Management",
    "add": "Add New Clinic"
  }
}
```

File: `messages/ar.json`
```json
{
  "Clinic": {
    "title": "إدارة العيادات",
    "add": "إضافة عيادة جديدة"
  }
}
```

**Step 3: Move layout and page**
Run: 
```bash
mkdir -p src/app/\[locale\]
mv src/app/layout.tsx src/app/\[locale\]/
mv src/app/page.tsx src/app/\[locale\]/
```

Modify: `src/app/[locale]/layout.tsx`
Change signature to receive `locale`:
```typescript
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import "../globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Medical Complex System",
  description: "Advanced Clinic Management System",
};

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>
}>) {
  const { locale } = await params;
  const messages = await getMessages();
  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

**Step 4: Run test to verify it builds**
Run: `npm run build`
Expected: PASS

**Step 5: Commit**
```bash
git add .
git commit -m "feat: setup next-intl routing and layout"
```

---

### Task 2: Shadcn UI & Design System Setup

**Files:**
- Create: `components.json`
- Modify: `src/app/globals.css`

**Step 1: Init shadcn**
Run: `npx -y shadcn@latest init -y`

**Step 2: Add components**
Run: `npx -y shadcn@latest add button input table form toast -y`

**Step 3: Setup premium glassmorphism in globals.css**
Modify: `src/app/globals.css`
Append:
```css
@layer utilities {
  .glass {
    @apply bg-white/10 backdrop-blur-md border border-white/20 shadow-xl;
  }
}
```

**Step 4: Verify build**
Run: `npm run build`
Expected: PASS

**Step 5: Commit**
```bash
git add .
git commit -m "chore: setup shadcn UI and glassmorphism utilities"
```

---

### Task 3: Clinics Listing Page

**Files:**
- Create: `src/app/[locale]/clinics/page.tsx`

**Step 1: Write the implementation**
File: `src/app/[locale]/clinics/page.tsx`
```typescript
import { prisma } from '@/lib/prisma';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default async function ClinicsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const clinics = await prisma.clinic.findMany();
  
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Clinics</h1>
        <Link href="/clinics/new">
          <Button>Add Clinic</Button>
        </Link>
      </div>
      
      <div className="glass rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Working Days</TableHead>
              <TableHead>Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clinics.map((clinic) => (
              <TableRow key={clinic.id}>
                <TableCell className="font-medium">
                  {typeof clinic.name === 'object' && clinic.name !== null 
                    ? (clinic.name as Record<string, string>)[locale] 
                    : String(clinic.name)}
                </TableCell>
                <TableCell>{clinic.workingDays}</TableCell>
                <TableCell>{clinic.startTime} - {clinic.endTime}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
```

**Step 2: Run test to verify it builds**
Run: `npm run build`
Expected: PASS

**Step 3: Commit**
```bash
git add .
git commit -m "feat: add clinics listing page"
```

---

### Task 4: Clinic Creation Page

**Files:**
- Create: `src/app/[locale]/clinics/new/page.tsx`
- Create: `src/components/clinics/ClinicForm.tsx`

**Step 1: Write the form component**
File: `src/components/clinics/ClinicForm.tsx` (Use `use client`, `react-hook-form`, `zodResolver`, connect to `createClinic` action).

**Step 2: Write the page component**
File: `src/app/[locale]/clinics/new/page.tsx` (Server page that mounts `<ClinicForm />`).

**Step 3: Verify build**
Run: `npm run build`
Expected: PASS

**Step 4: Commit**
```bash
git add .
git commit -m "feat: add clinic creation form"
```
