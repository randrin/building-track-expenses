import { useGetDataApi } from "@crema/hooks/APIHooks";
import { CategoryType } from "@crema/types/models/dashboards/CategoryType";
import { DashboardType } from "@crema/types/models/dashboards/DashboardType";
import { ExpenseType } from "@crema/types/models/dashboards/ExpenseType";
import { OrganizationType } from "@crema/types/models/dashboards/OrganizationType";
import { ReportType } from "@crema/types/models/dashboards/ReportType";
import { SubCategoryType } from "@crema/types/models/dashboards/SubCategoryType";
import { UserType } from "@crema/types/models/dashboards/UserType";
import { TAM_BACK_OFFICE_URL } from "utils/end-points.utils";
import { ReactNode, createContext, useContext } from "react";
import { RoleType } from "@crema/types/models/dashboards/RoleType";
import { ContactType } from "@crema/types/models/dashboards/ContactType";
import {
  DashboardTicketType,
  TicketType,
} from "@crema/types/models/dashboards/TicketType";

export type DashboardContextType = {
  organizations: OrganizationType[];
  users: UserType[];
  roles: RoleType[];
  categories: CategoryType[];
  expenses: ExpenseType[];
  pendingExpenses: ExpenseType[];
  reports: ReportType[];
  subcategories: SubCategoryType[];
  contacts: ContactType[];
  loading: boolean;
  tickets: DashboardTicketType;
};

const ContextState: DashboardContextType = {
  organizations: [],
  users: [],
  roles: [],
  categories: [],
  expenses: [],
  pendingExpenses: [],
  reports: [],
  subcategories: [],
  contacts: [],
  loading: false,
  tickets: {
    total: 0,
    closedTicketsTotal: [],
    lastOpenTickets: [],
    openTicketsTotal: [],
    resolvedTicketsTotal: [],
  },
};

export type DashboardActionContextType = {
  reCallAPI: () => void;
};

const DashboardContext = createContext<DashboardContextType>(ContextState);
const DashboardActionsContext = createContext<DashboardActionContextType>({
  reCallAPI: () => {},
});

export const useDashboardContext = () => useContext(DashboardContext);
export const useDashboardActionsContext = () =>
  useContext(DashboardActionsContext);

type Props = {
  children: ReactNode;
};

export const DashboardContextProvider = ({ children }: Props) => {
  // States
  const [{ apiData, loading }, { setQueryParams, reCallAPI }] = useGetDataApi<{
    data: DashboardType;
  }>(TAM_BACK_OFFICE_URL);

  // Render
  return (
    <DashboardContext.Provider
      value={{
        categories: apiData?.data.categories,
        expenses: apiData?.data.expenses,
        pendingExpenses: apiData?.data.pendingExpenses,
        reports: apiData?.data.reports,
        contacts: apiData?.data.contacts,
        loading,
        organizations: apiData?.data.organizations,
        subcategories: apiData?.data.subcategories,
        users: apiData?.data.users,
        roles: apiData?.data.roles,
        tickets: apiData?.data.tickets,
      }}
    >
      <DashboardActionsContext.Provider value={{ reCallAPI }}>
        {children}
      </DashboardActionsContext.Provider>
    </DashboardContext.Provider>
  );
};

export default DashboardContextProvider;
