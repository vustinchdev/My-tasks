import { instance } from "common/api"
import { BaseResponseType } from "common/types/common.types"

export const authAPI = {
  login(params: LoginParams) {
    return instance.post<BaseResponseType<{ userId: number }>>("auth/login", params)
  },
  me() {
    return instance.get<BaseResponseType<User>>("auth/me")
  },
  logout() {
    return instance.delete<BaseResponseType>("auth/login")
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
