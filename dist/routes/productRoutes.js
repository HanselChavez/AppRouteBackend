"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ProductController_1 = require("../controllers/ProductController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get("/", ProductController_1.getAllProducts);
router.get("/product/:id", ProductController_1.getProductById);
router.patch("/availability/:id", ProductController_1.changeAvilability);
router.post("/", auth_1.verifyUserToken, ProductController_1.createProduct);
router.patch("/:id", auth_1.verifyUserToken, ProductController_1.updateProduct);
router.delete("/:id", auth_1.verifyUserToken, ProductController_1.deleteProduct);
router.get("/category/:categoryId", ProductController_1.getProductsByCategory);
router.get("/filter", ProductController_1.filterProducts);
router.get("/filter-options", ProductController_1.getFilterOptions);
exports.default = router;
//# sourceMappingURL=productRoutes.js.map