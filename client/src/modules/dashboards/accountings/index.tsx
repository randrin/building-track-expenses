import AppCard from "@crema/components/AppCard";
import AppPageMeta from "@crema/components/AppPageMeta";
import AppRowContainer from "@crema/components/AppRowContainer";
import AppsHeader from "@crema/components/AppsContainer/AppsHeader";
import LegendExpenseStatus from "@crema/core/components/commons/LegendExpenseStatus";
import AdminPermission from "@crema/core/components/middlewares/AdminPermission";
import AccountingTable from "@crema/modules/dashboards/Accounting/AccountingsTable";
import { ReportType } from "@crema/types/models/dashboards/ReportType";
import { Col, Input } from "antd";
import { StyledTitle5 } from "modules/ecommerce/Admin/index.styled";
import {
  StyledOrderFooterPagination,
  StyledOrderHeader,
  StyledOrderHeaderInputView,
} from "modules/ecommerce/Orders/index.styled";
import { useState } from "react";
import { useIntl } from "react-intl";
import { PAGE_SIZE_DEFAULT } from "utils/common-constants.utils";
import {
  useAccountingActionsContext,
  useAccountingContext,
} from "../../apps/context/AccountingContextProvider";
import { StyledContent } from "../index.styled";

const AccountingsListing = () => {
  // States
  const { messages } = useIntl();
  const { accountingList, loading, page } = useAccountingContext();
  const { onPageChange } = useAccountingActionsContext();
  const [filterData, setFilterData] = useState("");

  // Functions
  const onGetFilteredItems = () => {
    if (filterData === "") {
      return accountingList?.data;
    } else {
      return accountingList?.data.filter((report: ReportType) =>
        report.title.toUpperCase().includes(filterData.toUpperCase())
      );
    }
  };

  const list = onGetFilteredItems();

  // Render
  return (
    <>
      <AppPageMeta
        title={messages["sidebar.app.dashboard.accounting"] as string}
      />
      <StyledContent>
        <StyledTitle5>
          {messages["sidebar.app.dashboard.accounting"] as string}
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
                  <StyledOrderFooterPagination
                    pageSize={PAGE_SIZE_DEFAULT}
                    count={accountingList?.count || 0}
                    page={page}
                    onChange={onPageChange}
                  />
                </StyledOrderHeader>
              </AppsHeader>
            }
          >
            <AccountingTable reportData={list || []} loading={loading} />
            <StyledOrderFooterPagination
              pageSize={PAGE_SIZE_DEFAULT}
              count={accountingList?.count || 0}
              page={page}
              onChange={onPageChange}
            />
          </AppCard>
        </Col>
      </AppRowContainer>
    </>
  );
};

export default AdminPermission(AccountingsListing);
