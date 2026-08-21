import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import EditDoctorForm from './EditDoctorForm';

export default async function EditDoctorPage({ params }: { params: Promise<{ locale: string, id: string }> }) {
  const { locale, id } = await params;
  const doctor = await prisma.doctor.findUnique({
    where: { id }
  });

  if (!doctor) {
    notFound();
  }

  const clinics = await prisma.clinic.findMany();

  return <EditDoctorForm locale={locale} doctor={doctor} clinics={clinics} />;
}
