import { ResultCode } from "./tasksSlice"
import { TodolistType, UpdateTodolistTitleArg, todolistAPI } from "api/todolist-api"
import { RequestStatusType, appActions } from "app/appSlice"
import { handleServerAppError, handleServerNetworkError } from "utils/error-utils"
import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { clearTasksAndTodolists } from "common/actions/common.actions"
import { createAppAsyncThunk } from "utils/createAppAsyncThunk"

const slice = createSlice({
  name: "todolists",
  initialState: [] as TodolistDomainType[],
  reducers: {
    changeTodolistFilter: (state, action: PayloadAction<{ id: string; filter: FilterValuesType }>) => {
      const todolist = state.find((todo) => todo.id === action.payload.id)
      if (todolist) {
        todolist.filter = action.payload.filter
      }
    },
    changeTodolistEntityStatus: (state, action: PayloadAction<{ id: string; entityStatus: RequestStatusType }>) => {
      const todolist = state.find((todo) => todo.id === action.payload.id)
      if (todolist) {
        todolist.entityStatus = action.payload.entityStatus
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(clearTasksAndTodolists.type, () => {
        return []
      })
      .addCase(setTodolists.fulfilled, (state, action) => {
        action.payload.todolists.forEach((tl) => {
          state.push({ ...tl, filter: "all", entityStatus: "idle" })
        })
      })
      .addCase(addTodolist.fulfilled, (state, action) => {
        state.unshift({ ...action.payload.todolist, filter: "all", entityStatus: "idle" })
      })
      .addCase(removeTodolist.fulfilled, (state, action) => {
        const index = state.findIndex((todo) => todo.id === action.payload.id)
        if (index !== -1) {
          state.splice(index, 1)
        }
      })
      .addCase(changeTodolistTitle.fulfilled, (state, action) => {
        const todolist = state.find((todo) => todo.id === action.payload.id)
        if (todolist) {
          todolist.title = action.payload.title
        }
      })
  },
})

const setTodolists = createAppAsyncThunk<{ todolists: TodolistType[] }, void>(
  `${slice.name}/setTodolists`,
  async (_, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    try {
      dispatch(appActions.setStatus({ status: "loading" }))
      const res = await todolistAPI.getTodolists()
      dispatch(appActions.setStatus({ status: "succeeded" }))
      return { todolists: res.data }
    } catch (e) {
      handleServerNetworkError(dispatch, e)
      return rejectWithValue(null)
    }
  },
)
const addTodolist = createAppAsyncThunk<{ todolist: TodolistType }, string>(
  `${slice.name}/addTodolist`,
  async (title, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    try {
      dispatch(appActions.setStatus({ status: "loading" }))
      const res = await todolistAPI.addTodolist(title)
      if (res.data.resultCode === ResultCode.SUCCEEDED) {
        dispatch(appActions.setStatus({ status: "succeeded" }))
        return { todolist: res.data.data.item }
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
const removeTodolist = createAppAsyncThunk<{ id: string }, string>(
  `${slice.name}/removeTodolist`,
  async (id, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    try {
      dispatch(appActions.setStatus({ status: "loading" }))
      dispatch(todolistsActions.changeTodolistEntityStatus({ id, entityStatus: "loading" }))
      const res = await todolistAPI.deleteTodolist(id)
      if (res.data.resultCode === ResultCode.SUCCEEDED) {
        dispatch(appActions.setStatus({ status: "succeeded" }))
        return { id }
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
const changeTodolistTitle = createAppAsyncThunk<UpdateTodolistTitleArg, UpdateTodolistTitleArg>(
  `${slice.name}/changeTodolistTitle`,
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    try {
      dispatch(appActions.setStatus({ status: "loading" }))
      const res = await todolistAPI.updateTodolist(arg)
      if (res.data.resultCode === ResultCode.SUCCEEDED) {
        dispatch(appActions.setStatus({ status: "succeeded" }))
        return { id: arg.id, title: arg.title }
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

export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType
  entityStatus: RequestStatusType
}
export type FilterValuesType = "all" | "completed" | "active"

export const todolistsActions = slice.actions
export const todolistsReducer = slice.reducer
export const todolistsThunks = { setTodolists, addTodolist, removeTodolist, changeTodolistTitle }
