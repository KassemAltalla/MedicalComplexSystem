'use server'
import { prisma } from '../lib/prisma';
import { z } from 'zod';

const LocalizedStringSchema = z.object({
  ar: z.string().min(1),
  en: z.string().min(1),
});

const ClinicSchema = z.object({
  name: LocalizedStringSchema,
  workingDays: z.string().min(1),
  startTime: z.string().min(1),
  endTime: z.string().min(1),
});

export async function createClinic(data: z.infer<typeof ClinicSchema>) {
  const validData = ClinicSchema.parse(data);
  return await prisma.clinic.create({
    data: validData,
  });
}
