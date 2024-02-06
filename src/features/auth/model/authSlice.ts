import { PayloadAction, createSlice, isFulfilled } from "@reduxjs/toolkit"
import { appActions } from "app/appSlice"
import { clearTasksAndTodolists } from "common/actions/commonActions"
import { ResultCode } from "common/enums"
import { createAppAsyncThunk } from "common/utils"
import { authAPI } from "../api/authApi"
import { LoginParams } from "../api/authApi.types"

const slice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      isFulfilled(authThunks.login, authThunks.logout, authThunks.initializeApp),
      (state, action: PayloadAction<{ isLoggedIn: boolean }>) => {
        state.isLoggedIn = action.payload.isLoggedIn
      },
    )
  },
})

const login = createAppAsyncThunk<{ isLoggedIn: boolean }, LoginParams>(
  `${slice.name}/login`,
  async (data, { rejectWithValue }) => {
    const res = await authAPI.login(data)
    if (res.data.resultCode === ResultCode.SUCCEEDED) {
      return { isLoggedIn: true }
    } else {
      return rejectWithValue(res.data)
    }
  },
)
const logout = createAppAsyncThunk<{ isLoggedIn: boolean }, undefined>(
  `${slice.name}/logout`,
  async (_, { dispatch, rejectWithValue }) => {
    const res = await authAPI.logout()
    if (res.data.resultCode === ResultCode.SUCCEEDED) {
      dispatch(clearTasksAndTodolists())
      return { isLoggedIn: false }
    } else {
      return rejectWithValue(res.data)
    }
  },
)
const initializeApp = createAppAsyncThunk<{ isLoggedIn: boolean }, undefined>(
  `${slice.name}/initializeApp`,
  async (_, { dispatch, rejectWithValue }) => {
    const res = await authAPI.me().finally(() => {
      dispatch(appActions.setAppInitialized({ isInitialized: true }))
    })
    if (res.data.resultCode === ResultCode.SUCCEEDED) {
      return { isLoggedIn: true }
    } else {
      return rejectWithValue(res.data)
    }
  },
)

export const authReducer = slice.reducer
export const authThunks = { login, logout, initializeApp }
