import { AppState, appActions, appReducer } from "./appSlice"

let startState: AppState

beforeEach(() => {
  startState = {
    status: "idle",
    error: null,
    isInitialized: false,
  }
})

test("correct error message should be set", () => {
  const endState = appReducer(startState, appActions.setError({ error: "some error" }))

  expect(endState.error).toBe("some error")
})

test("correct status should be set", () => {
  const endState = appReducer(startState, appActions.setStatus({ status: "loading" }))

  expect(endState.status).toBe("loading")
})
