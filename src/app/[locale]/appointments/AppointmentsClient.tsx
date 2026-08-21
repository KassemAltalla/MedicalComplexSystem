'use client';

import { useState, useEffect, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { getAppointments, updateAppointmentStatus } from '@/actions/appointment';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Loader2, Calendar, Clock, User, Phone, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function AppointmentsClient({ locale, initialAppointments }: { locale: string, initialAppointments: any[] }) {
  const t = useTranslations('Appointment');
  const [appointments, setAppointments] = useState(initialAppointments);
  const [doctorQuery, setDoctorQuery] = useState('');
  const [patientQuery, setPatientQuery] = useState('');
  const [isPending, startTransition] = useTransition();

  // Debounced search effect
  useEffect(() => {
    const handler = setTimeout(() => {
      startTransition(async () => {
        try {
          const results = await getAppointments({
            doctorQuery: doctorQuery.trim() !== '' ? doctorQuery : undefined,
            patientQuery: patientQuery.trim() !== '' ? patientQuery : undefined
          });
          setAppointments(results);
        } catch (err) {
          console.error(err);
        }
      });
    }, 400); // 400ms debounce

    return () => clearTimeout(handler);
  }, [doctorQuery, patientQuery]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateAppointmentStatus(id, newStatus);
      setAppointments(prev => prev.map(app => app.id === id ? { ...app, status: newStatus } : app));
      toast.success(locale === 'ar' ? 'تم تحديث حالة الحجز بنجاح' : 'Status updated successfully');
    } catch (err) {
      toast.error(locale === 'ar' ? 'فشل في تحديث الحالة' : 'Failed to update status');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800">{t('statuses.CONFIRMED')}</span>;
      case 'COMPLETED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800">{t('statuses.COMPLETED')}</span>;
      case 'CANCELLED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800">{t('statuses.CANCELLED')}</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800">{t('statuses.PENDING')}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Smart Filters */}
      <div className="glass-card rounded-2xl p-6 border border-slate-200/60 dark:border-slate-800/60">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute right-3 top-3.5 w-4 h-4 text-slate-400 rtl:left-3 rtl:right-auto" />
            <Input 
              placeholder={t('searchPatient')}
              value={patientQuery}
              onChange={(e) => setPatientQuery(e.target.value)}
              className="pl-3 rtl:pr-10 rtl:pl-3 h-11 bg-white dark:bg-slate-900/50 rounded-xl"
            />
          </div>
          <div className="relative flex items-center">
            <Search className="absolute right-3 top-3.5 w-4 h-4 text-slate-400 rtl:left-3 rtl:right-auto" />
            <Input 
              placeholder={t('searchDoctor')}
              value={doctorQuery}
              onChange={(e) => setDoctorQuery(e.target.value)}
              className="pl-3 rtl:pr-10 rtl:pl-3 h-11 bg-white dark:bg-slate-900/50 rounded-xl"
            />
            {isPending && <Loader2 className="absolute left-3 rtl:right-3 rtl:left-auto w-4 h-4 animate-spin text-blue-500" />}
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <div className="glass-card rounded-2xl overflow-hidden border border-slate-200/60 dark:border-slate-800/60">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left rtl:text-right text-slate-600 dark:text-slate-300">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50/80 dark:bg-slate-800/50 dark:text-slate-400">
              <tr>
                <th className="px-6 py-4">{t('patient')}</th>
                <th className="px-6 py-4">{t('doctor')}</th>
                <th className="px-6 py-4">{t('date')} & {t('time')}</th>
                <th className="px-6 py-4">{t('status')}</th>
                <th className="px-6 py-4 text-center">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/50 dark:divide-slate-800/50">
              {appointments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    {t('noAppointments')}
                  </td>
                </tr>
              ) : (
                appointments.map((app) => {
                  const doctorName = typeof app.doctor.name === 'object' && app.doctor.name !== null
                    ? (app.doctor.name as any)[locale] || (app.doctor.name as any)['ar']
                    : app.doctor.name;

                  return (
                    <tr key={app.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
                            <User className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900 dark:text-white">{app.patient.name}</div>
                            <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                              <Phone className="w-3 h-3" />
                              <span dir="ltr">{app.patient.phoneNumber}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900 dark:text-slate-200">{doctorName}</div>
                        <div className="text-xs text-slate-500">{app.clinic?.name?.[locale] || app.clinic?.name?.['ar']}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                            <Calendar className="w-3.5 h-3.5 text-blue-500" />
                            <span>{new Date(app.date).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US')}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-slate-500">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{app.time}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(app.status)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <select 
                            value={app.status}
                            onChange={(e) => handleStatusChange(app.id, e.target.value)}
                            className="bg-transparent border border-slate-200 dark:border-slate-700 rounded-lg text-xs p-1.5 outline-none focus:ring-1 focus:ring-blue-500"
                          >
                            <option value="PENDING">{t('statuses.PENDING')}</option>
                            <option value="CONFIRMED">{t('statuses.CONFIRMED')}</option>
                            <option value="COMPLETED">{t('statuses.COMPLETED')}</option>
                            <option value="CANCELLED">{t('statuses.CANCELLED')}</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
