import { Request, Response, NextFunction } from 'express';
import { predictColleges } from '../models/predictorModel';
import { Exam } from '@prisma/client';

export const getPredictions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { exam, rank, category } = req.body;
    
    if (!exam || !rank || !category) {
      res.status(400);
      throw new Error('Missing required fields: exam, rank, category');
    }

    const colleges = await predictColleges(exam as Exam, parseInt(rank), category);
    
    res.json({ colleges, message: 'Predictions generated successfully' });
  } catch (error) {
    next(error);
  }
};
