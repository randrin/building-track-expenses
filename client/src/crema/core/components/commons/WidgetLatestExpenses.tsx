import AppCard from "@crema/components/AppCard";
import { ExpenseType } from "@crema/types/models/dashboards/ExpenseType";
import React, { useState } from "react";
import { useIntl } from "react-intl";
import { StyledContactTable } from "../index.styled";
import { ColumnsType } from "antd/es/table";
import IntlMessages from "@crema/helpers/IntlMessages";
import { Space, Tooltip } from "antd";
import { IoMdAttach } from "react-icons/io";
import { Tt_FormatDateEmpty, Tt_GetUserWithTooltip } from "utils";
import { VscEye } from "react-icons/vsc";
import ExpenseView from "@crema/modules/dashboards/ReportsExpenses/ExpensesTable/ExpenseView";

interface Props {
  data: ExpenseType[];
}
const WidgetLatestExpenses = ({ data }: Props) => {
  // States
  const { messages } = useIntl();
  const [expense, setExpense] = useState<ExpenseType>();
  const [showExpense, setShowExpense] = useState(false);

  // Init
  const columns: ColumnsType<ExpenseType> = [
    {
      title: <IntlMessages id="common.attachments" />,
      dataIndex: "attachments",
      key: "attachments",
      render: (id, record) => (
        <Tooltip
          title={
            record.attachments.length === 0 ? (
              <IntlMessages id="common.no.attachments" />
            ) : (
              <span>
                {record.attachments.length}{" "}
                <IntlMessages id="common.attachments" />
              </span>
            )
          }
        >
          <div
            style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
          >
            <IoMdAttach
              style={{
                fontSize: 16,
                color: record.attachments.length === 0 ? "#d12420" : "#2a7a39",
              }}
            />
            <span style={{ fontWeight: "600" }}>
              ({record.attachments.length})
            </span>
          </div>
        </Tooltip>
      ),
    },
    {
      title: <IntlMessages id="common.category" />,
      dataIndex: "category",
      key: "category",
      render: (id, record) => <span>{record.category.title}</span>,
    },
    {
      title: <IntlMessages id="common.subcategory" />,
      dataIndex: "subcategory",
      key: "subcategory",
      render: (id, record) => <span>{record.subcategory.title}</span>,
    },
    {
      title: <IntlMessages id="common.transaction.date" />,
      dataIndex: "transaction_date",
      key: "transaction_date",
      render: (id, record) => Tt_FormatDateEmpty(record.transaction_date),
    },
    {
      title: <IntlMessages id="common.submission.date" />,
      dataIndex: "submission_date",
      key: "submission_date",
      render: (id, record) => Tt_FormatDateEmpty(record.submission_date),
    },
    {
      title: <IntlMessages id="common.employee" />,
      dataIndex: "employee",
      key: "employee",
      render: (id, record) => Tt_GetUserWithTooltip(record.employee),
    },
    // {
    //   title: <IntlMessages id="common.approvation.date" />,
    //   dataIndex: "accounting_date",
    //   key: "accounting_date",
    //   render: (id, record) => Tt_FormatDateEmpty(record.accounting_date),
    // },
    // {
    //   title: <IntlMessages id="common.approver" />,
    //   dataIndex: "accounting",
    //   key: "accounting",
    //   render: (id, record) => Tt_GetUserWithTooltip(record.accounting),
    // },
    {
      title: <IntlMessages id="common.amount" />,
      dataIndex: "amount",
      key: "amount",
      render: (id, record) => (
        <span>
          <b>{record.amount.toLocaleString()}</b> {record.currency}
        </span>
      ),
    },
    {
      title: <IntlMessages id="common.actions" />,
      dataIndex: "actions",
      key: "actions",
      render: (id, record) => (
        <Space wrap>
          <span
            onClick={() => handleOnViewExpense(record)}
            style={{ fontSize: 14 }}
            className="tt-expenses-space-center"
          >
            <VscEye className="tt-expenses-primary tt-expenses-margin-btn-icon" />{" "}
            <IntlMessages id="common.view" />
          </span>
        </Space>
      ),
    },
  ];

  // Function
  const handleOnViewExpense = (expense: ExpenseType) => {
    setExpense(expense);
    setShowExpense(!showExpense);
  };

  // Render
  return (
    <AppCard
      className="no-card-space-ltr-rtl"
      title={messages["common.latest.expenses"] as string}
    >
      <StyledContactTable
        scroll={{ x: "auto", y: 340 }}
        hoverColor
        data={data}
        columns={columns}
      />
      {showExpense && (
        <ExpenseView
          expense={expense}
          isAppDrawerOpen={showExpense}
          setAppDrawerOpen={setShowExpense}
        />
      )}
    </AppCard>
  );
};

export default WidgetLatestExpenses;
