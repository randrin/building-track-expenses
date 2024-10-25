import AppAsyncComponent from "@crema/components/AppAsyncComponent";
import AppPage from "@crema/core/AppLayout/AppPage";
import { SubjectHelpContextProvider } from "modules/apps/context/SubjectHelpContextProvider";
import SupportHelpContextProvider from "modules/apps/context/SupportHelpContextProvider";

const TicketCreate = AppAsyncComponent(
  () => import("../../../../modules/dashboards/support-tickets/ticket_create")
);
export default AppPage(() => (
  <SupportHelpContextProvider>
    <SubjectHelpContextProvider>
      <TicketCreate />
    </SubjectHelpContextProvider>
  </SupportHelpContextProvider>
));
