import { Request, Response } from "express";
import {
  fetchRequestsService,
  requestDonationService,
} from "../Service/requestsService";

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
    res.status(200).send({
      flag: "success",
      successMessage: "Request for donation Success",
    });
  } catch (e) {
    res.status(500).send({ flag: "error", error: (e as Error).message });
  }
};

export const fetchRequestsController = async (req: Request, res: Response) => {
  try {
    const {
      search = "",
      page = 0,
      pageSize = 5,
      dateRange = "{}",
      quantity = "[]",
      userName,
      email,
    } = req.query;
    const { requestsData, requestsCount } = await fetchRequestsService(
      userName as string,
      email as string,
      search as string,
      Number(page),
      Number(pageSize),
      JSON.parse(dateRange as string),
      JSON.parse(quantity as string)
    );
    res.status(200).send({
      flag: "success",
      successMessage: "Requests Fetched Successfully",
      requestsData,
      requestsCount,
    });
  } catch (e) {
    res.status(500).send({ flag: "error", error: (e as Error).message });
  }
};
