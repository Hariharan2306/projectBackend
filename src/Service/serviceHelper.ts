import jwt, { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import merge from "lodash/merge";
import donationModel from "../Models/donationModel";
import type { LoggedUserData, Payload } from "../types/common";

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) {
      res.status(401).json({ message: "Token not found" });
      return;
    }

    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET!
    ) as JwtPayload;
    merge(req, {
      user: {
        userName: decoded!.userName,
        email: decoded!.email,
        userType: decoded!.userType,
      },
    });
    next();
  } catch (e) {
    res.status(401).json({ message: "Token expired" });
  }
};

export const generateAccessToken = (payload: Payload) =>
  jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: process.env.ACCESS_TOKEN_EXP,
  } as jwt.SignOptions);

export const generateRefreshToken = (payload: Payload) =>
  jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: process.env.ACCESS_TOKEN_EXP,
  } as jwt.SignOptions);

export const getSegments = async (startDate: Date, endDate: Date) => {
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

export const getSegmentedCount = async (
  addedQuery: { productType: string },
  startDate: Date,
  endDate: Date,
  ownDataOnly: boolean,
  userName: string,
  email: string
) => {
  const segments = await getSegments(new Date(startDate), new Date(endDate));
  return await Promise.all(
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
};
