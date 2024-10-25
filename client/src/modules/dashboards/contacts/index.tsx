import AppPageMeta from "@crema/components/AppPageMeta";
import AppsContainer from "@crema/components/AppsContainer";
import { useIntl } from "react-intl";
import ContactListing from "./ContactListing";
import SideBarContent from "./ContactSideBar";

const Contacts = () => {
  // States
  const { messages } = useIntl();

  // Desctruction

  // Functions

  // Render
  return (
    <AppsContainer
      title={messages["common.contacts"] as string}
      sidebarContent={<SideBarContent />}
    >
      <AppPageMeta title={messages["common.contacts"] as string} />
      <ContactListing />
    </AppsContainer>
  );
};

export default Contacts;
