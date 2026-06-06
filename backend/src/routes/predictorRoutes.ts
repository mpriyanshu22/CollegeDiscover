import { Router } from 'express';
import { getPredictions } from '../controllers/predictorController';

const router = Router();

router.post('/', getPredictions);

export default router;
