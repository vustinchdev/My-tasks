import React, { ChangeEvent, useState } from 'react'

type EditableSpanPropsType = {
    title: string
    onClick: (title: string) => void
}

export const EditableSpan: React.FC<EditableSpanPropsType> = (props) => {

    const [editMode, setEditMode] = useState(false)
    const [title, setTitle] = useState('')

    const activateEditMode = () => {
        setEditMode(true)
        setTitle(props.title)
    }

    const activateViewMode = () => {
        setEditMode(false)
        props.onClick(title)
    }

    const onChangeTitleHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    }

    return editMode
        ? <input value={title} onChange={onChangeTitleHandler} onBlur={activateViewMode} autoFocus />
        : <span onDoubleClick={activateEditMode}>{props.title}</span>
}
