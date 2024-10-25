import { UserType } from "./UserType";

export type RechargeType = {
  _id: string;
  amount: number;
  currency: string;
  employee: UserType;
  createdBy: UserType;
  createdAt: string;
  updatedAt: string;
};
