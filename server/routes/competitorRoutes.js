import express from 'express';
import {
  getCompetitors,
  getCompetitorById,
  createCompetitor,
  updateCompetitor,
  deleteCompetitor
} from '../controllers/competitorController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import { CompetitorSchema } from '../middleware/validators.js';

const router = express.Router();

router.use(requireAuth);

router.get('/', getCompetitors);
router.get('/:id', getCompetitorById);
router.post('/', validate(CompetitorSchema), createCompetitor);
router.put('/:id', validate(CompetitorSchema), updateCompetitor);
router.delete('/:id', deleteCompetitor);

export default router;
