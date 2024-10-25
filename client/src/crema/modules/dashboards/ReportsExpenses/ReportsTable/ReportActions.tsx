import AppIconButton from "@crema/components/AppIconButton";
import { currencies } from "@crema/constants/AppConst";
import { useJWTAuth } from "@crema/services/auth/jwt-auth/JWTAuthProvider";
import {
  Button,
  Col,
  Drawer,
  Dropdown,
  Input,
  Row,
  Select,
  Space,
  Typography,
} from "antd";
import {
  useExpenseActionsContext,
  useExpenseContext,
} from "modules/apps/context/ExpenseContextProvider";
import { StyledRequiredField } from "modules/dashboards/index.styled";
import { useRouter } from "next/router";
import { useState } from "react";
import { CiCircleMore, CiEdit, CiTrash } from "react-icons/ci";
import { IoReturnUpBackOutline } from "react-icons/io5";
import { LuCheckCircle } from "react-icons/lu";
import { VscEye } from "react-icons/vsc";
import { useIntl } from "react-intl";
import { StatusEnums, UsersRolesEnums } from "utils/common-constants.utils";

const ReportActions = ({ reportData }) => {
  // States
  const router = useRouter();
  const { user } = useJWTAuth();
  const {
    setReport,
    handleOnGetReport,
    handleOnUpdateReport,
    handleOnDeleteReport,
  } = useExpenseActionsContext();
  useExpenseActionsContext();
  const { users, loadingReport, report } = useExpenseContext();
  const [isAppEditDrawer, setIsAppEditDrawer] = useState(false);

  // Destructing
  const { messages } = useIntl();
  const { Option } = Select;
  const { employee, employeeId, title, currency, code } = report;

  // Init
  const items = [
    {
      key: 1,
      label: (
        <Space wrap>
          <Typography.Link
            onClick={() =>
              router.push(`/dashboards/report_detail/${reportData._id}`)
            }
            style={{ display: "flex", alignItems: "center" }}
          >
            <VscEye className="tt-expenses-primary tt-expenses-margin-btn-icon" />{" "}
            {messages["common.view"] as string}
          </Typography.Link>
        </Space>
      ),
    },
    {
      key: 2,
      label: (
        <Space wrap>
          <span style={{ fontSize: 14 }} className="tt-expenses-space-center">
            <CiEdit className="tt-expenses-secondary tt-expenses-margin-btn-icon" />{" "}
            {messages["common.edit"] as string}
          </span>
        </Space>
      ),
    },
    {
      key: 3,
      label: (
        <Space wrap>
          <span style={{ fontSize: 14 }} className="tt-expenses-space-center">
            <CiTrash className="tt-expenses-tomato tt-expenses-margin-btn-icon" />{" "}
            {messages["common.delete"] as string}
          </span>
        </Space>
      ),
    },
  ];

  // Functions
  const onMenuClick = ({ item, key }: { item: any; key: string }) => {
    switch (key) {
      case "1":
        break;
      case "2":
        handleOnGetReport(reportData._id);
        setIsAppEditDrawer(!isAppEditDrawer);
        break;
      case "3":
        handleOnDeleteReport(reportData._id);
        break;
      default:
        break;
    }
  };

  const handleOnValidate = () => {
    return !!employeeId?.length && !!title?.length && !!currency?.length
      ? false
      : true;
  };

  const handleOnSubmitReport = () => {
    handleOnUpdateReport(reportData._id, report);
    setIsAppEditDrawer(!isAppEditDrawer);
  };

  // Render
  return (
    <>
      <Dropdown menu={{ items, onClick: onMenuClick }} trigger={["click"]}>
        <AppIconButton icon={<CiCircleMore />} />
      </Dropdown>
      {/* Update Report */}
      <Drawer
        title={messages["dashboard.report.update"] as string}
        placement={"right"}
        open={isAppEditDrawer}
        onClose={() => setIsAppEditDrawer(!isAppEditDrawer)}
        footer={
          <Space>
            <Button
              key="back"
              onClick={() => setIsAppEditDrawer(!isAppEditDrawer)}
              className="tt-expenses-space-center"
            >
              <IoReturnUpBackOutline className="tt-expenses-margin-btn-icon" />{" "}
              {messages["common.back"] as string}
            </Button>
            ,
            <Button
              key="submit"
              type="primary"
              className="tt-expenses-space-center"
              loading={loadingReport}
              onClick={handleOnSubmitReport}
              disabled={handleOnValidate()}
            >
              <LuCheckCircle className="tt-expenses-margin-btn-icon" />
              {messages["common.update"] as string}
            </Button>
          </Space>
        }
      >
        <Row>
          <Col xs={24} lg={24}>
            <label htmlFor="code" className="label">
              {messages["common.code"] as string}{" "}
            </label>
            <Input
              placeholder={messages["placeholder.input"] as string}
              value={code}
              size="large"
              name="cocde"
              disabled={true}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={24} lg={24}>
            <label htmlFor="employee" className="label">
              {messages["common.employee"] as string}{" "}
              <StyledRequiredField>*</StyledRequiredField>
            </label>
            <Select
              size="large"
              value={employeeId || undefined}
              showSearch
              showArrow
              style={{ width: "100%" }}
              placeholder={messages["placeholder.select"] as string}
              optionFilterProp="children"
              disabled={user.role === UsersRolesEnums.USER}
              onChange={(e) =>
                setReport({ ...report, employeeId: e, employee: e })
              }
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
      </Drawer>
    </>
  );
};

export default ReportActions;
