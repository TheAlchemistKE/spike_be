import express from 'express';
import { authenticate } from '../middleware/auth';
import {UserController} from "../controllers/user";

const router = express.Router();
const userController = new UserController();

router.get('/:id', authenticate, userController.getUser);
router.put('/:id', authenticate, userController.updateUser);
router.delete('/:id', authenticate, userController.deleteUser);
router.post('/:id/verify', authenticate, userController.verifyUser);

export default router;
