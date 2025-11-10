import donationModel from "../Models/donationModel";
import type { DateRangeType } from "../types/common";

const PRODUCT_TYPES = [
  { label: "Food", color: "#4CAF50" },
  { label: "Clothing", color: "#2196F3" },
  { label: "Meals", color: "#FF9800" },
  { label: "Gravy", color: "#9C27B0" },
  { label: "Toys", color: "#F44336" },
];

export const dashboardService = async (
  userName: string,
  email: string,
  { startDate, endDate }: DateRangeType,
  ownDataOnly: boolean
) => {
  try {
    startDate = startDate ? new Date(startDate) : new Date();
    endDate = endDate ? new Date(endDate) : new Date();

    const pieDataCounts = await Promise.all(
      PRODUCT_TYPES.map(({ label }) =>
        donationModel
          .find(
            {
              createdAt: { $gte: startDate, $lte: endDate },
              ...(ownDataOnly ? { donor: userName } : {}),
              ...(ownDataOnly ? { donorMail: email } : {}),
              ...{ productType: label },
            },
            { _id: 0 }
          )
          .countDocuments()
      )
    );
    const pieData = PRODUCT_TYPES.map(({ label, color }, idx) => ({
      id: label,
      label,
      value: pieDataCounts[idx],
      color,
    }));

    const segments = await getSegments(new Date(startDate), new Date(endDate));
    const getSegmentedCount = async (addedQuery: { productType: string }) =>
      await Promise.all(
        segments.map(async ({ start, end }) => ({
          x: `${start.toLocaleString("en-US", {
            month: "short",
          })} ${start.getFullYear()}`,
          y: await donationModel
            .find(
              {
                createdAt: { $gte: start, $lte: end },
                ...(ownDataOnly ? { donor: userName } : {}),
                ...(ownDataOnly ? { donorMail: email } : {}),
                ...addedQuery,
              },
              { _id: 0 }
            )
            .countDocuments(),
        }))
      );
    const graphData = await Promise.all(
      PRODUCT_TYPES.map(async ({ label, color }) => ({
        id: label,
        color,
        data: await getSegmentedCount({ productType: label }),
      }))
    );
    return { pieData, graphData };
  } catch (error) {
    throw new Error(
      `Failed while fetching donation data ${(error as Error).message}`
    );
  }
};

const getSegments = async (startDate: Date, endDate: Date) => {
  const datesFromDb = await donationModel.aggregate([
    {
      $group: {
        _id: null,
        firstCreatedDate: { $min: "$createdAt" },
        lastCreatedDate: { $max: "$createdAt" },
      },
    },
    {
      $project: {
        _id: 0,
        firstCreatedAt: {
          $dateToString: { format: "%Y-%m-%d", date: "$firstCreatedDate" },
        },
        lastCreatedAt: {
          $dateToString: { format: "%Y-%m-%d", date: "$lastCreatedDate" },
        },
      },
    },
  ]);
  if (!datesFromDb) throw new Error("Failed while segmenting dates for Graph");
  startDate =
    startDate.getTime() === 0 ? datesFromDb[0].firstCreatedAt : startDate;
  endDate = endDate === new Date() ? datesFromDb[0].lastCreatedAt : endDate;

  startDate = new Date(startDate);
  endDate = new Date(endDate);

  const startMs = startDate.getTime();
  const endMs = endDate.getTime();
  const step = (endMs - startMs) / 5;

  let segments = [];
  for (let i = 0; i <= 5; i++) segments.push(new Date(startMs + step * i));
  return segments.map((el) => ({
    start: new Date(el.getFullYear(), el.getMonth(), 1, 0, 0, 0, 0),
    end: new Date(el.getFullYear(), el.getMonth() + 1, 0, 23, 59, 59, 999),
  }));
};
