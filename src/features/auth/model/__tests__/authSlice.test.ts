import { LoginParams } from "features/auth/api/authApi.types"
import { AuthState, authReducer, authThunks } from "../authSlice"

let startState: AuthState

beforeEach(() => {
  startState = {
    isLoggedIn: false,
  }
})

test("should set the isLoggedIn state to true when app initialize", () => {
  const endState = authReducer(
    startState,
    authThunks.initializeApp.fulfilled({ isLoggedIn: true }, "requestId", undefined),
  )

  expect(endState.isLoggedIn).toBe(true)
})
test("should set the isLoggedIn state to false when user log out", () => {
  const endState = authReducer(startState, authThunks.logout.fulfilled({ isLoggedIn: false }, "requestId", undefined))

  expect(endState.isLoggedIn).toBe(false)
})
test("should set the isLoggedIn state to true when user log in", () => {
  const formData: LoginParams = {
    email: "email@email.ru",
    password: "1111111",
    rememberMe: true,
  }

  const endState = authReducer(startState, authThunks.login.fulfilled({ isLoggedIn: true }, "requestId", formData))

  expect(endState.isLoggedIn).toBe(true)
})
