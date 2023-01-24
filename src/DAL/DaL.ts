import axios from "axios";
import { TodolistType } from "../App";
import { TaskType } from "../Todolist";

export type TodolistTypeFromServer = {
  id: string;
  title: string;
  addedDate: string;
  order: number;
};

export type TasksTypeFromServer = {
  id: string;
  title: string;
  addedDate: string;
  order: number;
  status: number;
  priority: number;
  startDate: string | null;
  deadline: string | null;
  description: string | null;
};

export type PostTodolistFromServer = {
  messages: Array<string>;
  fieldsErrors: Array<string>;
  resultCode: number;
  data: {
      item: TodolistTypeFromServer;
    };
};

const instance = axios.create({
  baseURL: "https://social-network.samuraijs.com/api/1.1/",
  withCredentials: true,
  headers: {
    "API-KEY": "c0d83c97-4393-4f68-8a3e-e1e9a7d62aee",
  },
});

export const getTodolists = () => {
  return instance.get<Array<TodolistTypeFromServer>>("todo-lists");
};

export const setTodolists = (title: string) => {
  return instance.post<PostTodolistFromServer>("todo-lists", { title });
};

export const setTodolistsName = (id: string, title: string) => {
  return instance.put<PostTodolistFromServer>(`todo-lists/${id}`, { title });
};

export const deleteTodolist = (id: string) => {
  return instance.delete<PostTodolistFromServer>("todo-lists/" + id);
};

export const deleteTask = (todolistId: string, taskId: string) => {
  return instance.delete(`todo-lists/${todolistId}/tasks/${taskId}`);
};

export const setTask = (id: string, title: string) => {
  return instance.post("todo-lists/" + id + "/tasks", {
    title,
  });
};

export const setTaskTitle = (id: string, title: string, tasksID: string) => {
  return instance.put("todo-lists/" + id + "/tasks/" + tasksID, { title });
};

export const getTasks = (id: string) => {
  return instance.get("todo-lists/" + id + "/tasks");
};
