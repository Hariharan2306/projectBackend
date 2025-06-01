import { Router } from "express";
import {
  fetchApprovalController,
  fetchRequesterDetailController,
  updateRequestStatusController,
} from "../Controller/approvalController";

const approvalRouter = Router();

approvalRouter.get("/", fetchApprovalController);
approvalRouter.get("/requester-details", fetchRequesterDetailController);
approvalRouter.put("/approve", updateRequestStatusController);

export default approvalRouter;
