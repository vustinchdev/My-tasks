import { instance } from "common/api"
import { TaskStatuses, TaskPriorities } from "common/enums"
import { BaseResponseType } from "common/types"

export const todolistAPI = {
  getTodolists() {
    return instance.get<TodolistType[]>("todo-lists")
  },
  addTodolist(title: string) {
    return instance.post<BaseResponseType<{ item: TodolistType }>>("todo-lists", { title })
  },
  deleteTodolist(todolistId: string) {
    return instance.delete<BaseResponseType>(`todo-lists/${todolistId}`)
  },
  updateTodolist(arg: UpdateTodolistTitleArg) {
    return instance.put<BaseResponseType>(`todo-lists/${arg.id}`, { title: arg.title })
  },
  getTasks(todolistId: string) {
    return instance.get<GetTasksResponse>(`todo-lists/${todolistId}/tasks`)
  },
  addTask(arg: AddTaskArgs) {
    return instance.post<BaseResponseType<{ item: TaskType }>>(`todo-lists/${arg.todolistId}/tasks`, {
      title: arg.title,
    })
  },
  deleteTask(arg: RemoveTaskArgs) {
    return instance.delete<BaseResponseType>(`todo-lists/${arg.todolistId}/tasks/${arg.taskId}`)
  },
  updateTask(todolistId: string, taskId: string, model: UpdateTaskModelType) {
    return instance.put<BaseResponseType<{ item: TaskType }>>(`todo-lists/${todolistId}/tasks/${taskId}`, model)
  },
}

export type TodolistType = {
  id: string
  title: string
  addedDate: string
  order: number
}
export type TaskType = {
  description: string
  title: string
  status: TaskStatuses
  priority: TaskPriorities
  startDate: string
  deadline: string
  id: string
  todoListId: string
  order: number
  addedDate: string
}
type GetTasksResponse = {
  items: TaskType[]
  totalCount: number
  error: string | null
}
export type UpdateTaskModelType = {
  title: string
  description: string
  status: TaskStatuses
  priority: TaskPriorities
  startDate: string
  deadline: string
}
export type AddTaskArgs = {
  todolistId: string
  title: string
}
export type RemoveTaskArgs = {
  todolistId: string
  taskId: string
}
export type UpdateTodolistTitleArg = {
  id: string
  title: string
}
