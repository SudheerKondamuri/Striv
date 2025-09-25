import { Router } from 'express';
import { profileComplete, getProfile,createStartupProfile } from '../controllers/profile.controller.js';
import auth from '../middlewares/auth.middleware.js';

const router = Router();
router.post('/profileComplete', auth, profileComplete);
router.get('/getProfile', auth, getProfile);
router.post('/startup', auth, createStartupProfile);

export default router;