export type CreateUserData = {
  userName: string;
  mobile: string;
  location: string;
  email: string;
  reciever: boolean;
  registeredId: string;
};
export type LoginUserData = {
  userMail: string;
  password: string;
  isReciever: boolean;
};

export interface DonationData extends LoggedUserData {
  quantity: number;
  location: string;
  time: Date;
  productType: string;
  productDesc: string;
}
export interface LoggedUserData {
  userName: string;
  email: string;
  userType: "Reciever" | "Donor";
}

export type DateRangeType = {
  startDate: Date;
  endDate: Date;
  selection: string;
};
