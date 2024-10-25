import AppAsyncComponent from "@crema/components/AppAsyncComponent";
import AppPage from "@crema/core/AppLayout/AppPage";
import SupportHelpContextProvider from "modules/apps/context/SupportHelpContextProvider";

const TicketSupport = AppAsyncComponent(
  () => import("../../../modules/dashboards/support-tickets")
);
export default AppPage(() => (
  <SupportHelpContextProvider>
    <TicketSupport />
  </SupportHelpContextProvider>
));
