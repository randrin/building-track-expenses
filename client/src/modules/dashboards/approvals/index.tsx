import React, { useState } from "react";
import { StyledContent } from "../index.styled";
import { StyledTitle5 } from "modules/ecommerce/Admin/index.styled";
import { useIntl } from "react-intl";
import AppRowContainer from "@crema/components/AppRowContainer";
import { Col, Input } from "antd";
import AppCard from "@crema/components/AppCard";
import AppsHeader from "@crema/components/AppsContainer/AppsHeader";
import {
  StyledOrderFooterPagination,
  StyledOrderHeader,
  StyledOrderHeaderInputView,
  StyledOrderHeaderPagination,
} from "modules/ecommerce/Orders/index.styled";
import {
  useApprovalActionsContext,
  useApprovalContext,
} from "modules/apps/context/ApprovalContextProvider";
import ApprovalTable from "@crema/modules/dashboards/Approvals/approvalsTable";
import LegendExpenseStatus from "@crema/core/components/commons/LegendExpenseStatus";
import AppPageMeta from "@crema/components/AppPageMeta";
import { ReportType } from "@crema/types/models/dashboards/ReportType";
import AdminManagerPermission from "@crema/core/components/middlewares/AdminManagerPermission";
import { PAGE_SIZE_DEFAULT } from "utils/common-constants.utils";

const ApprovalsListing = () => {
  // States
  const { messages } = useIntl();
  const { approvalList, loading, page } = useApprovalContext();
  const { onPageChange } = useApprovalActionsContext();
  const [filterData, setFilterData] = useState("");

  // Functions
  const onGetFilteredItems = () => {
    if (filterData === "") {
      return approvalList?.data;
    } else {
      return approvalList?.data.filter((report: ReportType) =>
        report.title.toUpperCase().includes(filterData.toUpperCase())
      );
    }
  };

  const list = onGetFilteredItems();

  // Render
  return (
    <>
      <AppPageMeta
        title={messages["sidebar.app.dashboard.approvals"] as string}
      />
      <StyledContent>
        <StyledTitle5>
          {messages["sidebar.app.dashboard.approvals"] as string}
        </StyledTitle5>
        <LegendExpenseStatus />
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
                    count={approvalList?.count || 0}
                    page={page}
                    onChange={onPageChange}
                  />
                </StyledOrderHeader>
              </AppsHeader>
            }
          >
            <ApprovalTable reportData={list || []} loading={loading} />
            <StyledOrderFooterPagination
              pageSize={PAGE_SIZE_DEFAULT}
              count={approvalList?.count || 0}
              page={page}
              onChange={onPageChange}
            />
          </AppCard>
        </Col>
      </AppRowContainer>
    </>
  );
};

export default AdminManagerPermission(ApprovalsListing);
