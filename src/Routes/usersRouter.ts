import { Router } from "express";
import {
  createUserController,
  loginController,
} from "../Controller/authController";

const usersRouter = Router();

usersRouter.post("/login-user", loginController);
usersRouter.post("/create-user", createUserController);

export default usersRouter;
