import { Request, Response } from "express";
export declare const createNode: (req: Request, res: Response) => Promise<void>;
export declare const addConnection: (req: Request, res: Response) => Promise<void>;
export declare const editConnectionWeight: (req: Request, res: Response) => Promise<void>;
export declare const deleteConnection: (req: Request, res: Response) => Promise<void>;
export declare const deleteNode: (req: Request, res: Response) => Promise<void>;
export declare const getNode: (req: Request, res: Response) => Promise<void>;
export declare const getNodes: (req: Request, res: Response) => Promise<void>;
