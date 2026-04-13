import donationModel from "../Models/donationModel";
import type { DateRangeType } from "../types/common";
import { getSegmentedCount } from "./serviceHelper";

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

    const graphData = await Promise.all(
      PRODUCT_TYPES.map(async ({ label, color }) => ({
        id: label,
        color,
        data: await getSegmentedCount(
          { productType: label },
          startDate,
          endDate,
          ownDataOnly,
          userName,
          email
        ),
      }))
    );
    return { pieData, graphData };
  } catch (error) {
    throw new Error(
      `Failed while fetching donation data ${(error as Error).message}`
    );
  }
};
