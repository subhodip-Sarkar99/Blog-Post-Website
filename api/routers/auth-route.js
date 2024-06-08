import express from "express";
import authControllers from "../controllers/auth-controller.js";
import validate from "../middlewares/validate-middleware.js";
import { loginSchema, signUpSchema } from "../validators/form-validator.js";


const router=express.Router();

router.route("/").get(authControllers.test);

router.route("/sign-up").post(validate(signUpSchema),authControllers.signUp);

router.route("/login").post(validate(loginSchema), authControllers.login);

router.route("/google").post(authControllers.google);

export default router;