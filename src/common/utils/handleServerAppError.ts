import { Dispatch } from "redux"
import { appActions } from "app/appSlice"
import { ResponseType } from "common/types/common.types"

export const handleServerAppError = <T>(dispatch: Dispatch, data: ResponseType<T>) => {
  if (data.messages.length) {
    dispatch(appActions.setError({ error: data.messages[0] }))
  } else {
    dispatch(appActions.setError({ error: "Some error" }))
  }
  dispatch(appActions.setStatus({ status: "failed" }))
}
