import { TicketTypeEnums } from "utils/common-constants.utils";
import { AttachmentType } from "./AttachmentType";
import { CategoryType } from "./CategoryType";
import { SubCategoryType } from "./SubCategoryType";
import { UserType } from "./UserType";

export type TicketType = {
  _id: string;
  code: string;
  object: string;
  message: string;
  subject: SubCategoryType;
  category: CategoryType;
  status: string;
  attachments: AttachmentType[];
  createdBy: UserType;
  createdAt: string;
  updatedAt: string;
  comments: CommentTicketType[];
};

export type CommentTicketType = {
  _id: string;
  message: string;
  type: TicketTypeEnums;
  attachments: AttachmentType[];
  createdBy: UserType;
  createdAt: string;
  updatedAt: string;
};

export type DashboardTicketType = {
  total: number;
  openTicketsTotal: TicketType[];
  closedTicketsTotal: TicketType[];
  resolvedTicketsTotal: TicketType[];
  lastOpenTickets: TicketType[];
};
