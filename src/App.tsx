import React, { useState } from 'react';
import './App.css';
import { TaskType, TodoList } from './components/Todolist';

export type FilterValuesType = 'all' | 'completed' | 'active'

function App() {

  const [tasks, setTasks] = useState<Array<TaskType>>([
    { id: 1, isDone: true, title: 'HTML&CSS' },
    { id: 2, isDone: true, title: 'JS' },
    { id: 3, isDone: false, title: 'React' },
    { id: 4, isDone: true, title: 'Redux' }
  ])

  const [filter, setFilter] = useState<FilterValuesType>('all')


  const removeTask = (id: number) => {
    const filteredTasks = tasks.filter(t => t.id !== id)
    setTasks(filteredTasks)
  }

  const changeFilter = (value: FilterValuesType) => {
    setFilter(value)
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
      />
    </div>
  );
}

export default App;
