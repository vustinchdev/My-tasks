import { applyMiddleware, combineReducers, legacy_createStore } from "redux";

import { ThunkDispatch, thunk } from "redux-thunk";
import { useDispatch } from "react-redux";
import { tasksReducer, TasksActionsType } from "../features/TodolistsList/tasks-reducer";
import { todolistsReducer, TodolistsActionsType } from "../features/TodolistsList/todolists-reducer";

const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer
})

export const store = legacy_createStore(rootReducer, applyMiddleware(thunk))

export type AppRootStateType = ReturnType<typeof rootReducer>

type AppActionsType = TodolistsActionsType | TasksActionsType

export type ThunkDispatchType = ThunkDispatch<AppRootStateType, unknown, AppActionsType>

export const useAppDispatch = useDispatch<ThunkDispatchType>