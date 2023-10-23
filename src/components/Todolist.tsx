import { ChangeEvent, FC, KeyboardEvent, useState } from "react"
import { FilterValuesType } from "../App"

type TodoLisPropsType = {
    title: string
    tasks: Array<TaskType>
    todolistId: string
    filter: FilterValuesType
    removeTask: (todolistId: string, taskId: string) => void
    changeFilter: (todolistId: string, value: FilterValuesType) => void
    addTask: (todolistId: string, newTaskTitle: string) => void
    changeTaskStatus: (todolistId: string, taskId: string, isDone: boolean) => void
}

export type TaskType = {
    id: string
    isDone: boolean
    title: string
}

export const TodoList: FC<TodoLisPropsType> = (props) => {

    const [newTaskTitle, setNewTaskTitle] = useState('')
    const [error, setError] = useState<string | null>(null)

    const onNewTitleChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setNewTaskTitle(e.currentTarget.value)
    }

    const onKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        setError(null)
        if (e.key === 'Enter') {
            addTask()
        }
    }

    const addTask = () => {
        if (newTaskTitle.trim() !== '') {
            props.addTask(props.todolistId, newTaskTitle.trim())
            setNewTaskTitle('')
        } else {
            setError('Title is required')
        }
    }

    const onAllClickHandler = () => {
        props.changeFilter(props.todolistId, 'all')
    }

    const onActiveClickHandler = () => {
        props.changeFilter(props.todolistId, 'active')
    }

    const onCompledClickHandler = () => {
        props.changeFilter(props.todolistId, 'completed')
    }

    return (
        <div className="todolist">
            <h3>{props.title}</h3>
            <div>
                <input
                    value={newTaskTitle}
                    onChange={onNewTitleChangeHandler}
                    onKeyDown={onKeyDownHandler}
                    className={error ? 'error' : ''}
                />
                <button onClick={addTask}>+</button>
                {error && <div className="error-message">{error}</div>}
            </div>
            <ul>
                {props.tasks.map(t => {

                    const onChangeTaskStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
                        props.changeTaskStatus(props.todolistId, t.id, e.currentTarget.checked)
                    }

                    return (
                        <li key={t.id} className={t.isDone ? 'is-done' : ''}>
                            <input
                                type="checkbox"
                                checked={t.isDone}
                                onChange={onChangeTaskStatusHandler}
                            />
                            <span>{t.title}</span>
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