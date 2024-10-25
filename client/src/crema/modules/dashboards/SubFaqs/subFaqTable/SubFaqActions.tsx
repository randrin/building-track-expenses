import AppIconButton from "@crema/components/AppIconButton";
import IntlMessages from "@crema/helpers/IntlMessages";
import { useAuthUser } from "@crema/hooks/AuthHooks";
import { SubFaqType } from "@crema/types/models/dashboards/SubFaqType";
import { Dropdown } from "antd";
import { ItemType } from "antd/es/menu/hooks/useItems";
import { useSubFaqActionsContext } from "modules/apps/context/SubFaqContextProvider";
import { useUtilContext } from "modules/apps/context/UtilContextProvider";
import { useEffect, useState } from "react";
import { CiCircleMore, CiEdit, CiTrash } from "react-icons/ci";
import { LuPower, LuPowerOff } from "react-icons/lu";
import { StatusEnums } from "utils/common-constants.utils";
import { PermissionEnums } from "utils/permissions.utils";

type Props = {
  subFaq: SubFaqType;
};

const SubFaqActions = ({ subFaq }: Props) => {
  // States
  const { handleOnGetSubFaq, handleOnEnabledOrDisabled, handleOnDelete } =
    useSubFaqActionsContext();
  const [permissionItems, setPermissionItems] = useState<ItemType[]>([]);

  // Destructing
  const { user } = useAuthUser();
  const { roles } = useUtilContext();

  // Init
  useEffect(() => {
    const items = [
      {
        key: 1,
        permission: PermissionEnums.ADD_FAQ,
        label: (
          <span style={{ fontSize: 14 }} className="tt-expenses-space-start">
            {subFaq.status === StatusEnums.ACTIVE ? (
              <>
                <LuPowerOff className="tt-expenses-tomato tt-expenses-margin-btn-icon" />{" "}
                <IntlMessages id="common.disable" />
              </>
            ) : (
              <>
                <LuPower className="tt-expenses-success tt-expenses-margin-btn-icon" />{" "}
                <IntlMessages id="common.enable" />
              </>
            )}
          </span>
        ),
      },
      {
        key: 2,
        permission: PermissionEnums.EDIT_FAQ,
        label: (
          <span style={{ fontSize: 14 }} className="tt-expenses-space-start">
            <CiEdit className="tt-expenses-secondary tt-expenses-margin-btn-icon" />
            <IntlMessages id="common.edit" />
          </span>
        ),
      },
      {
        key: 3,
        permission: PermissionEnums.DELETE_FAQ,
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
  }, [user, roles, subFaq]);

  // Functions
  const onMenuClick = ({ item, key }: { item: any; key: string }) => {
    switch (key) {
      case "1":
        handleOnEnabledOrDisabled(subFaq._id);
        break;
      case "2":
        handleOnGetSubFaq(subFaq);
        break;
      case "3":
        handleOnDelete(subFaq._id);
        break;
      default:
        break;
    }
  };

  // Render
  return (
    <Dropdown
      menu={{ items: permissionItems, onClick: onMenuClick }}
      trigger={["click"]}
    >
      <AppIconButton icon={<CiCircleMore />} />
    </Dropdown>
  );
};
export default SubFaqActions;
