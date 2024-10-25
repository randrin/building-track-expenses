import AppRowContainer from "@crema/components/AppRowContainer";
import IntlMessages from "@crema/helpers/IntlMessages";
import { useAuthUser } from "@crema/hooks/AuthHooks";
import jwtAxios from "@crema/services/auth/jwt-auth";
import { useJWTAuthActions } from "@crema/services/auth/jwt-auth/JWTAuthProvider";
import { AuthUserType } from "@crema/types/models/AuthUser";
import {
  Avatar,
  Button,
  Col,
  Divider,
  Form,
  Input,
  Radio,
  Row,
  Tooltip,
  Typography,
  message,
} from "antd";
import { useDepartmentContext } from "modules/apps/context/DepartmentContextProvider";
import moment from "moment";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { BsCloudUpload } from "react-icons/bs";
import { CiTrash } from "react-icons/ci";
import { LuCheckCircle } from "react-icons/lu";
import Resizer from "react-image-file-resizer";
import { useIntl } from "react-intl";
import { Tt_DateFormat } from "utils";
import {
  FORMAT_DATE_THREE,
  GenderEnums,
  UsersProfileStepEnums,
} from "utils/common-constants.utils";
import { TAM_UPLOAD_PROFILE_URL } from "utils/end-points.utils";
import { StyledUserProfileGroupBtn } from "../index.styled";
import {
  StyledInfoUpload,
  StyledInfoUploadAvatar,
  StyledInfoUploadBtnView,
  StyledInfoUploadContent,
} from "./index.styled";

const PersonalInfo = () => {
  // States
  const { messages } = useIntl();
  const { user } = useAuthUser();
  const { refreshUser, handleOnUpdateUserProfile } = useJWTAuthActions();
  const [userImage, setUserImage] = useState(
    user.photoURL ? user.photoURL.secure_url : "/assets/images/placeholder.jpg"
  );
  const { departments } = useDepartmentContext();

  // Destructing
  const { Title, Paragraph } = Typography;

  // Functions
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
    },
    onDrop: (acceptedFiles) => {
      console.log(acceptedFiles);
      if (!acceptedFiles.length) {
        message.error(messages["common.upload.not.allowed"] as string);
      } else if (acceptedFiles[0].size > 8000 * 1024) {
        message.error(messages["common.upload.file.size"] as string);
      } else {
        // Resize
        Resizer.imageFileResizer(
          acceptedFiles[0],
          720,
          720,
          "JPEG",
          100,
          0,
          async () => {
            const file = new FormData();
            file.append("file", acceptedFiles[0]);
            await jwtAxios
              .post(`${TAM_UPLOAD_PROFILE_URL}/${user._id}`, file, {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              })
              .then((res) => {
                refreshUser(user._id);
                setUserImage(res.data.secure_url);
              })
              .catch((error) => {
                console.log("handleOnChange Error: ", error);
                message.error(error.response.data.message);
              });
          },
          "base64"
        );
      }
    },
  });

  const handleOnGetUserDepartments = (user: AuthUserType) => {
    return departments?.filter((dpt) =>
      dpt.contributors.find((userDpt) => user._id === userDpt._id)
    );
  };

  const onReset = async () => {
    await jwtAxios
      .delete(
        `${TAM_UPLOAD_PROFILE_URL}/${user._id}/delete/${
          user.photoURL.public_id.split("/")[1]
        }`
      )
      .then((res) => {
        if (res.data.result === "ok" && res.status === 200) {
          refreshUser(user._id);
          setUserImage("/assets/images/placeholder.jpg");
        }
      })
      .catch((error) => {
        console.log("handleImageRemove Error: ", error);
        message.error(error.response.data.message);
      });
  };

  const onFinish = (values: any) => {
    console.log("Finish:", values);
    handleOnUpdateUserProfile(
      values,
      user._id,
      UsersProfileStepEnums.INFORMATIONS
    );
  };

  // Render
  return (
    <Form
      onFinish={onFinish}
      initialValues={{
        ...user,
        userImage: user.photoURL
          ? user.photoURL.secure_url
          : "/assets/images/placeholder.jpg",
      }}
    >
      <AppRowContainer gutter={16}>
        <Row className="tt-expenses-without-margin">
          <Col xs={24} md={12} lg={12}>
            <Title level={4}>
              <IntlMessages id="common.member.since" />
            </Title>
            <Paragraph>{moment(user.createdAt).fromNow()}</Paragraph>
          </Col>
          <Col xs={24} md={12} lg={12}>
            <Title level={4}>
              <IntlMessages id="common.lastLogin" />
            </Title>
            <Paragraph>
              {Tt_DateFormat(user.lastLogin, FORMAT_DATE_THREE)}
            </Paragraph>
          </Col>
        </Row>
        <Divider className="tt-expenses-secondary" />
        <StyledInfoUpload>
          <StyledInfoUploadAvatar src={userImage} />
          <StyledInfoUploadContent>
            <StyledInfoUploadBtnView>
              <div {...getRootProps({ className: "dropzone" })}>
                <input {...getInputProps()} />
                <label htmlFor="icon-button-file">
                  <Button type="primary" className="tt-expenses-space-center">
                    <BsCloudUpload className="tt-expenses-margin-btn-icon" />{" "}
                    <IntlMessages id="common.upload" />
                  </Button>
                </label>
              </div>
              {user.photoURL && (
                <Button
                  danger
                  onClick={onReset}
                  className="tt-expenses-space-center"
                >
                  <CiTrash className="tt-expenses-margin-btn-icon" />{" "}
                  <IntlMessages id="common.delete" />
                </Button>
              )}
            </StyledInfoUploadBtnView>
            <p>
              <IntlMessages id="common.upload.allowed" />
            </p>
          </StyledInfoUploadContent>
        </StyledInfoUpload>
        <Divider className="tt-expenses-secondary" />
        <Row className="tt-expenses-without-margin">
          <Col xs={24} md={8} lg={6}>
            <label>
              <IntlMessages id="common.gender" />
            </label>
            <Form.Item
              name="gender"
              rules={[
                {
                  required: true,
                  message: <IntlMessages id="validation.genderRequired" />,
                },
              ]}
            >
              <Radio.Group value={user.gender}>
                <Radio value={GenderEnums.MALE}>
                  {messages["common.gender.male"] as string}
                </Radio>
                <Radio value={GenderEnums.FEMALE}>
                  {messages["common.gender.female"] as string}
                </Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>
        <Row className="tt-expenses-without-margin">
          <Col xs={24} md={8} lg={6}>
            <label>
              <IntlMessages id="common.firstname" />
            </label>
            <Form.Item
              name="firstName"
              rules={[
                {
                  required: true,
                  message: <IntlMessages id="validation.firstNameRequired" />,
                },
              ]}
            >
              <Input
                size="large"
                placeholder={messages["common.firstname"] as string}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={8} lg={6}>
            <label>
              <IntlMessages id="common.lastname" />
            </label>
            <Form.Item
              name="lastName"
              rules={[
                {
                  required: true,
                  message: <IntlMessages id="validation.lastNameRequired" />,
                },
              ]}
            >
              <Input
                size="large"
                placeholder={messages["common.lastname"] as string}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={8} lg={6}>
            <label>
              <IntlMessages id="common.userId" />
            </label>
            <Form.Item
              name="username"
              rules={[
                {
                  required: true,
                  message: <IntlMessages id="validation.usernameRequired" />,
                },
              ]}
            >
              <Input
                size="large"
                placeholder={messages["common.userId"] as string}
                disabled
              />
            </Form.Item>
          </Col>
        </Row>
        <Row className="tt-expenses-without-margin">
          <Col xs={24} md={12} lg={8}>
            <label>
              <IntlMessages id="common.email" />
            </label>
            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  type: "email",
                  pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                  message: <IntlMessages id="validation.emailRequired" />,
                },
              ]}
            >
              <Input
                type="text"
                size="large"
                placeholder={messages["common.email"] as string}
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
        <Divider className="tt-expenses-secondary" />
        <Row className="tt-expenses-without-margin">
          <Col xs={24} md={12} lg={8}>
            <label>
              <IntlMessages id="common.departments" />
            </label>
            <div className="tt-users-groups">
              {!!handleOnGetUserDepartments(user)?.length ? (
                <Avatar.Group
                  maxCount={4}
                  maxStyle={{
                    color: "#fff",
                    backgroundColor: "#2997ff99",
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "40px",
                  }}
                >
                  {handleOnGetUserDepartments(user)?.map((data, index) => (
                    <>
                      <Tooltip
                        key={"department-" + index}
                        placement="topLeft"
                        title={data.name}
                        className="tt-expenses-cursor-pointer"
                      >
                        <Avatar
                          size={40}
                          alt={data.name}
                          src={
                            data.logo?.secure_url
                              ? data.logo?.secure_url
                              : "/assets/icon/default-org.jpg"
                          }
                        />
                      </Tooltip>
                    </>
                  ))}
                </Avatar.Group>
              ) : (
                "-"
              )}
            </div>
          </Col>
        </Row>
      </AppRowContainer>
    </Form>
  );
};

export default PersonalInfo;
