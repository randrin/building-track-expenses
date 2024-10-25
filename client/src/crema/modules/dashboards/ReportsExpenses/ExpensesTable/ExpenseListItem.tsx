import IntlMessages from "@crema/helpers/IntlMessages";
import { ExpenseType } from "@crema/types/models/dashboards/ExpenseType";
import { Checkbox, Tooltip } from "antd";
import clsx from "clsx";
import { useState } from "react";
import { IoMdAttach } from "react-icons/io";
import {
  Tt_FormatDateEmpty,
  Tt_GetStatusExpense,
  Tt_GetUserWithTooltip
} from "utils/common-functions.utils";
import {
  StyledExpenseListItem,
  StyledExpenseListItemCheckView,
} from "../../index.styled";
import ExpenseActions from "./ExpenseActions";

type ExpenseListItemProps = {
  expense: ExpenseType;
  onChangeCheckedExpenses: (event: any, id: string) => void;
  checkedExpenses: string[];
  onViewExpenseDetail: (expense: ExpenseType) => void;
  key: string;
};

const ExpenseListItem: React.FC<ExpenseListItemProps> = ({
  key,
  expense,
  onChangeCheckedExpenses,
  checkedExpenses,
  onViewExpenseDetail,
}) => {
  // states
  const [isChecked, setIsChecked] = useState(false);

  // Render
  return (
    <StyledExpenseListItem
      key={key}
      className={clsx("item-hover", {
        rootCheck: checkedExpenses.includes(expense._id),
      })}
      onClick={() => onViewExpenseDetail(expense)}
    >
      <Checkbox
        checked={checkedExpenses.includes(expense._id)}
        onClick={(event) => event.stopPropagation()}
        onChange={() => {
          setIsChecked(!isChecked);
          onChangeCheckedExpenses(!isChecked, expense._id);
        }}
      />
      <StyledExpenseListItemCheckView>
        <Tooltip
          title={
            expense.attachments.length === 0 ? (
              <IntlMessages id="common.no.attachments" />
            ) : (
              <span>
                {expense.attachments.length}{" "}
                <IntlMessages id="common.attachments" />
              </span>
            )
          }
        >
          <div
            //onClick={() => handleOnShowAttachments(expense.attachments)}
            style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
          >
            <IoMdAttach
              style={{
                fontSize: 16,
                color: expense.attachments.length === 0 ? "#d12420" : "#2a7a39",
              }}
            />
            <span style={{ fontWeight: "600" }}>
              ({expense.attachments.length})
            </span>
          </div>
        </Tooltip>
      </StyledExpenseListItemCheckView>
      <StyledExpenseListItemCheckView>
        {expense.category.title}
      </StyledExpenseListItemCheckView>
      <StyledExpenseListItemCheckView>
        {expense.subcategory.title}
      </StyledExpenseListItemCheckView>
      <StyledExpenseListItemCheckView>
        {Tt_FormatDateEmpty(expense.transaction_date)}
      </StyledExpenseListItemCheckView>
      <StyledExpenseListItemCheckView>
        {Tt_FormatDateEmpty(expense.submission_date)}
      </StyledExpenseListItemCheckView>
      <StyledExpenseListItemCheckView>
        {Tt_GetUserWithTooltip(expense.employee)}
      </StyledExpenseListItemCheckView>
      <StyledExpenseListItemCheckView>
        {Tt_FormatDateEmpty(expense.accounting_date)}
      </StyledExpenseListItemCheckView>
      <StyledExpenseListItemCheckView>
        {Tt_GetUserWithTooltip(expense.accounting || expense.approver)}
      </StyledExpenseListItemCheckView>
      <StyledExpenseListItemCheckView>
        {Tt_GetStatusExpense(expense.currentStatus)}
      </StyledExpenseListItemCheckView>
      <StyledExpenseListItemCheckView>
        <b>{expense.amount.toLocaleString()}</b> {expense.currency}
      </StyledExpenseListItemCheckView>
      <StyledExpenseListItemCheckView>
        <ExpenseActions expense={expense} />
      </StyledExpenseListItemCheckView>
    </StyledExpenseListItem>
  );
};

export default ExpenseListItem;
