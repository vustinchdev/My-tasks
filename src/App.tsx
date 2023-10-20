import React, { useState } from 'react';
import './App.css';
import { TaskType, TodoList } from './components/Todolist';
import { v1 } from 'uuid';

export type FilterValuesType = 'all' | 'completed' | 'active'

type TodolistsType = {
  id: string
  title: string
  filter: FilterValuesType
}

function App() {

  let [todolists, setTodolists] = useState<TodolistsType[]>(
    [
      { id: v1(), title: 'What to learn', filter: 'all' },
      { id: v1(), title: 'What to buy', filter: 'all' },
    ]
  )

  const [tasks, setTasks] = useState<TaskType[]>([
    { id: v1(), isDone: true, title: 'HTML&CSS' },
    { id: v1(), isDone: true, title: 'JS' },
    { id: v1(), isDone: false, title: 'React' },
    { id: v1(), isDone: true, title: 'Redux' }
  ])

  const removeTask = (id: string) => {
    const filteredTasks = tasks.filter(t => t.id !== id)
    setTasks(filteredTasks)
  }

  const changeFilter = (todolistId: string, value: FilterValuesType) => {
    setTodolists(todolists.map(tl => tl.id === todolistId ? { ...tl, filter: value } : tl))
  }

  const addTask = (newTaskTitle: string) => {
    const newTask = {
      id: v1(),
      isDone: false,
      title: newTaskTitle
    }
    setTasks([newTask, ...tasks])
  }

  const changeTaskStatus = (taskId: string, newIsDone: boolean) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, isDone: newIsDone } : t))
  }

  return (
    <div className="App">

      {todolists.map(tl => {

        let tasksForTodoList = tasks;
        if (tl.filter === 'completed') {
          tasksForTodoList = tasks.filter(t => t.isDone)
        }
        if (tl.filter === 'active') {
          tasksForTodoList = tasks.filter(t => !t.isDone)
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
            filter={tl.filter}
          />
        )
      })}

    </div>
  );
}

export default App;
