import express from 'express';
import { generateBattlecard, analyzeAnomaly } from '../controllers/aiController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(requireAuth);

router.post('/generate-battlecard', generateBattlecard);
router.post('/analyze-anomaly', analyzeAnomaly);

export default router;
