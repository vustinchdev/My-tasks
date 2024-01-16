import { ResultCode, setTasksTC } from "./tasksSlice"
import { TodolistType, todolistAPI } from "api/todolist-api"
import { RequestStatusType, appActions } from "app/appSlice"
import { handleServerAppError, handleServerNetworkError } from "utils/error-utils"
import { AppThunk } from "app/store"
import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { clearTasksAndTodolists } from "common/actions/common.actions"

const slice = createSlice({
  name: "todolists",
  initialState: [] as TodolistDomainType[],
  reducers: {
    removeTodolist: (state, action: PayloadAction<{ id: string }>) => {
      const index = state.findIndex((todo) => todo.id === action.payload.id)
      if (index !== -1) {
        state.splice(index, 1)
      }
    },
    addTodolist: (state, action: PayloadAction<{ todolist: TodolistType }>) => {
      state.unshift({ ...action.payload.todolist, filter: "all", entityStatus: "idle" })
    },
    changeTodolistTitle: (state, action: PayloadAction<{ id: string; title: string }>) => {
      const todolist = state.find((todo) => todo.id === action.payload.id)
      if (todolist) {
        todolist.title = action.payload.title
      }
    },
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
    setTodolists: (state, action: PayloadAction<{ todolists: TodolistType[] }>) => {
      action.payload.todolists.forEach((tl) => {
        state.push({ ...tl, filter: "all", entityStatus: "idle" })
      })
    },
  },
  extraReducers: (builder) => {
    builder.addCase(clearTasksAndTodolists.type, () => {
      return []
    })
  },
})

export const setTodolistsTC = (): AppThunk => (dispatch) => {
  dispatch(appActions.setStatus({ status: "loading" }))
  todolistAPI
    .getTodolists()
    .then((res) => {
      dispatch(todolistsActions.setTodolists({ todolists: res.data }))
      dispatch(appActions.setStatus({ status: "succeeded" }))
      return res.data
    })
    .then((todolists) => {
      todolists.forEach((tl) => {
        dispatch(setTasksTC(tl.id))
      })
    })
}
export const addTodolistTC =
  (title: string): AppThunk =>
  (dispatch) => {
    dispatch(appActions.setStatus({ status: "loading" }))
    todolistAPI
      .addTodolist(title)
      .then((res) => {
        if (res.data.resultCode === ResultCode.SUCCEEDED) {
          dispatch(todolistsActions.addTodolist({ todolist: res.data.data.item }))
          dispatch(appActions.setStatus({ status: "succeeded" }))
        } else {
          handleServerAppError(dispatch, res.data)
        }
      })
      .catch((e) => {
        handleServerNetworkError(dispatch, e)
      })
  }
export const removeTodolistTC =
  (id: string): AppThunk =>
  (dispatch) => {
    dispatch(appActions.setStatus({ status: "loading" }))
    dispatch(todolistsActions.changeTodolistEntityStatus({ id, entityStatus: "loading" }))
    todolistAPI
      .deleteTodolist(id)
      .then((res) => {
        if (res.data.resultCode === ResultCode.SUCCEEDED) {
          dispatch(todolistsActions.removeTodolist({ id }))
          dispatch(appActions.setStatus({ status: "succeeded" }))
        } else {
          handleServerAppError(dispatch, res.data)
        }
      })
      .catch((e) => {
        handleServerNetworkError(dispatch, e)
      })
  }
export const changeTodolistTitleTC =
  (todolistId: string, title: string): AppThunk =>
  (dispatch) => {
    dispatch(appActions.setStatus({ status: "loading" }))
    todolistAPI
      .updateTodolist(todolistId, title)
      .then((res) => {
        if (res.data.resultCode === ResultCode.SUCCEEDED) {
          dispatch(todolistsActions.changeTodolistTitle({ id: todolistId, title }))
          dispatch(appActions.setStatus({ status: "succeeded" }))
        } else {
          handleServerAppError(dispatch, res.data)
        }
      })
      .catch((e) => {
        handleServerNetworkError(dispatch, e)
      })
  }

export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType
  entityStatus: RequestStatusType
}
export type FilterValuesType = "all" | "completed" | "active"

export const todolistsActions = slice.actions
export const todolistsReducer = slice.reducer
