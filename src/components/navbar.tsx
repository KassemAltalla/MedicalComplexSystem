'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { Activity, Building2, CalendarDays, Globe, PlusCircle, Users } from 'lucide-react';

export function Navbar() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('Navigation');

  const navLinks = [
    { href: '/', label: t('home'), icon: Building2 },
    { href: '/clinics', label: t('clinics'), icon: Building2 },
    { href: '/doctors', label: t('doctors'), icon: Users },
    { href: '/appointments', label: t('appointments'), icon: CalendarDays },
  ];

  const toggleLanguage = (newLocale: 'ar' | 'en') => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <header className="glass-nav border-b border-slate-200/80 dark:border-slate-800/80">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand Logo & Title */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-none bg-gradient-to-r from-slate-900 via-blue-900 to-cyan-700 dark:from-white dark:via-slate-200 dark:to-cyan-400 bg-clip-text text-transparent">
              {locale === 'ar' ? 'نظام المركز الطبي' : 'Medical Complex System'}
            </h1>
            <span className="text-xs text-muted-foreground font-medium">
              {locale === 'ar' ? 'إدارة وحجز العيادات' : 'Clinic Management & Booking'}
            </span>
          </div>
        </Link>

        {/* Quick Navigation Links & Actions */}
        <div className="flex items-center gap-3">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link key={link.href} href={link.href}>
                <Button variant={pathname.startsWith(link.href) ? 'secondary' : 'ghost'} size="sm" className="gap-2 font-medium">
                  <Icon className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  <span>{link.label}</span>
                </Button>
              </Link>
            );
          })}

          <Link href="/appointments/new">
            <Button size="sm" className="glow-button bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium gap-2">
              <PlusCircle className="w-4 h-4" />
              <span>{locale === 'ar' ? 'حجز موعد' : 'Book Appointment'}</span>
            </Button>
          </Link>

          {/* Language Switcher */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700/50">
            <Button
              variant={locale === 'ar' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => toggleLanguage('ar')}
              className={`h-7 px-2.5 text-xs font-bold rounded-lg transition-all ${
                locale === 'ar'
                  ? 'bg-white dark:bg-slate-900 text-cyan-700 dark:text-cyan-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              🇸🇦 العربية
            </Button>
            <Button
              variant={locale === 'en' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => toggleLanguage('en')}
              className={`h-7 px-2.5 text-xs font-bold rounded-lg transition-all ${
                locale === 'en'
                  ? 'bg-white dark:bg-slate-900 text-cyan-700 dark:text-cyan-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              🇬🇧 English
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
