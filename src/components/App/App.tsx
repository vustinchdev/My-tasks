import './../../App.css';
import { TodoList } from '../Todolist';
import { AddItemForm } from '../AddItemForm/AddItemForm';
import ButtonAppBar from '../ButtonAppBar';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { TodolistDomainType, addTodolistTC, changeTodolistFilterAC, changeTodolistTitleTC, removeTodolistTC, setTodolistsTC } from '../../state/todolists-reducer';
import { addTaskTC, removeTaskTC, updateTaskTC } from '../../state/tasks-reducer';
import { AppRootStateType, useAppDispatch } from '../../state/store';
import { useSelector } from 'react-redux';
import { useCallback, useEffect } from 'react';
import { TaskStatuses, TaskType } from '../../api/todolist-api';


export type FilterValuesType = 'all' | 'completed' | 'active'

export type TasksStateType = {
  [key: string]: TaskType[]
}

function App() {

  const todolists = useSelector<AppRootStateType, TodolistDomainType[]>(state => state.todolists)
  const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(setTodolistsTC())
  }, [])

  const removeTask = useCallback((todolistId: string, taskId: string) => {
    dispatch(removeTaskTC(todolistId, taskId))
  }, [dispatch])

  const addTask = useCallback((todolistId: string, title: string) => {
    dispatch(addTaskTC(todolistId, title))
  }, [dispatch])

  const changeTaskTitle = useCallback((todolistId: string, taskId: string, title: string) => {
    dispatch(updateTaskTC(todolistId, taskId, { title }))
  }, [dispatch])

  const changeTaskStatus = useCallback((todolistId: string, taskId: string, status: TaskStatuses) => {
    dispatch(updateTaskTC(todolistId, taskId, { status }))
  }, [dispatch])

  const changeFilter = useCallback((todolistId: string, value: FilterValuesType) => {
    dispatch(changeTodolistFilterAC(todolistId, value))
  }, [dispatch])

  const removeTodolist = useCallback((todolistId: string) => {
    dispatch(removeTodolistTC(todolistId))
  }, [dispatch])

  const changeTodolistTitle = useCallback((todolistId: string, title: string) => {
    dispatch(changeTodolistTitleTC(todolistId, title))
  }, [dispatch])

  const addTodolist = useCallback((title: string) => {
    dispatch(addTodolistTC(title))
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
