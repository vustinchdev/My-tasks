import './App.css';
import ButtonAppBar from '../components/ButtonAppBar';
import Container from '@mui/material/Container';
import { TodolistsList } from '../features/TodolistsList/TodolistsList';
import { ErrorSnackbar } from '../components/ErrorSnackbar/ErrorSnackbar';

type PropsType = {
  demo?: boolean
}

function App({ demo = false }: PropsType) {

  return (
    <div className="App">
      <ErrorSnackbar />
      <ButtonAppBar />
      <Container>
        <TodolistsList demo={demo} />
      </Container>
    </div>
  );
}

export default App;
