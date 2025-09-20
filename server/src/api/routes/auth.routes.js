import {Router} from 'express';
import {Signup, Login,verifyEmail} from '../controllers/auth.controller.js';

const router = Router();

router.post('/signup', Signup);
router.post('/login', Login);
router.post('/verify-email', verifyEmail);


export default router;

