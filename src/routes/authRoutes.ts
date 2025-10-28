import { verifyUserToken } from "./../middleware/auth";
import { Router } from "express";
import {
    registerUser,
    verifyUser,
    resendVerificationToken,
    loginUser,
    forgotPassword,
    updatePasswordWithToken,
    updateCurrentUserPassword,
    user,
    getPerfil,
    updatePerfil,
    handleGoogleAuthFailure,
    validateToken,
} from "../controllers/AuthController";
//import passport from '../config/passportConfig'

const router = Router();
router.get("/user", verifyUserToken, user);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/perfil",verifyUserToken, getPerfil);
router.put("/perfil",verifyUserToken, updatePerfil);
router.post("/verify-token", validateToken);
router.post("/verify-email", verifyUser);
router.post("/resend-verification", resendVerificationToken);
router.post("/forgot-password", forgotPassword);
router.patch("/reset-password/:token", updatePasswordWithToken);
router.patch("/update-password", verifyUserToken, updateCurrentUserPassword);
/*router.get('/google', (req, res, next) => {
    const redirectUrl = req.query.redirect || '/auth/sign-in';
    passport.authenticate('google', {
        scope: ['profile', 'email'],
        state: JSON.stringify({ redirectUrl })
    })(req, res, next);
});
router.get('/google/callback', 
    passport.authenticate('google', { failureRedirect: '/auth/sign-in' }),googleAuth);
router.get('/google/fail', handleGoogleAuthFailure);
*/
export default router;
