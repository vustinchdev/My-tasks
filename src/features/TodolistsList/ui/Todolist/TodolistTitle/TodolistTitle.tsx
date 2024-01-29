import IconButton from "@mui/material/IconButton"
import DeleteIcon from "@mui/icons-material/Delete"
import { EditableSpan } from "common/components"
import { useAppDispatch } from "common/hooks"
import { TodolistDomain, todolistsThunks } from "features/TodolistsList/model/todolists/todolistsSlice"

type Props = {
  todolist: TodolistDomain
}

export const TodolistTitle = ({ todolist }: Props) => {
  const dispatch = useAppDispatch()
  const removeTodolistHandler = () => dispatch(todolistsThunks.removeTodolist(todolist.id))
  const changeTodolistTitle = (title: string) =>
    dispatch(todolistsThunks.changeTodolistTitle({ id: todolist.id, title }))

  return (
    <h3>
      <EditableSpan
        titleValue={todolist.title}
        onChange={changeTodolistTitle}
        disabled={todolist.entityStatus === "loading"}
      />
      <IconButton aria-label="delete" onClick={removeTodolistHandler} disabled={todolist.entityStatus === "loading"}>
        <DeleteIcon />
      </IconButton>
    </h3>
  )
}
