"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const CartController_1 = require("../controllers/CartController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.post("/add", auth_1.verifyUserToken, CartController_1.addToCart);
router.get("/", auth_1.verifyUserToken, CartController_1.getCart);
router.post("/:userId", auth_1.verifyUserToken, CartController_1.updateCartByIdUser);
router.get("/:userId", auth_1.verifyUserToken, CartController_1.getCartByIdUser);
router.post("/remove", auth_1.verifyUserToken, CartController_1.removeFromCart);
exports.default = router;
//# sourceMappingURL=cartRoutes.js.map