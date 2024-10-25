import { useAuthUser } from "@crema/hooks/AuthHooks";
import { useRouter } from "next/router";
import { ComponentType, useEffect } from "react";
import { UsersRolesEnums } from "utils/common-constants.utils";

const AdminManagerPermission = (Component: ComponentType) => {
  return function ProtectedRoute({ ...props }) {
    const { user } = useAuthUser();
    const { push } = useRouter();

    useEffect(() => {
      if (user && user.role === UsersRolesEnums.USER) {
        push(`/dashboards/reporting`);
      }
    }, [user]);

    return <Component {...props} />;
  };
};

export default AdminManagerPermission;
