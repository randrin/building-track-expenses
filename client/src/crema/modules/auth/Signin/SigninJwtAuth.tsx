import { Checkbox, Form, Input } from "antd";
import { useIntl } from "react-intl";
import IntlMessages from "@crema/helpers/IntlMessages";
import { useAuthMethod } from "@crema/hooks/AuthHooks";
import { useRouter } from "next/router";
import {
  SignInButton,
  StyledRememberMe,
  StyledSign,
  StyledSignContent,
  StyledSignForm,
  StyledSignLink,
} from "./index.styled";
import { IoIosArrowRoundForward } from "react-icons/io";
import { useEffect, useState } from "react";
import { RememberUserType } from "@crema/types/models/RememberUser";
import { TAM_FORGOT_PASSWORD_LINK } from "utils/end-points.utils";

const SignInJwtAuth = () => {
  // States
  const [rememberUser, setRememberUser] = useState({
    rememberMe: false,
    expirationDate: 0,
    email: "",
    password: "",
  });
  const router = useRouter();
  const { signInUser } = useAuthMethod();

  // Init
  useEffect(() => {
    console.log(localStorage.getItem("rememberMe") !== undefined);

    if (localStorage.getItem("rememberMe") !== null) {
      const rememberUser = JSON.parse(localStorage.getItem("rememberMe"));
      if (rememberUser.expirationDate > new Date().getTime()) {
        setRememberUser({
          rememberMe: rememberUser.rememberMe,
          expirationDate: rememberUser.expirationDate,
          email: rememberUser.email,
          password: rememberUser.password,
        });
      } else {
        localStorage.removeItem("rememberMe");
      }
    }
    console.log(rememberUser);
    console.log("End");
  }, []);

  // Destructing
  const { messages } = useIntl();

  // Functions
  const handleOnCheckRememberMe = () => {
    if (localStorage.getItem("rememberMe")) {
      const rememberUser = JSON.parse(localStorage.getItem("rememberMe"));
      if (rememberUser.expirationDate > new Date().getTime()) {
        setRememberUser({
          rememberMe: rememberUser.rememberMe,
          expirationDate: rememberUser.expirationDate,
          email: rememberUser.email,
          password: rememberUser.password,
        });
      } else {
        localStorage.removeItem("rememberMe");
      }
    }
  };

  const onFinish = (values: any) => {
    console.log("Success:", values);
    if (rememberUser.rememberMe) {
      let currentDate = new Date();
      let currentDateAfter7Days = currentDate.setDate(
        currentDate.getDate() + 7
      );
      localStorage.setItem(
        "rememberMe",
        JSON.stringify({
          email: values.email,
          password: values.password,
          expirationDate: currentDateAfter7Days,
          rememberMe: rememberUser.rememberMe,
        })
      );
    } else {
      localStorage.removeItem("rememberMe");
    }
    signInUser({
      email: values.email,
      password: values.password,
    });
  };
  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const onGoToForgetPassword = () => {
    router.push(TAM_FORGOT_PASSWORD_LINK);
  };

  const onRememberMe = (e) => {
    console.log(`checked = ${e.target.checked}`);
    setRememberUser({
      ...rememberUser,
      rememberMe: e.target.checked,
    });
  };

  // Render
  return (
    <StyledSign>
      <StyledSignContent>
        <StyledSignForm
          name="basic"
          initialValues={{
            ...rememberUser,
          }}
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
            <Input
              size="large"
              placeholder={messages["common.email"] as string}
            />
          </Form.Item>
          <Form.Item
            name="password"
            className="form-field"
            rules={[
              {
                required: true,
                message: <IntlMessages id="validation.passwordRequired" />,
              },
            ]}
          >
            <Input.Password
              size="large"
              placeholder={messages["common.password"] as string}
            />
          </Form.Item>
          <StyledRememberMe>
            <Checkbox
              checked={rememberUser.rememberMe}
              onChange={(e) => onRememberMe(e)}
            >
              <IntlMessages id="common.rememberMe" />
            </Checkbox>
            <StyledSignLink onClick={onGoToForgetPassword}>
              <IntlMessages id="common.forgetPassword" />
            </StyledSignLink>
          </StyledRememberMe>
          <div className="form-btn-field">
            <SignInButton
              type="primary"
              htmlType="submit"
              className="tt-expenses-space-center"
            >
              <IntlMessages id="common.login" />
              <IoIosArrowRoundForward className="tt-expenses-margin-btn-icon" />
            </SignInButton>
          </div>

          {/* <div className="form-field-action">
            <StyledSignTextGrey>
              <IntlMessages id="common.dontHaveAccount" />
            </StyledSignTextGrey>
            <StyledSignLinkTag href={`/signup`}>
              <IntlMessages id="common.signup" />
            </StyledSignLinkTag>
          </div> */}
        </StyledSignForm>
      </StyledSignContent>
    </StyledSign>
  );
};

export default SignInJwtAuth;
