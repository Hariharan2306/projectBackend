import { Router } from "express";
import { requestDonationController } from "../Controller/requestsController";

const requestRouter = Router();

requestRouter.post("/requestDonation", requestDonationController);

export default requestRouter;
