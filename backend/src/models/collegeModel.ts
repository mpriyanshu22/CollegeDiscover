import prisma from './index';
import { Prisma, CollegeType, CollegeCategory } from '@prisma/client';

export const getColleges = async (
  q?: string,
  state?: string,
  type?: CollegeType,
  category?: CollegeCategory,
  minRating: number = 0,
  maxFees: number = 10000000,
  sortBy?: string,
  page: number = 1,
  limit: number = 12
) => {
  const where: Prisma.CollegeWhereInput = {};

  if (q) {
    where.OR = [
      { name: { contains: q, mode: 'insensitive' } },
      { location: { contains: q, mode: 'insensitive' } },
    ];
  }

  if (state) where.state = state;
  if (type) where.type = type;
  if (category) where.category = category;
  if (minRating) where.rating = { gte: minRating };
  if (maxFees) where.fees = { lte: maxFees };

  let orderBy: Prisma.CollegeOrderByWithRelationInput = { rating: 'desc' };
  if (sortBy === 'fees_asc') orderBy = { fees: 'asc' };
  if (sortBy === 'fees_desc') orderBy = { fees: 'desc' };
  if (sortBy === 'nirfRank') orderBy = { nirfRank: 'asc' };

  const skip = (page - 1) * limit;

  const [colleges, total] = await Promise.all([
    prisma.college.findMany({ where, orderBy, skip, take: limit }),
    prisma.college.count({ where }),
  ]);

  return { colleges, total, page, totalPages: Math.ceil(total / limit) };
};

export const getCollegeById = async (id: string) => {
  return await prisma.college.findUnique({
    where: { id },
    include: { courses: true, reviews: true, cutoffs: true },
  });
};

export const getCollegesByIds = async (ids: string[]) => {
  return await prisma.college.findMany({
    where: { id: { in: ids } },
  });
};
