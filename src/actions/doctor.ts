'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

// Helper function to convert "HH:mm" to minutes for easy comparison
function timeToMinutes(time: string) {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

interface DoctorData {
  name: { ar: string; en: string }
  specialization: string
  licenseNumber: string
  phoneNumber: string
  email: string
  workingDays: string
  startTime: string
  endTime: string
  clinicId: string
}

export async function createDoctor(data: DoctorData) {
  const clinic = await prisma.clinic.findUnique({
    where: { id: data.clinicId },
  })

  if (!clinic) {
    throw new Error('Clinic not found')
  }

  const clinicStart = timeToMinutes(clinic.startTime)
  const clinicEnd = timeToMinutes(clinic.endTime)
  const doctorStart = timeToMinutes(data.startTime)
  const doctorEnd = timeToMinutes(data.endTime)

  if (doctorStart < clinicStart || doctorEnd > clinicEnd) {
    throw new Error('Doctor working hours must be within clinic working hours')
  }
  
  if (doctorStart >= doctorEnd) {
    throw new Error('Start time must be before end time')
  }

  const doctor = await prisma.doctor.create({
    data,
  })

  revalidatePath('/clinics')
  revalidatePath('/doctors')
  revalidatePath('/')
  return doctor
}

export async function updateDoctor(id: string, data: DoctorData) {
  const clinic = await prisma.clinic.findUnique({
    where: { id: data.clinicId },
  })

  if (!clinic) {
    throw new Error('Clinic not found')
  }

  const clinicStart = timeToMinutes(clinic.startTime)
  const clinicEnd = timeToMinutes(clinic.endTime)
  const doctorStart = timeToMinutes(data.startTime)
  const doctorEnd = timeToMinutes(data.endTime)

  if (doctorStart < clinicStart || doctorEnd > clinicEnd) {
    throw new Error('Doctor working hours must be within clinic working hours')
  }
  
  if (doctorStart >= doctorEnd) {
    throw new Error('Start time must be before end time')
  }

  const doctor = await prisma.doctor.update({
    where: { id },
    data,
  })

  revalidatePath('/clinics')
  revalidatePath('/doctors')
  revalidatePath('/')
  return doctor
}

export async function deleteDoctor(id: string) {
  await prisma.doctor.delete({
    where: { id },
  })

  revalidatePath('/clinics')
  revalidatePath('/doctors')
  revalidatePath('/')
}
