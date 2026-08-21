import { prisma } from '@/lib/prisma';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Sparkles, Users, Stethoscope, Building2, Phone } from 'lucide-react';

export default async function DoctorsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Doctor' });
  const doctors = await prisma.doctor.findMany({
    include: { clinic: true }
  });
  const totalDoctors = doctors.length;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl space-y-8">
      {/* Header & Title Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-6 rounded-2xl relative overflow-hidden">
        <div className="absolute -top-12 -left-12 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="space-y-1 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-700 dark:text-blue-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{locale === 'ar' ? 'إدارة طاقم الأطباء' : 'Doctors Dashboard'}</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {t('title')}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {locale === 'ar' 
              ? 'عرض وإدارة بيانات الأطباء والتخصصات والمواعيد.' 
              : 'Overview and management of doctors, specializations, and schedules.'}
          </p>
        </div>

        <Link href="/doctors/new" className="z-10 self-start md:self-auto">
          <Button size="lg" className="glow-button bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold shadow-lg shadow-blue-600/25 px-6 rounded-xl gap-2">
            <Plus className="w-5 h-5" />
            <span>{t('add')}</span>
          </Button>
        </Link>
      </div>

      {/* Main Doctors Table / Glass Card */}
      <div className="glass-card rounded-2xl overflow-hidden">
        {totalDoctors === 0 ? (
          <div className="py-16 px-4 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
              <Users className="w-8 h-8" />
            </div>
            <div className="space-y-1 max-w-sm mx-auto">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {locale === 'ar' ? 'لا يوجد أطباء مسجلين حالياً' : 'No Doctors Found'}
              </h3>
              <p className="text-xs text-slate-500">
                {locale === 'ar' 
                  ? 'قم بإضافة الطبيب الأول لبدء تنظيم المواعيد.' 
                  : 'Start by adding your first doctor to manage appointment schedules.'}
              </p>
            </div>
            <Link href="/doctors/new" className="inline-block pt-2">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-500 text-white rounded-lg">
                <Plus className="w-4 h-4 me-1" />
                <span>{t('add')}</span>
              </Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-100/70 dark:bg-slate-850">
                <TableRow>
                  <TableHead className="font-bold text-slate-700 dark:text-slate-300 py-4">{t('name')}</TableHead>
                  <TableHead className="font-bold text-slate-700 dark:text-slate-300">{t('specialization')}</TableHead>
                  <TableHead className="font-bold text-slate-700 dark:text-slate-300">{t('clinic')}</TableHead>
                  <TableHead className="font-bold text-slate-700 dark:text-slate-300">{t('phoneNumber')}</TableHead>
                  <TableHead className="font-bold text-slate-700 dark:text-slate-300 text-end">
                    {locale === 'ar' ? 'إجراءات' : 'Actions'}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {doctors.map((doctor: any) => {
                  const doctorName = typeof doctor.name === 'object' && doctor.name !== null 
                    ? (doctor.name as Record<string, string>)[locale] || (doctor.name as Record<string, string>)['ar'] || (doctor.name as Record<string, string>)['en']
                    : String(doctor.name);

                  const clinicName = doctor.clinic && typeof doctor.clinic.name === 'object' && doctor.clinic.name !== null
                    ? (doctor.clinic.name as Record<string, string>)[locale] || (doctor.clinic.name as Record<string, string>)['ar'] || (doctor.clinic.name as Record<string, string>)['en']
                    : (doctor.clinic ? String(doctor.clinic.name) : '-');

                  return (
                    <TableRow key={doctor.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer relative group">
                      <TableCell className="font-semibold text-slate-900 dark:text-slate-100 py-4">
                        <Link href={`/doctors/${doctor.id}`} className="absolute inset-0 z-0" aria-label="View doctor"></Link>
                        <div className="flex items-center gap-3 relative z-10 pointer-events-none">
                          <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
                            <Users className="w-5 h-5" />
                          </div>
                          <span>{doctorName}</span>
                        </div>
                      </TableCell>
                      <TableCell className="relative z-10 pointer-events-none">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          <Stethoscope className="w-3.5 h-3.5 text-blue-500" />
                          {doctor.specialization}
                        </span>
                      </TableCell>
                      <TableCell className="relative z-10 pointer-events-none">
                        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-700 dark:text-cyan-300 bg-cyan-500/10 px-2.5 py-1 rounded-md">
                          <Building2 className="w-3.5 h-3.5" />
                          <span>{clinicName}</span>
                        </div>
                      </TableCell>
                      <TableCell className="relative z-10 pointer-events-none">
                        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span>{doctor.phoneNumber}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-end relative z-10">
                        <Link href={`/doctors/${doctor.id}`}>
                          <Button variant="ghost" size="sm" className="h-8 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg">
                            {locale === 'ar' ? 'عرض التفاصيل' : 'View Details'}
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
