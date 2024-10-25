import { PlusOutlined } from "@ant-design/icons";
import AppCard from "@crema/components/AppCard";
import AppPageMeta from "@crema/components/AppPageMeta";
import AppRowContainer from "@crema/components/AppRowContainer";
import AppsHeader from "@crema/components/AppsContainer/AppsHeader";
import LegendTicketStatus from "@crema/core/components/commons/LegendTicketStatus";
import IntlMessages from "@crema/helpers/IntlMessages";
import { useAuthUser } from "@crema/hooks/AuthHooks";
import TicketTable from "@crema/modules/dashboards/Support-tickets";
import { TicketType } from "@crema/types/models/dashboards/TicketType";
import { Button, Col, Input, Select, Typography } from "antd";
import {
  useSupportHelpActionsContext,
  useSupportHelpContext,
} from "modules/apps/context/SupportHelpContextProvider";
import {
  StyledOrderFooterPagination,
  StyledOrderHeader,
  StyledOrderHeaderInputView,
  StyledOrderHeaderPagination,
} from "modules/ecommerce/Orders/index.styled";
import { useRouter } from "next/router";
import { useState } from "react";
import { CiCircleList } from "react-icons/ci";
import { useIntl } from "react-intl";
import { Tt_GetTicketStatus } from "utils";
import {
  PAGE_SIZE_DEFAULT,
  TicketEnums,
  UsersRolesEnums,
} from "utils/common-constants.utils";
import { StyledContent } from "../index.styled";

const TicketsSupport = () => {
  // States
  const { user } = useAuthUser();
  const router = useRouter();
  const { messages } = useIntl();
  const [filterData, setFilterData] = useState("");
  const { page, loadingTicket, ticketList } = useSupportHelpContext();
  const { onPageChange, handleOnSelectTicketsByStatus } =
    useSupportHelpActionsContext();

  // Desctruction
  const { Title, Paragraph } = Typography;
  const { Option } = Select;

  // Functions
  const onGetFilteredItems = () => {
    if (filterData === "") {
      return ticketList?.data;
    } else {
      return ticketList?.data.filter((ticket: TicketType) =>
        ticket.object.toUpperCase().includes(filterData.toUpperCase())
      );
    }
  };

  const list = onGetFilteredItems();

  // Render
  return (
    <>
      <AppPageMeta title={messages["common.support.ticket"] as string} />
      <div className="text-center">
        {user.role === UsersRolesEnums.USER && (
          <>
            <Title level={1} className="tt-expenses-primary">
              <IntlMessages id="common.support.ticket.title" />
            </Title>
            <Title level={3}>
              <IntlMessages id="common.support.ticket.subtitle" />
            </Title>
            <Paragraph>
              <IntlMessages id="common.support.ticket.description" />
            </Paragraph>
          </>
        )}
        <StyledContent>
          <div className="text-left">
            <label htmlFor="status" className="label">
              <IntlMessages id="common.status" />
            </label>
            <Select
              size="large"
              showSearch
              showArrow
              style={{ width: "100%" }}
              placeholder={<IntlMessages id="placeholder.select" />}
              optionLabelProp="label"
              optionFilterProp="label"
              onChange={(e) => handleOnSelectTicketsByStatus(e)}
            >
              <Option
                value="all"
                label={
                  <div className="tt-expenses-space-start text-center">
                    <CiCircleList />
                    <span className="ml-5">
                      <IntlMessages id="common.alls" />
                    </span>
                  </div>
                }
              >
                <div className="tt-expenses-space-start text-center">
                  <CiCircleList />
                  <span className="ml-5">
                    <IntlMessages id="common.alls" />
                  </span>
                </div>
              </Option>
              {Object.values(TicketEnums).map((statut, index) => (
                <Option
                  key={index}
                  value={statut}
                  label={
                    <div className="tt-expenses-space-start text-center">
                      {Tt_GetTicketStatus(statut)}
                      <span className="ml-5">
                        <IntlMessages
                          id={`common.status.${statut
                            .replaceAll("_", ".")
                            .toLocaleLowerCase()}`}
                        />
                      </span>
                    </div>
                  }
                >
                  <div className="tt-expenses-space-start text-center">
                    {Tt_GetTicketStatus(statut)}
                    <span className="ml-5">
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
          </div>
          {user.role === UsersRolesEnums.USER && (
            <Button
              type="primary"
              className="btn"
              onClick={() =>
                router.push(`/dashboards/help-center/ticket_create`)
              }
            >
              <PlusOutlined /> <IntlMessages id="common.new.ticket" />
            </Button>
          )}
        </StyledContent>
        <AppRowContainer>
          <Col xs={24} lg={24}>
            <AppCard
              title={
                <AppsHeader>
                  <StyledOrderHeader>
                    <StyledOrderHeaderInputView>
                      <Input
                        id="ticket-name"
                        placeholder={messages["common.searchHere"] as string}
                        type="search"
                        onChange={(event) => setFilterData(event.target.value)}
                      />
                    </StyledOrderHeaderInputView>
                    <LegendTicketStatus />
                    <StyledOrderHeaderPagination
                      pageSize={PAGE_SIZE_DEFAULT}
                      count={ticketList?.count || 0}
                      page={page}
                      onChange={onPageChange}
                    />
                  </StyledOrderHeader>
                </AppsHeader>
              }
            >
              <TicketTable ticketData={list || []} loading={loadingTicket} />
              <StyledOrderFooterPagination
                pageSize={PAGE_SIZE_DEFAULT}
                count={ticketList?.count || 0}
                page={page}
                onChange={onPageChange}
              />
            </AppCard>
          </Col>
        </AppRowContainer>
      </div>
    </>
  );
};

export default TicketsSupport;
