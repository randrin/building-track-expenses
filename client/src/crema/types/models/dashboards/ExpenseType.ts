import { AttachmentType } from "./AttachmentType";
import { CategoryType } from "./CategoryType";
import { DepartmentType } from "./OrganizationType";
import { SubCategoryType } from "./SubCategoryType";
import { UserType } from "./UserType";

export type ExpenseType = {
  _id: string;
  category: CategoryType;
  subcategory: SubCategoryType;
  transaction_date: string;
  approvation_date: string;
  submission_date: string;
  accounting_date: string;
  attachments: AttachmentType[];
  receipt: string;
  reimburse: boolean;
  amount: number;
  currency: string;
  comment: string;
  comments: TypeExpense[];
  status: StatusExpense[];
  currentStatus: string;
  employee: UserType;
  department: DepartmentType;
  approver: UserType;
  accounting: UserType;
  createdAt: string;
  updatedAt: string;
  rejects: TypeExpense[];
};

export type TypeExpense = {
  comment: string;
  type: string;
  date: Date;
  user: UserType;
  createdAt: string;
  updatedAt: string;
};

export type StatusExpense = {
  status: string;
  date: Date;
  user: UserType;
  createdAt: string;
  updatedAt: string;
};