import { RequestStatusType } from "app/appSlice"
import { FilterValuesType, TodolistDomainType, todolistsActions, todolistsReducer } from "./todolistsSlice"
import { v1 } from "uuid"

let todolistId1: string
let todolistId2: string

let startState: TodolistDomainType[]

beforeEach(() => {
  todolistId1 = v1()
  todolistId2 = v1()

  startState = [
    {
      id: todolistId1,
      title: "What to learn",
      filter: "all",
      addedDate: "",
      order: 0,
      entityStatus: "idle",
    },
    {
      id: todolistId2,
      title: "What to buy",
      filter: "all",
      addedDate: "",
      order: 0,
      entityStatus: "idle",
    },
  ]
})

test("correct todolist should be removed", () => {
  const endState = todolistsReducer(startState, todolistsActions.removeTodolist({ id: todolistId1 }))

  expect(endState.length).toBe(1)
  expect(endState[0].id).toBe(todolistId2)
})

test("correct todolist should be added", () => {
  const newTodolist = {
    id: "todolistId3",
    title: "new todolist",
    addedDate: "",
    order: 0,
  }

  const endState = todolistsReducer(startState, todolistsActions.addTodolist({ todolist: newTodolist }))

  expect(endState.length).toBe(3)
  expect(endState[0].title).toBe("new todolist")
  expect(endState[0].id).toBe("todolistId3")
})

test("correct todolist should change its name", () => {
  let newTodolistTitle = "New Todolist"

  const endState = todolistsReducer(
    startState,
    todolistsActions.changeTodolistTitle({ id: todolistId2, title: newTodolistTitle }),
  )

  expect(endState[0].title).toBe("What to learn")
  expect(endState[1].title).toBe(newTodolistTitle)
})

test("correct filter of todolist should be changed", () => {
  let newFilter: FilterValuesType = "completed"

  const endState = todolistsReducer(
    startState,
    todolistsActions.changeTodolistFilter({ id: todolistId2, filter: newFilter }),
  )

  expect(endState[0].filter).toBe("all")
  expect(endState[1].filter).toBe(newFilter)
})

test("todolists should be added", () => {
  const action = todolistsActions.setTodolists({ todolists: startState })

  const endState = todolistsReducer([], action)

  expect(endState.length).toBe(2)
})

test("correct entity status of todolist should be changed", () => {
  let newStatus: RequestStatusType = "loading"

  const endState = todolistsReducer(
    startState,
    todolistsActions.changeTodolistEntityStatus({ id: todolistId2, entityStatus: newStatus }),
  )

  expect(endState[0].entityStatus).toBe("idle")
  expect(endState[1].entityStatus).toBe(newStatus)
})
