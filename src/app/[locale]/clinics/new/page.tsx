'use client';

import { useState, use } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter, Link } from '@/i18n/routing';
import { createClinic } from '@/actions/clinic';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ArrowLeft, ArrowRight, Building2, Calendar, Clock, Globe2, Loader2, Plus, Sparkles } from 'lucide-react';

export default function NewClinicPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const router = useRouter();
  const t = useTranslations('Clinic');
  const [loading, setLoading] = useState(false);
  
  async function onSubmit(formData: FormData) {
    setLoading(true);
    const data = {
      name: {
        en: formData.get('nameEn') as string,
        ar: formData.get('nameAr') as string,
      },
      workingDays: formData.get('workingDays') as string,
      startTime: formData.get('startTime') as string,
      endTime: formData.get('endTime') as string,
    };
    
    try {
      const result = await createClinic(data);
      setLoading(false);
      
      if (result && result.id) {
        toast.success(
          locale === 'ar' ? "تمت إضافة العيادة بنجاح!" : "Clinic added successfully!"
        );
        router.push(`/clinics`);
      } else {
        toast.error(
          locale === 'ar' ? "حدث خطأ أثناء إضافة العيادة" : "Failed to create clinic"
        );
      }
    } catch (err) {
      setLoading(false);
      toast.error(
        locale === 'ar' ? "حدث خطأ بالاتصال بالنظام" : "An error occurred"
      );
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl space-y-6">
      {/* Top Breadcrumb Navigation */}
      <div className="flex items-center justify-between">
        <Link href="/clinics">
          <Button variant="ghost" size="sm" className="gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
            {locale === 'ar' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            <span>{locale === 'ar' ? 'العودة إلى العيادات' : 'Back to Clinics'}</span>
          </Button>
        </Link>
      </div>

      {/* Main Glass Card Form Container */}
      <div className="glass-card rounded-2xl p-8 relative overflow-hidden border border-slate-200/80 dark:border-slate-800">
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Card Header */}
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-200/70 dark:border-slate-800">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>{t('add')}</span>
              <Sparkles className="w-4 h-4 text-cyan-500" />
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {locale === 'ar' ? 'أدخل معلومات العيادة الجديدة باللغتين العربية والإنجليزية' : 'Fill in the clinic details in both Arabic and English'}
            </p>
          </div>
        </div>

        {/* Form Body */}
        <form action={onSubmit} className="space-y-6">
          {/* Section 1: Names */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-700 dark:text-cyan-400 flex items-center gap-1.5">
              <Globe2 className="w-3.5 h-3.5" />
              <span>{locale === 'ar' ? 'اسم العيادة ثنائي اللغة' : 'Bilingual Clinic Name'}</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nameAr" className="text-xs font-semibold flex items-center gap-1">
                  <span>{t('name')} (بالعربية)</span>
                  <span className="text-cyan-600 font-bold">🇸🇦</span>
                </Label>
                <Input 
                  id="nameAr" 
                  name="nameAr" 
                  placeholder="مثال: عيادة الأسنان والتقويم" 
                  required 
                  dir="rtl"
                  className="glass-input rounded-xl h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nameEn" className="text-xs font-semibold flex items-center gap-1">
                  <span>{t('name')} (English)</span>
                  <span className="text-cyan-600 font-bold">🇬🇧</span>
                </Label>
                <Input 
                  id="nameEn" 
                  name="nameEn" 
                  placeholder="e.g. Dental & Orthodontics Clinic" 
                  required 
                  dir="ltr"
                  className="glass-input rounded-xl h-11"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Schedule & Timing */}
          <div className="space-y-4 pt-2 border-t border-slate-200/50 dark:border-slate-800/50">
            <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-700 dark:text-cyan-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{locale === 'ar' ? 'أيام وساعات الدوام' : 'Working Days & Operating Schedule'}</span>
            </h2>

            <div className="space-y-2">
              <Label htmlFor="workingDays" className="text-xs font-semibold flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{t('workingDays')}</span>
              </Label>
              <Input 
                id="workingDays" 
                name="workingDays" 
                placeholder={locale === 'ar' ? 'مثال: الأحد - الخميس' : 'e.g. Sun - Thu'} 
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
          <div className="pt-4 flex items-center justify-end gap-3">
            <Link href="/clinics">
              <Button type="button" variant="outline" className="rounded-xl h-11 px-5 border-slate-200 dark:border-slate-800">
                {locale === 'ar' ? 'إلغاء' : 'Cancel'}
              </Button>
            </Link>

            <Button 
              type="submit" 
              disabled={loading} 
              className="glow-button bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold rounded-xl h-11 px-8 min-w-[140px]"
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
