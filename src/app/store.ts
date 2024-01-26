import { ThunkDispatch } from "redux-thunk"
import { appReducer } from "./appSlice"
import { authReducer } from "features/auth/model/authSlice"
import { tasksReducer } from "features/TodolistsList/model/tasks/tasksSlice"
import { todolistsReducer } from "features/TodolistsList/model/todolists/todolistsSlice"
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
