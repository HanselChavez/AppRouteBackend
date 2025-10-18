import { Router } from "express";
import {
    getShortestPath 
} from "../controllers/PathController";
import { verifyUserToken } from "../middleware/auth";

const router = Router();

router.get("/shortest/:idOrigin/:idDestination", getShortestPath);
export default router;
