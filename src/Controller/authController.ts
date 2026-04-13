import { Request, Response } from "express";
import {
  createUserService,
  loginService,
  logout,
  refreshService,
} from "../Service/authService";

export const loginController = async (req: Request, res: Response) => {
  try {
    const { accessToken, refreshToken, data } = await loginService(req.body);
    res
      .status(200)
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 15 * 60 * 1000,
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .send({ flag: "Success", message: "Login Success", data });
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
export const logoutController = async (req: Request, res: Response) => {
  try {
    await logout(req, res);
    res
      .status(200)
      .send({ flag: "Success", message: "User Logged out Successfully" });
  } catch (e) {
    res.status(500).send({ flag: "Error", error: (e as Error).message });
  }
};
export const refreshController = async (req: Request, res: Response) => {
  try {
    const accessToken = await refreshService(req);
    res
      .status(200)
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 15 * 60 * 1000,
      })
      .send({ flag: "Success", message: "Token Refreshed Successfully" });
  } catch (e) {
    res.status(401).send({ flag: "Error", error: (e as Error).message });
  }
};
