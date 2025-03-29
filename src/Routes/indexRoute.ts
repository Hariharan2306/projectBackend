import { Router } from "express";
import usersRouter from "./usersRouter";
import donationRouter from "./donationRoutes";

const indexRouter = Router();

indexRouter.use("/users", usersRouter);
indexRouter.use("/usersdonations", donationRouter);

export default indexRouter;
