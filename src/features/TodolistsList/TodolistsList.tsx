import React, { useCallback, useEffect } from "react"
import Grid from "@mui/material/Grid"
import Paper from "@mui/material/Paper"
import { TodoList } from "./Todolist/Todolist"
import { removeTaskTC, addTaskTC, updateTaskTC, TasksStateType } from "./tasksSlice"
import {
  TodolistDomainType,
  setTodolistsTC,
  removeTodolistTC,
  changeTodolistTitleTC,
  addTodolistTC,
  FilterValuesType,
  todolistsActions,
} from "./todolistsSlice"
import { Navigate } from "react-router-dom"
import { TaskStatuses } from "api/todolist-api"
import { useAppSelector, useAppDispatch } from "app/store"
import { AddItemForm } from "components/AddItemForm/AddItemForm"

type TodolistsListType = {
  demo?: boolean
}

export const TodolistsList: React.FC<TodolistsListType> = ({ demo = false }) => {
  const todolists = useAppSelector<TodolistDomainType[]>((state) => state.todolists)
  const tasks = useAppSelector<TasksStateType>((state) => state.tasks)
  const isLoggedIn = useAppSelector<boolean>((state) => state.auth.isLoggedIn)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (demo || !isLoggedIn) {
      return
    }
    dispatch(setTodolistsTC())
  }, [])

  const removeTask = useCallback(
    (todolistId: string, taskId: string) => {
      dispatch(removeTaskTC(todolistId, taskId))
    },
    [dispatch],
  )

  const addTask = useCallback(
    (todolistId: string, title: string) => {
      dispatch(addTaskTC(todolistId, title))
    },
    [dispatch],
  )

  const changeTaskTitle = useCallback(
    (todolistId: string, taskId: string, title: string) => {
      dispatch(updateTaskTC(todolistId, taskId, { title }))
    },
    [dispatch],
  )

  const changeTaskStatus = useCallback(
    (todolistId: string, taskId: string, status: TaskStatuses) => {
      dispatch(updateTaskTC(todolistId, taskId, { status }))
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
      dispatch(removeTodolistTC(todolistId))
    },
    [dispatch],
  )

  const changeTodolistTitle = useCallback(
    (todolistId: string, title: string) => {
      dispatch(changeTodolistTitleTC(todolistId, title))
    },
    [dispatch],
  )

  const addTodolist = useCallback(
    (title: string) => {
      dispatch(addTodolistTC(title))
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
