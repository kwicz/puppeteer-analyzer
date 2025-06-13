import { beforeAll, afterAll } from 'vitest';
import { prisma } from '@/lib/prisma';

beforeAll(async () => {
  // Clean up the database before tests
  await prisma.analysis.deleteMany();
});

afterAll(async () => {
  // Clean up the database after tests
  await prisma.analysis.deleteMany();
  await prisma.$disconnect();
});
