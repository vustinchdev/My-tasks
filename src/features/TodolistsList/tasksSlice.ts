import {
  TaskType,
  todolistAPI,
  UpdateTaskModelType,
  TaskStatuses,
  TaskPriorities,
  AddTaskArgs,
  RemoveTaskArgs,
} from "api/todolist-api"
import { RequestStatusType, appActions } from "app/appSlice"
import { handleServerAppError, handleServerNetworkError } from "utils/error-utils"
import { todolistsActions, todolistsThunks } from "./todolistsSlice"
import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { clearTasksAndTodolists } from "common/actions/common.actions"
import { createAppAsyncThunk } from "utils/createAppAsyncThunk"

const slice = createSlice({
  name: "tasks",
  initialState: {} as TasksStateType,
  reducers: {
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(todolistsThunks.addTodolist.fulfilled, (state, action) => {
        state[action.payload.todolist.id] = []
      })
      .addCase(todolistsThunks.removeTodolist.fulfilled, (state, action) => {
        delete state[action.payload.id]
      })
      .addCase(todolistsThunks.setTodolists.fulfilled, (state, action) => {
        action.payload.todolists.forEach((tl) => {
          state[tl.id] = []
        })
      })
      .addCase(clearTasksAndTodolists.type, () => {
        return {}
      })
      .addCase(setTasks.fulfilled, (state, action) => {
        state[action.payload.todolistId] = action.payload.tasks.map((t) => ({ ...t, entityTaskStatus: "idle" }))
      })
      .addCase(addTask.fulfilled, (state, action) => {
        const tasks = state[action.payload.todolistId]
        tasks.unshift({ ...action.payload.task, entityTaskStatus: "idle" })
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const tasks = state[action.payload.todolistId]
        const index = tasks.findIndex((task) => task.id === action.payload.taskId)
        if (index !== -1) {
          tasks[index] = { ...tasks[index], ...action.payload.domainModel }
        }
      })
      .addCase(removeTask.fulfilled, (state, action) => {
        const tasks = state[action.payload.todolistId]
        const index = tasks.findIndex((task) => task.id === action.payload.taskId)
        if (index !== -1) {
          tasks.splice(index, 1)
        }
      })
  },
})

const setTasks = createAppAsyncThunk<{ todolistId: string; tasks: TaskType[] }, string>(
  `${slice.name}/setTasks`,
  async (todolistId, thukAPI) => {
    const { dispatch, rejectWithValue } = thukAPI
    try {
      dispatch(appActions.setStatus({ status: "loading" }))
      const res = await todolistAPI.getTasks(todolistId)
      dispatch(appActions.setStatus({ status: "succeeded" }))
      return { todolistId, tasks: res.data.items }
    } catch (e) {
      handleServerNetworkError(dispatch, e)
      return rejectWithValue(null)
    }
  },
)
const addTask = createAppAsyncThunk<{ todolistId: string; task: TaskType }, AddTaskArgs>(
  `${slice.name}/addTask`,
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    try {
      dispatch(appActions.setStatus({ status: "loading" }))
      const res = await todolistAPI.addTask(arg)
      if (res.data.resultCode === ResultCode.SUCCEEDED) {
        dispatch(appActions.setStatus({ status: "succeeded" }))
        return { todolistId: arg.todolistId, task: res.data.data.item }
      } else {
        handleServerAppError(dispatch, res.data)
        return rejectWithValue(null)
      }
    } catch (e) {
      handleServerNetworkError(dispatch, e)
      return rejectWithValue(null)
    }
  },
)
const updateTask = createAppAsyncThunk<ApdateTaskArg, ApdateTaskArg>(
  `${slice.name}/updateTask`,
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue, getState } = thunkAPI
    try {
      dispatch(appActions.setStatus({ status: "loading" }))
      const state = getState()
      const task = state.tasks[arg.todolistId].find((t) => t.id === arg.taskId)
      if (!task) {
        console.warn("task not found in the state")
        return rejectWithValue(null)
      }
      const apiModel: UpdateTaskModelType = {
        deadline: task.deadline,
        description: task.description,
        priority: task.priority,
        startDate: task.startDate,
        title: task.title,
        status: task.status,
        ...arg.domainModel,
      }
      const res = await todolistAPI.updateTask(arg.todolistId, arg.taskId, apiModel)
      if (res.data.resultCode === ResultCode.SUCCEEDED) {
        dispatch(appActions.setStatus({ status: "succeeded" }))
        return arg
      } else {
        handleServerAppError<{ item: TaskType }>(dispatch, res.data)
        return rejectWithValue(null)
      }
    } catch (e) {
      handleServerNetworkError(dispatch, e)
      return rejectWithValue(null)
    }
  },
)
const removeTask = createAppAsyncThunk<RemoveTaskArgs, RemoveTaskArgs>(
  `${slice.name}/removeTask`,
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    try {
      dispatch(appActions.setStatus({ status: "loading" }))
      dispatch(
        tasksActions.changeEntityTaskStatus({
          todolistId: arg.todolistId,
          taskId: arg.taskId,
          entityTaskStatus: "loading",
        }),
      )
      const res = await todolistAPI.deleteTask(arg)
      if (res.data.resultCode === ResultCode.SUCCEEDED) {
        dispatch(appActions.setStatus({ status: "succeeded" }))
        return { todolistId: arg.todolistId, taskId: arg.taskId }
      } else {
        handleServerAppError(dispatch, res.data)
        return rejectWithValue(null)
      }
    } catch (e) {
      handleServerNetworkError(dispatch, e)
      return rejectWithValue(null)
    }
  },
)

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
type ApdateTaskArg = {
  todolistId: string
  taskId: string
  domainModel: UpdateDomainTaskModelType
}

export const tasksActions = slice.actions
export const tasksReducer = slice.reducer
export const tasksThunks = { setTasks, addTask, updateTask, removeTask }
