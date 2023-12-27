import { applyMiddleware, combineReducers, legacy_createStore } from "redux";
import { TasksActionsType, tasksReducer } from "./tasks-reducer";
import { TodolistsActionsType, todolistsReducer } from "./todolists-reducer";
import { ThunkDispatch, thunk } from "redux-thunk";
import { useDispatch } from "react-redux";

const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer
})

export const store = legacy_createStore(rootReducer, applyMiddleware(thunk))

export type AppRootStateType = ReturnType<typeof rootReducer>

type AppActionsType = TodolistsActionsType | TasksActionsType

export type ThunkDispatchType = ThunkDispatch<AppRootStateType, unknown, AppActionsType>

export const useAppDispatch = useDispatch<ThunkDispatchType>