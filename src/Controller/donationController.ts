import { Request, Response } from "express";

export const addDonationController = async (req: Request, res: Response) => {
  try {
  } catch (e) {
    res.status(500).send({ flag: "error", error: (e as Error).message });
  }
};
export const fetchDonationController = async (req: Request, res: Response) => {
  try {
  } catch (e) {
    res.status(500).send({ flag: "error", error: (e as Error).message });
  }
};
