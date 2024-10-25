import AppIconButton from "@crema/components/AppIconButton";
import IntlMessages from "@crema/helpers/IntlMessages";
import { useAuthUser } from "@crema/hooks/AuthHooks";
import {
  Alert,
  Avatar,
  Button,
  Col,
  Drawer,
  Dropdown,
  Row,
  Select,
  Space,
  Tooltip,
  Typography,
} from "antd";
import { ItemType } from "antd/es/menu/hooks/useItems";
import {
  useDepartmentActionsContext,
  useDepartmentContext,
} from "modules/apps/context/DepartmentContextProvider";
import { useUserContext } from "modules/apps/context/UserContextProvider";
import { useUtilContext } from "modules/apps/context/UtilContextProvider";
import { StyledRequiredField } from "modules/dashboards/index.styled";
import { useEffect, useState } from "react";
import { AiOutlineUserSwitch } from "react-icons/ai";
import { CiCircleMore, CiEdit, CiTrash } from "react-icons/ci";
import { IoReturnUpBackOutline } from "react-icons/io5";
import { LuCheckCircle, LuPowerOff } from "react-icons/lu";
import { VscEye } from "react-icons/vsc";
import {
  FORMAT_DATE_THREE,
  MODE_EDIT,
  StatusEnums,
  UsersRolesEnums,
  UserStatusEnums,
} from "utils/common-constants.utils";
import { Tt_DateFormat, Tt_GetUserAvatar } from "utils/common-functions.utils";
import { PermissionEnums } from "utils/permissions.utils";
import { StyledText, StyledUserInfoAvatar } from "../../index.styled";
import { useRouter } from "next/router";

const DepartmentActions = ({ department }) => {
  // States
  const { isAppDrawerOpen } = useDepartmentContext();
  const {
    handleOnGetDepartmentById,
    handleOnEnabledOrDisabled,
    handleOnDelete,
    handleOnAddUsersToDepartment,
    setMode,
    setAppDrawerOpen,
  } = useDepartmentActionsContext();
  const { users } = useUserContext();
  const [isAppDrawerViewOpen, setAppDrawerViewOpen] = useState(false);
  const [isAppDrawerAddOpen, setAppDrawerAddOpen] = useState(false);
  const [userDepartments, setUserDepartments] = useState([]);
  const [permissionItems, setPermissionItems] = useState<ItemType[]>([]);
  const { query } = useRouter();
  const { all } = query;

  // Destructing
  const { Option } = Select;

  // Init
  useEffect(() => {
    setUserDepartments(
      department.contributors
        .filter((user) => user.role === UsersRolesEnums.USER)
        .map((user) => user._id)
    );
  }, []);

  const DescriptionItem = ({ title, content }) => (
    <div className="site-description-item-profile-wrapper">
      <p className="site-description-item-profile-p-label">
        <b>{title}</b>:
      </p>
      {content}
    </div>
  );

  // Destructing
  const { user } = useAuthUser();
  const { roles } = useUtilContext();

  // Init
  useEffect(() => {
    const items = [
      {
        key: 1,
        permission: PermissionEnums.VIEW_ORGANIZATION,
        label: (
          <span style={{ fontSize: 14 }} className="tt-expenses-space-start">
            <VscEye className="tt-expenses-primary tt-expenses-margin-btn-icon" />{" "}
            <IntlMessages id="common.view" />
          </span>
        ),
      },
      {
        key: 2,
        permission: PermissionEnums.EDIT_ORGANIZATION,
        label: (
          <span style={{ fontSize: 14 }} className="tt-expenses-space-start">
            <CiEdit className="tt-expenses-secondary tt-expenses-margin-btn-icon" />
            <IntlMessages id="common.edit" />
          </span>
        ),
      },
      {
        key: 3,
        permission: PermissionEnums.VIEW_USERS,
        label: (
          <span style={{ fontSize: 14 }} className="tt-expenses-space-start">
            <AiOutlineUserSwitch className="tt-expenses-default tt-expenses-margin-btn-icon" />{" "}
            <IntlMessages id="common.users" />
          </span>
        ),
      },
      {
        key: 4,
        permission: PermissionEnums.ADD_ORGANIZATION,
        label: (
          <span style={{ fontSize: 14 }} className="tt-expenses-space-start">
            {department.status === StatusEnums.ACTIVE ? (
              <>
                <LuPowerOff className="tt-expenses-tomato tt-expenses-margin-btn-icon" />{" "}
                <IntlMessages id="common.disable" />
              </>
            ) : (
              <>
                <LuPowerOff className="tt-expenses-success tt-expenses-margin-btn-icon" />{" "}
                <IntlMessages id="common.enable" />
              </>
            )}
          </span>
        ),
      },
      {
        key: 5,
        permission: PermissionEnums.DELETE_ORGANIZATION,
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
  }, [user, roles, department]);

  console.log(department);

  // Functions
  const onMenuClick = ({ item, key }: { item: any; key: string }) => {
    switch (key) {
      case "1":
        setAppDrawerViewOpen(!isAppDrawerViewOpen);
        break;
      case "2":
        setMode(MODE_EDIT);
        setAppDrawerOpen(!isAppDrawerOpen);
        handleOnGetDepartmentById(department._id);
        break;
      case "3":
        setAppDrawerAddOpen(!isAppDrawerAddOpen);
        break;
      case "4":
        handleOnEnabledOrDisabled(department._id);
        break;
      case "5":
        handleOnDelete(all[0], department._id);
        break;
      default:
        break;
    }
  };

  // Render
  return (
    <>
      <Dropdown
        menu={{ items: permissionItems, onClick: onMenuClick }}
        trigger={["click"]}
      >
        <AppIconButton icon={<CiCircleMore />} />
      </Dropdown>
      {/* View Department */}
      <Drawer
        title={<IntlMessages id="dashboard.department.view" />}
        placement={"right"}
        open={isAppDrawerViewOpen}
        onClose={() => setAppDrawerViewOpen(!isAppDrawerViewOpen)}
        footer={
          <Space>
            <Button
              key="back"
              onClick={() => setAppDrawerViewOpen(!isAppDrawerViewOpen)}
              className="tt-expenses-space-center"
            >
              <IoReturnUpBackOutline className="tt-expenses-margin-btn-icon" />{" "}
              <IntlMessages id="common.back" />
            </Button>
          </Space>
        }
      >
        <Row>
          <Col xs={24} lg={24} className="tt-expenses-space-center pb-15">
            <Avatar
              style={{
                marginRight: 14,
                width: 80,
                height: 80,
              }}
              src={
                department.logo?.secure_url
                  ? department.logo?.secure_url
                  : "/assets/icon/default-org.jpg"
              }
            />
          </Col>
          <Col xs={24} lg={24}>
            <DescriptionItem
              title={<IntlMessages id="common.name" />}
              content={department.name}
            />
          </Col>
          <Col xs={24} lg={24}>
            <DescriptionItem
              title={<IntlMessages id="common.code" />}
              content={department.code}
            />
          </Col>
          <Col xs={24} lg={24}>
            <DescriptionItem
              title={<IntlMessages id="common.description" />}
              content={department.description}
            />
          </Col>
          <Col xs={24} lg={24}>
            <DescriptionItem
              title={<IntlMessages id="common.role.manager" />}
              content={department.manager.displayName}
            />
          </Col>
          <Col xs={24} lg={24}>
            <DescriptionItem
              title={<IntlMessages id="common.createdAt" />}
              content={Tt_DateFormat(department.createdAt, FORMAT_DATE_THREE)}
            />
          </Col>
          <Col xs={24} lg={24}>
            <DescriptionItem
              title={<IntlMessages id="common.createdBy" />}
              content={department.createdBy.displayName}
            />
          </Col>
          <Col xs={24} lg={24}>
            <DescriptionItem
              title={<IntlMessages id="common.number.users" />}
              content={department.contributors.length}
            />
            <Avatar.Group>
              {department.contributors.map((data, index) => (
                <>
                  <Tooltip
                    placement="topLeft"
                    title={data.displayName}
                    className="tt-expenses-cursor-pointer"
                  >
                    {data.photoURL ? (
                      <Avatar
                        size={45}
                        key={"member-" + index}
                        alt={data.displayName}
                        src={data.photoURL?.secure_url}
                      />
                    ) : (
                      <StyledUserInfoAvatar photoRGA={data?.photoRGA}>
                        {Tt_GetUserAvatar(data)}
                      </StyledUserInfoAvatar>
                    )}
                  </Tooltip>
                </>
              ))}
            </Avatar.Group>
          </Col>
        </Row>
      </Drawer>
      {/* Add Contributors to department*/}
      <Drawer
        title={<IntlMessages id="dashboard.department.add.user" />}
        placement={"right"}
        open={isAppDrawerAddOpen}
        onClose={() => setAppDrawerAddOpen(!isAppDrawerAddOpen)}
        footer={
          <Space>
            <Button
              key="back"
              onClick={() => setAppDrawerAddOpen(!isAppDrawerAddOpen)}
              className="tt-expenses-space-center"
            >
              <IoReturnUpBackOutline className="tt-expenses-margin-btn-icon" />{" "}
              <IntlMessages id="common.back" />
            </Button>
            ,
            <Button
              type="primary"
              className="tt-expenses-space-center"
              onClick={() => {
                handleOnAddUsersToDepartment(department._id, userDepartments);
                setAppDrawerAddOpen(!isAppDrawerAddOpen);
              }}
              disabled={!userDepartments?.length}
            >
              <LuCheckCircle className="tt-expenses-margin-btn-icon" />{" "}
              <IntlMessages id="common.add" />
            </Button>
          </Space>
        }
      >
        <Row>
          <Col xs={24} lg={24}>
            <Alert
              message={<IntlMessages id="common.alert.info.message" />}
              description={
                <IntlMessages id="dashboard.department.add.user.description" />
              }
              type="info"
              showIcon
            />
          </Col>
        </Row>
        <Row>
          <Col xs={24} lg={24}>
            <label htmlFor="groups" className="label">
              <IntlMessages id="common.users" />
              <StyledRequiredField>*</StyledRequiredField>
            </label>
            <Select
              size="large"
              value={userDepartments || undefined}
              showSearch
              showArrow
              mode="multiple"
              style={{ width: "100%" }}
              placeholder={<IntlMessages id="placeholder.select" />}
              optionLabelProp="label"
              optionFilterProp="label"
              onChange={(e) => setUserDepartments(e)}
            >
              {users
                ?.filter(
                  (user) =>
                    user.role === UsersRolesEnums.USER &&
                    user.status !== UserStatusEnums.ARCHIVED
                )
                .map((user, index) => (
                  <Option key={index} value={user._id} label={user.displayName}>
                    <div className="tt-expenses-space-center">
                      {user?.photoURL ? (
                        <Avatar
                          style={{
                            marginRight: 14,
                            width: 40,
                            height: 40,
                          }}
                          src={user?.photoURL.secure_url}
                        />
                      ) : (
                        <StyledUserInfoAvatar photoRGA={user?.photoRGA}>
                          {Tt_GetUserAvatar(user)}
                        </StyledUserInfoAvatar>
                      )}
                      <div>
                        <Typography.Title
                          level={5}
                          style={{ fontSize: 14, marginBottom: 0 }}
                        >
                          {user?.displayName}
                        </Typography.Title>
                        <StyledText>{user?.email}</StyledText>
                      </div>
                    </div>
                  </Option>
                ))}
            </Select>
          </Col>
        </Row>
      </Drawer>
    </>
  );
};
export default DepartmentActions;
