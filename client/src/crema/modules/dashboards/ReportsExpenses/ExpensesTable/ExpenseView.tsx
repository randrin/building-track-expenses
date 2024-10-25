import { Comment } from "@ant-design/compatible";
import IntlMessages from "@crema/helpers/IntlMessages";
import { ExpenseType } from "@crema/types/models/dashboards/ExpenseType";
import {
  Avatar,
  Button,
  Col,
  Collapse,
  Divider,
  Drawer,
  Image,
  Row,
  Space,
  Tooltip,
} from "antd";
import dayjs from "dayjs";
import moment from "moment";
import { IoReturnUpBackOutline } from "react-icons/io5";
import { FORMAT_DATE_ONE, FORMAT_DATE_TWO } from "utils/common-constants.utils";
import {
  Tt_FormatDate,
  Tt_GetStatusExpense,
  Tt_GetUserWithTooltip
} from "utils/common-functions.utils";

type Props = {
  expense: ExpenseType;
  isAppDrawerOpen: boolean;
  setAppDrawerOpen: (data: boolean) => void;
};

const ExpenseView = ({ expense, isAppDrawerOpen, setAppDrawerOpen }: Props) => {
  // States

  // Destructing
  const { Panel } = Collapse;

  // Init
  const DescriptionItem = ({ title, content }) => (
    <div className="site-description-item-profile-wrapper">
      <p className="site-description-item-profile-p-label">
        <b>{title}</b>:
      </p>
      {content}
    </div>
  );

  // Render
  return (
    <Drawer
      title={<IntlMessages id="dashboard.expense.view" />}
      placement={"right"}
      open={isAppDrawerOpen}
      onClose={() => setAppDrawerOpen(!isAppDrawerOpen)}
      footer={
        <Space>
          <Button
            key="back"
            onClick={() => setAppDrawerOpen(!isAppDrawerOpen)}
            className="tt-expenses-space-center"
          >
            <IoReturnUpBackOutline className="tt-expenses-margin-btn-icon" />{" "}
            <IntlMessages id="common.back" />
          </Button>
        </Space>
      }
    >
      <Row>
        <Col xs={24} lg={24}>
          <DescriptionItem
            title={<IntlMessages id="common.category" />}
            content={expense.category.title}
          />
        </Col>
        <Col xs={24} lg={24}>
          <DescriptionItem
            title={<IntlMessages id="common.subcategory" />}
            content={expense.subcategory.title}
          />
        </Col>
        <Col xs={24} lg={24}>
          <DescriptionItem
            title={<IntlMessages id="common.transaction.date" />}
            content={
              <span>
                {Tt_FormatDate(
                  moment(expense.transaction_date).format(FORMAT_DATE_ONE)
                )}
                {", "}
                <span>
                  {moment(expense.transaction_date).format(FORMAT_DATE_TWO)}
                </span>
              </span>
            }
          />
        </Col>
        <Col xs={24} lg={24}>
          <DescriptionItem
            title={<IntlMessages id="common.submission.date" />}
            content={
              expense.submission_date ? (
                <span>
                  {Tt_FormatDate(
                    moment(expense.submission_date).format(FORMAT_DATE_ONE)
                  )}
                  {", "}
                  <span>
                    {moment(expense.submission_date).format(FORMAT_DATE_TWO)}
                  </span>
                </span>
              ) : (
                "-"
              )
            }
          />
        </Col>
        <Col xs={24} lg={24}>
          <DescriptionItem
            title={<IntlMessages id="common.receipt" />}
            content={
              <IntlMessages id={`common.${expense.receipt.toLowerCase()}`} />
            }
          />
        </Col>

        <Col xs={24} lg={24}>
          <DescriptionItem
            title={<IntlMessages id="common.amount" />}
            content={`${expense.amount.toLocaleString()} ${expense.currency}`}
          />
        </Col>
        <Col xs={24} lg={24}>
          <DescriptionItem
            title={<IntlMessages id="common.status" />}
            content={Tt_GetStatusExpense(
              expense.currentStatus
            )}
          />
        </Col>
        {!!expense.rejects?.length && (
          <Col xs={24} lg={24}>
            <Collapse>
              <Panel header={"Rejects Messages"} key={"Rejects"}>
                {expense.rejects
                  .sort(
                    (a, b) =>
                      new Date(b.date).getTime() - new Date(a.date).getTime()
                  )
                  .map((reject, index) => (
                    <Comment
                      key={index}
                      author={<a>{reject.user.displayName}</a>}
                      avatar={
                        <Avatar
                          size={50}
                          src={Tt_GetUserWithTooltip(reject.user)}
                          alt={reject.user.displayName}
                        />
                      }
                      content={<p>{reject.comment}</p>}
                      datetime={
                        <Tooltip
                          title={dayjs(reject.date).format(
                            "MMM DD,YYYY HH:mm:ss"
                          )}
                        >
                          <span>{dayjs(reject.date).fromNow()}</span>
                        </Tooltip>
                      }
                    />
                  ))}
              </Panel>
            </Collapse>
          </Col>
        )}
        <Divider className="tt-expenses-background-sliver m-9" />
        <Col xs={24} lg={24}>
          <DescriptionItem
            title={<IntlMessages id="common.approver" />}
            content={expense.approver ? expense.approver.displayName : "-"}
          />
        </Col>
        <Col xs={24} lg={24}>
          <DescriptionItem
            title={<IntlMessages id="common.approvation.date" />}
            content={
              expense.approvation_date ? (
                <span>
                  {Tt_FormatDate(
                    moment(expense.approvation_date).format(FORMAT_DATE_ONE)
                  )}
                  {", "}
                  <span>
                    {moment(expense.approvation_date).format(FORMAT_DATE_TWO)}
                  </span>
                </span>
              ) : (
                "-"
              )
            }
          />
        </Col>
        <Divider className="tt-expenses-background-sliver m-9" />
        {expense.receipt === "Yes" ? (
          <Col xs={24} lg={24}>
            <b>
              <IntlMessages id="common.attachments" />
            </b>
            <br />
            <Image.PreviewGroup>
              {expense?.attachments?.map((image) => (
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
          </Col>
        ) : (
          <Col xs={24} lg={24}>
            <DescriptionItem
              title={<IntlMessages id="common.comments" />}
              content={expense.comment}
            />
          </Col>
        )}
      </Row>
    </Drawer>
  );
};

export default ExpenseView;
