import { Request, Response } from "express";
export declare const updateCartByIdUser: (req: Request, res: Response) => Promise<void>;
export declare const getCartByIdUser: (req: Request, res: Response) => Promise<void>;
export declare const addToCart: (req: Request, res: Response) => Promise<void>;
export declare const getCart: (req: Request, res: Response) => Promise<void>;
export declare const removeFromCart: (req: Request, res: Response) => Promise<void>;
