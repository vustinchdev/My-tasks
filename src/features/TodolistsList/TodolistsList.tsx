import React, { useCallback, useEffect } from "react"
import Grid from "@mui/material/Grid"
import Paper from "@mui/material/Paper"
import { TodoList } from "./Todolist/Todolist"
import { tasksThunks } from "./tasksSlice"
import { FilterValuesType, todolistsActions, todolistsThunks } from "./todolistsSlice"
import { Navigate } from "react-router-dom"
import { TaskStatuses } from "api/todolist-api"
import { useAppSelector, useAppDispatch } from "app/store"
import { AddItemForm } from "components/AddItemForm/AddItemForm"
import { selectTodolists } from "./todolists.selectors"
import { selectTasks } from "./tasks.selectors"
import { selectIsLoggedIn } from "features/Login/auth.selectors"

type TodolistsListType = {
  demo?: boolean
}

export const TodolistsList: React.FC<TodolistsListType> = ({ demo = false }) => {
  const todolists = useAppSelector(selectTodolists)
  const tasks = useAppSelector(selectTasks)
  const isLoggedIn = useAppSelector(selectIsLoggedIn)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (demo || !isLoggedIn) {
      return
    }
    dispatch(todolistsThunks.setTodolists())
  }, [])

  const removeTask = useCallback(
    (todolistId: string, taskId: string) => {
      dispatch(tasksThunks.removeTask({ todolistId, taskId }))
    },
    [dispatch],
  )

  const addTask = useCallback(
    (todolistId: string, title: string) => {
      dispatch(tasksThunks.addTask({ todolistId, title }))
    },
    [dispatch],
  )

  const changeTaskTitle = useCallback(
    (todolistId: string, taskId: string, title: string) => {
      dispatch(tasksThunks.updateTask({ todolistId, taskId, domainModel: { title } }))
    },
    [dispatch],
  )

  const changeTaskStatus = useCallback(
    (todolistId: string, taskId: string, status: TaskStatuses) => {
      dispatch(tasksThunks.updateTask({ todolistId, taskId, domainModel: { status } }))
    },
    [dispatch],
  )

  const changeFilter = useCallback(
    (id: string, filter: FilterValuesType) => {
      dispatch(todolistsActions.changeTodolistFilter({ id, filter }))
    },
    [dispatch],
  )

  const removeTodolist = useCallback(
    (todolistId: string) => {
      dispatch(todolistsThunks.removeTodolist(todolistId))
    },
    [dispatch],
  )

  const changeTodolistTitle = useCallback(
    (id: string, title: string) => {
      dispatch(todolistsThunks.changeTodolistTitle({ id, title }))
    },
    [dispatch],
  )

  const addTodolist = useCallback(
    (title: string) => {
      dispatch(todolistsThunks.addTodolist(title))
    },
    [dispatch],
  )

  if (!isLoggedIn) {
    return <Navigate to="/login" />
  }

  return (
    <>
      <Grid container style={{ margin: "20px" }}>
        <AddItemForm onClick={addTodolist} />
      </Grid>

      <Grid container spacing={3}>
        {todolists.map((tl) => {
          return (
            <Grid key={tl.id} item>
              <Paper elevation={3} style={{ padding: "15px" }}>
                <TodoList
                  key={tl.id}
                  demo={demo}
                  todolist={tl}
                  tasks={tasks[tl.id]}
                  removeTask={removeTask}
                  changeFilter={changeFilter}
                  addTask={addTask}
                  changeTaskStatus={changeTaskStatus}
                  removeTodolist={removeTodolist}
                  changeTaskTitle={changeTaskTitle}
                  changeTodolistTitle={changeTodolistTitle}
                />
              </Paper>
            </Grid>
          )
        })}
      </Grid>
    </>
  )
}
