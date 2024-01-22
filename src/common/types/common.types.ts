export type ResponseType<T = {}> = {
  data: T
  messages: string[]
  fieldsErrors: string[]
  resultCode: number
}
