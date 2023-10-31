import { ChangeEvent, FC, KeyboardEvent, useState } from "react"
import { FilterValuesType } from "../App"
import { AddItemForm } from "./AddItemForm"
import { EditableSpan } from "./EditableSpan"

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
                <button onClick={removeTodolistHandler}>X</button>
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
                            <input
                                type="checkbox"
                                checked={t.isDone}
                                onChange={onChangeTaskStatusHandler}
                            />
                            <EditableSpan title={t.title} onClick={updateTaskHandler} />
                            <button onClick={() => props.removeTask(props.todolistId, t.id)}>x</button>
                        </li>
                    )
                })}
            </ul>
            <button className={props.filter === 'all' ? 'active-filter' : ''}
                onClick={onAllClickHandler}>
                All
            </button>
            <button className={props.filter === 'active' ? 'active-filter' : ''}
                onClick={onActiveClickHandler}>
                Active
            </button>
            <button className={props.filter === 'completed' ? 'active-filter' : ''}
                onClick={onCompledClickHandler}>
                Completed
            </button>
        </div>
    )
}