import { Router } from "express";
import {
  createUserController,
  loginController,
  logoutController,
  refreshController,
} from "../Controller/authController";

const usersRouter = Router();

usersRouter.post("/login-user", loginController);
usersRouter.post("/create-user", createUserController);
usersRouter.post("/logout-user", logoutController);
usersRouter.post("/refresh", refreshController);

export default usersRouter;
