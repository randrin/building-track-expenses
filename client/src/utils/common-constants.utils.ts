// ENUMS
export enum StatusEnums {
  ACTIVE = "ACTIVE",
  DISABLED = "DISABLED",
}
export enum TicketEnums {
  OPEN = "OPEN",
  CLOSED = "CLOSED",
  RESOLVED = "RESOLVED",
}
export enum TicketTypeEnums {
  USER = "USER",
  ADMIN_MANAGER = "ADMIN_MANAGER",
}
export enum UserStatusEnums {
  ACTIVE = "ACTIVE",
  DISABLED = "DISABLED",
  PENDING = "PENDING",
  NEVER_CONNECTED = "NEVER_CONNECTED",
  ARCHIVED = "ARCHIVED",
}
export enum StatusReportEnums {
  VALID = "VALID",
  PENDING = "PENDING",
  REJECTED = "REJECTED",
}
export enum StatusExpenseEnums {
  VALID = "VALID",
  UNDER_APPROVED = "UNDER_APPROVED",
  PENDING = "PENDING",
  REJECTED = "REJECTED",
  ACCOUNTING = "ACCOUNTING",
}
export enum UsersRolesEnums {
  USER = "Contributor",
  ADMIN = "Administrator",
  MANAGER = "Manager",
}
export enum UsersProfileStepEnums {
  INFORMATIONS = "INFORMATIONS",
  CHANGE_PASSWORD = "CHANGE_PASSWORD",
  RESET_PASSWORD = "RESET_PASSWORD",
  ADDRESS = "ADDRESS",
  DOCUMENT_ID_CARD = "DOCUMENT_ID_CARD",
  PAYMENT_PHONE = "PAYMENT_PHONE",
  PAYMENT_BANK = "PAYMENT_BANK",
  SETTING_CURRENCY = "SETTING_CURRENCY",
  SETTING_LANGUAGE = "SETTING_LANGUAGE",
}

export enum GenderEnums {
  MALE = "Male",
  FEMALE = "Female",
}

export enum FolderEnums {
  USER = "user",
  STAR = "star",
  TRASH = "trash-alt",
  ARCHIVE = "file-archive",
}

export enum LabelColorEnums {
  RED = "red",
  PINK = "pink",
  PURPLE = "purple",
  INDIGO = "indigo",
  BLUE = "blue",
  CYAN = "cyan",
  TEAL = "teal",
  GREEN = "green",
  LIME = "lime",
  YELLOw = "yellow",
  AMBER = "amber",
  ORANGE = "orange",
  BROWN = "brown",
  BREY = "grey",
  BLACK = "black",
}

export const VIEW_TYPE = {
  GRID: "grid",
  LIST: "list",
  CATEGORY: "category",
  SUBCATEGORY: "subcategory",
  SUPPORT: "support",
};

export enum DocumentTypeEnums {
  PDF = "PDF",
  PNG = "PNG",
  JPEG = "JPEG",
  JPG = "JPG",
}

export enum UserDocumentTypeEnums {
  CNI = "CNI",
  PASSPORT = "PASSPORT",
  RESIDENCE = "RESIDENCE",
  PAYMENT_IBAN = "PAYMENT_IBAN",
}

export enum CurrencyTypeEnums {
  FCFA = "Fcfa",
  EURO = "€",
  DOLLAR = "$",
}

// VARIABILES
export const GENDER_MALE = "Male";
export const GENDER_FEMALE = "Female";
export const FORMAT_DATE_ONE = "YYYY-MM-DD";
export const FORMAT_DATE_TWO = "HH:mm:ss";
export const FORMAT_DATE_THREE = "DD-MM-YYYY HH:mm:ss";
export const FORMAT_DATE_FOURTH = "DD-MM-YYYY";
export const MODE_ADD = "create";
export const MODE_VIEW = "view";
export const MODE_EDIT = "edit";
export const MODE_DELETE = "delete";
export const PREFIX_TAM_TAM = "TT-";
export const PREFIX_PERMISSION = "TT_";
export const PREFIX_PASSWORD = "Tam";
export const PAGE_SIZE_DEFAULT = 10;
export const EURO_TO_FCFA = 655; // 1€ -> 655Fcfa // TODO: Call direct the API to take the current value of the market
export const DOLLAR_TO_FCFA = 592; // 1$ -> 592Fcfa // TODO: Call direct the API to take the current value of the market
export const EURO_TO_DOLLAR = 1.11; // 1€ -> 1.11$  // TODO: Call direct the API to take the current value of the market
