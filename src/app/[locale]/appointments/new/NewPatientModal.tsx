'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { createPatient } from '@/actions/patient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Loader2, User, Phone, Calendar, Heart, FileText, CreditCard } from 'lucide-react';

import { useLoading } from '@/context/loading-context';

export default function NewPatientModal({ 
  locale, 
  isOpen, 
  onClose, 
  onPatientCreated 
}: { 
  locale: string, 
  isOpen: boolean, 
  onClose: () => void,
  onPatientCreated: (patient: any) => void 
}) {
  const t = useTranslations('Appointment');
  const { startLoading, stopLoading } = useLoading();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    startLoading(locale === 'ar' ? 'جاري حفظ بيانات المريض جديد...' : 'Adding patient...');

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      nationalId: formData.get('nationalId') as string,
      dateOfBirth: formData.get('dateOfBirth') as string,
      phoneNumber: formData.get('phoneNumber') as string,
      bloodType: formData.get('bloodType') as string,
      medicalNotes: formData.get('medicalNotes') as string,
    };

    try {
      const patient = await createPatient(data);
      toast.success(locale === 'ar' ? 'تمت إضافة المريض بنجاح' : 'Patient added successfully');
      onPatientCreated(patient);
      onClose();
    } catch (error) {
      toast.error(locale === 'ar' ? 'حدث خطأ أثناء إضافة المريض' : 'Failed to add patient');
    } finally {
      setLoading(false);
      stopLoading();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] border-slate-200/60 dark:border-slate-800/60 glass-card">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            {t('newPatient')}
          </DialogTitle>
          <DialogDescription>
            {locale === 'ar' ? 'يرجى إدخال البيانات الأساسية للمريض.' : 'Please enter the basic details of the patient.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-xs font-semibold">{t('patientName')}</Label>
            <Input id="name" name="name" required className="glass-input h-10" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nationalId" className="text-xs font-semibold flex items-center gap-1">
                <CreditCard className="w-3 h-3 text-slate-400" />
                {t('nationalId')}
              </Label>
              <Input id="nationalId" name="nationalId" required className="glass-input h-10" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="text-xs font-semibold flex items-center gap-1">
                <Phone className="w-3 h-3 text-slate-400" />
                {t('phoneNumber')}
              </Label>
              <Input id="phoneNumber" name="phoneNumber" required dir="ltr" className="glass-input h-10" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth" className="text-xs font-semibold flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-400" />
                {t('dateOfBirth')}
              </Label>
              <Input id="dateOfBirth" name="dateOfBirth" type="date" required className="glass-input h-10" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bloodType" className="text-xs font-semibold flex items-center gap-1">
                <Heart className="w-3 h-3 text-red-400" />
                {t('bloodType')}
              </Label>
              <select 
                id="bloodType" 
                name="bloodType" 
                required 
                className="w-full glass-input h-10 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 text-sm"
              >
                <option value="">{locale === 'ar' ? 'اختر الفصيلة...' : 'Select blood type...'}</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="medicalNotes" className="text-xs font-semibold flex items-center gap-1">
              <FileText className="w-3 h-3 text-slate-400" />
              {t('medicalNotes')}
            </Label>
            <textarea 
              id="medicalNotes" 
              name="medicalNotes" 
              className="w-full glass-input rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm min-h-[80px]"
              placeholder={locale === 'ar' ? 'أي ملاحظات أو حساسية يعاني منها المريض؟' : 'Any medical notes or allergies?'}
            />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={onClose} className="h-10">
              {locale === 'ar' ? 'إلغاء' : 'Cancel'}
            </Button>
            <Button type="submit" disabled={loading} className="h-10 bg-blue-600 hover:bg-blue-700 text-white min-w-[120px]">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : t('savePatient')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
