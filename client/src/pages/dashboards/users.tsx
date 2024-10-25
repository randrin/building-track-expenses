import React from "react";
import AppPage from "@crema/core/AppLayout/AppPage";
import asyncComponent from "@crema/components/AppAsyncComponent";
import UserContextProvider from "modules/apps/context/UserContextProvider";
import OrganizationContextProvider from "modules/apps/context/OrganizationContextProvider";
import RoleContextProvider from "modules/apps/context/RoleContextProvider";
import DepartmentContextProvider from "modules/apps/context/DepartmentContextProvider";

const Users = asyncComponent(() => import("../../modules/dashboards/users"));
export default AppPage(() => (
  <OrganizationContextProvider>
    <DepartmentContextProvider>
      <RoleContextProvider>
        <UserContextProvider>
          <Users />
        </UserContextProvider>
      </RoleContextProvider>
    </DepartmentContextProvider>
  </OrganizationContextProvider>
));
