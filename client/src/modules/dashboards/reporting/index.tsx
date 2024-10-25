import AppAnimate from "@crema/components/AppAnimate";
import languageData from "@crema/components/AppLanguageSwitcher/data";
import AppLoader from "@crema/components/AppLoader";
import AppPageMeta from "@crema/components/AppPageMeta";
import AppRowContainer from "@crema/components/AppRowContainer";
import { useLocaleActionsContext } from "@crema/context/AppContextProvider/LocaleContextProvider";
import ProgressUserProfile from "@crema/core/components/commons/ProgressUserProfile";
import WidgetExpensesGraph from "@crema/core/components/commons/WidgetExpensesGraph";
import WidgetLatestExpenses from "@crema/core/components/commons/WidgetLatestExpenses";
import WidgetStatisticGraph from "@crema/core/components/commons/WidgetStatisticGraph";
import WidgetStatisticReports from "@crema/core/components/commons/WidgetStatisticReports";
import IntlMessages from "@crema/helpers/IntlMessages";
import {
  StyledCoinInfoCol,
  StyledTotalBalanceCard,
  StyledTotalBalanceFooter,
  StyledTotalBalanceHeader,
  StyledTotalBalanceMiddlePara,
  StyledTotalBalanceTitle,
  StyledTotalBalanceTitleSm,
} from "@crema/modules/dashboards/Crypto/TotalBalance/index.styled";
import { useJWTAuth } from "@crema/services/auth/jwt-auth/JWTAuthProvider";
import { Alert, Col, Divider, Row, Typography } from "antd";
import { useReportingContext } from "modules/apps/context/ReportingContectProvider";
import { useEffect } from "react";
import { useIntl } from "react-intl";
import { UsersRolesEnums } from "utils/common-constants.utils";

const ReportingChart = () => {
  // States
  const { messages } = useIntl();
  const { user } = useJWTAuth();
  const {
    loading,
    users,
    roles,
    reports,
    expenses,
    pendingExpenses,
    categories,
    organizations,
    subcategories,
    contacts,
  } = useReportingContext();
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
              <Col xs={24} md={24} lg={24}>
                <Alert
                  message={<IntlMessages id="common.alert.info.reporting" />}
                  type="info"
                  showIcon
                  closable
                />
              </Col>
            </Row>
            {user.role === UsersRolesEnums.USER && (
              <>
                <Row>
                  <Col xs={24} md={18} lg={18}>
                    <Title level={3} className="tt-expenses-without-margin">
                      <IntlMessages id="common.welcome" />{" "}
                      <span className="tt-expenses-primary">
                        {user.firstName}c
                      </span>
                    </Title>
                    <Paragraph className="tt-expenses-without-margin">
                      <IntlMessages id="common.welcome.title" />
                    </Paragraph>
                  </Col>
                  <ProgressUserProfile />
                </Row>
                <Divider />
              </>
            )}

            {user.role === UsersRolesEnums.USER && (
              <Row>
                <Col xs={24} lg={6}>
                  <h2 className="card-outer-title text-uppercase">
                    <IntlMessages id="dashboard.totalBalance" />
                  </h2>
                  <StyledTotalBalanceCard>
                    <StyledTotalBalanceHeader>
                      <div className="ant-column">
                        <StyledTotalBalanceTitle className="tt-expenses-success">
                          {user?.balance?.fcfa.toLocaleString()} Fcfa
                        </StyledTotalBalanceTitle>
                        <StyledTotalBalanceTitleSm>
                          <IntlMessages id="dashboard.avlBalance" />
                        </StyledTotalBalanceTitleSm>
                      </div>
                    </StyledTotalBalanceHeader>
                    <StyledTotalBalanceMiddlePara>
                      <IntlMessages id="dashboard.balanceCurrency" />
                    </StyledTotalBalanceMiddlePara>
                    <StyledTotalBalanceFooter>
                      <StyledCoinInfoCol>
                        <h3>${user?.balance?.dollar.toLocaleString()}</h3>
                      </StyledCoinInfoCol>
                      <StyledCoinInfoCol>
                        <h3>€{user?.balance?.euro.toLocaleString()}</h3>
                      </StyledCoinInfoCol>
                    </StyledTotalBalanceFooter>
                  </StyledTotalBalanceCard>
                </Col>
                {user?.balance?.fcfa < 0 ||
                  user?.balance?.euro < 0 ||
                  (user?.balance?.dollar < 0 && (
                    <Col xs={24} lg={6}>
                      <h2 className="card-outer-title text-uppercase">
                        <IntlMessages id="dashboard.buyBalance" />
                      </h2>
                      <StyledTotalBalanceCard>
                        <StyledTotalBalanceHeader>
                          <div className="ant-column">
                            <StyledTotalBalanceTitle>
                              $1250.00
                            </StyledTotalBalanceTitle>
                          </div>
                        </StyledTotalBalanceHeader>
                      </StyledTotalBalanceCard>
                    </Col>
                  ))}
              </Row>
            )}
            <Row>
              <Col xs={24} lg={24} key={"Expenses-Status"}>
                <WidgetExpensesGraph data={expenses || []} />
              </Col>
            </Row>
            <Row>
              <Col xs={24} lg={16} key={"Expenses-Graph"}>
                <WidgetStatisticGraph data={expenses || []} />
              </Col>
              <Col xs={24} lg={8} key={"Reports"}>
                <WidgetStatisticReports data={reports || []} height={235} />
              </Col>
            </Row>
            <Row>
              <Col xs={24} lg={24} key={"Expenses"}>
                <WidgetLatestExpenses
                  data={pendingExpenses.slice(0, 5) || []}
                />
              </Col>
            </Row>
          </AppRowContainer>
        </AppAnimate>
      )}
    </>
  );
};

export default ReportingChart;
