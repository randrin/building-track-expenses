import AppIconButton from "@crema/components/AppIconButton";
import { defaultTheme } from "@crema/constants/defaultConfig";
import IntlMessages from "@crema/helpers/IntlMessages";
import { useAuthUser } from "@crema/hooks/AuthHooks";
import { UserType } from "@crema/types/models/dashboards/UserType";
import {
  Alert,
  Avatar,
  Button,
  Col,
  Divider,
  Drawer,
  Dropdown,
  Row,
  Select,
  Space,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import { ItemType } from "antd/es/menu/hooks/useItems";
import { useDepartmentContext } from "modules/apps/context/DepartmentContextProvider";
import { useUserActionsContext } from "modules/apps/context/UserContextProvider";
import { useUtilContext } from "modules/apps/context/UtilContextProvider";
import { StyledRequiredField } from "modules/dashboards/index.styled";
import { useEffect, useState } from "react";
import { CiCircleMore, CiEdit, CiTrash } from "react-icons/ci";
import { FaBuildingUser, FaUserGear } from "react-icons/fa6";
import { IoReturnUpBackOutline } from "react-icons/io5";
import { LuCheckCircle } from "react-icons/lu";
import { VscEye } from "react-icons/vsc";
import {
  FORMAT_DATE_THREE,
  StatusEnums,
  UserStatusEnums,
} from "utils/common-constants.utils";
import {
  Tt_DateFormat,
  Tt_GetStatusUser,
  Tt_GetUserAvatar,
} from "utils/common-functions.utils";
import { PermissionEnums } from "utils/permissions.utils";
import { StyledText, StyledUserInfoAvatar } from "../../index.styled";

type Props = {
  user: UserType;
};

const UserActions = ({ user }: Props) => {
  // States
  const {
    handleOnDelete,
    handleOnGetUser,
    handleOnAddDepartmentsToUser,
    handleOnUpdateUserStatus,
  } = useUserActionsContext();
  const { departments } = useDepartmentContext();
  const [isAppDrawerViewOpen, setAppDrawerViewOpen] = useState(false);
  const [isAppDrawerStatusOpen, setAppDrawerStatusOpen] = useState(false);
  const [isAppDrawerOrgOpen, setAppDrawerOrgOpen] = useState(false);
  const [userDepartments, setUserDepartments] = useState([]);
  const [userStatut, setUserStatut] = useState(user.status);
  const [groups, setGroups] = useState([]);
  const [permissionItems, setPermissionItems] = useState<ItemType[]>([]);

  // Destructing
  const { user: userAction } = useAuthUser();
  const { roles } = useUtilContext();
  const { Option } = Select;

  // Init
  const DescriptionItem = ({ title, content }) => (
    <div className="site-description-item-profile-wrapper">
      <p className="site-description-item-profile-p-label">
        <b>{title}</b>:
      </p>
      {content}
    </div>
  );

  useEffect(() => {
    const items = [
      {
        key: 1,
        permission: PermissionEnums.ADMIN_MANAGER,
        label: (
          <span style={{ fontSize: 14 }} className="tt-expenses-space-start">
            <VscEye className="tt-expenses-primary tt-expenses-margin-btn-icon" />{" "}
            <IntlMessages id="common.view" />
          </span>
        ),
      },
      {
        key: 2,
        permission: PermissionEnums.EDIT_USER,
        label: (
          <span style={{ fontSize: 14 }} className="tt-expenses-space-start">
            <CiEdit className="tt-expenses-secondary tt-expenses-margin-btn-icon" />{" "}
            <IntlMessages id="common.edit" />
          </span>
        ),
      },
      {
        key: 3,
        permission: PermissionEnums.EDIT_USER,
        label: (
          <span style={{ fontSize: 14 }} className="tt-expenses-space-start">
            <FaUserGear className="tt-expenses-warning tt-expenses-margin-btn-icon" />{" "}
            <IntlMessages id="common.status" />
          </span>
        ),
      },
      {
        key: 4,
        permission: PermissionEnums.EDIT_ORGANIZATION,
        label: (
          <span style={{ fontSize: 14 }} className="tt-expenses-space-start">
            <FaBuildingUser className="tt-expenses-default tt-expenses-margin-btn-icon" />{" "}
            <IntlMessages id="common.departments" />
          </span>
        ),
      },
      {
        key: 5,
        permission: PermissionEnums.DELETE_USER,
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
          ?.find((role) => role.title === userAction.role)
          .permissions.some(
            (per) =>
              per.code === item.permission && per.status === StatusEnums.ACTIVE
          )
      )
    );
  }, [user, roles, userAction]);

  // Functions
  const handleOnGetUserDepartments = (user: UserType) => {
    setUserDepartments(
      departments.filter((dpt) =>
        dpt.contributors.find((userDpt) => userDpt._id === user._id)
      )
    );
    console.log(userDepartments);
  };

  const onMenuClick = ({ item, key }: { item: any; key: string }) => {
    switch (key) {
      case "1":
        setAppDrawerViewOpen(!isAppDrawerViewOpen);
        handleOnGetUserDepartments(user);
        break;
      case "2":
        handleOnGetUser(user);
        break;
      case "3":
        setAppDrawerStatusOpen(!isAppDrawerStatusOpen);
        break;
      case "4":
        setAppDrawerOrgOpen(!isAppDrawerOrgOpen);
        setGroups(
          departments
            .filter((dpt) =>
              dpt.contributors.find((userDpt) => userDpt._id === user._id)
            )
            .map((dpt) => dpt._id)
        );
        break;
      case "5":
        handleOnDelete(user);
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
      {/* View User */}
      <Drawer
        title={<IntlMessages id="dashboard.user.view" />}
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
            {user?.photoURL ? (
              <Avatar
                style={{
                  width: 80,
                  height: 80,
                }}
                src={user?.photoURL.secure_url}
              />
            ) : (
              <StyledUserInfoAvatar photoRGA={user.photoRGA}>
                {Tt_GetUserAvatar(user)}
              </StyledUserInfoAvatar>
            )}
          </Col>
          <Col xs={24} lg={24}>
            <DescriptionItem
              title={<IntlMessages id="common.userId" />}
              content={
                <Tag color={defaultTheme.theme.palette.primary.main}>
                  {user.username}
                </Tag>
              }
            />
          </Col>
          <Col xs={24} lg={24}>
            <DescriptionItem
              title={<IntlMessages id="common.gender" />}
              content={user.gender}
            />
          </Col>
          <Col xs={24} lg={24}>
            <DescriptionItem
              title={<IntlMessages id="common.firstname" />}
              content={user.firstName}
            />
          </Col>
          <Col xs={24} lg={24}>
            <DescriptionItem
              title={<IntlMessages id="common.lastname" />}
              content={user.lastName}
            />
          </Col>
          <Col xs={24} lg={24}>
            <DescriptionItem
              title={<IntlMessages id="common.role" />}
              content={user.role}
            />
          </Col>
          <Col xs={24} lg={24}>
            <DescriptionItem
              title={<IntlMessages id="common.birthday" />}
              content={Tt_DateFormat(user.dateOfBorn)}
            />
          </Col>
          <Col xs={24} lg={24}>
            <DescriptionItem
              title={<IntlMessages id="common.email" />}
              content={user.email}
            />
          </Col>
          <Col xs={24} lg={24}>
            <DescriptionItem
              title={<IntlMessages id="common.phone" />}
              content={
                "(" +
                user.contact?.phonePrefix +
                ")" +
                user.contact?.phoneNumber
              }
            />
          </Col>
          <Col xs={24} lg={24}>
            <DescriptionItem
              title={<IntlMessages id="common.status" />}
              content={Tt_GetStatusUser(user.status)}
            />
          </Col>
          <Col xs={24} lg={24}>
            <DescriptionItem
              title={<IntlMessages id="common.lastLogin" />}
              content={Tt_DateFormat(user.lastLogin, FORMAT_DATE_THREE)}
            />
          </Col>
          <Divider className="tt-expenses-background-sliver m-9" />
          <Col xs={24} lg={24}>
            <DescriptionItem
              title={<IntlMessages id="common.createdAt" />}
              content={Tt_DateFormat(user.createdAt, FORMAT_DATE_THREE)}
            />
          </Col>
          <Col xs={24} lg={24}>
            <DescriptionItem
              title={<IntlMessages id="common.createdBy" />}
              content={user.createdBy ? user.createdBy.displayName : "-"}
            />
          </Col>
          <Divider className="tt-expenses-background-sliver m-9" />
          <Col xs={24} lg={24}>
            <DescriptionItem
              title={<IntlMessages id="common.departments" />}
              content={userDepartments.length}
            />
            <Avatar.Group
              maxCount={10}
              maxStyle={{
                color: "#fff",
                backgroundColor: "#2997ff99",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "40px",
              }}
            >
              {userDepartments.map((data, index) => (
                <>
                  <Tooltip
                    placement="topLeft"
                    title={data.name}
                    className="tt-expenses-cursor-pointer"
                  >
                    <Avatar
                      size={45}
                      key={"organization-" + index}
                      alt={data.name}
                      src={
                        data.logo?.secure_url
                          ? data.logo?.secure_url
                          : "/assets/icon/default-org.jpg"
                      }
                    />
                  </Tooltip>
                </>
              ))}
            </Avatar.Group>
          </Col>
        </Row>
      </Drawer>
      {/* Status User */}
      <Drawer
        title={<IntlMessages id="dashboard.user.status" />}
        placement={"right"}
        open={isAppDrawerStatusOpen}
        onClose={() => setAppDrawerStatusOpen(!isAppDrawerStatusOpen)}
        footer={
          <Space>
            <Button
              key="back"
              onClick={() => setAppDrawerStatusOpen(!isAppDrawerStatusOpen)}
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
                handleOnUpdateUserStatus(user._id, userStatut);
                setAppDrawerStatusOpen(!isAppDrawerStatusOpen);
              }}
              disabled={user.status === userStatut}
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
                <IntlMessages id="common.alert.statut.description" />
              }
              type="info"
              showIcon
            />
          </Col>
        </Row>
        <Row>
          <Col xs={24} lg={24}>
            <label htmlFor="status" className="label">
              <IntlMessages id="common.status" />
              <StyledRequiredField>*</StyledRequiredField>
            </label>
            <Select
              size="large"
              value={userStatut || undefined}
              showSearch
              showArrow
              style={{ width: "100%" }}
              placeholder={<IntlMessages id="placeholder.select" />}
              optionLabelProp="label"
              optionFilterProp="label"
              onChange={(e) => setUserStatut(e)}
            >
              {Object.values(UserStatusEnums)?.map((statut, index) => (
                <Option
                  key={index}
                  value={statut}
                  disabled={statut === UserStatusEnums.NEVER_CONNECTED}
                  label={
                    <IntlMessages
                      id={`common.status.${statut
                        .replaceAll("_", ".")
                        .toLocaleLowerCase()}`}
                    />
                  }
                >
                  <div className="tt-expenses-space-start">
                    {Tt_GetStatusUser(statut)}
                    <span>
                      <IntlMessages
                        id={`common.status.${statut
                          .replaceAll("_", ".")
                          .toLocaleLowerCase()}`}
                      />
                    </span>
                  </div>
                </Option>
              ))}
            </Select>
          </Col>
        </Row>
      </Drawer>
      {/* Departments User */}
      <Drawer
        title={<IntlMessages id="dashboard.user.organization" />}
        placement={"right"}
        open={isAppDrawerOrgOpen}
        onClose={() => setAppDrawerOrgOpen(!isAppDrawerOrgOpen)}
        footer={
          <Space>
            <Button
              key="back"
              onClick={() => setAppDrawerOrgOpen(!isAppDrawerOrgOpen)}
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
                handleOnAddDepartmentsToUser(user._id, groups);
                setAppDrawerOrgOpen(!isAppDrawerOrgOpen);
              }}
              disabled={!groups?.length}
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
                <IntlMessages id="dashboard.user.add.department.description" />
              }
              type="info"
              showIcon
            />
          </Col>
        </Row>
        <Row>
          <Col xs={24} lg={24}>
            <label htmlFor="departments" className="label">
              <IntlMessages id="common.departments" />
              <StyledRequiredField>*</StyledRequiredField>
            </label>
            <Select
              size="large"
              value={groups || undefined}
              showSearch
              showArrow
              mode="multiple"
              style={{ width: "100%" }}
              placeholder={<IntlMessages id="placeholder.select" />}
              optionLabelProp="label"
              optionFilterProp="label"
              onChange={(e) => setGroups(e)}
            >
              {departments
                ?.filter((dpt) => dpt.status === StatusEnums.ACTIVE)
                ?.map((dpt, index) => (
                  <Option key={index} value={dpt._id} label={dpt.name}>
                    <div className="tt-expenses-space-center">
                      <Avatar
                        size={45}
                        key={"department-" + index}
                        alt={dpt.name}
                        src={
                          dpt.logo?.secure_url
                            ? dpt.logo?.secure_url
                            : "/assets/icon/default-org.jpg"
                        }
                      />
                      <div>
                        <Typography.Title
                          level={5}
                          style={{ fontSize: 14, marginBottom: 0 }}
                        >
                          {dpt?.name}
                        </Typography.Title>
                        <StyledText>{dpt?.code}</StyledText>
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
export default UserActions;
