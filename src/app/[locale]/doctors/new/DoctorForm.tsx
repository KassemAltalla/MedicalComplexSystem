'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter, Link } from '@/i18n/routing';
import { createDoctor } from '@/actions/doctor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ArrowLeft, ArrowRight, Building2, Calendar, Clock, Globe2, Loader2, Plus, Sparkles, Stethoscope, Phone, Mail, FileText } from 'lucide-react';

import { useLoading } from '@/context/loading-context';

export default function DoctorForm({ locale, clinics }: { locale: string, clinics: any[] }) {
  const router = useRouter();
  const t = useTranslations('Doctor');
  const { startLoading, stopLoading } = useLoading();
  const [loading, setLoading] = useState(false);
  
  async function onSubmit(formData: FormData) {
    setLoading(true);
    startLoading(locale === 'ar' ? 'جاري إضافة الطبيب جديد...' : 'Adding doctor...');
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
      const result = await createDoctor(data);
      setLoading(false);
      
      if (result && result.id) {
        toast.success(
          locale === 'ar' ? "تمت إضافة الطبيب بنجاح!" : "Doctor added successfully!"
        );
        router.push(`/doctors`);
      } else {
        stopLoading();
        toast.error(
          locale === 'ar' ? "حدث خطأ أثناء إضافة الطبيب" : "Failed to create doctor"
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
        <Link href="/doctors">
          <Button variant="ghost" size="sm" className="gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
            {locale === 'ar' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            <span>{locale === 'ar' ? 'العودة إلى الأطباء' : 'Back to Doctors'}</span>
          </Button>
        </Link>
      </div>

      {/* Main Glass Card Form Container */}
      <div className="glass-card rounded-2xl p-8 relative overflow-hidden border border-slate-200/80 dark:border-slate-800">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Card Header */}
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-200/70 dark:border-slate-800">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Stethoscope className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>{t('add')}</span>
              <Sparkles className="w-4 h-4 text-blue-500" />
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {locale === 'ar' ? 'أدخل معلومات الطبيب الجديد وتفاصيل التواصل والدوام' : 'Fill in the new doctor details, contact info and working hours'}
            </p>
          </div>
        </div>

        {/* Form Body */}
        <form action={onSubmit} className="space-y-8">
          {/* Section 1: Names */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400 flex items-center gap-1.5">
              <Globe2 className="w-3.5 h-3.5" />
              <span>{locale === 'ar' ? 'الاسم ثنائي اللغة' : 'Bilingual Name'}</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nameAr" className="text-xs font-semibold flex items-center gap-1">
                  <span>{t('name')} (بالعربية)</span>
                  <span className="text-blue-600 font-bold">🇸🇦</span>
                </Label>
                <Input 
                  id="nameAr" 
                  name="nameAr" 
                  placeholder="مثال: د. أحمد محمد" 
                  required 
                  dir="rtl"
                  className="glass-input rounded-xl h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nameEn" className="text-xs font-semibold flex items-center gap-1">
                  <span>{t('name')} (English)</span>
                  <span className="text-blue-600 font-bold">🇬🇧</span>
                </Label>
                <Input 
                  id="nameEn" 
                  name="nameEn" 
                  placeholder="e.g. Dr. Ahmed Mohamed" 
                  required 
                  dir="ltr"
                  className="glass-input rounded-xl h-11"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Details */}
          <div className="space-y-4 pt-4 border-t border-slate-200/50 dark:border-slate-800/50">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400 flex items-center gap-1.5">
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
                  placeholder={locale === 'ar' ? 'مثال: طبيب أسنان' : 'e.g. Dentist'} 
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
                  placeholder="123456" 
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
                    placeholder="+966 50 000 0000" 
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
                    placeholder="doctor@example.com" 
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
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400 flex items-center gap-1.5">
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
                required
                className="w-full glass-input rounded-xl h-11 px-3 border border-slate-200 bg-white dark:bg-slate-900 text-sm"
              >
                <option value="" disabled selected>{locale === 'ar' ? 'اختر العيادة...' : 'Select a clinic...'}</option>
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
                placeholder={locale === 'ar' ? 'مثال: الأحد - الثلاثاء' : 'e.g. Sun - Tue'} 
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
                  required 
                  className="glass-input rounded-xl h-11"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-6 flex items-center justify-end gap-3">
            <Link href="/doctors">
              <Button type="button" variant="outline" className="rounded-xl h-11 px-5 border-slate-200 dark:border-slate-800">
                {locale === 'ar' ? 'إلغاء' : 'Cancel'}
              </Button>
            </Link>

            <Button 
              type="submit" 
              disabled={loading} 
              className="glow-button bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold rounded-xl h-11 px-8 min-w-[140px]"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{locale === 'ar' ? 'جاري الحفظ...' : 'Saving...'}</span>
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  <Plus className="w-4 h-4" />
                  <span>{t('add')}</span>
                </span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
