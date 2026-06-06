import { Router } from 'express';
import collegeRoutes from './collegeRoutes';
import predictorRoutes from './predictorRoutes';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import { compareColleges } from '../controllers/collegeController';

const router = Router();

// Main API routes
router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/colleges', collegeRoutes);
router.get('/compare', compareColleges);
router.use('/predictor', predictorRoutes);

export default router;
