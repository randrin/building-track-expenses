import {
  StyledFlex,
  StyledObjectStatus,
  StyledText,
  StyledUserInfoAvatar,
} from "@crema/modules/dashboards/index.styled";
import { UserType } from "@crema/types/models/dashboards/UserType";
import { Avatar, Tooltip, Typography } from "antd";
import moment from "moment";
import {
  AiOutlineDelete,
  AiOutlineSchedule,
  AiOutlineSend,
  AiOutlineStop,
} from "react-icons/ai";
import { BiArchiveIn, BiCalendarMinus, BiUser } from "react-icons/bi";
import {
  FaCheck,
  FaChevronLeft,
  FaChevronRight,
  FaRegCheckCircle,
  FaRegEnvelope,
  FaRegEnvelopeOpen,
  FaRegStar,
} from "react-icons/fa";
import { FaMoneyBillTransfer, FaRegCircleCheck } from "react-icons/fa6";
import { FiInfo, FiRefreshCw } from "react-icons/fi";
import { GoDotFill } from "react-icons/go";
import {
  MdOutlineCancel,
  MdOutlineMoreHoriz,
  MdOutlinePayment,
} from "react-icons/md";
import {
  CurrencyTypeEnums,
  DOLLAR_TO_FCFA,
  EURO_TO_DOLLAR,
  EURO_TO_FCFA,
  FORMAT_DATE_FOURTH,
  FORMAT_DATE_ONE,
  FORMAT_DATE_TWO,
  GENDER_FEMALE,
  StatusEnums,
  StatusExpenseEnums,
  TicketEnums,
  UsersRolesEnums,
  UserStatusEnums,
} from "./common-constants.utils";
import { CiCircleList } from "react-icons/ci";
import IntlMessages from "@crema/helpers/IntlMessages";
import { BsClock } from "react-icons/bs";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { LiaFemaleSolid, LiaMaleSolid } from "react-icons/lia";
import {
  ExpenseType,
  StatusExpense,
  TypeExpense,
} from "@crema/types/models/dashboards/ExpenseType";
import { currencies } from "@crema/constants/AppConst";

export const Tt_ExtractDateToMonth = (date: string) => {
  switch (date) {
    case "01":
      return "Jan";
    case "02":
      return "Fév";
    case "03":
      return "Mar";
    case "04":
      return "Avr";
    case "05":
      return "Mai";
    case "06":
      return "Juin";
    case "07":
      return "Juil";
    case "08":
      return "Août";
    case "09":
      return "Sept";
    case "10":
      return "Oct";
    case "11":
      return "Nov";
    case "12":
      return "Déc";
    default:
      return "Jan";
  }
};

export const Tt_FormatDate = (date: string) => {
  // Enter date format yyyy-mm-dd
  const day = date.split("-")[2];
  const month = Tt_ExtractDateToMonth(date.split("-")[1]);
  const year = date.split("-")[0];
  return day + " " + month + " " + year;
};

export const Tt_FormatDateEmpty = (date: string) => {
  return date ? (
    <span>
      {Tt_FormatDate(moment(date).format(FORMAT_DATE_ONE))} <br />
      <i>{moment(date).format(FORMAT_DATE_TWO)}</i>
    </span>
  ) : (
    "-"
  );
};

export const Tt_DateFormat = (date: string, format?: string) => {
  if (format) return moment(date).format(format);
  else return moment(date).format(FORMAT_DATE_FOURTH);
};

export const Tt_GetUserAvatar = (user: UserType) => {
  if (user?.displayName) {
    return user?.displayName.charAt(0).toUpperCase();
  }
  if (user?.email) {
    return user?.email.charAt(0).toUpperCase();
  }
};

export const Tt_GetUser = (user: UserType) => {
  return (
    <StyledFlex>
      {user ? (
        <>
          {user?.photoURL ? (
            <Avatar
              style={{
                marginRight: 5,
                width: 40,
                height: 40,
              }}
              src={user?.photoURL.secure_url}
            />
          ) : (
            <StyledUserInfoAvatar photoRGA={user?.photoRGA}>
              {Tt_GetUserAvatar(user)}
            </StyledUserInfoAvatar>
          )}
          <div
            style={{
              flex: 1,
            }}
          >
            <Typography.Title
              level={5}
              style={{ fontSize: 14, marginBottom: 0 }}
            >
              {user?.displayName}
            </Typography.Title>
            <StyledText>{user?.email}</StyledText>
          </div>
        </>
      ) : (
        "-"
      )}
    </StyledFlex>
  );
};

export const Tt_GetUserWithTooltip = (user: UserType) => {
  return (
    <StyledFlex>
      {user ? (
        <Tooltip title={user?.displayName}>
          {user?.photoURL ? (
            <Avatar
              style={{
                marginRight: 14,
                width: 44,
                height: 44,
                cursor: "pointer",
              }}
              src={user?.photoURL.secure_url}
            />
          ) : (
            <StyledUserInfoAvatar
              photoRGA={user?.photoRGA}
              style={{ cursor: "pointer" }}
            >
              {Tt_GetUserAvatar(user)}
            </StyledUserInfoAvatar>
          )}
        </Tooltip>
      ) : (
        "-"
      )}
    </StyledFlex>
  );
};

export const Tt_GetGenderIcon = (gender) => {
  return gender === GENDER_FEMALE ? <LiaFemaleSolid /> : <LiaMaleSolid />;
};

export const Tt_IconByName: any = {
  list: <CiCircleList />,
  sent: <AiOutlineSend />,
  paid: <MdOutlinePayment />,
  declined: <AiOutlineStop />,
  cancelled: <MdOutlineCancel />,
  "check-circle": <FaRegCheckCircle />,
  envelope: <FaRegEnvelope />,
  star: <FaRegStar />,
  "calendar-minus": <BiCalendarMinus />,
  user: <BiUser />,
  clock: <AiOutlineSchedule />,
  "envelope-open": <FaRegEnvelopeOpen />,
  "trash-alt": <AiOutlineDelete />,
  "file-archive": <BiArchiveIn />,
  "question-circle": <FiInfo />,
  clone: <FiRefreshCw />,
};

export const Tt_GetRecentStatusExpense = (status: StatusExpense[]) => {
  return status.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )[0].status;
};

export const Tt_GetStatusExpense = (status: string) => {
  switch (status) {
    case StatusExpenseEnums.VALID:
      return (
        <span className="tt-expenses-success">
          <FaCheck />
        </span>
      );

    case StatusExpenseEnums.REJECTED: {
      return (
        <span className="tt-expenses-tomato">
          <FaChevronLeft />
        </span>
      );
    }
    case StatusExpenseEnums.PENDING: {
      return (
        <span className="tt-expenses-warning">
          <MdOutlineMoreHoriz />
        </span>
      );
    }
    case StatusExpenseEnums.UNDER_APPROVED: {
      return (
        <span className="tt-expenses-primary">
          <FaChevronRight />
        </span>
      );
    }
    case StatusExpenseEnums.ACCOUNTING: {
      return (
        <span className="tt-expenses-secondary">
          <FaMoneyBillTransfer />
        </span>
      );
    }
  }
};

export const Tt_GetColorStatus = (status: string) => {
  switch (status) {
    case UserStatusEnums.ACTIVE: {
      return "#2a7a39";
    }
    case UserStatusEnums.DISABLED: {
      return "#d12420";
    }
    case UserStatusEnums.PENDING: {
      return "#fa9600";
    }
    case UserStatusEnums.NEVER_CONNECTED: {
      return "#e0e0e1";
    }
    case UserStatusEnums.ARCHIVED: {
      return "#00b5ec";
    }
  }
};

export const Tt_GetObjectStatus = (status: string) => {
  return (
    <StyledObjectStatus
      style={{
        color: Tt_GetColorStatus(status),
        backgroundColor: Tt_GetColorStatus(status) + "44",
      }}
    >
      {status === StatusEnums.ACTIVE ? (
        <IntlMessages id="common.enabled" />
      ) : (
        <IntlMessages id="common.disabled" />
      )}
    </StyledObjectStatus>
  );
};

export const Tt_GetTicketStatus = (status: string) => {
  switch (status) {
    case TicketEnums.OPEN: {
      return (
        <span className="tt-expenses-warning">
          <BsClock />
        </span>
      );
    }
    case TicketEnums.CLOSED: {
      return (
        <span className="tt-expenses-secondary">
          <IoIosCloseCircleOutline />
        </span>
      );
    }
    case TicketEnums.RESOLVED: {
      return (
        <span className="tt-expenses-success">
          <FaRegCircleCheck />
        </span>
      );
    }
  }
};

export const Tt_GetColorStatusExpense = (status: string) => {
  switch (status) {
    case StatusExpenseEnums.VALID:
      return "#2a7a39";
      break;
    case StatusExpenseEnums.REJECTED:
      return "#d12420";
      break;
    case StatusExpenseEnums.PENDING:
      return "#fa9600";
      break;
    case StatusExpenseEnums.ACCOUNTING:
      return "#e0e0e1";
      break;
    case StatusExpenseEnums.UNDER_APPROVED:
      return "#183242";
      break;
    default:
      return "#fa9600";
      break;
  }
};

export const Tt_GetBackgroundColorStatus = (status: string) => {
  switch (status) {
    case UserStatusEnums.ACTIVE: {
      return "tt-expenses-background-success";
    }
    case UserStatusEnums.DISABLED: {
      return "tt-expenses-background-tomato";
    }
    case UserStatusEnums.PENDING: {
      return "tt-expenses-background-warning";
    }
    case UserStatusEnums.NEVER_CONNECTED: {
      return "tt-expenses-background-sliver";
    }
    case UserStatusEnums.ARCHIVED: {
      return "tt-expenses-background-primary";
    }
  }
};

export const Tt_GetBackgroundColorStatusUser = (status: string) => {
  switch (status) {
    case UsersRolesEnums.ADMIN: {
      return "tt-expenses-background-success";
    }
    case UsersRolesEnums.USER: {
      return "tt-expenses-background-primary";
    }
    case UsersRolesEnums.MANAGER: {
      return "tt-expenses-background-warning";
    }
    default: {
      return "tt-expenses-background-sliver";
    }
  }
};

export const Tt_GetColorStatusUser = (status: string) => {
  switch (status) {
    case UsersRolesEnums.ADMIN: {
      return "#2a7a39";
    }
    case UsersRolesEnums.MANAGER: {
      return "#fa9600";
    }
    case UsersRolesEnums.USER: {
      return "#00b5ec";
    }
    default: {
      return "#e0e0e1";
    }
  }
};

export const Tt_GetStatusUser = (status: string) => {
  switch (status) {
    case UserStatusEnums.ACTIVE: {
      return (
        <span className="tt-expenses-success">
          <GoDotFill />
        </span>
      );
    }
    case UserStatusEnums.DISABLED: {
      return (
        <span className="tt-expenses-tomato">
          <GoDotFill />
        </span>
      );
    }
    case UserStatusEnums.PENDING: {
      return (
        <span className="tt-expenses-warning">
          <GoDotFill />
        </span>
      );
    }
    case UserStatusEnums.NEVER_CONNECTED: {
      return (
        <span className="tt-expenses-sliver">
          <GoDotFill />
        </span>
      );
    }
    case UserStatusEnums.ARCHIVED: {
      return (
        <span className="tt-expenses-primary">
          <GoDotFill />
        </span>
      );
    }
  }
};

export const Tt_GetStatusColor = (status: string) => {
  switch (status) {
    case StatusEnums.ACTIVE: {
      return "#43C888";
    }
    case StatusEnums.DISABLED: {
      return "#F84E4E";
    }
  }
};

export const Tt_TotalExpensesAmountByCurrency = (
  expenses: ExpenseType[],
  currency: string
) => {
  switch (currency) {
    case CurrencyTypeEnums.FCFA:
      return expenses
        .map((expense) =>
          expense.currency === CurrencyTypeEnums.FCFA
            ? expense.amount
            : expense.currency === CurrencyTypeEnums.EURO
            ? Number(expense.amount * EURO_TO_FCFA)
            : Number(expense.amount * DOLLAR_TO_FCFA)
        )
        .reduce((a, b) => a + b, 0)
        .toLocaleString();
    case CurrencyTypeEnums.EURO:
      return expenses
        .map((expense) =>
          expense.currency === CurrencyTypeEnums.EURO
            ? expense.amount
            : expense.currency === CurrencyTypeEnums.FCFA
            ? Number(expense.amount / EURO_TO_FCFA)
            : Number(expense.amount * EURO_TO_DOLLAR)
        )
        .reduce((a, b) => a + b, 0)
        .toLocaleString();
    case CurrencyTypeEnums.DOLLAR:
      return expenses
        .map((expense) =>
          expense.currency === CurrencyTypeEnums.DOLLAR
            ? expense.amount
            : expense.currency === CurrencyTypeEnums.EURO
            ? Number(expense.amount / EURO_TO_DOLLAR)
            : Number(expense.amount / DOLLAR_TO_FCFA)
        )
        .reduce((a, b) => a + b, 0)
        .toLocaleString();
    default:
      break;
  }
};
