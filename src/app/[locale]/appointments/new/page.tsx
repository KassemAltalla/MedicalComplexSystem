import { prisma } from '@/lib/prisma';
import NewAppointmentForm from './NewAppointmentForm';
import { getTranslations } from 'next-intl/server';

export default async function NewAppointmentPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  
  // We need to fetch clinics, and their nested doctors so that when a user selects a clinic, 
  // the doctor dropdown populates accordingly without an extra API call.
  const clinics = await prisma.clinic.findMany({
    include: {
      doctors: true
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <NewAppointmentForm locale={locale} clinics={clinics} />
  );
}
