import { TasksStateType } from "../../app/App"
import { tasksReducer } from "./tasks-reducer"
import { TodolistDomainType, addTodolistAC, todolistsReducer } from "./todolists-reducer"

test('ids should be equals', () => {
    const startTasksState: TasksStateType = {}
    const startTodolistsState: TodolistDomainType[] = []

    const newTodolist = {
        id: 'todolistId3',
        title: 'new todolist',
        addedDate: '',
        order: 0
    }

    const action = addTodolistAC(newTodolist)

    const endTasksState = tasksReducer(startTasksState, action)
    const endTodolistsState = todolistsReducer(startTodolistsState, action)

    const keys = Object.keys(endTasksState)
    const idFromTasks = keys[0]
    const idFromTodolists = endTodolistsState[0].id

    expect(idFromTasks).toBe(action.todolist.id)
    expect(idFromTodolists).toBe(action.todolist.id)
})