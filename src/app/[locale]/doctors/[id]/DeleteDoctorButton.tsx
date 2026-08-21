'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { Trash2, Loader2 } from 'lucide-react';
import { deleteDoctor } from '@/actions/doctor';
import { toast } from 'sonner';

export default function DeleteDoctorButton({ id, locale }: { id: string, locale: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm(locale === 'ar' ? 'هل أنت متأكد من رغبتك بحذف هذا الطبيب؟ لا يمكن التراجع عن هذا الإجراء.' : 'Are you sure you want to delete this doctor? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    try {
      await deleteDoctor(id);
      toast.success(locale === 'ar' ? 'تم حذف الطبيب بنجاح' : 'Doctor deleted successfully');
      router.push('/doctors');
    } catch (error) {
      toast.error(locale === 'ar' ? 'حدث خطأ أثناء الحذف' : 'Failed to delete doctor');
      setLoading(false);
    }
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleDelete}
      disabled={loading}
      className="gap-2 text-red-600 border-red-200 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-900/30"
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
      <span>{locale === 'ar' ? 'حذف الطبيب' : 'Delete Doctor'}</span>
    </Button>
  );
}
