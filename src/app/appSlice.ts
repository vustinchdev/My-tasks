import { PayloadAction, createSlice, isFulfilled, isPending, isRejected } from "@reduxjs/toolkit"
import { tasksThunks } from "features/TodolistsList/model/tasks/tasksSlice"
import { todolistsThunks } from "features/TodolistsList/model/todolists/todolistsSlice"
import { authThunks } from "features/auth/model/authSlice"

const slice = createSlice({
  name: "app",
  initialState: {
    status: "idle" as RequestStatus,
    error: null as null | string,
    isInitialized: false,
  },
  reducers: {
    setStatus: (state, action: PayloadAction<{ status: RequestStatus }>) => {
      state.status = action.payload.status
    },
    setError: (state, action: PayloadAction<{ error: null | string }>) => {
      state.error = action.payload.error
    },
    setAppInitialized: (state, action: PayloadAction<{ isInitialized: boolean }>) => {
      state.isInitialized = action.payload.isInitialized
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(isPending, (state) => {
        state.status = "loading"
      })
      .addMatcher(isRejected, (state, action: any) => {
        state.status = "failed"
        if (action.payload) {
          if (
            action.type === todolistsThunks.addTodolist.rejected.type ||
            action.type === tasksThunks.addTask.rejected.type ||
            action.type === authThunks.initializeApp.rejected.type
          ) {
            return
          }
          state.error = action.payload.messages[0]
        } else {
          state.error = action.error.message ? action.error.message : "Some error occurred"
        }
      })
      .addMatcher(isFulfilled, (state) => {
        state.status = "succeeded"
      })
  },
})

export const appActions = slice.actions
export const appReducer = slice.reducer

export type RequestStatus = "idle" | "loading" | "succeeded" | "failed"
export type AppState = ReturnType<typeof slice.getInitialState>
