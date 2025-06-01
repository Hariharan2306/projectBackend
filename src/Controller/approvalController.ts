import { Request, Response } from "express";
import {
  fetchApprovalService,
  fetchRequesterDetailService,
  updateRequestStatusService,
} from "../Service/approvalService";

export const fetchApprovalController = async (req: Request, res: Response) => {
  try {
    const {
      search = "",
      page = 0,
      pageSize = 5,
      dateRange = "{}",
      quantity = "[]",
      userName,
    } = req.query;
    const { approvalData, approvalCount } = await fetchApprovalService(
      userName as string,
      search as string,
      Number(page),
      Number(pageSize),
      JSON.parse(dateRange as string),
      JSON.parse(quantity as string)
    );
    res.status(200).send({
      flag: "success",
      successMessage: "Approval List Fetch Success",
      approvalData,
      approvalCount,
    });
  } catch (e) {
    res.status(500).send({ flag: "error", error: (e as Error).message });
  }
};

export const fetchRequesterDetailController = async (
  req: Request,
  res: Response
) => {
  try {
    const { reqId } = req.query;
    const requesterDetails = await fetchRequesterDetailService(reqId as string);
    res.status(200).send({ flag: "success", requesterDetails });
  } catch (e) {
    res.status(500).send({ flag: "error", error: (e as Error).message });
  }
};
export const updateRequestStatusController = async (
  req: Request,
  res: Response
) => {
  try {
    const { reqId, isApproval } = req.body;
    await updateRequestStatusService(req.body);
    res.status(200).send({
      flag: "success",
      successMessage: `${reqId} :${
        isApproval ? "Approval Success" : "Rejected Successfully"
      }`,
    });
  } catch (e) {
    res.status(500).send({ flag: "error", error: (e as Error).message });
  }
};
