import prisma from './index';
import { Exam } from '@prisma/client';

export const predictColleges = async (exam: Exam, rank: number, category: string) => {
  const cutoffs = await prisma.cutoff.findMany({
    where: {
      exam: exam,
      category: category,
      rankFrom: { lte: rank },
      rankTo: { gte: rank },
    },
    include: { college: true },
    orderBy: { rankFrom: 'desc' },
    take: 10,
  });

  const collegesMap = new Map();
  for (const cutoff of cutoffs) {
    if (!collegesMap.has(cutoff.collegeId)) {
      collegesMap.set(cutoff.collegeId, cutoff.college);
    }
  }

  return Array.from(collegesMap.values());
};
