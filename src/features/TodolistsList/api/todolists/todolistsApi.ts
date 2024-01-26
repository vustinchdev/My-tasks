import { instance } from "common/api"
import { BaseResponse } from "common/types"
import { Todolist, UpdateTodolistTitleArg } from "./todolistsApi.types"

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
}
