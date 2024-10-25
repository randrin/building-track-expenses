import { useAuthUser } from "@crema/hooks/AuthHooks";
import { useUtilContext } from "modules/apps/context/UtilContextProvider";
import { StatusEnums } from "utils/common-constants.utils";

interface Props {
  permission: string;
  component: any;
}

const SecuredPermission = ({ permission, component }: Props) => {
  // States
  const { user } = useAuthUser();
  const { roles } = useUtilContext();

  // Render
  if (
    user &&
    roles
      ?.find((role) => role.title === user.role)
      .permissions.find(
        (per) => per.code === permission && per.status === StatusEnums.ACTIVE
      )
  ) {
    return { ...component };
  } else {
    return null;
  }
};

export default SecuredPermission;
