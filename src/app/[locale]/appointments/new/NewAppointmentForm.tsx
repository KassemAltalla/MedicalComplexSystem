'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter, Link } from '@/i18n/routing';
import { createAppointment } from '@/actions/appointment';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { ArrowLeft, ArrowRight, Building2, CalendarDays, Clock, Loader2, Save, User, Stethoscope } from 'lucide-react';
import SmartPatientSelect from './SmartPatientSelect';

import { useLoading } from '@/context/loading-context';

export default function NewAppointmentForm({ locale, clinics }: { locale: string, clinics: any[] }) {
  const router = useRouter();
  const t = useTranslations('Appointment');
  const { startLoading, stopLoading } = useLoading();
  const [loading, setLoading] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [selectedClinicId, setSelectedClinicId] = useState('');
  
  // Get doctors for the selected clinic
  const selectedClinic = clinics.find(c => c.id === selectedClinicId);
  const availableDoctors = selectedClinic ? selectedClinic.doctors : [];

  async function onSubmit(formData: FormData) {
    if (!selectedPatient) {
      toast.error(locale === 'ar' ? 'يرجى اختيار أو إضافة مريض أولاً' : 'Please select or add a patient first');
      return;
    }

    setLoading(true);
    startLoading(locale === 'ar' ? 'جاري حجز الموعد وتحديث البيانات...' : 'Booking appointment...');
    const data = {
      patientId: selectedPatient.id,
      clinicId: formData.get('clinicId') as string,
      doctorId: formData.get('doctorId') as string,
      date: formData.get('date') as string,
      time: formData.get('time') as string,
    };
    
    try {
      await createAppointment(data);
      toast.success(locale === 'ar' ? "تم حجز الموعد بنجاح!" : "Appointment booked successfully!");
      router.push('/appointments');
    } catch (err: any) {
      toast.error(err.message || (locale === 'ar' ? "حدث خطأ بالاتصال بالنظام" : "An error occurred"));
      stopLoading();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl space-y-6">
      {/* Top Breadcrumb Navigation */}
      <div className="flex items-center justify-between">
        <Link href="/appointments">
          <Button variant="ghost" size="sm" className="gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
            {locale === 'ar' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            <span>{locale === 'ar' ? 'العودة لقائمة الحجوزات' : 'Back to Appointments'}</span>
          </Button>
        </Link>
      </div>

      {/* Main Glass Card Form Container */}
      <div className="glass-card rounded-2xl p-8 relative overflow-hidden border border-slate-200/80 dark:border-slate-800">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Card Header */}
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-200/70 dark:border-slate-800">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
            <CalendarDays className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              {t('new')}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {locale === 'ar' ? 'إدخال بيانات حجز جديد في النظام' : 'Enter new appointment details'}
            </p>
          </div>
        </div>

        {/* Form Body */}
        <form action={onSubmit} className="space-y-8">
          
          {/* Section 1: Patient Selection */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              <span>{t('patient')}</span>
            </h2>

            <div className="space-y-2 relative z-20">
              <SmartPatientSelect 
                locale={locale} 
                value={selectedPatient} 
                onChange={setSelectedPatient} 
              />
            </div>
          </div>

          {/* Section 2: Clinic & Doctor Selection */}
          <div className="space-y-4 pt-4 border-t border-slate-200/50 dark:border-slate-800/50">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" />
              <span>{t('clinic')} & {t('doctor')}</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="clinicId" className="text-xs font-semibold">
                  {t('clinic')}
                </Label>
                <select
                  id="clinicId"
                  name="clinicId"
                  required
                  value={selectedClinicId}
                  onChange={(e) => setSelectedClinicId(e.target.value)}
                  className="w-full glass-input rounded-xl h-11 px-3 border border-slate-200 bg-white dark:bg-slate-900 text-sm"
                >
                  <option value="" disabled>{locale === 'ar' ? 'اختر العيادة...' : 'Select a clinic...'}</option>
                  {clinics.map(clinic => {
                    const name = typeof clinic.name === 'object' && clinic.name !== null
                      ? (clinic.name as any)[locale] || (clinic.name as any)['ar']
                      : clinic.name;
                    return (
                      <option key={clinic.id} value={clinic.id}>
                        {name}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="doctorId" className="text-xs font-semibold flex items-center gap-1">
                  <Stethoscope className="w-3.5 h-3.5 text-slate-400" />
                  <span>{t('doctor')}</span>
                </Label>
                <select
                  id="doctorId"
                  name="doctorId"
                  required
                  disabled={!selectedClinicId || availableDoctors.length === 0}
                  className="w-full glass-input rounded-xl h-11 px-3 border border-slate-200 bg-white dark:bg-slate-900 text-sm disabled:opacity-50"
                >
                  <option value="" disabled>
                    {!selectedClinicId 
                      ? t('selectClinicFirst') 
                      : availableDoctors.length === 0 
                        ? (locale === 'ar' ? 'لا يوجد أطباء في هذه العيادة' : 'No doctors in this clinic') 
                        : t('selectDoctor')}
                  </option>
                  {availableDoctors.map((doc: any) => {
                    const name = typeof doc.name === 'object' && doc.name !== null
                      ? doc.name[locale] || doc.name['ar']
                      : doc.name;
                    return (
                      <option key={doc.id} value={doc.id}>
                        {name} - {doc.specialization}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Date & Time */}
          <div className="space-y-4 pt-4 border-t border-slate-200/50 dark:border-slate-800/50">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{t('date')} & {t('time')}</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date" className="text-xs font-semibold">
                  {t('date')}
                </Label>
                <Input 
                  id="date" 
                  name="date" 
                  type="date" 
                  required 
                  className="glass-input rounded-xl h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="time" className="text-xs font-semibold">
                  {t('time')}
                </Label>
                <Input 
                  id="time" 
                  name="time" 
                  type="time" 
                  required 
                  className="glass-input rounded-xl h-11"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-6 flex items-center justify-end gap-3">
            <Link href="/appointments">
              <Button type="button" variant="outline" className="rounded-xl h-11 px-5 border-slate-200 dark:border-slate-800">
                {locale === 'ar' ? 'إلغاء' : 'Cancel'}
              </Button>
            </Link>

            <Button 
              type="submit" 
              disabled={loading} 
              className="glow-button bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl h-11 px-8 min-w-[140px]"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{locale === 'ar' ? 'جاري الحفظ...' : 'Saving...'}</span>
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  <Save className="w-4 h-4" />
                  <span>{locale === 'ar' ? 'تأكيد الحجز' : 'Confirm Appointment'}</span>
                </span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
