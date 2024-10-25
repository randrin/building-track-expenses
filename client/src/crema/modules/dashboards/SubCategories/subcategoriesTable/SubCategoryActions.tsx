import AppIconButton from "@crema/components/AppIconButton";
import IntlMessages from "@crema/helpers/IntlMessages";
import { useAuthUser } from "@crema/hooks/AuthHooks";
import { SubCategoryType } from "@crema/types/models/dashboards/SubCategoryType";
import { Dropdown } from "antd";
import { ItemType } from "antd/es/menu/hooks/useItems";
import { useSubCategoryActionsContext } from "modules/apps/context/SubCategoryContextProvider";
import { useSubjectActionsContext } from "modules/apps/context/SubjectHelpContextProvider";
import { useUtilContext } from "modules/apps/context/UtilContextProvider";
import { useEffect, useState } from "react";
import { CiCircleMore, CiEdit, CiTrash } from "react-icons/ci";
import { LuPower, LuPowerOff } from "react-icons/lu";
import { StatusEnums, VIEW_TYPE } from "utils/common-constants.utils";
import { PermissionEnums } from "utils/permissions.utils";

type Props = {
  subCategory: SubCategoryType;
  type: string;
};

const SubCategoryActions = ({ subCategory, type }: Props) => {
  // States
  const { handleOnGetSubCategory, handleOnEnabledOrDisabled, handleOnDelete } =
    useSubCategoryActionsContext();
  const {
    handleOnGetSubject,
    handleOnEnabledOrDisabledSubject,
    handleOnDeleteSubject,
  } = useSubjectActionsContext();
  const [permissionItems, setPermissionItems] = useState<ItemType[]>([]);

  // Destructing
  const { user } = useAuthUser();
  const { roles } = useUtilContext();

  // Init
  useEffect(() => {
    const items = [
      {
        key: 1,
        permission: PermissionEnums.ADD_SUB_CATEGORY,
        label: (
          <span style={{ fontSize: 14 }} className="tt-expenses-space-start">
            {subCategory.status === "ACTIVE" ? (
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
        permission: PermissionEnums.EDIT_SUB_CATEGORY,
        label: (
          <span style={{ fontSize: 14 }} className="tt-expenses-space-start">
            <CiEdit className="tt-expenses-secondary tt-expenses-margin-btn-icon" />{" "}
            <IntlMessages id="common.edit" />
          </span>
        ),
      },
      {
        key: 3,
        permission: PermissionEnums.DELETE_SUB_CATEGORY,
        label: (
          <span style={{ fontSize: 14 }} className="tt-expenses-space-start">
            <CiTrash className="tt-expenses-tomato tt-expenses-margin-btn-icon" />{" "}
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
  }, [user, roles, subCategory]);

  // Functions
  const onMenuClick = ({ item, key }: { item: any; key: string }) => {
    switch (key) {
      case "1":
        type === VIEW_TYPE.SUBCATEGORY
          ? handleOnEnabledOrDisabled(subCategory._id)
          : handleOnEnabledOrDisabledSubject(subCategory._id);
        break;
      case "2":
        type === VIEW_TYPE.SUBCATEGORY
          ? handleOnGetSubCategory(subCategory)
          : handleOnGetSubject(subCategory);
        break;
      case "3":
        type === VIEW_TYPE.SUBCATEGORY
          ? handleOnDelete(subCategory._id)
          : handleOnDeleteSubject(subCategory._id);
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
export default SubCategoryActions;
