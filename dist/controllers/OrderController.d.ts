import { Request, Response } from "express";
export declare const createOrder: (req: Request, res: Response) => Promise<void>;
export declare const getAllOrders: (req: Request, res: Response) => Promise<void>;
export declare const getOrderById: (req: Request, res: Response) => Promise<void>;
export declare const updateOrderStatus: (req: Request, res: Response) => Promise<void>;
export declare const deleteOrder: (req: Request, res: Response) => Promise<void>;
export declare const updateStock: (productId: string, quantity: number, storeId?: string) => Promise<void>;
