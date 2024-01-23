import "./App.css"
import Container from "@mui/material/Container"
import { TodolistsList } from "../features/TodolistsList/TodolistsList"
import { Routes, Route, Navigate } from "react-router-dom"
import { Login } from "../features/auth/Login"
import { useEffect } from "react"
import CircularProgress from "@mui/material/CircularProgress"
import { selectIsInitialized } from "./app.selectors"
import { ErrorSnackbar, ButtonAppBar } from "common/components"
import { useAppDispatch, useAppSelector } from "common/hooks"
import { authThunks } from "features/auth/authSlice"

type PropsType = {
  demo?: boolean
}

function App({ demo = false }: PropsType) {
  const dispatch = useAppDispatch()
  const isInitialized = useAppSelector(selectIsInitialized)

  useEffect(() => {
    dispatch(authThunks.initializeApp())
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
