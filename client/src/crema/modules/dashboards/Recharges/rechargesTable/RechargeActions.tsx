import AppIconButton from "@crema/components/AppIconButton";
import IntlMessages from "@crema/helpers/IntlMessages";
import { useAuthUser } from "@crema/hooks/AuthHooks";
import { RechargeType } from "@crema/types/models/dashboards/RechargeType";
import { Dropdown } from "antd";
import { ItemType } from "antd/es/menu/hooks/useItems";
import { useRechargeActionsContext } from "modules/apps/context/RechargeContextProvider";
import { useUtilContext } from "modules/apps/context/UtilContextProvider";
import { useEffect, useState } from "react";
import { CiCircleMore, CiEdit, CiTrash } from "react-icons/ci";
import { StatusEnums } from "utils/common-constants.utils";
import { PermissionEnums } from "utils/permissions.utils";

type Props = {
    recharge: RechargeType;
};

const RechargeActions = ({ recharge }: Props) => {
  // States
  const { handleOnGetRecharge, handleOnDelete } =
    useRechargeActionsContext();
  const [permissionItems, setPermissionItems] = useState<ItemType[]>([]);

  // Init
  // Destructing
  const { user } = useAuthUser();
  const { roles } = useUtilContext();

  // Init
  useEffect(() => {
    const items = [
      {
        key: 1,
        permission: PermissionEnums.EDIT_RECHARGE,
        label: (
          <span style={{ fontSize: 14 }} className="tt-expenses-space-start">
            <CiEdit className="tt-expenses-secondary tt-expenses-margin-btn-icon" />
            <IntlMessages id="common.edit" />
          </span>
        ),
      },
      {
        key: 2,
        permission: PermissionEnums.DELETE_RECHARGE,
        label: (
          <span style={{ fontSize: 14 }} className="tt-expenses-space-start">
            <CiTrash className="tt-expenses-tomato tt-expenses-margin-btn-icon" />
            <IntlMessages id="common.delete" />
          </span>
        ),
      },
    ];
    setPermissionItems(
      items.filter((item) =>
        roles
          ?.find((role) => role.title === user.role)
          .permissions.some(
            (per) =>
              per.code === item.permission && per.status === StatusEnums.ACTIVE
          )
      )
    );
  }, [user, roles, recharge]);

  // Functions
  const onMenuClick = ({ item, key }: { item: any; key: string }) => {
    switch (key) {
      case "1":
        handleOnGetRecharge(recharge);
        break;
      case "2":
        handleOnDelete(recharge._id);
        break;
      default:
        break;
    }
  };

  // Render
  return (
    <Dropdown menu={{ items: permissionItems, onClick: onMenuClick }} trigger={["click"]}>
      <AppIconButton icon={<CiCircleMore />} />
    </Dropdown>
  );
};
export default RechargeActions;
