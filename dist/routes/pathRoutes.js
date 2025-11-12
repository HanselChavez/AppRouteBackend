"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const PathController_1 = require("../controllers/PathController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.post("/calcular_ruta", auth_1.verifyUserToken, PathController_1.getShortestPath);
router.get("/recientes", auth_1.verifyUserToken, PathController_1.getRoutesRecent);
exports.default = router;
//# sourceMappingURL=pathRoutes.js.map