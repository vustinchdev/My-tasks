import { TaskStatuses } from "common/enums"
import { TaskDomain } from "features/TodolistsList/model/tasks/tasksSlice"
import { TodolistDomain } from "features/TodolistsList/model/todolists/todolistsSlice"
import { Task } from "./Task/Task"

type Props = {
  todolist: TodolistDomain
  tasks: TaskDomain[]
}

export const Tasks = ({ todolist, tasks }: Props) => {
  let tasksForTodoList = tasks
  if (todolist.filter === "completed") {
    tasksForTodoList = tasks.filter((t) => t.status === TaskStatuses.Completed)
  }
  if (todolist.filter === "active") {
    tasksForTodoList = tasks.filter((t) => t.status === TaskStatuses.New)
  }

  return (
    <ul>
      {tasksForTodoList?.map((t) => {
        return <Task key={t.id} task={t} todolistId={todolist.id} />
      })}
    </ul>
  )
}
