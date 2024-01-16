import { ThunkAction, ThunkDispatch } from "redux-thunk"
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux"
import { appReducer } from "./appSlice"
import { authReducer } from "features/Login/authSlice"
import { tasksReducer } from "features/TodolistsList/tasksSlice"
import { todolistsReducer } from "features/TodolistsList/todolistsSlice"
import { UnknownAction, configureStore } from "@reduxjs/toolkit"

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer,
    auth: authReducer,
  },
})

export type AppRootStateType = ReturnType<typeof store.getState>
export type ThunkDispatchType = ThunkDispatch<AppRootStateType, unknown, UnknownAction>
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, unknown, UnknownAction>

export const useAppDispatch = useDispatch<ThunkDispatchType>
export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector
