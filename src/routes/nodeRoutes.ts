import { Router } from "express";
import {
    getNodes,
    createNode,
    addConnection,
    editConnectionWeight,
    deleteConnection,
    deleteNode,
    getNode,
} from "../controllers/NodeController";

const router = Router();
router.get("/", getNodes);
router.post("/create", createNode);
router.post("/connection", addConnection);
router.put("/connection/weight", editConnectionWeight);
router.delete("/connection", deleteConnection);
router.delete("/:idNode", deleteNode);
router.get("/:idNode", getNode);
export default router;
