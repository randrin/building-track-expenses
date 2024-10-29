import { AttachmentType } from "./AttachmentType";
import { DepartmentType, OrganizationType } from "./OrganizationType";
import { ProjectType } from "./ProjectType";

export type UserType = {
  _id?: string;
  uid?: string;
  gender?: string;
  lastName?: string;
  firstName?: string;
  displayName?: string;
  username?: string;
  biography?: string;
  email?: string;
  contact: {
    phonePrefix: string;
    phoneNumber: string;
  };
  address: {
    city: string;
    addressLineOne: string;
    addressLineTwo: string;
    country: string;
    zipCode: string;
  };
  salary?: {
    amount: string;
    currency: string;
  };
  currentDepartment?: DepartmentType;
  currentProject?: ProjectType;
  tmpPassword?: boolean;
  dateOfBorn?: string;
  status?: string;
  photoURL?: AttachmentType;
  role?: string;
  photoRGA?: string;
  password?: string;
  groups?: string[];
  lastLogin?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  createdBy: UserType;
  documents?: {
    cni: AttachmentType;
    passport: AttachmentType;
    residence: AttachmentType;
  };
  balance?: {
    fcfa: number;
    dollar: number;
    euro: number;
  };
  payment?: {
    bank: {
      picture: AttachmentType;
      bic: string;
      iban: string;
      beneficiary: string;
    };
    phone: {
      prefix: string;
      number: string;
    };
  };
};

export type FilterUserType = {
  organization: string;
  status: string;
  role: string;
  tmpPassword: string;
  gender: string;
  //createdAt: { start?: string; end?: string };
};
