import AppList from "@crema/components/AppList";
import ListEmptyResult from "@crema/components/AppList/ListEmptyResult";
import AppsContent from "@crema/components/AppsContainer/AppsContent";
import AppsHeader from "@crema/components/AppsContainer/AppsHeader";
import { useJWTAuth } from "@crema/services/auth/jwt-auth/JWTAuthProvider";
import { AttachmentType } from "@crema/types/models/dashboards/AttachmentType";
import { ExpenseType } from "@crema/types/models/dashboards/ExpenseType";
import { Image } from "antd";
import dayjs from "dayjs";
import {
  useExpenseActionsContext,
  useExpenseContext,
} from "modules/apps/context/ExpenseContextProvider";
import moment from "moment";
import { useState } from "react";
import { useIntl } from "react-intl";
import {
  FORMAT_DATE_THREE,
  MODE_ADD,
  MODE_VIEW,
} from "utils/common-constants.utils";
import ExpenseHeader from "./ExpenseHeader";
import ExpenseListItem from "./ExpenseListItem";
import ExpenseView from "./ExpenseView";

type Props = {
  expenseData: ExpenseType[];
  loading: boolean;
};

const ExpenseTable = ({ expenseData, loading }: Props) => {
  // States
  const { user } = useJWTAuth();
  const {
    setExpense,
    setAppDrawerOpen,
    setExpenseDrawerOpen,
    setCheckedExpenses,
    setMode,
  } = useExpenseActionsContext();
  const {
    mode,
    report,
    isExpenseDrawerOpen,
    expense,
    isAppDrawerOpen,
    checkedExpenses,
  } = useExpenseContext();
  const { messages } = useIntl();
  const [isShowExpenses, setIsShowExpenses] = useState(false);
  const [attachments, setAttachments] = useState<AttachmentType[]>([]);

  // Init

  // Functions
  const onChangeCheckedExpenses = (checked: any, id: string) => {
    if (checked) {
      setCheckedExpenses(checkedExpenses.concat(id));
    } else {
      setCheckedExpenses(
        checkedExpenses.filter((expenseId) => expenseId !== id)
      );
    }
  };

  const onViewExpenseDetail = (expense: ExpenseType) => {
    setExpense(expense);
    console.log(mode);

    if (mode === MODE_VIEW) {
      setAppDrawerOpen(!isAppDrawerOpen);
    }
  };

  const handleOnAddExpense = () => {
    setExpenseDrawerOpen(!isExpenseDrawerOpen);
    setMode(MODE_ADD);
    setExpense({
      reportId: report.reportId,
      employee: user._id,
      department: user.currentDepartment._id,
      currency: report.currency,
      transaction_date: dayjs(
        moment(new Date()).format(FORMAT_DATE_THREE),
        FORMAT_DATE_THREE
      ),
    });
  };

  console.log(checkedExpenses);

  // Render
  return (
    <>
      <AppsHeader>
        <ExpenseHeader
          expenses={expenseData}
          checkedExpenses={checkedExpenses}
          setCheckedExpenses={setCheckedExpenses}
        />
      </AppsHeader>
      <AppsContent>
        <AppList
          data={expenseData.sort(
            (a, b) =>
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          )}
          ListEmptyComponent={
            <ListEmptyResult
              loading={loading}
              actionTitle={messages["common.create.expense"] as string}
              onClick={handleOnAddExpense}
            />
          }
          renderItem={(expense) => (
            <ExpenseListItem
              key={expense._id}
              expense={expense}
              onChangeCheckedExpenses={onChangeCheckedExpenses}
              checkedExpenses={checkedExpenses}
              onViewExpenseDetail={onViewExpenseDetail}
            />
          )}
        />
      </AppsContent>
      {isAppDrawerOpen && (
        <ExpenseView
          expense={expense}
          isAppDrawerOpen={isAppDrawerOpen}
          setAppDrawerOpen={setAppDrawerOpen}
        />
      )}
      {isShowExpenses && (
        <>
          {attachments?.map((image, index) => (
            <Image
              key={index}
              alt={image.public_id}
              style={{ display: "none" }}
              preview={{
                visible: isShowExpenses,
                scaleStep: 0.5,
                src: image.url,
                onVisibleChange: (value) => {
                  setIsShowExpenses(!isShowExpenses);
                },
              }}
            />
          ))}
        </>
      )}
    </>
  );
};

export default ExpenseTable;
