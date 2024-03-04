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
import s from './TodolistList.module.css'

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
    <div className={s.todolistList}>
      <Grid container className={s.addItem}>
        <AddItemForm addItem={addTodolist} />
      </Grid>

      <Grid container spacing={3}>
        {todolists.map((tl) => {
          return (
            <Grid key={tl.id} item>
              <Paper elevation={3}  className={s.paper}>
                <TodoList key={tl.id} demo={demo} todolist={tl} tasks={tasks[tl.id]} />
              </Paper>
            </Grid>
          )
        })}
      </Grid>
    </div>
  )
}
