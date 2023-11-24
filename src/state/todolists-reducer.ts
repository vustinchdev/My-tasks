import { v1 } from 'uuid';
import { FilterValuesType, TodolistType } from "../App";

type TodolistsReducerType = RemoveTodolistACType | AddTodolistACType | ChangeTodolistTitleACType | changeTodolistFilterACType

const initialState: TodolistType[] = []

export const todolistsReducer = (state = initialState, action: TodolistsReducerType): TodolistType[] => {
    switch (action.type) {
        case 'REMOVE-TODOLIST':
            return state.filter(tl => tl.id !== action.payload.id)
        case 'ADD-TODOLIST':
            return [{ id: action.payload.todolistId, title: action.payload.title, filter: 'all' }, ...state]
        case 'CHANGE-TODOLIST-TITLE':
            return state.map(tl => tl.id === action.payload.id ? { ...tl, title: action.payload.title } : tl)
        case 'CHANGE-TODOLIST-FILTER':
            return state.map(tl => tl.id === action.payload.id ? { ...tl, filter: action.payload.filter } : tl)
        default: return state
    }
}

export type RemoveTodolistACType = ReturnType<typeof removeTodolistAC>

export const removeTodolistAC = (id: string) => {
    return {
        type: 'REMOVE-TODOLIST',
        payload: {
            id
        }
    } as const
}

export type AddTodolistACType = ReturnType<typeof addTodolistAC>

export const addTodolistAC = (title: string) => {
    return {
        type: 'ADD-TODOLIST',
        payload: {
            title,
            todolistId: v1()
        }
    } as const
}

type ChangeTodolistTitleACType = ReturnType<typeof changeTodolistTitleAC>

export const changeTodolistTitleAC = (id: string, title: string) => {
    return {
        type: 'CHANGE-TODOLIST-TITLE',
        payload: {
            id,
            title
        }
    } as const
}

type changeTodolistFilterACType = ReturnType<typeof changeTodolistFilterAC>

export const changeTodolistFilterAC = (id: string, filter: FilterValuesType) => {
    return {
        type: 'CHANGE-TODOLIST-FILTER',
        payload: {
            id,
            filter
        }
    } as const
}