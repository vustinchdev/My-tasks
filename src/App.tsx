import React, { useReducer, useState } from 'react';
import './App.css';
import { TaskType, TodoList } from './components/Todolist';
import { v1 } from 'uuid';
import { AddItemForm } from './components/AddItemForm';
import ButtonAppBar from './components/ButtonAppBar';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { addTodolistAC, changeTodolistFilterAC, changeTodolistTitleAC, removeTodolistAC, todolistsReducer } from './state/todolists-reducer';
import { addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC, tasksReducer } from './state/tasks-reducer';

export type FilterValuesType = 'all' | 'completed' | 'active'

export type TodolistType = {
  id: string
  title: string
  filter: FilterValuesType
}

export type TasksStateType = {
  [key: string]: TaskType[]
}

function App() {

  let todolistID1 = v1()
  let todolistID2 = v1()

  let [todolists, dispatchToTodolists] = useReducer(todolistsReducer, [
    { id: todolistID1, title: 'What to learn', filter: 'all' },
    { id: todolistID2, title: 'What to buy', filter: 'all' },
  ])

  let [tasks, dispatchToTasks] = useReducer(tasksReducer, {
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
    dispatchToTasks(removeTaskAC(todolistId, taskId))
  }

  const addTask = (todolistId: string, title: string) => {
    dispatchToTasks(addTaskAC(todolistId, title))
  }

  const changeTaskTitle = (todolistId: string, taskId: string, title: string) => {
    dispatchToTasks(changeTaskTitleAC(todolistId, taskId, title))
  }

  const changeTaskStatus = (todolistId: string, taskId: string, isDone: boolean) => {
    dispatchToTasks(changeTaskStatusAC(todolistId, taskId, isDone))
  }

  const changeFilter = (todolistId: string, value: FilterValuesType) => {
    dispatchToTodolists(changeTodolistFilterAC(todolistId, value))
  }

  const removeTodolist = (todolistId: string) => {
    dispatchToTodolists(removeTodolistAC(todolistId))
  }

  const changeTodolistTitle = (todolistId: string, title: string) => {
    dispatchToTodolists(changeTodolistTitleAC(todolistId, title))
  }

  const addTodolist = (title: string) => {
    const action = addTodolistAC(title)
    dispatchToTasks(action)
    dispatchToTodolists(action)
  }

  return (
    <div className="App">
      <ButtonAppBar />
      <Container>
        <Grid container style={{ margin: '20px' }}>
          <AddItemForm onClick={addTodolist} />
        </Grid>

        <Grid container spacing={3}>
          {todolists.map(tl => {

            let tasksForTodoList = tasks[tl.id];
            if (tl.filter === 'completed') {
              tasksForTodoList = tasks[tl.id].filter(t => t.isDone)
            }
            if (tl.filter === 'active') {
              tasksForTodoList = tasks[tl.id].filter(t => !t.isDone)
            }

            return <Grid item>
              <Paper elevation={3} style={{ padding: '15px' }}>
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
              </Paper>
            </Grid>
          })}
        </Grid>

      </Container>
    </div>
  );
}

export default App;
