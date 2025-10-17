import type { Request, Response } from "express";
export declare const getAllCategories: (req: Request, res: Response) => Promise<void>;
export declare const getTopCategories: (req: Request, res: Response) => Promise<void>;
export declare const getCategoriesWithProducts: (req: Request, res: Response) => Promise<void>;
export declare const getCategoryById: (req: Request, res: Response) => Promise<void>;
export declare const createCategory: (req: Request, res: Response) => Promise<void>;
export declare const updateCategory: (req: Request, res: Response) => Promise<void>;
export declare const deleteCategory: (req: Request, res: Response) => Promise<void>;
