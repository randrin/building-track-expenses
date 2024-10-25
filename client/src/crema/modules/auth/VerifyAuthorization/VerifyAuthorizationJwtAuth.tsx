import AppAnimate from "@crema/components/AppAnimate";
import AppPageMeta from "@crema/components/AppPageMeta";
import AppRowContainer from "@crema/components/AppRowContainer";
import { initialUrl } from "@crema/constants/AppConst";
import IntlMessages from "@crema/helpers/IntlMessages";
import { useAuthUser } from "@crema/hooks/AuthHooks";
import {
  StyledInfoWidgetCard,
  StyledInfoWidgetContent,
  StyledInfoWidgetInfo,
  StyledInfoWidgetThumb,
} from "@crema/modules/dashboards/HealthCare/InfoWidget/index.styled";
import {
  StyledUserCardHeader,
  StyledUserCardLgSpace,
  StyledUserCardLogo,
  StyledUserContainer,
  StyledUserPages,
} from "@crema/modules/userPages/index.styled";
import { useJWTAuthActions } from "@crema/services/auth/jwt-auth/JWTAuthProvider";
import {
  DepartmentType,
  OrganizationType,
} from "@crema/types/models/dashboards/OrganizationType";
import { Alert, Button, Col, Form, Image, Input, Row } from "antd";
import {
  StyledUserProfileForm,
  StyledUserProfileGroupBtn,
} from "modules/account/MyProfile/index.styled";
import { Router, useRouter } from "next/router";
import {
  StatusEnums,
  UserStatusEnums,
  UsersProfileStepEnums,
} from "utils/common-constants.utils";
import { TAM_SIGNIN_URL } from "utils/end-points.utils";
import { useEffect } from "react";
import { LuCheckCircle, LuMailPlus } from "react-icons/lu";
import { useIntl } from "react-intl";
import Carousel from "react-multi-carousel";
import { IoReturnUpBackOutline } from "react-icons/io5";
import WithFooter from "@crema/core/DefaultPage/withFooter";

const VerifyAuthorizationJwtAuth = () => {
  // States
  const router = useRouter();
  const { user, departments } = useAuthUser();
  const {
    handleOnUserChangeDepartment,
    handleOnUpdateUserProfile,
    clearAuthUser,
  } = useJWTAuthActions();

  // Init
  useEffect(() => {
    if (!user) {
      router.push(TAM_SIGNIN_URL);
    }
  }, []);

  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 3,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  // Destructing
  const { messages } = useIntl();

  // Functions
  const onFinish = (values: any) => {
    console.log("Success:", values);
    handleOnUpdateUserProfile(
      values,
      user._id,
      UsersProfileStepEnums.RESET_PASSWORD
    );
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const handleOnSelectGroup = (department: DepartmentType) => {
    handleOnUserChangeDepartment(department, user._id);
    router.push(initialUrl);
  };

  const handleOnBack = () => {
    clearAuthUser();
    router.push(TAM_SIGNIN_URL);
  };

  // Render
  return (
    <StyledUserPages>
      <AppPageMeta title={messages["common.verify.authorization"] as string} />
      <AppAnimate animation="transition.slideUpIn" delay={200}>
        <StyledUserContainer
          className="tt-expenses-ant-layout tt-expenses-screen-center"
          key="a"
        >
          <StyledUserCardLgSpace>
            <StyledUserCardHeader>
              <StyledUserCardLogo>
                <Image
                  preview={false}
                  src={"/assets/images/logo.png"}
                  width={20}
                  alt="Crema Logo"
                />
              </StyledUserCardLogo>
              <h3>
                <IntlMessages id="common.verify.authorization" />
              </h3>
            </StyledUserCardHeader>

            {user?.status === UserStatusEnums.ACTIVE && (
              <>
                <Row>
                  <Col xs={24} lg={24}>
                    <Alert
                      message={<IntlMessages id="common.alert.info.message" />}
                      description={
                        <IntlMessages id="common.alert.statut.active.description" />
                      }
                      type="success"
                      showIcon
                    />
                  </Col>
                </Row>
                <Carousel
                  swipeable={false}
                  draggable={false}
                  showDots={false}
                  responsive={responsive}
                  ssr={true} // means to render carousel on server-side.
                  infinite={true}
                  autoPlay={false}
                  autoPlaySpeed={1000}
                  keyBoardControl={true}
                  customTransition="all .5"
                  transitionDuration={500}
                  containerClass="carousel-container"
                  removeArrowOnDeviceType={["tablet", "mobile"]}
                  //deviceType={this.props.deviceType}
                  dotListClass="custom-dot-list-style"
                  itemClass="carousel-item"
                >
                  {departments
                    ?.filter(
                      (department) => department.status === StatusEnums.ACTIVE
                    )
                    ?.map((department, index) => (
                      <StyledInfoWidgetCard
                        key={"group" + index}
                        heightFull
                        onClick={() => handleOnSelectGroup(department)}
                        className="card-hover m-5 tt-expenses-cursor-pointer"
                      >
                        <StyledInfoWidgetInfo>
                          <StyledInfoWidgetThumb>
                            <Image
                              preview={false}
                              src={
                                department.logo
                                  ? department.logo.secure_url
                                  : "/assets/icon/default-org.jpg"
                              }
                              alt="icon"
                              style={{
                                height: 60,
                                width: 60,
                                objectFit: "cover",
                              }}
                            />
                          </StyledInfoWidgetThumb>
                          <StyledInfoWidgetContent>
                            <h3 className="text-truncate">{department.name}</h3>
                          </StyledInfoWidgetContent>
                        </StyledInfoWidgetInfo>
                      </StyledInfoWidgetCard>
                    ))}
                </Carousel>
              </>
            )}
            {user?.status === UserStatusEnums.PENDING && (
              <Row>
                <Col xs={24} lg={24}>
                  <Alert
                    message={<IntlMessages id="common.alert.info.message" />}
                    description={
                      <IntlMessages id="common.alert.statut.pending.description" />
                    }
                    type="warning"
                    showIcon
                  />
                </Col>
              </Row>
            )}
            {user?.status === UserStatusEnums.ARCHIVED && (
              <Row>
                <Col xs={24} lg={24}>
                  <Alert
                    message={<IntlMessages id="common.alert.info.message" />}
                    description={
                      <IntlMessages id="common.alert.statut.archived.description" />
                    }
                    type="info"
                    showIcon
                  />
                </Col>
              </Row>
            )}
            {user?.status === UserStatusEnums.DISABLED && (
              <Row>
                <Col xs={24} lg={24}>
                  <Alert
                    message={<IntlMessages id="common.alert.info.message" />}
                    description={
                      <IntlMessages id="common.alert.statut.disabled.description" />
                    }
                    type="error"
                    showIcon
                  />
                </Col>
              </Row>
            )}
            {user?.status === UserStatusEnums.NEVER_CONNECTED &&
              user.tmpPassword && (
                <>
                  <Row>
                    <Col xs={24} lg={24}>
                      <Alert
                        message={
                          <IntlMessages id="common.alert.info.message" />
                        }
                        description={
                          <IntlMessages id="common.alert.statut.never.connected.description" />
                        }
                        type="info"
                        showIcon
                      />
                    </Col>
                  </Row>
                  <StyledUserProfileForm
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                  >
                    <AppRowContainer gutter={16}>
                      <Row className="tt-expenses-without-margin">
                        <Col xs={24} md={24}>
                          <Form.Item
                            name="password"
                            rules={[
                              {
                                required: true,
                                message: (
                                  <IntlMessages id="validation.enterNewPassword" />
                                ),
                              },
                            ]}
                          >
                            <Input.Password
                              size="large"
                              placeholder={
                                messages["common.newPassword"] as string
                              }
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row className="tt-expenses-without-margin">
                        <Col xs={24} md={24}>
                          <Form.Item
                            name="confirmPassword"
                            rules={[
                              {
                                required: true,
                                message: (
                                  <IntlMessages id="validation.reTypePassword" />
                                ),
                              },
                              ({ getFieldValue }) => ({
                                validator(rule, value) {
                                  if (
                                    !value ||
                                    getFieldValue("password") === value
                                  ) {
                                    return Promise.resolve();
                                  }
                                  return Promise.reject(
                                    <IntlMessages id="validation.passwordMisMatch" />
                                  );
                                },
                              }),
                            ]}
                          >
                            <Input.Password
                              size="large"
                              placeholder={
                                messages["common.retypePassword"] as string
                              }
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row className="tt-expenses-without-margin pt-10">
                        <Col
                          xs={24}
                          md={12}
                          className="tt-expenses-space-start"
                        >
                          <Button
                            key="back"
                            onClick={handleOnBack}
                            className="tt-expenses-space-center"
                          >
                            <IoReturnUpBackOutline className="tt-expenses-margin-btn-icon" />{" "}
                            <IntlMessages id="common.back" />
                          </Button>
                        </Col>
                        <Col xs={24} md={12} className="tt-expenses-space-end">
                          <Button
                            type="primary"
                            htmlType="submit"
                            className="tt-expenses-space-center"
                          >
                            <LuCheckCircle className="tt-expenses-margin-btn-icon" />{" "}
                            <IntlMessages id="common.submit" />
                          </Button>
                        </Col>
                      </Row>
                    </AppRowContainer>
                  </StyledUserProfileForm>
                </>
              )}
            {user?.status !== UserStatusEnums.NEVER_CONNECTED &&
              user?.status !== UserStatusEnums.ACTIVE && (
                <>
                  <p className="tt-expenses-space-center">
                    <IntlMessages id="common.contact.us.description" />
                  </p>
                  <Row>
                    <Col xs={24} lg={24} className="tt-expenses-space-center">
                      <Button
                        type="primary"
                        onClick={() => router.push("/contact-us")}
                        className="tt-expenses-space-center"
                      >
                        <LuMailPlus className="tt-expenses-margin-btn-icon" />{" "}
                        {messages["common.contact.us"] as string}
                      </Button>
                    </Col>
                  </Row>
                </>
              )}
          </StyledUserCardLgSpace>
          <WithFooter />
        </StyledUserContainer>
      </AppAnimate>
    </StyledUserPages>
  );
};

export default VerifyAuthorizationJwtAuth;
