import { Router } from "express";
import authRouter from "./authRouter";

const indexRouter = Router();

indexRouter.use("/auth", authRouter);

export default indexRouter;
