import React, { ChangeEvent, KeyboardEvent, useState } from 'react'

type EditableSpanPropsType = {
    title: string
    onClick: (title: string) => void
}

export const EditableSpan: React.FC<EditableSpanPropsType> = (props) => {

    const [editMode, setEditMode] = useState(false)
    const [title, setTitle] = useState('')

    const editHandler = () => {
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
        ? <input value={title}
            onChange={onChangeTitleHandler}
            onBlur={editHandler}
            onKeyDown={onKeyDownHandler}
            autoFocus />
        : <span onDoubleClick={editHandler}>{props.title}</span>
}
