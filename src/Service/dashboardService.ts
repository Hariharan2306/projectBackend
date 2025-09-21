import type { DateRangeType, LoggedUserData } from "../types/common";

export const dashboardService = async ({
  userName,
  email,
  startDate,
  endDate,
  dataOwnerType,
}: LoggedUserData & DateRangeType & { dataOwnerType: boolean }) => {
  try {
  } catch (error) {
    throw new Error(
      `Failed while fetching donation data ${(error as Error).message}`
    );
  }
};
