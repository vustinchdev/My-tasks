import './App.css';
import { TaskType, TodoList } from './components/Todolist';
import { AddItemForm } from './components/AddItemForm/AddItemForm';
import ButtonAppBar from './components/ButtonAppBar';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { addTodolistAC, changeTodolistFilterAC, changeTodolistTitleAC, removeTodolistAC } from './state/todolists-reducer';
import { addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC } from './state/tasks-reducer';
import { AppRootStateType } from './state/store';
import { useDispatch, useSelector } from 'react-redux'
import { useCallback } from 'react';


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

  const todolists = useSelector<AppRootStateType, TodolistType[]>(state => state.todolists)
  const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)
  const dispatch = useDispatch()

  const removeTask = useCallback((todolistId: string, taskId: string) => {
    dispatch(removeTaskAC(todolistId, taskId))
  }, [dispatch])

  const addTask = useCallback((todolistId: string, title: string) => {
    dispatch(addTaskAC(todolistId, title))
  }, [dispatch])

  const changeTaskTitle = useCallback((todolistId: string, taskId: string, title: string) => {
    dispatch(changeTaskTitleAC(todolistId, taskId, title))
  }, [dispatch])

  const changeTaskStatus = useCallback((todolistId: string, taskId: string, isDone: boolean) => {
    dispatch(changeTaskStatusAC(todolistId, taskId, isDone))
  }, [dispatch])

  const changeFilter = useCallback((todolistId: string, value: FilterValuesType) => {
    dispatch(changeTodolistFilterAC(todolistId, value))
  }, [dispatch])

  const removeTodolist = useCallback((todolistId: string) => {
    dispatch(removeTodolistAC(todolistId))
  }, [dispatch])

  const changeTodolistTitle = useCallback((todolistId: string, title: string) => {
    dispatch(changeTodolistTitleAC(todolistId, title))
  }, [dispatch])

  const addTodolist = useCallback((title: string) => {
    dispatch(addTodolistAC(title))
  }, [dispatch])

  return (
    <div className="App">
      <ButtonAppBar />
      <Container>
        <Grid container style={{ margin: '20px' }}>
          <AddItemForm onClick={addTodolist} />
        </Grid>

        <Grid container spacing={3}>
          {todolists.map(tl => {

            return <Grid key={tl.id} item>
              <Paper elevation={3} style={{ padding: '15px' }}>
                <TodoList
                  key={tl.id}
                  todolistId={tl.id}
                  title={tl.title}
                  tasks={tasks[tl.id]}
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
