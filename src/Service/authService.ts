import omit from "lodash/omit";
import { getNextSequenceWithPrefix } from "../Database/daoService";
import usersModel from "../Models/userModels";
import type { CreateUserData, LoginUserData } from "../types/common";

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
    if (data.reciever !== isReciever) throw new Error("User Type Mismatch");
    return data;
  } catch (e) {
    throw new Error(
      `Failed while checking login credentials - ${(e as Error).message}`
    );
  }
};
export const createUserService = async (request: CreateUserData) => {
  try {
    await usersModel.create({
      userId: await getNextSequenceWithPrefix("users_count", "USER"),
      ...omit(request, "registeredId"),
      orgId: request.registeredId,
    });
  } catch (e) {
    throw new Error(`Failed while Creating User - ${(e as Error).message}`);
  }
};
