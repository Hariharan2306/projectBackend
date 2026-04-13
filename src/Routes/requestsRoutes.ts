import { Router } from "express";
import {
  fetchRequestsController,
  requestDonationController,
  withdrawRequestsController,
} from "../Controller/requestsController";
import { verifyToken } from "../Service/serviceHelper";

const requestRouter = Router();

requestRouter.get("/", verifyToken, fetchRequestsController);
requestRouter.post("/requestDonation", verifyToken, requestDonationController);
requestRouter.put(
  "/withdraw/:requestId",
  verifyToken,
  withdrawRequestsController
);

export default requestRouter;
