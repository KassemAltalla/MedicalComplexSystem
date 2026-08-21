'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function searchPatients(query: string) {
  try {
    if (!query || query.trim() === '') {
      return [];
    }

    const patients = await prisma.patient.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { phoneNumber: { contains: query } },
          { nationalId: { contains: query } }
        ]
      },
      take: 10,
      orderBy: { name: 'asc' }
    });

    return patients;
  } catch (error) {
    console.error('Error searching patients:', error);
    return [];
  }
}

export async function createPatient(data: {
  name: string;
  nationalId: string;
  dateOfBirth: string; // ISO string expected
  phoneNumber: string;
  bloodType: string;
  medicalNotes?: string;
}) {
  try {
    const patient = await prisma.patient.create({
      data: {
        name: data.name,
        nationalId: data.nationalId,
        dateOfBirth: new Date(data.dateOfBirth),
        phoneNumber: data.phoneNumber,
        bloodType: data.bloodType,
        medicalNotes: data.medicalNotes,
      }
    });

    revalidatePath('/appointments');
    revalidatePath('/appointments/new');
    
    return patient;
  } catch (error: any) {
    console.error('Error creating patient:', error);
    throw new Error(error.message || 'Failed to create patient');
  }
}

export async function getPatientById(id: string) {
  try {
    const patient = await prisma.patient.findUnique({
      where: { id },
      include: {
        appointments: {
          include: {
            doctor: true,
            clinic: true
          },
          orderBy: { date: 'desc' }
        }
      }
    });
    return patient;
  } catch (error) {
    console.error('Error fetching patient:', error);
    return null;
  }
}
