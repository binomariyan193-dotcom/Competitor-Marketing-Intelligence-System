import express from 'express';
import { ingestSignal } from '../controllers/signalController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import { SignalIngestionSchema } from '../middleware/validators.js';

const router = express.Router();

router.use(requireAuth);

router.post('/ingest', validate(SignalIngestionSchema), ingestSignal);

export default router;
