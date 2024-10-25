import asyncComponent from "@crema/components/AppAsyncComponent";
import AppPage from "@crema/core/AppLayout/AppPage";
import OrganizationContextProvider from "modules/apps/context/OrganizationContextProvider";

const Organisations = asyncComponent(
  () => import("../../../modules/dashboards/organisations")
);
export default AppPage(() => (
  <OrganizationContextProvider>
      <Organisations />
  </OrganizationContextProvider>
));
