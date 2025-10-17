"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("./../middleware/auth");
const express_1 = require("express");
const AuthController_1 = require("../controllers/AuthController");
const passportConfig_1 = __importDefault(require("../config/passportConfig"));
const router = (0, express_1.Router)();
router.get("/user", auth_1.verifyUserToken, AuthController_1.user);
router.post("/register", AuthController_1.registerUser);
router.post("/verify-token", AuthController_1.validateToken);
router.post("/verify-email", AuthController_1.verifyUser);
router.post("/resend-verification", AuthController_1.resendVerificationToken);
router.post("/login", AuthController_1.loginUser);
router.post("/forgot-password", AuthController_1.forgotPassword);
router.patch("/reset-password/:token", AuthController_1.updatePasswordWithToken);
router.patch("/update-password", auth_1.verifyUserToken, AuthController_1.updateCurrentUserPassword);
router.get('/google', (req, res, next) => {
    const redirectUrl = req.query.redirect || '/auth/sign-in';
    passportConfig_1.default.authenticate('google', {
        scope: ['profile', 'email'],
        state: JSON.stringify({ redirectUrl })
    })(req, res, next);
});
router.get('/google/callback', passportConfig_1.default.authenticate('google', { failureRedirect: '/auth/sign-in' }), AuthController_1.googleAuth);
router.get('/google/fail', AuthController_1.handleGoogleAuthFailure);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map