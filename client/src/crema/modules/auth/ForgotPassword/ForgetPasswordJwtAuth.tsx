import React from "react";
import Link from "next/link";
import { Form, Input } from "antd";
import IntlMessages from "@crema/helpers/IntlMessages";
import { useIntl } from "react-intl";
import {
  StyledForgotForm,
  StyledForgotContent,
  StyledForgotPara,
  StyledFormFooter,
  StyledForgotBtn,
} from "./index.styled";
import { TAM_SIGNIN_URL } from "utils/end-points.utils";
import { IoIosArrowRoundForward } from "react-icons/io";

const ForgetPasswordJwtAuth = () => {
  // States
  const { messages } = useIntl();

  // Functions
  const onFinish = (values: any) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  // Render
  return (
    <StyledForgotContent>
      <StyledForgotPara>
        <IntlMessages id="common.forgetPasswordTextOne" />
        <span>
          <IntlMessages id="common.forgetPasswordTextTwo" />
        </span>
      </StyledForgotPara>

      <StyledForgotForm
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          name="email"
          className="form-field"
          rules={[
            {
              required: true,
              type: "email",
              message: <IntlMessages id="validation.emailRequired" />,
            },
          ]}
        >
          <Input placeholder={messages["common.emailAddress"] as string} />
        </Form.Item>

        <div className="form-field">
          <StyledForgotBtn type="primary" htmlType="submit">
            <IntlMessages id="common.sendNewPassword" />
          </StyledForgotBtn>
        </div>

        <StyledFormFooter>
          <IntlMessages id="common.alreadyHavePassword" />
          <Link href={TAM_SIGNIN_URL} className="tt-expenses-space-start">
            <IntlMessages id="common.signIn" />
            <IoIosArrowRoundForward className="ml-3 tt-expenses-margin-btn-icon" />
          </Link>
        </StyledFormFooter>
      </StyledForgotForm>
    </StyledForgotContent>
  );
};

export default ForgetPasswordJwtAuth;
