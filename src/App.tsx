import React from 'react';
import './App.css';
import { TaskType, TodoList } from './components/Todolist';

function App() {

  const tasks_1: Array<TaskType> = [
    { id: 1, isDone: true, title: 'HTML&CSS' },
    { id: 2, isDone: true, title: 'JS' },
    { id: 3, isDone: false, title: 'React' },
    { id: 4, isDone: true, title: 'Redux' }
  ]

  const tasks_2: Array<TaskType> = [
    { id: 5, title: "Bread", isDone: true },
    { id: 6, title: "Chocolate", isDone: false },
    { id: 7, title: "Tea", isDone: true },
    { id: 8, title: "Coffee", isDone: false }
  ]

  return (
    <div className="App">
      <TodoList
        title='What to learn'
        tasks={tasks_1}
      />
      <TodoList
        title='What to buy'
        tasks={tasks_2}
      />
    </div>
  );
}

export default App;
