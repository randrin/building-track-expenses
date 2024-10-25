import asyncComponent from "@crema/components/AppAsyncComponent";
import AppPage from "@crema/core/AppLayout/AppPage";
import FaqContextProvider from "modules/apps/context/FaqContextProvider";
import { SubFaqContextProvider } from "modules/apps/context/SubFaqContextProvider";

const PublicFaqs = asyncComponent(
  () => import("../../../modules/dashboards/faqs")
);
export default AppPage(() => (
  <FaqContextProvider>
    <SubFaqContextProvider>
      <PublicFaqs />
    </SubFaqContextProvider>
  </FaqContextProvider>
));
