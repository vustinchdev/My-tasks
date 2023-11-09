import { ChangeEvent, FC, KeyboardEvent, useState } from "react"
import { FilterValuesType } from "../App"
import { AddItemForm } from "./AddItemForm"
import { EditableSpan } from "./EditableSpan"
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import BackspaceIcon from '@mui/icons-material/Backspace';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';

type TodoLisPropsType = {
    title: string
    tasks: Array<TaskType>
    todolistId: string
    filter: FilterValuesType
    removeTask: (todolistId: string, taskId: string) => void
    changeFilter: (todolistId: string, value: FilterValuesType) => void
    addTask: (todolistId: string, title: string) => void
    changeTaskStatus: (todolistId: string, taskId: string, isDone: boolean) => void
    removeTodolist: (todolistId: string) => void
    changeTaskTitle: (todolistId: string, taskId: string, title: string) => void
    changeTodolistTitle: (todolistId: string, title: string) => void
}

export type TaskType = {
    id: string
    title: string
    isDone: boolean
}

export const TodoList: FC<TodoLisPropsType> = (props) => {

    const onAllClickHandler = () => {
        props.changeFilter(props.todolistId, 'all')
    }

    const onActiveClickHandler = () => {
        props.changeFilter(props.todolistId, 'active')
    }

    const onCompledClickHandler = () => {
        props.changeFilter(props.todolistId, 'completed')
    }

    const removeTodolistHandler = () => {
        props.removeTodolist(props.todolistId)
    }

    const addTaskHandler = (newTitle: string) => {
        props.addTask(props.todolistId, newTitle)
    }

    const changeTodolistTitleHandler = (title: string) => {
        props.changeTodolistTitle(props.todolistId, title)
    }

    return (
        <div className="todolist">
            <h3>
                <EditableSpan title={props.title} onClick={changeTodolistTitleHandler} />
                <IconButton aria-label="delete" onClick={removeTodolistHandler}>
                    <DeleteIcon />
                </IconButton>
            </h3>
            <AddItemForm onClick={addTaskHandler} />
            <ul>
                {props.tasks.map(t => {

                    const onChangeTaskStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
                        props.changeTaskStatus(props.todolistId, t.id, e.currentTarget.checked)
                    }

                    const updateTaskHandler = (title: string) => {
                        props.changeTaskTitle(props.todolistId, t.id, title)
                    }

                    return (
                        <li key={t.id} className={t.isDone ? 'is-done' : ''}>
                            <Checkbox
                                style={t.isDone ? { color: '#d32f2f' } : { color: '#1976d2' }}
                                checked={t.isDone}
                                onChange={onChangeTaskStatusHandler}
                            />

                            <EditableSpan title={t.title} onClick={updateTaskHandler} />
                            <IconButton aria-label="delete"
                                onClick={() => props.removeTask(props.todolistId, t.id)}>
                                <BackspaceIcon />
                            </IconButton>
                        </li>
                    )
                })}
            </ul>
            <Button
                variant={props.filter === 'all' ? 'outlined' : 'contained'}
                color="success"
                onClick={onAllClickHandler}
            >All</Button>
            <Button
                variant={props.filter === 'active' ? 'outlined' : 'contained'}
                color="primary"
                onClick={onActiveClickHandler}
            >Active</Button>
            <Button
                variant={props.filter === 'completed' ? 'outlined' : 'contained'}
                color="error"
                onClick={onCompledClickHandler}
            >Completed</Button>

        </div>
    )
}