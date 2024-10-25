import React, { useState } from "react";
import { StyledContent } from "../index.styled";
import { StyledTitle5 } from "modules/ecommerce/Admin/index.styled";
import { useIntl } from "react-intl";
import { Button, Col, Input } from "antd";
import IntlMessages from "@crema/helpers/IntlMessages";
import { PlusOutlined } from "@ant-design/icons";
import {
  useExpenseActionsContext,
  useExpenseContext,
} from "modules/apps/context/ExpenseContextProvider";
import AppRowContainer from "@crema/components/AppRowContainer";
import AppCard from "@crema/components/AppCard";
import AppsHeader from "@crema/components/AppsContainer/AppsHeader";
import {
  StyledOrderFooterPagination,
  StyledOrderHeader,
  StyledOrderHeaderInputView,
  StyledOrderHeaderPagination,
} from "modules/ecommerce/Orders/index.styled";
import { PAGE_SIZE_DEFAULT, StatusEnums } from "utils/common-constants.utils";
import ReportTable from "@crema/modules/dashboards/ReportsExpenses/ReportsTable";
import AddReport from "./inc/addReport";
import LegendReportStatus from "@crema/core/components/commons/LegendReportStatus";
import AppPageMeta from "@crema/components/AppPageMeta";
import { ReportType } from "@crema/types/models/dashboards/ReportType";
import { useJWTAuth } from "@crema/services/auth/jwt-auth/JWTAuthProvider";

const ExpensesListing = () => {
  // States
  const { user } = useJWTAuth();
  const {
    reports,
    reportList,
    users,
    loadingReport,
    report,
    isReportDrawerOpen,
    pageReport,
  } = useExpenseContext();
  const {
    handleOnSubmitReport,
    onPageReportChange,
    setReport,
    setReportDrawerOpen,
  } = useExpenseActionsContext();
  const [filterData, setFilterData] = useState({
    title: "",
    description: "",
    status: [StatusEnums.ACTIVE, StatusEnums.DISABLED],
  });

  // Desctruction
  const { messages } = useIntl();

  // Functions
  const handleOnAddReport = () => {
    setReport({
      ...report,
      employee: user._id,
      currency: user.settings ? user.settings.currency : '',
    });
    setReportDrawerOpen(!isReportDrawerOpen);
  };

  const onGetFilteredItems = () => {
    if (filterData.title === "") {
      return reportList?.data;
    } else {
      return reports.filter((report: ReportType) =>
        report.title.toUpperCase().includes(filterData.title.toUpperCase())
      );
    }
  };

  const list = onGetFilteredItems();

  // Render
  return (
    <>
      <AppPageMeta title={messages["common.reports"] as string} />
      <StyledContent>
        <StyledTitle5>{messages["common.reports"] as string}</StyledTitle5>
        <LegendReportStatus />
        <Button type="primary" className="btn" onClick={handleOnAddReport}>
          <PlusOutlined /> <IntlMessages id="common.report" />
        </Button>
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
                      onChange={(event) =>
                        setFilterData({
                          ...filterData,
                          title: event.target.value,
                        })
                      }
                    />
                  </StyledOrderHeaderInputView>
                  <StyledOrderHeaderPagination
                    pageSize={PAGE_SIZE_DEFAULT}
                    count={reportList?.count || 0}
                    page={pageReport}
                    onChange={onPageReportChange}
                  />
                </StyledOrderHeader>
              </AppsHeader>
            }
          >
            <ReportTable reportData={list || []} loading={loadingReport} />
            <StyledOrderFooterPagination
              pageSize={PAGE_SIZE_DEFAULT}
              count={reportList?.count || 0}
              page={pageReport}
              onChange={onPageReportChange}
            />
            {/* Add Report */}
            <AddReport
              users={users}
              report={report}
              setReportDrawerOpen={handleOnAddReport}
              handleOnAddReport={handleOnSubmitReport}
              loading={loadingReport}
              setReport={setReport}
              isReportDrawerOpen={isReportDrawerOpen}
            />
          </AppCard>
        </Col>
      </AppRowContainer>
    </>
  );
};

export default ExpensesListing;
