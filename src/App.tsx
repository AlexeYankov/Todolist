import { useCallback, useEffect } from "react";
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
import LinearProgress from "@mui/material/LinearProgress";
import { Menu } from "@mui/icons-material";
import {
  addTaskThunk,
  addTodolistThunk,
  changeTaskTitleThunk,
  changeTodolistFilterAC,
  changeTodolistsTitleThunk,
  deleteTodolistsThunk,
  getTodolistsThunk,
  removeTaskThunk,
} from "./state/todolists-reducer";
import { changeTaskStatusAC } from "./state/tasks-reducer";
import { useSelector } from "react-redux";
import { AppRootStateType, useAppDispatch } from "./state/store";
import { RequestStatusType } from "./state/app-reducer";
import ErrorSnackbar from "./ErrorSnackBar";
export type FilterValuesType = string | null;
export type TodolistType = {
  id: string;
  title: string;
  filter: FilterValuesType;
  status: string;
};

export type TasksStateType = {
  [key: string]: Array<TaskType>;
};

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getTodolistsThunk);
  }, []);

  const todolists = useSelector<AppRootStateType, Array<TodolistType>>(
    (state) => state.todolists
  );
  const status = useSelector<AppRootStateType, RequestStatusType>(
    (state) => state.app.status
  );
  const error = useSelector<AppRootStateType, null | string>(
    (state) => state.app.error
  );

  const removeTask = useCallback(function (todolistId: string, taskId: string) {
    dispatch(removeTaskThunk(todolistId, taskId));
  }, []);

  const addTask = useCallback(function (title: string, todolistId: string) {
    dispatch(addTaskThunk(todolistId, title));
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
    dispatch(changeTaskTitleThunk(id, newTitle, todolistId));
  },
  []);

  const changeFilter = useCallback(function (
    value: FilterValuesType,
    todolistId: string
  ) {
    const action = changeTodolistFilterAC(todolistId, value);
    dispatch(action);
    localStorage.setItem(`TodolistFilter${todolistId}`, `${value}`);
  },
  []);

  const removeTodolist = useCallback(function (id: string) {
    dispatch(deleteTodolistsThunk(id));
  }, []);

  const changeTodolistTitle = useCallback(function (id: string, title: string) {
    console.log(title);
    dispatch(changeTodolistsTitleThunk(id, title));
  }, []);

  const addTodolist = useCallback(function (title: string) {
    dispatch(addTodolistThunk(title));
  }, []);
  return (
    <div className="App">
      <ErrorSnackbar error={error} />
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <Menu />
          </IconButton>
          <Typography variant="h6">News</Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
        {status == "loading" && <LinearProgress color="secondary" />}
      </AppBar>
      <Container fixed>
        <Grid container style={{ padding: "20px" }}>
          <AddItemForm addItem={addTodolist} />
        </Grid>
        <Grid container spacing={3}>
          {todolists?.map((tl) => {
            let filter =
              localStorage.getItem(`TodolistFilter${tl.id}`) === null
                ? "all"
                : localStorage.getItem(`TodolistFilter${tl.id}`);

            console.log(filter);
            return (
              <Grid item key={tl.id}>
                <Paper style={{ padding: "10px" }}>
                  <Todolist
                    status={tl.status}
                    id={tl.id}
                    title={tl.title}
                    removeTask={removeTask}
                    changeFilter={changeFilter}
                    addTask={addTask}
                    changeTaskStatus={changeStatus}
                    filter={filter}
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
