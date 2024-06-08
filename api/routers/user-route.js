import express from "express";
import userController from "../controllers/user-controller.js";
import verifyToken from "../utils/verifyUser.js";
import validate from "../middlewares/validate-middleware.js";
import { updateSchema } from "../validators/form-validator.js";

const router=express.Router();

router.route('/update/:userId').put(verifyToken,validate(updateSchema),userController.updateUser);
router.route('/delete/:userId').delete(verifyToken,userController.deleteUser);
router.route('/signout').post(userController.signout);
router.route('/getusers').get(verifyToken,userController.getUsers);
router.route('/:userId').get(userController.getUser);

export default router;