import asyncComponent from "@crema/components/AppAsyncComponent";
import AppPage from "@crema/core/AppLayout/AppPage";
import RechargeContextProvider from "modules/apps/context/RechargeContextProvider";
import UserContextProvider from "modules/apps/context/UserContextProvider";

const Movements = asyncComponent(
  () => import("../../modules/dashboards/movements")
);
export default AppPage(() => (
  <RechargeContextProvider>
    <UserContextProvider>
      <Movements />
    </UserContextProvider>
  </RechargeContextProvider>
));
