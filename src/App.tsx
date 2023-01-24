import React, { useCallback, useEffect, useState } from "react";
import "./App.css";
import { TaskType, Todolist } from "./Todolist";
import { AddItemForm } from "./AddItemForm";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { Menu } from "@mui/icons-material";
import {
  addTodolistAC,
  changeTodolistFilterAC,
  changeTodolistTitleAC,
  initialTodolistAC,
  removeTodolistAC,
} from "./state/todolists-reducer";
import {
  addTaskAC,
  changeTaskStatusAC,
  changeTaskTitleAC,
  removeTaskAC,
} from "./state/tasks-reducer";
import { useDispatch, useSelector } from "react-redux";
import { AppRootStateType } from "./state/store";
import {
  deleteTask,
  deleteTodolist,
  getTasks,
  getTodolists,
  setTask,
  setTaskTitle,
  setTodolists,
  setTodolistsName,
  TasksByOne,
} from "./DAL/DaL";

export type FilterValuesType = string | null;
export type TodolistType = {
  id: string;
  title: string;
  filter: FilterValuesType;
};

export type TasksStateType = {
  [key: string]: Array<TaskType>;
};

function App() {
  useEffect(() => {
    getTodolists()
      .then((res) => dispatch(initialTodolistAC(res.data)))
      .then((data) => {
        const taskIds = data.todolists;
        console.log(data);
        taskIds.forEach(({ id }) =>
          getTasks(id).then(({data}) => {
            const tasks = data.items
            // const tasks = res.data.items
            tasks.map((el) => {
              console.log(el);
              const getStatusFromLS = JSON.parse(`${localStorage.getItem(`TaskStatus${el.id}`)}`);
              dispatch(
                addTaskAC(el.id, el.title, el.todoListID, getStatusFromLS)
              );
            });
          })
        );
      });
  }, []);
  const todolists = useSelector<AppRootStateType, Array<TodolistType>>(
    (state) => state.todolists
  );
  const tasks = useSelector<AppRootStateType, TasksStateType>(
    (state) => state.tasks
  );
  const dispatch = useDispatch();

  const removeTask = useCallback(function (todolistId: string, taskId: string) {
    dispatch(removeTaskAC(todolistId, taskId));
    deleteTask(todolistId, taskId).then(() =>
      dispatch(removeTaskAC(todolistId, taskId))
    );
  }, []);

  const addTask = useCallback(function (title: string, todolistId: string) {
    setTask(todolistId, title).then(
      ({
        data: {
          data: { item },
        },
      }) => {
        console.log(todolistId);
        dispatch(addTaskAC(item.id, item.title, todolistId));
      }
    );
  }, []);

  const changeStatus = useCallback(function (
    id: string,
    isDone: boolean,
    todolistId: string
  ) {
    const action = changeTaskStatusAC(id, isDone, todolistId);
    dispatch(action);
    localStorage.setItem(`TaskStatus${id}`, `${isDone}`);
  },
  []);
  const changeTaskTitle = useCallback(function (
    id: string,
    newTitle: string,
    todolistId: string
  ) {
    setTaskTitle(todolistId, newTitle, id);
    const action = changeTaskTitleAC(id, newTitle, todolistId);
    dispatch(action);
  },
  []);

  const changeFilter = useCallback(function (
    value: FilterValuesType,
    todolistId: string
  ) {
    const action = changeTodolistFilterAC(todolistId, value);
    dispatch(action);
    localStorage.setItem(`TodolistFilter${todolistId}`, `${value}`)
  },
  []);

  const removeTodolist = useCallback(function (id: string) {
    deleteTodolist(id).then(() => dispatch(removeTodolistAC(id)));
  }, []);

  const changeTodolistTitle = useCallback(function (id: string, title: string) {
    console.log(title);
    setTodolistsName(id, title).then(() => {
      const action = changeTodolistTitleAC(id, title);
      dispatch(action);
    });
  }, []);

  const addTodolist = useCallback(function (title: string) {
    setTodolists(title).then(
      ({
        data: {
          data: {
            item: { id, title },
          },
        },
      }) => {
        dispatch(addTodolistAC(id, title));
      }
    );
  }, []);
  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <Menu />
          </IconButton>
          <Typography variant="h6">News</Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
      <Container fixed>
        <Grid container style={{ padding: "20px" }}>
          <AddItemForm addItem={addTodolist} />
        </Grid>
        <Grid container spacing={3}>
          {todolists?.map((tl) => {
            let allTodolistTasks = tasks[tl.id];
            let a =
              localStorage.getItem(`TodolistFilter${tl.id}`) === null
                ? "all"
                : localStorage.getItem(`TodolistFilter${tl.id}`);
            console.log(a, a, allTodolistTasks);
            return (
              <Grid item key={tl.id}>
                <Paper style={{ padding: "10px" }}>
                  <Todolist
                    id={tl.id}
                    title={tl.title}
                    tasks={allTodolistTasks}
                    removeTask={removeTask}
                    changeFilter={changeFilter}
                    addTask={addTask}
                    changeTaskStatus={changeStatus}
                    filter={a}
                    removeTodolist={removeTodolist}
                    changeTaskTitle={changeTaskTitle}
                    changeTodolistTitle={changeTodolistTitle}
                  />
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </div>
  );
}

export default App;
