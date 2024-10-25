import { CategoryType } from "./CategoryType";
import { ContactType } from "./ContactType";
import { ExpenseType } from "./ExpenseType";
import { OrganizationType } from "./OrganizationType";
import { ReportType } from "./ReportType";
import { RoleType } from "./RoleType";
import { SubCategoryType } from "./SubCategoryType";
import { DashboardTicketType, TicketType } from "./TicketType";
import { UserType } from "./UserType";

export type DashboardType = {
  users: UserType[];
  roles: RoleType[];
  organizations: OrganizationType[];
  categories: CategoryType[];
  subcategories: SubCategoryType[];
  expenses: ExpenseType[];
  pendingExpenses: ExpenseType[];
  reports: ReportType[];
  contacts: ContactType[];
  tickets: DashboardTicketType;
};
