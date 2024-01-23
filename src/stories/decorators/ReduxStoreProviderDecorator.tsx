import React from "react"
import { Provider } from "react-redux"
import { applyMiddleware, combineReducers, legacy_createStore } from "redux"
import { v1 } from "uuid"
import { thunk } from "redux-thunk"
import { appReducer } from "app/appSlice"
import { AppRootStateType } from "app/store"
import { authReducer } from "features/auth/authSlice"
import { tasksReducer } from "features/TodolistsList/tasksSlice"
import { todolistsReducer } from "features/TodolistsList/todolistsSlice"
import { TaskStatuses, TaskPriorities } from "common/enums"
import { HashRouter } from "react-router-dom"

const rootReducer = combineReducers({
  tasks: tasksReducer,
  todolists: todolistsReducer,
  app: appReducer,
  auth: authReducer,
})

const initialGlobalState = {
  todolists: [
    {
      id: "todolistId1",
      title: "What to learn",
      filter: "all",
      addedDate: "",
      order: 0,
      entityStatus: "idle",
    },
    {
      id: "todolistId2",
      title: "What to buy",
      filter: "all",
      addedDate: "",
      order: 0,
      entityStatus: "idle",
    },
  ],
  tasks: {
    ["todolistId1"]: [
      {
        id: v1(),
        title: "HTML&CSS",
        status: TaskStatuses.Completed,
        description: "",
        addedDate: "",
        deadline: "",
        order: 0,
        priority: TaskPriorities.Low,
        startDate: "",
        todoListId: "todolistId1",
        entityTaskStatus: "idle",
      },
      {
        id: v1(),
        title: "JS",
        status: TaskStatuses.New,
        description: "",
        addedDate: "",
        deadline: "",
        order: 0,
        priority: TaskPriorities.Low,
        startDate: "",
        todoListId: "todolistId1",
        entityTaskStatus: "idle",
      },
    ],
    ["todolistId2"]: [
      {
        id: v1(),
        title: "Milk",
        status: TaskStatuses.New,
        description: "",
        addedDate: "",
        deadline: "",
        order: 0,
        priority: TaskPriorities.Low,
        startDate: "",
        todoListId: "todolistId2",
        entityTaskStatus: "idle",
      },
      {
        id: v1(),
        title: "React Book",
        status: TaskStatuses.Completed,
        description: "",
        addedDate: "",
        deadline: "",
        order: 0,
        priority: TaskPriorities.Low,
        startDate: "",
        todoListId: "todolistId2",
        entityTaskStatus: "idle",
      },
    ],
  },
  app: {
    status: "idle",
    error: null,
    isInitialized: false,
  },
  auth: {
    isLoggedIn: false,
  },
}

export const storyBookStore = legacy_createStore(
  rootReducer,
  initialGlobalState as AppRootStateType,
  applyMiddleware(thunk),
)

export const ReduxStoreProviderDecorator = (storyFn: () => React.ReactNode) => {
  return (
    <Provider store={storyBookStore}>
      <HashRouter>{storyFn()}</HashRouter>
    </Provider>
  )
}
