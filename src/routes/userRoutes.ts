import { Router } from 'express'
import * as userController from '../controllers/UserController'
import { verifyUserToken } from '../middleware/auth';

const router = Router()
router.patch("/update-profile",verifyUserToken, userController.updateInformation);
router.get("/",verifyUserToken, userController.getAllUsers);
router.get("/:id",verifyUserToken, userController.getUserById); 
router.post("/",verifyUserToken, userController.createUser); 
router.patch("/:id",verifyUserToken, userController.updateUser);
router.delete("/:id",verifyUserToken, userController.deleteUser); 
router.patch("/update-role/:userId", verifyUserToken, userController.updateUserRole);

export default router;