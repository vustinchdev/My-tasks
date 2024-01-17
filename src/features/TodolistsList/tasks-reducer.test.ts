import { TaskStatuses, TaskPriorities } from "api/todolist-api"
import { RequestStatusType } from "app/appSlice"
import { TasksStateType, tasksActions, tasksReducer, tasksThunks } from "./tasksSlice"
import { todolistsActions } from "./todolistsSlice"

let startState: TasksStateType

beforeEach(() => {
  startState = {
    todolistId1: [
      {
        id: "1",
        title: "CSS",
        status: TaskStatuses.New,
        addedDate: "",
        deadline: "",
        description: "",
        order: 0,
        priority: TaskPriorities.Low,
        startDate: "",
        todoListId: "todolistId1",
        entityTaskStatus: "idle",
      },
      {
        id: "2",
        title: "JS",
        status: TaskStatuses.Completed,
        addedDate: "",
        deadline: "",
        description: "",
        order: 0,
        priority: TaskPriorities.Low,
        startDate: "",
        todoListId: "todolistId1",
        entityTaskStatus: "idle",
      },
      {
        id: "3",
        title: "React",
        status: TaskStatuses.New,
        addedDate: "",
        deadline: "",
        description: "",
        order: 0,
        priority: TaskPriorities.Low,
        startDate: "",
        todoListId: "todolistId1",
        entityTaskStatus: "idle",
      },
    ],
    todolistId2: [
      {
        id: "1",
        title: "bread",
        status: TaskStatuses.New,
        addedDate: "",
        deadline: "",
        description: "",
        order: 0,
        priority: TaskPriorities.Low,
        startDate: "",
        todoListId: "todolistId2",
        entityTaskStatus: "idle",
      },
      {
        id: "2",
        title: "milk",
        status: TaskStatuses.Completed,
        addedDate: "",
        deadline: "",
        description: "",
        order: 0,
        priority: TaskPriorities.Low,
        startDate: "",
        todoListId: "todolistId2",
        entityTaskStatus: "idle",
      },
      {
        id: "3",
        title: "tea",
        status: TaskStatuses.New,
        addedDate: "",
        deadline: "",
        description: "",
        order: 0,
        priority: TaskPriorities.Low,
        startDate: "",
        todoListId: "todolistId2",
        entityTaskStatus: "idle",
      },
    ],
  }
})

test("correct task should be deleted from correct array", () => {
  const payload = { todolistId: "todolistId2", taskId: "2" }
  const endState = tasksReducer(startState, tasksThunks.removeTask.fulfilled(payload, "requestId", payload))

  expect(endState["todolistId1"].length).toBe(3)
  expect(endState["todolistId2"].length).toBe(2)
  expect(endState["todolistId2"].every((t) => t.id !== "2")).toBeTruthy()
})

test("correct task should be added to correct array", () => {
  const newTask = {
    id: "4",
    title: "juce",
    status: TaskStatuses.New,
    addedDate: "",
    deadline: "",
    description: "",
    order: 0,
    priority: TaskPriorities.Low,
    startDate: "",
    todoListId: "todolistId2",
  }

  const endState = tasksReducer(
    startState,
    tasksThunks.addTask.fulfilled({ todolistId: "todolistId2", task: newTask }, "requestId", {
      todolistId: "todolistId2",
      title: "juce",
    }),
  )

  expect(endState["todolistId1"].length).toBe(3)
  expect(endState["todolistId2"].length).toBe(4)
  expect(endState["todolistId2"][0].id).toBeDefined()
  expect(endState["todolistId2"][0].title).toBe("juce")
  expect(endState["todolistId2"][0].status).toBe(TaskStatuses.New)
})

test("status of specified task should be changed", () => {
  const payload = { todolistId: "todolistId2", taskId: "2", domainModel: { status: TaskStatuses.New } }
  const endState = tasksReducer(startState, tasksThunks.updateTask.fulfilled(payload, "requestId", payload))

  expect(endState["todolistId2"][1].status).toBe(TaskStatuses.New)
  expect(endState["todolistId1"][1].status).toBe(TaskStatuses.Completed)
})

test("correct task should change its name", () => {
  const payload = { todolistId: "todolistId2", taskId: "2", domainModel: { title: "coffee" } }
  const endState = tasksReducer(startState, tasksThunks.updateTask.fulfilled(payload, "requestId", payload))

  expect(endState["todolistId2"][1].title).toBe("coffee")
  expect(endState["todolistId1"][1].title).toBe("JS")
})

test("new array should be added when new todolist is added", () => {
  const newTodolist = {
    id: "todolistId3",
    title: "new todolist",
    addedDate: "",
    order: 0,
  }

  const endState = tasksReducer(startState, todolistsActions.addTodolist({ todolist: newTodolist }))

  const keys = Object.keys(endState)
  const newKey = keys.find((k) => k != "todolistId1" && k != "todolistId2")
  if (!newKey) {
    throw Error("new key should be added")
  }

  expect(keys.length).toBe(3)
  expect(endState[newKey]).toEqual([])
})

test("property with todolistId should be deleted", () => {
  const endState = tasksReducer(startState, todolistsActions.removeTodolist({ id: "todolistId2" }))

  const keys = Object.keys(endState)

  expect(keys.length).toBe(1)
  expect(endState["todolistId2"]).not.toBeDefined()
})

test("empty arrays should be added when we set todolists", () => {
  const action = todolistsActions.setTodolists({
    todolists: [
      { id: "1", title: "title 1", order: 0, addedDate: "" },
      { id: "2", title: "title 2", order: 0, addedDate: "" },
    ],
  })

  const endState = tasksReducer({}, action)

  const keys = Object.keys(endState)

  expect(keys.length).toBe(2)
  expect(endState["1"]).toBeDefined()
  expect(endState["2"]).toBeDefined()
})

test("tasks should be added for todolist", () => {
  const endState = tasksReducer(
    {
      todolistId2: [],
      todolistId1: [],
    },
    tasksThunks.setTasks.fulfilled(
      { todolistId: "todolistId1", tasks: startState["todolistId1"] },
      "requestId",
      "todolistId1",
    ),
  )

  expect(endState["todolistId1"].length).toBe(3)
  expect(endState["todolistId2"].length).toBe(0)
})

test("correct entity status of todolist should be changed", () => {
  let newTaskStatus: RequestStatusType = "loading"

  const endState = tasksReducer(
    startState,
    tasksActions.changeEntityTaskStatus({ todolistId: "todolistId1", taskId: "2", entityTaskStatus: newTaskStatus }),
  )

  expect(endState["todolistId1"][1].entityTaskStatus).toBe(newTaskStatus)
  expect(endState["todolistId1"][0].entityTaskStatus).toBe("idle")
  expect(endState["todolistId1"][2].entityTaskStatus).toBe("idle")
  expect(endState["todolistId2"][1].entityTaskStatus).toBe("idle")
})
