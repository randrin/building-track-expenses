import AppAnimate from "@crema/components/AppAnimate";
import AppInfoView from "@crema/components/AppInfoView";
import AppPageMeta from "@crema/components/AppPageMeta";
import AppRowContainer from "@crema/components/AppRowContainer";
import IntlMessages from "@crema/helpers/IntlMessages";
import { Col, Divider, Row, Typography } from "antd";
import { useFaqContext } from "modules/apps/context/FaqContextProvider";
import { useSubFaqContext } from "modules/apps/context/SubFaqContextProvider";
import Link from "next/link";
import { useEffect, useState } from "react";
import { StatusEnums } from "utils/common-constants.utils";
import { StyledFaqHeader, StyledFaqSection } from "../index.styled";
import FaqList from "./FaqList";
import FaqSideBar from "./FaqSideBar";
import { IoIosArrowForward } from "react-icons/io";

const PublicFaqs = () => {
  // States
  const { faqs } = useFaqContext();
  const { subFaqs } = useSubFaqContext();
  const [dataValue, setDataValue] = useState([]); // Get the subFaq correspond to the first Faq
  const [selectionId, setSelectionId] = useState(""); // Point to the first faq

  // Desctucting
  const { Title, Paragraph } = Typography;

  // Init
  useEffect(() => {
    const faqsActive = faqs?.filter((faq) => faq.status === StatusEnums.ACTIVE);
    if (!!faqsActive?.length) {
      setDataValue(
        subFaqs?.filter(
          (subFaq) =>
            subFaq.faq._id === faqsActive[0]?._id &&
            subFaq.status === StatusEnums.ACTIVE
        )
      );
      setSelectionId(faqsActive[0]?._id);
    }
  }, [faqs, subFaqs]);

  // Functions
  const onGetFaqData = (value: string) => {
    setSelectionId(value);
    setDataValue(subFaqs.filter((subFaq) => subFaq.faq._id === value));
  };

  // Render
  return (
    <>
      <AppPageMeta title="FAQ" />
      <AppAnimate animation="transition.slideUpIn" delay={200}>
        <StyledFaqSection key="a">
          <StyledFaqHeader>
            <h2>
              <IntlMessages id="faq.heading" />
            </h2>
            <p>
              <IntlMessages id="faq.content" />
            </p>
          </StyledFaqHeader>

          <AppRowContainer type="bottom">
            <Row>
              <Col xs={24} md={8} lg={6} key="Faqs Parent">
                <FaqSideBar
                  faqsData={faqs?.filter(
                    (faq) => faq.status === StatusEnums.ACTIVE
                  )}
                  onGetFaqData={onGetFaqData}
                  selectionId={selectionId}
                />
              </Col>

              <Col xs={24} md={16} lg={18} key="Faqs Children">
                <FaqList faqList={dataValue} />
                <AppInfoView />
              </Col>
            </Row>
            <Divider className="tt-expenses-secondary" />
            <Row className="text-center">
              <Col xs={24} md={24} lg={24}>
                <Title level={4} className="tt-expenses-space-center">
                  <IntlMessages id="common.faqs.footer" />
                  <Link
                    href={"/dashboards/help-center"}
                    className="tt-expenses-primary tt-expenses-space-center ml-5"
                  >
                    <IntlMessages id="common.create.ticket" />
                    <IoIosArrowForward />
                  </Link>
                </Title>
              </Col>
            </Row>
          </AppRowContainer>
        </StyledFaqSection>
      </AppAnimate>
    </>
  );
};

export default PublicFaqs;
