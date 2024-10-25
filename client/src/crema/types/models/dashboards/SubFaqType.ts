import { FaqType } from "./FaqType";
import { UserType } from "./UserType";

export type SubFaqType = {
  _id: string;
  title: string;
  description: string;
  faq: FaqType;
  status: string;
  createdBy: UserType;
  createdAt: string;
  updatedAt: string;
};