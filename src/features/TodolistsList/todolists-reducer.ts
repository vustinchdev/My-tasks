import { TodolistType, todolistAPI } from '../../api/todolist-api';
import { Dispatch } from 'redux';
import { RequestStatusType, SetStatusACType, setStatusAC } from '../../app/app-reducer';
import { ResultCode } from './tasks-reducer';
import { handleServerAppError, handleServerNetworkError } from '../../utils/error-utils';

const initialState: TodolistDomainType[] = []

export const todolistsReducer = (state: TodolistDomainType[] = initialState, action: TodolistsActionsType): TodolistDomainType[] => {
    switch (action.type) {
        case 'REMOVE-TODOLIST':
            return state.filter(tl => tl.id !== action.id)
        case 'ADD-TODOLIST':
            return [{ ...action.todolist, filter: 'all', entityStatus: 'idle' }, ...state]
        case 'CHANGE-TODOLIST-TITLE':
            return state.map(tl => tl.id === action.id ? { ...tl, title: action.title } : tl)
        case 'CHANGE-TODOLIST-FILTER':
            return state.map(tl => tl.id === action.id ? { ...tl, filter: action.filter } : tl)
        case 'SET-TODOLISTS':
            return action.todolists.map(tl => ({ ...tl, filter: 'all', entityStatus: 'idle' }))
        case 'CHANGE-ENTITY-STATUS':
            return state.map(tl => tl.id === action.todolistId ? { ...tl, entityStatus: action.entityStatus } : tl)
        default: return state
    }
}

export const removeTodolistAC = (id: string) => ({ type: 'REMOVE-TODOLIST', id } as const)
export const addTodolistAC = (todolist: TodolistType) => ({ type: 'ADD-TODOLIST', todolist } as const)
export const changeTodolistTitleAC = (id: string, title: string) => ({ type: 'CHANGE-TODOLIST-TITLE', id, title } as const)
export const changeTodolistFilterAC = (id: string, filter: FilterValuesType) => ({ type: 'CHANGE-TODOLIST-FILTER', id, filter } as const)
export const setTodolistsAC = (todolists: TodolistType[]) => ({ type: 'SET-TODOLISTS', todolists } as const)
export const changeEntityStatusAC = (todolistId: string, entityStatus: RequestStatusType) =>
    ({ type: 'CHANGE-ENTITY-STATUS', todolistId, entityStatus } as const)

export const setTodolistsTC = () => (dispatch: Dispatch) => {
    dispatch(setStatusAC('loading'))
    todolistAPI.getTodolists()
        .then(res => dispatch(setTodolistsAC(res.data)))
    dispatch(setStatusAC('succeeded'))
}
export const addTodolistTC = (title: string) => (dispatch: Dispatch) => {
    dispatch(setStatusAC('loading'))
    todolistAPI.addTodolist(title)
        .then(res => {
            if (res.data.resultCode === ResultCode.SUCCEEDED) {
                dispatch(addTodolistAC(res.data.data.item))
                dispatch(setStatusAC('succeeded'))
            } else {
                handleServerAppError(dispatch, res.data)
            }
        })
        .catch((e) => {
            handleServerNetworkError(dispatch, e.message)
        })
}
export const removeTodolistTC = (todolistId: string) => (dispatch: Dispatch) => {
    dispatch(setStatusAC('loading'))
    dispatch(changeEntityStatusAC(todolistId, 'loading'))
    todolistAPI.deleteTodolist(todolistId)
        .then((res) => {
            if (res.data.resultCode === ResultCode.SUCCEEDED) {
                dispatch(removeTodolistAC(todolistId))
                dispatch(setStatusAC('succeeded'))
            } else {
                handleServerAppError(dispatch, res.data)
            }
        })
        .catch((e) => {
            handleServerNetworkError(dispatch, e.message)
        })
}
export const changeTodolistTitleTC = (todolistId: string, title: string) => (dispatch: Dispatch) => {
    dispatch(setStatusAC('loading'))
    todolistAPI.updateTodolist(todolistId, title)
        .then((res) => {
            if (res.data.resultCode === ResultCode.SUCCEEDED) {
                dispatch(changeTodolistTitleAC(todolistId, title))
                dispatch(setStatusAC('succeeded'))
            } else {
                handleServerAppError(dispatch, res.data)
            }
        })
        .catch((e) => {
            handleServerNetworkError(dispatch, e.message)
        })
}

export type AddTodolistACType = ReturnType<typeof addTodolistAC>
export type RemoveTodolistACType = ReturnType<typeof removeTodolistAC>
export type SetTodolistsACType = ReturnType<typeof setTodolistsAC>
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}
export type FilterValuesType = 'all' | 'completed' | 'active'
export type TodolistsActionsType =
    | RemoveTodolistACType
    | AddTodolistACType
    | ReturnType<typeof changeTodolistTitleAC>
    | ReturnType<typeof changeTodolistFilterAC>
    | SetTodolistsACType
    | SetStatusACType
    | ReturnType<typeof changeEntityStatusAC>