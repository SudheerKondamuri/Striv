import { Router } from "express";
import {
  signup,
  login,
  verifyEmail,
  forgotPassword,
  confirmForgotPassword,
  refreshToken,
  logout,
} from "../controllers/auth.controller.js";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/confirm-forgot-password", confirmForgotPassword);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);

export default router;