import { ResponseType } from "api/todolist-api"
import { appActions } from "app/appSlice"
import { ThunkDispatchType } from "app/store"
import axios from "axios"
import { Dispatch } from "redux"

export const handleServerAppError = <T>(dispatch: Dispatch, data: ResponseType<T>) => {
  if (data.messages.length) {
    dispatch(appActions.setError({ error: data.messages[0] }))
  } else {
    dispatch(appActions.setError({ error: "Some error" }))
  }
  dispatch(appActions.setStatus({ status: "failed" }))
}

export const handleServerNetworkError = (dispatch: ThunkDispatchType, e: unknown): void => {
  let errorMessage = "Some error occurred"

  if (axios.isAxiosError(e)) {
    errorMessage = e.response?.data?.message || e?.message || errorMessage
  } else if (e instanceof Error) {
    errorMessage = `Native error: ${e.message}`
  } else {
    errorMessage = JSON.stringify(e)
  }

  dispatch(appActions.setError({ error: errorMessage }))
  dispatch(appActions.setStatus({ status: "failed" }))
}
