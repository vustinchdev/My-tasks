import "./App.css"
import ButtonAppBar from "../components/ButtonAppBar"
import Container from "@mui/material/Container"
import { TodolistsList } from "../features/TodolistsList/TodolistsList"
import { ErrorSnackbar } from "../components/ErrorSnackbar/ErrorSnackbar"
import { Routes, Route, Navigate } from "react-router-dom"
import { Login } from "../features/Login/Login"
import { useAppDispatch, useAppSelector } from "./store"
import { useEffect } from "react"
import { initializeAppTC } from "./appSlice"
import CircularProgress from "@mui/material/CircularProgress"

type PropsType = {
  demo?: boolean
}

function App({ demo = false }: PropsType) {
  const dispatch = useAppDispatch()
  const isInitialized = useAppSelector<boolean>((state) => state.app.isInitialized)

  useEffect(() => {
    dispatch(initializeAppTC())
  }, [])

  if (!isInitialized) {
    return (
      <div style={{ position: "fixed", top: "30%", textAlign: "center", width: "100%" }}>
        <CircularProgress />
      </div>
    )
  }

  return (
    <div className="App">
      <ErrorSnackbar />
      <ButtonAppBar />
      <Container>
        <Routes>
          <Route path="/" element={<TodolistsList demo={demo} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/404" element={<h1>404: PAGE NOT FOUND</h1>} />
          <Route path="*" element={<Navigate to={"/404"} />} />
        </Routes>
      </Container>
    </div>
  )
}

export default App
