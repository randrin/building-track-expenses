import asyncComponent from "@crema/components/AppAsyncComponent";
import AppPage from "@crema/core/AppLayout/AppPage";
import FaqContextProvider from "modules/apps/context/FaqContextProvider";

const Faqs = asyncComponent(
  () => import("../../../../modules/dashboards/faqs/parent")
);
export default AppPage(() => (
  <FaqContextProvider>
    <Faqs />
  </FaqContextProvider>
));
