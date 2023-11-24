import React, { memo, ChangeEvent } from 'react'
import BackspaceIcon from '@mui/icons-material/Backspace';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import { TaskType } from './Todolist';
import { useDispatch } from 'react-redux';
import { changeTaskStatusAC, changeTaskTitleAC, removeTaskAC } from '../state/tasks-reducer';
import { EditableSpan } from './EditableSpan';

type TaskPropsType = {
    task: TaskType
    todolistId: string
}

export const Task: React.FC<TaskPropsType> = memo((props) => {

    const dispatch = useDispatch()

    const onClickHandler = () => dispatch(removeTaskAC(props.todolistId, props.task.id))

    const onChangeTaskStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
        dispatch(changeTaskStatusAC(props.todolistId, props.task.id, e.currentTarget.checked))
    }

    const updateTaskHandler = (title: string) => {
        dispatch(changeTaskTitleAC(props.todolistId, props.task.id, title))
    }
    return (
        <li className={props.task.isDone ? 'is-done' : ''}>
            <Checkbox
                style={props.task.isDone ? { color: '#d32f2f' } : { color: '#1976d2' }}
                checked={props.task.isDone}
                onChange={onChangeTaskStatusHandler}
            />

            <EditableSpan title={props.task.title} onClick={updateTaskHandler} />
            <IconButton aria-label="delete"
                onClick={onClickHandler}>
                <BackspaceIcon />
            </IconButton>
        </li>
    )
})
