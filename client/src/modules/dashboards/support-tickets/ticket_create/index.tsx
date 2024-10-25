import AppPageMeta from "@crema/components/AppPageMeta";
import ContributorPermission from "@crema/core/components/middlewares/ContributorPermission";
import MultipleFileUpload from "@crema/core/components/upload/multiple";
import IntlMessages from "@crema/helpers/IntlMessages";
import { Button, Col, Divider, Input, Row, Select, Typography } from "antd";
import {
    useSupportHelpActionsContext,
    useSupportHelpContext,
} from "modules/apps/context/SupportHelpContextProvider";
import {
    StyledContent,
    StyledRequiredField,
} from "modules/dashboards/index.styled";
import { useRouter } from "next/router";
import { CiBoxList } from "react-icons/ci";
import { LuCheckCircle } from "react-icons/lu";
import { useIntl } from "react-intl";
import { StatusEnums } from "utils/common-constants.utils";

const TicketCreate = () => {
  // States
  const router = useRouter();
  const { messages } = useIntl();
  const { ticket, categories, subjects } = useSupportHelpContext();
  const { setTicket, handleOnGetSubjectsByCategory, handleOnSubmitTicket } =
    useSupportHelpActionsContext();

  // Desctruction
  const { Title, Paragraph } = Typography;
  const { TextArea } = Input;
  const { Option } = Select;
  const { category, subject, object, message, attachements } = ticket;

  // Functions
  const handleOnValidate = () => {
    return !!object?.length &&
      !!category?.length &&
      !!subject?.length &&
      !!message?.length
      ? false
      : true;
  };

  // Render
  return (
    <>
      <AppPageMeta title={messages["common.support.ticket"] as string} />
      <StyledContent>
        <Button
          type="primary"
          className="btn tt-expenses-space-start"
          onClick={() => router.push(`/dashboards/help-center`)}
        >
          <CiBoxList className="tt-expenses-margin-btn-icon" />{" "}
          <IntlMessages id="common.tickets" />
        </Button>
      </StyledContent>
      <Divider className="tt-expenses-without-margin" />
      <div className="text-center">
        <Title level={2} className="tt-expenses-primary mt-10">
          {messages["common.create.ticket.title"] as string}
        </Title>
        <Paragraph>
          {messages["common.create.ticket.subtitle"] as string}
        </Paragraph>
      </div>
      <div className="mt-20 ml-20 mr-20">
        <Row>
          <Col xs={24} lg={8} className="tt-category-col">
            <label htmlFor="category" className="label">
              {messages["common.category"] as string}{" "}
              <StyledRequiredField>*</StyledRequiredField>
            </label>
            <Select
              size="large"
              value={category || undefined}
              showSearch
              showArrow
              style={{ width: "100%" }}
              placeholder={messages["placeholder.select"] as string}
              optionFilterProp="children"
              onChange={handleOnGetSubjectsByCategory}
            >
              {categories
                ?.filter((cat) => cat.status === StatusEnums.ACTIVE)
                .map((cat, index) => (
                  <Option key={index} value={cat._id}>
                    {cat.title}
                  </Option>
                ))}
            </Select>
          </Col>
          <Col xs={24} lg={8}>
            <label htmlFor="subject" className="label">
              {messages["common.subject"] as string}{" "}
              <StyledRequiredField>*</StyledRequiredField>
            </label>
            <Select
              size="large"
              value={subject || undefined}
              showSearch
              showArrow
              disabled={!category}
              style={{ width: "100%" }}
              placeholder={messages["placeholder.select"] as string}
              optionFilterProp="children"
              onChange={(e) => setTicket({ ...ticket, subject: e })}
            >
              {subjects
                ?.filter((subject) => subject.status === StatusEnums.ACTIVE)
                .map((subject, index) => (
                  <Option key={index} value={subject._id}>
                    {subject.title}
                  </Option>
                ))}
            </Select>
          </Col>
        </Row>
        <Row>
          <Col xs={24} lg={24}>
            <label htmlFor="object" className="label">
              {messages["common.object"] as string}{" "}
              <StyledRequiredField>*</StyledRequiredField>
            </label>
            <Input
              placeholder={messages["placeholder.input"] as string}
              value={object}
              size="large"
              name="object"
              onChange={(e) =>
                setTicket({
                  ...ticket,
                  object: e.target.value,
                })
              }
            />
          </Col>
        </Row>
        <Row>
          <Col xs={24} lg={24}>
            <label htmlFor="message" className="label">
              {messages["common.message.ticket"] as string}{" "}
              <StyledRequiredField>*</StyledRequiredField>
            </label>
            <TextArea
              name="message"
              placeholder={messages["placeholder.textarea"] as string}
              value={message}
              rows={5}
              onChange={(e) =>
                setTicket({ ...ticket, message: e.target.value })
              }
            />
          </Col>
        </Row>
        <Row style={{ marginBottom: "0px !important" }}>
          <Col xs={24} lg={24}>
            <label htmlFor="attachments" className="label">
              {messages["common.attachments"] as string}{" "}
            </label>
            <MultipleFileUpload items={ticket} setItems={setTicket} />
          </Col>
        </Row>
        <Divider />
        <Row>
          <Col xs={24} lg={24} className="tt-expenses-space-end">
            <Button
              type="primary"
              size="large"
              disabled={handleOnValidate()}
              className="btn tt-expenses-space-center"
              onClick={handleOnSubmitTicket}
            >
              <LuCheckCircle className="tt-expenses-margin-btn-icon" />{" "}
              {messages["common.submit"] as string}
            </Button>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default ContributorPermission(TicketCreate);
