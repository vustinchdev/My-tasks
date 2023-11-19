import './App.css';
import { TaskType, TodoList } from './components/Todolist';
import { AddItemForm } from './components/AddItemForm';
import ButtonAppBar from './components/ButtonAppBar';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { addTodolistAC, changeTodolistFilterAC, changeTodolistTitleAC, removeTodolistAC } from './state/todolists-reducer';
import { addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC } from './state/tasks-reducer';
import { AppRootStateType } from './state/store';
import { useDispatch, useSelector } from 'react-redux'


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

  const removeTask = (todolistId: string, taskId: string) => {
    dispatch(removeTaskAC(todolistId, taskId))
  }

  const addTask = (todolistId: string, title: string) => {
    dispatch(addTaskAC(todolistId, title))
  }

  const changeTaskTitle = (todolistId: string, taskId: string, title: string) => {
    dispatch(changeTaskTitleAC(todolistId, taskId, title))
  }

  const changeTaskStatus = (todolistId: string, taskId: string, isDone: boolean) => {
    dispatch(changeTaskStatusAC(todolistId, taskId, isDone))
  }

  const changeFilter = (todolistId: string, value: FilterValuesType) => {
    dispatch(changeTodolistFilterAC(todolistId, value))
  }

  const removeTodolist = (todolistId: string) => {
    dispatch(removeTodolistAC(todolistId))
  }

  const changeTodolistTitle = (todolistId: string, title: string) => {
    dispatch(changeTodolistTitleAC(todolistId, title))
  }

  const addTodolist = (title: string) => {
    dispatch(addTodolistAC(title))
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
