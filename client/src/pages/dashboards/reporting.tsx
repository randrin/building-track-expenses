import React from "react";
import AppPage from "@crema/core/AppLayout/AppPage";
import asyncComponent from "@crema/components/AppAsyncComponent";
import ReportingContextProvider from "modules/apps/context/ReportingContectProvider";

const Reporting = asyncComponent(
  () => import("../../modules/dashboards/reporting")
);
export default AppPage(() => (
  <ReportingContextProvider>
    <Reporting />
  </ReportingContextProvider>
));
