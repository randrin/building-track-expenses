import AppAnimate from "@crema/components/AppAnimate";
import languageData from "@crema/components/AppLanguageSwitcher/data";
import AppLoader from "@crema/components/AppLoader";
import AppPageMeta from "@crema/components/AppPageMeta";
import AppRowContainer from "@crema/components/AppRowContainer";
import { useLocaleActionsContext } from "@crema/context/AppContextProvider/LocaleContextProvider";
import ProgressUserProfile from "@crema/core/components/commons/ProgressUserProfile";
import WidgetCardCount from "@crema/core/components/commons/WidgetCardCount";
import WidgetExpensesGraph from "@crema/core/components/commons/WidgetExpensesGraph";
import WidgetLatestContacts from "@crema/core/components/commons/WidgetLatestContacts";
import WidgetLatestExpenses from "@crema/core/components/commons/WidgetLatestExpenses";
import WidgetLatestTickets from "@crema/core/components/commons/WidgetLatestTickets";
import WidgetRolesPie from "@crema/core/components/commons/WidgetRolesPie";
import WidgetStatisticGraph from "@crema/core/components/commons/WidgetStatisticGraph";
import WidgetStatisticReports from "@crema/core/components/commons/WidgetStatisticReports";
import WidgetUsersPie from "@crema/core/components/commons/WidgetUsersPie";
import AdminManagerPermission from "@crema/core/components/middlewares/AdminManagerPermission";
import IntlMessages from "@crema/helpers/IntlMessages";
import { useAuthUser } from "@crema/hooks/AuthHooks";
import {
  StyledTicketSupportCard,
  StyledTicketSupportCollapse,
  StyledTicketSupportCollapseItem,
  StyledTicketSupportOpen,
} from "@crema/modules/dashboards/Analytics/TicketsSupport/index.styled";
import { BirthdayCard, DateSelector } from "@crema/modules/dashboards/Widgets";
import { Col, Collapse, Divider, Progress, Row, Typography } from "antd";
import { useDashboardContext } from "modules/apps/context/DashboardContextProvider";
import { updateLocale } from "moment";
import { useEffect } from "react";
import { BiSolidCategoryAlt } from "react-icons/bi";
import { FiUsers } from "react-icons/fi";
import { GoOrganization } from "react-icons/go";
import { TbReport } from "react-icons/tb";
import { useIntl } from "react-intl";

const Home = () => {
  // States
  const { messages } = useIntl();
  const {
    loading,
    users,
    roles,
    reports,
    expenses,
    pendingExpenses,
    categories,
    organizations,
    tickets,
    contacts,
  } = useDashboardContext();
  const { user } = useAuthUser();
  const { updateLocale } = useLocaleActionsContext();

  // Init
  useEffect(() => {
    if (user.settings?.language) {
      updateLocale(
        languageData.find((lang) => lang.locale === user.settings.language)
      );
    }
  }, [user]);

  // Destructing
  const { Title, Paragraph } = Typography;
  const { Panel } = Collapse;

  // Functions
  const genExtra = (data: number) => (
    <>
      <span>
        {data} <IntlMessages id="common.status.open" /> (s)
      </span>
    </>
  );

  // Render
  return (
    <>
      <AppPageMeta title={messages["sidebar.app.dashboard.home"] as string} />
      {loading ? (
        <AppLoader />
      ) : (
        <AppAnimate animation="transition.slideUpIn" delay={200}>
          <AppRowContainer>
            <Row>
              <Col xs={24} md={18} lg={18}>
                <Title level={3} className="tt-expenses-without-margin">
                  <IntlMessages id="common.welcome" />{" "}
                  <span className="tt-expenses-primary">{user.firstName}</span>
                </Title>
                <Paragraph className="tt-expenses-without-margin">
                  <IntlMessages id="common.welcome.title" />
                </Paragraph>
              </Col>
              <ProgressUserProfile />
            </Row>
            <Divider />
            <Row>
              <Col xs={24} sm={12} lg={6} key={"Users"}>
                <WidgetCardCount
                  value={users.length}
                  name={messages["common.users"] as string}
                  icon={<FiUsers size={40} className="tt-expenses-primary" />}
                />
              </Col>
              <Col xs={24} sm={12} lg={6} key={"Organizations"}>
                <WidgetCardCount
                  value={organizations.length}
                  name={
                    messages["sidebar.app.dashboard.organizations"] as string
                  }
                  icon={
                    <GoOrganization
                      size={40}
                      className="tt-expenses-secondary"
                    />
                  }
                />
              </Col>
              <Col xs={24} sm={12} lg={6} key={"Reports"}>
                <WidgetCardCount
                  value={reports.length}
                  name={messages["common.reports"] as string}
                  icon={<TbReport size={40} className="tt-expenses-success" />}
                />
              </Col>
              <Col xs={24} sm={12} lg={6} key={"Categories"}>
                <WidgetCardCount
                  value={categories.length}
                  name={messages["common.categories"] as string}
                  icon={
                    <BiSolidCategoryAlt
                      size={40}
                      className="tt-expenses-warning"
                    />
                  }
                />
              </Col>
            </Row>
            <Row>
              <Col xs={24} lg={16} key={"Expenses-Status"}>
                <WidgetExpensesGraph data={expenses || []} />
              </Col>
              <Col xs={24} lg={8} key={"Users-status"}>
                <WidgetUsersPie data={users || []} />
              </Col>
            </Row>
            <Row>
              <Col xs={24} lg={24} key={"Expenses"}>
                <WidgetLatestExpenses data={pendingExpenses || []} />
              </Col>
            </Row>
            <Row>
              <Col xs={24} lg={8} key={"Roles-status"}>
                <WidgetRolesPie roles={roles || []} users={users || []} />
              </Col>
              <Col xs={24} lg={16} key={"Expenses-Graph"}>
                <WidgetStatisticGraph data={expenses || []} />
              </Col>
            </Row>
            <Row>
              <Col xs={24} lg={24} key={"Contacts"}>
                <WidgetLatestContacts data={contacts || []} />
              </Col>
            </Row>
            <Row>
              <Col xs={24} lg={8} key={"d"}>
                <DateSelector />
              </Col>
              <Col xs={24} lg={8} key={"f"}>
                <BirthdayCard />
              </Col>
              <Col xs={24} lg={8} key={"c"}>
                <WidgetStatisticReports data={reports || []} height={320} />
              </Col>
            </Row>
            <Row>
              <Col xs={24} lg={18} key={"tickets"}>
                <WidgetLatestTickets data={tickets.lastOpenTickets || []} />
              </Col>
              <Col xs={24} lg={6} key={"tickets-statistics"}>
                <StyledTicketSupportCard className="no-card-space">
                  <Collapse bordered={false} defaultActiveKey={["1"]} accordion>
                    <Panel
                      key={"1"}
                      header={<IntlMessages id="common.statistics" />}
                      extra={genExtra(tickets.openTicketsTotal.length)}
                    >
                      <StyledTicketSupportCollapse>
                        <StyledTicketSupportCollapseItem>
                          <StyledTicketSupportOpen>
                            <IntlMessages id="common.status.open" />
                          </StyledTicketSupportOpen>
                          <div className="ant-row ant-row-middle">
                            <Progress
                              percent={
                                (tickets.openTicketsTotal.length /
                                  tickets.total) *
                                100
                              }
                              status="active"
                              strokeColor="#fa9600"
                              trailColor="rgb(214, 214, 214)"
                              strokeWidth={5}
                            />
                          </div>
                        </StyledTicketSupportCollapseItem>
                        <StyledTicketSupportCollapseItem>
                          <StyledTicketSupportOpen>
                            <IntlMessages id="common.status.closed" />
                          </StyledTicketSupportOpen>
                          <div className="ant-row ant-row-middle">
                            <Progress
                              percent={
                                (tickets.closedTicketsTotal.length /
                                  tickets.total) *
                                100
                              }
                              status="active"
                              strokeColor="#183242"
                              trailColor="rgb(214, 214, 214)"
                              strokeWidth={5}
                            />
                          </div>
                        </StyledTicketSupportCollapseItem>
                        <StyledTicketSupportCollapseItem>
                          <StyledTicketSupportOpen>
                            <IntlMessages id="common.status.resolved" />
                          </StyledTicketSupportOpen>
                          <div className="ant-row ant-row-middle">
                            <Progress
                              percent={
                                (tickets.resolvedTicketsTotal.length /
                                  tickets.total) *
                                100
                              }
                              status="active"
                              strokeColor="#2a7a39"
                              trailColor="rgb(214, 214, 214)"
                              strokeWidth={5}
                            />
                          </div>
                        </StyledTicketSupportCollapseItem>
                      </StyledTicketSupportCollapse>
                    </Panel>
                  </Collapse>
                </StyledTicketSupportCard>
              </Col>
            </Row>
          </AppRowContainer>
        </AppAnimate>
      )}
    </>
  );
};

export default AdminManagerPermission(Home);
