import { Request, Response } from "express";
import { requestDonationService } from "../Service/requestsService";

export const requestDonationController = async (
  req: Request,
  res: Response
) => {
  try {
    const { donationId, quantity, requestedBy, requesterMail } = req.body;
    await requestDonationService(
      donationId,
      Number(quantity),
      requestedBy,
      requesterMail
    );
    res
      .status(200)
      .send({
        flag: "success",
        successMessage: "Request for donation Success",
      });
  } catch (e) {
    res.status(500).send({ flag: "error", error: (e as Error).message });
  }
};
