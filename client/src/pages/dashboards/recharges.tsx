import asyncComponent from "@crema/components/AppAsyncComponent";
import AppPage from "@crema/core/AppLayout/AppPage";
import RechargeContextProvider from "modules/apps/context/RechargeContextProvider";
import UserContextProvider from "modules/apps/context/UserContextProvider";

const Recharges = asyncComponent(
  () => import("../../modules/dashboards/recharges")
);
export default AppPage(() => (
  <RechargeContextProvider>
    <UserContextProvider>
      <Recharges />
    </UserContextProvider>
  </RechargeContextProvider>
));
