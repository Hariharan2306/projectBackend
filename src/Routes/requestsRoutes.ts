import { Router } from "express";
import {
  fetchRequestsController,
  requestDonationController,
} from "../Controller/requestsController";

const requestRouter = Router();

requestRouter.post("/requestDonation", requestDonationController);
requestRouter.get("/", fetchRequestsController);

export default requestRouter;
