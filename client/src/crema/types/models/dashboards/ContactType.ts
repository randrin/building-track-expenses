import { AttachmentType } from "./AttachmentType";
import { UserType } from "./UserType";

export type ContactType = {
  _id?: string;
  gender: string;
  firstName: string;
  lastName: string;
  displayName?: string;
  email: string;
  birthday: string;
  phoneNumber: string;
  phoneNumberBis: string;
  website: string;
  companyName: string;
  companyAddress: string;
  photoURL: AttachmentType;
  notes: string;
  createdBy?: UserType;
  label: LabelType;
  folder: FolderType;
  isStarred?: boolean;
  isFrequent?: boolean;
  facebookId: string;
  twitterId: string;
  instagramId: string;
  createdAt: string;
};

export type ContactMessageType = {
  _id?: string;
  displayName?: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
};

export type FolderType = {
  _id?: string;
  name: string;
  alias: string;
  icon: string;
  status: string;
  createdBy?: UserType;
  createdAt?: string;
  updatedAt?: string;
};

export type LabelType = {
  _id: string;
  name: string;
  alias: string;
  color: string;
  status: string;
  createdBy: UserType;
  createdAt: string;
  updatedAt: string;
};
