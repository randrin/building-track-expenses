import AppCard from "@crema/components/AppCard";
import AppIconButton from "@crema/components/AppIconButton";
import AppPageMeta from "@crema/components/AppPageMeta";
import AppRowContainer from "@crema/components/AppRowContainer";
import MultipleFileUpload from "@crema/core/components/upload/multiple";
import IntlMessages from "@crema/helpers/IntlMessages";
import { useJWTAuth } from "@crema/services/auth/jwt-auth/JWTAuthProvider";
import {
  Button,
  Col,
  Divider,
  Image,
  Input,
  Row,
  Select,
  Typography,
} from "antd";
import {
  useSupportHelpActionsContext,
  useSupportHelpContext,
} from "modules/apps/context/SupportHelpContextProvider";
import {
  StyledMessageContainer,
  StyledRequiredField,
} from "modules/dashboards/index.styled";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { BiArrowBack } from "react-icons/bi";
import { CiBoxList } from "react-icons/ci";
import { LuCheckCircle } from "react-icons/lu";
import { useIntl } from "react-intl";
import { Tt_GetTicketStatus } from "utils";
import {
  FORMAT_DATE_THREE,
  TicketEnums,
  TicketTypeEnums,
  UsersRolesEnums,
} from "utils/common-constants.utils";

const TicketDetail = () => {
  // States
  const router = useRouter();
  const { messages } = useIntl();
  const { query } = useRouter();
  const { all } = query;
  const { ticket, ticketComment } = useSupportHelpContext();
  const {
    handleOnGetTicket,
    setTicket,
    setTicketComment,
    handleOnReplyTicket,
    handleOnChangeStatusTicket,
  } = useSupportHelpActionsContext();

  // Desctruction
  const { user } = useJWTAuth();
  const { Title, Paragraph } = Typography;
  const { TextArea } = Input;
  const { Option } = Select;

  // Init
  useEffect(() => {
    if (all) {
      handleOnGetTicket(all[0]);
      setTicket({
        ...ticket,
        ticketId: all[0],
      });
    }
  }, [all]);

  // Render
  return (
    <>
      <AppPageMeta title={messages["common.support.ticket"] as string} />
      {(user.role === UsersRolesEnums.ADMIN ||
        user.role === UsersRolesEnums.MANAGER) && (
        <Row className="tt-expenses-space-between">
          <Col xs={12} lg={4} className="tt-expenses-space-start">
            <AppIconButton
              icon={<BiArrowBack />}
              title={<IntlMessages id="common.back" />}
              onClick={() => router.back()}
            />
          </Col>
          <Col xs={12} lg={4}>
            <label htmlFor="status" className="label">
              <IntlMessages id="common.support.ticket.status" />
            </label>
            <Select
              size="large"
              value={ticket.status || undefined}
              showSearch
              showArrow
              style={{ width: "100%" }}
              placeholder={<IntlMessages id="placeholder.select" />}
              optionLabelProp="label"
              optionFilterProp="label"
              disabled={ticket.status === TicketEnums.RESOLVED}
              onChange={(e) => handleOnChangeStatusTicket(e)}
            >
              {Object.values(TicketEnums).map((statut, index) => (
                <Option
                  key={index}
                  value={statut}
                  label={
                    <div className="tt-expenses-space-start text-center">
                      {Tt_GetTicketStatus(statut)}
                      <span className="ml-5">
                        <IntlMessages
                          id={`common.status.${statut
                            .replaceAll("_", ".")
                            .toLocaleLowerCase()}`}
                        />
                      </span>
                    </div>
                  }
                >
                  <div className="tt-expenses-space-start text-center">
                    {Tt_GetTicketStatus(statut)}
                    <span className="ml-5">
                      <IntlMessages
                        id={`common.status.${statut
                          .replaceAll("_", ".")
                          .toLocaleLowerCase()}`}
                      />
                    </span>
                  </div>
                </Option>
              ))}
            </Select>
          </Col>
        </Row>
      )}
      <AppRowContainer>
        <Col xs={24} lg={24}>
          <AppCard>
            <div className="tt-expenses-space-between">
              <div>
                <Title level={4}>
                  <IntlMessages id="common.support.ticket.details" /> #
                  {ticket.code}
                </Title>
              </div>
              {user.role === UsersRolesEnums.USER && (
                <div>
                  <Button
                    type="primary"
                    className="btn tt-expenses-space-start"
                    onClick={() => router.push(`/dashboards/help-center`)}
                  >
                    <CiBoxList className="tt-expenses-margin-btn-icon" />{" "}
                    <IntlMessages id="common.tickets" />
                  </Button>
                </div>
              )}
            </div>
            <Divider className="tt-expenses-secondary" />
            <Title level={5} className="text-center">
              <IntlMessages id="common.support.ticket.info" />
            </Title>
            <table className="tt-expenses-table">
              <tbody>
                <tr>
                  <td>
                    <span className="tt-expenses-font-bold">
                      <IntlMessages id="common.object" />:
                    </span>{" "}
                    {ticket.object}
                  </td>
                </tr>
                <tr>
                  <td colSpan={2}>
                    <span className="tt-expenses-font-bold">
                      <IntlMessages id="common.status" />:
                    </span>{" "}
                    {
                      messages[
                        `common.status.${ticket.status?.toLocaleLowerCase()}`
                      ] as string
                    }
                  </td>
                  <td colSpan={2}>
                    <span className="tt-expenses-font-bold">
                      <IntlMessages id="common.subject" />:
                    </span>{" "}
                    {ticket.subject.title}
                  </td>
                </tr>
                <tr>
                  <td colSpan={2}>
                    <span className="tt-expenses-font-bold">
                      <IntlMessages id="common.createdAt" />:
                    </span>{" "}
                    {moment(ticket.createdAt).format(FORMAT_DATE_THREE)}
                  </td>
                  <td colSpan={2}>
                    <span className="tt-expenses-font-bold">
                      <IntlMessages id="common.updatedAt" />:
                    </span>{" "}
                    {moment(ticket.updatedAt).format(FORMAT_DATE_THREE)}
                  </td>
                </tr>
              </tbody>
            </table>
          </AppCard>
          <br />
          {/* Message for user */}
          <Row className="tt-expenses-space-end">
            <Col xs={24} lg={18}>
              <StyledMessageContainer
                type={TicketTypeEnums.USER.toLocaleLowerCase()}
              >
                <div className="ticket-message-title">
                  <Title level={5} className="tt-expenses-primary">
                    <IntlMessages id="common.sendBy" />{" "}
                    {ticket.createdBy.displayName}
                    {", "}
                    <IntlMessages id="common.at" />{" "}
                    {moment(ticket.createdAt).format(FORMAT_DATE_THREE)}
                  </Title>
                </div>
                <Divider style={{ margin: "15px 0" }} />
                <div className="ticket-message-description">
                  <Paragraph>{ticket.message}</Paragraph>
                </div>
                <div className="ticket-message-attachment">
                  <Image.PreviewGroup>
                    {ticket?.attachments?.map((image) => (
                      <Image
                        key={image.public_id}
                        alt={image.public_id}
                        src={image.url}
                        width={100}
                        height={100}
                        className="tt-expenses-border-radius-small"
                      />
                    ))}
                  </Image.PreviewGroup>
                </div>
              </StyledMessageContainer>
            </Col>
          </Row>
          {/* Comments Messages */}
          {!!ticket.comments?.length &&
            ticket.comments.map((comment, index) => (
              <>
                <Row
                  key={index}
                  className={`tt-expenses-space-${
                    comment.type === TicketTypeEnums.USER ? "end" : "start"
                  }`}
                >
                  <Col xs={24} lg={18}>
                    <StyledMessageContainer
                      type={comment.type.toLocaleLowerCase()}
                    >
                      <div className="ticket-message-title">
                        <Title level={5} className="tt-expenses-primary">
                          <IntlMessages id="common.sendBy" />{" "}
                          {comment.createdBy.displayName}
                          {", "}
                          <IntlMessages id="common.at" />{" "}
                          {moment(comment.createdAt).format(FORMAT_DATE_THREE)}
                        </Title>
                      </div>
                      <Divider style={{ margin: "15px 0" }} />
                      <div className="ticket-message-description">
                        <Paragraph>{comment.message}</Paragraph>
                      </div>
                      <Image.PreviewGroup>
                        {comment?.attachments?.map((image) => (
                          <Image
                            key={image.public_id}
                            alt={image.public_id}
                            src={image.url}
                            width={100}
                            height={100}
                            className="tt-expenses-border-radius-small"
                          />
                        ))}
                      </Image.PreviewGroup>
                    </StyledMessageContainer>
                  </Col>
                </Row>
              </>
            ))}
          <Divider className="tt-expenses-secondary" />
          {ticket.status === TicketEnums.OPEN ? (
            <>
              <Row>
                <Col xs={24} lg={24}>
                  <label htmlFor="message" className="label">
                    {messages["common.comment"] as string}{" "}
                    <StyledRequiredField>*</StyledRequiredField>
                  </label>
                  <TextArea
                    name="message"
                    placeholder={messages["placeholder.textarea"] as string}
                    value={ticketComment.message}
                    rows={5}
                    onChange={(e) =>
                      setTicketComment({
                        ...ticketComment,
                        type:
                          user.role === UsersRolesEnums.USER
                            ? TicketTypeEnums.USER
                            : TicketTypeEnums.ADMIN_MANAGER,
                        ticketId: all[0],
                        message: e.target.value,
                      })
                    }
                  />
                </Col>
              </Row>
              <Row style={{ marginBottom: "0px !important" }}>
                <Col xs={24} lg={24}>
                  <label htmlFor="attachments" className="label">
                    {messages["common.attachments"] as string}{" "}
                  </label>
                  <MultipleFileUpload
                    items={ticketComment}
                    setItems={setTicketComment}
                  />
                </Col>
              </Row>
              <Divider className="tt-expenses-secondary" />
              <Row>
                <Col xs={24} lg={24} className="tt-expenses-space-end">
                  <Button
                    type="primary"
                    className="btn tt-expenses-space-center"
                    onClick={handleOnReplyTicket}
                    disabled={!ticketComment.message.length}
                  >
                    <LuCheckCircle className="tt-expenses-margin-btn-icon" />{" "}
                    {messages["common.submit"] as string}
                  </Button>
                </Col>
              </Row>
            </>
          ) : (
            <Row className="text-center">
              <Col xs={24} lg={24}>
                <Title level={4}>
                  {messages["common.support.ticket.resolved"] as string}{" "}
                  <Link href={"/dashboards/help-center/ticket_create"}>
                    {" "}
                    {messages["common.create.ticket.title"] as string}
                  </Link>
                </Title>
              </Col>
            </Row>
          )}
        </Col>
      </AppRowContainer>
    </>
  );
};

export default TicketDetail;
