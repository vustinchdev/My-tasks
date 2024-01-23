import { AppRootStateType, ThunkDispatchType } from "app/store"
import { BaseThunkAPI } from "@reduxjs/toolkit/dist/createAsyncThunk"
import { BaseResponseType } from "common/types"
import { appActions } from "app/appSlice"
import { handleServerNetworkError } from "./handleServerNetworkError"

export const thunkTryCatch = async <T>(
  thunkAPI: BaseThunkAPI<AppRootStateType, unknown, ThunkDispatchType, null | BaseResponseType>,
  logic: () => Promise<T>,
): Promise<T | ReturnType<typeof thunkAPI.rejectWithValue>> => {
  const { dispatch, rejectWithValue } = thunkAPI
  dispatch(appActions.setStatus({ status: "loading" }))
  try {
    return await logic()
  } catch (e) {
    handleServerNetworkError(dispatch, e)
    return rejectWithValue(null)
  } finally {
    dispatch(appActions.setStatus({ status: "idle" }))
  }
}
