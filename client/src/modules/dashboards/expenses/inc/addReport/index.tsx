import { currencies } from "@crema/constants/AppConst";
import { useJWTAuth } from "@crema/services/auth/jwt-auth/JWTAuthProvider";
import { UserType } from "@crema/types/models/dashboards/UserType";
import { Button, Col, Input, Modal, Row, Select } from "antd";
import { StyledRequiredField } from "modules/dashboards/index.styled";
import { IoReturnUpBackOutline } from "react-icons/io5";
import { LuCheckCircle } from "react-icons/lu";
import { useIntl } from "react-intl";
import { StatusEnums, UsersRolesEnums } from "utils/common-constants.utils";

type Props = {
  users: UserType[];
  report: any;
  isReportDrawerOpen: boolean;
  handleOnAddReport: () => void;
  setReportDrawerOpen: () => void;
  setReport: (data: any) => void;
  loading: boolean;
};

const AddReport = ({
  users,
  report,
  isReportDrawerOpen,
  setReportDrawerOpen,
  setReport,
  handleOnAddReport,
  loading,
}: Props) => {
  // States
  const { user } = useJWTAuth();

  // Destruction
  const { Option } = Select;
  const { employee, title, currency } = report;
  const { messages } = useIntl();

  // Functions
  const handleOnValidate = () => {
    return !!employee?.length && !!title?.length && !!currency?.length
      ? false
      : true;
  };

  // Render
  return (
    <Modal
      open={isReportDrawerOpen}
      title={messages["dashboard.report.create"] as string}
      onOk={handleOnAddReport}
      onCancel={setReportDrawerOpen}
      footer={[
        <Button
          key="back"
          className="tt-expenses-space-center"
          onClick={setReportDrawerOpen}
        >
          <IoReturnUpBackOutline className="tt-expenses-margin-btn-icon" />{" "}
          {messages["common.back"] as string}
        </Button>,
        <Button
          key="submit"
          type="primary"
          className="tt-expenses-space-center"
          loading={loading}
          onClick={handleOnAddReport}
          disabled={handleOnValidate()}
        >
          <LuCheckCircle className="tt-expenses-margin-btn-icon" />
          {messages["common.submit"] as string}
        </Button>,
      ]}
    >
      <Row>
        <Col xs={24} lg={24}>
          <label htmlFor="employee" className="label">
            {messages["common.employee"] as string}{" "}
            <StyledRequiredField>*</StyledRequiredField>
          </label>
          <Select
            size="large"
            value={employee || undefined}
            showSearch
            showArrow
            disabled={user.role === UsersRolesEnums.USER}
            style={{ width: "100%" }}
            placeholder={messages["placeholder.select"] as string}
            optionFilterProp="children"
            onChange={(e) => setReport({ ...report, employee: e })}
          >
            {users
              ?.filter((user) => user.status === StatusEnums.ACTIVE)
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
          <label htmlFor="title" className="label">
            {messages["common.title"] as string}{" "}
            <StyledRequiredField>*</StyledRequiredField>
          </label>
          <Input
            placeholder={messages["placeholder.input"] as string}
            value={title}
            size="large"
            name="title"
            onChange={(e) =>
              setReport({
                ...report,
                title: e.target.value,
              })
            }
          />
        </Col>
      </Row>
      <Row>
        <Col xs={24} lg={24}>
          <label htmlFor="currency" className="label">
            {messages["common.currency"] as string}{" "}
            <StyledRequiredField>*</StyledRequiredField>
          </label>
          <Select
            size="large"
            value={currency || undefined}
            showSearch
            showArrow
            style={{ width: "100%" }}
            placeholder={messages["placeholder.select"] as string}
            optionFilterProp="children"
            onChange={(e) => setReport({ ...report, currency: e })}
          >
            {currencies.map((currency, index) => (
              <Option key={index} value={currency.value}>
                {currency.label}
              </Option>
            ))}
          </Select>
        </Col>
      </Row>
    </Modal>
  );
};

export default AddReport;
