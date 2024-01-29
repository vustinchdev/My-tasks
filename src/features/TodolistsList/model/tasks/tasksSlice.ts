import { RequestStatus, appActions } from "app/appSlice"
import { todolistsThunks } from "../todolists/todolistsSlice"
import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { clearTasksAndTodolists } from "common/actions/commonActions"
import { createAppAsyncThunk } from "common/utils/createAppAsyncThunk"
import { ResultCode } from "common/enums"
import { Task, AddTaskArgs, UpdateTaskModel, RemoveTaskArgs } from "../../api/tasks/tasksApi.types"
import { tasksAPI } from "../../api/tasks/tasksApi"

const slice = createSlice({
  name: "tasks",
  initialState: {} as TasksState,
  reducers: {
    changeEntityTaskStatus: (
      state,
      action: PayloadAction<{ todolistId: string; taskId: string; entityTaskStatus: RequestStatus }>,
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

const setTasks = createAppAsyncThunk<{ todolistId: string; tasks: Task[] }, string>(
  `${slice.name}/setTasks`,
  async (todolistId, _) => {
    const res = await tasksAPI.getTasks(todolistId)
    return { todolistId, tasks: res.data.items }
  },
)
const addTask = createAppAsyncThunk<{ todolistId: string; task: Task }, AddTaskArgs>(
  `${slice.name}/addTask`,
  async (arg, { rejectWithValue }) => {
    const res = await tasksAPI.addTask(arg)
    if (res.data.resultCode === ResultCode.SUCCEEDED) {
      return { todolistId: arg.todolistId, task: res.data.data.item }
    } else {
      return rejectWithValue(res.data)
    }
  },
)
const updateTask = createAppAsyncThunk<ApdateTaskArg, ApdateTaskArg>(
  `${slice.name}/updateTask`,
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue, getState } = thunkAPI
    const state = getState()
    const task = state.tasks[arg.todolistId].find((t) => t.id === arg.taskId)
    if (!task) {
      dispatch(appActions.setError({ error: "Task not found in the state" }))
      return rejectWithValue(null)
    }
    const apiModel: UpdateTaskModel = {
      deadline: task.deadline,
      description: task.description,
      priority: task.priority,
      startDate: task.startDate,
      title: task.title,
      status: task.status,
      ...arg.domainModel,
    }
    const res = await tasksAPI.updateTask(arg.todolistId, arg.taskId, apiModel)
    if (res.data.resultCode === ResultCode.SUCCEEDED) {
      return arg
    } else {
      return rejectWithValue(res.data)
    }
  },
)
const removeTask = createAppAsyncThunk<RemoveTaskArgs, RemoveTaskArgs>(
  `${slice.name}/removeTask`,
  async (arg, { dispatch, rejectWithValue }) => {
    dispatch(
      tasksActions.changeEntityTaskStatus({
        todolistId: arg.todolistId,
        taskId: arg.taskId,
        entityTaskStatus: "loading",
      }),
    )
    const res = await tasksAPI.deleteTask(arg).finally(() =>
      dispatch(
        tasksActions.changeEntityTaskStatus({
          todolistId: arg.todolistId,
          taskId: arg.taskId,
          entityTaskStatus: "succeeded",
        }),
      ),
    )
    if (res.data.resultCode === ResultCode.SUCCEEDED) {
      return { todolistId: arg.todolistId, taskId: arg.taskId }
    } else {
      return rejectWithValue(res.data)
    }
  },
)

export type UpdateDomainTaskModel = Partial<UpdateTaskModel>
export type TasksState = Record<string, TaskDomain[]>
export type TaskDomain = Task & {
  entityTaskStatus: RequestStatus
}
type ApdateTaskArg = {
  todolistId: string
  taskId: string
  domainModel: UpdateDomainTaskModel
}

export const tasksActions = slice.actions
export const tasksReducer = slice.reducer
export const tasksThunks = { setTasks, addTask, updateTask, removeTask }
