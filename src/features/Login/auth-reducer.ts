import { LoginParams, authAPI } from "api/auth-api"
import { setStatusAC, SetStatusACType, SetErrorACType } from "app/app-reducer"
import { ResultCode } from "features/TodolistsList/tasks-reducer"
import { clearTodolistsDataAC, ClearTodolistsDataACType } from "features/TodolistsList/todolists-reducer"
import { Dispatch } from "redux"
import { handleServerAppError, handleServerNetworkError } from "utils/error-utils"

const initialState = {
  isLoggedIn: false,
}
type InitialStateType = typeof initialState

export const authReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
  switch (action.type) {
    case "login/SET-IS-LOGGED-IN":
      return { ...state, isLoggedIn: action.isLoggedIn }
    default:
      return state
  }
}

export const setIsLoggedInAC = (isLoggedIn: boolean) => ({ type: "login/SET-IS-LOGGED-IN", isLoggedIn }) as const

export const loginTC = (data: LoginParams) => (dispatch: Dispatch<ActionsType>) => {
  dispatch(setStatusAC("loading"))
  authAPI
    .login(data)
    .then((res) => {
      if (res.data.resultCode === ResultCode.SUCCEEDED) {
        dispatch(setIsLoggedInAC(true))
        dispatch(setStatusAC("succeeded"))
      } else {
        handleServerAppError(dispatch, res.data)
      }
    })
    .catch((e) => {
      handleServerNetworkError(dispatch, e)
    })
}

export const logoutTC = () => (dispatch: Dispatch<ActionsType>) => {
  dispatch(setStatusAC("loading"))
  authAPI
    .logout()
    .then((res) => {
      if (res.data.resultCode === 0) {
        dispatch(setIsLoggedInAC(false))
        dispatch(setStatusAC("succeeded"))
        dispatch(clearTodolistsDataAC())
      } else {
        handleServerAppError(dispatch, res.data)
      }
    })
    .catch((e) => {
      handleServerNetworkError(dispatch, e)
    })
}

// types
type ActionsType = ReturnType<typeof setIsLoggedInAC> | SetStatusACType | SetErrorACType | ClearTodolistsDataACType
