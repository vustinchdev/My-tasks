import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { authAPI } from "api/auth-api"
import { authActions } from "features/Login/authSlice"
import { ResultCode } from "features/TodolistsList/tasksSlice"
import { Dispatch } from "redux"
import { handleServerAppError, handleServerNetworkError } from "utils/error-utils"

const slice = createSlice({
  name: "app",
  initialState: {
    status: "idle" as RequestStatusType,
    error: null as null | string,
    isInitialized: false,
  },
  reducers: {
    setStatus: (state, action: PayloadAction<{ status: RequestStatusType }>) => {
      state.status = action.payload.status
    },
    setError: (state, action: PayloadAction<{ error: null | string }>) => {
      state.error = action.payload.error
    },
    setAppInitialized: (state, action: PayloadAction<{ isInitialized: boolean }>) => {
      state.isInitialized = action.payload.isInitialized
    },
  },
})

export const initializeAppTC = () => (dispatch: Dispatch) => {
  authAPI
    .me()
    .then((res) => {
      if (res.data.resultCode === ResultCode.SUCCEEDED) {
        dispatch(authActions.setIsLoggedIn({ isLoggedIn: true }))
      } else {
        handleServerAppError(dispatch, res.data)
      }
    })
    .catch((e) => {
      handleServerNetworkError(dispatch, e)
    })
    .finally(() => dispatch(appActions.setAppInitialized({ isInitialized: true })))
}

export const appActions = slice.actions
export const appReducer = slice.reducer

export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed"
export type AppState = ReturnType<typeof slice.getInitialState>
