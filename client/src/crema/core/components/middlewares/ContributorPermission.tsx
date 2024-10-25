import { useAuthUser } from "@crema/hooks/AuthHooks";
import { useRouter } from "next/router";
import { ComponentType, useEffect } from "react";
import { UsersRolesEnums } from "utils/common-constants.utils";

const ContributorPermission = (Component: ComponentType) => {
  return function ProtectedRoute({ ...props }) {
    const { user } = useAuthUser();
    const { push } = useRouter();

    useEffect(() => {
      if (user && user.role !== UsersRolesEnums.USER) {
        push(`/dashboards/home`);
      }
    }, [user]);

    return <Component {...props} />;
  };
};

export default ContributorPermission;
