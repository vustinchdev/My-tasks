import { FC, memo, useCallback, useEffect } from "react"
import { FilterValuesType } from "../../../app/App"
import { AddItemForm } from "../../../components/AddItemForm/AddItemForm"
import { EditableSpan } from "../../../components/EditableSpan/EditableSpan"
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { Task } from "./Task/Task";
import { ButtonWithMemo } from "../../../components/ButtonWithMemo";
import { TaskStatuses, TaskType } from "../../../api/todolist-api";
import { useAppDispatch } from "../../../app/store";
import { setTasksTC } from "../tasks-reducer";


type TodoLisPropsType = {
    title: string
    tasks: TaskType[]
    todolistId: string
    filter: FilterValuesType
    removeTask: (todolistId: string, taskId: string) => void
    changeFilter: (todolistId: string, value: FilterValuesType) => void
    addTask: (todolistId: string, title: string) => void
    changeTaskStatus: (todolistId: string, taskId: string, status: TaskStatuses) => void
    removeTodolist: (todolistId: string) => void
    changeTaskTitle: (todolistId: string, taskId: string, title: string) => void
    changeTodolistTitle: (todolistId: string, title: string) => void
}

export const TodoList: FC<TodoLisPropsType> = memo((props) => {

    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(setTasksTC(props.todolistId))
    }, [])

    const onAllClickHandler = useCallback(() => props.changeFilter(props.todolistId, 'all'), [props.changeFilter, props.todolistId])
    const onActiveClickHandler = useCallback(() => props.changeFilter(props.todolistId, 'active'), [props.changeFilter, props.todolistId])
    const onCompledClickHandler = useCallback(() => props.changeFilter(props.todolistId, 'completed'), [props.changeFilter, props.todolistId])


    const removeTodolist = () => {
        props.removeTodolist(props.todolistId)
    }

    const addTask = useCallback((newTitle: string) => {
        props.addTask(props.todolistId, newTitle)
    }, [props.addTask, props.todolistId])

    const changeTodolistTitle = useCallback((title: string) => {
        props.changeTodolistTitle(props.todolistId, title)
    }, [props.changeTodolistTitle, props.todolistId])

    let tasksForTodoList = props.tasks;
    if (props.filter === 'completed') {
        tasksForTodoList = props.tasks.filter(t => t.status === TaskStatuses.Completed)
    }
    if (props.filter === 'active') {
        tasksForTodoList = props.tasks.filter(t => t.status === TaskStatuses.New)
    }

    return (
        <div className="todolist">
            <h3>
                <EditableSpan title={props.title} onClick={changeTodolistTitle} />
                <IconButton aria-label="delete" onClick={removeTodolist}>
                    <DeleteIcon />
                </IconButton>
            </h3>
            <AddItemForm onClick={addTask} />
            <ul>
                {tasksForTodoList.map(t => {
                    return <Task
                        key={t.id}
                        task={t}
                        todolistId={props.todolistId}
                        removeTask={props.removeTask}
                        changeTaskTitle={props.changeTaskTitle}
                        changeTaskStatus={props.changeTaskStatus}
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