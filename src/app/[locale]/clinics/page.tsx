import { prisma } from '@/lib/prisma';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default async function ClinicsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Clinic' });
  const clinics = await prisma.clinic.findMany();
  
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
        <Link href="/clinics/new">
          <Button>{t('add')}</Button>
        </Link>
      </div>
      
      <div className="glass rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('name')}</TableHead>
              <TableHead>{t('workingDays')}</TableHead>
              <TableHead>{t('time')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clinics.map((clinic: any) => (
              <TableRow key={clinic.id}>
                <TableCell className="font-medium">
                  {typeof clinic.name === 'object' && clinic.name !== null 
                    ? (clinic.name as Record<string, string>)[locale] 
                    : String(clinic.name)}
                </TableCell>
                <TableCell>{clinic.workingDays}</TableCell>
                <TableCell>{clinic.startTime} - {clinic.endTime}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
