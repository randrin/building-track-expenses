import AppIconButton from "@crema/components/AppIconButton";
import IntlMessages from "@crema/helpers/IntlMessages";
import { useAuthUser } from "@crema/hooks/AuthHooks";
import { CategoryType } from "@crema/types/models/dashboards/CategoryType";
import { Dropdown } from "antd";
import { ItemType } from "antd/es/menu/hooks/useItems";
import { useCategoryActionsContext } from "modules/apps/context/CategoryContextProvider";
import { useSupportHelpActionsContext } from "modules/apps/context/SupportHelpContextProvider";
import { useUtilContext } from "modules/apps/context/UtilContextProvider";
import { useEffect, useState } from "react";
import { CiCircleMore, CiEdit, CiTrash } from "react-icons/ci";
import { LuPower, LuPowerOff } from "react-icons/lu";
import { StatusEnums, VIEW_TYPE } from "utils/common-constants.utils";
import { PermissionEnums } from "utils/permissions.utils";

type Props = {
  category: CategoryType;
  type: string;
};

const CategoryActions = ({ category, type }: Props) => {
  // States
  const { handleOnGetCategory, handleOnEnabledOrDisabled, handleOnDelete } =
    useCategoryActionsContext();
  const {
    handleOnDeleteCategoryHelp,
    handleOnEnabledOrDisabledCategoryHelp,
    handleOnGetCategoryHelp,
  } = useSupportHelpActionsContext();
  const [permissionItems, setPermissionItems] = useState<ItemType[]>([]);

  // Destructing
  const { user } = useAuthUser();
  const { roles } = useUtilContext();

  // Init
  useEffect(() => {
    const items = [
      {
        key: 1,
        permission: PermissionEnums.ADD_CATEGORY,
        label: (
          <span style={{ fontSize: 14 }} className="tt-expenses-space-start">
            {category.status === StatusEnums.ACTIVE ? (
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
        permission: PermissionEnums.EDIT_CATEGORY,
        label: (
          <span style={{ fontSize: 14 }} className="tt-expenses-space-start">
            <CiEdit className="tt-expenses-secondary tt-expenses-margin-btn-icon" />
            <IntlMessages id="common.edit" />
          </span>
        ),
      },
      {
        key: 3,
        permission: PermissionEnums.DELETE_CATEGORY,
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
  }, [user, roles, category]);

  // Functions
  const onMenuClick = ({ item, key }: { item: any; key: string }) => {
    switch (key) {
      case "1":
        type === VIEW_TYPE.CATEGORY
          ? handleOnEnabledOrDisabled(category._id)
          : handleOnEnabledOrDisabledCategoryHelp(category._id);
        break;
      case "2":
        type === VIEW_TYPE.CATEGORY
          ? handleOnGetCategory(category)
          : handleOnGetCategoryHelp(category);
        break;
      case "3":
        type === VIEW_TYPE.CATEGORY
          ? handleOnDelete(category._id)
          : handleOnDeleteCategoryHelp(category._id);
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
export default CategoryActions;
