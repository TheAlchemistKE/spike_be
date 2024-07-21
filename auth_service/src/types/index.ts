import { Request } from 'express';
import {User} from "../database/models/user";

export interface UserPayload {
    id: string;
    email: string;
    role: string;
}

export interface AuthenticatedRequest extends Request {
    user?: User;
}

export interface RefreshTokenPayload {
    refreshToken: string;
}

export interface LoginResponse {
    message: string;
    user: User;
    accessToken: string;
    refreshToken: string;
}

export interface RefreshTokenResponse {
    message: string;
    user: User;
    accessToken: string;
}

export interface ErrorResponse {
    message: string;
}

export interface SuccessResponse {
    message: string;
}

export interface UserResponse {
    message: string;
    user: User;
}
