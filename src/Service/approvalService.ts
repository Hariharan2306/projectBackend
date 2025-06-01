import get from "lodash/get";
import requestModel from "../Models/requestModel";
import usersModel from "../Models/userModels";
import type { DateRangeType } from "../types/common";

export const fetchApprovalService = async (
  userName: string,
  search: string,
  page: number,
  pageSize: number,
  { startDate, endDate }: DateRangeType,
  [min, max]: number[]
) => {
  try {
    const match = {
      $match: {
        $or: [
          { requestId: { $regex: `^${search}`, $options: "i" } },
          { donationId: { $regex: `^${search}`, $options: "i" } },
          { location: { $regex: `^${search}`, $options: "i" } },
          { productType: { $regex: `^${search}`, $options: "i" } },
          { donor: { $regex: `^${search}`, $options: "i" } },
          { donorMail: { $regex: `^${search}`, $options: "i" } },
        ],
      },
    };
    const filter = {
      $match: {
        $and: [
          // {
          //   time: {
          //     $gte: startDate ? new Date(startDate) : new Date(),
          //     $lte: endDate ? new Date(endDate) : new Date(),
          //   },
          // },
          { donorName: userName },
          { quantity: { $gte: min ? Number(min) : 0 } },
          max ? { quantity: { $lte: Number(max) } } : {},
          { withdrawn: false },
          { approvalStatus: "Pending" },
        ],
      },
    };
    const lookUp = [
      {
        $lookup: {
          from: "donations",
          localField: "donationId",
          foreignField: "donationId",
          as: "donationData",
        },
      },
      { $unwind: "$donationData" },
      {
        $replaceRoot: {
          newRoot: { $mergeObjects: ["$donationData", "$$ROOT"] },
        },
      },
      { $project: { donationData: 0 } },
    ];
    const project = {
      $project: {
        _id: 0,
        id: "$requestId",
        requestId: 1,
        quantity: 1,
        time: 1,
        productType: 1,
        requestedBy: 1,
      },
    };
    const result = await requestModel.aggregate([
      ...lookUp,
      {
        $facet: {
          approvalData: [
            match,
            filter,
            { $sort: { time: -1 } },
            { $skip: page * pageSize },
            { $limit: pageSize },
            project,
          ],
          approvalCount: [match, filter, { $count: "count" }],
        },
      },
    ]);

    const approvalData = get(result, "[0].approvalData", []);
    const approvalCount = get(result, "[0].approvalCount[0].count", 0);

    return { approvalData, approvalCount };
  } catch (e) {
    throw new Error(`Failed while fetching Approvals ${(e as Error).message}`);
  }
};

export const fetchRequesterDetailService = async (reqId: string) => {
  try {
    const requesterName = await requestModel.findOne(
      { requestId: reqId },
      { _id: 0, requestedBy: 1 }
    );
    const requesterDetails = await usersModel
      .findOne(
        { userName: requesterName!.requestedBy },
        { _id: 0, userName: 1, mobile: 1, location: 1, email: 1 }
      )
      .lean();
    return requesterDetails;
  } catch (e) {
    throw new Error(
      `Failed while fetching Requester Details - ${(e as Error).message}`
    );
  }
};

export const updateRequestStatusService = async ({
  reqId,
  isApproval,
}: {
  reqId: string;
  isApproval: boolean;
}) => {
  try {
    const requestData = await requestModel
      .findOne({ requestId: reqId }, { _id: 0, quantity: 1 })
      .lean();
    if (!requestData) throw new Error("No Such request found");
    await requestModel.updateOne(
      { requestId: reqId },
      { $set: { approvalStatus: isApproval ? "Approved" : "Rejected" } }
    );
  } catch (e) {
    throw new Error(
      `Failed while updating Request Status -${(e as Error).message}`
    );
  }
};
