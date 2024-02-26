import { memo, ChangeEvent } from "react"
import BackspaceIcon from "@mui/icons-material/Backspace"
import Checkbox from "@mui/material/Checkbox"
import IconButton from "@mui/material/IconButton"
import { TaskDomain, tasksThunks } from "features/TodolistsList/model/tasks/tasksSlice"
import { EditableSpan } from "common/components"
import { TaskStatuses } from "common/enums"
import { useAppDispatch } from "common/hooks"
import s from "./Task.module.css"

type Props = {
  task: TaskDomain
  todolistId: string
  disabled: boolean
}

export const Task = memo(({ task, todolistId, disabled }: Props) => {
  const dispatch = useAppDispatch()

  const removeTaskHandler = () => dispatch(tasksThunks.removeTask({ todolistId, taskId: task.id }))
  const changeTaskStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const status = e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New
    dispatch(tasksThunks.updateTask({ todolistId, taskId: task.id, domainModel: { status } }))
  }
  const changeTaskTitleHandler = (title: string) => {
    dispatch(tasksThunks.updateTask({ todolistId, taskId: task.id, domainModel: { title } }))
  }

  return (
    <li className={task.status === TaskStatuses.Completed ? s.isDone : ""}>
      <Checkbox
        style={task.status === TaskStatuses.Completed ? { color: "#d32f2f" } : { color: "#1976d2" }}
        checked={task.status === TaskStatuses.Completed}
        disabled={disabled}
        onChange={changeTaskStatusHandler}
      />

      <EditableSpan titleValue={task.title} onChange={changeTaskTitleHandler} disabled={disabled} />
      <IconButton aria-label="delete" disabled={disabled} onClick={removeTaskHandler}>
        <BackspaceIcon />
      </IconButton>
    </li>
  )
})
