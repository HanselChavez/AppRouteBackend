"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const NodeController_1 = require("../controllers/NodeController");
const router = (0, express_1.Router)();
router.get("/", NodeController_1.getNodes);
router.post("/create", NodeController_1.createNode);
router.post("/connection", NodeController_1.addConnection);
router.put("/connection/weight", NodeController_1.editConnectionWeight);
router.delete("/connection", NodeController_1.deleteConnection);
router.delete("/:idNode", NodeController_1.deleteNode);
router.get("/:idNode", NodeController_1.getNode);
exports.default = router;
//# sourceMappingURL=nodeRoutes.js.map