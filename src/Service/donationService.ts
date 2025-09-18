import { getNextSequenceWithPrefix } from "../Database/daoService";
import donationModel from "../Models/donationModel";
import type { DateRangeType, DonationData } from "../types/common";

export const addDonationService = async ({
  quantity,
  location,
  time,
  productType,
  userName,
  email,
  productDesc,
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
      productDesc,
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
  pageSize: number,
  { startDate, endDate }: DateRangeType,
  [min, max]: number[],
  activeToggle: string,
  userName: string,
  email: string
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
    const filter = {
      $match: {
        $and: [
          // {
          //   time: {
          //     $gte: startDate ? new Date(startDate) : new Date(),
          //     $lte: endDate ? new Date(endDate) : new Date(),
          //   },
          // },
          { quantity: { $gte: min ? Number(min) : 0 } },
          max ? { quantity: { $lte: Number(max) } } : {},
          activeToggle === "mine" ? { donor: userName } : {},
          activeToggle === "mine" ? { donorMail: email } : {},
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
        productDesc: 1,
      },
    };
    const [donationData, donationCount] = await Promise.all([
      donationModel.aggregate([
        match,
        filter,
        { $sort: { time: -1 } },
        { $skip: page * pageSize },
        { $limit: pageSize },
        project,
      ]),
      donationModel
        .find({ ...match.$match, ...filter.$match }, { _id: 0 })
        .countDocuments(),
    ]);

    return { donationData, donationCount };
  } catch (error) {
    throw new Error(
      `Failed while fetching donations data ${(error as Error).message}`
    );
  }
};
