import express from 'express';
import { register, login, me } from '../controllers/authController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import { AuthRegisterSchema, AuthLoginSchema } from '../middleware/validators.js';

const router = express.Router();

router.post('/register', validate(AuthRegisterSchema), register);
router.post('/login', validate(AuthLoginSchema), login);
router.get('/me', requireAuth, me);

export default router;
