import { Request, Response } from "express";
import { createUserService, loginService } from "../Service/authService";

export const loginController = async (req: Request, res: Response) => {
  try {
    const data = await loginService(req.body);
    res.status(200).send({ flag: "Success", message: "Login Success", data });
  } catch (e) {
    res.status(500).send({ flag: "Error", error: (e as Error).message });
  }
};
export const createUserController = async (req: Request, res: Response) => {
  try {
    await createUserService(req.body);
    res
      .status(200)
      .send({ flag: "Success", message: "User Created Successfully" });
  } catch (e) {
    res.status(500).send({ flag: "Error", error: (e as Error).message });
  }
};
