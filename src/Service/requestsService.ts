import get from "lodash/get";
import { getNextSequenceWithPrefix } from "../Database/daoService";
import requestModel from "../Models/requestModel";
import { DateRangeType } from "../types/common";

export const requestDonationService = async (
  donationId: string,
  quantity: number,
  requestedBy: string,
  requesterMail: string
) => {
  try {
    await requestModel.create({
      requestId: await getNextSequenceWithPrefix("requests_count", "Request"),
      donationId,
      requestedBy,
      requesterMail,
      quantity,
    });
  } catch (e) {
    throw new Error(
      `Failed Requesting - ${donationId}, due to ${(e as Error).message}`
    );
  }
};

export const fetchRequestsService = async (
  userName: string,
  email: string,
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
          { requestedBy: userName },
          { requesterMail: email },
          { quantity: { $gte: min ? Number(min) : 0 } },
          max ? { quantity: { $lte: Number(max) } } : {},
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
        location: 1,
        time: 1,
        productType: 1,
        donor: 1,
      },
    };
    const result = await requestModel.aggregate([
      ...lookUp,
      {
        $facet: {
          requestsData: [
            match,
            filter,
            { $sort: { time: -1 } },
            { $skip: page * pageSize },
            { $limit: pageSize },
            project,
          ],
          requestsCount: [match, filter, { $count: "count" }],
        },
      },
    ]);

    const requestsData = get(result, "[0].requestsData", []);
    const requestsCount = get(result, "[0].requestsCount[0].count", 0);

    return { requestsData, requestsCount };
  } catch (e) {
    throw new Error(`Failed fetching Requests - ${(e as Error).message}`);
  }
};
