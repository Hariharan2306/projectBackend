import omit from "lodash/omit";
import { getNextSequenceWithPrefix } from "../Database/daoService";
import usersModel from "../Models/userModels";
import type { CreateUserData } from "../userTypes";

export const loginService = () => {
  try {
  } catch (e) {
    `Failed while checking login credentials - ${(e as Error).message}`;
  }
};
export const createUserService = async (request: CreateUserData) => {
  try {
    usersModel.create({
      userId: await getNextSequenceWithPrefix("users_count", "USER"),
      ...omit(request, "registeredId"),
      orgId: request.registeredId,
    });
  } catch (e) {
    `Failed while checking login credentials - ${(e as Error).message}`;
  }
};
