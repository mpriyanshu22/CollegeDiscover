import { Router } from 'express';
import { listColleges, getCollegeDetail, compareColleges } from '../controllers/collegeController';

const router = Router();

router.get('/', listColleges);
router.get('/compare', compareColleges); // Ensure /compare comes before /:id to prevent matching issues
router.get('/:id', getCollegeDetail);

export default router;
