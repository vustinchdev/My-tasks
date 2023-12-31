import './App.css';
import ButtonAppBar from '../components/ButtonAppBar';
import Container from '@mui/material/Container';
import { TaskType } from '../api/todolist-api';
import { TodolistsList } from '../features/TodolistsList/TodolistsList';

export type FilterValuesType = 'all' | 'completed' | 'active'

export type TasksStateType = {
  [key: string]: TaskType[]
}

function App() {


  return (
    <div className="App">
      <ButtonAppBar />
      <Container>
        <TodolistsList />
      </Container>
    </div>
  );
}

export default App;
