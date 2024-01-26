import { Todolist, UpdateTodolistTitleArg, todolistAPI } from "features/TodolistsList/todolist-api"
import { RequestStatus } from "app/appSlice"
import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { clearTasksAndTodolists } from "common/actions/common.actions"
import { createAppAsyncThunk } from "common/utils/createAppAsyncThunk"
import { handleServerAppError, thunkTryCatch } from "common/utils"
import { ResultCode } from "common/enums"

const slice = createSlice({
  name: "todolists",
  initialState: [] as TodolistDomain[],
  reducers: {
    changeTodolistFilter: (state, action: PayloadAction<{ id: string; filter: FilterValues }>) => {
      const todolist = state.find((todo) => todo.id === action.payload.id)
      if (todolist) {
        todolist.filter = action.payload.filter
      }
    },
    changeTodolistEntityStatus: (state, action: PayloadAction<{ id: string; entityStatus: RequestStatus }>) => {
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

const setTodolists = createAppAsyncThunk<{ todolists: Todolist[] }, void>(
  `${slice.name}/setTodolists`,
  async (_, thunkAPI) => {
    return thunkTryCatch(thunkAPI, async () => {
      const res = await todolistAPI.getTodolists()
      return { todolists: res.data }
    })
  },
)
const addTodolist = createAppAsyncThunk<{ todolist: Todolist }, string>(
  `${slice.name}/addTodolist`,
  async (title, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    return thunkTryCatch(thunkAPI, async () => {
      const res = await todolistAPI.addTodolist(title)
      if (res.data.resultCode === ResultCode.SUCCEEDED) {
        return { todolist: res.data.data.item }
      } else {
        handleServerAppError(dispatch, res.data)
        return rejectWithValue(null)
      }
    })
  },
)
const removeTodolist = createAppAsyncThunk<{ id: string }, string>(
  `${slice.name}/removeTodolist`,
  async (id, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    return thunkTryCatch(thunkAPI, async () => {
      dispatch(todolistsActions.changeTodolistEntityStatus({ id, entityStatus: "loading" }))
      const res = await todolistAPI.deleteTodolist(id)
      if (res.data.resultCode === ResultCode.SUCCEEDED) {
        return { id }
      } else {
        handleServerAppError(dispatch, res.data)
        return rejectWithValue(null)
      }
    })
  },
)
const changeTodolistTitle = createAppAsyncThunk<UpdateTodolistTitleArg, UpdateTodolistTitleArg>(
  `${slice.name}/changeTodolistTitle`,
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    return thunkTryCatch(thunkAPI, async () => {
      const res = await todolistAPI.updateTodolist(arg)
      if (res.data.resultCode === ResultCode.SUCCEEDED) {
        return { id: arg.id, title: arg.title }
      } else {
        handleServerAppError(dispatch, res.data)
        return rejectWithValue(null)
      }
    })
  },
)

export type TodolistDomain = Todolist & {
  filter: FilterValues
  entityStatus: RequestStatus
}
export type FilterValues = "all" | "completed" | "active"

export const todolistsActions = slice.actions
export const todolistsReducer = slice.reducer
export const todolistsThunks = { setTodolists, addTodolist, removeTodolist, changeTodolistTitle }
