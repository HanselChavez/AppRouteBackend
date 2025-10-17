import type { Request, Response } from "express";
export type GoogleUser = {
    displayName: string;
    email: string;
};
export declare const handleGoogleAuthFailure: (req: any, res: any, next: any) => any;
export declare const user: (req: Request, res: Response) => Promise<void>;
export declare const googleAuth: (req: any, res: any) => Promise<any>;
export declare const registerUser: (req: Request, res: Response) => Promise<void>;
export declare const verifyUser: (req: Request, res: Response) => Promise<void>;
export declare const resendVerificationToken: (req: Request, res: Response) => Promise<void>;
export declare const loginUser: (req: Request, res: Response) => Promise<void>;
export declare const updateCurrentUserPassword: (req: Request, res: Response) => Promise<void>;
export declare const updatePasswordWithToken: (req: Request, res: Response) => Promise<void>;
export declare const forgotPassword: (req: Request, res: Response) => Promise<void>;
export declare const validateToken: (req: Request, res: Response) => Promise<void>;
