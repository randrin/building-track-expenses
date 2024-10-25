import AppAsyncComponent from "@crema/components/AppAsyncComponent";
import AppPage from "@crema/core/AppLayout/AppPage";
import SupportHelpContextProvider from "modules/apps/context/SupportHelpContextProvider";

const CatgoriesSupport = AppAsyncComponent(
  () => import("../../../../modules/dashboards/support-tickets/parent")
);
export default AppPage(() => (
  <SupportHelpContextProvider>
    <CatgoriesSupport />
  </SupportHelpContextProvider>
));
