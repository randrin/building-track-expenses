import AppCard from "@crema/components/AppCard";
import { Fonts } from "@crema/constants/AppEnums";
import IntlMessages from "@crema/helpers/IntlMessages";
import { ExpenseType } from "@crema/types/models/dashboards/ExpenseType";
import { ReportType } from "@crema/types/models/dashboards/ReportType";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Tt_GetColorStatusExpense } from "utils";
import {
  StatusExpenseEnums,
  StatusReportEnums,
} from "utils/common-constants.utils";
import {
  StyledFooterAction,
  StyledFooterWrapper,
  StyledRejected,
  StyledSuccess,
  StyledUserGraphWrapper,
  StyledWarning,
} from "../index.styled";

type DataProps = {
  data: ReportType[];
  height: number;
};

type DataReportProps = {
  name: string;
  value: number;
  color: string;
};

/**
 * Renders a widget that displays statistics for a set of reports.
 *
 * The widget includes a pie chart that visualizes the status of the reports,
 * as well as a footer that provides a legend for the different report statuses.
 *
 * @param {DataProps} props - The component props.
 * @param {ReportType[]} props.data - The data for the reports to be displayed.
 * @returns {React.ReactElement} - The rendered widget.
 */
const WidgetStatisticReports: React.FC<DataProps> = ({ data, height }) => {
  // States
  const [reportsData, setReportsData] = useState<DataReportProps[]>([]);

  // Desctructing
  const { messages } = useIntl();

  // Init
  useEffect(() => {
    const dataPies: DataReportProps[] = [];
    const reports: ReportType[][] = [];
    // Push only the reports with status VALID, PENDING, REJECTED
    reports.push(
      data.filter(
        (report) =>
          handleOnCheckStatus(report.expenses) === StatusExpenseEnums.VALID
      )
    );
    reports.push(
      data.filter(
        (report) =>
          handleOnCheckStatus(report.expenses) === StatusExpenseEnums.PENDING
      )
    );
    reports.push(
      data.filter(
        (report) =>
          handleOnCheckStatus(report.expenses) === StatusExpenseEnums.REJECTED
      )
    );

    reports.map((report, index) => {
      const dataPie: DataReportProps = {
        name: messages[
          `common.status.${handleOnCheckStatus(
            report.flatMap((rp) => rp.expenses)
          )
            .replaceAll("_", ".")
            .toLocaleLowerCase()}`
        ] as string,
        value: report.length,
        color: Tt_GetColorStatusExpense(
          handleOnCheckStatus(report.flatMap((rp) => rp.expenses))
        ),
      };
      dataPies.push(dataPie);
    });
    setReportsData(dataPies);
  }, []);

  // Functions
  const handleOnCheckStatus = (expenses: ExpenseType[]) => {
    if (expenses?.length > 0) {
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

  // Return
  return (
    <AppCard
      title={messages["dashboard.report.total"] as string}
      extra={
        <Link href={"/dashboards/expenses"}>
          {messages["common.viewAll"] as string}
        </Link>
      }
    >
      <StyledUserGraphWrapper>
        <div className="user-item user-graph-item">
          <ResponsiveContainer height={height}>
            <PieChart>
              <text
                x="50%"
                fontWeight={Fonts.MEDIUM}
                fontSize={20}
                y="45%"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {data.length}
              </text>
              <text
                x="50%"
                fontWeight={Fonts.MEDIUM}
                fontSize={20}
                y="55%"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {messages["common.reports"] as string}
              </text>
              <Pie
                data={reportsData}
                startAngle={90}
                endAngle={-270}
                dataKey="value"
                cx="50%"
                cy="50%"
                innerRadius="80%"
                outerRadius="95%"
              >
                {Object.values(StatusReportEnums).map((status, index) => (
                  <Cell key={index} fill={Tt_GetColorStatusExpense(status)} />
                ))}
              </Pie>
              <Tooltip
                labelStyle={{ color: "black" }}
                contentStyle={{
                  borderRadius: 12,
                  borderColor: "#31354188",
                  background: "#FFFFFFCA",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </StyledUserGraphWrapper>
      <div>
        <StyledFooterWrapper>
          <StyledFooterAction>
            <StyledWarning className="footer-dot" />
            <span className="footer-title">
              <IntlMessages id="common.status.pending" />
            </span>
          </StyledFooterAction>
          <StyledFooterAction>
            <StyledSuccess className="footer-dot" />
            <span className="footer-title">
              <IntlMessages id="common.status.valid" />
            </span>
          </StyledFooterAction>
          <StyledFooterAction>
            <StyledRejected className="footer-dot" />
            <span className="footer-title">
              <IntlMessages id="common.status.rejected" />
            </span>
          </StyledFooterAction>
        </StyledFooterWrapper>
      </div>
    </AppCard>
  );
};

export default WidgetStatisticReports;
