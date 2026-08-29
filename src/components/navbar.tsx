'use client';

import { useState, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import {
  Activity,
  Building2,
  CalendarDays,
  Home,
  Menu,
  PlusCircle,
  Users,
  X
} from 'lucide-react';

export function Navbar() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('Navigation');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: t('home'), icon: Home },
    { href: '/clinics', label: t('clinics'), icon: Building2 },
    { href: '/doctors', label: t('doctors'), icon: Users },
    { href: '/appointments', label: t('appointments'), icon: CalendarDays },
  ];

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const toggleLanguage = (newLocale: 'ar' | 'en') => {
    router.replace(pathname, { locale: newLocale });
  };

  const isLinkActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <header className="glass-nav sticky top-0 z-50 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand Logo & Title */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <Activity className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <h1 className="font-bold text-base sm:text-lg leading-tight bg-gradient-to-r from-slate-900 via-blue-900 to-cyan-700 dark:from-white dark:via-slate-200 dark:to-cyan-400 bg-clip-text text-transparent">
              {locale === 'ar' ? 'نظام المركز الطبي' : 'Medical Complex System'}
            </h1>
            <span className="text-[10px] sm:text-xs text-muted-foreground font-medium hidden xs:inline-block">
              {locale === 'ar' ? 'إدارة وحجز العيادات' : 'Clinic Management & Booking'}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isLinkActive(link.href);
            return (
              <Link key={link.href} href={link.href}>
                <Button
                  variant={active ? 'secondary' : 'ghost'}
                  size="sm"
                  className={`gap-2 font-medium transition-all ${active
                    ? 'bg-cyan-500/10 text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-300 font-semibold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-500 dark:text-slate-400'}`} />
                  <span>{link.label}</span>
                </Button>
              </Link>
            );
          })}
        </nav>

        {/* Action Controls: CTA, Language & Mobile Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Desktop "Book Appointment" CTA Button */}
          <Link href="/appointments/new" className="hidden sm:inline-flex">
            <Button size="sm" className="glow-button bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium gap-1.5 rounded-xl px-3.5 shadow-sm">
              <PlusCircle className="w-4 h-4" />
              <span>{locale === 'ar' ? 'حجز موعد' : 'Book Appointment'}</span>
            </Button>
          </Link>

          {/* Language Switcher (Visible on both Desktop and Mobile) */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-0.5 rounded-xl border border-slate-200 dark:border-slate-700/50">
            <Button
              variant={locale === 'ar' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => toggleLanguage('ar')}
              className={`h-7 px-2 text-xs font-bold rounded-lg transition-all ${locale === 'ar'
                ? 'bg-white dark:bg-slate-900 text-cyan-700 dark:text-cyan-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
            >
              <span className="hidden sm:inline ms-1">العربية</span><span className="sm:hidden ms-0.5">AR</span>
            </Button>
            <Button
              variant={locale === 'en' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => toggleLanguage('en')}
              className={`h-7 px-2 text-xs font-bold rounded-lg transition-all ${locale === 'en'
                ? 'bg-white dark:bg-slate-900 text-cyan-700 dark:text-cyan-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
            >
              <span className="hidden sm:inline ms-1">English</span><span className="sm:hidden ms-0.5">EN</span>
            </Button>
          </div>

          {/* Mobile Menu Toggle Button (Visible only on mobile/tablet < md) */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden h-9 w-9 rounded-xl border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Dropdown Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl px-4 py-4 space-y-2 shadow-xl">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isLinkActive(link.href);
              return (
                <Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)}>
                  <div
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${active
                      ? 'bg-cyan-500/10 text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-300 font-bold border border-cyan-500/20'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
                      }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-500'}`} />
                    <span>{link.label}</span>
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Mobile CTA: Book Appointment */}
          <div className="pt-2">
            <Link href="/appointments/new" onClick={() => setMobileMenuOpen(false)} className="block">
              <Button className="w-full glow-button bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold gap-2 rounded-xl h-10 shadow-md">
                <PlusCircle className="w-4 h-4" />
                <span>{locale === 'ar' ? 'حجز موعد جديد' : 'Book New Appointment'}</span>
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
