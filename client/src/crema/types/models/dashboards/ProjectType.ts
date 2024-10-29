import { AttachmentType } from "./AttachmentType";
import { UserType } from "./UserType";

export type ProjectType = {
  _id: string;
  code: string;
  name: string;
  description: string;
  status: string;
  manager: UserType;
  createdBy: UserType;
  documents: AttachmentType[];
  contributors: UserType[];
  createdAt: string;
  updatedAt: string;
};
