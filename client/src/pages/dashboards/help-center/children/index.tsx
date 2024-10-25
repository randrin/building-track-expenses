import AppAsyncComponent from "@crema/components/AppAsyncComponent";
import AppPage from "@crema/core/AppLayout/AppPage";
import { SubjectHelpContextProvider } from "modules/apps/context/SubjectHelpContextProvider";

const SubCatgoriesSupport = AppAsyncComponent(
  () => import("../../../../modules/dashboards/support-tickets/children")
);
export default AppPage(() => (
  <SubjectHelpContextProvider>
    <SubCatgoriesSupport />
  </SubjectHelpContextProvider>
));
