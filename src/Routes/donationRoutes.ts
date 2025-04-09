import { Router } from "express";
import {
  addDonationController,
  fetchDonationController,
} from "../Controller/donationController";

const donationRouter = Router();

donationRouter.post("/addDonation", addDonationController);
donationRouter.get("/fetchDonations", fetchDonationController);

export default donationRouter;
