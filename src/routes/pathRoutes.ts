import { Router } from "express";
import {
    getRoutesRecent,
    getShortestPath 
} from "../controllers/PathController";
import { verifyUserToken } from "../middleware/auth";

const router = Router();

router.post("/calcular_ruta",verifyUserToken, getShortestPath);
router.get("/recientes", verifyUserToken, getRoutesRecent);
export default router;
