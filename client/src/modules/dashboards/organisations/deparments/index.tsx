import { CloudUploadOutlined, PlusOutlined } from "@ant-design/icons";
import AppCard from "@crema/components/AppCard";
import AppIconButton from "@crema/components/AppIconButton";
import AppPageMeta from "@crema/components/AppPageMeta";
import AppsHeader from "@crema/components/AppsContainer/AppsHeader";
import AdminManagerPermission from "@crema/core/components/middlewares/AdminManagerPermission";
import SecuredPermission from "@crema/core/components/middlewares/SecuredPermission";
import IntlMessages from "@crema/helpers/IntlMessages";
import {
  StyledFlex,
  StyledText,
  StyledUserInfoAvatar,
} from "@crema/modules/dashboards/index.styled";
import DepartmentTable from "@crema/modules/dashboards/Organizations/DepartmentsTable";
import jwtAxios from "@crema/services/auth/jwt-auth";
import { DepartmentType } from "@crema/types/models/dashboards/OrganizationType";
import {
  Avatar,
  Button,
  Col,
  Input,
  message,
  Modal,
  Row,
  Select,
  Typography,
} from "antd";
import {
  useDepartmentActionsContext,
  useDepartmentContext,
} from "modules/apps/context/DepartmentContextProvider";
import { useUserContext } from "modules/apps/context/UserContextProvider";
import {
  StyledContent,
  StyledDetailReportContainer,
  StyledRequiredField,
} from "modules/dashboards/index.styled";
import { StyledTitle5 } from "modules/ecommerce/Admin/index.styled";
import {
  StyledOrderFooterPagination,
  StyledOrderHeader,
  StyledOrderHeaderInputView,
} from "modules/ecommerce/Orders/index.styled";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { BiArrowBack } from "react-icons/bi";
import { CiTrash } from "react-icons/ci";
import { IoReturnUpBackOutline } from "react-icons/io5";
import { LuCheckCircle } from "react-icons/lu";
import Resizer from "react-image-file-resizer";
import { useIntl } from "react-intl";
import { Tt_GetUserAvatar } from "utils";
import {
  MODE_ADD,
  PAGE_SIZE_DEFAULT,
  StatusEnums,
  UsersRolesEnums,
} from "utils/common-constants.utils";
import {
  TAM_UPLOAD_DELETE_URL,
  TAM_UPLOAD_SINGLE_URL,
} from "utils/end-points.utils";
import { PermissionEnums } from "utils/permissions.utils";

const Departments = () => {
  // States
  const { messages } = useIntl();
  const {
    departmentList,
    isAppDrawerOpen,
    loading,
    department,
    mode,
    page,
    organization,
  } = useDepartmentContext();
  const {
    setAppDrawerOpen,
    handleOnSubmitDepartment,
    handleOnUpdate,
    setDepartment,
    onPageChange,
    handleOnGetOrganization,
    setMode,
  } = useDepartmentActionsContext();
  const router = useRouter();
  const { users } = useUserContext();
  const { query } = useRouter();
  const { all } = query;
  const [filterData, setFilterData] = useState("");

  // Desctruction
  const { logo, description, manager, name } = department;
  const { Option } = Select;
  const { TextArea } = Input;

  // Init
  useEffect(() => {
    if (all) {
      handleOnGetOrganization(all[0]);
      setDepartment({
        ...department,
        organizationId: all[0],
      });
    }
  }, [all]);

  // Init

  // Functions
  const handleOnValidate = () => {
    return !!name?.length &&
      !!description?.length &&
      (!!manager?.length || !!manager._id?.length)
      ? false
      : true;
  };

  const handleOnAddDepartment = () => {
    setMode(MODE_ADD);
    setAppDrawerOpen(!isAppDrawerOpen);
    setDepartment({
      logo: {},
      description: "",
      manager: "",
      name: "",
      organizationId: all[0],
    });
  };

  const handleOnChangeLogo = async (e: any) => {
    const files = e.target.files;

    if (files) {
      // Resize
      Resizer.imageFileResizer(
        files[0],
        720,
        720,
        "JPEG",
        100,
        0,
        async (uri) => {
          const file = new FormData();
          file.append("file", files[0]);
          await jwtAxios
            .post(TAM_UPLOAD_SINGLE_URL, file, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            })
            .then((res) => {
              setDepartment({ ...department, logo: res.data });
            })
            .catch((error) => {
              console.log("handleOnChange Error: ", error);
              message.error(error.response.data.message);
            });
        },
        "base64"
      );
    }
    // Send back to server to upload to cloudinary
    // Set url to images[] in the parent component - ProductCreate
  };

  const handleImageRemove = async (public_id) => {
    await jwtAxios
      .delete(`${TAM_UPLOAD_DELETE_URL}/${public_id.split("/")[1]}`)
      .then((res) => {
        if (res.data.result === "ok" && res.status === 200) {
          setDepartment({ ...department, logo: {} });
        }
      })
      .catch((error) => {
        console.log("handleImageRemove Error: ", error);
        message.error(error.response.data.message);
      });
  };

  const onGetFilteredItems = () => {
    if (filterData === "") {
      return departmentList?.data;
    } else {
      return departmentList?.data.filter(
        (department: DepartmentType) =>
          department.name.toUpperCase().includes(filterData.toUpperCase()) ||
          department.description
            .toUpperCase()
            .includes(filterData.toUpperCase())
      );
    }
  };

  const list = onGetFilteredItems();

  // Render
  return (
    <>
      <AppPageMeta
        title={messages["sidebar.app.dashboard.organizations"] as string}
      />
      <StyledContent>
        <StyledTitle5 className="tt_detail-expense-box">
          <AppIconButton
            icon={<BiArrowBack />}
            title={<IntlMessages id="common.back" />}
            onClick={() => router.back()}
          />
          {messages["common.back"] as string}
        </StyledTitle5>
      </StyledContent>
      <StyledDetailReportContainer>
        <Row>
          <Col xs={24} lg={4} className="tt-expenses-space-center">
            <StyledFlex>
              <Avatar
                style={{
                  marginRight: 14,
                  width: 100,
                  height: 100,
                }}
                src={
                  organization.logo?.secure_url
                    ? organization.logo?.secure_url
                    : "/assets/icon/default-org.jpg"
                }
              />
            </StyledFlex>
          </Col>
          <Col xs={24} lg={18}>
            <Row className="tt-expenses-without-margin">
              <Col xs={24} lg={12}>
                <div className="tt_detail-expense">
                  <span className="tt_detail-expense-description">
                    {messages["common.organization"] as string}
                  </span>
                  <span className="tt_detail-expense-value">
                    {organization.name}
                  </span>
                </div>
              </Col>
              <Col xs={24} lg={12}>
                <div className="tt_detail-expense">
                  <span className="tt_detail-expense-description">
                    {messages["common.code"] as string}
                  </span>
                  <span className="tt_detail-expense-value">
                    {organization.code}
                  </span>
                </div>
              </Col>
              <Col xs={24} lg={12}>
                <div className="tt_detail-expense">
                  <span className="tt_detail-expense-description">
                    {messages["common.head.office"] as string}
                  </span>
                  <span className="tt_detail-expense-value">
                    {organization.headOffice}
                  </span>
                </div>
              </Col>
              <Col xs={24} lg={12}>
                <div className="tt_detail-expense">
                  <span className="tt_detail-expense-description">
                    {messages["common.phone"] as string}
                  </span>
                  <span className="tt_detail-expense-value">
                    (+{organization.phonePrefix}) {organization.phoneNumber}
                  </span>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </StyledDetailReportContainer>
      <div className="tt-expenses-space-end">
        <SecuredPermission
          permission={PermissionEnums.ADD_ORGANIZATION}
          component={
            <StyledContent>
              <Button
                type="primary"
                className="btn"
                onClick={handleOnAddDepartment}
              >
                <PlusOutlined /> <IntlMessages id="common.department" />
              </Button>
            </StyledContent>
          }
        ></SecuredPermission>
      </div>
      <AppCard
        title={
          <AppsHeader>
            <StyledOrderHeader>
              <StyledOrderHeaderInputView>
                <Input
                  id="category-name"
                  placeholder={messages["common.searchHere"] as string}
                  type="search"
                  onChange={(event) => setFilterData(event.target.value)}
                />
              </StyledOrderHeaderInputView>
              <StyledOrderFooterPagination
                pageSize={PAGE_SIZE_DEFAULT}
                count={departmentList?.count || 0}
                page={page}
                onChange={onPageChange}
              />
            </StyledOrderHeader>
          </AppsHeader>
        }
      >
        <DepartmentTable
          departmentData={organization.departments || []}
          loading={loading}
        />
      </AppCard>
      {/* Add and Update Department */}
      <Modal
        centered
        maskClosable={false}
        title={
          mode === MODE_ADD
            ? (messages["dashboard.department.create"] as string)
            : (messages["dashboard.department.update"] as string)
        }
        open={isAppDrawerOpen}
        onCancel={() => setAppDrawerOpen(!isAppDrawerOpen)}
        footer={[
          <Button
            key="back"
            onClick={() => setAppDrawerOpen(!isAppDrawerOpen)}
            className="tt-expenses-space-center"
          >
            <IoReturnUpBackOutline className="tt-expenses-margin-btn-icon" />{" "}
            {messages["common.back"] as string}
          </Button>,
          <Button
            key="submit"
            type="primary"
            className="tt-expenses-space-center"
            onClick={
              mode === MODE_ADD
                ? handleOnSubmitDepartment
                : () => handleOnUpdate(department._id, department)
            }
            disabled={handleOnValidate()}
          >
            <LuCheckCircle className="tt-expenses-margin-btn-icon" />{" "}
            {messages["common.submit"] as string}
          </Button>,
        ]}
      >
        <Row>
          <Col xs={24} lg={24} className="tt-expenses-space-center">
            {!!logo?.public_id?.length ? (
              <div>
                <Avatar
                  key={logo.public_id}
                  src={logo.url}
                  size={100}
                  onClick={() => handleImageRemove(logo.public_id)}
                  shape="square"
                  className="m-3"
                />
                <Button
                  type="primary"
                  size="middle"
                  danger
                  className="tt-expenses-space-center"
                  onClick={() => handleImageRemove(logo.public_id)}
                >
                  <CiTrash className="tt-expenses-margin-btn-icon" />{" "}
                  {messages["common.delete"] as string}
                </Button>
              </div>
            ) : (
              <label className="tt-expenses-btn-upload tt-expenses-border-radius-three">
                <CloudUploadOutlined
                  size={30}
                  className="tt-expenses-btn-upload-icon"
                />
                {messages["common.upload.logo"] as string}
                <input
                  className="ant-upload-drag-icon"
                  type="file"
                  multiple
                  hidden
                  accept="image/*"
                  onChange={handleOnChangeLogo}
                />
              </label>
            )}
          </Col>
        </Row>
        <Row>
          <Col xs={24} lg={24}>
            <label htmlFor="name" className="label">
              {messages["common.name"] as string}
              <StyledRequiredField>*</StyledRequiredField>
            </label>
            <Input
              name="name"
              size="large"
              value={name}
              placeholder={messages["placeholder.input"] as string}
              onChange={(e) =>
                setDepartment({ ...department, name: e.target.value })
              }
            />
          </Col>
        </Row>
        <Row>
          <Col xs={24} lg={24}>
            <label htmlFor="description" className="label">
              {messages["common.description"] as string}
              <StyledRequiredField>*</StyledRequiredField>
            </label>
            <TextArea
              name="description"
              value={description}
              rows={2}
              placeholder={messages["placeholder.textarea"] as string}
              onChange={(e) =>
                setDepartment({
                  ...department,
                  description: e.target.value,
                })
              }
            />
            {description?.length <= 5 && (
              <span className="tt-expenses-tomato">
                5 {messages["common.min.length"] as string}
              </span>
            )}
          </Col>
        </Row>
        <Row>
          <Col xs={24} lg={24}>
            <label htmlFor="manager" className="label">
              <IntlMessages id="common.role.manager" />
              <StyledRequiredField>*</StyledRequiredField>
            </label>
            <Select
              size="large"
              value={manager._id || manager || undefined}
              showSearch
              showArrow
              style={{ width: "100%" }}
              placeholder={<IntlMessages id="placeholder.select" />}
              optionLabelProp="label"
              optionFilterProp="label"
              onChange={(e) =>
                setDepartment({
                  ...department,
                  manager: e,
                })
              }
            >
              {users
                ?.filter(
                  (user) =>
                    user.role === UsersRolesEnums.MANAGER &&
                    user.status === StatusEnums.ACTIVE
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
        {/* <Row>
          <Col xs={24} lg={24}>
            <label htmlFor="contributors" className="label">
              <IntlMessages id="common.users" />
              <StyledRequiredField>*</StyledRequiredField>
            </label>
            <Select
              size="large"
              value={contributors || undefined}
              showSearch
              showArrow
              mode="multiple"
              style={{ width: "100%" }}
              placeholder={<IntlMessages id="placeholder.select" />}
              optionLabelProp="label"
              optionFilterProp="label"
              onChange={(e) =>
                setDepartment({
                  ...department,
                  contributors: e,
                })
              }
            >
              {users
                ?.filter((user) => user.role === UsersRolesEnums.USER)
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
        </Row> */}
      </Modal>
    </>
  );
};
export default AdminManagerPermission(Departments);
