import React from "react";
import AppPage from "@crema/core//AppLayout/AppPage";
import asyncComponent from "@crema/components/AppAsyncComponent";
import OrganizationContextProvider from "modules/apps/context/OrganizationContextProvider";
import DepartmentContextProvider from "modules/apps/context/DepartmentContextProvider";

const Account = asyncComponent(() => import("../modules/account/MyProfile"));
export default AppPage(() => (
  <OrganizationContextProvider>
    <DepartmentContextProvider>
      <Account />
    </DepartmentContextProvider>
  </OrganizationContextProvider>
));
