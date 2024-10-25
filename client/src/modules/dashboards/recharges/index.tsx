import AppPageMeta from "@crema/components/AppPageMeta";
import AdminPermission from "@crema/core/components/middlewares/AdminPermission";
import React, { useState } from "react";
import { useIntl } from "react-intl";
import { StyledContent, StyledRequiredField } from "../index.styled";
import { StyledTitle5 } from "modules/ecommerce/Admin/index.styled";
import { PermissionEnums } from "utils/permissions.utils";
import SecuredPermission from "@crema/core/components/middlewares/SecuredPermission";
import { Button, Col, Input, Modal, Row, Select } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import IntlMessages from "@crema/helpers/IntlMessages";
import {
  useRechargeActionsContext,
  useRechargeContext,
} from "modules/apps/context/RechargeContextProvider";
import AppRowContainer from "@crema/components/AppRowContainer";
import AppCard from "@crema/components/AppCard";
import AppsHeader from "@crema/components/AppsContainer/AppsHeader";
import {
  StyledOrderFooterPagination,
  StyledOrderHeader,
  StyledOrderHeaderInputView,
  StyledOrderHeaderPagination,
} from "modules/ecommerce/Orders/index.styled";
import {
  MODE_ADD,
  PAGE_SIZE_DEFAULT,
  StatusEnums,
  UsersRolesEnums,
} from "utils/common-constants.utils";
import { IoReturnUpBackOutline } from "react-icons/io5";
import { LuCheckCircle } from "react-icons/lu";
import { useUserContext } from "modules/apps/context/UserContextProvider";
import { RechargeType } from "@crema/types/models/dashboards/RechargeType";
import RechargeTable from "@crema/modules/dashboards/Recharges/rechargesTable";
import { currencies } from "@crema/constants/AppConst";
import { useJWTAuth } from "@crema/services/auth/jwt-auth/JWTAuthProvider";

const Recharges = () => {
  // States
  const { messages } = useIntl();
  const [filterData, setFilterData] = useState("");
  const { rechargeList, loading, page, isAppDrawerOpen, mode, recharge } =
    useRechargeContext();
  const {
    handleOnAddRecharge,
    onPageChange,
    handleOnSubmit,
    handleOnUpdate,
    setRecharge,
    setAppDrawerOpen,
  } = useRechargeActionsContext();
  const { users } = useUserContext();

  // Desctruction
  const { user } = useJWTAuth();
  const { amount, employee, currency } = recharge;
  const { Option } = Select;

  // Functions
  const onGetFilteredItems = () => {
    if (filterData === "") {
      return rechargeList?.data;
    } else {
      return rechargeList.data.filter(
        (recharge: RechargeType) =>
          recharge.employee.displayName
            .toUpperCase()
            .includes(filterData.toUpperCase()) ||
          recharge.employee.email
            .toUpperCase()
            .includes(filterData.toUpperCase())
      );
    }
  };

  const handleOnValidate = () => {
    return amount > 0 && !!employee?.length && !!currency?.length
      ? false
      : true;
  };

  const list = onGetFilteredItems();

  // Render
  return (
    <>
      <AppPageMeta title={messages["common.recharges"] as string} />
      <StyledContent>
        <StyledTitle5>{messages["common.recharges"] as string}</StyledTitle5>
        <SecuredPermission
          permission={PermissionEnums.ADD_RECHARGE}
          component={
            <Button
              type="primary"
              className="btn"
              onClick={handleOnAddRecharge}
            >
              <PlusOutlined /> <IntlMessages id="common.recharge" />
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
                    count={rechargeList?.count || 0}
                    page={page}
                    onChange={onPageChange}
                  />
                </StyledOrderHeader>
              </AppsHeader>
            }
          >
            <RechargeTable rechargeData={list || []} loading={loading} />
            {rechargeList?.data?.length > 0 && (
              <StyledOrderFooterPagination
                pageSize={PAGE_SIZE_DEFAULT}
                count={rechargeList?.count || 0}
                page={page}
                onChange={(data) => onPageChange(data)}
              />
            )}
            {/* Add and Update Recharge */}
            <Modal
              maskClosable={false}
              open={isAppDrawerOpen}
              title={
                messages[
                  mode === MODE_ADD
                    ? "dashboard.recharge.create"
                    : "dashboard.recharge.update"
                ] as string
              }
              onOk={
                mode === MODE_ADD
                  ? handleOnSubmit
                  : () => handleOnUpdate(recharge._id, recharge)
              }
              onCancel={() => setAppDrawerOpen(!isAppDrawerOpen)}
              footer={[
                <Button
                  key="back"
                  className="tt-expenses-space-center"
                  onClick={() => {
                    setRecharge({});
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
                      : () => handleOnUpdate(recharge._id, recharge)
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
                    {messages["common.employee"] as string}{" "}
                    <StyledRequiredField>*</StyledRequiredField>
                  </label>
                  <Select
                    size="large"
                    value={employee || undefined}
                    showSearch
                    showArrow
                    style={{ width: "100%" }}
                    placeholder={messages["placeholder.select"] as string}
                    optionFilterProp="children"
                    onChange={(e) => setRecharge({ ...recharge, employee: e })}
                  >
                    {users
                      ?.filter(
                        (user) =>
                          user.status === StatusEnums.ACTIVE &&
                          user.role === UsersRolesEnums.USER
                      )
                      ?.map((user, index) => (
                        <Option key={index} value={user._id}>
                          {user.displayName}
                        </Option>
                      ))}
                  </Select>
                </Col>
              </Row>
              <Row>
                <Col xs={24} lg={24}>
                  <div className="tt-expenses-d-flex">
                    <Col
                      xs={24}
                      lg={10}
                      className="tt-expenses-without-padding"
                    >
                      <label htmlFor="amount" className="label">
                        {messages["common.amount"] as string}
                        <StyledRequiredField>*</StyledRequiredField>
                      </label>
                      <Input
                        name="amount"
                        size="large"
                        value={amount}
                        placeholder={messages["placeholder.input"] as string}
                        onChange={(e) =>
                          setRecharge({
                            ...recharge,
                            amount: e.target.value.replace(/\D/g, ""), // Accept only numbers
                          })
                        }
                      />
                    </Col>
                    <Col xs={24} lg={10}>
                      <label htmlFor="currency" className="label">
                        {messages["common.currency"] as string}
                        <StyledRequiredField>*</StyledRequiredField>
                      </label>
                      <Select
                        size="large"
                        defaultValue={user.settings.currency}
                        value={currency || undefined}
                        showSearch
                        showArrow
                        style={{ width: "100%" }}
                        placeholder={messages["placeholder.select"] as string}
                        optionFilterProp="children"
                        onChange={(e) =>
                          setRecharge({ ...recharge, currency: e })
                        }
                      >
                        {currencies.map((currency, index) => (
                          <Option key={index} value={currency.value}>
                            {currency.label}
                          </Option>
                        ))}
                      </Select>
                    </Col>
                  </div>
                </Col>
              </Row>
            </Modal>
          </AppCard>
        </Col>
      </AppRowContainer>
    </>
  );
};

export default AdminPermission(Recharges);
