import { AnyAction, applyMiddleware, combineReducers, legacy_createStore } from "redux";
import { ThunkDispatch, thunk } from "redux-thunk";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { tasksReducer } from "../features/TodolistsList/tasks-reducer";
import { todolistsReducer } from "../features/TodolistsList/todolists-reducer";
import { appReducer } from "./app-reducer";
import { authReducer } from "../features/Login/auth-reducer";

const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer,
    auth: authReducer
})

export const store = legacy_createStore(rootReducer, applyMiddleware(thunk))

export type AppRootStateType = ReturnType<typeof rootReducer>
export type ThunkDispatchType = ThunkDispatch<AppRootStateType, unknown, AnyAction>

export const useAppDispatch = useDispatch<ThunkDispatchType>
export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector