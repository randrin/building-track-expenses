import { AttachmentType } from "./AttachmentType";
import { UserType } from "./UserType";

export type OrganizationType = {
  _id?: string;
  code: string;
  name: string;
  description: string;
  createdBy: UserType;
  departments: DepartmentType[];
  users: UserType[];
  logo: AttachmentType;
  phonePrefix: string;
  phoneNumber: string;
  headOffice: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type DepartmentType = {
  _id?: string;
  code: string;
  name: string;
  description: string;
  createdBy: UserType;
  contributors: UserType[];
  logo: AttachmentType;
  status: string;
  createdAt: string;
  updatedAt: string;
  manager: UserType;
};