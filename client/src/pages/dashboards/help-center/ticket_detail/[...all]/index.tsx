import AppAsyncComponent from "@crema/components/AppAsyncComponent";
import AppPage from "@crema/core/AppLayout/AppPage";
import SupportHelpContextProvider from "modules/apps/context/SupportHelpContextProvider";

const TicketDetail = AppAsyncComponent(
  () => import("../../../../../modules/dashboards/support-tickets/ticket_detail")
);
export default AppPage(() => (
  <SupportHelpContextProvider>
      <TicketDetail />
  </SupportHelpContextProvider>
));
