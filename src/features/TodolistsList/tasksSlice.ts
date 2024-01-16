import { TaskType, todolistAPI, UpdateTaskModelType, TaskStatuses, TaskPriorities } from "api/todolist-api"
import { RequestStatusType, appActions } from "app/appSlice"
import { AppThunk } from "app/store"
import { handleServerAppError, handleServerNetworkError } from "utils/error-utils"
import { todolistsActions } from "./todolistsSlice"
import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { clearTasksAndTodolists } from "common/actions/common.actions"

const slice = createSlice({
  name: "tasks",
  initialState: {} as TasksStateType,
  reducers: {
    removeTask: (state, action: PayloadAction<{ todolistId: string; taskId: string }>) => {
      const tasks = state[action.payload.todolistId]
      const index = tasks.findIndex((task) => task.id === action.payload.taskId)
      if (index !== -1) {
        tasks.splice(index, 1)
      }
    },
    addTask: (state, action: PayloadAction<{ todolistId: string; task: TaskType }>) => {
      const tasks = state[action.payload.todolistId]
      tasks.unshift({ ...action.payload.task, entityTaskStatus: "idle" })
    },
    updateTask: (
      state,
      action: PayloadAction<{ todolistId: string; taskId: string; model: UpdateDomainTaskModelType }>,
    ) => {
      const tasks = state[action.payload.todolistId]
      const index = tasks.findIndex((task) => task.id === action.payload.taskId)
      if (index !== -1) {
        tasks[index] = { ...tasks[index], ...action.payload.model }
      }
    },
    changeEntityTaskStatus: (
      state,
      action: PayloadAction<{ todolistId: string; taskId: string; entityTaskStatus: RequestStatusType }>,
    ) => {
      const tasks = state[action.payload.todolistId]
      const index = tasks.findIndex((task) => task.id === action.payload.taskId)
      if (index !== -1) {
        tasks[index].entityTaskStatus = action.payload.entityTaskStatus
      }
    },
    setTasks: (state, action: PayloadAction<{ todolistId: string; tasks: TaskType[] }>) => {
      state[action.payload.todolistId] = action.payload.tasks.map((t) => ({ ...t, entityTaskStatus: "idle" }))
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(todolistsActions.addTodolist, (state, action) => {
        state[action.payload.todolist.id] = []
      })
      .addCase(todolistsActions.removeTodolist, (state, action) => {
        delete state[action.payload.id]
      })
      .addCase(todolistsActions.setTodolists, (state, action) => {
        action.payload.todolists.forEach((tl) => {
          state[tl.id] = []
        })
      })
      .addCase(clearTasksAndTodolists.type, () => {
        return {}
      })
  },
})

export const setTasksTC =
  (todolistId: string): AppThunk =>
  (dispatch) => {
    dispatch(appActions.setStatus({ status: "loading" }))
    todolistAPI.getTasks(todolistId).then((res) => {
      dispatch(tasksActions.setTasks({ todolistId, tasks: res.data.items }))
      dispatch(appActions.setStatus({ status: "succeeded" }))
    })
  }
export const removeTaskTC =
  (todolistId: string, taskId: string): AppThunk =>
  (dispatch) => {
    dispatch(appActions.setStatus({ status: "loading" }))
    dispatch(tasksActions.changeEntityTaskStatus({ todolistId, taskId, entityTaskStatus: "loading" }))
    todolistAPI
      .deleteTask(todolistId, taskId)
      .then((res) => {
        if (res.data.resultCode === ResultCode.SUCCEEDED) {
          dispatch(tasksActions.removeTask({ todolistId, taskId }))
          dispatch(appActions.setStatus({ status: "succeeded" }))
        } else {
          handleServerAppError(dispatch, res.data)
        }
      })
      .catch((e) => {
        handleServerNetworkError(dispatch, e)
      })
  }
export const addTaskTC =
  (todolistId: string, title: string): AppThunk =>
  (dispatch) => {
    dispatch(appActions.setStatus({ status: "loading" }))
    todolistAPI
      .addTask(todolistId, title)
      .then((res) => {
        if (res.data.resultCode === ResultCode.SUCCEEDED) {
          dispatch(tasksActions.addTask({ todolistId, task: res.data.data.item }))
          dispatch(appActions.setStatus({ status: "succeeded" }))
        } else {
          handleServerAppError(dispatch, res.data)
        }
      })
      .catch((e) => {
        handleServerNetworkError(dispatch, e)
      })
  }
export const updateTaskTC =
  (todolistId: string, taskId: string, domainModel: UpdateDomainTaskModelType): AppThunk =>
  (dispatch, getState) => {
    dispatch(appActions.setStatus({ status: "loading" }))
    const state = getState()
    const task = state.tasks[todolistId].find((t) => t.id === taskId)
    if (task) {
      const apiModel: UpdateTaskModelType = {
        deadline: task.deadline,
        description: task.description,
        priority: task.priority,
        startDate: task.startDate,
        title: task.title,
        status: task.status,
        ...domainModel,
      }
      todolistAPI
        .updateTask(todolistId, taskId, apiModel)
        .then((res) => {
          if (res.data.resultCode === ResultCode.SUCCEEDED) {
            dispatch(tasksActions.updateTask({ todolistId, taskId, model: domainModel }))
            dispatch(appActions.setStatus({ status: "succeeded" }))
          } else {
            handleServerAppError<{ item: TaskType }>(dispatch, res.data)
          }
        })
        .catch((e) => {
          handleServerNetworkError(dispatch, e)
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
  ERROR_CAPTCHA = 10,
}
export type TaskDomainType = TaskType & {
  entityTaskStatus: RequestStatusType
}

export const tasksActions = slice.actions
export const tasksReducer = slice.reducer
