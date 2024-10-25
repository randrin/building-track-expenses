import languageData from "@crema/components/AppLanguageSwitcher/data";
import { StyledLangItem } from "@crema/components/AppLanguageSwitcher/index.styled";
import { currencies } from "@crema/constants/AppConst";
import { useLocaleActionsContext } from "@crema/context/AppContextProvider/LocaleContextProvider";
import IntlMessages from "@crema/helpers/IntlMessages";
import { useAuthUser } from "@crema/hooks/AuthHooks";
import { useJWTAuthActions } from "@crema/services/auth/jwt-auth/JWTAuthProvider";
import {
  Alert,
  Button,
  Col,
  Divider,
  Modal,
  Popover,
  Radio,
  Row,
  Select,
  Typography,
} from "antd";
import { useState } from "react";
import { LuCheckCircle } from "react-icons/lu";
import { useIntl } from "react-intl";
import { UsersProfileStepEnums } from "utils/common-constants.utils";
import {
  StyledUserProfileFormTitle,
  StyledUserProfileGroupBtn,
} from "../index.styled";
import { IoIosHelpCircleOutline } from "react-icons/io";
import { TbUserX } from "react-icons/tb";

const Setting = () => {
  // States
  const { messages } = useIntl();
  const { user } = useAuthUser();
  const [setting, setSetting] = useState({
    currency: user.settings?.currency ?? "",
    language: user.settings?.language ?? "",
  });
  const { updateLocale } = useLocaleActionsContext();
  const { refreshUser, handleOnUpdateUserProfile, handleOnDeleteUser } =
    useJWTAuthActions();

  // Destructing
  const confirm = Modal.confirm;
  const { currency, language } = setting;
  const { Title, Paragraph } = Typography;
  const { Option } = Select;

  // Init
  const options = languageData.map((language, index) => {
    return {
      value: language.locale,
      label: (
        <StyledLangItem key={index}>
          <i className={`flag flag-24 flag-${language.flag}`}></i>
          <h4>{language.name}</h4>
        </StyledLangItem>
      ),
    };
  });

  // Functions
  const handleOnUpdateSetting = (type: string) => {
    handleOnUpdateUserProfile(setting, user._id, type);
    if (UsersProfileStepEnums.SETTING_LANGUAGE === type) {
      updateLocale(languageData.find((lang) => lang.locale === language));
    }
    refreshUser(user._id);
  };

  //Render
  return (
    <div>
      <StyledUserProfileFormTitle>
        <Title level={3}>
          <IntlMessages id="common.settings" />
        </Title>
      </StyledUserProfileFormTitle>
      <Paragraph>
        <IntlMessages id="common.settings.title" />
      </Paragraph>
      <Row className="tt-expenses-without-margin">
        <Col xs={24} md={8} lg={8}>
          <Title level={5}>
            {messages["common.language"] as string}
            <Popover
              style={{ width: 100 }}
              className="tt-expenses-cursor-pointer ml-10"
              content={<IntlMessages id="common.settings.language" />}
              title={<IntlMessages id="common.alert.info.message" />}
            >
              <IoIosHelpCircleOutline />
            </Popover>
          </Title>
          <Radio.Group
            options={options}
            defaultValue={language}
            value={language}
            optionType="button"
            buttonStyle="solid"
            className="d-flex"
            onChange={(e) =>
              setSetting({ ...setting, language: e.target.value })
            }
          />
        </Col>
      </Row>
      <Row className="tt-expenses-without-margin pt-20">
        <Col xs={24} md={12}>
          <StyledUserProfileGroupBtn
            shouldUpdate
            className="user-profile-group-btn"
          >
            <Button
              type="primary"
              htmlType="submit"
              onClick={() =>
                handleOnUpdateSetting(UsersProfileStepEnums.SETTING_LANGUAGE)
              }
              className="tt-expenses-space-center"
            >
              <LuCheckCircle className="tt-expenses-margin-btn-icon" />{" "}
              <IntlMessages id="common.save" />
            </Button>
          </StyledUserProfileGroupBtn>
        </Col>
      </Row>
      <Divider className="tt-expenses-secondary" />
      <Row className="tt-expenses-without-margin">
        <Col xs={24} md={8} lg={8}>
          <Title level={5}>
            {messages["common.currency"] as string}
            <Popover
              style={{ width: 100 }}
              className="tt-expenses-cursor-pointer ml-10"
              content={<IntlMessages id="common.settings.devise" />}
              title={<IntlMessages id="common.alert.info.message" />}
            >
              <IoIosHelpCircleOutline />
            </Popover>
          </Title>
          <Select
            size="large"
            value={currency || undefined}
            showSearch
            showArrow
            style={{ width: "100%" }}
            placeholder={messages["placeholder.select"] as string}
            optionFilterProp="children"
            onChange={(e) => setSetting({ ...setting, currency: e })}
          >
            {currencies.map((currency, index) => (
              <Option key={index} value={currency.value}>
                {currency.label}
              </Option>
            ))}
          </Select>
        </Col>
      </Row>
      <Row className="tt-expenses-without-margin pt-20">
        <Col xs={24} md={12}>
          <StyledUserProfileGroupBtn
            shouldUpdate
            className="user-profile-group-btn"
          >
            <Button
              type="primary"
              htmlType="submit"
              onClick={() =>
                handleOnUpdateSetting(UsersProfileStepEnums.SETTING_CURRENCY)
              }
              className="tt-expenses-space-center"
            >
              <LuCheckCircle className="tt-expenses-margin-btn-icon" />{" "}
              <IntlMessages id="common.save" />
            </Button>
          </StyledUserProfileGroupBtn>
        </Col>
      </Row>
      <Divider className="tt-expenses-secondary" />
      <Row>
        <Col xs={24} md={24} lg={24}>
          <Title level={3} className="tt-expenses-tomato">
            <IntlMessages id="common.settings.delete.title" />
          </Title>
          <Alert
            message={<IntlMessages id="common.alert.info.message" />}
            description={<IntlMessages id="common.settings.delete.subtitle" />}
            type="info"
            showIcon
          />
          <br />
          <Button
            type="primary"
            onClick={() => handleOnDeleteUser(user._id)}
            danger
            className="tt-expenses-space-center"
          >
            <TbUserX className="tt-expenses-margin-btn-icon" />{" "}
            <IntlMessages id="common.delete" />
          </Button>
        </Col>
      </Row>
    </div>
  );
};
export default Setting;
