import type { Request, Response } from "express";
import {
  addDonationService,
  fetchDonationService,
} from "../Service/donationService";

export const addDonationController = async (req: Request, res: Response) => {
  try {
    await addDonationService(req.body);
    res.status(200).send({
      flag: "success",
      successMessage: "New Donation Added Successfully",
    });
  } catch (e) {
    res.status(500).send({ flag: "error", error: (e as Error).message });
  }
};
export const fetchDonationController = async (req: Request, res: Response) => {
  try {
    const { search = "", page = 0, pageSize = 5 } = req.query;
    const { donationData, donationCount } = await fetchDonationService(
      search as string,
      Number(page),
      Number(pageSize)
    );
    res.status(200).send({
      flag: "success",
      successMessage: "Donation data Fetched Successfully",
      donationData,
      donationCount,
    });
  } catch (e) {
    res.status(500).send({ flag: "error", error: (e as Error).message });
  }
};
