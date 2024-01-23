import { createSlice } from "@reduxjs/toolkit"
import { LoginParams, authAPI } from "features/auth/auth-api"
import { appActions } from "app/appSlice"
import { clearTasksAndTodolists } from "common/actions/common.actions"
import { ResultCode } from "common/enums"
import { createAppAsyncThunk, handleServerAppError, thunkTryCatch } from "common/utils"

const slice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn
      })
      .addCase(initializeApp.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn
      })
  },
})

const login = createAppAsyncThunk<{ isLoggedIn: boolean }, LoginParams>(
  `${slice.name}/login`,
  async (data, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    return thunkTryCatch(thunkAPI, async () => {
      const res = await authAPI.login(data)
      if (res.data.resultCode === ResultCode.SUCCEEDED) {
        return { isLoggedIn: true }
      } else {
        const isShowAppError = !res.data.fieldsErrors.length
        handleServerAppError(dispatch, res.data, isShowAppError)
        return rejectWithValue(res.data)
      }
    })
  },
)
const logout = createAppAsyncThunk<{ isLoggedIn: boolean }, undefined>(`${slice.name}/logout`, async (_, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI
  return thunkTryCatch(thunkAPI, async () => {
    const res = await authAPI.logout()
    if (res.data.resultCode === ResultCode.SUCCEEDED) {
      dispatch(clearTasksAndTodolists())
      return { isLoggedIn: false }
    } else {
      handleServerAppError(dispatch, res.data)
      return rejectWithValue(null)
    }
  })
})
const initializeApp = createAppAsyncThunk<{ isLoggedIn: boolean }, undefined>(
  `${slice.name}/initializeApp`,
  async (_, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    return thunkTryCatch(thunkAPI, async () => {
      const res = await authAPI.me()
      if (res.data.resultCode === ResultCode.SUCCEEDED) {
        return { isLoggedIn: true }
      } else {
        handleServerAppError(dispatch, res.data, false)
        return rejectWithValue(null)
      }
    }).finally(() => {
      dispatch(appActions.setAppInitialized({ isInitialized: true }))
    })
  },
)

export const authReducer = slice.reducer
export const authThunks = { login, logout, initializeApp }
