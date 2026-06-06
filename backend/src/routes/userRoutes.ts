import { Router } from 'express';
import { saveCollege, unsaveCollege, getSavedColleges } from '../controllers/userController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.post('/save-college', protect, saveCollege);
router.delete('/save-college/:collegeId', protect, unsaveCollege);
router.get('/saved-colleges', protect, getSavedColleges);

export default router;
