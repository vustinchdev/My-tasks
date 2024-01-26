import { instance } from "common/api"
import { TaskStatuses, TaskPriorities } from "common/enums"
import { BaseResponse } from "common/types"

export const todolistAPI = {
  getTodolists() {
    return instance.get<Todolist[]>("todo-lists")
  },
  addTodolist(title: string) {
    return instance.post<BaseResponse<{ item: Todolist }>>("todo-lists", { title })
  },
  deleteTodolist(todolistId: string) {
    return instance.delete<BaseResponse>(`todo-lists/${todolistId}`)
  },
  updateTodolist(arg: UpdateTodolistTitleArg) {
    return instance.put<BaseResponse>(`todo-lists/${arg.id}`, { title: arg.title })
  },
  getTasks(todolistId: string) {
    return instance.get<GetTasksResponse>(`todo-lists/${todolistId}/tasks`)
  },
  addTask(arg: AddTaskArgs) {
    return instance.post<BaseResponse<{ item: Task }>>(`todo-lists/${arg.todolistId}/tasks`, {
      title: arg.title,
    })
  },
  deleteTask(arg: RemoveTaskArgs) {
    return instance.delete<BaseResponse>(`todo-lists/${arg.todolistId}/tasks/${arg.taskId}`)
  },
  updateTask(todolistId: string, taskId: string, model: UpdateTaskModel) {
    return instance.put<BaseResponse<{ item: Task }>>(`todo-lists/${todolistId}/tasks/${taskId}`, model)
  },
}

export type Todolist = {
  id: string
  title: string
  addedDate: string
  order: number
}
export type Task = {
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
  items: Task[]
  totalCount: number
  error: string | null
}
export type UpdateTaskModel = {
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
