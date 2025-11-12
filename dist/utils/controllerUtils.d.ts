import { Response, Request } from "express";
export declare const handleError: (res: Response, error: any, message: string) => void;
export declare const requireUser: (req: Request, res: Response) => string | null;
