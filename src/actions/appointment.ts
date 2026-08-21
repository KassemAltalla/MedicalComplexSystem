'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createAppointment(data: {
  patientId: string;
  clinicId: string;
  doctorId: string;
  date: string; // ISO String
  time: string;
}) {
  try {
    const appointment = await prisma.appointment.create({
      data: {
        patientId: data.patientId,
        clinicId: data.clinicId,
        doctorId: data.doctorId,
        date: new Date(data.date),
        time: data.time,
        status: 'PENDING'
      }
    });

    revalidatePath('/appointments');
    return appointment;
  } catch (error: any) {
    console.error('Error creating appointment:', error);
    throw new Error(error.message || 'Failed to create appointment');
  }
}

export async function getAppointments(filters?: {
  doctorQuery?: string;
  patientQuery?: string;
}) {
  try {
    const whereClause: any = {};

    if (filters?.doctorQuery) {
      whereClause.doctor = {
        OR: [
          { phoneNumber: { contains: filters.doctorQuery } },
          { email: { contains: filters.doctorQuery } },
        ]
      };
    }

    if (filters?.patientQuery) {
      whereClause.patient = {
        OR: [
          { name: { contains: filters.patientQuery, mode: 'insensitive' } },
          { phoneNumber: { contains: filters.patientQuery } },
          { nationalId: { contains: filters.patientQuery } }
        ]
      };
    }

    const appointments = await prisma.appointment.findMany({
      where: whereClause,
      include: {
        patient: true,
        doctor: true,
        clinic: true
      },
      orderBy: [
        { date: 'desc' },
        { time: 'desc' }
      ]
    });

    return appointments;
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return [];
  }
}

export async function updateAppointmentStatus(id: string, status: string) {
  try {
    const appointment = await prisma.appointment.update({
      where: { id },
      data: { status }
    });
    
    revalidatePath('/appointments');
    return appointment;
  } catch (error: any) {
    console.error('Error updating appointment status:', error);
    throw new Error('Failed to update status');
  }
}
