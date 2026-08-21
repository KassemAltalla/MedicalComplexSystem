import { getTranslations } from 'next-intl/server';
import { getAppointments } from '@/actions/appointment';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { CalendarDays, PlusCircle, Search, Clock, FileText, Phone } from 'lucide-react';
import AppointmentsClient from './AppointmentsClient';

export default async function AppointmentsPage({
  params,
  searchParams
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ doctor?: string, patient?: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Appointment' });
  const filters = await searchParams;

  const appointments = await getAppointments({
    doctorQuery: filters.doctor,
    patientQuery: filters.patient
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <CalendarDays className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            {t('title')}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm md:text-base">
            {t('subtitle')}
          </p>
        </div>
        
        <Link href="/appointments/new">
          <Button className="glow-button bg-blue-600 hover:bg-blue-700 text-white gap-2 h-11 px-6 rounded-xl w-full md:w-auto">
            <PlusCircle className="w-5 h-5" />
            <span className="font-semibold">{t('new')}</span>
          </Button>
        </Link>
      </div>

      {/* Main Content with Client-Side Filtering */}
      <AppointmentsClient 
        locale={locale}
        initialAppointments={appointments}
      />
    </div>
  );
}
