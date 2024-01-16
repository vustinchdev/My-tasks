import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { LoginParams, authAPI } from "api/auth-api"
import { appActions } from "app/appSlice"
import { AppThunk } from "app/store"
import { clearTasksAndTodolists } from "common/actions/common.actions"
import { ResultCode } from "features/TodolistsList/tasksSlice"
import { handleServerAppError, handleServerNetworkError } from "utils/error-utils"

const slice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
  },
  reducers: {
    setIsLoggedIn: (state, action: PayloadAction<{ isLoggedIn: boolean }>) => {
      state.isLoggedIn = action.payload.isLoggedIn
    },
  },
})

export const loginTC =
  (data: LoginParams): AppThunk =>
  (dispatch) => {
    dispatch(appActions.setStatus({ status: "loading" }))
    authAPI
      .login(data)
      .then((res) => {
        if (res.data.resultCode === ResultCode.SUCCEEDED) {
          dispatch(authActions.setIsLoggedIn({ isLoggedIn: true }))
          dispatch(appActions.setStatus({ status: "succeeded" }))
        } else {
          handleServerAppError(dispatch, res.data)
        }
      })
      .catch((e) => {
        handleServerNetworkError(dispatch, e)
      })
  }

export const logoutTC = (): AppThunk => (dispatch) => {
  dispatch(appActions.setStatus({ status: "loading" }))
  authAPI
    .logout()
    .then((res) => {
      if (res.data.resultCode === 0) {
        dispatch(authActions.setIsLoggedIn({ isLoggedIn: false }))
        dispatch(appActions.setStatus({ status: "succeeded" }))
        dispatch(clearTasksAndTodolists())
      } else {
        handleServerAppError(dispatch, res.data)
      }
    })
    .catch((e) => {
      handleServerNetworkError(dispatch, e)
    })
}

export const authActions = slice.actions
export const authReducer = slice.reducer
