import IntlMessages from "@crema/helpers/IntlMessages";
import {
  ReportExpenseType,
  ReportType,
} from "@crema/types/models/dashboards/ReportType";
import { Button, Col, Input, Modal, Row, Tooltip } from "antd";
import { ColumnsType } from "antd/es/table";
import {
  useAccountingActionsContext,
  useAccountingContext,
} from "modules/apps/context/AccountingContextProvider";
import {
  useExpenseActionsContext,
  useExpenseContext,
} from "modules/apps/context/ExpenseContextProvider";
import { StyledRequiredField } from "modules/dashboards/index.styled";
import moment from "moment";
import { NextRouter, useRouter } from "next/router";
import { IoMdAttach } from "react-icons/io";
import { IoReturnUpBackOutline } from "react-icons/io5";
import { LuCheckCircle } from "react-icons/lu";
import {
  FORMAT_DATE_ONE,
  FORMAT_DATE_TWO,
  StatusExpenseEnums,
} from "utils/common-constants.utils";
import {
  Tt_FormatDate,
  Tt_GetStatusExpense,
  Tt_GetUser,
} from "utils/common-functions.utils";
import ExpenseView from "../../ReportsExpenses/ExpensesTable/ExpenseView";
import { StyledFlex, StyledObjectTable } from "../../index.styled";
import AccountingActions from "./AccountingActions";

const getColumns = (router: NextRouter): ColumnsType<ReportExpenseType> => [
  {
    title: <IntlMessages id="common.attachments" />,
    dataIndex: "expenseAttachments",
    key: "expenseAttachments",
    render: (data, record) => (
      <Tooltip
        title={
          record.expense.attachments?.length === 0 ? (
            <IntlMessages id="common.no.attachments" />
          ) : (
            <span>
              {record.expense.attachments.length}{" "}
              <IntlMessages id="common.attachments" />
            </span>
          )
        }
      >
        <div
          //onClick={() => handleOnShowAttachments(record.attachments)}
          style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
        >
          <IoMdAttach
            style={{
              fontSize: 16,
              color:
                record.expense.attachments?.length === 0
                  ? "#d12420"
                  : "#2a7a39",
            }}
          />
          <span style={{ fontWeight: "600" }}>
            ({record.expense.attachments?.length})
          </span>
        </div>
      </Tooltip>
    ),
  },
  {
    title: <IntlMessages id="common.report.title" />,
    dataIndex: "reportTitle",
    key: "reportTitle",
    render: (id, record) => (
      <span className="tt-expenses-primary">{record.report.title}</span>
    ),
  },
  {
    title: <IntlMessages id="common.report.code" />,
    dataIndex: "reportCode",
    key: "reportCode",
    render: (id, record) => <span>{record.report.code}</span>,
  },
  {
    title: <IntlMessages id="common.employee" />,
    dataIndex: "expenseEmployee",
    key: "expenseEmployee",
    render: (id, record) => Tt_GetUser(record.expense.employee),
  },
  {
    title: <IntlMessages id="common.submission.date" />,
    dataIndex: "expenseSubmissionDate",
    key: "expenseSubmissionDate",
    render: (id, record) => (
      <>
        {record.expense.submission_date ? (
          <span>
            {Tt_FormatDate(
              moment(record.expense.submission_date).format(FORMAT_DATE_ONE)
            )}{" "}
            <br />
            <i>
              {moment(record.expense.submission_date).format(FORMAT_DATE_TWO)}
            </i>
          </span>
        ) : (
          "-"
        )}
      </>
    ),
  },
  {
    title: <IntlMessages id="common.role.manager" />,
    dataIndex: "expenseApprover",
    key: "expenseApprover",
    render: (id, record) => Tt_GetUser(record.expense.approver),
  },
  {
    title: <IntlMessages id="common.approvation.date" />,
    dataIndex: "expenseApprovalDate",
    key: "expenseApprovalDate",
    render: (id, record) => (
      <>
        {record.expense.approvation_date ? (
          <span>
            {Tt_FormatDate(
              moment(record.expense.approvation_date).format(FORMAT_DATE_ONE)
            )}{" "}
            <br />
            <i>
              {moment(record.expense.approvation_date).format(FORMAT_DATE_TWO)}
            </i>
          </span>
        ) : (
          "-"
        )}
      </>
    ),
  },
  {
    title: <IntlMessages id="common.status" />,
    dataIndex: "expenseStatus",
    key: "expenseStatus",
    render: (id, record) => (
      <span>{Tt_GetStatusExpense(record.expense.currentStatus)}</span>
    ),
  },
  {
    title: <IntlMessages id="common.total.amount" />,
    dataIndex: "expenseAmount",
    key: "expenseAmount",
    render: (data, record) => (
      <StyledFlex>
        <b>{record.expense.amount.toLocaleString()}</b>
        <span className="ml-3">{record.expense.currency}</span>
      </StyledFlex>
    ),
  },
  {
    title: <IntlMessages id="common.actions" />,
    dataIndex: "actions",
    key: "actions",
    className: "order-table-action",
    fixed: "right",
    render: (text, record) => <AccountingActions expense={record.expense} />,
  },
];

type Props = {
  reportData: ReportType[];
  loading: boolean;
};

const AccountingTable = ({ reportData, loading }: Props) => {
  // States
  const router = useRouter();
  const { isAppDrawerOpen, expense } = useExpenseContext();
  const { setAppDrawerOpen } = useExpenseActionsContext();
  const { isReject, comment, isApproval } = useAccountingContext();
  const { setIsReject, setComment, handleOnAccountingExpense, setIsApproval } =
    useAccountingActionsContext();

  // Destructing
  const { TextArea } = Input;

  // Functions
  const getReportExpenses = () => {
    let reportExpenses: ReportExpenseType[] = [];
    reportData.map((report) => {
      report.expenses.map((expense) => {
        reportExpenses.push({
          report: report,
          expense: expense,
        });
      });
    });
    return reportExpenses;
  };

  // Render
  return (
    <>
      <StyledObjectTable
        hoverColor
        data={getReportExpenses()}
        loading={loading}
        columns={getColumns(router)}
        scroll={{ x: "auto" }}
      />
      {isAppDrawerOpen && (
        <ExpenseView
          expense={expense}
          isAppDrawerOpen={isAppDrawerOpen}
          setAppDrawerOpen={setAppDrawerOpen}
        />
      )}
      {/* Reject Expense */}
      <Modal
        maskClosable={false}
        title={<IntlMessages id="dashboard.expense.reject" />}
        open={isReject}
        onOk={() =>
          handleOnAccountingExpense(
            expense.expenseId,
            StatusExpenseEnums.REJECTED,
            comment
          )
        }
        onCancel={() => setIsReject(!isReject)}
        footer={[
          <Button
            key="back"
            onClick={() => setIsReject(!isReject)}
            className="tt-expenses-space-center"
          >
            <IoReturnUpBackOutline className="tt-expenses-margin-btn-icon" />{" "}
            <IntlMessages id="common.back" />
          </Button>,
          <Button
            key="submit"
            type="primary"
            className="tt-expenses-space-center"
            onClick={() =>
              handleOnAccountingExpense(
                expense.expenseId,
                StatusExpenseEnums.REJECTED,
                comment
              )
            }
            disabled={!(comment.length >= 5)}
          >
            <LuCheckCircle className="tt-expenses-margin-btn-icon" />{" "}
            <IntlMessages id="common.submit" />
          </Button>,
        ]}
      >
        <Row>
          <Col xs={24} lg={24}>
            <label htmlFor="comment" className="label">
              <IntlMessages id="common.comments" />{" "}
              <StyledRequiredField>*</StyledRequiredField>
            </label>
            <TextArea
              name="comment"
              value={comment}
              rows={3}
              onChange={(e) => setComment(e.target.value)}
            />
            <span className="tt-expenses-tomato">Maximun 5 letters</span>
          </Col>
        </Row>
      </Modal>
      {/* Approval Expense */}
      <Modal
        maskClosable={false}
        title={<IntlMessages id="dashboard.expense.approval" />}
        open={isApproval}
        onOk={() =>
          handleOnAccountingExpense(
            expense._id,
            StatusExpenseEnums.VALID,
            comment
          )
        }
        onCancel={() => setIsApproval(!isApproval)}
        footer={[
          <Button
            key="back"
            onClick={() => setIsApproval(!isApproval)}
            className="tt-expenses-space-center"
          >
            <IoReturnUpBackOutline className="tt-expenses-margin-btn-icon" />{" "}
            <IntlMessages id="common.back" />
          </Button>,
          <Button
            key="submit"
            type="primary"
            className="tt-expenses-space-center"
            onClick={() =>
              handleOnAccountingExpense(
                expense._id,
                StatusExpenseEnums.VALID,
                comment
              )
            }
          >
            <LuCheckCircle className="tt-expenses-margin-btn-icon" />{" "}
            <IntlMessages id="common.submit" />
          </Button>,
        ]}
      >
        <Row>
          <Col xs={24} lg={24}>
            <IntlMessages id="common.modal.expense.confirm.submit" />
          </Col>
        </Row>
        <Row>
          <Col xs={24} lg={24}>
            <label htmlFor="comment" className="label">
              <IntlMessages id="common.comments" />{" "}
            </label>
            <TextArea
              name="comment"
              value={comment}
              rows={3}
              onChange={(e) => setComment(e.target.value)}
            />
          </Col>
        </Row>
      </Modal>
    </>
  );
};

export default AccountingTable;
