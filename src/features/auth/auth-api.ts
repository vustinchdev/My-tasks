import { instance } from "common/api"
import { BaseResponse } from "common/types"

export const authAPI = {
  login(params: LoginParams) {
    return instance.post<BaseResponse<{ userId: number }>>("auth/login", params)
  },
  me() {
    return instance.get<BaseResponse<User>>("auth/me")
  },
  logout() {
    return instance.delete<BaseResponse>("auth/login")
  },
}

export type LoginParams = {
  email: string
  password: string
  rememberMe: boolean
  captcha?: string
}
export type User = {
  login: string
  email: string
  id: number
}
