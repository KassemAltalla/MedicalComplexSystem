import { prisma } from '@/lib/prisma';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Building2, Calendar, Clock, Edit, Phone, Mail, FileText, User, Trash2 } from 'lucide-react';
import { notFound } from 'next/navigation';
import DeleteDoctorButton from './DeleteDoctorButton';

export default async function DoctorDetailsPage({ params }: { params: Promise<{ locale: string, id: string }> }) {
  const { locale, id } = await params;
  const t = await getTranslations({ locale, namespace: 'Doctor' });
  
  const doctor = await prisma.doctor.findUnique({
    where: { id },
    include: { clinic: true }
  });

  if (!doctor) {
    notFound();
  }

  const doctorName = typeof doctor.name === 'object' && doctor.name !== null 
    ? (doctor.name as Record<string, string>)[locale] || (doctor.name as Record<string, string>)['ar'] || (doctor.name as Record<string, string>)['en']
    : String(doctor.name);

  const clinicName = doctor.clinic && typeof doctor.clinic.name === 'object' && doctor.clinic.name !== null
    ? (doctor.clinic.name as Record<string, string>)[locale] || (doctor.clinic.name as Record<string, string>)['ar'] || (doctor.clinic.name as Record<string, string>)['en']
    : (doctor.clinic ? String(doctor.clinic.name) : '-');

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
      {/* Top Breadcrumb Navigation */}
      <div className="flex items-center justify-between">
        <Link href="/doctors">
          <Button variant="ghost" size="sm" className="gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
            {locale === 'ar' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            <span>{locale === 'ar' ? 'العودة إلى الأطباء' : 'Back to Doctors'}</span>
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <Link href={`/doctors/${id}/edit`}>
            <Button variant="outline" size="sm" className="gap-2 text-blue-600 border-blue-200 hover:bg-blue-50 dark:border-blue-900 dark:hover:bg-blue-900/30">
              <Edit className="w-4 h-4" />
              <span>{t('edit')}</span>
            </Button>
          </Link>
          <DeleteDoctorButton id={id} locale={locale} />
        </div>
      </div>

      <div className="glass-card rounded-2xl p-8 relative overflow-hidden border border-slate-200/80 dark:border-slate-800">
        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-6 mb-10 pb-8 border-b border-slate-200/70 dark:border-slate-800 relative z-10">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-600 text-white flex items-center justify-center shadow-xl shadow-blue-500/20">
            <User className="w-10 h-10" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              {doctorName}
            </h1>
            <div className="flex items-center gap-3 text-sm font-medium text-slate-500 dark:text-slate-400">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                <FileText className="w-4 h-4" />
                {doctor.specialization}
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                {t('licenseNumber')}: {doctor.licenseNumber}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4">
              {locale === 'ar' ? 'معلومات التواصل' : 'Contact Information'}
            </h3>
            
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-1">{t('phoneNumber')}</p>
                <p className="text-slate-900 dark:text-white font-semibold" dir="ltr">{doctor.phoneNumber}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-1">{t('email')}</p>
                <p className="text-slate-900 dark:text-white font-semibold" dir="ltr">{doctor.email}</p>
              </div>
            </div>
          </div>

          {/* Schedule Info */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4">
              {locale === 'ar' ? 'العيادة والدوام' : 'Clinic & Schedule'}
            </h3>
            
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-1">{t('clinic')}</p>
                <p className="text-slate-900 dark:text-white font-semibold">{clinicName}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-1">{t('workingDays')}</p>
                <p className="text-slate-900 dark:text-white font-semibold">{doctor.workingDays}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-1">{t('time')}</p>
                <p className="text-slate-900 dark:text-white font-semibold">{doctor.startTime} - {doctor.endTime}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
