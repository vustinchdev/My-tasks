import { useCallback, useEffect } from "react"
import Grid from "@mui/material/Grid"
import Paper from "@mui/material/Paper"
import { todolistsThunks } from "../model/todolists/todolistsSlice"
import { Navigate } from "react-router-dom"
import { selectTodolists } from "../model/todolists/todolistsSelectors"
import { selectTasks } from "../model/tasks/tasksSelectors"
import { selectIsLoggedIn } from "features/auth/model/authSelectors"
import { AddItemForm } from "common/components"
import { useAppSelector, useAppDispatch } from "common/hooks"
import { TodoList } from "./Todolist/Todolist"

type Props = {
  demo?: boolean
}

export const TodolistsList = ({ demo = false }: Props) => {
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

  const addTodolist = useCallback(
    (title: string) => {
      return dispatch(todolistsThunks.addTodolist(title)).unwrap()
    },
    [dispatch],
  )

  if (!isLoggedIn) {
    return <Navigate to="/login" />
  }

  return (
    <>
      <Grid container style={{ margin: "20px" }}>
        <AddItemForm addItem={addTodolist} />
      </Grid>

      <Grid container spacing={3}>
        {todolists.map((tl) => {
          return (
            <Grid key={tl.id} item>
              <Paper elevation={3} style={{ padding: "15px" }}>
                <TodoList key={tl.id} demo={demo} todolist={tl} tasks={tasks[tl.id]} />
              </Paper>
            </Grid>
          )
        })}
      </Grid>
    </>
  )
}
