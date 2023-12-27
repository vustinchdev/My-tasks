import { TasksStateType } from "../components/App/App";
import { AddTodolistACType, RemoveTodolistACType, SetTodolistsACType } from "./todolists-reducer";
import { TaskPriorities, TaskStatuses, TaskType, UpdateTaskModelType, todolistAPI } from "../api/todolist-api";
import { Dispatch } from "redux";
import { AppRootStateType } from "./store";

export type TasksActionsType = RemoveTaskACType | AddTaskACType | UpdateTaskACType
    | AddTodolistACType | RemoveTodolistACType | SetTodolistsACType | SetTasksACType

const initialState: TasksStateType = {}

export const tasksReducer = (state = initialState, action: TasksActionsType): TasksStateType => {
    switch (action.type) {
        case 'REMOVE-TASK':
            return {
                ...state,
                [action.payload.todolistId]: state[action.payload.todolistId]
                    .filter(t => t.id !== action.payload.taskId)
            }
        case 'ADD-TASK': {
            return {
                ...state,
                [action.payload.todolistId]: [action.payload.task, ...state[action.payload.todolistId]]
            }
        }
        case 'UPDATE-TASK':
            return {
                ...state,
                [action.payload.todolistId]: state[action.payload.todolistId]
                    .map(t => t.id === action.payload.taskId ? { ...t, ...action.payload.model } : t)
            }
        case 'ADD-TODOLIST':
            return {
                ...state,
                [action.payload.todolist.id]: []
            }
        case 'REMOVE-TODOLIST':
            let copyState = { ...state }
            delete copyState[action.payload.id]
            return copyState
        case 'SET-TODOLISTS': {
            const copyState = { ...state }
            action.payload.todolists.forEach(tl => {
                copyState[tl.id] = []
            })
            return copyState
        }
        case 'SET-TASKS': {
            const copyState = { ...state }
            copyState[action.payload.todolistId] = action.payload.tasks
            return copyState
        }

        default: return state
    }
}

type RemoveTaskACType = ReturnType<typeof removeTaskAC>

export const removeTaskAC = (todolistId: string, taskId: string) => {
    return {
        type: 'REMOVE-TASK',
        payload: {
            todolistId,
            taskId
        }
    } as const
}

type AddTaskACType = ReturnType<typeof addTaskAC>

export const addTaskAC = (todolistId: string, task: TaskType) => {
    return {
        type: 'ADD-TASK',
        payload: {
            todolistId,
            task
        }
    } as const
}

type UpdateTaskACType = ReturnType<typeof updateTaskAC>

export const updateTaskAC = (todolistId: string, taskId: string, model: UpdateDomainTaskModelType) => {
    return {
        type: 'UPDATE-TASK',
        payload: {
            todolistId,
            taskId,
            model
        }
    } as const
}

type SetTasksACType = ReturnType<typeof setTasksAC>

export const setTasksAC = (todolistId: string, tasks: TaskType[]) => {
    return {
        type: 'SET-TASKS',
        payload: {
            todolistId,
            tasks
        }
    } as const
}

export const setTasksTC = (todolistId: string) => (dispatch: Dispatch) => {
    todolistAPI.getTasks(todolistId)
        .then(res => dispatch(setTasksAC(todolistId, res.data.items)))
}

export const removeTaskTC = (todolistId: string, taskId: string) => (dispatch: Dispatch) => {
    todolistAPI.deleteTask(todolistId, taskId)
        .then(() => dispatch(removeTaskAC(todolistId, taskId)))
}

export const addTaskTC = (todolistId: string, title: string) => (dispatch: Dispatch) => {
    todolistAPI.addTask(todolistId, title)
        .then(res => dispatch(addTaskAC(todolistId, res.data.data.item)))
}

export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}

export const updateTaskTC = (todolistId: string, taskId: string, domainModel: UpdateDomainTaskModelType) => {
    return (dispatch: Dispatch, getState: () => AppRootStateType) => {

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
                .then(() => dispatch(updateTaskAC(todolistId, taskId, domainModel)))
        }
    }
}