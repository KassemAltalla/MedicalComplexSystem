import { expect, test, vi } from 'vitest';
import { createClinic } from '../clinic';

vi.mock('../../lib/prisma', () => ({
  prisma: {
    clinic: {
      create: vi.fn().mockResolvedValue({ id: '1', name: { ar: 'أسنان', en: 'Dental' } }),
    },
  },
}));

test('createClinic successfully creates a clinic', async () => {
  const result = await createClinic({ 
    name: { ar: 'أسنان', en: 'Dental' }, 
    workingDays: 'Mon-Fri', 
    startTime: '08:00', 
    endTime: '16:00' 
  });
  expect(result.id).toBe('1');
});
