import { PlusOutlined } from "@ant-design/icons";
import AppCard from "@crema/components/AppCard";
import AppPageMeta from "@crema/components/AppPageMeta";
import AppRowContainer from "@crema/components/AppRowContainer";
import AppsHeader from "@crema/components/AppsContainer/AppsHeader";
import AdminManagerPermission from "@crema/core/components/middlewares/AdminManagerPermission";
import SecuredPermission from "@crema/core/components/middlewares/SecuredPermission";
import IntlMessages from "@crema/helpers/IntlMessages";
import PermissionTable from "@crema/modules/dashboards/Permissions/permissionsTable";
import { PermissionType } from "@crema/types/models/dashboards/PermissionType";
import { Button, Col, Input, Modal, Row, Select } from "antd";
import {
  usePermissionActionsContext,
  usePermissionContext,
} from "modules/apps/context/PermissionContextProvider";
import {
  StyledContent,
  StyledRequiredField,
} from "modules/dashboards/index.styled";
import { StyledTitle5 } from "modules/ecommerce/Admin/index.styled";
import {
  StyledOrderFooterPagination,
  StyledOrderHeader,
  StyledOrderHeaderInputView,
  StyledOrderHeaderPagination,
} from "modules/ecommerce/Orders/index.styled";
import { useState } from "react";
import { IoReturnUpBackOutline } from "react-icons/io5";
import { LuCheckCircle } from "react-icons/lu";
import { useIntl } from "react-intl";
import { MODE_ADD, PAGE_SIZE_DEFAULT } from "utils/common-constants.utils";
import { PermissionEnums } from "utils/permissions.utils";

const Permissions = () => {
  // States
  const {
    permissionList,
    loading,
    permissions,
    isAppDrawerOpen,
    permission,
    mode,
    page,
  } = usePermissionContext();
  const {
    setAppDrawerOpen,
    handleOnSubmit,
    handleOnUpdate,
    setPermission,
    handleOnAddPermission,
    onPageChange,
  } = usePermissionActionsContext();
  const { messages } = useIntl();
  const [filterData, setFilterData] = useState("");

  // Desctruction
  const { code, description } = permission;
  const { TextArea } = Input;
  const { Option } = Select;

  // Functions
  const onGetFilteredItems = () => {
    if (filterData === "") {
      return permissionList?.data;
    } else {
      return permissionList.data.filter(
        (permission: PermissionType) =>
          permission.code.toUpperCase().includes(filterData.toUpperCase()) ||
          permission.description
            .toUpperCase()
            .includes(filterData.toUpperCase())
      );
    }
  };

  const handleOnValidate = () => {
    return !!code?.length && !!description?.length ? false : true;
  };

  const handleOnKeyPress = (event: any) => {
    var keyCode = event.keyCode ? event.keyCode : event.which;
    if (keyCode > 47 && keyCode < 58) {
      event.preventDefault();
    }
  };

  const list = onGetFilteredItems();

  // Render
  return (
    <>
      <AppPageMeta
        title={messages["sidebar.app.dashboard.permissions"] as string}
      />
      <StyledContent>
        <StyledTitle5>
          {messages["sidebar.app.dashboard.permissions"] as string}
        </StyledTitle5>
        <SecuredPermission
          permission={PermissionEnums.ADD_PERMISSION}
          component={
            <Button
              type="primary"
              className="btn"
              onClick={handleOnAddPermission}
            >
              <PlusOutlined /> <IntlMessages id="common.permission" />
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
                    count={permissionList?.count || 0}
                    page={page}
                    onChange={onPageChange}
                  />
                </StyledOrderHeader>
              </AppsHeader>
            }
          >
            <PermissionTable permissionData={list || []} loading={loading} />
            {permissionList?.data?.length > 0 && (
              <StyledOrderFooterPagination
                pageSize={PAGE_SIZE_DEFAULT}
                count={permissionList?.count || 0}
                page={page}
                onChange={(data) => onPageChange(data)}
              />
            )}
            {/* Add and Update Permission */}
            <Modal
              maskClosable={false}
              open={isAppDrawerOpen}
              title={
                messages[
                  mode === MODE_ADD
                    ? "dashboard.permission.create"
                    : "dashboard.permission.update"
                ] as string
              }
              onOk={
                mode === MODE_ADD
                  ? handleOnSubmit
                  : () => handleOnUpdate(permission._id, permission)
              }
              onCancel={() => setAppDrawerOpen(!isAppDrawerOpen)}
              footer={[
                <Button
                  key="back"
                  className="tt-expenses-space-center"
                  onClick={() => {
                    setPermission({});
                    setAppDrawerOpen(!isAppDrawerOpen);
                  }}
                >
                  <IoReturnUpBackOutline className="tt-expenses-margin-btn-icon" />{" "}
                  {messages["common.back"] as string}
                </Button>,
                <Button
                  key="submit"
                  type="primary"
                  className="tt-expenses-space-center"
                  loading={loading}
                  onClick={
                    mode === MODE_ADD
                      ? handleOnSubmit
                      : () => handleOnUpdate(permission._id, permission)
                  }
                  disabled={handleOnValidate()}
                >
                  <LuCheckCircle className="tt-expenses-margin-btn-icon" />
                  {messages["common.submit"] as string}
                </Button>,
              ]}
            >
              <Row>
                <Col xs={24} lg={24}>
                  <label htmlFor="title" className="label">
                    {messages["common.code"] as string}{" "}
                    <StyledRequiredField>*</StyledRequiredField>
                  </label>
                  {/* <Input
                    addonBefore={PREFIX_PERMISSION}
                    placeholder={messages["placeholder.input"] as string}
                    value={code
                      .toLocaleUpperCase()
                      .replace(" ", "_")
                      .replace(/[^\w\s]/gi, "_")
                      .replace("__", "_")}
                    size="large"
                    onKeyPress={handleOnKeyPress}
                    name="code"
                    onChange={(e) =>
                      setPermission({
                        ...permission,
                        code: e.target.value,
                      })
                    }
                  /> */}
                  <Select
                    size="large"
                    value={code || undefined}
                    showSearch
                    showArrow
                    style={{ width: "100%" }}
                    placeholder={messages["placeholder.select"] as string}
                    optionFilterProp="children"
                    onChange={(e) =>
                      setPermission({
                        ...permission,
                        code: e,
                      })
                    }
                  >
                    {Object.values(PermissionEnums)
                      .filter(
                        (permission) =>
                          permissions
                            ?.map((per) => per.code)
                            .indexOf(permission) === -1
                      )
                      .map((permission, index) => (
                        <Option key={index} value={permission}>
                          {permission}
                        </Option>
                      ))}
                  </Select>
                </Col>
              </Row>
              <Row>
                <Col xs={24} lg={24}>
                  <label htmlFor="description" className="label">
                    {messages["common.description"] as string}{" "}
                  </label>
                  <TextArea
                    name="description"
                    placeholder={messages["placeholder.textarea"] as string}
                    value={description}
                    rows={3}
                    onChange={(e) =>
                      setPermission({
                        ...permission,
                        description: e.target.value,
                      })
                    }
                  />
                </Col>
              </Row>
            </Modal>
          </AppCard>
        </Col>
      </AppRowContainer>
    </>
  );
};

export default AdminManagerPermission(Permissions);
