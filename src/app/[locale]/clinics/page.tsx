import { prisma } from '@/lib/prisma';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Building2, Calendar, Clock, Plus, Sparkles, Stethoscope } from 'lucide-react';

export default async function ClinicsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Clinic' });
  const clinics = await prisma.clinic.findMany();
  const totalClinics = clinics.length;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl space-y-8">
      {/* Header & Title Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-6 rounded-2xl relative overflow-hidden">
        <div className="absolute -top-12 -left-12 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="space-y-1 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{locale === 'ar' ? 'إدارة المركز الطبي' : 'Medical Center Dashboard'}</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {t('title')}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {locale === 'ar' 
              ? 'عرض وتكفل بجميع العيادات الطبية، أوقات العمل، والجدول الزمني للحجوزات.' 
              : 'Overview and management of medical clinics, working hours, and schedules.'}
          </p>
        </div>

        <Link href="/clinics/new" className="z-10 self-start md:self-auto">
          <Button size="lg" className="glow-button bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-700 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold shadow-lg shadow-cyan-600/25 px-6 rounded-xl gap-2">
            <Plus className="w-5 h-5" />
            <span>{t('add')}</span>
          </Button>
        </Link>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-5 rounded-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">
              {locale === 'ar' ? 'إجمالي العيادات' : 'Total Clinics'}
            </span>
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
              {totalClinics}
            </span>
          </div>
        </div>

        <div className="glass-card p-5 rounded-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">
              {locale === 'ar' ? 'أيام التشغيل' : 'Active Operating Days'}
            </span>
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
              {totalClinics > 0 ? (locale === 'ar' ? 'الأسبوعي' : 'Weekly') : '-'}
            </span>
          </div>
        </div>

        <div className="glass-card p-5 rounded-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">
              {locale === 'ar' ? 'حالة الخدمة' : 'Service Status'}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {locale === 'ar' ? 'جاهز للاستقبال' : 'System Active'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Clinics Table / Glass Card */}
      <div className="glass-card rounded-2xl overflow-hidden">
        {totalClinics === 0 ? (
          <div className="py-16 px-4 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mx-auto">
              <Stethoscope className="w-8 h-8" />
            </div>
            <div className="space-y-1 max-w-sm mx-auto">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {locale === 'ar' ? 'لا توجد عيادات مسجلة حالياً' : 'No Clinics Found'}
              </h3>
              <p className="text-xs text-slate-500">
                {locale === 'ar' 
                  ? 'قم بإضافة العيادة الأولى لبدء تنظيم جداول المواعيد والحجوزات للمرضى.' 
                  : 'Start by adding your first clinic to manage appointment schedules.'}
              </p>
            </div>
            <Link href="/clinics/new" className="inline-block pt-2">
              <Button size="sm" className="bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg">
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
                  <TableHead className="font-bold text-slate-700 dark:text-slate-300">{t('workingDays')}</TableHead>
                  <TableHead className="font-bold text-slate-700 dark:text-slate-300">{t('time')}</TableHead>
                  <TableHead className="font-bold text-slate-700 dark:text-slate-300 text-end">
                    {locale === 'ar' ? 'الحالة' : 'Status'}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clinics.map((clinic: any) => {
                  const clinicName = typeof clinic.name === 'object' && clinic.name !== null 
                    ? (clinic.name as Record<string, string>)[locale] || (clinic.name as Record<string, string>)['ar'] || (clinic.name as Record<string, string>)['en']
                    : String(clinic.name);

                  return (
                    <TableRow key={clinic.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                      <TableCell className="font-semibold text-slate-900 dark:text-slate-100 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
                            <Stethoscope className="w-4 h-4" />
                          </div>
                          <span>{clinicName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          {clinic.workingDays}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-700 dark:text-cyan-300 bg-cyan-500/10 px-2.5 py-1 rounded-md">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{clinic.startTime} - {clinic.endTime}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-end">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          {locale === 'ar' ? 'متاحة' : 'Active'}
                        </span>
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
