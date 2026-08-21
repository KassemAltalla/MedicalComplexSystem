'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter, Link } from '@/i18n/routing';
import { updateDoctor } from '@/actions/doctor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ArrowLeft, ArrowRight, Building2, Calendar, Clock, Globe2, Loader2, Save, Sparkles, Stethoscope, Phone, Mail, FileText } from 'lucide-react';

import { useLoading } from '@/context/loading-context';

export default function EditDoctorForm({ locale, doctor, clinics }: { locale: string, doctor: any, clinics: any[] }) {
  const router = useRouter();
  const t = useTranslations('Doctor');
  const { startLoading, stopLoading } = useLoading();
  const [loading, setLoading] = useState(false);
  
  const doctorNameAr = doctor.name?.ar || (typeof doctor.name === 'string' ? doctor.name : '');
  const doctorNameEn = doctor.name?.en || '';

  async function onSubmit(formData: FormData) {
    setLoading(true);
    startLoading(locale === 'ar' ? 'جاري تحديث بيانات الطبيب...' : 'Updating doctor details...');
    const data = {
      name: {
        en: formData.get('nameEn') as string,
        ar: formData.get('nameAr') as string,
      },
      specialization: formData.get('specialization') as string,
      licenseNumber: formData.get('licenseNumber') as string,
      phoneNumber: formData.get('phoneNumber') as string,
      email: formData.get('email') as string,
      clinicId: formData.get('clinicId') as string,
      workingDays: formData.get('workingDays') as string,
      startTime: formData.get('startTime') as string,
      endTime: formData.get('endTime') as string,
    };
    
    try {
      const result = await updateDoctor(doctor.id, data);
      setLoading(false);
      
      if (result && result.id) {
        toast.success(
          locale === 'ar' ? "تم تحديث بيانات الطبيب بنجاح!" : "Doctor updated successfully!"
        );
        router.push(`/doctors/${doctor.id}`);
      } else {
        stopLoading();
        toast.error(
          locale === 'ar' ? "حدث خطأ أثناء التحديث" : "Failed to update doctor"
        );
      }
    } catch (err: any) {
      setLoading(false);
      stopLoading();
      toast.error(
        err.message || (locale === 'ar' ? "حدث خطأ بالاتصال بالنظام" : "An error occurred")
      );
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
      {/* Top Breadcrumb Navigation */}
      <div className="flex items-center justify-between">
        <Link href={`/doctors/${doctor.id}`}>
          <Button variant="ghost" size="sm" className="gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
            {locale === 'ar' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            <span>{locale === 'ar' ? 'العودة إلى تفاصيل الطبيب' : 'Back to Details'}</span>
          </Button>
        </Link>
      </div>

      {/* Main Glass Card Form Container */}
      <div className="glass-card rounded-2xl p-8 relative overflow-hidden border border-slate-200/80 dark:border-slate-800">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Card Header */}
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-200/70 dark:border-slate-800">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-600 to-orange-600 text-white flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Stethoscope className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>{t('edit')}</span>
              <Sparkles className="w-4 h-4 text-amber-500" />
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {locale === 'ar' ? 'تعديل معلومات الطبيب وتفاصيل التواصل' : 'Update doctor details and contact info'}
            </p>
          </div>
        </div>

        {/* Form Body */}
        <form action={onSubmit} className="space-y-8">
          {/* Section 1: Names */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
              <Globe2 className="w-3.5 h-3.5" />
              <span>{locale === 'ar' ? 'الاسم ثنائي اللغة' : 'Bilingual Name'}</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nameAr" className="text-xs font-semibold flex items-center gap-1">
                  <span>{t('name')} (بالعربية)</span>
                  <span className="text-amber-600 font-bold">🇸🇦</span>
                </Label>
                <Input 
                  id="nameAr" 
                  name="nameAr" 
                  defaultValue={doctorNameAr}
                  required 
                  dir="rtl"
                  className="glass-input rounded-xl h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nameEn" className="text-xs font-semibold flex items-center gap-1">
                  <span>{t('name')} (English)</span>
                  <span className="text-amber-600 font-bold">🇬🇧</span>
                </Label>
                <Input 
                  id="nameEn" 
                  name="nameEn" 
                  defaultValue={doctorNameEn}
                  required 
                  dir="ltr"
                  className="glass-input rounded-xl h-11"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Details */}
          <div className="space-y-4 pt-4 border-t border-slate-200/50 dark:border-slate-800/50">
            <h2 className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              <span>{locale === 'ar' ? 'معلومات التخصص والتواصل' : 'Specialization & Contact Info'}</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="specialization" className="text-xs font-semibold">
                  {t('specialization')}
                </Label>
                <Input 
                  id="specialization" 
                  name="specialization" 
                  defaultValue={doctor.specialization}
                  required 
                  className="glass-input rounded-xl h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="licenseNumber" className="text-xs font-semibold">
                  {t('licenseNumber')}
                </Label>
                <Input 
                  id="licenseNumber" 
                  name="licenseNumber" 
                  defaultValue={doctor.licenseNumber}
                  required 
                  className="glass-input rounded-xl h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="text-xs font-semibold">
                  {t('phoneNumber')}
                </Label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
                  <Input 
                    id="phoneNumber" 
                    name="phoneNumber" 
                    defaultValue={doctor.phoneNumber}
                    required 
                    className="glass-input rounded-xl h-11 pl-9"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-semibold">
                  {t('email')}
                </Label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
                  <Input 
                    id="email" 
                    name="email" 
                    type="email"
                    defaultValue={doctor.email}
                    required 
                    className="glass-input rounded-xl h-11 pl-9"
                    dir="ltr"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Schedule & Timing */}
          <div className="space-y-4 pt-4 border-t border-slate-200/50 dark:border-slate-800/50">
            <h2 className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{locale === 'ar' ? 'العيادة وأوقات الدوام' : 'Clinic & Working Schedule'}</span>
            </h2>

            <div className="space-y-2">
              <Label htmlFor="clinicId" className="text-xs font-semibold flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span>{t('clinic')}</span>
              </Label>
              <select
                id="clinicId"
                name="clinicId"
                defaultValue={doctor.clinicId}
                required
                className="w-full glass-input rounded-xl h-11 px-3 border border-slate-200 bg-white dark:bg-slate-900 text-sm"
              >
                <option value="" disabled>{locale === 'ar' ? 'اختر العيادة...' : 'Select a clinic...'}</option>
                {clinics.map(clinic => {
                  const name = typeof clinic.name === 'object' && clinic.name !== null
                    ? (clinic.name as any)[locale] || (clinic.name as any)['ar']
                    : clinic.name;
                  return (
                    <option key={clinic.id} value={clinic.id}>
                      {name} ( {clinic.startTime} - {clinic.endTime} )
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="space-y-2 pt-2">
              <Label htmlFor="workingDays" className="text-xs font-semibold flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{t('workingDays')}</span>
              </Label>
              <Input 
                id="workingDays" 
                name="workingDays" 
                defaultValue={doctor.workingDays}
                required 
                className="glass-input rounded-xl h-11"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime" className="text-xs font-semibold">
                  {t('startTime')}
                </Label>
                <Input 
                  id="startTime" 
                  name="startTime" 
                  type="time" 
                  defaultValue={doctor.startTime}
                  required 
                  className="glass-input rounded-xl h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endTime" className="text-xs font-semibold">
                  {t('endTime')}
                </Label>
                <Input 
                  id="endTime" 
                  name="endTime" 
                  type="time" 
                  defaultValue={doctor.endTime}
                  required 
                  className="glass-input rounded-xl h-11"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-6 flex items-center justify-end gap-3">
            <Link href={`/doctors/${doctor.id}`}>
              <Button type="button" variant="outline" className="rounded-xl h-11 px-5 border-slate-200 dark:border-slate-800">
                {locale === 'ar' ? 'إلغاء' : 'Cancel'}
              </Button>
            </Link>

            <Button 
              type="submit" 
              disabled={loading} 
              className="glow-button bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-semibold rounded-xl h-11 px-8 min-w-[140px]"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{locale === 'ar' ? 'جاري الحفظ...' : 'Saving...'}</span>
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  <Save className="w-4 h-4" />
                  <span>{locale === 'ar' ? 'حفظ التعديلات' : 'Save Changes'}</span>
                </span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
