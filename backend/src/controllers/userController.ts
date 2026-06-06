import { Response, NextFunction } from 'express';
import prisma from '../models/index';
import { AuthRequest } from '../middleware/authMiddleware';

export const saveCollege = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { collegeId } = req.body;
    const userId = req.user.id;

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        savedColleges: {
          connect: { id: collegeId }
        }
      },
      include: { savedColleges: true }
    });

    res.status(200).json({
      message: 'College saved successfully',
      savedColleges: user.savedColleges.map(c => c.id)
    });
  } catch (error) {
    next(error);
  }
};

export const unsaveCollege = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { collegeId } = req.params;
    const userId = req.user.id;

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        savedColleges: {
          disconnect: { id: collegeId }
        }
      },
      include: { savedColleges: true }
    });

    res.status(200).json({
      message: 'College removed from saved list',
      savedColleges: user.savedColleges.map(c => c.id)
    });
  } catch (error) {
    next(error);
  }
};

export const getSavedColleges = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { 
        savedColleges: true 
      }
    });

    res.status(200).json({
      savedColleges: user?.savedColleges || []
    });
  } catch (error) {
    next(error);
  }
};
