import express from 'express';
import { authenticate } from '../middleware/auth';
import {AuthController} from "../controllers/auth";

const router = express.Router();
const authController = new AuthController();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', authenticate, authController.logout);

export default router;
