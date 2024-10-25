import AppAsyncComponent from "@crema/components/AppAsyncComponent";

const ContactUs = AppAsyncComponent(
  () => import("../crema/modules/web/ContactUs")
);
export default ContactUs;
