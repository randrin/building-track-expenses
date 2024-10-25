import AppAnimate from "@crema/components/AppAnimate";
import IntlMessages from "@crema/helpers/IntlMessages";
import {
  ChangePassword,
  Information,
  Payment,
  PersonalInfo,
} from "@crema/modules/profile/UserProfile";
import Document from "@crema/modules/profile/UserProfile/Document";
import Setting from "@crema/modules/profile/UserProfile/Setting";
import { AiFillLock } from "react-icons/ai";
import { FaBandcamp, FaCreditCard } from "react-icons/fa";
import { HiUser } from "react-icons/hi";
import { IoDocuments, IoSettings } from "react-icons/io5";
import {
  StyledUserProfileContainer,
  StyledUserProfileTabs,
} from "./index.styled";
import { UsersRolesEnums } from "utils/common-constants.utils";
import { useJWTAuth } from "@crema/services/auth/jwt-auth/JWTAuthProvider";

const UserProfile = () => {
  // States
  const { user } = useJWTAuth();
  // Init
  const items = [
    {
      label: (
        <span className="user-profile-icon">
          <HiUser className="icon" />
          <span>
            <IntlMessages id="userProfile.personalInfo" />
          </span>
        </span>
      ),
      key: "01",
      children: <PersonalInfo />,
      role: [
        UsersRolesEnums.ADMIN.toString(),
        UsersRolesEnums.USER.toString(),
        UsersRolesEnums.MANAGER.toString(),
      ],
    }, // remember to pass the key prop
    {
      label: (
        <span className="user-profile-icon">
          <AiFillLock className="icon" />
          <span>
            <IntlMessages id="userProfile.changePassword" />
          </span>
        </span>
      ),
      key: "02",
      children: <ChangePassword />,
      role: [
        UsersRolesEnums.ADMIN.toString(),
        UsersRolesEnums.USER.toString(),
        UsersRolesEnums.MANAGER.toString(),
      ],
    },
    {
      label: (
        <span className="user-profile-icon">
          <FaBandcamp className="icon" />
          <span>
            <IntlMessages id="userProfile.information" />
          </span>
        </span>
      ),
      key: "03",
      children: <Information />,
      role: [
        UsersRolesEnums.ADMIN.toString(),
        UsersRolesEnums.USER.toString(),
        UsersRolesEnums.MANAGER.toString(),
      ],
    },
    {
      label: (
        <span className="user-profile-icon">
          <IoDocuments className="icon" />
          <span>
            <IntlMessages id="userProfile.documents" />
          </span>
        </span>
      ),
      key: "04",
      children: <Document />,
      role: [
        UsersRolesEnums.USER.toString(),
        UsersRolesEnums.MANAGER.toString(),
      ],
    },
    {
      label: (
        <span className="user-profile-icon">
          <FaCreditCard className="icon" />
          <span>
            <IntlMessages id="common.payment" />
          </span>
        </span>
      ),
      key: "05",
      children: <Payment />,
      role: [
        UsersRolesEnums.USER.toString(),
        UsersRolesEnums.MANAGER.toString(),
      ],
    },
    {
      label: (
        <span className="user-profile-icon">
          <IoSettings className="icon" />
          <span>
            <IntlMessages id="common.settings" />
          </span>
        </span>
      ),
      key: "06",
      children: <Setting />,
      role: [
        UsersRolesEnums.ADMIN.toString(),
        UsersRolesEnums.USER.toString(),
        UsersRolesEnums.MANAGER.toString(),
      ],
    },
    // {
    //   label: (
    //     <span className="user-profile-icon">
    //       <FaNetworkWired className="icon" />
    //       <span>
    //         <IntlMessages id="userProfile.social" />
    //       </span>
    //     </span>
    //   ),
    //   key: "04",
    //   children: <SocialLink socialLink={accountData.member} />,
    // },
    // {
    //   label: (
    //     <span className="user-profile-icon">
    //       <IoMdNotifications className="icon" />
    //       <span>
    //         <IntlMessages id="userProfile.notification" />
    //       </span>
    //     </span>
    //   ),
    //   key: "05",
    //   children: <Notification notification={accountData.notification} />,
    // },
  ];

  //Render
  return (
    <StyledUserProfileContainer>
      <AppAnimate animation="transition.slideUpIn" delay={200}>
        <StyledUserProfileTabs
          key="1"
          defaultActiveKey="01"
          tabPosition="left"
          items={items.filter((item) => item.role.includes(user.role))}
        />
      </AppAnimate>
    </StyledUserProfileContainer>
  );
};

export default UserProfile;
