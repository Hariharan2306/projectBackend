import { getNextSequenceWithPrefix } from "../Database/daoService";
import donationModel from "../Models/donationModel";
import type { DonationData } from "../types/common";

export const addDonationService = async ({
  quantity,
  location,
  time,
  productType,
  userName,
  email,
}: DonationData) => {
  try {
    await donationModel.create({
      donationId: await getNextSequenceWithPrefix(
        "donations_count",
        "Donation"
      ),
      quantity: Number(quantity),
      location,
      time: new Date(time),
      productType,
      donor: userName,
      donorMail: email,
    });
  } catch (error) {
    throw new Error(
      `Failed while adding a new Donation ${(error as Error).message}`
    );
  }
};

export const fetchDonationService = async (
  search: string,
  page: number,
  pageSize: number
) => {
  try {
    const match = {
      $match: {
        $or: [
          { donationId: { $regex: `^${search}`, $options: "i" } },
          { location: { $regex: `^${search}`, $options: "i" } },
          { productType: { $regex: `^${search}`, $options: "i" } },
          { donor: { $regex: `^${search}`, $options: "i" } },
          { donorMail: { $regex: `^${search}`, $options: "i" } },
        ],
      },
    };
    const project = {
      $project: {
        _id: 0,
        id: "$donationId",
        donationId: 1,
        quantity: 1,
        location: 1,
        time: 1,
        productType: 1,
        donor: 1,
      },
    };
    const [donationData, donationCount] = await Promise.all([
      donationModel.aggregate([
        match,
        { $sort: { time: -1 } },
        { $skip: page * pageSize },
        { $limit: pageSize },
        project,
      ]),
      donationModel.find(match.$match, { _id: 0 }).countDocuments(),
    ]);

    return { donationData, donationCount };
  } catch (error) {
    throw new Error(
      `Failed while fetching donations data ${(error as Error).message}`
    );
  }
};
