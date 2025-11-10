import { Router } from "express";
import usersRouter from "./usersRouter";
import donationRouter from "./donationRoutes";
import requestRouter from "./requestsRoutes";
import approvalRouter from "./approvalRoutes";
import dashboardRouter from "./dashboardRoute";

const indexRouter = Router();

indexRouter.use("/users", usersRouter);
indexRouter.use("/donations", donationRouter);
indexRouter.use("/requests", requestRouter);
indexRouter.use("/approvals", approvalRouter);
indexRouter.use("/dashboard", dashboardRouter);

export default indexRouter;
