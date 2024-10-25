import IntlMessages from "@crema/helpers/IntlMessages";
import { useAuthUser } from "@crema/hooks/AuthHooks";
import {
  Avatar,
  Badge,
  Button,
  Col,
  Divider,
  Form,
  Image,
  Input,
  message,
  notification,
  Popover,
  Row,
  Select,
  Typography,
} from "antd";
import { useUtilContext } from "modules/apps/context/UtilContextProvider";
import { IoIosHelpCircleOutline } from "react-icons/io";
import { LuCheckCircle } from "react-icons/lu";
import { useIntl } from "react-intl";
import Resizer from "react-image-file-resizer";
import {
  StyledUserProfileForm,
  StyledUserProfileFormTitle,
  StyledUserProfileGroupBtn,
} from "../index.styled";
import { CloudUploadOutlined } from "@ant-design/icons";
import { useState } from "react";
import jwtAxios from "@crema/services/auth/jwt-auth";
import { TAM_UPLOAD_PROFILE_URL } from "utils/end-points.utils";
import { useJWTAuthActions } from "@crema/services/auth/jwt-auth/JWTAuthProvider";
import {
  UserDocumentTypeEnums,
  UsersProfileStepEnums,
} from "utils/common-constants.utils";

const Payment = () => {
  // States
  const [form] = Form.useForm();
  const { messages } = useIntl();
  const { user } = useAuthUser();
  const { refreshUser, handleOnUpdateUserProfile } = useJWTAuthActions();
  const { countriesFilter } = useUtilContext();
  const [userPayment, setUserPayment] = useState({
    iban: {
      secureUrl: user.payment?.bank?.picture?.secure_url ?? "",
      publicId: user.payment?.bank?.picture?.public_id ?? "",
    },
    phone: {
      prefix: user.payment?.phone?.prefix ?? "",
      nUmber: user.payment?.phone?.number ?? "",
    },
  });

  // Destructing
  const { Title, Paragraph } = Typography;
  const { Option } = Select;

  // Init
  const contentSalary = () => {
    return (
      <div>
        <p className="tt-expenses-without-margin tt-expenses-without-padding">
          <IntlMessages id={`common.tooltip.payment.salary`} />
        </p>
      </div>
    );
  };

  // Functions
  const handleInputChange = (e: any, name: string) => {
    const { value } = e.target;
    form.setFieldsValue({
      [name]: value.toUpperCase(),
    });
  };

  const onFinishPhone = (values: any) => {
    console.log("Finish:", values);
    let payment = {
      prefix: values.prefix,
      number: values.number,
    };
    handleOnUpdateUserProfile(
      payment,
      user._id,
      UsersProfileStepEnums.PAYMENT_PHONE
    );
    refreshUser(user._id);
  };

  const onFinishBank = (values: any) => {
    console.log("Finish:", values);
    let payment = {
      bic: values.bic,
      iban: values.iban,
      beneficiary: values.beneficiary,
    };
    handleOnUpdateUserProfile(
      payment,
      user._id,
      UsersProfileStepEnums.PAYMENT_BANK
    );
    refreshUser(user._id);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const handleOnGetMessage = (message: string) => {
    return messages[message] as string;
  };

  const handleOnCallNotification = () => {
    notification.success({
      message: handleOnGetMessage("common.success"),
      description: handleOnGetMessage("common.notification.update.description"),
    });
  };

  const onReset = async (type: string) => {
    await jwtAxios
      .delete(
        `${TAM_UPLOAD_PROFILE_URL}/${user._id}/delete/${
          userPayment.iban.publicId.split("/")[1]
        }/document/${type.toLocaleLowerCase()}`
      )
      .then((res) => {
        if (res.data.result === "ok" && res.status === 200) {
          setUserPayment({
            ...userPayment,
            iban: { secureUrl: "", publicId: "" },
          });
          handleOnCallNotification();
        }
      })
      .catch((error) => {
        console.log("handleImageRemove Error: ", error);
        message.error(error.response.data.message);
      });
  };

  const handleOnChange = async (e: any, type: string) => {
    // Resize
    const files = e.target.files;
    const accept = ["image/png", "image/jpg", "image/jpeg", "application/pdf"];
    if (accept.indexOf(files[0].type) === -1) {
      message.error(messages["common.upload.not.allowed"] as string);
    } else if (files[0].size > 8000 * 1024) {
      message.error(messages["common.upload.file.size"] as string);
    } else {
      if (files[0]) {
        Resizer.imageFileResizer(
          files[0],
          720,
          720,
          "JPEG",
          100,
          0,
          async (uri) => {
            const file = new FormData();
            file.append("file", files[0]);
            await jwtAxios
              .post(
                `${TAM_UPLOAD_PROFILE_URL}/${user._id}/document/${type}`,
                file,
                {
                  headers: {
                    "Content-Type": "multipart/form-data",
                  },
                }
              )
              .then((res) => {
                setUserPayment({
                  ...userPayment,
                  iban: {
                    secureUrl: res.data.secure_url,
                    publicId: res.data.public_id,
                  },
                });
                handleOnCallNotification();
              })
              .catch((error) => {
                console.log(
                  "MultipleFileUpload -> handleOnChange Error: ",
                  error
                );
                message.error(error.response.data.message);
              });
          },
          "base64"
        );
        // Send back to server to upload to cloudinary
        // Set url to images[] in the parent component - ProductCreate
      }
    }
  };

  // Render
  return (
    <div>
      <StyledUserProfileFormTitle>
        <Title level={3}>
          <IntlMessages id="common.payment" />
        </Title>
      </StyledUserProfileFormTitle>
      <Row className="tt-expenses-without-margin">
        <Col xs={24} md={12} lg={12}>
          <Title level={4} className="tt-expenses-success">
            <IntlMessages id="common.salary" />
            <Popover
              className="tt-expenses-cursor-pointer ml-10"
              content={contentSalary()}
              title={<IntlMessages id="common.alert.info.message" />}
            >
              <IoIosHelpCircleOutline />
            </Popover>
          </Title>
          <Paragraph>
            {Number(user.salary.amount).toLocaleString()} {user.salary.currency}{" "}
            / <IntlMessages id="common.monthly" />
          </Paragraph>
        </Col>
      </Row>
      <Divider className="tt-expenses-secondary" />
      <Row>
        <Col xs={24} md={14} lg={14}>
          <Title level={3}>
            <IntlMessages id="common.payment.method" />
          </Title>
          <i>
            <IntlMessages id="common.payment.description" />
          </i>
        </Col>
      </Row>
      <StyledUserProfileForm
        initialValues={{
          ...user.payment?.phone,
        }}
        onFinish={onFinishPhone}
        onFinishFailed={onFinishFailed}
      >
        <Row className="tt-expenses-without-margin">
          <Col xs={24} md={12} lg={12}>
            <Title level={5} className="tt-expenses-success">
              <IntlMessages id="common.phoneNumber" />
            </Title>
          </Col>
        </Row>
        <Row className="tt-expenses-without-margin">
          <Col xs={24} md={4}>
            <label>
              <IntlMessages id="common.phone.prefix" />
            </label>
            <Form.Item
              name="prefix"
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
              name="number"
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
            </StyledUserProfileGroupBtn>
          </Col>
        </Row>
      </StyledUserProfileForm>
      <Divider orientation="center" className="tt-expenses-secondary">
        <IntlMessages id="common.or" />
      </Divider>
      <Row className="tt-expenses-without-margin">
        <Col xs={24} md={12} lg={12}>
          <Title level={5} className="tt-expenses-success">
            <IntlMessages id="common.iban" />
          </Title>
        </Col>
      </Row>
      <Row className="tt-expenses-without-margin">
        <Col xs={24} md={12} lg={12}>
          <label>
            <IntlMessages id="common.my.iban" />
          </label>
          <Paragraph className="tt-expenses-tomato">
            <IntlMessages id="common.upload.allowedPdf" />
          </Paragraph>
          {!!userPayment.iban.publicId.length ? (
            <div className="tt-expenses-without-padding col d-flex">
              <Badge>
                <Image
                  alt={userPayment.iban.publicId}
                  src={userPayment.iban.secureUrl}
                  preview={true}
                  width={100}
                  height={100}
                  className="m-3"
                />
              </Badge>
              <span
                className="tt-expenses-cursor-pointer tt-expenses-btn-remove-image mr-10"
                onClick={() =>
                  onReset(
                    UserDocumentTypeEnums.PAYMENT_IBAN.toLocaleLowerCase()
                  )
                }
              >
                X
              </span>
            </div>
          ) : (
            <label className="tt-expenses-btn-upload">
              <CloudUploadOutlined
                size={30}
                className="tt-expenses-btn-upload-icon"
              />
              {messages["common.upload.file"] as string}
              <input
                className="ant-upload-drag-icon"
                type="file"
                hidden
                accept="image/*"
                onChange={(e) =>
                  handleOnChange(
                    e,
                    UserDocumentTypeEnums.PAYMENT_IBAN.toLocaleLowerCase()
                  )
                }
              />
            </label>
          )}
        </Col>
        <Col xs={24} md={12} lg={12}>
          <StyledUserProfileForm
            form={form}
            initialValues={{
              ...user.payment?.bank,
            }}
            onFinish={onFinishBank}
            onFinishFailed={onFinishFailed}
          >
            <Row className="tt-expenses-without-margin">
              <Col xs={24} md={24} lg={24}>
                <label>
                  <IntlMessages id="common.bic" />
                </label>
                <Form.Item
                  name="bic"
                  rules={[
                    {
                      required: true,
                      pattern: /^[a-zA-Z]*$/,
                      message: <IntlMessages id="validation.bicRequired" />,
                    },
                  ]}
                >
                  <Input
                    size="large"
                    onChange={(e) => handleInputChange(e, "bic")}
                    placeholder={messages["placeholder.input"] as string}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={24}>
                <label>
                  <IntlMessages id="common.my.iban" />
                </label>
                <Form.Item
                  name="iban"
                  rules={[
                    {
                      required: true,
                      pattern: /^[a-zA-Z0-9]*$/,
                      message: <IntlMessages id="validation.ibanRequired" />,
                    },
                  ]}
                >
                  <Input
                    size="large"
                    onChange={(e) => handleInputChange(e, "iban")}
                    placeholder={messages["placeholder.input"] as string}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={24}>
                <label>
                  <IntlMessages id="common.beneficiary" />
                </label>
                <Form.Item
                  name="beneficiary"
                  rules={[
                    {
                      required: true,
                      message: (
                        <IntlMessages id="validation.beneficiaryRequired" />
                      ),
                    },
                  ]}
                >
                  <Input
                    size="large"
                    placeholder={messages["placeholder.input"] as string}
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
                </StyledUserProfileGroupBtn>
              </Col>
            </Row>
          </StyledUserProfileForm>
        </Col>
      </Row>
    </div>
  );
};

export default Payment;
