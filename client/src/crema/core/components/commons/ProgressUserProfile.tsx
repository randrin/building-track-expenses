import IntlMessages from "@crema/helpers/IntlMessages";
import { useAuthUser } from "@crema/hooks/AuthHooks";
import { Col, Popover, Progress, Typography } from "antd";
import Link from "next/link";
import { FcInfo } from "react-icons/fc";
import { UsersRolesEnums } from "utils/common-constants.utils";

const ProgressUserProfile = () => {
  // States
  const { user } = useAuthUser();

  // Destructing
  const { Title, Paragraph } = Typography;

  // Init
  const ckeckUserCni =
    user.documents?.cni !== undefined &&
    Object.entries(user.documents?.cni).length > 0
      ? true
      : false;
  const ckeckUserPassport =
    user.documents?.passport !== undefined &&
    Object.entries(user.documents?.passport).length > 0
      ? true
      : false;
  const ckeckUserResidence =
    user.documents?.residence !== undefined &&
    Object.entries(user.documents?.residence).length > 0
      ? true
      : false;
  const checkUserPayment =
    (user.payment?.phone !== undefined &&
      Object.entries(user.payment?.phone).length > 0) ||
    (user.payment?.bank !== undefined &&
      Object.entries(user.payment?.bank).length > 0)
      ? true
      : false;
  const checkUserInformations =
    user.contact !== undefined &&
    Object.entries(user.contact).length > 0 &&
    user.address !== undefined &&
    Object.entries(user.address).length > 0
      ? true
      : false;

  const content = (
    <div>
      <div className="d-grid ml-10">
        {!ckeckUserCni && !ckeckUserResidence && (
          <Link href={"/my-profile"}>
            <IntlMessages id="userProfile.documents" />
          </Link>
        )}
        {!checkUserInformations && (
          <Link href={"/my-profile"}>
            <IntlMessages id="userProfile.information" />
          </Link>
        )}
        {!checkUserPayment && (
          <Link href={"/my-profile"}>
            <IntlMessages id="common.payment.method" />
          </Link>
        )}
      </div>
    </div>
  );

  const checkUserProgressPercent = () => {
    let percent: number = 0;
    if (ckeckUserCni) {
      percent += 25;
    }
    if (ckeckUserResidence) {
      percent += 25;
    }
    if (checkUserInformations) {
      percent += 25;
    }
    if (checkUserPayment) {
      percent += 25;
    }
    return percent;
  };

  const checkUserProgressStatus = () => {
    let status: any;
    if (checkUserProgressPercent() === 25) {
      status = "exception";
    }
    if (checkUserProgressPercent() === 50) {
      status = "normal";
    }
    if (checkUserProgressPercent() === 75) {
      status = "active";
    }
    if (checkUserProgressPercent() === 100) {
      status = "success";
    }
    return status;
  };

  // Render
  return (
    <>
      {checkUserProgressPercent() !== 100 &&
        user.role !== UsersRolesEnums.ADMIN && (
          <Col xs={24} md={6} lg={6}>
            <Paragraph className="tt-expenses-without-margin tt-expenses-space-start">
              <Popover
                style={{ width: "100px !important;" }}
                placement="top"
                className="tt-expenses-cursor-pointer mr-3"
                content={content}
                title={
                  <b>
                    <IntlMessages id="common.user.progress" />
                  </b>
                }
              >
                <FcInfo />
              </Popover>
              <IntlMessages id="common.profile.to.completed" />
            </Paragraph>
            <Progress
              percent={checkUserProgressPercent()}
              size="small"
              status={checkUserProgressStatus()}
              showInfo={false}
            />
          </Col>
        )}
    </>
  );
};

export default ProgressUserProfile;
