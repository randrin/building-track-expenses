import asyncComponent from "@crema/components/AppAsyncComponent";
import AppPage from "@crema/core/AppLayout/AppPage";
import { SubFaqContextProvider } from "modules/apps/context/SubFaqContextProvider";

const SubFaqs = asyncComponent(
  () => import("../../../../modules/dashboards/faqs/children")
);
export default AppPage(() => (
  <SubFaqContextProvider>
    <SubFaqs />
  </SubFaqContextProvider>
));
