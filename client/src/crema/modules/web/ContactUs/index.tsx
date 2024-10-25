import AppAnimate from "@crema/components/AppAnimate";
import AppPageMeta from "@crema/components/AppPageMeta";
import AppRowContainer from "@crema/components/AppRowContainer";
import WithFooter from "@crema/core/DefaultPage/withFooter";
import IntlMessages from "@crema/helpers/IntlMessages";
import {
  StyledUserCardLgSpace,
  StyledUserContainer,
  StyledUserPages,
} from "@crema/modules/userPages/index.styled";
import { useJWTAuth } from "@crema/services/auth/jwt-auth/JWTAuthProvider";
import { Button, Col, Form, Input, Row } from "antd";
import { useUtilActionsContext } from "modules/apps/context/UtilContextProvider";
import {
  StyledAvatarIcon,
  StyledContactAddress,
  StyledContactAddressItem,
  StyledSendMessage,
  StyledSendMessageTitle,
} from "modules/dashboards/index.styled";
import { useRouter } from "next/router";
import { FiMail, FiPhone } from "react-icons/fi";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { IoReturnUpBackOutline } from "react-icons/io5";
import { LuCheckCircle } from "react-icons/lu";
import { useIntl } from "react-intl";
import { TAM_SIGNIN_URL } from "utils/end-points.utils";

const ContactUs = () => {
  // States
  const { user } = useJWTAuth();
  const { handleOnSubmitContactMessage } = useUtilActionsContext();
  console.log(user);

  // Desctructing
  const router = useRouter();
  const { messages } = useIntl();

  // Functions
  const onFinish = (values: any) => {
    console.log("Finish:", values);
    handleOnSubmitContactMessage(values);
  };

  // Render
  return (
    <StyledUserPages>
      <AppPageMeta title={messages["extraPages.contactUs"] as string} />
      <AppAnimate animation="transition.slideUpIn" delay={200}>
        <StyledUserContainer className="tt-expenses-ant-layout tt-expenses-screen-center">
          <StyledUserCardLgSpace style={{ maxWidth: "70%" }}>
            <StyledSendMessage>
              <StyledSendMessageTitle>
                <IntlMessages id="extraPages.sendUsMessage" />
              </StyledSendMessageTitle>
              <p>{messages["extraPages.contactUs.description"] as string}</p>
            </StyledSendMessage>
            <AppRowContainer className="d-flex m-5">
              <Col xs={24} md={12}>
                <Form
                  onFinish={onFinish}
                  initialValues={{
                    email: user ? user.email : "",
                    displayName: user ? user.displayName : "",
                  }}
                >
                  <AppRowContainer gutter={16}>
                    <Col xs={24}>
                      <Form.Item
                        name="displayName"
                        rules={[
                          {
                            required: true,
                            message: (
                              <IntlMessages id="validation.fullNameRequired" />
                            ),
                          },
                        ]}
                      >
                        <Input
                          type="text"
                          size="large"
                          disabled={!!user?.displayName}
                          placeholder={messages["common.fullname"] as string}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24}>
                      <Form.Item
                        name="email"
                        rules={[
                          {
                            required: true,
                            type: "email",
                            message: (
                              <IntlMessages id="validation.emailRequired" />
                            ),
                          },
                        ]}
                      >
                        <Input
                          type="text"
                          size="large"
                          disabled={!!user?.email}
                          placeholder={messages["common.email"] as string}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24}>
                      <Form.Item
                        name="subject"
                        rules={[
                          {
                            required: true,
                            message: (
                              <IntlMessages id="validation.subjectRequired" />
                            ),
                          },
                        ]}
                      >
                        <Input
                          type="text"
                          size="large"
                          placeholder={messages["common.subject"] as string}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24}>
                      <Form.Item
                        name="message"
                        rules={[
                          {
                            required: true,
                            message: (
                              <IntlMessages id="validation.commentRequired" />
                            ),
                          },
                        ]}
                      >
                        <Input.TextArea
                          rows={5}
                          placeholder={
                            messages["placeholder.textarea"] as string
                          }
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={24}>
                      <Row style={{ marginBottom: "0px !important" }}>
                        <Col
                          xs={24}
                          md={12}
                          className="tt-expenses-space-start"
                        >
                          <Form.Item shouldUpdate>
                            <Button
                              key="back"
                              onClick={() => router.push(TAM_SIGNIN_URL)}
                              className="tt-expenses-space-center"
                            >
                              <IoReturnUpBackOutline className="tt-expenses-margin-btn-icon" />{" "}
                              <IntlMessages id="common.back" />
                            </Button>
                          </Form.Item>
                        </Col>
                        <Col xs={24} md={12} className="tt-expenses-space-end">
                          <Form.Item shouldUpdate>
                            <Button
                              type="primary"
                              className="tt-expenses-space-center"
                              htmlType="submit"
                            >
                              <LuCheckCircle className="tt-expenses-margin-btn-icon" />{" "}
                              {messages["common.submit"] as string}
                            </Button>
                          </Form.Item>
                        </Col>
                      </Row>
                    </Col>
                  </AppRowContainer>
                </Form>
              </Col>
              <Col xs={24} md={12}>
                <StyledContactAddress>
                  <StyledContactAddressItem>
                    <StyledAvatarIcon>
                      <HiOutlineLocationMarker />
                    </StyledAvatarIcon>
                    <p>
                      795 Folsom Ave, Suite 600 <br /> San Francisco, CA 94107
                    </p>
                  </StyledContactAddressItem>
                  <StyledContactAddressItem>
                    <StyledAvatarIcon>
                      <FiPhone />
                    </StyledAvatarIcon>
                    <p>(120) 456-789-123</p>
                  </StyledContactAddressItem>
                  <StyledContactAddressItem>
                    <StyledAvatarIcon>
                      <FiMail />
                    </StyledAvatarIcon>
                    <p>support@yourmail.com</p>
                  </StyledContactAddressItem>
                </StyledContactAddress>
              </Col>
            </AppRowContainer>
          </StyledUserCardLgSpace>
          <WithFooter />
        </StyledUserContainer>
      </AppAnimate>
    </StyledUserPages>
  );
};

export default ContactUs;
