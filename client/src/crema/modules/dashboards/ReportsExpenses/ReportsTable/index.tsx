import IntlMessages from "@crema/helpers/IntlMessages";
import { ExpenseType } from "@crema/types/models/dashboards/ExpenseType";
import { ReportType } from "@crema/types/models/dashboards/ReportType";
import { Typography } from "antd";
import { ColumnsType } from "antd/es/table";
import moment from "moment";
import { NextRouter, useRouter } from "next/router";
import { IoReceipt } from "react-icons/io5";
import {
  FORMAT_DATE_ONE,
  FORMAT_DATE_TWO,
  StatusExpenseEnums,
} from "utils/common-constants.utils";
import {
  Tt_FormatDate,
  Tt_GetStatusExpense,
  Tt_GetUser,
  Tt_TotalExpensesAmountByCurrency
} from "utils/common-functions.utils";
import { StyledFlex, StyledObjectTable } from "../../index.styled";
import ReportActions from "./ReportActions";

type Props = {
  reportData: ReportType[];
  loading: boolean;
};

const ReportTable = ({ reportData, loading }: Props) => {
  // States
  const router = useRouter();

  // Functions
  const getColumns = (router: NextRouter): ColumnsType<ReportType> => [
    {
      title: <IntlMessages id="common.title" />,
      dataIndex: "title",
      key: "title",
      render: (id, record) => (
        <Typography.Link
          onClick={() => router.push(`/dashboards/report_detail/${record._id}`)}
          style={{ display: "flex", alignItems: "center" }}
        >
          {record.title}
        </Typography.Link>
      ),
    },
    {
      title: <IntlMessages id="common.receipts" />,
      dataIndex: "receipts",
      key: "receipts",
      render: (data, record) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <IoReceipt
            style={{
              fontSize: 16,
              right: "5px",
              position: "relative",
            }}
          />
          ({record.expenses.length})
        </div>
      ),
    },
    {
      title: <IntlMessages id="common.code" />,
      dataIndex: "code",
      key: "code",
    },
    // {
    //   title: <IntlMessages id="common.approver" />,
    //   dataIndex: "approver",
    //   key: "approver",
    //   render: (id, record) => Tt_GetUser(record.approver),
    // },
    // {
    //   title: <IntlMessages id="common.approvation.date" />,
    //   dataIndex: "approval_date",
    //   key: "approval_date",
    //   render: (id, record) => (
    //     <>
    //       {record.approval_date ? (
    //         <span>
    //           {Tt_FormatDate(
    //             moment(record.approval_date).format(FORMAT_DATE_ONE)
    //           )}{" "}
    //           <br />
    //           <i>{moment(record.approval_date).format(FORMAT_DATE_TWO)}</i>
    //         </span>
    //       ) : (
    //         "-"
    //       )}
    //     </>
    //   ),
    // },
    // {
    //   title: <IntlMessages id="common.submission.date" />,
    //   dataIndex: "submission_date",
    //   key: "submission_date",
    //   render: (id, record) => (
    //     <>
    //       {record.submission_date ? (
    //         <span>
    //           {Tt_FormatDate(
    //             moment(record.submission_date).format(FORMAT_DATE_ONE)
    //           )}{" "}
    //           <br />
    //           <i>{moment(record.submission_date).format(FORMAT_DATE_TWO)}</i>
    //         </span>
    //       ) : (
    //         "-"
    //       )}
    //     </>
    //   ),
    // },
    {
      title: <IntlMessages id="common.employee" />,
      dataIndex: "employee",
      key: "employee",
      render: (id, record) => Tt_GetUser(record.employee),
    },
    {
      title: <IntlMessages id="common.status" />,
      dataIndex: "status",
      key: "status",
      render: (id, record) => (
        <span>{Tt_GetStatusExpense(handleOnCheckStatus(record.expenses))}</span>
      ),
    },
    {
      title: <IntlMessages id="common.createdAt.updatedAt" />,
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (id, record) => (
        <span>
          {Tt_FormatDate(moment(record.updatedAt).format(FORMAT_DATE_ONE))}{" "}
          <br />
          <i>{moment(record.updatedAt).format(FORMAT_DATE_TWO)}</i>
        </span>
      ),
    },
    {
      title: <IntlMessages id="common.total.amount" />,
      dataIndex: "total",
      key: "total",
      render: (data, record) => (
        <StyledFlex>
          <b>
            {Tt_TotalExpensesAmountByCurrency(record.expenses, record.currency)}
          </b>
          <span className="ml-3">{record.currency}</span>
        </StyledFlex>
      ),
    },
    {
      title: <IntlMessages id="common.actions" />,
      dataIndex: "actions",
      key: "actions",
      className: "order-table-action",
      fixed: "right",
      render: (text, record) => <ReportActions reportData={record} />,
    },
  ];

  const handleOnCheckStatus = (expenses: ExpenseType[]) => {
    if (expenses.length > 0) {
      if (
        expenses.every(
          (expense) =>
            expense.currentStatus ===
              StatusExpenseEnums.VALID ||
            expense.currentStatus ===
              StatusExpenseEnums.ACCOUNTING
        )
      ) {
        return StatusExpenseEnums.VALID;
      } else if (
        expenses.some(
          (expense) =>
            expense.currentStatus ===
            StatusExpenseEnums.REJECTED
        )
      ) {
        return StatusExpenseEnums.REJECTED;
      } else {
        return StatusExpenseEnums.PENDING;
      }
    } else {
      return StatusExpenseEnums.PENDING;
    }
  };

  // Render
  return (
    <StyledObjectTable
      hoverColor
      data={reportData}
      loading={loading}
      columns={getColumns(router)}
      scroll={{ x: "auto" }}
    />
  );
};

export default ReportTable;
