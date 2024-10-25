import { AttachmentType } from "./dashboards/AttachmentType";
import {
  DepartmentType,
  OrganizationType,
} from "./dashboards/OrganizationType";

export type AuthUserType = {
  _id?: string;
  uid?: string;
  gender?: string;
  lastName?: string;
  firstName?: string;
  displayName?: string;
  username?: string;
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
  currentDepartment?: DepartmentType;
  tmpPassword?: boolean;
  dateOfBorn?: string;
  status?: string;
  photoURL?: AttachmentType;
  token?: string;
  role?: string;
  photoRGA?: string;
  password?: string;
  lastLogin?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
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
  salary?: {
    amount: string;
    currency: string;
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
  settings?: {
    currency: string;
    language: string;
  };
};
