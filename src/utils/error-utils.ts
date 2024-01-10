import { ResponseType } from "api/todolist-api"
import { setErrorAC, setStatusAC } from "app/app-reducer"
import { Dispatch } from "redux"

export const handleServerAppError = <T>(dispatch: Dispatch, data: ResponseType<T>) => {
  if (data.messages.length) {
    dispatch(setErrorAC(data.messages[0]))
  } else {
    dispatch(setErrorAC("Some error"))
  }
  dispatch(setStatusAC("failed"))
}

export const handleServerNetworkError = (dispatch: Dispatch, message: string) => {
  dispatch(setErrorAC(message))
  dispatch(setStatusAC("failed"))
}
