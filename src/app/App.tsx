import "./App.css";
import Container from "@mui/material/Container"
import { TodolistsList } from "../features/TodolistsList/ui/TodolistsList"
import { Routes, Route, Navigate } from "react-router-dom"
import { Login } from "../features/auth/ui/Login"
import { useEffect } from "react"
import { selectIsInitialized } from "./appSelectors"
import { ErrorSnackbar, ButtonAppBar } from "common/components"
import { useAppDispatch, useAppSelector } from "common/hooks"
import { authThunks } from "features/auth/model/authSlice"
import { LoadingIndicator } from "common/components/LoadingIndicator/LoadingIndicator"

type Props = {
  demo?: boolean
}

function App({ demo = false }: Props) {
  const dispatch = useAppDispatch()
  const isInitialized = useAppSelector(selectIsInitialized)

  useEffect(() => {
    dispatch(authThunks.initializeApp())
  }, [])

  if (!isInitialized) {
    return <LoadingIndicator />
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
