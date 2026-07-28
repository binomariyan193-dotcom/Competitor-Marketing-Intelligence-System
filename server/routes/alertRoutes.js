import express from 'express';
import { getAlerts, markAlertRead, createAlert } from '../controllers/alertController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(requireAuth);

router.get('/', getAlerts);
router.patch('/:id/read', markAlertRead);
router.post('/', createAlert);

export default router;
