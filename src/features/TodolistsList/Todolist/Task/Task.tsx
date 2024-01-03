import React, { memo, ChangeEvent, useCallback } from 'react';
import BackspaceIcon from '@mui/icons-material/Backspace';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import { EditableSpan } from '../../../../components/EditableSpan/EditableSpan';
import { TaskStatuses } from '../../../../api/todolist-api';
import { TaskDomainType } from '../../tasks-reducer';

type TaskPropsType = {
    task: TaskDomainType
    todolistId: string
    changeTaskStatus: (todolistId: string, taskId: string, status: TaskStatuses) => void
    changeTaskTitle: (todolistId: string, taskId: string, title: string) => void
    removeTask: (todolistId: string, taskId: string) => void
}

export const Task: React.FC<TaskPropsType> = memo((props) => {

    const onClickHandler = useCallback(() => props.removeTask(props.todolistId, props.task.id), [props.todolistId, props.task.id])

    const onChangeTaskStatusHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        props.changeTaskStatus(props.todolistId, props.task.id, e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New)
    }, [props.todolistId, props.task.id])

    const changeTaskTitleHandler = useCallback((title: string) => {
        props.changeTaskTitle(props.todolistId, props.task.id, title)
    }, [props.todolistId, props.task.id])
    return (
        <li className={props.task.status === TaskStatuses.Completed ? 'is-done' : ''}>
            <Checkbox
                style={props.task.status === TaskStatuses.Completed ? { color: '#d32f2f' } : { color: '#1976d2' }}
                checked={props.task.status === TaskStatuses.Completed}
                disabled={props.task.entityTaskStatus === 'loading'}
                onChange={onChangeTaskStatusHandler}
            />

            <EditableSpan title={props.task.title} onClick={changeTaskTitleHandler} disabled={props.task.entityTaskStatus === 'loading'} />
            <IconButton aria-label="delete"
                disabled={props.task.entityTaskStatus === 'loading'}
                onClick={onClickHandler}>
                <BackspaceIcon />
            </IconButton>
        </li>
    )
})
