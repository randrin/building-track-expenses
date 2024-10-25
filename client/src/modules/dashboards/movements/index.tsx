import AppPageMeta from "@crema/components/AppPageMeta";
import AdminPermission from "@crema/core/components/middlewares/AdminPermission";
import { useIntl } from "react-intl";

const Movements = () => {
  // States
  const { messages } = useIntl();

  // Render
  return (
    <>
      <AppPageMeta title={messages["common.movements"] as string} />
    </>
  );
};

export default AdminPermission(Movements);
