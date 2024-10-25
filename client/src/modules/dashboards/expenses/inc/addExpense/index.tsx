import { currencies, decisions } from "@crema/constants/AppConst";
import MultipleFileUpload from "@crema/core/components/upload/multiple";
import IntlMessages from "@crema/helpers/IntlMessages";
import { useJWTAuth } from "@crema/services/auth/jwt-auth/JWTAuthProvider";
import { UserType } from "@crema/types/models/dashboards/UserType";
import {
  Button,
  Col,
  DatePicker,
  Input,
  Modal,
  Popover,
  Row,
  Select,
} from "antd";
import dayjs from "dayjs";
import { useCategoryContext } from "modules/apps/context/CategoryContextProvider";
import {
  useExpenseActionsContext,
  useExpenseContext,
} from "modules/apps/context/ExpenseContextProvider";
import { StyledRequiredField } from "modules/dashboards/index.styled";
import { IoIosHelpCircleOutline } from "react-icons/io";
import { IoReturnUpBackOutline } from "react-icons/io5";
import { LuCheckCircle, LuClock4 } from "react-icons/lu";
import { useIntl } from "react-intl";
import {
  FORMAT_DATE_THREE,
  MODE_ADD,
  StatusEnums,
  StatusExpenseEnums,
  UsersRolesEnums,
} from "utils/common-constants.utils";

type Props = {
  mode: string;
  users: UserType[];
  expense: any;
  isExpenseDrawerOpen: boolean;
  handleOnSubmitExpense: (status: string) => void;
  handleOnEditExpense: (status: string) => void;
  handleOnDenyExpense: () => void;
  setExpense: (data: any) => void;
  loading: boolean;
};

const AddExpense = ({
  mode,
  expense,
  users,
  isExpenseDrawerOpen,
  handleOnSubmitExpense,
  handleOnEditExpense,
  handleOnDenyExpense,
  setExpense,
  loading,
}: Props) => {
  // Context
  const { user } = useJWTAuth();
  const { categories } = useCategoryContext();
  const { subcategories } = useExpenseContext();
  const { handleOnGetSubCategoriesByCategory } = useExpenseActionsContext();

  // States

  // Destruction
  const { messages } = useIntl();
  const { Option } = Select;
  const { TextArea } = Input;
  const {
    employee,
    category,
    subcategory,
    amount,
    currency,
    receipt,
    comment,
    attachments,
    transaction_date,
  } = expense;

  // Init
  const contentReceipt = () => {
    return (
      <div>
        <p className="tt-expenses-without-margin tt-expenses-without-padding">
          <b>
            <IntlMessages id={`common.yes`} />
          </b>
          : <IntlMessages id="common.tooltip.expense.receipt.yes" />
        </p>
        <p className="tt-expenses-without-margin tt-expenses-without-padding">
          <b>
            <IntlMessages id={`common.no`} />
          </b>
          : <IntlMessages id="common.tooltip.expense.receipt.no" />
        </p>
      </div>
    );
  };

  // Functions
  const handleOnValidate = () => {
    return !!employee?.length &&
      !!category?.length &&
      !!subcategory?.length &&
      !!amount &&
      !!currency?.length &&
      !!receipt?.length &&
      (receipt === "Yes" ? !!attachments?.length : true) &&
      (receipt === "No" ? !!comment?.length : true) &&
      !!transaction_date
      ? false
      : true;
  };

  // Render
  return (
    // Add & Update Expense
    <Modal
      centered
      open={isExpenseDrawerOpen}
      title={
        messages[
          mode === MODE_ADD
            ? "dashboard.expense.create"
            : "dashboard.expense.update"
        ] as string
      }
      width={"720px"}
      maskClosable={false}
      onCancel={handleOnDenyExpense}
      footer={[
        <Button
          key="back"
          onClick={handleOnDenyExpense}
          className="tt-expenses-space-center"
        >
          <IoReturnUpBackOutline className="tt-expenses-margin-btn-icon" />{" "}
          {messages["common.back"] as string}
        </Button>,
        <Button
          key="submit_pending"
          type="primary"
          className="tt-expenses-space-center"
          loading={loading}
          onClick={() =>
            mode === MODE_ADD
              ? handleOnSubmitExpense(StatusExpenseEnums.PENDING)
              : handleOnEditExpense(StatusExpenseEnums.PENDING)
          }
          disabled={handleOnValidate()}
        >
          <LuClock4 className="tt-expenses-margin-btn-icon" />{" "}
          {messages["common.submit.wait"] as string}
        </Button>,
        <Button
          key="submit-under-approved"
          type="default"
          className="tt-expenses-background-success tt-expenses-space-center"
          loading={loading}
          onClick={() =>
            mode === MODE_ADD
              ? handleOnSubmitExpense(StatusExpenseEnums.UNDER_APPROVED)
              : handleOnEditExpense(StatusExpenseEnums.UNDER_APPROVED)
          }
          disabled={handleOnValidate()}
        >
          <LuCheckCircle className="tt-expenses-margin-btn-icon" />{" "}
          {messages["common.submit.sent"] as string}
        </Button>,
      ]}
    >
      <Row>
        <Col xs={24} lg={12}>
          <label htmlFor="employee" className="label">
            {messages["common.employee"] as string}{" "}
            <StyledRequiredField>*</StyledRequiredField>
          </label>
          <Select
            size="large"
            value={employee || undefined}
            showSearch
            showArrow
            style={{ width: "100%" }}
            disabled={user.role === UsersRolesEnums.USER}
            placeholder={messages["placeholder.select"] as string}
            optionFilterProp="children"
            onChange={(e) => setExpense({ ...expense, employee: e })}
          >
            {users
              ?.filter((user) => user.status === StatusEnums.ACTIVE)
              ?.map((user, index) => (
                <Option key={index} value={user._id}>
                  {user.displayName}
                </Option>
              ))}
          </Select>
        </Col>
      </Row>
      <Row>
        <Col xs={24} lg={12}>
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
            onChange={handleOnGetSubCategoriesByCategory}
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
        <Col xs={24} lg={12}>
          <label htmlFor="subcategory" className="label">
            {messages["common.subcategory"] as string}{" "}
            <StyledRequiredField>*</StyledRequiredField>
          </label>
          <Select
            size="large"
            value={subcategory || undefined}
            showSearch
            showArrow
            disabled={!category}
            style={{ width: "100%" }}
            placeholder={messages["placeholder.select"] as string}
            optionFilterProp="children"
            onChange={(e) => setExpense({ ...expense, subcategory: e })}
          >
            {subcategories
              ?.filter((subcat) => subcat.status === StatusEnums.ACTIVE)
              .map((subcat, index) => (
                <Option key={index} value={subcat._id}>
                  {subcat.title}
                </Option>
              ))}
          </Select>
        </Col>
      </Row>
      <Row>
        <Col xs={24} lg={12}>
          <label htmlFor="transaction_date" className="label">
            {messages["common.transaction.date"] as string}{" "}
            <StyledRequiredField>*</StyledRequiredField>
          </label>
          <br />
          <DatePicker
            size="large"
            value={dayjs(transaction_date) || undefined}
            style={{ width: "100%" }}
            placeholder={messages["placeholder.select"] as string}
            name="transaction_date"
            onChange={(date, dateString) =>
              setExpense({
                ...expense,
                transaction_date: date,
              })
            }
            format={FORMAT_DATE_THREE}
          />
        </Col>
        <Col xs={24} lg={6}>
          <label htmlFor="receipt" className="label">
            {messages["common.receipt"] as string}{" "}
            <StyledRequiredField>*</StyledRequiredField>
            <Popover
              className="tt-expenses-cursor-pointer ml-15"
              content={contentReceipt()}
              title={<IntlMessages id="common.alert.info.message" />}
            >
              <IoIosHelpCircleOutline />
            </Popover>
          </label>
          <Select
            size="large"
            value={receipt || undefined}
            showSearch
            showArrow
            style={{ width: "100%" }}
            placeholder={messages["placeholder.select"] as string}
            optionFilterProp="children"
            onChange={(e) => setExpense({ ...expense, receipt: e })}
          >
            {decisions.map((choice, index) => (
              <Option key={index} value={choice.value}>
                <IntlMessages
                  id={`common.${choice.label
                    .replaceAll("_", ".")
                    .toLocaleLowerCase()}`}
                />
              </Option>
            ))}
          </Select>
        </Col>
      </Row>
      <Row>
        <Col xs={24} lg={16}>
          <div className="tt-expenses-d-flex">
            <Col xs={24} lg={14} className="tt-expenses-without-padding">
              <label htmlFor="amount" className="label">
                {messages["common.amount"] as string}
                <StyledRequiredField>*</StyledRequiredField>
              </label>
              <Input
                name="amount"
                size="large"
                value={amount}
                placeholder={messages["placeholder.input"] as string}
                onChange={(e) =>
                  setExpense({
                    ...expense,
                    amount: e.target.value.replace(/\D/g, ""), // Accept only numbers
                  })
                }
              />
            </Col>
            <Col xs={24} lg={10}>
              <label htmlFor="currency" className="label">
                {messages["common.currency"] as string}
                <StyledRequiredField>*</StyledRequiredField>
              </label>
              <Select
                size="large"
                value={currency || undefined}
                showSearch
                showArrow
                style={{ width: "100%" }}
                placeholder={messages["placeholder.select"] as string}
                optionFilterProp="children"
                onChange={(e) => setExpense({ ...expense, currency: e })}
              >
                {currencies.map((currency, index) => (
                  <Option key={index} value={currency.value}>
                    {currency.label}
                  </Option>
                ))}
              </Select>
            </Col>
          </div>
        </Col>
      </Row>
      {receipt === "Yes" && (
        <Row style={{ marginBottom: "0px !important" }}>
          <Col xs={24} lg={24}>
            <label htmlFor="attachments" className="label">
              {messages["common.attachments"] as string}{" "}
              <StyledRequiredField>*</StyledRequiredField>
            </label>
            <MultipleFileUpload items={expense} setItems={setExpense} />
          </Col>
        </Row>
      )}
      <Row>
        <Col xs={24} lg={24}>
          <label htmlFor="comment" className="label">
            {messages["common.comments"] as string}{" "}
            {receipt === "No" && <StyledRequiredField>*</StyledRequiredField>}
          </label>
          <TextArea
            name="comment"
            placeholder={messages["placeholder.textarea"] as string}
            value={comment}
            rows={3}
            onChange={(e) =>
              setExpense({ ...expense, comment: e.target.value })
            }
          />
        </Col>
      </Row>
    </Modal>
  );
};

export default AddExpense;
