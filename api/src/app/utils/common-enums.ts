export enum StatusEnums {
  ACTIVE = 'ACTIVE',
  DISABLED = 'DISABLED',
  PENDING = 'PENDING',
}
export enum TicketEnums {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  RESOLVED = 'RESOLVED',
}
export enum TicketTypeEnums {
  USER = 'USER',
  ADMIN_MANAGER = 'ADMIN_MANAGER',
}
export enum UserStatusEnums {
  ACTIVE = 'ACTIVE',
  DISABLED = 'DISABLED',
  PENDING = 'PENDING',
  NEVER_CONNECTED = 'NEVER_CONNECTED',
  ARCHIVED = 'ARCHIVED',
}
export enum StatusExpenseEnums {
  VALID = 'VALID',
  UNDER_APPROVED = 'UNDER_APPROVED',
  ACCOUNTING = 'ACCOUNTING',
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
}
export enum TypeExpenseEnums {
  COMMENT = 'COMMENT',
  REJECT = 'REJECT',
}
export enum CountryEnums {
  CMR = 'Afrique (FCFA)',
  AMR = 'Amérique ($)',
  EUR = 'Europe (€)',
}

export enum CurrencyEnums {
  FCFA = 'Fcfa',
  DOLLAR = '$',
  EURO = '€',
}

export enum UserRolesEnums {
  ADMIN = 'Administrator',
  CUSTOMER = 'Customer',
  WORKER = "Worker",
  SITE_MANAGER = "Site Manager",
  MANAGER = "Manager",
}

export enum GenderEnums {
  MALE = 'Male',
  FEMALE = 'Female',
}

export enum YesNoEnums {
  YES = 'Yes',
  NO = 'No',
}

export enum UsersProfileStepEnums {
  INFORMATIONS = 'INFORMATIONS',
  RESET_PASSWORD = 'RESET_PASSWORD',
  CHANGE_PASSWORD = 'CHANGE_PASSWORD',
  ADDRESS = 'ADDRESS',
  PAYMENT_PHONE = 'PAYMENT_PHONE',
  PAYMENT_BANK = 'PAYMENT_BANK',
  SETTING_CURRENCY = 'SETTING_CURRENCY',
  SETTING_LANGUAGE = 'SETTING_LANGUAGE',
}

export enum UserDocumentTypeEnums {
  CNI = 'CNI',
  PASSPORT = 'PASSPORT',
  RESIDENCE = 'RESIDENCE',
  PAYMENT_IBAN = 'PAYMENT_IBAN',
}
