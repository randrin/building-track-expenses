import { useGetDataApi } from "@crema/hooks/APIHooks";
import { CategoryType } from "@crema/types/models/dashboards/CategoryType";
import { ContactType } from "@crema/types/models/dashboards/ContactType";
import { DashboardType } from "@crema/types/models/dashboards/DashboardType";
import { ExpenseType } from "@crema/types/models/dashboards/ExpenseType";
import { OrganizationType } from "@crema/types/models/dashboards/OrganizationType";
import { ReportType } from "@crema/types/models/dashboards/ReportType";
import { RoleType } from "@crema/types/models/dashboards/RoleType";
import { SubCategoryType } from "@crema/types/models/dashboards/SubCategoryType";
import { UserType } from "@crema/types/models/dashboards/UserType";
import { ReactNode, createContext, useContext } from "react";
import { TAM_REPORTING_URL } from "utils/end-points.utils";

export type ReportingContextType = {
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
};

const ContextState: ReportingContextType = {
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
};

export type ReportingActionContextType = {
  reCallAPI: () => void;
};

const ReportingContext = createContext<ReportingContextType>(ContextState);
const ReportingActionsContext = createContext<ReportingActionContextType>({
  reCallAPI: () => {},
});

export const useReportingContext = () => useContext(ReportingContext);
export const useReportingActionsContext = () =>
  useContext(ReportingActionsContext);

type Props = {
  children: ReactNode;
};

export const ReportingContextProvider = ({ children }: Props) => {
  // States
  const [{ apiData, loading }, { setQueryParams, reCallAPI }] = useGetDataApi<{
    data: DashboardType;
  }>(TAM_REPORTING_URL);

  // Render
  return (
    <ReportingContext.Provider
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
      }}
    >
      <ReportingActionsContext.Provider value={{ reCallAPI }}>
        {children}
      </ReportingActionsContext.Provider>
    </ReportingContext.Provider>
  );
};

export default ReportingContextProvider;
