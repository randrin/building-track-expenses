import AppRowContainer from "@crema/components/AppRowContainer";
import IntlMessages from "@crema/helpers/IntlMessages";
import { useAuthUser } from "@crema/hooks/AuthHooks";
import { useJWTAuthActions } from "@crema/services/auth/jwt-auth/JWTAuthProvider";
import {
  Avatar,
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  Typography,
} from "antd";
import dayjs from "dayjs";
import { useUtilContext } from "modules/apps/context/UtilContextProvider";
import moment from "moment";
import { LuCheckCircle } from "react-icons/lu";
import { useIntl } from "react-intl";
import {
  FORMAT_DATE_FOURTH,
  UsersProfileStepEnums,
} from "utils/common-constants.utils";
import {
  StyledUserProfileForm,
  StyledUserProfileFormTitle,
  StyledUserProfileGroupBtn,
} from "../index.styled";

const Information = () => {
  // States
  const { messages } = useIntl();
  const { user } = useAuthUser();
  const { refreshUser, handleOnUpdateUserProfile } = useJWTAuthActions();
  const { countries, countriesFilter } = useUtilContext();

  // Destructing
  const { Option } = Select;
  const { TextArea } = Input;
  const { Title } = Typography;

  // Functions
  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const onFinish = (values: any) => {
    console.log("Success:", values);
    handleOnUpdateUserProfile(values, user._id, UsersProfileStepEnums.ADDRESS);
    refreshUser(user._id);
  };

  // Render
  return (
    <StyledUserProfileForm
      initialValues={{
        ...user,
        addressLineOne: user.address?.addressLineOne,
        addressLineTwo: user.address?.addressLineTwo,
        city: user.address?.city,
        country: user.address?.country,
        zipCode: user.address?.zipCode,
        phoneNumber: user.contact?.phoneNumber,
        phonePrefix: user.contact?.phonePrefix,
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <StyledUserProfileFormTitle>
        <Title level={3}>
          <IntlMessages id="userProfile.information" />
        </Title>
      </StyledUserProfileFormTitle>
      <AppRowContainer gutter={16}>
        <Row className="tt-expenses-without-margin">
          <Col xs={24} md={14} lg={14}>
            <label>
              <IntlMessages id="common.biography" />
            </label>
            <Form.Item
              name="biography"
              rules={[
                {
                  required: true,
                  message: <IntlMessages id="validation.biographyRequired" />,
                },
              ]}
            >
              <TextArea
                rows={4}
                placeholder={messages["placeholder.textarea"] as string}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row className="tt-expenses-without-margin">
          <Col xs={24} md={8}>
            <label>
              <IntlMessages id="common.birthday" />
            </label>
            <Form.Item
              initialValue={moment(user.dateOfBorn).format(FORMAT_DATE_FOURTH)}
              rules={[
                {
                  required: true,
                  message: <IntlMessages id="validation.dateOfBornRequired" />,
                },
              ]}
            >
              <DatePicker
                size="large"
                value={dayjs(user.dateOfBorn) || undefined}
                style={{ width: "100%" }}
                placeholder={messages["placeholder.select"] as string}
                name="dateOfBorn"
                format={FORMAT_DATE_FOURTH}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row className="tt-expenses-without-margin">
          <Col xs={24} md={8}>
            <label>
              <IntlMessages id="common.country" />
            </label>
            <Form.Item
              name="country"
              rules={[
                {
                  required: true,
                  message: <IntlMessages id="validation.countryRequired" />,
                },
              ]}
            >
              <Select
                size="large"
                showSearch
                style={{ width: "100%" }}
                placeholder={messages["placeholder.select"] as string}
                optionFilterProp="label"
                optionLabelProp="label"
              >
                {countries.map((country, index) => {
                  return (
                    <Option
                      key={index}
                      value={country.name}
                      label={country.name}
                    >
                      <Avatar
                        size={25}
                        src={country.flag}
                        shape="square"
                        style={{ marginRight: 5 }}
                      />
                      {country.name}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row className="tt-expenses-without-margin">
          <Col xs={24} md={6}>
            <label>
              <IntlMessages id="common.city" />
            </label>
            <Form.Item
              name="city"
              rules={[
                {
                  required: true,
                  message: <IntlMessages id="validation.cityRequired" />,
                },
              ]}
            >
              <Input
                size="large"
                placeholder={messages["common.city"] as string}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={4}>
            <label>
              <IntlMessages id="common.zipCode" />
            </label>
            <Form.Item name="zipCode">
              <Input
                size="large"
                placeholder={messages["common.zipCode"] as string}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row className="tt-expenses-without-margin">
          <Col xs={24} md={9}>
            <label>
              <IntlMessages id="common.address" />
            </label>
            <Form.Item
              name="addressLineOne"
              rules={[
                {
                  required: true,
                  message: <IntlMessages id="validation.addressRequired" />,
                },
              ]}
            >
              <Input
                size="large"
                placeholder={messages["common.address"] as string}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row className="tt-expenses-without-margin">
          <Col xs={24} md={9}>
            <label>
              <IntlMessages id="common.address.bis" />
            </label>
            <Form.Item name="addressLineTwo">
              <Input
                size="large"
                placeholder={messages["common.address.bis"] as string}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row className="tt-expenses-without-margin">
          <Col xs={24} md={4}>
            <label>
              <IntlMessages id="common.phone.prefix" />
            </label>
            <Form.Item
              name="phonePrefix"
              rules={[
                {
                  required: true,
                  message: <IntlMessages id="validation.prefixPhoneRequired" />,
                },
              ]}
            >
              <Select
                size="large"
                showSearch
                showArrow
                style={{ width: "100%" }}
                placeholder={messages["placeholder.select"] as string}
                optionFilterProp="label"
                optionLabelProp="children"
              >
                {countriesFilter.map((phone, index) => (
                  <Option key={index} value={phone.dialCode} label={phone.name}>
                    <Avatar size={25} src={phone.flag} alt={phone.name} />
                    <span className="ml-5">{phone.dialCode}</span>
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={5}>
            <label>
              <IntlMessages id="common.phone" />
            </label>
            <Form.Item
              name="phoneNumber"
              rules={[
                {
                  required: true,
                  pattern: new RegExp(
                    /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/
                  ),
                  message: <IntlMessages id="validation.phoneNumberRequired" />,
                },
              ]}
            >
              <Input
                size="large"
                placeholder={messages["common.phone"] as string}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row className="tt-expenses-without-margin pt-10">
          <Col xs={24} md={24}>
            <StyledUserProfileGroupBtn
              shouldUpdate
              className="user-profile-group-btn"
            >
              <Button
                type="primary"
                htmlType="submit"
                className="tt-expenses-space-center"
              >
                <LuCheckCircle className="tt-expenses-margin-btn-icon" />{" "}
                <IntlMessages id="common.save" />
              </Button>
              {/* <Button>
                <IntlMessages id="common.delete" />
              </Button> */}
            </StyledUserProfileGroupBtn>
          </Col>
        </Row>
      </AppRowContainer>
    </StyledUserProfileForm>
  );
};

export default Information;
