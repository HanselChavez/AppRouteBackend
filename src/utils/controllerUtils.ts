import { Response, Request } from "express";

export const handleError = (res: Response, error: any, message: string) => {
    console.error(`❌ ${message}:`, error);
    res.status(500).json({
        message,
        error: error.message || error,
    });
};

export const requireUser = (req: Request, res: Response): string | null => {
    const userId = req.user?._id;
    if (!userId) {
        res.status(401).json({ message: "Usuario no autenticado" });
        return null;
    }
    return userId;
};
