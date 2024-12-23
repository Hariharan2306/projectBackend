import { Router } from "express";
import { loginController } from "../Controller/authController";

const authRouter = Router();

authRouter.use("/signin", loginController);

export default authRouter;
