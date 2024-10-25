import AppCard from "@crema/components/AppCard";
import { FilterUserType } from "@crema/types/models/dashboards/UserType";
import React from "react";
import dayjs from "dayjs";
import { StyledFormWrapper, StyledText } from "../index.styled";
import AppRowContainer from "@crema/components/AppRowContainer";
import {
  Avatar,
  Button,
  Col,
  DatePicker,
  InputNumber,
  Radio,
  Row,
  Select,
  Switch,
  Typography,
} from "antd";
import {
  useUserActionsContext,
  useUserContext,
} from "modules/apps/context/UserContextProvider";
import { useOrganizationContext } from "modules/apps/context/OrganizationContextProvider";
import { useIntl } from "react-intl";
import IntlMessages from "@crema/helpers/IntlMessages";
import {
  FORMAT_DATE_FOURTH,
  GenderEnums,
  UserStatusEnums,
} from "utils/common-constants.utils";
import { Tt_GetStatusUser } from "utils";
import { useRoleContext } from "modules/apps/context/RoleContextProvider";
import { FaFilterCircleXmark } from "react-icons/fa6";

type Props = {
  filterUserData: FilterUserType;
  setFilterUserData: React.Dispatch<React.SetStateAction<FilterUserType>>;
};

const FilterUsersItem = ({ filterUserData, setFilterUserData }: Props) => {
  // States
  const { messages } = useIntl();
  const { users, loading, user, mode, isAppDrawerOpen } = useUserContext();
  const { handleOnFilterUser } = useUserActionsContext();
  const { organizations } = useOrganizationContext();
  const { roles } = useRoleContext();

  // Destructing
  const { RangePicker } = DatePicker;
  const { Option } = Select;
  const { gender, status, organization, role, tmpPassword } = filterUserData;

  // Functions
  const handleOnResetFilter = () => {
    setFilterUserData({
      organization: "",
      status: "",
      tmpPassword: "",
      role: "",
      gender: "",
      //createdAt: { start: "", end: "" },
    });
  };

  const rangePresets = [
    {
      label: "This Month",
      value: [dayjs().startOf("month"), dayjs().endOf("month")],
    },
  ];

  // Return
  return (
    <AppCard title={messages["common.filter"] as string}>
      <StyledFormWrapper>
        <Row>
          <Col xs={24} lg={24}>
            <label htmlFor="gender" className="label">
              {messages["common.gender"] as string}
            </label>
            <br />
            <Radio.Group
              onChange={(value) => {
                setFilterUserData((prev) => ({
                  ...prev,
                  gender: value.target.value,
                }));
              }}
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
          <Col xs={24} md={24}>
            <label htmlFor="status" className="label">
              <IntlMessages id="common.status" />
            </label>
            <Select
              value={status || undefined}
              showSearch
              showArrow
              allowClear
              style={{ width: "100%" }}
              placeholder={<IntlMessages id="placeholder.select" />}
              optionLabelProp="label"
              optionFilterProp="label"
              onChange={(value) =>
                setFilterUserData({ ...filterUserData, status: value })
              }
            >
              {Object.values(UserStatusEnums)?.map((statut, index) => (
                <Option
                  key={index}
                  value={statut}
                  label={
                    <span className="tt-expenses-space-start">
                      {Tt_GetStatusUser(statut)}
                      <IntlMessages
                        id={`common.status.${statut
                          .replaceAll("_", ".")
                          .toLocaleLowerCase()}`}
                      />
                    </span>
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
        <Row>
          <Col xs={24} md={24}>
            <label htmlFor="groups" className="label">
              <IntlMessages id="common.organization" />
            </label>
            <Select
              value={organization || undefined}
              showSearch
              showArrow
              allowClear
              style={{ width: "100%" }}
              placeholder={<IntlMessages id="placeholder.select" />}
              optionLabelProp="label"
              optionFilterProp="label"
              onChange={(value) => {
                setFilterUserData((prev) => ({
                  ...prev,
                  organization: value,
                }));
              }}
            >
              {organizations?.map((org, index) => (
                <Option key={index} value={org._id} label={org.name}>
                  <div className="tt-expenses-space-start">
                    <Avatar
                      size={30}
                      key={"organization-" + index}
                      alt={org.name}
                      src={
                        org.logo?.secure_url
                          ? org.logo?.secure_url
                          : "/assets/icon/default-org.jpg"
                      }
                    />
                    <div>
                      <Typography.Title
                        level={5}
                        style={{ fontSize: 12, marginBottom: 0 }}
                      >
                        {org?.name}
                      </Typography.Title>
                      <StyledText>{org?.code}</StyledText>
                    </div>
                  </div>
                </Option>
              ))}
            </Select>
          </Col>
        </Row>
        <Row>
          <Col xs={24} lg={24}>
            <label htmlFor="role" className="label">
              {messages["common.role"] as string}
            </label>
            <Select
              value={role || undefined}
              showSearch
              showArrow
              allowClear
              style={{ width: "100%" }}
              placeholder={messages["placeholder.select"] as string}
              optionFilterProp="children"
              onChange={(value) => {
                setFilterUserData((prev) => ({
                  ...prev,
                  role: value,
                }));
              }}
            >
              {roles?.map((role, index) => (
                <Option key={index} value={role.title}>
                  {
                    <IntlMessages
                      id={`common.role.${role.title.toLowerCase()}`}
                    />
                  }
                </Option>
              ))}
            </Select>
          </Col>
        </Row>
        {/* <Row>
          <Col xs={24} md={24}>
            <label htmlFor="createdAt" className="label">
              {messages["common.from.to"] as string}
            </label>
            <RangePicker
              format={FORMAT_DATE_FOURTH}
              allowClear={true}
              onChange={(value, dateString) =>
                setFilterUserData({
                  ...filterUserData,
                  createdAt: {
                    start: dateString[0],
                    end: dateString[1],
                  },
                })
              }
            />
          </Col>
        </Row> */}
        <Row>
          <Col xs={24} lg={24}>
            <label htmlFor="tmpPassword" className="label">
              {messages["common.tmp.password"] as string}
            </label>
            <br />
            <Radio.Group
              onChange={(value) =>
                setFilterUserData({
                  ...filterUserData,
                  tmpPassword: value.target.value,
                })
              }
              value={tmpPassword}
            >
              <Radio value={"true"}>{messages["common.yes"] as string}</Radio>
              <Radio value={"false"}>{messages["common.no"] as string}</Radio>
            </Radio.Group>
          </Col>
        </Row>
        {/* <Row>
          <Col xs={24} lg={24}>
            <Switch
              onChange={(value) => {
                setFilterUserData((prev) => ({
                  ...prev,
                  tmpPassword: String(value),
                }));
              }}
            />
            <span className="notification">
              {messages["common.tmp.password"] as string}
            </span>
          </Col>
        </Row> */}
        <Row>
          <Col className="mt-10" xs={24} lg={24} md={24}>
            <Button
              key="reset"
              type="primary"
              onClick={handleOnResetFilter}
              className="tt-expenses-space-center"
            >
              <FaFilterCircleXmark className="tt-expenses-margin-btn-icon" />{" "}
              {messages["common.reset"] as string}
            </Button>
          </Col>
        </Row>
      </StyledFormWrapper>
    </AppCard>
  );
};

export default FilterUsersItem;
