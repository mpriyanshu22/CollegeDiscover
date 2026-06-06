import { Request, Response, NextFunction } from 'express';
import { getColleges, getCollegeById, getCollegesByIds } from '../models/collegeModel';
import { CollegeType, CollegeCategory } from '@prisma/client';

export const listColleges = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const q = req.query.q as string;
    const state = req.query.state as string;
    const type = req.query.type as CollegeType;
    const category = req.query.category as CollegeCategory;
    const minRating = parseFloat((req.query.minRating as string) || '0');
    const maxFees = parseInt((req.query.maxFees as string) || '10000000');
    const sortBy = req.query.sortBy as string;
    const page = parseInt((req.query.page as string) || '1');
    const limit = parseInt((req.query.limit as string) || '12');

    const result = await getColleges(q, state, type, category, minRating, maxFees, sortBy, page, limit);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getCollegeDetail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const college = await getCollegeById(id);

    if (!college) {
      res.status(404);
      throw new Error('College not found');
    }

    res.json(college);
  } catch (error) {
    next(error);
  }
};

export const compareColleges = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const idsString = req.query.ids as string;
    if (!idsString) {
      res.json({ colleges: [] });
      return;
    }

    const ids = idsString.split(',').slice(0, 3);
    const colleges = await getCollegesByIds(ids);

    res.json({ colleges });
  } catch (error) {
    next(error);
  }
};
