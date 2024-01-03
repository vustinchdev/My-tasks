import { AddTodolistACType, RemoveTodolistACType, SetTodolistsACType } from "./todolists-reducer";
import { TaskPriorities, TaskStatuses, TaskType, UpdateTaskModelType, todolistAPI } from "../../api/todolist-api";
import { Dispatch } from "redux";
import { AppRootStateType } from "../../app/store";
import { RequestStatusType, SetErrorACType, SetStatusACType, setStatusAC } from "../../app/app-reducer";
import { handleServerAppError, handleServerNetworkError } from "../../utils/error-utils";


const initialState: TasksStateType = {}

export const tasksReducer = (state = initialState, action: TasksActionsType): TasksStateType => {
    switch (action.type) {
        case 'REMOVE-TASK':
            return { ...state, [action.todolistId]: state[action.todolistId].filter(t => t.id !== action.taskId) }
        case 'ADD-TASK':
            return { ...state, [action.todolistId]: [{ ...action.task, entityTaskStatus: 'idle' }, ...state[action.todolistId]] }
        case 'UPDATE-TASK':
            return {
                ...state,
                [action.todolistId]: state[action.todolistId]
                    .map(t => t.id === action.taskId ? { ...t, ...action.model } : t)
            }
        case 'ADD-TODOLIST':
            return {
                ...state, [action.todolist.id]: []
            }
        case 'REMOVE-TODOLIST':
            let copyState = { ...state }
            delete copyState[action.id]
            return copyState
        case 'SET-TODOLISTS': {
            const copyState = { ...state }
            action.todolists.forEach(tl => {
                copyState[tl.id] = []
            })
            return copyState
        }
        case 'SET-TASKS': {
            return { ...state, [action.todolistId]: action.tasks.map(t => ({ ...t, entityTaskStatus: 'idle' })) }
        }
        case 'CHANGE-ENTITY-TASK-STATUS':
            return {
                ...state,
                [action.todolistId]: state[action.todolistId]
                    .map(t => t.id === action.taskId ? { ...t, entityTaskStatus: action.entityTaskStatus } : t)
            }
        default: return state
    }
}

export const removeTaskAC = (todolistId: string, taskId: string) =>
    ({ type: 'REMOVE-TASK', todolistId, taskId } as const)
export const addTaskAC = (todolistId: string, task: TaskType) =>
    ({ type: 'ADD-TASK', todolistId, task } as const)
export const updateTaskAC = (todolistId: string, taskId: string, model: UpdateDomainTaskModelType) =>
    ({ type: 'UPDATE-TASK', todolistId, taskId, model } as const)
export const setTasksAC = (todolistId: string, tasks: TaskType[]) =>
    ({ type: 'SET-TASKS', todolistId, tasks } as const)
export const changeEntityTaskStatusAC = (todolistId: string, taskId: string, entityTaskStatus: RequestStatusType) =>
    ({ type: 'CHANGE-ENTITY-TASK-STATUS', todolistId, taskId, entityTaskStatus } as const)

export const setTasksTC = (todolistId: string) => (dispatch: Dispatch) => {
    dispatch(setStatusAC('loading'))
    todolistAPI.getTasks(todolistId)
        .then(res => {
            dispatch(setTasksAC(todolistId, res.data.items))
            dispatch(setStatusAC('succeeded'))
        })
}
export const removeTaskTC = (todolistId: string, taskId: string) => (dispatch: Dispatch) => {
    dispatch(setStatusAC('loading'))
    dispatch(changeEntityTaskStatusAC(todolistId, taskId, 'loading'))
    todolistAPI.deleteTask(todolistId, taskId)
        .then((res) => {
            if (res.data.resultCode === ResultCode.SUCCEEDED) {
                dispatch(removeTaskAC(todolistId, taskId))
                dispatch(setStatusAC('succeeded'))
            } else {
                handleServerAppError(dispatch, res.data)
            }
        })
        .catch((e) => {
            handleServerNetworkError(dispatch, e.message)
        })
}
export const addTaskTC = (todolistId: string, title: string) => (dispatch: Dispatch) => {
    dispatch(setStatusAC('loading'))
    todolistAPI.addTask(todolistId, title)
        .then((res) => {
            if (res.data.resultCode === ResultCode.SUCCEEDED) {
                dispatch(addTaskAC(todolistId, res.data.data.item))
                dispatch(setStatusAC('succeeded'))
            } else {
                handleServerAppError(dispatch, res.data)
            }
        })
        .catch((e) => {
            handleServerNetworkError(dispatch, e.message)
        })
}
export const updateTaskTC = (todolistId: string, taskId: string, domainModel: UpdateDomainTaskModelType) =>
    (dispatch: Dispatch, getState: () => AppRootStateType) => {
        dispatch(setStatusAC('loading'))
        const state = getState()
        const task = state.tasks[todolistId].find(t => t.id === taskId)
        if (task) {
            const apiModel: UpdateTaskModelType = {
                deadline: task.deadline,
                description: task.description,
                priority: task.priority,
                startDate: task.startDate,
                title: task.title,
                status: task.status,
                ...domainModel
            }
            todolistAPI.updateTask(todolistId, taskId, apiModel)
                .then((res) => {
                    if (res.data.resultCode === ResultCode.SUCCEEDED) {
                        dispatch(updateTaskAC(todolistId, taskId, domainModel))
                        dispatch(setStatusAC('succeeded'))
                    } else {
                        handleServerAppError<{ item: TaskType }>(dispatch, res.data)
                    }
                })
                .catch((e) => {
                    handleServerNetworkError(dispatch, e.message)
                })
        }
    }

export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}
export type TasksStateType = {
    [key: string]: TaskDomainType[]
}
export enum ResultCode {
    SUCCEEDED = 0,
    ERROR = 1,
    ERROR_CAPTCHA = 10
}
export type TaskDomainType = TaskType & {
    entityTaskStatus: RequestStatusType
}
export type TasksActionsType =
    | ReturnType<typeof removeTaskAC>
    | ReturnType<typeof addTaskAC>
    | ReturnType<typeof updateTaskAC>
    | AddTodolistACType
    | RemoveTodolistACType
    | SetTodolistsACType
    | ReturnType<typeof setTasksAC>
    | SetStatusACType
    | SetErrorACType
    | ReturnType<typeof changeEntityTaskStatusAC>