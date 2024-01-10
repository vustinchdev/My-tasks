import { instance, ResponseType } from "./todolist-api"

export const authAPI = {
  login(params: LoginParams) {
    return instance.post<ResponseType<{ userId: number }>>("auth/login", params)
  },
  me() {
    return instance.get<ResponseType<User>>("auth/me")
  },
  logout() {
    return instance.delete<ResponseType>("auth/login")
  },
}

export type LoginParams = {
  email: string
  password: string
  rememberMe?: boolean
}

export type User = {
  login: string
  email: string
  id: number
}
