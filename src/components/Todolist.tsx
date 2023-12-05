import { FC, memo, useCallback } from "react"
import { FilterValuesType } from "../App"
import { AddItemForm } from "./AddItemForm/AddItemForm"
import { EditableSpan } from "./EditableSpan"
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { Task } from "./Task";
import { ButtonWithMemo } from "./ButtonWithMemo";


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

export const TodoList: FC<TodoLisPropsType> = memo((props) => {

    const onAllClickHandler = useCallback(() => props.changeFilter(props.todolistId, 'all'), [props.changeFilter, props.todolistId])
    const onActiveClickHandler = useCallback(() => props.changeFilter(props.todolistId, 'active'), [props.changeFilter, props.todolistId])
    const onCompledClickHandler = useCallback(() => props.changeFilter(props.todolistId, 'completed'), [props.changeFilter, props.todolistId])


    const removeTodolistHandler = () => {
        props.removeTodolist(props.todolistId)
    }

    const addTaskHandler = useCallback((newTitle: string) => {
        props.addTask(props.todolistId, newTitle)
    }, [props.addTask, props.todolistId])

    const changeTodolistTitleHandler = useCallback((title: string) => {
        props.changeTodolistTitle(props.todolistId, title)
    }, [props.changeTodolistTitle, props.todolistId])

    let tasksForTodoList = props.tasks;
    if (props.filter === 'completed') {
        tasksForTodoList = props.tasks.filter(t => t.isDone)
    }
    if (props.filter === 'active') {
        tasksForTodoList = props.tasks.filter(t => !t.isDone)
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
                {tasksForTodoList.map(t => {
                    return <Task
                        key={t.id}
                        task={t}
                        todolistId={props.todolistId}
                    />
                })}
            </ul>
            <ButtonWithMemo
                variant={props.filter === 'all' ? 'outlined' : 'contained'}
                color="success"
                onClick={onAllClickHandler}
                title="All"
            />
            <ButtonWithMemo
                variant={props.filter === 'active' ? 'outlined' : 'contained'}
                color="primary"
                onClick={onActiveClickHandler}
                title="Active"
            />
            <ButtonWithMemo
                variant={props.filter === 'completed' ? 'outlined' : 'contained'}
                color="error"
                onClick={onCompledClickHandler}
                title="Completed"
            />

        </div>
    )
})