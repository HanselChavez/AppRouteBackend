"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const PriceRangeController_1 = require("../controllers/PriceRangeController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get("/price-ranges", PriceRangeController_1.getPriceRanges);
router.post("/price-ranges", auth_1.verifyUserToken, PriceRangeController_1.createOrUpdatePriceRange);
router.delete("/price-ranges/:id", auth_1.verifyUserToken, PriceRangeController_1.deletePriceRange);
exports.default = router;
//# sourceMappingURL=priceRangeRoutes.js.map