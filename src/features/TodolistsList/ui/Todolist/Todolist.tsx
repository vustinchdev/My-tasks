import { FC, memo, useCallback, useEffect } from "react"
import { AddItemForm } from "common/components"
import { useAppDispatch } from "common/hooks"
import { TaskDomain, tasksThunks } from "features/TodolistsList/model/tasks/tasksSlice"
import { TodolistDomain } from "features/TodolistsList/model/todolists/todolistsSlice"
import { FilterTasksButtons } from "./FirlterTasksButtons/FilterTasksButtons"
import { Tasks } from "./Tasks/Tasks"
import { TodolistTitle } from "./TodolistTitle/TodolistTitle"
import s from "./Todolist.module.css"

type Props = {
  todolist: TodolistDomain
  demo?: boolean
  tasks: TaskDomain[]
}

export const TodoList: FC<Props> = memo(({ demo = false, tasks, todolist }: Props) => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(tasksThunks.setTasks(todolist.id))
  }, [])

  const addTaskCb = useCallback(
    (title: string) => {
      return dispatch(tasksThunks.addTask({ todolistId: todolist.id, title })).unwrap()
    },
    [dispatch, todolist.id],
  )

  return (
    <div className={s.todolist}>
      <TodolistTitle todolist={todolist} />
      <AddItemForm addItem={addTaskCb} disabled={todolist.entityStatus === "loading"} />
      <Tasks todolist={todolist} tasks={tasks} />
      <FilterTasksButtons todolist={todolist} />
    </div>
  )
})
