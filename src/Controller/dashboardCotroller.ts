import type { Request, Response } from "express";
import { dashboardService } from "../Service/dashboardService";

export const dashboardController = async (req: Request, res: Response) => {
  try {
    const {
      userName,
      email,
      dateRange = {},
      dataOwnerType: ownDataOnly = false,
    } = req.query;
    const dashboardData = await dashboardService(
      userName as string,
      email as string,
      JSON.parse(dateRange as string),
      JSON.parse(ownDataOnly as string)
    );
    res.status(200).send({
      flag: "success",
      successMessage: "Dashboard Fetch Success",
      dashboardData,
    });
  } catch (error) {
    res.status(500).send({ flag: "error", error: (error as Error).message });
  }
};
