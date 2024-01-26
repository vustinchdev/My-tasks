import { PayloadAction, createSlice } from "@reduxjs/toolkit"

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
})

export const appActions = slice.actions
export const appReducer = slice.reducer

export type RequestStatus = "idle" | "loading" | "succeeded" | "failed"
export type AppState = ReturnType<typeof slice.getInitialState>
