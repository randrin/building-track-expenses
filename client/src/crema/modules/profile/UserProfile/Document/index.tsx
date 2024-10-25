import { CloudUploadOutlined } from "@ant-design/icons";
import IntlMessages from "@crema/helpers/IntlMessages";
import { useAuthUser } from "@crema/hooks/AuthHooks";
import jwtAxios from "@crema/services/auth/jwt-auth";
import { useJWTAuthActions } from "@crema/services/auth/jwt-auth/JWTAuthProvider";
import {
  Badge,
  Col,
  Divider,
  Image,
  message,
  notification,
  Popover,
  Row,
  Typography,
} from "antd";
import { useState } from "react";
import { IoIosHelpCircleOutline } from "react-icons/io";
import Resizer from "react-image-file-resizer";
import { useIntl } from "react-intl";
import { UserDocumentTypeEnums } from "utils/common-constants.utils";
import { TAM_UPLOAD_PROFILE_URL } from "utils/end-points.utils";
import { StyledUserProfileFormTitle } from "../index.styled";

const Document = () => {
  // States
  const { messages } = useIntl();
  const { user } = useAuthUser();
  const { refreshUser } = useJWTAuthActions();
  const [userDocument, setUserDocument] = useState({
    cni: {
      secureUrl: user.documents?.cni?.secure_url ?? "",
      publicId: user.documents?.cni?.public_id ?? "",
    },
    passport: {
      secureUrl: user.documents?.passport?.secure_url ?? "",
      publicId: user.documents?.passport?.public_id ?? "",
    },
    residence: {
      secureUrl: user.documents?.residence?.secure_url ?? "",
      publicId: user.documents?.residence?.public_id ?? "",
    },
  });

  // Destructing
  const { Title, Paragraph } = Typography;

  // Functions
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
        `${TAM_UPLOAD_PROFILE_URL}/${user._id}/delete/${handleOnGetPublicId(
          type
        )}/document/${type.toLocaleLowerCase()}`
      )
      .then((res) => {
        if (res.data.result === "ok" && res.status === 200) {
          refreshUser(user._id);
          handleOnSetUserDocument(type, res);
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
                handleOnSetUserDocument(type, res);
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

  const handleOnGetPublicId = (type: string) => {
    switch (type) {
      case UserDocumentTypeEnums.CNI.toLocaleLowerCase():
        return userDocument.cni.publicId.split("/")[1];
      case UserDocumentTypeEnums.PASSPORT.toLocaleLowerCase():
        return userDocument.passport.publicId.split("/")[1];
      case UserDocumentTypeEnums.RESIDENCE.toLocaleLowerCase():
        return userDocument.residence.publicId.split("/")[1];
      default:
        break;
    }
  };

  const handleOnSetUserDocument = (type: string, res: any) => {
    switch (type) {
      case UserDocumentTypeEnums.CNI.toLocaleLowerCase():
        setUserDocument({
          ...userDocument,
          cni: {
            secureUrl: res.data.secure_url ?? "",
            publicId: res.data.public_id ?? "",
          },
        });
        break;
      case UserDocumentTypeEnums.PASSPORT.toLocaleLowerCase():
        setUserDocument({
          ...userDocument,
          passport: {
            secureUrl: res.data.secure_url ?? "",
            publicId: res.data.public_id ?? "",
          },
        });
        break;
      case UserDocumentTypeEnums.RESIDENCE.toLocaleLowerCase():
        setUserDocument({
          ...userDocument,
          residence: {
            secureUrl: res.data.secure_url ?? "",
            publicId: res.data.public_id ?? "",
          },
        });
        break;
      default:
        break;
    }
  };

  // Render
  return (
    <div>
      <StyledUserProfileFormTitle>
        <Title level={3}>
          <IntlMessages id="common.my.document" />
        </Title>
      </StyledUserProfileFormTitle>
      <Row className="tt-expenses-without-margin">
        <Col xs={24} md={24} lg={24}>
          <h3 className="tt-expenses-primary">
            <IntlMessages id="common.identity.document" />
          </h3>
          <i>
            <IntlMessages id="common.identity.document.description" />
          </i>
          <Paragraph className="tt-expenses-tomato">
            <IntlMessages id="common.upload.allowedPdf" />
          </Paragraph>
          {!!userDocument.cni.publicId.length ? (
            <div className="tt-expenses-without-padding col d-flex">
              <Badge>
                <Image
                  alt={userDocument.cni.publicId}
                  src={userDocument.cni.secureUrl}
                  preview={true}
                  width={100}
                  height={100}
                  className="m-3"
                />
              </Badge>
              <span
                className="tt-expenses-cursor-pointer tt-expenses-btn-remove-image mr-10"
                onClick={() =>
                  onReset(UserDocumentTypeEnums.CNI.toLocaleLowerCase())
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
                    UserDocumentTypeEnums.CNI.toLocaleLowerCase()
                  )
                }
              />
            </label>
          )}
        </Col>
      </Row>
      <Divider className="tt-expenses-secondary" />
      <Row className="tt-expenses-without-margin">
        <Col xs={24} md={24} lg={24}>
          <h3 className="tt-expenses-primary">
            <IntlMessages id="common.passport.document" /> (
            <IntlMessages id="common.optional" />)
          </h3>
          <i>
            <IntlMessages id="common.passport.document.description" />
          </i>
          <Paragraph className="tt-expenses-tomato">
            <IntlMessages id="common.upload.allowedPdf" />
          </Paragraph>
          {!!userDocument.passport.publicId.length ? (
            <div className="tt-expenses-without-padding col d-flex">
              <Badge>
                <Image
                  alt={userDocument.passport.publicId}
                  src={userDocument.passport.secureUrl}
                  preview={true}
                  width={100}
                  height={100}
                  className="m-3"
                />
              </Badge>
              <span
                className="tt-expenses-cursor-pointer tt-expenses-btn-remove-image mr-10"
                onClick={() =>
                  onReset(UserDocumentTypeEnums.PASSPORT.toLocaleLowerCase())
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
                    UserDocumentTypeEnums.PASSPORT.toLocaleLowerCase()
                  )
                }
              />
            </label>
          )}
        </Col>
      </Row>
      <Divider className="tt-expenses-secondary" />
      <Row className="tt-expenses-without-margin">
        <Col xs={24} md={24} lg={24}>
          <h3 className="tt-expenses-primary">
            <IntlMessages id="common.residence.document" />
            <Popover
              className="tt-expenses-cursor-pointer ml-10"
              content={<IntlMessages id="common.residence.document.title" />}
              title={<IntlMessages id="common.alert.info.message" />}
            >
              <IoIosHelpCircleOutline />
            </Popover>
          </h3>
          <i>
            <IntlMessages id="common.residence.document.description" />
          </i>
          <Paragraph className="tt-expenses-tomato">
            <IntlMessages id="common.upload.allowedPdf" />
          </Paragraph>
          {!!userDocument.residence.publicId.length ? (
            <div className="tt-expenses-without-padding col d-flex">
              <Badge>
                <Image
                  alt={userDocument.residence.publicId}
                  src={userDocument.residence.secureUrl}
                  preview={true}
                  width={100}
                  height={100}
                  className="m-3"
                />
              </Badge>
              <span
                className="tt-expenses-cursor-pointer tt-expenses-btn-remove-image mr-10"
                onClick={() =>
                  onReset(UserDocumentTypeEnums.RESIDENCE.toLocaleLowerCase())
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
                    UserDocumentTypeEnums.RESIDENCE.toLocaleLowerCase()
                  )
                }
              />
            </label>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default Document;
