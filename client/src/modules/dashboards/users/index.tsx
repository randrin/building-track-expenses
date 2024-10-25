import { PlusOutlined } from "@ant-design/icons";
import AppCard from "@crema/components/AppCard";
import AppPageMeta from "@crema/components/AppPageMeta";
import AppRowContainer from "@crema/components/AppRowContainer";
import AppsHeader from "@crema/components/AppsContainer/AppsHeader";
import LegendUserStatus from "@crema/core/components/commons/LegendUserStatus";
import AdminManagerPermission from "@crema/core/components/middlewares/AdminManagerPermission";
import IntlMessages from "@crema/helpers/IntlMessages";
import FilterUsersItem from "@crema/modules/dashboards/users/FilterUsersItem";
import UsersTable from "@crema/modules/dashboards/users/usersTable";
import {
  FilterUserType,
  UserType,
} from "@crema/types/models/dashboards/UserType";
import {
  Avatar,
  Button,
  Col,
  DatePicker,
  Divider,
  Input,
  Modal,
  Radio,
  Row,
  Select,
} from "antd";
import dayjs from "dayjs";
import {
  useOrganizationActionsContext,
  useOrganizationContext,
} from "modules/apps/context/OrganizationContextProvider";
import { useRoleContext } from "modules/apps/context/RoleContextProvider";
import {
  useUserActionsContext,
  useUserContext,
} from "modules/apps/context/UserContextProvider";
import { StyledTitle5 } from "modules/ecommerce/Admin/index.styled";
import {
  StyledOrderFooterPagination,
  StyledOrderHeader,
  StyledOrderHeaderInputView,
  StyledOrderHeaderPagination,
} from "modules/ecommerce/Orders/index.styled";
import moment from "moment";
import { useEffect, useState } from "react";
import { IoReturnUpBackOutline } from "react-icons/io5";
import { LuCheckCircle } from "react-icons/lu";
import { useIntl } from "react-intl";
import {
  FORMAT_DATE_FOURTH,
  GenderEnums,
  MODE_ADD,
  PAGE_SIZE_DEFAULT,
  StatusEnums,
} from "utils/common-constants.utils";
import { StyledContent, StyledRequiredField } from "../index.styled";
import { useRouter } from "next/router";
import { currencies } from "@crema/constants/AppConst";
import { useUtilContext } from "modules/apps/context/UtilContextProvider";

const Users = () => {
  // States
  const { push, query } = useRouter();
  const { messages } = useIntl();
  const { userList, loading, user, mode, page, isAppDrawerOpen, departments } =
    useUserContext();
  const {
    onPageChange,
    handleOnGetDepartmentsByOrganization,
    handleOnFilterUser,
  } = useUserActionsContext();
  const { organizations } = useOrganizationContext();
  const { reCallAPI } = useOrganizationActionsContext();
  const { roles } = useRoleContext();
  const { countriesFilter } = useUtilContext();
  const {
    handleOnAddUser,
    handleOnSubmitUser,
    setUser,
    setAppDrawerOpen,
    handleOnUpdateUser,
  } = useUserActionsContext();
  const [filterData, setFilterData] = useState("");
  const [filterUserData, setFilterUserData] = useState<FilterUserType>({
    organization: "",
    status: "",
    tmpPassword: "",
    role: "",
    gender: "",
    //createdAt: { start: "", end: "" },
  });

  // Destructing
  const { Option } = Select;
  const {
    firstName,
    lastName,
    email,
    contact,
    salary,
    role,
    gender,
    dateOfBorn,
    organization,
    department,
  } = user;

  // Init
  useEffect(() => {
    //   push({
    //     query: {
    //       ...query,
    //       status: filterUserData.status,
    //       organization: filterUserData.organization,
    //       role: filterUserData.role,
    //       gender: filterUserData.gender,
    //       tmpPassword: filterUserData.tmpPassword,
    //       // createdAt: [
    //       //   filterUserData.createdAt.start,
    //       //   filterUserData.createdAt.end,
    //       // ].join(","),
    //     },
    //   });
    console.log(filterUserData);

   // handleOnFilterUser(filterUserData);
  }, [filterUserData]);

  // Functions
  const onGetFilteredItems = () => {
    if (filterData === "") {
      return userList?.data;
    } else {
      return userList?.data.filter((user: UserType) =>
        user.displayName.toUpperCase().includes(filterData.toUpperCase())
      );
    }
  };

  const handleOnValidate = () => {
    return !!firstName?.length &&
      !!lastName?.length &&
      !!email?.length &&
      !!salary?.amount &&
      !!salary?.currency?.length &&
      !!gender?.length &&
      !!role?.length &&
      (mode === MODE_ADD
        ? !!organization?.length && !!department?.length
        : true) &&
      !!moment(dateOfBorn).format(FORMAT_DATE_FOURTH)?.length &&
      !!contact?.phonePrefix?.length &&
      !!contact?.phoneNumber
      ? false
      : true;
  };

  const list = onGetFilteredItems();

  // Render
  return (
    <>
      <AppPageMeta title={messages["common.users"] as string} />
      <div className="tt-expenses-space-between">
        <StyledContent>
          <StyledTitle5>{messages["common.users"] as string}</StyledTitle5>
        </StyledContent>
        <StyledContent>
          <Button type="primary" className="btn" onClick={handleOnAddUser}>
            <PlusOutlined /> <IntlMessages id="common.user" />
          </Button>
        </StyledContent>
      </div>
      <AppRowContainer>
        <Row>
          <Col xs={24} lg={19}>
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
                    <LegendUserStatus />
                    <StyledOrderHeaderPagination
                      pageSize={PAGE_SIZE_DEFAULT}
                      count={userList?.count || 0}
                      page={page}
                      onChange={onPageChange}
                    />
                  </StyledOrderHeader>
                </AppsHeader>
              }
            >
              <UsersTable userData={list || []} loading={loading} />
              <StyledOrderFooterPagination
                pageSize={PAGE_SIZE_DEFAULT}
                count={userList?.count || 0}
                page={page}
                onChange={onPageChange}
              />
            </AppCard>
          </Col>
          <Col xs={24} lg={5}>
            <FilterUsersItem
              filterUserData={filterUserData}
              setFilterUserData={setFilterUserData}
            />
          </Col>
        </Row>
      </AppRowContainer>
      {/* Add and Update User */}
      <Modal
        title={
          mode === MODE_ADD
            ? (messages["dashboard.user.create"] as string)
            : (messages["dashboard.user.update"] as string)
        }
        open={isAppDrawerOpen}
        centered
        maskClosable={false}
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
                ? handleOnSubmitUser
                : () => {
                    handleOnUpdateUser(user._id, user);
                    reCallAPI();
                  }
            }
            disabled={handleOnValidate()}
          >
            <LuCheckCircle className="tt-expenses-margin-btn-icon" />{" "}
            {messages["common.submit"] as string}
          </Button>,
        ]}
      >
        <Divider orientation="left" className="tt-expenses-primary">
          <IntlMessages id="userProfile.personalInfo" />
        </Divider>
        <Row>
          <Col xs={24} lg={12}>
            <label htmlFor="gender" className="label">
              {messages["common.gender"] as string}
              <StyledRequiredField>*</StyledRequiredField>
            </label>
            <br />
            <Radio.Group
              onChange={(e) => setUser({ ...user, gender: e.target.value })}
              value={gender}
            >
              <Radio value={GenderEnums.MALE}>
                {messages["common.gender.male"] as string}
              </Radio>
              <Radio value={GenderEnums.FEMALE}>
                {messages["common.gender.female"] as string}
              </Radio>
            </Radio.Group>
          </Col>
        </Row>
        <Row>
          <Col xs={24} lg={12}>
            <label htmlFor="firstName" className="label">
              {messages["common.firstname"] as string}
              <StyledRequiredField>*</StyledRequiredField>
            </label>
            <Input
              name="firstName"
              size="large"
              value={firstName}
              placeholder={messages["placeholder.input"] as string}
              onChange={(e) => setUser({ ...user, firstName: e.target.value })}
            />
          </Col>
          <Col xs={24} lg={12}>
            <label htmlFor="lastName" className="label">
              {messages["common.lastname"] as string}
              <StyledRequiredField>*</StyledRequiredField>
            </label>
            <Input
              name="lastName"
              size="large"
              value={lastName}
              placeholder={messages["placeholder.input"] as string}
              onChange={(e) => setUser({ ...user, lastName: e.target.value })}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={24} lg={24}>
            <label htmlFor="email" className="label">
              {messages["common.email"] as string}
              <StyledRequiredField>*</StyledRequiredField>
            </label>
            <Input
              name="email"
              size="large"
              type="email"
              value={email}
              placeholder={messages["placeholder.input"] as string}
              onChange={(e) =>
                setUser({
                  ...user,
                  email: e.target.value,
                })
              }
            />
          </Col>
        </Row>
        <Row>
          <Col xs={24} lg={7}>
            <label htmlFor="phonePrefix" className="label">
              {messages["common.phone.prefix"] as string}
              <StyledRequiredField>*</StyledRequiredField>
            </label>
            <Select
              size="large"
              value={contact?.phonePrefix || undefined}
              showSearch
              showArrow
              style={{ width: "100%" }}
              placeholder={messages["placeholder.select"] as string}
              optionFilterProp="label"
              optionLabelProp="children"
              onChange={(e) =>
                setUser({
                  ...user,
                  contact: {
                    ...contact,
                    phonePrefix: e,
                  },
                })
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
          <Col xs={24} lg={9}>
            <label htmlFor="phoneNumber" className="label">
              {messages["common.phone"] as string}
              <StyledRequiredField>*</StyledRequiredField>
            </label>
            <Input
              name="phoneNumber"
              size="large"
              value={contact?.phoneNumber}
              placeholder={messages["placeholder.input"] as string}
              onChange={(e) =>
                setUser({
                  ...user,
                  contact: {
                    ...contact,
                    phoneNumber: e.target.value.replace(/\D/g, ""), // Accept only numbers
                  },
                })
              }
            />
          </Col>
          <Col xs={24} lg={8}>
            <label htmlFor="dateOfBorn" className="label">
              {messages["common.birthday"] as string}{" "}
              <StyledRequiredField>*</StyledRequiredField>
            </label>
            <br />
            <DatePicker
              size="large"
              allowClear={false}
              value={dayjs(dateOfBorn) || undefined}
              style={{ width: "100%" }}
              placeholder={messages["placeholder.select"] as string}
              name="dateOfBorn"
              onChange={(date, dateString) =>
                setUser({
                  ...user,
                  dateOfBorn: date,
                })
              }
              format={FORMAT_DATE_FOURTH}
            />
          </Col>
        </Row>
        <Divider orientation="left" className="tt-expenses-primary">
          <IntlMessages id="common.management.salary" />
        </Divider>
        <Row>
          <Col xs={24} lg={16}>
            <div className="tt-expenses-d-flex">
              <Col xs={24} lg={13} className="tt-expenses-without-padding">
                <label htmlFor="salary" className="label">
                  {messages["common.salary"] as string}
                  <StyledRequiredField>*</StyledRequiredField>
                </label>
                <Input
                  name="salary"
                  size="large"
                  value={salary?.amount}
                  placeholder={messages["placeholder.input"] as string}
                  onChange={(e) =>
                    setUser({
                      ...user,
                      salary: {
                        ...salary,
                        amount: e.target.value.replace(/\D/g, ""), // Accept only numbers,
                      },
                    })
                  }
                />
              </Col>
              <Col xs={24} lg={11}>
                <label htmlFor="currency" className="label">
                  {messages["common.currency"] as string}
                  <StyledRequiredField>*</StyledRequiredField>
                </label>
                <Select
                  size="large"
                  value={salary?.currency || undefined}
                  showSearch
                  showArrow
                  style={{ width: "100%" }}
                  placeholder={messages["placeholder.select"] as string}
                  optionFilterProp="children"
                  onChange={(e) =>
                    setUser({
                      ...user,
                      salary: {
                        ...salary,
                        currency: e,
                      },
                    })
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
        <Row>
          <Col xs={24} lg={24}>
            <label htmlFor="role" className="label">
              {messages["common.role"] as string}
              <StyledRequiredField>*</StyledRequiredField>
            </label>
            <Select
              size="large"
              value={role || undefined}
              showSearch
              showArrow
              style={{ width: "100%" }}
              placeholder={messages["placeholder.select"] as string}
              optionFilterProp="children"
              onChange={(e) => setUser({ ...user, role: e })}
            >
              {roles?.map((role, index) => (
                <Option key={index} value={role.title}>
                  <span className="tt-expenses-primary">
                    {
                      <IntlMessages
                        id={`common.role.${role.title.toLowerCase()}`}
                      />
                    }
                  </span>{" "}
                  - <i>{role.description}</i>
                </Option>
              ))}
            </Select>
          </Col>
        </Row>
        {mode === MODE_ADD && (
          <Row>
            <Col xs={24} lg={10}>
              <label htmlFor="organization" className="label">
                {messages["common.organization"] as string}
                <StyledRequiredField>*</StyledRequiredField>
              </label>
              <Select
                size="large"
                value={organization || undefined}
                showSearch
                showArrow
                style={{ width: "100%" }}
                placeholder={messages["placeholder.select"] as string}
                optionFilterProp="children"
                onChange={handleOnGetDepartmentsByOrganization}
              >
                {organizations
                  ?.filter((org) => org.status === StatusEnums.ACTIVE)
                  .map((org, index) => (
                    <Option key={index} value={org._id}>
                      {org.name}
                    </Option>
                  ))}
              </Select>
            </Col>
            <Col xs={24} lg={14}>
              <label htmlFor="department" className="label">
                {messages["common.department"] as string}
                <StyledRequiredField>*</StyledRequiredField>
              </label>
              <Select
                size="large"
                value={department || undefined}
                showSearch
                showArrow
                disabled={!organization}
                style={{ width: "100%" }}
                placeholder={messages["placeholder.select"] as string}
                optionFilterProp="children"
                onChange={(e) => setUser({ ...user, department: e })}
              >
                {departments
                  ?.filter((dpt) => dpt.status === StatusEnums.ACTIVE)
                  .map((dpt, index) => (
                    <Option key={index} value={dpt._id}>
                      {dpt.name}
                    </Option>
                  ))}
              </Select>
            </Col>
          </Row>
        )}
      </Modal>
    </>
  );
};

export default AdminManagerPermission(Users);
