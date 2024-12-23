import { Request, Response } from "express";
import { loginService } from "../Service/authService";

export const loginController = (req: Request, res: Response) => {
  try {
    loginService();
    res.status(200).send({ flag: "Success" });
  } catch (e) {
    res.status(500).send({ flag: "Error", error: (e as Error).message });
  }
};
