import { UserType } from "./UserType";

export type FaqType = {
  _id: string;
  name: string;
  status: string;
  createdBy: UserType;
  createdAt: string;
  updatedAt: string;
};
