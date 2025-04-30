import { getNextSequenceWithPrefix } from "../Database/daoService";
import requestModel from "../Models/requestModel";

export const requestDonationService = async (
  donationId: string,
  quantity: number,
  requestedBy: string,
  requesterMail: string
) => {
  try {
    await requestModel.create({
      requestId: await getNextSequenceWithPrefix("requests_count", "Request"),
      donationId,
      requestedBy,
      requesterMail,
      quantity,
    });
  } catch (e) {
    throw new Error(
      `Failed Requesting - ${donationId}, due to ${(e as Error).message}`
    );
  }
};
