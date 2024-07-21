import { Request, Response } from 'express';
import { AuthenticatedRequest, UserResponse, ErrorResponse, SuccessResponse } from '../types';
import {UserService} from "../services/user";
import {logger} from "../config/logger";

export class UserController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    public getUser = async (req: Request, res: Response): Promise<void> => {
        const authenticatedReq = req as AuthenticatedRequest;
        try {
            const user = await this.userService.getUserById(authenticatedReq.params.id);
            if (!user) {
                res.status(404).json({ message: 'User not found' });
                return;
            }
            res.status(200).json({ message: 'User fetched successfully', user });
        } catch (error) {
            logger.error('Get user error:', error);
            res.status(500).json({ message: 'An error occurred while fetching the user' });
        }
    };

    public updateUser = async (req: Request, res: Response): Promise<void> => {
        const authenticatedReq = req as AuthenticatedRequest;
        try {
            const updatedUser = await this.userService.updateUser(authenticatedReq.params.id, authenticatedReq.body);
            if (!updatedUser) {
                res.status(404).json({ message: 'User not found' });
                return;
            }
            res.status(200).json({ message: 'User updated successfully', user: updatedUser });
        } catch (error: any) {
            logger.error('Update user error:', error);
            res.status(400).json({ message: error.message });
        }
    };

    public deleteUser = async (req: Request, res: Response): Promise<void> => {
        const authenticatedReq = req as AuthenticatedRequest;
        try {
            const isDeleted = await this.userService.deleteUser(authenticatedReq.params.id);
            if (!isDeleted) {
                res.status(404).json({ message: 'User not found' });
                return;
            }
            res.status(200).json({ message: 'User deleted successfully' });
        } catch (error) {
            logger.error('Delete user error:', error);
            res.status(500).json({ message: 'An error occurred while deleting the user' });
        }
    };

    public verifyUser = async (req: Request, res: Response): Promise<void> => {
        const authenticatedReq = req as AuthenticatedRequest;
        try {
            const verifiedUser = await this.userService.verifyUser(authenticatedReq.params.id);
            if (!verifiedUser) {
                res.status(404).json({ message: 'User not found' });
                return;
            }
            res.status(200).json({ message: 'User verified successfully', user: verifiedUser });
        } catch (error) {
            logger.error('Verify user error:', error);
            res.status(500).json({ message: 'An error occurred while verifying the user' });
        }
    };
}
