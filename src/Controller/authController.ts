import { Request, Response } from "express";
import { createUserService, loginService } from "../Service/authService";

export const loginController = (req: Request, res: Response) => {
  try {
    loginService();
    res.status(200).send({ flag: "Success" });
  } catch (e) {
    res.status(500).send({ flag: "Error", error: (e as Error).message });
  }
};
export const createUserController = (req: Request, res: Response) => {
  try {
    createUserService(req.body);
    res.status(200).send({ flag: "Success" });
  } catch (e) {
    res.status(500).send({ flag: "Error", error: (e as Error).message });
  }
};
