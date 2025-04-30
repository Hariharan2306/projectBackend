import { Router } from "express";
import usersRouter from "./usersRouter";
import donationRouter from "./donationRoutes";
import requestRouter from "./requestsRoutes";

const indexRouter = Router();

indexRouter.use("/users", usersRouter);
indexRouter.use("/donations", donationRouter);
indexRouter.use("/requests", requestRouter);

export default indexRouter;
