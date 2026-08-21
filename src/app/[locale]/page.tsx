import { prisma } from '@/lib/prisma';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { 
  Building2, 
  Users, 
  CalendarDays, 
  Clock, 
  Phone, 
  MapPin, 
  Stethoscope, 
  ShieldCheck, 
  ArrowLeft, 
  ArrowRight,
  PlusCircle,
  PhoneCall,
  Activity
} from 'lucide-react';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Home' });

  // Fetch real data from database
  const [clinicsCount, doctorsCount, appointmentsCount, clinics, doctors] = await Promise.all([
    prisma.clinic.count().catch(() => 0),
    prisma.doctor.count().catch(() => 0),
    prisma.appointment.count().catch(() => 0),
    prisma.clinic.findMany({
      include: { doctors: true },
      take: 6,
      orderBy: { createdAt: 'desc' }
    }).catch(() => []),
    prisma.doctor.findMany({
      include: { clinic: true },
      take: 6,
      orderBy: { createdAt: 'desc' }
    }).catch(() => [])
  ]);

  const ArrowIcon = locale === 'ar' ? ArrowLeft : ArrowRight;

  return (
    <div className="space-y-16 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative pt-8 md:pt-14 pb-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="glass-card rounded-3xl p-8 md:p-12 border border-slate-200/80 dark:border-slate-800 relative overflow-hidden">
            {/* Ambient static gradient accents */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 dark:bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 dark:bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-3xl space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 text-xs font-bold border border-cyan-500/20">
                <ShieldCheck className="w-4 h-4" />
                <span>{t('badge')}</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                {t('title')}
              </h1>

              {/* Subtitle / Description */}
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                {t('description')}
              </p>

              {/* Action Buttons (CTAs) */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link href="/appointments/new">
                  <Button size="lg" className="glow-button bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-700 hover:from-cyan-500 hover:to-blue-500 text-white font-bold h-12 px-7 rounded-xl shadow-lg shadow-cyan-600/20 gap-2">
                    <PlusCircle className="w-5 h-5" />
                    <span>{t('bookAppointment')}</span>
                  </Button>
                </Link>

                <Link href="/clinics">
                  <Button size="lg" variant="outline" className="h-12 px-6 rounded-xl border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold gap-2">
                    <Building2 className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                    <span>{t('exploreClinics')}</span>
                  </Button>
                </Link>

                <Link href="/doctors">
                  <Button size="lg" variant="ghost" className="h-12 px-5 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium gap-2">
                    <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span>{t('exploreDoctors')}</span>
                  </Button>
                </Link>
              </div>

              {/* Quick Contact Bar */}
              <div className="pt-6 border-t border-slate-200/60 dark:border-slate-800/80 flex flex-wrap items-center gap-6 text-xs font-semibold text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>{t('emergency')}:</span>
                  <span className="text-slate-900 dark:text-white font-bold" dir="ltr">{t('emergencyVal')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>{t('workingHoursVal')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS & OVERVIEW CARDS */}
      <section>
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Clinics Metric */}
            <div className="glass-card rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
                  {clinicsCount}
                </div>
                <div className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">
                  {t('clinicsTitle')}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {t('clinicsDesc')}
                </p>
              </div>
            </div>

            {/* Doctors Metric */}
            <div className="glass-card rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
                  {doctorsCount}
                </div>
                <div className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">
                  {t('doctorsTitle')}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {t('doctorsDesc')}
                </p>
              </div>
            </div>

            {/* Appointments Metric */}
            <div className="glass-card rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                <CalendarDays className="w-6 h-6" />
              </div>
              <div>
                <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
                  {appointmentsCount}
                </div>
                <div className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">
                  {t('appointmentsTitle')}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {t('appointmentsDesc')}
                </p>
              </div>
            </div>

            {/* Care / Readiness Metric */}
            <div className="glass-card rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                  100%
                </div>
                <div className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">
                  {t('supportTitle')}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {t('supportDesc')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SPECIALIZED CLINICS SECTION */}
      <section>
        <div className="container mx-auto px-4 max-w-6xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Building2 className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
                <span>{t('clinicsSectionTitle')}</span>
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {t('clinicsSectionSubtitle')}
              </p>
            </div>
            <Link href="/clinics">
              <Button variant="ghost" size="sm" className="gap-2 text-cyan-700 dark:text-cyan-400 hover:text-cyan-800 font-semibold">
                <span>{t('viewAllClinics')}</span>
                <ArrowIcon className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {clinics.length === 0 ? (
            <div className="glass-card rounded-2xl p-12 text-center text-slate-500">
              {t('noClinicsFound')}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {clinics.map((clinic: any) => {
                const clinicName = typeof clinic.name === 'object' && clinic.name !== null
                  ? (clinic.name as Record<string, string>)[locale] || (clinic.name as Record<string, string>)['ar'] || (clinic.name as Record<string, string>)['en']
                  : String(clinic.name);

                return (
                  <div key={clinic.id} className="glass-card rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold">
                          <Stethoscope className="w-5 h-5" />
                        </div>
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          {locale === 'ar' ? 'متاحة' : 'Active'}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                          {clinicName}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-2">
                          <Clock className="w-3.5 h-3.5 text-cyan-600" />
                          <span>{clinic.startTime} - {clinic.endTime}</span>
                        </div>
                        <div className="text-xs font-medium text-slate-600 dark:text-slate-300 mt-1">
                          {clinic.workingDays}
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-200/50 dark:border-slate-800/80 flex items-center justify-between">
                      <span className="text-xs text-slate-500">
                        {clinic.doctors?.length || 0} {locale === 'ar' ? 'أطباء مسجلين' : 'Registered doctors'}
                      </span>
                      <Link href="/appointments/new">
                        <Button size="sm" variant="outline" className="h-8 text-xs font-semibold rounded-lg border-cyan-600/30 text-cyan-700 dark:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-950/30">
                          {t('bookInClinic')}
                        </Button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* 4. FEATURED DOCTORS SECTION */}
      <section>
        <div className="container mx-auto px-4 max-w-6xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <span>{t('doctorsSectionTitle')}</span>
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {t('doctorsSectionSubtitle')}
              </p>
            </div>
            <Link href="/doctors">
              <Button variant="ghost" size="sm" className="gap-2 text-blue-700 dark:text-blue-400 hover:text-blue-800 font-semibold">
                <span>{t('viewAllDoctors')}</span>
                <ArrowIcon className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {doctors.length === 0 ? (
            <div className="glass-card rounded-2xl p-12 text-center text-slate-500">
              {t('noDoctorsFound')}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {doctors.map((doctor: any) => {
                const doctorName = typeof doctor.name === 'object' && doctor.name !== null
                  ? (doctor.name as Record<string, string>)[locale] || (doctor.name as Record<string, string>)['ar'] || (doctor.name as Record<string, string>)['en']
                  : String(doctor.name);

                const clinicName = doctor.clinic && typeof doctor.clinic.name === 'object' && doctor.clinic.name !== null
                  ? (doctor.clinic.name as Record<string, string>)[locale] || (doctor.clinic.name as Record<string, string>)['ar'] || (doctor.clinic.name as Record<string, string>)['en']
                  : (doctor.clinic ? String(doctor.clinic.name) : '-');

                return (
                  <div key={doctor.id} className="glass-card rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 space-y-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm">
                        <Users className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white text-base leading-tight">
                          {doctorName}
                        </h3>
                        <span className="inline-block mt-1 text-xs font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                          {doctor.specialization}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-200/50 dark:border-slate-800/80">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-3.5 h-3.5 text-cyan-600" />
                        <span className="font-semibold">{clinicName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span dir="ltr">{doctor.phoneNumber}</span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {t('licenseNo')}: {doctor.licenseNumber}
                      </div>
                    </div>

                    <div className="pt-2">
                      <Link href={`/doctors/${doctor.id}`}>
                        <Button size="sm" variant="ghost" className="w-full h-8 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg">
                          {locale === 'ar' ? 'عرض السيرة والتفاصيل' : 'View Details'}
                        </Button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* 5. CONTACT, LOCATION & OPERATING HOURS (FOOTER SECTION) */}
      <section>
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="glass-card rounded-3xl p-8 md:p-10 border border-slate-200/80 dark:border-slate-800 space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                {t('contactSectionTitle')}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {t('contactSectionSubtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Working Hours */}
              <div className="p-5 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800/80 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="font-bold text-slate-900 dark:text-white text-sm">
                  {t('workingHours')}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {t('workingHoursVal')}
                </p>
              </div>

              {/* Location */}
              <div className="p-5 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800/80 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="font-bold text-slate-900 dark:text-white text-sm">
                  {t('address')}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {t('addressVal')}
                </p>
              </div>

              {/* Reception Phone */}
              <div className="p-5 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800/80 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="font-bold text-slate-900 dark:text-white text-sm">
                  {t('phone')}
                </div>
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300" dir="ltr">
                  {t('phoneVal')}
                </p>
              </div>

              {/* Emergency Hotline */}
              <div className="p-5 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800/80 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div className="font-bold text-slate-900 dark:text-white text-sm">
                  {t('emergency')}
                </div>
                <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400" dir="ltr">
                  {t('emergencyVal')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
