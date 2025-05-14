import { Router } from "express";
import {
  fetchRequestsController,
  requestDonationController,
  withdrawRequestsController,
} from "../Controller/requestsController";

const requestRouter = Router();

requestRouter.get("/", fetchRequestsController);
requestRouter.post("/requestDonation", requestDonationController);
requestRouter.put("/withdraw/:requestId", withdrawRequestsController);

export default requestRouter;
