import asyncComponent from "@crema/components/AppAsyncComponent";
import AppPage from "@crema/core/AppLayout/AppPage";
import { DepartmentContextProvider } from "modules/apps/context/DepartmentContextProvider";
import OrganizationContextProvider from "modules/apps/context/OrganizationContextProvider";
import UserContextProvider from "modules/apps/context/UserContextProvider";

const SubOrganisations = asyncComponent(
  () => import("../../../../../modules/dashboards/organisations/deparments")
);
export default AppPage(() => (
  <DepartmentContextProvider>
    <OrganizationContextProvider>
      <UserContextProvider>
        <SubOrganisations />
      </UserContextProvider>
    </OrganizationContextProvider>
  </DepartmentContextProvider>
));
