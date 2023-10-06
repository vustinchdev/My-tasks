import React, { useState } from 'react';
import './App.css';
import { TaskType, TodoList } from './components/Todolist';
import { v1 } from 'uuid';

export type FilterValuesType = 'all' | 'completed' | 'active'

function App() {

  const [tasks, setTasks] = useState<Array<TaskType>>([
    { id: v1(), isDone: true, title: 'HTML&CSS' },
    { id: v1(), isDone: true, title: 'JS' },
    { id: v1(), isDone: false, title: 'React' },
    { id: v1(), isDone: true, title: 'Redux' }
  ])

  const [filter, setFilter] = useState<FilterValuesType>('all')


  const removeTask = (id: string) => {
    const filteredTasks = tasks.filter(t => t.id !== id)
    setTasks(filteredTasks)
  }

  const changeFilter = (value: FilterValuesType) => {
    setFilter(value)
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

  let tasksForTodoList = tasks;
  if (filter === 'completed') {
    tasksForTodoList = tasks.filter(t => t.isDone === true)
  }
  if (filter === 'active') {
    tasksForTodoList = tasks.filter(t => t.isDone === false)
  }

  return (
    <div className="App">
      <TodoList
        title='What to learn'
        tasks={tasksForTodoList}
        removeTask={removeTask}
        changeFilter={changeFilter}
        addTask={addTask}
        changeTaskStatus={changeTaskStatus}
      />
    </div>
  );
}

export default App;
