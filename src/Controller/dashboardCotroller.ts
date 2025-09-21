import type { Request, Response } from "express";
import { dashboardService } from "../Service/dashboardService";

export const dashboardController = async (req: Request, res: Response) => {
  try {
    const dashboardData = await dashboardService(req.body);
    res.status(200).send({
      flag: "success",
      successMessage: "Dashboard Fetch Success",
      dashboardData,
    });
  } catch (error) {
    res.status(500).send({ flag: "error", error: (error as Error).message });
  }
};
