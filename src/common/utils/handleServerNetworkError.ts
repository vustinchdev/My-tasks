import { appActions } from "app/appSlice"
import { ThunkDispatchType } from "app/store"
import axios from "axios"

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
