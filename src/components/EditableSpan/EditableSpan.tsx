import React, { ChangeEvent, KeyboardEvent, memo, useState } from 'react'
import TextField from '@mui/material/TextField';

type EditableSpanPropsType = {
    title: string
    disabled?: boolean
    onClick: (title: string) => void
}

export const EditableSpan: React.FC<EditableSpanPropsType> = memo((props) => {

    const [editMode, setEditMode] = useState(false)
    const [title, setTitle] = useState('')

    const editHandler = () => {
        if (props.disabled) {
            return
        }
        setEditMode(!editMode)
        setTitle(props.title)
        if (editMode) {
            props.onClick(title)
        }
    }

    const onChangeTitleHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    }

    const onKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            editHandler()
        }
    }

    return editMode
        ? < TextField id="standard-basic"
            variant="standard"
            value={title}
            onChange={onChangeTitleHandler}
            onBlur={editHandler}
            onKeyDown={onKeyDownHandler}
            autoFocus />
        : <span onDoubleClick={editHandler}>{props.title}</span>
})
