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
