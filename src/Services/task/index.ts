import { Priority } from "@/Utils/constant";
import { API } from "../base";
import { User } from "../group";

export interface Response {
  data: Data
  status: number
}

export interface Data {
  error: string
  message: string
  statusCode: number
}
////

export interface ErrorHandle {
  data: {
    error: string;             
    message: string[];           
    statusCode: number;        
  };
  status: number;   
}

export interface ErrorResponse{
  message: string 
  error?: string
  statusCode: number
}

export interface Assignee {
  "id": number,
  "name": string,
  "email": string,
  "dateofbirth": string,
  "updatedAt": string,
  "role": string
}

export interface Task {
  "id": number,
  "title": string,
  "description": string,
  "dueDate": string,
  "priority": Priority,
  "status": string,
  "createdAt": string,
  "updatedAt": string,
  "createdById": number,
  "projectId": number,
  "assignees": Assignee [],
  "createdBy": User,
  "project": {
    "id": number,
    "name": string,
    "description": string,
    "startDate": string,
    "endDate": string,
    "status": string,
    "createdAt": string,
    "updatedAt": string
  }
  
}

export interface getGroupTaskRequest{
  groupId: number,
  token: string
}

export interface getProjectTaskRequest{
  projectId: number,
  token: string
}

export interface deleteTaskRequest {
  taskId: number,
  token: string
}

export interface addTaskRequest {
  data: {
    "title": string,
    "description": string,
    "dueDate": string,
    "priority": string,
    "status": string,
    "assigneeIds": number [],
    "projectId": number
  },
  token: string
}

export interface editTaskRequest {
  data: {
    "title": string,
    "description": string,
    "dueDate": string,
    "priority": string,
    "status": string,
    "assigneeIds": number [],
    "projectId": number
  },
  token: string,
  taskId: number
}



const taskApi = API.injectEndpoints({
  endpoints: (build) => ({
    getMyTask: build.mutation<Task[] | ErrorResponse, string>({
      query: (token) => ({
        url: "/tasks/me",
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    getGroupTask: build.mutation<Task[] | ErrorResponse, getGroupTaskRequest>({
      query: (request) => ({
        url: `/tasks/group/${request.groupId}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${request.token}`,
        },
      }),
    }),
    getProjectTask: build.mutation<Task[] | ErrorResponse, getProjectTaskRequest>({
      query: (request) => ({
        url: `/tasks/project/${request.projectId}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${request.token}`,
        },
      }),
    }),
    deleteTask: build.mutation<undefined | ErrorResponse, deleteTaskRequest>({
      query: (request) => ({
        url: `/tasks/${request.taskId}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${request.token}`,
        },
      }),
    }),
    addTask: build.mutation<Task | ErrorResponse, addTaskRequest>({
      query: (request) => ({
        url: `/tasks`,
        method: "POST",
        body: request.data,
        headers: {
          Authorization: `Bearer ${request.token}`,
        },
      }),
    }),
    editTask: build.mutation<Task | ErrorResponse, editTaskRequest>({
      query: (request) => ({
        url: `/tasks/${request.taskId}`,
        method: "PATCH",
        body: request.data,
        headers: {
          Authorization: `Bearer ${request.token}`,
        },
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetMyTaskMutation,
  useGetGroupTaskMutation,
  useGetProjectTaskMutation,
  useDeleteTaskMutation,
  useAddTaskMutation,
  useEditTaskMutation
} = taskApi;
