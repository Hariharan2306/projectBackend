import axios from "axios";
import omit from "lodash/omit";
import get from "lodash/get";
import { getNextSequenceWithPrefix } from "../Database/daoService";
import usersModel from "../Models/userModels";
import type { CreateUserData, LoginUserData } from "../types/common";
import { isEmpty } from "lodash";

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
