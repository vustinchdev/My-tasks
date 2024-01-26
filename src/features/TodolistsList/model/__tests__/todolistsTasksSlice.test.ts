import { TasksState, tasksReducer } from "../tasks/tasksSlice"
import { TodolistDomain, todolistsThunks, todolistsReducer } from "../todolists/todolistsSlice"

test("ids should be equals", () => {
  const startTasksState: TasksState = {}
  const startTodolistsState: TodolistDomain[] = []

  const newTodolist = {
    id: "todolistId3",
    title: "new todolist",
    addedDate: "",
    order: 0,
  }

  const action = todolistsThunks.addTodolist.fulfilled({ todolist: newTodolist }, "requestId", "new todolist")

  const endTasksState = tasksReducer(startTasksState, action)
  const endTodolistsState = todolistsReducer(startTodolistsState, action)

  const keys = Object.keys(endTasksState)
  const idFromTasks = keys[0]
  const idFromTodolists = endTodolistsState[0].id

  expect(idFromTasks).toBe(action.payload.todolist.id)
  expect(idFromTodolists).toBe(action.payload.todolist.id)
})
