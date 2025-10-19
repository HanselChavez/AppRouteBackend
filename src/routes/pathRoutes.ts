import { Router } from "express";
import {
    getShortestPath 
} from "../controllers/PathController";
import { verifyUserToken } from "../middleware/auth";

const router = Router();

router.post("/calcular_ruta", getShortestPath);
export default router;
