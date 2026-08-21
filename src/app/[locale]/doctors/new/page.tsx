import { prisma } from '@/lib/prisma';
import DoctorForm from './DoctorForm';

export default async function NewDoctorPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const clinics = await prisma.clinic.findMany();

  return <DoctorForm locale={locale} clinics={clinics} />;
}
