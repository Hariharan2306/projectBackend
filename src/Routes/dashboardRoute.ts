import { Router } from "express";
import { dashboardController } from "../Controller/dashboardCotroller";

const dashboardRouter = Router();

dashboardRouter.get("/", dashboardController);
export default dashboardRouter;
