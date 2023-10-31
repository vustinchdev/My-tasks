import React, { useState } from 'react';
import './App.css';
import { TaskType, TodoList } from './components/Todolist';
import { v1 } from 'uuid';
import { AddItemForm } from './components/AddItemForm';

export type FilterValuesType = 'all' | 'completed' | 'active'

type TodolistType = {
  id: string
  title: string
  filter: FilterValuesType
}

type TasksStateType = {
  [key: string]: TaskType[]
}

function App() {

  let todolistID1 = v1()
  let todolistID2 = v1()

  let [todolists, setTodolists] = useState<TodolistType[]>([
    { id: todolistID1, title: 'What to learn', filter: 'all' },
    { id: todolistID2, title: 'What to buy', filter: 'all' },
  ])

  let [tasks, setTasks] = useState<TasksStateType>({
    [todolistID1]: [
      { id: v1(), title: 'HTML&CSS', isDone: true },
      { id: v1(), title: 'JS', isDone: true },
      { id: v1(), title: 'ReactJS', isDone: false },

    ],
    [todolistID2]: [
      { id: v1(), title: 'Rest API', isDone: true },
      { id: v1(), title: 'GraphQL', isDone: false },
    ]
  })


  const removeTask = (todolistId: string, taskId: string) => {
    setTasks({ ...tasks, [todolistId]: tasks[todolistId].filter(t => t.id !== taskId) })
  }

  const changeFilter = (todolistId: string, value: FilterValuesType) => {
    setTodolists(todolists.map(tl => tl.id === todolistId ? { ...tl, filter: value } : tl))
  }

  const addTask = (todolistId: string, title: string) => {
    const newTask = {
      id: v1(),
      isDone: false,
      title
    }
    setTasks({ ...tasks, [todolistId]: [newTask, ...tasks[todolistId]] })
  }

  const changeTaskStatus = (todolistId: string, taskId: string, isDone: boolean) => {
    setTasks({ ...tasks, [todolistId]: tasks[todolistId].map(t => t.id === taskId ? { ...t, isDone } : t) })
  }

  const removeTodolist = (todolistId: string) => {
    setTodolists(todolists.filter(tl => tl.id !== todolistId))
    delete tasks[todolistId]
  }

  const addTodolist = (title: string) => {
    const newId = v1()
    let newTodolist: TodolistType = {
      id: newId,
      title,
      filter: 'all'
    }
    setTodolists([...todolists, newTodolist])
    setTasks({ ...tasks, [newId]: [] })
  }

  const changeTaskTitle = (todolistId: string, taskId: string, title: string) => {
    setTasks({ ...tasks, [todolistId]: tasks[todolistId].map(t => t.id === taskId ? { ...t, title } : t) })
  }

  const changeTodolistTitle = (todolistId: string, title: string) => {
    setTodolists(todolists.map(t => t.id === todolistId ? { ...t, title } : t))
  }

  return (
    <div className="App">
      <AddItemForm onClick={addTodolist} />

      {todolists.map(tl => {

        let tasksForTodoList = tasks[tl.id];
        if (tl.filter === 'completed') {
          tasksForTodoList = tasks[tl.id].filter(t => t.isDone)
        }
        if (tl.filter === 'active') {
          tasksForTodoList = tasks[tl.id].filter(t => !t.isDone)
        }

        return (
          <TodoList
            key={tl.id}
            todolistId={tl.id}
            title={tl.title}
            tasks={tasksForTodoList}
            removeTask={removeTask}
            changeFilter={changeFilter}
            addTask={addTask}
            changeTaskStatus={changeTaskStatus}
            removeTodolist={removeTodolist}
            filter={tl.filter}
            changeTaskTitle={changeTaskTitle}
            changeTodolistTitle={changeTodolistTitle}
          />
        )
      })}

    </div>
  );
}

export default App;
