import { FilterValuesType, TodolistType } from "../App";
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
  TodolistTypeFromServer,
} from "../../src/DAL/DaL";
import { Dispatch } from "redux";
import {
  AppStatusType,
  setAppErrorTypeAC,
  setAppStatusAC,
} from "./app-reducer";
import { addTaskAC, changeTaskTitleAC, removeTaskAC } from "./tasks-reducer";

export type RemoveTodolistActionType = {
  type: "REMOVE-TODOLIST";
  id: string;
};
export type AddTodolistActionType = {
  type: "ADD-TODOLIST";
  title: string;
  id: string;
};
export type ChangeTodolistTitleActionType = {
  type: "CHANGE-TODOLIST-TITLE";
  id: string;
  title: string;
};
export type ChangeTodolistFilterActionType = {
  type: "CHANGE-TODOLIST-FILTER";
  id: string;
  filter: FilterValuesType;
};
export type ChangeTodolistStatusActionType = {
  type: "CHANGE-TODOLIST-STATUS";
  id: string;
  status: string;
};
export type InitialTodolistActionType = {
  type: "INITIAL-TODOLIST";
  todolists: Array<TodolistType>;
};

export type ActionsType =
  | RemoveTodolistActionType
  | AddTodolistActionType
  | ChangeTodolistTitleActionType
  | ChangeTodolistFilterActionType
  | InitialTodolistActionType
  | AppStatusType
  | ChangeTodolistStatusActionType;
// | RequestStatusType;

const initialState: Array<TodolistType> = [];

export const todolistsReducer = (
  state: Array<TodolistType> = initialState,
  action: ActionsType
): Array<TodolistType> => {
  switch (action.type) {
    case "REMOVE-TODOLIST": {
      return state.filter((tl) => tl.id !== action.id);
    }
    case "CHANGE-TODOLIST-STATUS": {
      const todolist = state.find((tl) => tl.id === action.id);
      if (todolist) {
        // если нашёлся - изменим ему заголовок
        todolist.status = action.status;
      }
      return [...state];
    }
    case "INITIAL-TODOLIST": {
      const addTodolistStatusField = action.todolists.map((el)=>({...el, status: "succeeded"}))
      return addTodolistStatusField.map((el) =>
        el.filter ? el : { ...el, filter: "all" }
      );
    }
    case "ADD-TODOLIST": {
      console.log("Action", action);
      return [
        {
          id: action.id,
          title: action.title,
          filter: "all",
          status: "succeeded"
        },
        ...state,
      ];
    }
    case "CHANGE-TODOLIST-TITLE": {
      const todolist = state.find((tl) => tl.id === action.id);
      if (todolist) {
        // если нашёлся - изменим ему заголовок
        todolist.title = action.title;
      }
      return [...state];
    }
    case "CHANGE-TODOLIST-FILTER": {
      const todolist = state.find((tl) => tl.id === action.id);
      if (todolist) {
        // если нашёлся - изменим ему заголовок
        todolist.filter = action.filter;
      }
      return [...state];
    }
    default:
      return state;
  }
};

export const removeTodolistAC = (
  todolistId: string
): RemoveTodolistActionType => {
  return { type: "REMOVE-TODOLIST", id: todolistId };
};
export const addTodolistAC = (
  id: string,
  title: string
): AddTodolistActionType => {
  return { type: "ADD-TODOLIST", id, title };
};
export const changeTodolistTitleAC = (
  id: string,
  title: string
): ChangeTodolistTitleActionType => {
  return { type: "CHANGE-TODOLIST-TITLE", id: id, title: title };
};
export const changeTodolistFilterAC = (
  id: string,
  filter: FilterValuesType
): ChangeTodolistFilterActionType => {
  return { type: "CHANGE-TODOLIST-FILTER", id: id, filter: filter };
};
export const changeTodolistStatusAC = (
  id: string,
  status: string
): ChangeTodolistStatusActionType => {
  return { type: "CHANGE-TODOLIST-STATUS", id: id, status: status };
};
export const initialTodolistAC = (
  todolists: Array<TodolistTypeFromServer>,
  filter?: FilterValuesType
) => {
  return { type: "INITIAL-TODOLIST", todolists };
};

export const getTodolistsThunk = (dispatch: Dispatch) => {
  dispatch(setAppStatusAC("loading"));
  getTodolists().then((res) => {
    dispatch(initialTodolistAC(res.data));
    dispatch(setAppStatusAC("succeeded"));
  });
};
export const deleteTodolistsThunk = (id: string) => (dispatch: Dispatch) => {
  dispatch(changeTodolistStatusAC(id, "loading"));
  deleteTodolist(id).then(() => dispatch(removeTodolistAC(id)));
};

export const changeTodolistsTitleThunk =
  (id: string, title: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC("loading"));
    setTodolistsName(id, title).then(() => {
      const action = changeTodolistTitleAC(id, title);
      dispatch(action);
      dispatch(setAppStatusAC("succeeded"));
    });
  };
export const addTodolistThunk = (title: string) => (dispatch: Dispatch) => {
  dispatch(setAppStatusAC("loading"));
  // .then((res)=> {res.data.resultCode})
  setTodolists(title).then(
    ({
      data: {
        data: {
          item: { id, title },
        },
      },
    }) => {
      dispatch(addTodolistAC(id, title));
      dispatch(setAppStatusAC("succeeded"));
    }
  );
};
export const getTasksThunk = (id: string) => (dispatch: Dispatch) => {
  dispatch(setAppStatusAC("loading"));
  getTasks(id).then(({ data }) => {
    const tasks = data.items;
    tasks.forEach((el) => {
      console.log(el);
      const getStatusFromLS = JSON.parse(
        `${localStorage.getItem(`TaskStatus${el.id}`)}`
      );
      console.log(el);
      dispatch(addTaskAC(el.id, el.title, el.todoListId, getStatusFromLS));
    });
    dispatch(setAppStatusAC("succeeded"));
  });
};

export const removeTaskThunk =
  (todolistId: string, taskId: string) => (dispatch: Dispatch) => {
    dispatch(changeTodolistStatusAC(todolistId, "loading"));
    dispatch(setAppStatusAC("loading"));
    deleteTask(todolistId, taskId).then(() => {
      dispatch(setAppStatusAC("succeeded"));
      dispatch(removeTaskAC(todolistId, taskId));
      dispatch(changeTodolistStatusAC(todolistId, "succeeded"));
    });
  };
export const addTaskThunk =
  (todolistId: string, title: string) => (dispatch: Dispatch) => {
    dispatch(changeTodolistStatusAC(todolistId, "loading"));
    dispatch(setAppStatusAC("loading"));
    setTask(todolistId, title).then(
      ({
        data: {
          resultCode,
          messages,
          data: { item },
        },
      }) => {
        if (resultCode === 0 ) {
        dispatch(addTaskAC(item.id, item.title, todolistId));
        dispatch(setAppStatusAC("succeeded"));
        dispatch(changeTodolistStatusAC(todolistId, "succeeded"));
      }
      else {
        if (messages.length) {
          dispatch(setAppErrorTypeAC(messages[0]))
          dispatch(changeTodolistStatusAC(todolistId, "succeeded"));
        }
        else {
          dispatch(setAppErrorTypeAC('Some error'))
          
          dispatch(changeTodolistStatusAC(todolistId, "succeeded"));
        }
        dispatch(setAppStatusAC("failed"));
      }
      }
    );
  };

export const changeTaskTitleThunk =
  (id: string, newTitle: string, todolistId: string) =>
  (dispatch: Dispatch) => {
    dispatch(setAppStatusAC("loading"));
    setTaskTitle(todolistId, newTitle, id).then(
      ({
        data: {
          data: { item },
        },
      }) => {
        dispatch(changeTaskTitleAC(item.id, item.title, todolistId));
        dispatch(setAppStatusAC("succeeded"));
      }
    );
  };
