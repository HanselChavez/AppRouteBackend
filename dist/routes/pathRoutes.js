"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const PathController_1 = require("../controllers/PathController");
const router = (0, express_1.Router)();
router.post("/calcular_ruta", PathController_1.getShortestPath);
exports.default = router;
//# sourceMappingURL=pathRoutes.js.map