import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { IUser, User } from '../models/User'
import 'multer';

declare global {
    namespace Express {
        interface Request {
            user?: IUser;
            files?: { [fieldname: string]: Express.Multer.File[]} | Express.Multer.File[]; 
        }
    }
}

export const verifyUserToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const bearer = req.headers.authorization;
    if (!bearer) {
       res.status(401).json({ error: "No Autorizado" });
       return;
    }

    const [, token] = bearer.split(" ");

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (typeof decoded === "object" && decoded.id) {
            const user = await User.findById(decoded.id).select("_id name email role address");
            if (!user) {
               res.status(401).json({ error: "Token No Válido" });
               return;
            }
            req.user = user;
            return next();
        }

        res.status(401).json({ error: "Token No Válido" });
        return;
    } catch (error) {
        res.status(401).json({ error: "Token No Válido" });
        return;
    }
};