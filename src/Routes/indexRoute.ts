import { Router } from "express";
import usersRouter from "./usersRouter";
import donationRouter from "./donationRoutes";
import requestRouter from "./requestsRoutes";
import approvalRouter from "./approvalRoutes";
import dashboardRouter from "./dashboardRoute";
import { verifyToken } from "../Service/serviceHelper";

const indexRouter = Router();

indexRouter.use("/users", usersRouter);
indexRouter.use("/donations", verifyToken, donationRouter);
indexRouter.use("/requests", verifyToken, requestRouter);
indexRouter.use("/approvals", verifyToken, approvalRouter);
indexRouter.use("/dashboard", verifyToken, dashboardRouter);

export default indexRouter;
