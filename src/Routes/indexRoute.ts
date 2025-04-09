import { Router } from "express";
import usersRouter from "./usersRouter";
import donationRouter from "./donationRoutes";

const indexRouter = Router();

indexRouter.use("/users", usersRouter);
indexRouter.use("/donations", donationRouter);

export default indexRouter;
