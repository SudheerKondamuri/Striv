import { Router } from 'express';
import { createStartupProfile } from '../controllers/profile.controller.js';
import auth from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/startup', auth, createStartupProfile);

export default router;