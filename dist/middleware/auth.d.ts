import { Request, Response, NextFunction } from 'express';
import { IUser } from '../models/User';
import 'multer';
declare global {
    namespace Express {
        interface Request {
            user?: IUser;
            files?: {
                [fieldname: string]: Express.Multer.File[];
            } | Express.Multer.File[];
        }
    }
}
export declare const verifyUserToken: (req: Request, res: Response, next: NextFunction) => Promise<void>;
