import { ChangeEvent, KeyboardEvent, memo, useState } from "react"
import TextField from "@mui/material/TextField"

type Props = {
  titleValue: string
  disabled?: boolean
  onChange: (title: string) => void
}

export const EditableSpan = memo(({ titleValue, disabled = false, onChange }: Props) => {
  const [editMode, setEditMode] = useState(false)
  const [title, setTitle] = useState("")

  const editHandler = () => {
    if (disabled) {
      return
    }
    setEditMode(!editMode)
    setTitle(titleValue)
    if (editMode) {
      onChange(title)
    }
  }

  const onChangeTitleHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value)
  }

  const onKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      editHandler()
    }
  }

  return editMode ? (
    <TextField
      id="standard-basic"
      variant="standard"
      value={title}
      onChange={onChangeTitleHandler}
      onBlur={editHandler}
      onKeyDown={onKeyDownHandler}
      autoFocus
    />
  ) : (
    <span onDoubleClick={editHandler}>{titleValue}</span>
  )
})
