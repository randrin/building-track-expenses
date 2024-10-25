import AppIconButton from "@crema/components/AppIconButton";
import IntlMessages from "@crema/helpers/IntlMessages";
import { useAuthUser } from "@crema/hooks/AuthHooks";
import {
  Avatar,
  Button,
  Col,
  Drawer,
  Dropdown,
  Row,
  Select,
  Space,
  Typography
} from "antd";
import { ItemType } from "antd/es/menu/hooks/useItems";
import { useOrganizationActionsContext } from "modules/apps/context/OrganizationContextProvider";
import { useUserContext } from "modules/apps/context/UserContextProvider";
import { useUtilContext } from "modules/apps/context/UtilContextProvider";
import { StyledRequiredField } from "modules/dashboards/index.styled";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { CiCircleMore, CiEdit, CiTrash } from "react-icons/ci";
import { IoReturnUpBackOutline } from "react-icons/io5";
import { LuCheckCircle, LuPowerOff } from "react-icons/lu";
import { VscEye } from "react-icons/vsc";
import { FORMAT_DATE_THREE, StatusEnums } from "utils/common-constants.utils";
import { Tt_DateFormat, Tt_GetUserAvatar } from "utils/common-functions.utils";
import { PermissionEnums } from "utils/permissions.utils";
import { StyledText, StyledUserInfoAvatar } from "../../index.styled";

const OrganizationActions = ({ organization }) => {
  // States
  const router = useRouter();
  const {
    handleOnGetOrganization,
    handleOnEnabledOrDisabled,
    handleOnDelete,
    handleOnAddUsersToOrganization,
  } = useOrganizationActionsContext();
  const { users } = useUserContext();
  const [isAppDrawerViewOpen, setAppDrawerViewOpen] = useState(false);
  const [isAppDrawerAddOpen, setAppDrawerAddOpen] = useState(false);
  const [userOrganizations, setUserOrganizations] = useState([]);
  const [permissionItems, setPermissionItems] = useState<ItemType[]>([]);

  // Destructing
  const { Option } = Select;

  // Init
  useEffect(() => {
    //setUserOrganizations(organization.users.map((user) => user._id));
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
          <span
            style={{ fontSize: 14 }}
            className="tt-expenses-space-start"
            onClick={() =>
              router.push(
                `/dashboards/organisations/detail/${organization._id}`
              )
            }
          >
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
      // {
      //   key: 3,
      //   permission: PermissionEnums.VIEW_USERS,
      //   label: (
      //     <span style={{ fontSize: 14 }} className="tt-expenses-space-start">
      //       <AiOutlineUserSwitch className="tt-expenses-default tt-expenses-margin-btn-icon" />{" "}
      //       <IntlMessages id="common.users" />
      //     </span>
      //   ),
      // },
      {
        key: 4,
        permission: PermissionEnums.ADD_ORGANIZATION,
        label: (
          <span style={{ fontSize: 14 }} className="tt-expenses-space-start">
            {organization.status === StatusEnums.ACTIVE ? (
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
  }, [user, roles, organization]);

  // Functions
  const onMenuClick = ({ item, key }: { item: any; key: string }) => {
    switch (key) {
      case "1":
        //setAppDrawerViewOpen(!isAppDrawerViewOpen);
        break;
      case "2":
        handleOnGetOrganization(organization);
        break;
      case "3":
        setAppDrawerAddOpen(!isAppDrawerAddOpen);
        break;
      case "4":
        handleOnEnabledOrDisabled(organization._id);
        break;
      case "5":
        handleOnDelete(organization._id);
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
      {/* View Organization */}
      <Drawer
        title={<IntlMessages id="dashboard.organization.view" />}
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
                organization.logo?.secure_url
                  ? organization.logo?.secure_url
                  : "/assets/icon/default-org.jpg"
              }
            />
          </Col>
          <Col xs={24} lg={24}>
            <DescriptionItem
              title={<IntlMessages id="common.name" />}
              content={organization.name}
            />
          </Col>
          <Col xs={24} lg={24}>
            <DescriptionItem
              title={<IntlMessages id="common.code" />}
              content={organization.code}
            />
          </Col>
          <Col xs={24} lg={24}>
            <DescriptionItem
              title={<IntlMessages id="common.description" />}
              content={organization.description}
            />
          </Col>
          <Col xs={24} lg={24}>
            <DescriptionItem
              title={<IntlMessages id="common.createdAt" />}
              content={Tt_DateFormat(organization.createdAt, FORMAT_DATE_THREE)}
            />
          </Col>
          <Col xs={24} lg={24}>
            <DescriptionItem
              title={<IntlMessages id="common.head.office" />}
              content={organization.headOffice}
            />
          </Col>
          <Col xs={24} lg={24}>
            <DescriptionItem
              title={<IntlMessages id="common.phone" />}
              content={
                "(" +
                  organization.phonePrefix +
                  ")" +
                  organization.phoneNumber || "-"
              }
            />
          </Col>
          <Col xs={24} lg={24}>
            <DescriptionItem
              title={<IntlMessages id="common.createdBy" />}
              content={organization.createdBy.displayName}
            />
          </Col>
          {/* <Col xs={24} lg={24}>
            <DescriptionItem
              title={<IntlMessages id="common.number.users" />}
              content={organization.users.length}
            />
            <Avatar.Group>
              {organization.users.map((data, index) => (
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
          </Col> */}
        </Row>
      </Drawer>
      {/* Add users to Organization */}
      <Drawer
        title={<IntlMessages id="dashboard.organization.add.user" />}
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
                handleOnAddUsersToOrganization(
                  organization._id,
                  userOrganizations
                );
                setAppDrawerAddOpen(!isAppDrawerAddOpen);
              }}
              disabled={!userOrganizations?.length}
            >
              <LuCheckCircle className="tt-expenses-margin-btn-icon" />{" "}
              <IntlMessages id="common.add" />
            </Button>
          </Space>
        }
      >
        <Row>
          <Col xs={24} lg={24}>
            <label htmlFor="groups" className="label">
              <IntlMessages id="common.users" />
              <StyledRequiredField>*</StyledRequiredField>
            </label>
            <Select
              size="large"
              value={userOrganizations || undefined}
              showSearch
              showArrow
              mode="multiple"
              style={{ width: "100%" }}
              placeholder={<IntlMessages id="placeholder.select" />}
              optionLabelProp="label"
              optionFilterProp="label"
              onChange={(e) => setUserOrganizations(e)}
            >
              {users.map((user, index) => (
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
export default OrganizationActions;
