import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response } from "express";
import axios from "axios";
import omit from "lodash/omit";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import { getNextSequenceWithPrefix } from "../Database/daoService";
import usersModel from "../Models/userModels";
import { generateAccessToken, generateRefreshToken } from "./serviceHelper";
import type { CreateUserData, LoginUserData, Payload } from "../types/common";
import tokenModel from "../Models/tokenModel";

export const loginService = async ({
  userMail,
  password,
  isReciever,
}: LoginUserData) => {
  try {
    const data = await usersModel
      .findOne(
        { userName: userMail, password },
        { _id: 0, email: 1, userName: 1, location: 1, reciever: 1 }
      )
      .lean();
    if (!data) throw new Error("Invalid Credentials");

    const { email, userName, location: userLocation, reciever } = data;
    if (reciever !== isReciever) throw new Error("User Type Mismatch");

    const payLoad: Payload = {
      userName,
      email,
      userType: reciever ? "Reciever" : "Donor",
      userLocation,
    };
    const accessToken = generateAccessToken(payLoad);
    const refreshToken = generateRefreshToken(payLoad);
    await tokenModel.deleteOne({ userName });
    await new tokenModel({
      ...payLoad,
      refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    }).save();
    return { accessToken, refreshToken, data };
  } catch (e) {
    throw new Error(
      `Failed while checking login credentials - ${(e as Error).message}`
    );
  }
};
export const createUserService = async (request: CreateUserData) => {
  try {
    if (request.reciever && isEmpty(request.registeredId))
      throw new Error("Registered Id not found");
    const orgId = get(request, "registeredId", "");

    const charitybaseUrl = process.env.CHARITYBASE_API_URL || "";
    const charityApiKey = process.env.CHARITYBASE_API_KEY || "";
    const query = `{ CHC { getCharities(filters: { id: ${orgId} }) {count}}}`;

    const response = await axios.post(
      charitybaseUrl,
      { query },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Apikey ${charityApiKey}`,
        },
      }
    );
    const count = get(response, "data.data.CHC.getCharities.count", false);

    if (!count || count === 0) {
      throw new Error(`Failed while Validating Organization Id - ${orgId}`);
    }

    await usersModel.create({
      userId: await getNextSequenceWithPrefix("users_count", "USER"),
      ...omit(request, "registeredId"),
      orgId,
    });
  } catch (e) {
    throw new Error(`Failed while Creating User - ${(e as Error).message}`);
  }
};

export const createRefreshToken = async ({ token }: { token: string }) => {
  try {
    if (!token) throw new Error("Token not found");
    const { userName, email, userType, userLocation } = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET!
    ) as JwtPayload;

    return generateAccessToken({ userName, email, userType, userLocation });
  } catch (e) {
    throw new Error(
      `Failed while creating refresh token - ${(e as Error).message}`
    );
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.cookies;
    await tokenModel.deleteOne({ refreshToken });
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
  } catch (e) {
    throw new Error(`Failed while logging out - ${(e as Error).message}`);
  }
};

export const refreshService = async (req: Request): Promise<string> => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) throw new Error("Refresh Token not found");
    const tokenDoc = await tokenModel.findOne({ refreshToken });
    if (!tokenDoc) throw new Error("Invalid refresh token");
    const payload = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET!
    ) as Payload;
    const accessToken = generateAccessToken(payload);
    return accessToken;
  } catch (e) {
    throw new Error(`Failed while Refreshing Token - ${(e as Error).message}`);
  }
};
