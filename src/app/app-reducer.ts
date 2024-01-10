import { authAPI } from "api/auth-api"
import { setIsLoggedInAC } from "features/Login/auth-reducer"
import { ResultCode } from "features/TodolistsList/tasks-reducer"
import { Dispatch } from "redux"
import { handleServerAppError, handleServerNetworkError } from "utils/error-utils"

export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed"

const initialState = {
  status: "idle" as RequestStatusType,
  error: null as null | string,
  isInitialized: false as boolean,
}

export type InitialStateType = typeof initialState

export const appReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
  switch (action.type) {
    case "APP/SET-STATUS":
      return { ...state, status: action.status }
    case "APP/SET-ERROR":
      return { ...state, error: action.error }
    case "APP/SET-APP-INITIALIZED":
      return { ...state, isInitialized: action.isInitialized }
    default:
      return state
  }
}

export const setStatusAC = (status: RequestStatusType) => ({ type: "APP/SET-STATUS", status }) as const
export const setErrorAC = (error: null | string) => ({ type: "APP/SET-ERROR", error }) as const
export const setAppInitialized = (isInitialized: boolean) =>
  ({ type: "APP/SET-APP-INITIALIZED", isInitialized }) as const

export const initializeAppTC = () => (dispatch: Dispatch) => {
  authAPI
    .me()
    .then((res) => {
      if (res.data.resultCode === ResultCode.SUCCEEDED) {
        dispatch(setIsLoggedInAC(true))
      } else {
        handleServerAppError(dispatch, res.data)
      }
    })
    .catch((e) => {
      handleServerNetworkError(dispatch, e)
    })
    .finally(() => dispatch(setAppInitialized(true)))
}

export type SetStatusACType = ReturnType<typeof setStatusAC>
export type SetErrorACType = ReturnType<typeof setErrorAC>
type ActionsType = SetStatusACType | SetErrorACType | ReturnType<typeof setAppInitialized>
