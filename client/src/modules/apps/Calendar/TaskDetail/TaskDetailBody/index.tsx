import React, { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { useAuthUser } from "@crema/hooks/AuthHooks";
import { useIntl } from "react-intl";
import ChangeStaff from "./ChangeStaff";
import TaskStatus from "./TaskStatus";
import TaskPriority from "./TaskPriority";
import { Input } from "antd";
import { FiSend } from "react-icons/fi";
import { AiOutlineCheckCircle, AiOutlineEdit } from "react-icons/ai";
import AppIconButton from "@crema/components/AppIconButton";
import {
  StyledDetailContent,
  StyledTodoDetailBtn,
  StyledTodoDetailContentHeader,
  StyledTodoDetailContentHeaderLabel,
  StyledTodoDetailContentHeaderLeft,
  StyledTodoDetailContentHeaderTag,
  StyledTodoDetailContentHeaderTagBtn,
  StyledTodoDetailFooter,
  StyledTodoDetailPara,
  StyledTodoDetailStaff,
  StyledTodoDetailStaffEdit,
  StyledTodoDetailStaffEditBtnView,
  StyledTodoDetailStaffRow,
  StyledTodoDetailStatus,
  StyledTodoDetailStatusPri,
  StyledTodoDetailTextAreaForm,
  StyledTodoDivider,
} from "../index.styled";
import { putDataApi } from "@crema/hooks/APIHooks";
import { useInfoViewActionsContext } from "@crema/context/AppContextProvider/InfoViewContextProvider";
import {
  CommentsLists,
  AssignedStaff,
  TodoDatePicker,
  TaskCreatedByInfo,
  TaskLabels,
} from "@crema/modules/apps/Calendar";
import { useCalendarContext } from "../../../context/CalendarContextProvider";
import { TodoObjType } from "@crema/types/models/apps/Todo";
import { getDateObject, getFormattedDate } from "@crema/helpers/DateHelper";

type Props = {
  selectedTask: TodoObjType;
  onUpdateSelectedTask: (data: TodoObjType) => void;
};

const TaskDetailBody = (props: Props) => {
  const { selectedTask, onUpdateSelectedTask } = props;
  const infoViewActionsContext = useInfoViewActionsContext();
  const { staffList } = useCalendarContext();
  const { user } = useAuthUser();

  const [isEdit, setEdit] = useState(false);

  const [title, setTitle] = useState(selectedTask.title);
  const [content, setContent] = useState(selectedTask.content);

  const [comment, setComment] = useState("");

  const [scheduleDate, setScheduleDate] = useState<string | Dayjs>(
    getDateObject(selectedTask.startDate)
  );
  const [scheduleEndDate, setScheduleEndDate] = useState<string | Dayjs>(
    getDateObject(selectedTask.endDate)
  );

  const [selectedStaff, setStaff] = useState(selectedTask.assignedTo);

  const onClickEditButton = () => {
    setEdit(true);
  };

  const onDoneEditing = () => {
    const task = selectedTask;
    task.content = content;
    task.title = title;
    task.startDate = getFormattedDate(scheduleDate);
    task.endDate = getFormattedDate(scheduleEndDate);
    task.assignedTo = selectedStaff;
    putDataApi<{ task: TodoObjType }>(
      "/api/calendar/task/",
      infoViewActionsContext,
      {
        task,
      }
    )
      .then((data) => {
        onUpdateSelectedTask(data.task);
        infoViewActionsContext.showMessage("Task Updated Successfully");
      })
      .catch((error) => {
        infoViewActionsContext.fetchError(error.message);
      });
    console.log("onDoneEditing: ", task);
    setEdit(!isEdit);
  };

  const onAddComments = () => {
    const task = selectedTask;
    task.comments = task.comments.concat({
      comment: comment,
      name: user.displayName ? user.displayName : "User",
      image: user.photoURL.secure_url,
      date: dayjs().format("MMM DD"),
    });
    putDataApi<{ task: TodoObjType }>(
      "/api/calendar/task/",
      infoViewActionsContext,
      {
        task,
      }
    )
      .then((data) => {
        onUpdateSelectedTask(data.task);
        infoViewActionsContext.showMessage("Task Updated Successfully");
      })
      .catch((error) => {
        infoViewActionsContext.fetchError(error.message);
      });
    setComment("");
  };

  const handleStaffChange = (value: number) => {
    const newStaff = staffList.find((staff) => staff.id === value);
    setStaff((staff) => {
      return { ...staff, ...newStaff };
    });
  };

  const { messages } = useIntl();

  return (
    <StyledDetailContent>
      <StyledTodoDetailContentHeader>
        <StyledTodoDetailContentHeaderLeft>
          {isEdit ? (
            <Input
              style={{ maxWidth: 200, marginRight: 20 }}
              placeholder={messages["todo.taskTitle"] as string}
              defaultValue={title}
              onChange={({ target: { value } }) => setTitle(value)}
            />
          ) : (
            <h2>{selectedTask.title}</h2>
          )}

          <StyledTodoDetailContentHeaderLabel className="ant-row ant-row-middle">
            {selectedTask.label ? (
              <TaskLabels labels={selectedTask.label} />
            ) : null}
          </StyledTodoDetailContentHeaderLabel>

          <StyledTodoDetailContentHeaderTag>
            <StyledTodoDetailContentHeaderTagBtn
              style={{
                color: selectedTask.priority.color,
                backgroundColor: selectedTask.priority.color + "10",
              }}
            >
              {selectedTask.priority.name}
            </StyledTodoDetailContentHeaderTagBtn>
          </StyledTodoDetailContentHeaderTag>
        </StyledTodoDetailContentHeaderLeft>

        <TaskCreatedByInfo
          createdBy={selectedTask.createdBy}
          createdOn={selectedTask.createdOn}
        />
      </StyledTodoDetailContentHeader>

      <StyledTodoDetailStaffEdit>
        <StyledTodoDetailStaffRow>
          {isEdit ? (
            <>
              <StyledTodoDetailStaff>
                <ChangeStaff
                  selectedStaff={selectedStaff}
                  handleStaffChange={handleStaffChange}
                />
              </StyledTodoDetailStaff>
              <TodoDatePicker
                scheduleDate={scheduleDate}
                scheduleEndDate={scheduleEndDate}
                setScheduleDate={setScheduleDate}
                setScheduleEndDate={setScheduleEndDate}
              />
            </>
          ) : (
            <AssignedStaff assignedStaff={selectedTask.assignedTo} />
          )}
        </StyledTodoDetailStaffRow>

        <StyledTodoDetailStaffEditBtnView>
          {!isEdit ? (
            <AppIconButton
              onClick={onClickEditButton}
              icon={<AiOutlineEdit />}
            />
          ) : (
            <AppIconButton
              onClick={onDoneEditing}
              icon={<AiOutlineCheckCircle />}
            />
          )}
        </StyledTodoDetailStaffEditBtnView>
      </StyledTodoDetailStaffEdit>

      <StyledTodoDivider />

      {!isEdit ? (
        <StyledTodoDetailPara>{content}</StyledTodoDetailPara>
      ) : (
        <StyledTodoDetailTextAreaForm>
          <Input.TextArea
            placeholder={messages["common.description"] as string}
            defaultValue={content}
            onChange={({ target: { value } }) => setContent(value)}
          />
        </StyledTodoDetailTextAreaForm>
      )}

      <StyledTodoDetailStatusPri>
        <StyledTodoDetailStatus>
          <TaskStatus
            selectedTask={selectedTask}
            onUpdateSelectedTask={onUpdateSelectedTask}
          />
        </StyledTodoDetailStatus>

        <StyledTodoDetailStatus>
          <TaskPriority
            selectedTask={selectedTask}
            onUpdateSelectedTask={onUpdateSelectedTask}
          />
        </StyledTodoDetailStatus>
      </StyledTodoDetailStatusPri>

      <StyledTodoDivider />

      <CommentsLists comments={selectedTask.comments} />

      <StyledTodoDetailFooter>
        <Input.TextArea
          autoSize={{ minRows: 1, maxRows: 3 }}
          placeholder={messages["common.writeComment"] as string}
          value={comment}
          onChange={({ target: { value } }) => setComment(value)}
        />
        <StyledTodoDetailBtn
          shape="circle"
          type="primary"
          disabled={!comment}
          onClick={onAddComments}
        >
          <FiSend />
        </StyledTodoDetailBtn>
      </StyledTodoDetailFooter>
    </StyledDetailContent>
  );
};

export default TaskDetailBody;
