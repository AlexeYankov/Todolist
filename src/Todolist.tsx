import React, { useCallback, useEffect, useState } from "react";
import { AddItemForm } from "./AddItemForm";
import { EditableSpan } from "./EditableSpan";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import { Delete } from "@mui/icons-material";
import { Task } from "./Task";
import { FilterValuesType, TasksStateType } from "./App";
import { AppRootStateType, useAppDispatch } from "./state/store";
import { getTasksThunk } from "./state/todolists-reducer";
import { useSelector } from "react-redux";

export type TaskType = {
  id: string;
  title: string;
  isDone: boolean;
};

type PropsType = {
  status: string;
  id: string;
  title: string;
  changeFilter: (value: FilterValuesType, todolistId: string) => void;
  addTask: (title: string, todolistId: string) => void;
  changeTaskStatus: (id: string, isDone: boolean, todolistId: string) => void;
  changeTaskTitle: (
    taskId: string,
    newTitle: string,
    todolistId: string
  ) => void;
  removeTask: (todolistId: string, taskId: string) => void;
  removeTodolist: (id: string) => void;
  changeTodolistTitle: (id: string, newTitle: string) => void;
  filter: FilterValuesType;
};

export const Todolist = React.memo(function (props: PropsType) {
  useEffect(() => {
    dispatch(getTasksThunk(props.id));
  }, []);
  console.log("Todolist called");
  const dispatch = useAppDispatch();
  const tasks = useSelector<AppRootStateType, TasksStateType>(
    (state) => state.tasks
  );
  let allTodolistTasks: Array<TaskType> = tasks[props.id];
  let a =
    localStorage.getItem(`TodolistFilter${props.id}`) === null
      ? "all"
      : localStorage.getItem(`TodolistFilter${props.id}`);
  console.log(a, a);
  const addTask = useCallback(
    (title: string) => {
      props.addTask(title, props.id);
    },
    [props.addTask, props.id]
  );

  const removeTodolist = () => {
    props.removeTodolist(props.id);
  };
  const changeTodolistTitle = useCallback(
    (title: string) => {
      props.changeTodolistTitle(props.id, title);
    },
    [props.id, props.changeTodolistTitle]
  );

  const onAllClickHandler = useCallback(
    () => props.changeFilter("all", props.id),
    [props.id, props.changeFilter]
  );
  const onActiveClickHandler = useCallback(
    () => props.changeFilter("active", props.id),
    [props.id, props.changeFilter]
  );
  const onCompletedClickHandler = useCallback(
    () => props.changeFilter("completed", props.id),
    [props.id, props.changeFilter]
  );

  let tasksForTodolist = allTodolistTasks;
  if (props.filter === "active") {
    tasksForTodolist = tasksForTodolist?.filter((t) => t.isDone === false);
  }

  if (props.filter === "completed") {
    tasksForTodolist = tasksForTodolist?.filter((t) => t.isDone === true);
  }
  if (props.filter === "all") {
    tasksForTodolist = tasksForTodolist?.map((t) => t);
  }
  console.log(tasksForTodolist, allTodolistTasks, props.filter);
  return (
    <div>
      <h3>
        <EditableSpan value={props.title} onChange={changeTodolistTitle} />
        <IconButton
          onClick={removeTodolist}
          disabled={props.status === "loading"}
        >
          <Delete />
        </IconButton>
      </h3>
      <AddItemForm addItem={addTask} status={props.status} />
      <div>
        {tasksForTodolist?.map((t) => (
          <Task
            status={props.status}
            key={t.id}
            task={t}
            todolistId={props.id}
            removeTask={props.removeTask}
            changeTaskTitle={props.changeTaskTitle}
            changeTaskStatus={props.changeTaskStatus}
          />
        ))}
      </div>
      <div style={{ paddingTop: "10px" }}>
        <Button
          variant={props.filter === "all" ? "outlined" : "text"}
          onClick={onAllClickHandler}
          color={"inherit"}
        >
          All
        </Button>
        <Button
          variant={props.filter === "active" ? "outlined" : "text"}
          onClick={onActiveClickHandler}
          color={"primary"}
        >
          Active
        </Button>
        <Button
          variant={props.filter === "completed" ? "outlined" : "text"}
          onClick={onCompletedClickHandler}
          color={"secondary"}
        >
          Completed
        </Button>
      </div>
    </div>
  );
});
