import { CloudUploadOutlined, PlusOutlined } from "@ant-design/icons";
import AppCard from "@crema/components/AppCard";
import AppPageMeta from "@crema/components/AppPageMeta";
import AppRowContainer from "@crema/components/AppRowContainer";
import AppsHeader from "@crema/components/AppsContainer/AppsHeader";
import AdminManagerPermission from "@crema/core/components/middlewares/AdminManagerPermission";
import SecuredPermission from "@crema/core/components/middlewares/SecuredPermission";
import IntlMessages from "@crema/helpers/IntlMessages";
import OrganizationTable from "@crema/modules/dashboards/Organizations/OrganizationsTable";
import jwtAxios from "@crema/services/auth/jwt-auth";
import { OrganizationType } from "@crema/types/models/dashboards/OrganizationType";
import { Avatar, Button, Col, Input, Modal, Row, Select, message } from "antd";
import {
  useOrganizationActionsContext,
  useOrganizationContext,
} from "modules/apps/context/OrganizationContextProvider";
import { useUtilContext } from "modules/apps/context/UtilContextProvider";
import { StyledTitle5 } from "modules/ecommerce/Admin/index.styled";
import {
  StyledOrderFooterPagination,
  StyledOrderHeader,
  StyledOrderHeaderInputView,
  StyledOrderHeaderPagination,
} from "modules/ecommerce/Orders/index.styled";
import { useState } from "react";
import { CiTrash } from "react-icons/ci";
import { IoReturnUpBackOutline } from "react-icons/io5";
import { LuCheckCircle } from "react-icons/lu";
import Resizer from "react-image-file-resizer";
import { useIntl } from "react-intl";
import { MODE_ADD, PAGE_SIZE_DEFAULT } from "utils/common-constants.utils";
import {
  TAM_UPLOAD_DELETE_URL,
  TAM_UPLOAD_SINGLE_URL,
} from "utils/end-points.utils";
import { PermissionEnums } from "utils/permissions.utils";
import { StyledContent, StyledRequiredField } from "../index.styled";

const Organisations = () => {
  // States
  const { messages } = useIntl();
  const { organizationList, isAppDrawerOpen, loading, organization, mode } =
    useOrganizationContext();
  const {
    handleOnAddOrganization,
    setAppDrawerOpen,
    handleOnSubmitOrganization,
    handleOnUpdate,
    setOrganization,
    onPageChange,
  } = useOrganizationActionsContext();
  const { countriesFilter } = useUtilContext();
  const [page, setPage] = useState(0);
  const [filterData, setFilterData] = useState("");

  // Destructing
  const { Option } = Select;
  const { TextArea } = Input;
  const { name, description, logo, headOffice, phonePrefix, phoneNumber } =
    organization;

  // Functions
  const handleOnValidate = () => {
    return !!name.length && !!description.length && !!headOffice.length
      ? false
      : true;
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
              setOrganization({ ...organization, logo: res.data });
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

  const onGetFilteredItems = () => {
    if (filterData === "") {
      return organizationList?.data;
    } else {
      return organizationList?.data.filter(
        (organization: OrganizationType) =>
          organization.name.toUpperCase().includes(filterData.toUpperCase()) ||
          organization.description
            .toUpperCase()
            .includes(filterData.toUpperCase())
      );
    }
  };

  const handleImageRemove = async (public_id) => {
    await jwtAxios
      .delete(`${TAM_UPLOAD_DELETE_URL}/${public_id.split("/")[1]}`)
      .then((res) => {
        if (res.data.result === "ok" && res.status === 200) {
          setOrganization({ ...organization, logo: {} });
        }
      })
      .catch((error) => {
        console.log("handleImageRemove Error: ", error);
        message.error(error.response.data.message);
      });
  };

  const list = onGetFilteredItems();

  // Render
  return (
    <>
      <AppPageMeta
        title={messages["sidebar.app.dashboard.organizations"] as string}
      />
      <StyledContent>
        <StyledTitle5>
          {messages["sidebar.app.dashboard.organizations"] as string}
        </StyledTitle5>
        <SecuredPermission
          permission={PermissionEnums.ADD_ORGANIZATION}
          component={
            <Button
              type="primary"
              className="btn"
              onClick={handleOnAddOrganization}
            >
              <PlusOutlined /> <IntlMessages id="common.organization" />
            </Button>
          }
        ></SecuredPermission>
      </StyledContent>
      <AppRowContainer>
        <Col xs={24} lg={24}>
          <AppCard
            title={
              <AppsHeader>
                <StyledOrderHeader>
                  <StyledOrderHeaderInputView>
                    <Input
                      id="user-name"
                      placeholder={messages["common.searchHere"] as string}
                      type="search"
                      onChange={(event) => setFilterData(event.target.value)}
                    />
                  </StyledOrderHeaderInputView>
                  <StyledOrderHeaderPagination
                    pageSize={PAGE_SIZE_DEFAULT}
                    count={organizationList?.count || 0}
                    page={page}
                    onChange={onPageChange}
                  />
                </StyledOrderHeader>
              </AppsHeader>
            }
          >
            <OrganizationTable
              organizationData={list || []}
              loading={loading}
            />
            <StyledOrderFooterPagination
              pageSize={PAGE_SIZE_DEFAULT}
              count={organizationList?.count || 0}
              page={page}
              onChange={onPageChange}
            />
          </AppCard>
        </Col>
      </AppRowContainer>
      {/* Add and Update Organization */}
      <Modal
        centered
        title={
          mode === MODE_ADD
            ? (messages["dashboard.organization.create"] as string)
            : (messages["dashboard.organization.update"] as string)
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
                ? handleOnSubmitOrganization
                : () => handleOnUpdate(organization._id, organization)
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
                setOrganization({ ...organization, name: e.target.value })
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
                setOrganization({
                  ...organization,
                  description: e.target.value,
                })
              }
            />
            {description.length <= 5 && (
              <span className="tt-expenses-tomato">
                5 {messages["common.min.length"] as string}
              </span>
            )}
          </Col>
        </Row>
        <Row>
          <Col xs={24} lg={24}>
            <label htmlFor="headOffice" className="label">
              {messages["common.head.office"] as string}
              <StyledRequiredField>*</StyledRequiredField>
            </label>
            <Input
              size="large"
              name="headOffice"
              value={headOffice}
              placeholder={messages["placeholder.input"] as string}
              onChange={(e) =>
                setOrganization({
                  ...organization,
                  headOffice: e.target.value,
                })
              }
            />
          </Col>
        </Row>
        <Row className="pb-15">
          <Col xs={24} lg={8}>
            <label htmlFor="phonePrefix" className="label">
              {messages["common.phone.prefix"] as string}
            </label>
            <Select
              size="large"
              value={phonePrefix || undefined}
              showSearch
              showArrow
              style={{ width: "100%" }}
              placeholder={messages["placeholder.select"] as string}
              optionFilterProp="label"
              optionLabelProp="children"
              onChange={(e) =>
                setOrganization({ ...organization, phonePrefix: e })
              }
            >
              {countriesFilter.map((phone, index) => (
                <Option key={index} value={phone.dialCode} label={phone.name}>
                  <Avatar size={25} src={phone.flag} alt={phone.name} />
                  <span className="ml-5">{phone.dialCode}</span>
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} lg={16}>
            <label htmlFor="phoneNumber" className="label">
              {messages["common.phone"] as string}
            </label>
            <Input
              size="large"
              name="phoneNumber"
              value={phoneNumber}
              placeholder={messages["placeholder.input"] as string}
              onChange={(e) =>
                setOrganization({
                  ...organization,
                  phoneNumber: e.target.value.replace(/\D/g, ""), // Accept only numbers
                })
              }
            />
          </Col>
        </Row>
      </Modal>
    </>
  );
};

export default AdminManagerPermission(Organisations);
