import { Router } from "express";
import usersRouter from "./usersRouter";

const indexRouter = Router();

indexRouter.use("/users", usersRouter);

export default indexRouter;
