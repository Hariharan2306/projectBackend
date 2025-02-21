import { Router } from "express";
import {
  createUserController,
  loginController,
} from "../Controller/authController";

const usersRouter = Router();

usersRouter.post("/signin", loginController);
usersRouter.post("/create-user", createUserController);

export default usersRouter;
