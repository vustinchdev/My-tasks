import { AddTodolistACType, RemoveTodolistACType, SetTodolistsACType } from "./todolists-reducer";
import { TaskPriorities, TaskStatuses, TaskType, UpdateTaskModelType, todolistAPI } from "../../api/todolist-api";
import { Dispatch } from "redux";
import { TasksStateType } from "../../app/App";
import { AppRootStateType } from "../../app/store";


const initialState: TasksStateType = {}

export const tasksReducer = (state = initialState, action: TasksActionsType): TasksStateType => {
    switch (action.type) {
        case 'REMOVE-TASK':
            return { ...state, [action.todolistId]: state[action.todolistId].filter(t => t.id !== action.taskId) }
        case 'ADD-TASK':
            return { ...state, [action.todolistId]: [action.task, ...state[action.todolistId]] }
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
            return { ...state, [action.todolistId]: action.tasks }
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
export const updateTaskTC = (todolistId: string, taskId: string, domainModel: UpdateDomainTaskModelType) =>
    (dispatch: Dispatch, getState: () => AppRootStateType) => {
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

export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}
export type TasksActionsType =
    | ReturnType<typeof removeTaskAC>
    | ReturnType<typeof addTaskAC>
    | ReturnType<typeof updateTaskAC>
    | AddTodolistACType
    | RemoveTodolistACType
    | SetTodolistsACType
    | ReturnType<typeof setTasksAC>