import { ResponseType } from "api/todolist-api"
import { appActions } from "app/appSlice"
import { Dispatch } from "redux"

export const handleServerAppError = <T>(dispatch: Dispatch, data: ResponseType<T>) => {
  if (data.messages.length) {
    dispatch(appActions.setError({ error: data.messages[0] }))
  } else {
    dispatch(appActions.setError({ error: "Some error" }))
  }
  dispatch(appActions.setStatus({ status: "failed" }))
}

export const handleServerNetworkError = (dispatch: Dispatch, message: string) => {
  dispatch(appActions.setError({ error: message }))
  dispatch(appActions.setStatus({ status: "failed" }))
}
