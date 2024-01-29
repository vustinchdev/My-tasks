import { ChangeEvent, KeyboardEvent, memo, useState } from "react"
import TextField from "@mui/material/TextField"
import AddBoxIcon from "@mui/icons-material/AddBox"
import IconButton from "@mui/material/IconButton"
import { BaseResponse } from "common/types"

type Props = {
  addItem: (newTitle: string) => Promise<any>
  disabled?: boolean
}

export const AddItemForm = memo(({ addItem, disabled = false }: Props) => {
  const [title, setTitle] = useState("")
  const [error, setError] = useState<string | null>(null)

  const addItemHandler = () => {
    let newTitle = title.trim()
    if (newTitle !== "") {
      addItem(newTitle)
        .then((res) => {
          setTitle("")
        })
        .catch((e: BaseResponse) => {
          if (e?.resultCode) {
            setError(e.messages[0])
          }
        })
    } else {
      setError("Title is required")
    }
  }

  const onNewTitleChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value)
  }

  const onKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    if (error !== null) {
      setError(null)
    }
    if (e.key === "Enter") {
      addItemHandler()
    }
  }

  return (
    <div>
      <TextField
        error={!!error}
        id="outlined-basic"
        label={error ? "Title" : "type smth..."}
        variant="outlined"
        size="small"
        value={title}
        disabled={disabled}
        helperText={error}
        onChange={onNewTitleChangeHandler}
        onKeyDown={onKeyDownHandler}
      />
      <IconButton onClick={addItemHandler} disabled={disabled}>
        <AddBoxIcon style={{ color: "#2e7d32", width: "30px" }} />
      </IconButton>
    </div>
  )
})
