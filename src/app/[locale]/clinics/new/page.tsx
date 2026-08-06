'use client';
import { useState, use } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { createClinic } from '@/actions/clinic';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

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
    
    const result = await createClinic(data);
    setLoading(false);
    
    if (result && result.id) {
      toast.success("Clinic created successfully");
      router.push(`/clinics`);
    } else {
      toast.error("Failed to create clinic");
    }
  }

  return (
    <div className="container mx-auto py-10 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">{t('add')}</h1>
      <form action={onSubmit} className="glass p-8 rounded-xl space-y-6">
        <div className="space-y-2">
          <Label>{t('name')} (EN)</Label>
          <Input name="nameEn" required />
        </div>
        <div className="space-y-2">
          <Label>{t('name')} (AR)</Label>
          <Input name="nameAr" required dir="rtl" />
        </div>
        <div className="space-y-2">
          <Label>{t('workingDays')}</Label>
          <Input name="workingDays" placeholder="Mon, Tue, Wed" required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>{t('startTime')}</Label>
            <Input name="startTime" type="time" required />
          </div>
          <div className="space-y-2">
            <Label>{t('endTime')}</Label>
            <Input name="endTime" type="time" required />
          </div>
        </div>
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? '...' : t('add')}
        </Button>
      </form>
    </div>
  );
}
